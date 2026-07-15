"use client";

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [terminalLog, setTerminalLog] = useState<string[]>(["> System Ready. Awaiting Target..."]);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setReport(null);
      setTerminalLog([`> Target locked: ${e.target.files[0].name}`, "> Ready to initiate scan."]);
    }
  };

  // Simulated Terminal Effect for UI Feedback
  const updateTerminal = (message: string, delay: number) => {
    setTimeout(() => {
      setTerminalLog(prev => [...prev, message]);
    }, delay);
  };

  // Handle the Upload and API Call
  const triggerScan = async () => {
    if (!file) return;

    setIsScanning(true);
    setError(null);
    setReport(null);
    setTerminalLog(["> Initiating AEGIS sequence..."]);

    // Make the UI look like it's doing intense work while the backend runs
    updateTerminal("> Bypassing standard protocols...", 500);
    updateTerminal("> Injecting payload into secure sandbox...", 1200);
    updateTerminal("> Ripping Dalvik Executables (DEX)...", 2500);
    updateTerminal("> Heuristic engine mapping threat vectors...", 4500);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Points directly to the live local engine tunnel
      const response = await fetch('https://tranquil-scotch-winner.ngrok-free.dev/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unknown server error");
      }

      setTerminalLog(prev => [...prev, "> SCAN COMPLETE. Decrypting Threat Matrix."]);
      setReport(data);

    } catch (err: any) {
      setTerminalLog(prev => [...prev, `> [CRITICAL ERROR]: ${err.message}`]);
      setError(err.message);
    } finally {
      setIsScanning(false);
    }
  };

  // --- EXPORT LOGIC ---
  const downloadReport = () => {
    if (!report) return;

    // Build a formatted hacker-style text document
    const reportContent = `
==================================================
           AEGIS ENGINE - THREAT MATRIX
==================================================

[ TARGET VITALS ]
Target Identity : ${report.targetName}
Risk Score      : ${report.riskScore} / 100
Threats Found   : ${report.threatsFound || report.threatList?.length || 0}

--------------------------------------------------
[ DETECTED VECTORS ]
${report.threatList && report.threatList.length > 0 
  ? report.threatList.map((t: string) => `[!] ${t}`).join('\n') 
  : "[✓] No critical vectors detected. Target is secure."}

==================================================
        [ SYSTEM ] : Scan Executed Successfully.
        [ AUTHOR ] : Engineered by TREXI.
==================================================
    `;

    // Create a virtual file in the browser and trigger download
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AEGIS_Threat_Report_${report.targetName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen bg-[#050a15] text-gray-200 p-6 flex flex-col items-center justify-center font-sans overflow-hidden">
      
      {/* --- HACKER BACKGROUND EFFECTS --- */}
      {/* 1. The Cyber Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e9_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e9_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_70%,transparent_100%)]"></div>
      </div>
      
      {/* 2. Glowing Data Orbs (Powers the Glass Reflection) */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/40 rounded-full blur-[100px] z-0 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/40 rounded-full blur-[90px] z-0 pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 max-w-4xl w-full mb-8 text-center mt-10 md:mt-0">
        <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
          AEGIS <span className="text-white">ENGINE</span>
        </h1>
        <p className="text-cyan-500/70 mt-2 text-sm uppercase tracking-[0.3em] font-semibold">Advanced Heuristic Vulnerability Scanner</p>
      </div>

      {/* --- THE GLASSMORPHISM CONTAINER --- */}
      <div className="relative z-10 max-w-4xl w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Upload & Terminal */}
        <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col">
          
          {/* Frosted Dropzone */}
          <label htmlFor="dropzone-file" className={`relative overflow-hidden flex flex-col items-center justify-center w-full h-52 border border-dashed rounded-xl cursor-pointer transition-all duration-300 group ${file ? 'border-cyan-400 bg-cyan-900/20' : 'border-white/20 bg-black/20 hover:border-cyan-400 hover:bg-white/5 shadow-[0_0_15px_rgba(34,211,238,0.02)] hover:shadow-[0_0_25px_rgba(34,211,238,0.1)]'}`}>
            {/* Subtle internal grid for the dropzone */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:1rem_1rem] pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
              <svg className={`w-12 h-12 mb-4 transition-colors duration-300 ${file ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-gray-500 group-hover:text-cyan-500'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              {file ? (
                <p className="text-sm text-cyan-300 font-bold truncate w-full px-2">{file.name}</p>
              ) : (
                <>
                  <p className="mb-2 text-sm text-gray-300"><span className="font-semibold text-cyan-400">Click to upload</span> or drag target</p>
                  <p className="text-xs text-gray-500 font-mono">.APK FILES ONLY</p>
                </>
              )}
            </div>
            <input id="dropzone-file" type="file" className="hidden" accept=".apk" onChange={handleFileChange} disabled={isScanning} />
          </label>

          {/* Cyber Button */}
          <button 
            onClick={triggerScan}
            disabled={!file || isScanning}
            className={`mt-6 w-full py-3.5 rounded-xl font-black tracking-[0.2em] transition-all duration-300 uppercase ${!file || isScanning ? 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]'}`}
          >
            {isScanning ? 'Executing...' : 'Initiate Scan'}
          </button>

          {/* Glass Terminal */}
          <div className="mt-8 flex-grow bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 overflow-y-auto font-mono text-xs shadow-inner relative">
             <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-gray-500/50 uppercase text-[10px] tracking-widest">Aegis_Terminal</span>
              </div>
            {terminalLog.map((log, index) => (
              <div key={index} className={`mb-1 ${log.includes("ERROR") ? "text-red-400" : log.includes("COMPLETE") ? "text-green-400 font-bold" : "text-cyan-400 opacity-80"}`}>
                {log}
              </div>
            ))}
            {isScanning && <div className="text-cyan-400 animate-pulse mt-1">█</div>}
          </div>
        </div>

        {/* Right Side: Threat Matrix (Results) */}
        <div className="w-full md:w-1/2 p-8 bg-black/20 flex flex-col relative">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
            <h2 className="text-sm font-black tracking-[0.2em] text-white/80">THREAT MATRIX</h2>
            {report && <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">DECRYPTED</span>}
          </div>
          
          {!report ? (
            <div className="flex-grow flex flex-col items-center justify-center opacity-30">
               <svg className="w-16 h-16 mb-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              <span className="font-mono text-sm tracking-widest">AWAITING PAYLOAD</span>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn h-full flex flex-col relative">
              
              {/* Vitals */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50"></div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Target Identity</span>
                  <span className="text-sm text-cyan-300 font-mono truncate block" title={report.targetName}>{report.targetName}</span>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${report.riskScore > 50 ? 'bg-red-500/50' : 'bg-yellow-500/50'}`}></div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Risk Score</span>
                  <span className={`text-3xl font-black ${report.riskScore > 50 ? 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]' : 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]'}`}>
                    {report.riskScore}
                  </span>
                </div>
              </div>

              {/* Threat List */}
              <div className="bg-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10 flex-grow flex flex-col relative">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-4">Detected Vectors ({report.threatsFound || report.threatList?.length || 0})</span>
                
                <ul className="space-y-2.5 overflow-y-auto pr-2 flex-grow custom-scrollbar">
                  {report.threatList && report.threatList.length > 0 ? (
                    report.threatList.map((threat: string, idx: number) => {
                      const isCritical = threat.includes("SYNERGY_ALERT") || threat.includes("INTERNET") || threat.includes("CAMERA") || threat.includes("SMS");
                      return (
                        <li key={idx} className={`p-3 text-xs font-mono rounded-lg border break-words flex items-start ${isCritical ? 'bg-red-900/20 border-red-500/30 text-red-300' : 'bg-yellow-900/10 border-yellow-500/20 text-yellow-300'}`}>
                          {isCritical ? (
                            <span className="mt-0.5 inline-block w-2 h-2 bg-red-500 rounded-full mr-3 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse shrink-0"></span>
                          ) : (
                            <span className="mt-0.5 inline-block w-2 h-2 bg-yellow-500/50 rounded-full mr-3 shrink-0"></span>
                          )}
                          {threat}
                        </li>
                      )
                    })
                  ) : (
                    <li className="text-green-400 text-sm font-mono flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-3 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                      No critical vectors detected.
                    </li>
                  )}
                </ul>

                {/* Export Button (Only shows when report exists) */}
                <button 
                  onClick={downloadReport}
                  className="relative z-20 mt-4 w-full py-2 bg-cyan-900/20 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-mono text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 shadow-inner hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  <span>Export Threat Log</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* --- TREXI SIGNATURE --- */}
      <div className="relative z-10 mt-10 text-xs md:text-sm font-mono text-white/50 font-bold uppercase tracking-[0.5em] flex items-center space-x-3 opacity-90 hover:opacity-100 transition-opacity duration-300">
        <span className="w-8 h-px bg-white/30"></span>
        <span>
          Engineered by <span className="text-blue-400 font-black tracking-[0.2em] drop-shadow-[0_0_20px_rgba(59,130,246,1)]">TREXI</span>
        </span>
        <span className="w-8 h-px bg-white/30"></span>
      </div>

    </div>
  );
}