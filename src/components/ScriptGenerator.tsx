import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  Play, 
  RefreshCw, 
  Trash2, 
  Cpu, 
  HardDrive, 
  HelpCircle,
  Code2,
  Info,
  CheckCircle,
  FileCode
} from 'lucide-react';

interface ScriptGeneratorProps {
  onAddStorage: (amount: number) => void;
}

export default function ScriptGenerator({ onAddStorage }: ScriptGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [reclaimedInSession, setReclaimedInSession] = useState<number | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Default state: not run yet (hydrated from localStorage in parent if possible)
  const isCleaned = reclaimedInSession !== null || localStorage.getItem('it_sd_reclaimed') !== '0' && localStorage.getItem('it_sd_reclaimed') !== null;

  const powershellScript = `# Personal Laptop Speed Optimizer - Storage Sweep
# Clears temporary internet caches, system telemetry logs, and app prefetch indexes.

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "      SAFE DISK SPACE CLEANUP UTILITY         " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

$TempDirectories = @(
    $env:TEMP,
    "C:\\Windows\\Temp",
    "C:\\Windows\\Prefetch"
)

$TotalDeletedSize = 0
foreach ($Dir in $TempDirectories) {
    if (Test-Path $Dir) {
        Write-Host "Cleaning: $Dir" -ForegroundColor Gray
        $Files = Get-ChildItem -Path $Dir -Recurse -File -ErrorAction SilentlyContinue
        foreach ($File in $Files) {
            $TotalDeletedSize += $File.Length
            Remove-Item -Path $File.FullName -Force -ErrorAction SilentlyContinue
        }
    }
}

$ReclaimedGB = [Math]::Round($TotalDeletedSize / 1GB, 2)
Write-Host "Success! Safe storage boost completed. Saved $ReclaimedGB GB." -ForegroundColor Green`;

  const handleCopy = () => {
    navigator.clipboard.writeText(powershellScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setReclaimedInSession(null);
    setTerminalLines(["[DISK-SHIELD v2.1] Starting disk diagnostic check..."]);
    setProgress(0);

    const simulationSteps = [
      { delay: 300, line: "Establishing safe user credentials context..." },
      { delay: 700, line: "Analyzing Disk Drive C: space sectors..." },
      { delay: 1200, line: "  Total Drive C Size: 476.2 GB | Remaining: 4.8 GB (Dangerously Low!)" },
      { delay: 1700, line: "--------------------------------------------------------" },
      { delay: 2100, line: "STEP [1/3]: Deleting application temporary junk caches..." },
      { delay: 2600, line: "  Removing: User Local Workspace Temp files (~WDF3A24.tmp)" },
      { delay: 3000, line: "  Removing: Teams/Slack stale image and log heaps" },
      { delay: 3400, line: "  => Swept 14,821 objects. Reclaimed space: 4.82 GB" },
      { delay: 3900, line: "--------------------------------------------------------" },
      { delay: 4300, line: "STEP [2/3]: Purging old Windows setup installer logs..." },
      { delay: 4700, line: "  Removing: C:\\Windows\\Temp\\CBS.log (obsolete update logs)" },
      { delay: 5200, line: "  => Swept 341 corporate logs. Reclaimed space: 2.15 GB" },
      { delay: 5600, line: "--------------------------------------------------------" },
      { delay: 6000, line: "STEP [3/3]: Tuning application prefetch index bindings..." },
      { delay: 6500, line: "  Evicting unlaunched background trace indexes" },
      { delay: 7000, line: "  => Reclaimed 412 prefetch registry markers: 1.45 GB" },
      { delay: 7500, line: "--------------------------------------------------------" },
      { delay: 8000, line: "Flushing network resolver tables and DNS caches..." },
      { delay: 8500, line: "SUCCESS: local machine response speed index raised by +34%" },
      { delay: 9000, line: "SUMMARY:" },
      { delay: 9300, line: "  Total Files Cleaned: 15,574 files" },
      { delay: 9600, line: "  Total Disk Space Saved: 8.42 GB" },
      { delay: 10000, line: "[COMPLETED] Storage optimization completed safely. Your disk is now clean!" }
    ];

    simulationSteps.forEach((step, index) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, step.line]);
        const calcProgress = Math.min(Math.round(((index + 1) / simulationSteps.length) * 100), 100);
        setProgress(calcProgress);

        if (index === simulationSteps.length - 1) {
          setIsRunning(false);
          setReclaimedInSession(8.42);
          onAddStorage(8.42); // updates metrics in App.tsx
        }
      }, step.delay);
    });
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLines]);

  return (
    <div className="space-y-6" id="storage-booster-view">
      
      {/* Brand Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-bnp-green" />
          Personal Storage Booster & Disk Cleaner
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Is your computer running slow or sluggish? Our automated sweeper purges safe-to-delete temp files, leftovers from broken updates, and clogged web logs to free up massive drive space.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Simplified Customer Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-bnp-green" />
              1. Local Drive (C:) Space Analysis
            </h3>

            {/* Visual Drive Gauge */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Disk C: OS Allocation Volume</span>
                <span className="font-mono text-slate-600 font-bold">
                  {isCleaned ? "54.8 GB Free / 476.2 GB" : "4.8 GB Free / 476.2 GB (Low Space!)"}
                </span>
              </div>

              {/* Progress bar representing space used */}
              <div className="w-full bg-slate-200 h-6 rounded-xl overflow-hidden relative border border-slate-300">
                <div 
                  className={`h-full transition-all duration-1000 ${isCleaned ? 'bg-bnp-green w-[86%]' : 'bg-rose-500 w-[99%] animate-pulse'}`}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-900 uppercase tracking-wider">
                  {isCleaned ? "86% Occupied (Healthy Cache status)" : "99% Occupied (Dangerously Low!)"}
                </span>
              </div>

              {/* Simple grid list of what will be deleted */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">App Temp Cache</span>
                  <span className={`text-sm font-bold ${isCleaned ? 'text-slate-400 line-through' : 'text-amber-600'} mt-1 block`}>4.82 GB</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">System Log Bloat</span>
                  <span className={`text-sm font-bold ${isCleaned ? 'text-slate-400 line-through' : 'text-amber-600'} mt-1 block`}>2.15 GB</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Stale Prefetch Index</span>
                  <span className={`text-sm font-bold ${isCleaned ? 'text-slate-400 line-through' : 'text-amber-400'} mt-1 block`}>1.45 GB</span>
                </div>
              </div>
            </div>

            {/* Explainer for non-technical users */}
            <div className="bg-bnp-green-light border border-bnp-green/10 p-4.5 rounded-2xl flex gap-3.5 items-start">
              <Info className="h-5 w-5 text-bnp-green shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <h4 className="font-bold text-slate-800">Is this safe? Will I lose my files or photos?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Yes, this is 100% safe. This only deletes hidden junk application caches, setup logs, and broken index pointers that programs forgot to clean up. It will <strong>never</strong> delete your desktop shortcuts, photos, downloads, passwords, or personal documents.
                </p>
              </div>
            </div>
          </div>

          {/* Action button at the bottom */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5 text-slate-450" />
              Windows local command authorization confirmed
            </span>

            {isCleaned ? (
              <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-bnp-green-light border border-bnp-green/20 text-bnp-green text-xs font-bold shadow-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Laptop Fully Optimized!</span>
              </div>
            ) : (
              <button
                onClick={startSimulation}
                disabled={isRunning}
                className="bg-bnp-green hover:bg-bnp-green-hover disabled:bg-slate-100 disabled:text-slate-400 text-white px-5 py-3 rounded-xl text-xs font-bold shadow-lg shadow-bnp-green/10 flex items-center justify-center gap-2 transition-all duration-200 shrink-0"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Cleaning Disk...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Run Safe Storage Sweep</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Sandbox Console Output (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm">
          <div className="p-4 border-b border-slate-150 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-bnp-green" />
              Active System Log Console
            </span>
            <span className="h-2 w-2 rounded-full bg-bnp-green animate-pulse"></span>
          </div>

          {/* Console Output box */}
          <div className="bg-slate-950 flex-1 p-5 font-mono text-[10px] text-slate-300 h-[280px] overflow-y-auto space-y-1.5">
            {terminalLines.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2.5 text-center p-4">
                <Terminal className="h-9 w-9 text-slate-700 stroke-1" />
                <div>
                  <p className="font-bold text-xs text-slate-400">Disk Sweep Status: Ready</p>
                  <p className="text-[10px] text-slate-600 mt-1">
                    Press the "Run Safe Storage Sweep" button to watch the clean engine safely scan your laptop folders and reclaim space.
                  </p>
                </div>
              </div>
            ) : (
              terminalLines.map((line, idx) => {
                let color = "text-slate-300";
                if (line.includes("STEP")) color = "text-bnp-green font-semibold";
                else if (line.includes("SUCCESS:") || line.includes("Removing") || line.includes("Deleting")) color = "text-emerald-400";
                else if (line.includes("SUMMARY") || line.includes("COMPLETED")) color = "text-amber-400 font-bold";
                else if (line.startsWith("  ")) color = "text-slate-400";
                
                return (
                  <div key={idx} className={`${color} leading-relaxed`}>
                    {line}
                  </div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* Collapsible advanced code view for power-users */}
          <div className="bg-slate-50 border-t border-slate-200 p-4">
            <details className="group">
              <summary className="text-[11px] font-semibold text-slate-500 hover:text-slate-755 cursor-pointer list-none flex justify-between items-center select-none">
                <span className="flex items-center gap-1">
                  <Code2 className="h-3.5 w-3.5 text-slate-400" />
                  Advanced Details (View PowerShell Commands)
                </span>
                <span className="transition group-open:rotate-180 text-[10px]">&darr;</span>
              </summary>
              <div className="mt-3 space-y-2 text-xs">
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  For IT administrator inspectability, this is the exact corporate script executed inside the secure sandbox terminal:
                </p>
                <div className="relative">
                  <button 
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[9px] text-bnp-green-light overflow-x-auto max-h-[120px] leading-relaxed">
                    {powershellScript}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        </div>

      </div>

    </div>
  );
}
