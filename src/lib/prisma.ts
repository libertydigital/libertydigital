import "server-only";

import { PrismaClient } from "@prisma/client";

declare global {
  var __libertyPrisma: PrismaClient | undefined;
}

export function getPrisma() {
  if (!globalThis.__libertyPrisma) {
    globalThis.__libertyPrisma = new PrismaClient();
  }

  return globalThis.__libertyPrisma;
}
