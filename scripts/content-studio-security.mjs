import { PrismaClient } from "@prisma/client";

// Prisma creates tables but cannot express Supabase RLS/privilege requirements in schema.prisma.
// This idempotent step must run after the tables are created in every target database.
const db = new PrismaClient();
const tables = ["ContentPost", "ContentVideo", "ContentDistribution"];

try {
  const existingRoles = await db.$queryRawUnsafe(
    "SELECT rolname FROM pg_roles WHERE rolname IN ('anon', 'authenticated')",
  );
  for (const table of tables) {
    await db.$executeRawUnsafe(`ALTER TABLE "public"."${table}" ENABLE ROW LEVEL SECURITY`);
    for (const role of existingRoles) {
      // Identifiers come exclusively from local constants and postgres-known roles.
      await db.$executeRawUnsafe(`REVOKE ALL PRIVILEGES ON TABLE "public"."${table}" FROM "${role.rolname}"`);
    }
  }

  const relations = await db.$queryRawUnsafe(
    "SELECT relname, relrowsecurity FROM pg_class JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace WHERE pg_namespace.nspname = 'public' AND relname IN ('ContentPost', 'ContentVideo', 'ContentDistribution')",
  );
  if (relations.length !== tables.length || relations.some((table) => !table.relrowsecurity)) {
    throw new Error("Content table RLS verification failed.");
  }
  console.log("Content Studio RLS enabled on all 3 tables and anon/authenticated grants revoked where present.");
} finally {
  await db.$disconnect();
}
