/**
 * Database Connection Diagnostic
 * Run this to identify the exact DATABASE_URL issue
 */

import * as dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

async function diagnoseConnection() {
  console.log("🔍 DATABASE CONNECTION DIAGNOSTIC\n");
  console.log("=" .repeat(60));

  // 1. Check if DATABASE_URL exists
  const dbUrl = process.env.DATABASE_URL;
  console.log("\n1️⃣ Environment Variable Check:");
  if (!dbUrl) {
    console.log("   ❌ DATABASE_URL is not set in environment!");
    console.log("   💡 Create a .env file with DATABASE_URL=...");
    process.exit(1);
  }
  console.log("   ✅ DATABASE_URL is set");

  // 2. Parse the URL
  console.log("\n2️⃣ Connection String Analysis:");
  try {
    const url = new URL(dbUrl);
    console.log("   Protocol:", url.protocol);
    console.log("   Username:", url.username);
    console.log("   Password:", url.password ? "***" + url.password.slice(-4) : "❌ Missing");
    console.log("   Hostname:", url.hostname);
    console.log("   Port:", url.port || "5432 (default)");
    console.log("   Database:", url.pathname.slice(1));
    
    // Check if it's Supabase
    const isSupabase = url.hostname.includes('supabase.co');
    const isPooled = url.hostname.includes('pooler');
    
    console.log("\n   🔍 Connection Type:");
    if (isSupabase) {
      console.log("   ✅ Supabase connection");
      if (isPooled) {
        console.log("   ✅ Using connection pooling (recommended)");
      } else {
        console.log("   ⚠️  Direct connection (not pooled)");
        console.log("   💡 Consider using pooled connection for production");
      }
    } else {
      console.log("   ℹ️  Custom PostgreSQL server");
    }

    // 3. Test DNS resolution
    console.log("\n3️⃣ DNS Resolution Test:");
    console.log("   Testing hostname:", url.hostname);
    
    try {
      const address = await lookup(url.hostname);
      console.log("   ✅ DNS resolution successful!");
      console.log("   IP Address:", address.address);
    } catch (dnsError: any) {
      console.log("   ❌ DNS resolution failed!");
      console.log("   Error:", dnsError.message);
      console.log("\n   💡 Possible causes:");
      console.log("      1. Supabase project is paused or deleted");
      console.log("      2. Incorrect hostname in DATABASE_URL");
      console.log("      3. Network connectivity issue");
      console.log("      4. Firewall blocking DNS queries");
      console.log("\n   🔧 Solutions:");
      console.log("      1. Check Supabase dashboard (https://supabase.com/dashboard)");
      console.log("      2. Verify project exists and is active");
      console.log("      3. Get a fresh connection string from Supabase");
      console.log("      4. Update .env file with correct DATABASE_URL");
    }

    // 4. Check port
    console.log("\n4️⃣ Port Configuration:");
    const port = url.port || "5432";
    if (port === "5432") {
      console.log("   ⚠️  Using port 5432 (direct connection)");
      console.log("   💡 For Supabase, use port 6543 (pooled connection)");
    } else if (port === "6543") {
      console.log("   ✅ Using port 6543 (pooled connection)");
    } else {
      console.log("   ℹ️  Using port:", port);
    }

    // 5. Security check
    console.log("\n5️⃣ Security Check:");
    if (dbUrl.includes("@localhost")) {
      console.log("   ⚠️  Using localhost connection");
      console.log("   💡 This won't work in production (Vercel)");
    } else {
      console.log("   ✅ Using remote database (production-ready)");
    }

  } catch (parseError: any) {
    console.log("   ❌ Failed to parse DATABASE_URL!");
    console.log("   Error:", parseError.message);
    console.log("   💡 Check DATABASE_URL format");
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n📋 Summary:");
  console.log("   • If DNS resolution failed: Fix DATABASE_URL in .env");
  console.log("   • If using port 5432: Consider switching to 6543 (pooled)");
  console.log("   • If localhost: Won't work on Vercel deployment");
  console.log("\n✅ Next steps:");
  console.log("   1. Fix any issues above");
  console.log("   2. Run: npx tsx -r dotenv/config debug-quiz-submission.ts");
  console.log("   3. Test quiz completion in the app");
  console.log("");
}

diagnoseConnection();
