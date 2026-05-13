const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key && !(key in process.env)) process.env[key] = value;
  }
}

const { PrismaClient } = require("@prisma/client");
const { chromium, devices } = require("playwright");

const siteUrl = "https://libertydigital.vercel.app";
const timestamp = Date.now();
const qaName = `QA Live Flow ${timestamp}`;
const qaEmail = `qa-live-${timestamp}@example.com`;
const qaAdminEmail = `qa-admin-${timestamp}@example.com`;
const qaAdminPassword = `QaAdmin!${timestamp}Pass`;

async function main() {
  const prisma = new PrismaClient();
  let qaAdminId = null;
  let qaLeadId = null;

  async function adminFetch(pathname, init = {}) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}${pathname}`,
      {
        ...init,
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          ...(init.headers || {}),
        },
      },
    );

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(
        `Supabase admin API ${pathname} failed: ${
          data?.msg || data?.message || response.status
        }`,
      );
    }

    return data;
  }

  try {
    const createdUser = await adminFetch("/auth/v1/admin/users", {
      method: "POST",
      body: JSON.stringify({
        email: qaAdminEmail,
        password: qaAdminPassword,
        email_confirm: true,
      }),
    });

    qaAdminId = createdUser.id ?? null;

    const browser = await chromium.launch({ headless: true });

    const auditResults = [];
    for (const route of [
      "/",
      "/services",
      "/services/court-e-affidavit",
      "/contact",
      "/login",
    ]) {
      const context = await browser.newContext({
        ...devices["iPhone 13"],
      });
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });
      page.on("pageerror", (err) => pageErrors.push(err.message));

      const response = await page.goto(`${siteUrl}${route}`, {
        waitUntil: "networkidle",
      });
      const contentLength = await page.evaluate(
        () => document.body?.innerText?.trim().length ?? 0,
      );
      auditResults.push({
        route,
        status: response?.status() ?? null,
        title: await page.title(),
        contentLength,
        consoleErrors,
        pageErrors,
      });

      await context.close();
    }

    const submitContext = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });
    const submitPage = await submitContext.newPage();
    const submitConsoleErrors = [];
    const submitPageErrors = [];
    submitPage.on("console", (msg) => {
      if (msg.type() === "error") submitConsoleErrors.push(msg.text());
    });
    submitPage.on("pageerror", (err) => submitPageErrors.push(err.message));

    await submitPage.goto(`${siteUrl}/services/court-e-affidavit`, {
      waitUntil: "networkidle",
    });

    await submitPage.getByLabel("Full name").fill(qaName);
    await submitPage.getByLabel("Email").fill(qaEmail);
    await submitPage.getByLabel("Phone").fill("+393533903464");
    await submitPage
      .getByLabel("Affidavit purpose")
      .fill("QA live submission verification");
    await submitPage.getByLabel("Jurisdiction or state").fill("Lagos State");
    await submitPage.getByLabel("Name of deponent").fill(qaName);
    await submitPage
      .getByLabel("Do you think legal review may be needed?")
      .selectOption("No");
    await submitPage
      .getByLabel("Do you have supporting documents?")
      .selectOption("Yes");
    await submitPage
      .getByLabel("Message")
      .fill("QA test submission. Please ignore.");
    await submitPage
      .getByText(
        "I agree that Liberty Digital Consulting Services may contact me about this service request using the details I provided.",
      )
      .click();
    await submitPage.getByRole("button", { name: "Request Affidavit Support" }).click();
    await submitPage.waitForSelector("text=Your request has been received.", {
      timeout: 30000,
    });

    const dbLead = await prisma.lead.findFirst({
      where: { email: qaEmail },
      orderBy: { createdAt: "desc" },
    });

    if (!dbLead) {
      throw new Error("Lead was not found in database after submission.");
    }

    qaLeadId = dbLead.id;

    const adminContext = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
    });
    const adminPage = await adminContext.newPage();
    const adminConsoleErrors = [];
    const adminPageErrors = [];
    adminPage.on("console", (msg) => {
      if (msg.type() === "error") adminConsoleErrors.push(msg.text());
    });
    adminPage.on("pageerror", (err) => adminPageErrors.push(err.message));

    await adminPage.goto(`${siteUrl}/login`, { waitUntil: "networkidle" });
    await adminPage.getByLabel("Email").fill(qaAdminEmail);
    await adminPage.getByLabel("Password").fill(qaAdminPassword);
    await adminPage.getByRole("button", { name: "Sign in" }).click();
    await adminPage.waitForURL(`${siteUrl}/admin`, { timeout: 30000 });
    await adminPage.goto(
      `${siteUrl}/admin/leads?search=${encodeURIComponent(qaEmail)}`,
      { waitUntil: "networkidle" },
    );
    const searchPageText = await adminPage.locator("body").innerText();
    await adminPage.goto(`${siteUrl}/admin/leads/${dbLead.id}`, {
      waitUntil: "networkidle",
    });
    const leadDetailVisible = await adminPage.getByText(qaName).first().isVisible();

    const report = {
      auditResults,
      submission: {
        successMessageSeen: true,
        consoleErrors: submitConsoleErrors,
        pageErrors: submitPageErrors,
        leadId: dbLead.id,
        serviceName: dbLead.serviceName,
        createdAt: dbLead.createdAt,
      },
      admin: {
        loginWorked: true,
        searchPageIncludesLead: searchPageText.includes(qaName),
        leadDetailVisible,
        consoleErrors: adminConsoleErrors,
        pageErrors: adminPageErrors,
      },
    };

    console.log(JSON.stringify(report, null, 2));

    await adminContext.close();
    await submitContext.close();
    await browser.close();
  } finally {
    if (qaLeadId) {
      await prisma.lead.delete({ where: { id: qaLeadId } }).catch(() => {});
    }
    if (qaAdminId) {
      await adminFetch(`/auth/v1/admin/users/${qaAdminId}`, {
        method: "DELETE",
      }).catch(() => {});
    }
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
