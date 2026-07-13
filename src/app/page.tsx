"use client"; 

import { useState } from 'react';

export default function Dashboard() {
  const [report, setReport] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsScanning(true); 
    setReport(null); 

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setReport(data); 
    } catch (error) {
      alert("System Error: Check terminal logs.");
    } finally {
      setIsScanning(false); 
    }
  };

  // Dynamic styling based on the new 3-tier heuristic status
  const getStatusStyle = (status: string) => {
    if (status === "CRITICAL") return 'bg-red-900/10 border-red-500 text-red-400';
    if (status === "WARNING") return 'bg-yellow-900/10 border-yellow-500 text-yellow-400';
    return 'bg-green-900/10 border-green-500 text-green-400';
  };

  const getScoreColor = (score: number) => {
    if (score >= 60) return 'bg-red-500';
    if (score >= 20) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-200 p-8 font-mono">
      <div className="max-w-4xl mx-auto border border-gray-800 bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        
        <div className="bg-black p-4 border-b border-gray-800 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-widest text-blue-500">PROJECT AEGIS // HEURISTIC ENGINE</h1>
          <span className="text-xs text-green-500 animate-pulse">SYSTEM: ONLINE</span>
        </div>
        
        <div className="p-8 border-b border-gray-800 bg-gray-900/50">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-10 text-center hover:border-blue-500 transition-colors">
            <input 
              type="file" 
              accept=".apk"
              onChange={handleFileUpload}
              className="hidden" 
              id="apk-upload" 
            />
            <label htmlFor="apk-upload" className="cursor-pointer flex flex-col items-center justify-center">
              <svg className="w-12 h-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              {isScanning ? (
                <span className="text-blue-400 font-bold animate-pulse">HEURISTIC ANALYSIS IN PROGRESS...</span>
              ) : (
                <span className="text-gray-400 text-lg">Upload target APK to initiate heuristic scan</span>
              )}
            </label>
          </div>
        </div>

        {report && (
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-800 pb-6">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Target Analyzed</p>
                <p className="text-3xl font-bold text-white">{report.targetName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">File Size</p>
                <p className="text-3xl font-bold text-white">
                  {(report.fileSizeBytes / 1024 / 1024).toFixed(3)} MB
                </p>
              </div>
            </div>

            <div className={`p-6 rounded-md border ${getStatusStyle(report.status)}`}>
              <div className="flex justify-between items-center border-b border-inherit pb-4 mb-4">
                <h2 className="text-3xl font-bold tracking-wide">
                  STATUS: {report.status}
                </h2>
                <div className="text-right">
                  <p className="text-sm uppercase tracking-widest mb-1 opacity-80">Heuristic Risk Score</p>
                  <p className="text-3xl font-bold">{report.riskScore} / 100</p>
                </div>
              </div>

              {/* Dynamic Progress Bar */}
              <div className="w-full bg-gray-950 rounded-full h-3 mb-6 border border-gray-800">
                <div className={`h-3 rounded-full transition-all duration-1000 ${getScoreColor(report.riskScore)}`} style={{ width: `${report.riskScore}%` }}></div>
              </div>

              <p className="text-lg opacity-90">
                Engine detected <strong>{report.threatsFound}</strong> suspicious capabilities.
              </p>
            </div>

            {report.threatList && report.threatList.length > 0 && (
              <div className="mt-6">
                <h3 className={`text-sm uppercase tracking-widest mb-3 font-bold border-b pb-2 ${report.status === "CRITICAL" ? "text-red-500 border-red-900/50" : "text-yellow-500 border-yellow-900/50"}`}>
                  Identified Threat Matrix
                </h3>
                <ul className="space-y-2">
                  {report.threatList.map((threat: string, index: number) => (
                    <li key={index} className={`border p-3 rounded-md font-mono text-sm flex items-center shadow-inner ${report.status === "CRITICAL" ? "bg-red-950/30 border-red-900/50 text-red-400" : "bg-yellow-950/30 border-yellow-900/50 text-yellow-400"}`}>
                      <span className="mr-3 font-bold">⚠</span>
                      {threat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
          </div>
        )}
      </div>
    </main>
  );
}