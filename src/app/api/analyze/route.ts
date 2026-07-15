import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import path from 'path';
import util from 'util';

const execAsync = util.promisify(exec);

// Helper to define standard CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle CORS Preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file detected" }, 
        { status: 400, headers: corsHeaders }
      );
    }

    // 1. Convert to strict binary buffer to prevent text-encoding corruption
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. THE DIAGNOSTIC TRAP: Weigh the payload
    console.log(`\n================================`);
    console.log(`[+] INCOMING TARGET: ${file.name}`);
    console.log(`[+] PAYLOAD SIZE: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`================================\n`);

    if (buffer.length < 50000) { 
      console.error("[-] ERROR: Payload too small. File corrupted during upload or is not a real APK.");
      return NextResponse.json(
        { error: "File corrupted during network transfer" }, 
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Define paths securely
    const projectRoot = path.join(process.cwd(), '..');
    const targetDir = path.join(projectRoot, 'Test_Targets');
    const targetPath = path.join(targetDir, 'test_app.apk');

    // Force create the directory just in case
    await fs.mkdir(targetDir, { recursive: true });

    // 4. Drop the file to disk
    await fs.writeFile(targetPath, buffer);
    console.log(`[+] Binary written successfully to: ${targetPath}`);

    // 5. Fire the Engine
    console.log(`[+] Launching AegisParser.exe...`);
    await execAsync('AegisParser.exe', { 
        cwd: projectRoot,
        maxBuffer: 1024 * 1024 * 50 // 50MB buffer space to prevent Apktool pipe freeze
    });

    console.log(`[+] Engine Execution Complete. Reading Threat Matrix...`);

    // 6. Return Report with Dynamic Target Name
    const reportPath = path.join(projectRoot, 'report.json');
    const reportData = await fs.readFile(reportPath, 'utf8');
    
    // Parse the raw report from the C++ engine
    const finalReport = JSON.parse(reportData);
    
    // OVERRIDE: Swap the hardcoded target string with the actual uploaded file name
    finalReport.targetName = file.name;

    return NextResponse.json(finalReport, { headers: corsHeaders });

  } catch (error: any) {
    console.error("AEGIS ENGINE CRASH LOG:", error.message || error);
    return NextResponse.json(
      { error: "Engine execution failed", details: error.message }, 
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
}