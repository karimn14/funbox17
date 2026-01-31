/**
 * Connection String Helper
 * This script helps you understand what connection string you need
 */

console.log("🔗 SUPABASE CONNECTION STRING HELPER\n");
console.log("=".repeat(70));

console.log("\n📍 Your Current Situation:");
console.log("   Local .env:  ❌ Using wrong hostname (fivmeksmoatmrhmdognr)");
console.log("   Vercel:      ✅ Using Session Pooler (port 5432)");
console.log("");

console.log("🎯 What You Need to Do:\n");

console.log("Step 1: Open Supabase Dashboard");
console.log("   → https://supabase.com/dashboard");
console.log("");

console.log("Step 2: Find Your Project");
console.log("   → Look for your funbox project");
console.log("   → Click to open it");
console.log("");

console.log("Step 3: Get Connection Strings");
console.log("   → Go to: Settings ⚙️  > Database");
console.log("   → You'll see TWO connection options:");
console.log("");

console.log("   Option A: Connection String (Session Mode) - Port 5432");
console.log("   ┌─────────────────────────────────────────────────────────────┐");
console.log("   │ postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:  │");
console.log("   │            5432/postgres                                     │");
console.log("   └─────────────────────────────────────────────────────────────┘");
console.log("   ✅ Use this to match your current Vercel setup");
console.log("");

console.log("   Option B: Connection Pooling (Transaction Mode) - Port 6543");
console.log("   ┌─────────────────────────────────────────────────────────────┐");
console.log("   │ postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[region].  │");
console.log("   │            pooler.supabase.com:6543/postgres                │");
console.log("   └─────────────────────────────────────────────────────────────┘");
console.log("   ⭐ RECOMMENDED: Better for serverless/Vercel");
console.log("");

console.log("Step 4: Choose ONE and Update Both");
console.log("");
console.log("   If you choose Option A (Session - Port 5432):");
console.log("   1. Copy the connection string from Supabase");
console.log("   2. Update LOCAL .env file:");
console.log("      DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres");
console.log("   3. Verify Vercel has the SAME connection string");
console.log("");

console.log("   If you choose Option B (Transaction - Port 6543) ⭐ RECOMMENDED:");
console.log("   1. Copy the connection pooling string from Supabase");
console.log("   2. Update LOCAL .env file:");
console.log("      DATABASE_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres");
console.log("   3. Update VERCEL environment variable to match");
console.log("   4. Redeploy Vercel app");
console.log("");

console.log("Step 5: Verify Your Fix");
console.log("   Run: npx tsx -r dotenv/config diagnose-database.ts");
console.log("   Should see: ✅ DNS resolution successful!");
console.log("");

console.log("=".repeat(70));
console.log("\n💡 Pro Tips:");
console.log("   • Keep local and Vercel using the SAME connection mode");
console.log("   • Port 6543 (Transaction Pooler) is better for Vercel");
console.log("   • Make sure no spaces in .env file");
console.log("   • The PROJECT reference in URL must be your actual project ID");
console.log("");

console.log("❓ How to Find Your Project ID:");
console.log("   1. Open your project in Supabase dashboard");
console.log("   2. Look at browser URL: https://supabase.com/dashboard/project/[PROJECT-ID]");
console.log("   3. Use this [PROJECT-ID] in your connection string");
console.log("");

console.log("🔍 Current Local .env:");
if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  console.log(`   Hostname: ${url.hostname}`);
  console.log(`   Port: ${url.port || '5432'}`);
  console.log(`   Status: ${url.hostname.includes('fivmeksmoatmrhmdognr') ? '❌ Wrong project ID' : '✅'}`);
} else {
  console.log("   ❌ DATABASE_URL not found in environment");
}

console.log("");
console.log("📋 Action Items:");
console.log("   [ ] Get correct connection string from Supabase");
console.log("   [ ] Update .env file");
console.log("   [ ] Run diagnose-database.ts to verify");
console.log("   [ ] Test quiz completion");
console.log("   [ ] Update Vercel if using different mode");
console.log("");

console.log("Need the exact steps? Check: SESSION_POOLER_FIX.md");
console.log("");
