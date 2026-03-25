import * as fs from "fs";
import path from "path";
import { auditAuthSystem } from "./agent.service";

async function runAudit() {
  console.log("🚀 Starting Agentic Auth Audit...");

  const authFilePath = path.join(__dirname, "../src/context/AuthProvider.tsx");

  try {
    const currentCode = fs.readFileSync(authFilePath, "utf8");
    console.log("📄 Reading AuthProvider.tsx...");

    const startTime = Date.now();
    const report = await auditAuthSystem(currentCode);
    const duration = (Date.now() - startTime) / 1000;


    const reportPath = path.join(__dirname, "auth_upgrade_report.md");
    fs.writeFileSync(reportPath, report as string);

    console.log(`\n✅ Audit Complete in ${duration}s!`);
    console.log(`📂 Report saved to: ${reportPath}`);

  } catch (error) {
    console.error("❌ Error during audit:", error);
  }
}

runAudit();