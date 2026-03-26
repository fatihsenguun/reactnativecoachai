import * as fs from "fs";
import path from "path";
import { auditFullProject } from "./agent.service";

// Token limitini aşmamak için kodu temizleyen yardımcı fonksiyon
function pruneCode(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Yorumları sil
    .replace(/^\s*[\r\n]/gm, '')             // Boş satırları sil
    .trim();
}

function getSystemicContext(dir: string, fileList: string[] = []): string {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      // Sadece mimariyi etkileyen klasörleri tara
      if (['context', 'navigation', 'config'].includes(file)) {
        getSystemicContext(filePath, fileList);
      }
    } else if (file.match(/\.(ts|tsx)$/)) {
      const content = fs.readFileSync(filePath, "utf8");
      fileList.push(`\n--- FILE: ${file} ---\n${pruneCode(content)}`);
    }
  });
  return fileList.join("\n");
}

async function runGlobalStackAudit() {
  console.log("🔍 CoachAI Stack Sistemi taranıyor...");
  
  const srcPath = path.join(__dirname, "../src");
  const projectMap = getSystemicContext(srcPath);

  try {
    console.log("🤖 Agent tüm sistemi analiz ediyor (Race Condition & Auth Flow)...");
    const startTime = Date.now();
    
    const globalReport = await auditFullProject(projectMap);
    
    const reportPath = path.join(__dirname, "FULL_STACK_REPORT.md");
    fs.writeFileSync(reportPath, globalReport as string);
    
    const duration = (Date.now() - startTime) / 1000;
    console.log(`\n✅ Analiz ${duration}s içinde tamamlandı!`);
    console.log(`📂 Rapor şurada: ${reportPath}`);
  } catch (error: any) {
    console.error("❌ Sistem taraması başarısız:", error.message);
  }
}

runGlobalStackAudit();