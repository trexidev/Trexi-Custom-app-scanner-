import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import path from 'path';
import util from 'util';

const execAsync = util.promisify(exec);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file detected" }, { status: 400 });
    }

    // --- NEW LOGIC: PORTFOLIO DEMO MODE ---
    // If this code is running live on Vercel, we simulate the C++ engine.
    if (process.env.NODE_ENV === 'production') {
      
      // Simulate a 3-second deep scan delay for realistic UI feedback
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Return a simulated high-threat report for the portfolio demo
      return NextResponse.json({
        targetName: file.name,
        fileSizeBytes: 18432,
        threatsFound: 2,
        riskScore: 70,
        status: "CRITICAL",
        threatList: [
          "android.permission.CAMERA",
          "android.permission.INTERNET",
          "SYNERGY_ALERT: Camera + Internet (Exfiltration Risk)"
        ]
      });
    }

    // --- LOCAL EXECUTION (Your original real engine) ---
    const buffer = Buffer.from(await file.arrayBuffer());
    const projectRoot = path.join(process.cwd(), '..');
    const targetPath = path.join(projectRoot, 'Test_Targets', 'test_app.apk');

    await fs.writeFile(targetPath, buffer);
    await execAsync('AegisParser.exe', { cwd: projectRoot });

    const reportPath = path.join(projectRoot, 'report.json');
    const reportData = await fs.readFile(reportPath, 'utf8');

    return NextResponse.json(JSON.parse(reportData));

  } catch (error) {
    return NextResponse.json({ error: "Failed to analyze file" }, { status: 500 });
  }
}