import fs from "node:fs";
import path from "node:path";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const backupPath = path.join(
  process.cwd(),
  "qa-live",
  "backups",
  "obvious-test-leads-2026-05-25.json",
);

async function main() {
  const backup = JSON.parse(fs.readFileSync(backupPath, "utf8"));

  for (const lead of backup.leads) {
    await prisma.lead.upsert({
      where: { id: lead.id },
      update: {},
      create: {
        id: lead.id,
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        whatsapp: lead.whatsapp,
        preferredContactMethod: lead.preferredContactMethod,
        serviceSlug: lead.serviceSlug,
        serviceName: lead.serviceName,
        status: lead.status,
        message: lead.message,
        formData: lead.formData,
        followUpDate: lead.followUpDate,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        notes: {
          create: lead.notes.map((note) => ({
            id: note.id,
            note: note.note,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
          })),
        },
        activities: {
          create: lead.activities.map((activity) => ({
            id: activity.id,
            type: activity.type,
            description: activity.description,
            createdAt: activity.createdAt,
          })),
        },
      },
    });
  }

  console.log(`Restored ${backup.leads.length} leads from backup.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
