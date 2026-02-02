/**
 * Reset Module IDs to 1, 2, 3, 4
 * This script fixes the module ID issue where IDs are 215, 216, etc instead of 1, 2, 3, 4
 */

import { db } from "../server/db";
import { modules, meetings } from "../shared/schema";
import { sql } from "drizzle-orm";

async function resetModuleIds() {
  console.log("🔧 Resetting Module IDs...\n");

  try {
    console.log("Step 1: Backup current module titles");
    const currentModules = await db.select().from(modules).orderBy(modules.order);
    console.log(`   Found ${currentModules.length} modules`);
    currentModules.forEach(m => console.log(`   - ID ${m.id}: ${m.title}`));

    console.log("\nStep 2: Delete all modules and meetings (will cascade)");
    await db.delete(meetings).execute();
    await db.delete(modules).execute();
    console.log("   ✅ Deleted");

    console.log("\nStep 3: Reset module ID sequence to 1");
    await db.execute(sql`ALTER SEQUENCE modules_id_seq RESTART WITH 1`);
    await db.execute(sql`ALTER SEQUENCE meetings_id_seq RESTART WITH 1`);
    console.log("   ✅ Sequences reset");

    console.log("\nStep 4: Re-create modules with correct IDs (1, 2, 3, 4)");
    
    const [mod1] = await db.insert(modules).values({
      title: "Pengenalan Uang & Berhitung",
      category: "Math",
      description: "Belajar mengenal uang koin dan kertas serta nilai-nilainya",
      imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400",
      order: 1,
    }).returning();
    console.log(`   ✅ Module 1 created (ID: ${mod1.id})`);

    const [mod2] = await db.insert(modules).values({
      title: "Keterampilan Bertahan Hidup",
      category: "Life Skills",
      description: "Mengenal bahaya dan keselamatan di rumah dan luar ruangan",
      imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400",
      order: 2,
    }).returning();
    console.log(`   ✅ Module 2 created (ID: ${mod2.id})`);

    const [mod3] = await db.insert(modules).values({
      title: "Bahasa Inggris",
      category: "Language",
      description: "Belajar bahasa Inggris dasar untuk komunikasi sehari-hari",
      imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400",
      order: 3,
    }).returning();
    console.log(`   ✅ Module 3 created (ID: ${mod3.id})`);

    const [mod4] = await db.insert(modules).values({
      title: "Bahasa Indonesia & Literasi",
      category: "Language",
      description: "Belajar mengenal huruf, kata, dan membaca cerita sederhana",
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
      order: 4,
    }).returning();
    console.log(`   ✅ Module 4 created (ID: ${mod4.id})`);

    console.log("\n✅ Module IDs reset successfully!");
    console.log("\n📋 New Module IDs:");
    const newModules = await db.select().from(modules).orderBy(modules.order);
    newModules.forEach(m => console.log(`   ${m.id}. ${m.title}`));

    console.log("\n⚠️  IMPORTANT: You need to re-seed meetings now!");
    console.log("   Run: npx tsx -r dotenv/config script/seed-final.ts");

  } catch (error) {
    console.error("❌ Error:", error);
  }

  process.exit(0);
}

resetModuleIds();
