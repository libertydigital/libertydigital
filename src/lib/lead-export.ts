import "server-only";

import type { Lead } from "@prisma/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { BUSINESS_DETAILS, getServiceBySlug, type ServiceSlug } from "@/lib/services";
import {
  type FamilyMemberEntry,
  type StoredUploadFile,
  formatDate,
  formatDateTime,
  isFamilyMemberEntryArray,
  isStoredUploadFileArray,
  toTitleCase,
} from "@/lib/utils";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const PAGE_MARGIN = 48;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;
const NAVY = rgb(17 / 255, 32 / 255, 49 / 255);
const GOLD = rgb(179 / 255, 135 / 255, 64 / 255);
const SOFT = rgb(89 / 255, 102 / 255, 119 / 255);
const LINE = rgb(220 / 255, 229 / 255, 237 / 255);

const EMBASSY_STYLE_SLUGS = new Set<ServiceSlug>([
  "nulla-osta-for-marriage",
  "document-legalization-at-nigerian-embassy",
  "certificate-of-nationality",
  "citizenship-letter-to-questura",
  "same-person-letter",
  "family-income-document",
  "letter-of-single",
  "child-recognition-of-the-father-or-mother",
]);

type HeaderConfig =
  | {
      type: "embassy";
      imagePath: string;
    }
  | {
      type: "liberty";
      title: string;
      subtitle: string[];
      logoPath: string;
    };

function getHeaderConfig(serviceSlug: ServiceSlug): HeaderConfig {
  if (EMBASSY_STYLE_SLUGS.has(serviceSlug)) {
    return {
      type: "embassy",
      imagePath: path.join(
        process.cwd(),
        "public",
        "nigeria-coat-of-arms.png",
      ),
    };
  }

  return {
    type: "liberty",
    title: BUSINESS_DETAILS.name.toUpperCase(),
    subtitle: [BUSINESS_DETAILS.address],
    logoPath: path.join(process.cwd(), "public", "liberty-logo-light.png"),
  };
}

function getReadableFieldLabel(key: string, configuredLabel?: string) {
  if (configuredLabel) {
    return configuredLabel;
  }

  return toTitleCase(
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2"),
  );
}

function formatFamilyMembers(value: FamilyMemberEntry[]) {
  return value.map((member, index) => {
    return `${index + 1}. ${member.memberFullName} | ${member.relationship} | ${formatDate(
      member.dateOfBirth,
    )} | ${member.occupation}`;
  });
}

function splitTextIntoLines(
  text: string,
  maxWidth: number,
  fontSize: number,
  font: Awaited<ReturnType<typeof PDFDocument.create>> extends never
    ? never
    : { widthOfTextAtSize(text: string, size: number): number },
) {
  const paragraphs = text.split("\n");
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      lines.push("");
      continue;
    }

    const words = paragraph.split(/\s+/);
    let currentLine = "";

    for (const word of words) {
      const candidate = currentLine ? `${currentLine} ${word}` : word;

      if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
        currentLine = candidate;
        continue;
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      currentLine = word;
    }

    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}

function dataUrlToBytes(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);

  if (!match) {
    throw new Error("Invalid upload data URL.");
  }

  const [, mimeType, base64] = match;
  return {
    mimeType,
    bytes: Uint8Array.from(Buffer.from(base64, "base64")),
  };
}

async function embedUploadImage(pdfDoc: PDFDocument, file: StoredUploadFile) {
  const { mimeType, bytes } = dataUrlToBytes(file.dataUrl);

  if (mimeType === "image/png") {
    return pdfDoc.embedPng(bytes);
  }

  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    return pdfDoc.embedJpg(bytes);
  }

  throw new Error(`Unsupported image type: ${mimeType}`);
}

function getStoredUploadDisplayName(file: StoredUploadFile) {
  return file.originalName ?? file.name;
}

function buildLeadDownloadFilename(lead: Lead) {
  const safeName = lead.fullName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${lead.serviceSlug}-${safeName || "lead"}-${lead.id}.pdf`;
}

export async function buildLeadDownloadDocument(lead: Lead) {
  const pdfDoc = await PDFDocument.create();
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const service = getServiceBySlug(lead.serviceSlug);
  const resolvedServiceSlug = (service?.slug ??
    "nigeria-passport-online-registration") as ServiceSlug;
  const fieldMap = new Map(
    service?.formFields.map((field) => [field.name, field]) ?? [],
  );

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let cursorY = PAGE_HEIGHT - PAGE_MARGIN;
  const headerConfig = getHeaderConfig(resolvedServiceSlug);

  const ensureSpace = (heightNeeded: number) => {
    if (cursorY - heightNeeded < PAGE_MARGIN) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      cursorY = PAGE_HEIGHT - PAGE_MARGIN;
    }
  };

  const drawSectionKicker = (text: string) => {
    ensureSpace(24);
    page.drawText(text.toUpperCase(), {
      x: PAGE_MARGIN,
      y: cursorY,
      size: 10,
      font: titleFont,
      color: GOLD,
    });
    cursorY -= 18;
  };

  const drawParagraph = (text: string, size = 11, color = SOFT) => {
    const lines = splitTextIntoLines(text, CONTENT_WIDTH, size, bodyFont);
    const lineHeight = size * 1.55;
    ensureSpace(lines.length * lineHeight + 8);

    for (const line of lines) {
      page.drawText(line, {
        x: PAGE_MARGIN,
        y: cursorY,
        size,
        font: bodyFont,
        color,
      });
      cursorY -= lineHeight;
    }

    cursorY -= 6;
  };

  const drawFieldGrid = (
    items: Array<{ label: string; value: string; fullWidth?: boolean }>,
  ) => {
    const columnGap = 16;
    const columnWidth = (CONTENT_WIDTH - columnGap) / 2;
    let pendingHalfWidth: Array<{ label: string; value: string }> = [];

    const drawFieldCard = (
      item: { label: string; value: string },
      x: number,
      width: number,
    ) => {
      const labelLines = splitTextIntoLines(item.label, width - 24, 9, titleFont);
      const valueLines = splitTextIntoLines(item.value, width - 24, 10.5, bodyFont);
      const lineHeight = 15;
      const cardHeight =
        18 +
        labelLines.length * 11 +
        Math.max(valueLines.length, 1) * lineHeight +
        16;

      ensureSpace(cardHeight + 8);

      page.drawRectangle({
        x,
        y: cursorY - cardHeight,
        width,
        height: cardHeight,
        borderColor: LINE,
        borderWidth: 1,
        color: rgb(1, 1, 1),
      });

      let textY = cursorY - 16;

      labelLines.forEach((line) => {
        page.drawText(line.toUpperCase(), {
          x: x + 12,
          y: textY,
          size: 9,
          font: titleFont,
          color: GOLD,
        });
        textY -= 11;
      });

      textY -= 4;

      valueLines.forEach((line) => {
        page.drawText(line, {
          x: x + 12,
          y: textY,
          size: 10.5,
          font: bodyFont,
          color: NAVY,
        });
        textY -= lineHeight;
      });

      return cardHeight;
    };

    const flushHalfWidthRow = () => {
      if (pendingHalfWidth.length === 0) return;

      const itemsInRow = pendingHalfWidth.slice(0, 2);
      const heights = itemsInRow.map((item, index) =>
        drawFieldCard(
          item,
          PAGE_MARGIN + index * (columnWidth + columnGap),
          columnWidth,
        ),
      );

      cursorY -= Math.max(...heights) + 10;
      pendingHalfWidth = [];
    };

    items.forEach((item) => {
      if (item.fullWidth) {
        flushHalfWidthRow();
        const height = drawFieldCard(item, PAGE_MARGIN, CONTENT_WIDTH);
        cursorY -= height + 10;
        return;
      }

      pendingHalfWidth.push({ label: item.label, value: item.value });

      if (pendingHalfWidth.length === 2) {
        flushHalfWidthRow();
      }
    });

    flushHalfWidthRow();
  };

  const drawDivider = () => {
    ensureSpace(12);
    page.drawLine({
      start: { x: PAGE_MARGIN, y: cursorY },
      end: { x: PAGE_WIDTH - PAGE_MARGIN, y: cursorY },
      thickness: 1,
      color: LINE,
    });
    cursorY -= 18;
  };

  if (headerConfig.type === "liberty") {
    try {
      const logoBytes = await readFile(headerConfig.logoPath);
      const logoImage = await pdfDoc.embedPng(logoBytes);
      const scale = Math.min(120 / logoImage.width, 48 / logoImage.height, 1);
      page.drawImage(logoImage, {
        x: PAGE_MARGIN,
        y: cursorY - logoImage.height * scale + 8,
        width: logoImage.width * scale,
        height: logoImage.height * scale,
      });
    } catch {
      // If the logo cannot be loaded, continue with text-only header.
    }

    page.drawText(headerConfig.title, {
      x: PAGE_MARGIN + 132,
      y: cursorY,
      size: 18,
      font: titleFont,
      color: NAVY,
    });
    cursorY -= 22;

    headerConfig.subtitle.forEach((line) => {
      page.drawText(line, {
        x: PAGE_MARGIN + 132,
        y: cursorY,
        size: 11,
        font: bodyFont,
        color: SOFT,
      });
      cursorY -= 16;
    });
  } else {
    try {
      const embassyHeaderBytes = await readFile(headerConfig.imagePath);
      const embassyHeaderImage = await pdfDoc.embedPng(embassyHeaderBytes);
      const scale = Math.min(90 / embassyHeaderImage.width, 72 / embassyHeaderImage.height, 1);
      const drawWidth = embassyHeaderImage.width * scale;
      const drawHeight = embassyHeaderImage.height * scale;

      page.drawImage(embassyHeaderImage, {
        x: (PAGE_WIDTH - drawWidth) / 2,
        y: cursorY - drawHeight + 8,
        width: drawWidth,
        height: drawHeight,
      });

      cursorY -= drawHeight + 6;

      const title = "EMBASSY OF NIGERIA";
      const titleWidth = titleFont.widthOfTextAtSize(title, 20);
      page.drawText(title, {
        x: (PAGE_WIDTH - titleWidth) / 2,
        y: cursorY,
        size: 20,
        font: titleFont,
        color: rgb(39 / 255, 97 / 255, 50 / 255),
      });
      cursorY -= 24;

      const subtitleLines = ["VIA ORAZIO, 14/18", "00193 Rome - Italy"];
      subtitleLines.forEach((line) => {
        const width = titleFont.widthOfTextAtSize(line, 12);
        page.drawText(line, {
          x: (PAGE_WIDTH - width) / 2,
          y: cursorY,
          size: 12,
          font: titleFont,
          color: NAVY,
        });
        cursorY -= 16;
      });
    } catch {
      page.drawText("EMBASSY OF NIGERIA", {
        x: PAGE_MARGIN,
        y: cursorY,
        size: 18,
        font: titleFont,
        color: NAVY,
      });
      cursorY -= 24;
    }
  }

  cursorY -= 12;
  page.drawText("Completed service form export", {
    x: PAGE_MARGIN,
    y: cursorY,
    size: 11,
    font: bodyFont,
    color: SOFT,
  });
  cursorY -= 26;

  drawSectionKicker("Lead summary");
  drawFieldGrid([
    { label: "Lead ID", value: lead.id },
    { label: "Service", value: lead.serviceName },
    { label: "Status", value: lead.status },
    { label: "Created", value: formatDateTime(lead.createdAt) },
    { label: "Updated", value: formatDateTime(lead.updatedAt) },
    { label: "Follow-up Date", value: formatDate(lead.followUpDate) },
  ]);
  drawDivider();

  drawSectionKicker("Applicant details");
  drawFieldGrid([
    { label: "Full Name", value: lead.fullName },
    { label: "Email", value: lead.email || "Not provided" },
    { label: "Phone", value: lead.phone || "Not provided" },
    { label: "WhatsApp", value: lead.whatsapp || "Not provided" },
    {
      label: "Preferred Contact Method",
      value: lead.preferredContactMethod || "Not specified",
    },
  ]);
  if (lead.message) {
    drawFieldGrid([{ label: "Message", value: lead.message, fullWidth: true }]);
  }
  drawDivider();

  drawSectionKicker("Submitted form answers");

  const formAnswerItems: Array<{ label: string; value: string; fullWidth?: boolean }> = [];
  const uploadEntries: Array<{ label: string; files: StoredUploadFile[] }> = [];
  Object.entries((lead.formData ?? {}) as Record<string, unknown>).forEach(([key, value]) => {
    const configuredField = fieldMap.get(key);
    const label = getReadableFieldLabel(key, configuredField?.label);

    if (value == null || value === "") {
      formAnswerItems.push({ label, value: "Not provided" });
      return;
    }

    if (configuredField?.type === "date" && typeof value === "string") {
      formAnswerItems.push({ label, value: formatDate(value) });
      return;
    }

    if (typeof value === "boolean") {
      formAnswerItems.push({ label, value: value ? "Yes" : "No" });
      return;
    }

    if (isFamilyMemberEntryArray(value)) {
      formAnswerItems.push({
        label,
        value: formatFamilyMembers(value).join("\n"),
        fullWidth: true,
      });
      return;
    }

    if (isStoredUploadFileArray(value)) {
      formAnswerItems.push({
        label,
        value: value.map((file) => getStoredUploadDisplayName(file)).join(", "),
        fullWidth: true,
      });
      uploadEntries.push({ label, files: value });
      return;
    }

    const stringValue = String(value);
    formAnswerItems.push({
      label,
      value: stringValue,
      fullWidth: stringValue.length > 52 || label.length > 28,
    });
  });

  drawFieldGrid(formAnswerItems);

  if (uploadEntries.length > 0) {
    drawDivider();
    drawSectionKicker("Embedded uploads");

    for (const entry of uploadEntries) {
      ensureSpace(28);
      page.drawText(entry.label, {
        x: PAGE_MARGIN,
        y: cursorY,
        size: 12,
        font: titleFont,
        color: NAVY,
      });
      cursorY -= 18;

      for (const file of entry.files) {
        try {
          const embeddedImage = await embedUploadImage(pdfDoc, file);
          const maxWidth = 220;
          const maxHeight = 160;
          const scale = Math.min(
            maxWidth / embeddedImage.width,
            maxHeight / embeddedImage.height,
            1,
          );
          const width = embeddedImage.width * scale;
          const height = embeddedImage.height * scale;

          ensureSpace(height + 36);

          page.drawText(getStoredUploadDisplayName(file), {
            x: PAGE_MARGIN,
            y: cursorY,
            size: 10,
            font: bodyFont,
            color: SOFT,
          });
          cursorY -= 14;

          page.drawRectangle({
            x: PAGE_MARGIN,
            y: cursorY - height - 8,
            width: width + 16,
            height: height + 16,
            borderColor: LINE,
            borderWidth: 1,
            color: rgb(1, 1, 1),
          });

          page.drawImage(embeddedImage, {
            x: PAGE_MARGIN + 8,
            y: cursorY - height,
            width,
            height,
          });

          cursorY -= height + 24;
        } catch {
          drawParagraph(
            `Attachment could not be embedded in this PDF: ${getStoredUploadDisplayName(file)}`,
            10,
            SOFT,
          );
        }
      }
    }
  }

  return {
    bytes: await pdfDoc.save(),
    filename: buildLeadDownloadFilename(lead),
  };
}
