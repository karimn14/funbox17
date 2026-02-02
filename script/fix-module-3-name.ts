/**
 * Fix Module 3 Name
 * Change "Kesehatan & Kebersihan" to "Bahasa Inggris"
 */

import { db } from "../server/db";
import { modules } from "../shared/schema";
import { eq } from "drizzle-orm";

async function fixModule3Name() {
  console.log("🔧 Fixing Module 3 Name...\n");

  try {
    console.log("Step 1: Check current Module 3");
    const currentModule3 = await db.select().from(modules).where(eq(modules.id, 3));
    
    if (currentModule3.length === 0) {
      console.log("❌ Module 3 not found!");
      process.exit(1);
    }
    
    console.log(`   Current title: "${currentModule3[0].title}"`);
    console.log(`   Current category: "${currentModule3[0].category}"`);

    console.log("\nStep 2: Update Module 3 to 'Bahasa Inggris'");
    const [updated] = await db
      .update(modules)
      .set({
        title: "Bahasa Inggris",
        category: "Language",
        description: "Belajar bahasa Inggris dasar untuk komunikasi sehari-hari",
        imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400"
      })
      .where(eq(modules.id, 3))
      .returning();

    console.log("   ✅ Updated successfully!");
    console.log(`   New title: "${updated.title}"`);
    console.log(`   New category: "${updated.category}"`);
    console.log(`   New description: "${updated.description}"`);

    console.log("\n✅ Module 3 fixed!");
    console.log("\n📋 All Modules:");
    const allModules = await db.select().from(modules).orderBy(modules.order);
    allModules.forEach(m => console.log(`   ${m.id}. ${m.title} (${m.category})`));

  } catch (error) {
    console.error("❌ Error:", error);
  }

  process.exit(0);
}

fixModule3Name();
