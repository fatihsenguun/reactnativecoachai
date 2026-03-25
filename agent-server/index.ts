import * as fs from "fs";
import path from "path";
import { auditFullProject } from "./agent.service";

/**
 * Helper to recursively find all .ts and .tsx files in logic-heavy folders
 */
function getProjectContext(dir: string, fileList: string[] = []): string {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // We only care about folders that hold logic
      if (['context', 'navigation', 'pages', 'api'].includes(file)) {
        getProjectContext(filePath, fileList);
      }
    } else if (file.match(/\.(ts|tsx)$/)) {
      const content = fs.readFileSync(filePath, "utf8");
      // Format each file so the AI knows where it is
      fileList.push(`\nFILE_PATH: ${filePath}\nCONTENT:\n${content}\n---END_FILE---`);
    }
  });
  
  return fileList.join("\n");
}

async function runGlobalAudit() {
  console.log("🔍 Scanning CoachAI Project Logic...");
  
  const srcPath = path.join(__dirname, "../src");
  const fullProjectContext = getProjectContext(srcPath);

  try {
    console.log("🤖 Agent is analyzing cross-file dependencies...");
    const startTime = Date.now();
    
    const globalReport = await auditFullProject(fullProjectContext);
    
    const duration = (Date.now() - startTime) / 1000;
    fs.writeFileSync(path.join(__dirname, "FULL_SYSTEM_REPORT.md"), globalReport as string);
    
    console.log(`\n✅ Full Audit Complete in ${duration}s! Check FULL_SYSTEM_REPORT.md`);
  } catch (error) {
    console.error("❌ Global Audit Failed:", error);
  }
}

runGlobalAudit();