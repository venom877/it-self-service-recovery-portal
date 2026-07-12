import React, { useState } from 'react';
import { 
  MonitorPlay, 
  Terminal, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Server, 
  Copy, 
  Check, 
  Cpu, 
  Wrench,
  HelpCircle,
  FileCode,
  ShieldCheck,
  Code2,
  Lock
} from 'lucide-react';

interface CitrixTroubleshooterProps {
  onResolveCitrix: () => void;
}

export default function CitrixTroubleshooter({ onResolveCitrix }: CitrixTroubleshooterProps) {
  const [userEmail, setUserEmail] = useState('employee@corp.com');
  const [diagnosing, setDiagnosing] = useState(false);
  const [repairing, setRepairing] = useState(false);
  const [diagStep, setDiagStep] = useState<number>(0);
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);

  const isCompleted = localStorage.getItem('it_sd_citrix_resolved') !== '0' && localStorage.getItem('it_sd_citrix_resolved') !== null;

  // Diagnostic states
  const [checks, setChecks] = useState({
    workspaceApp: 'pending',
    webHelper: 'pending',
    icaAssociation: 'pending',
    orphanedSession: 'pending'
  });

  const runDiagnostics = () => {
    setDiagnosing(true);
    setDiagStep(1);
    setChecks({
      workspaceApp: 'pending',
      webHelper: 'pending',
      icaAssociation: 'pending',
      orphanedSession: 'pending'
    });

    // Step 1: Workspace check
    setTimeout(() => {
      setChecks(prev => ({ ...prev, workspaceApp: 'success' }));
      setDiagStep(2);
    }, 600);

    // Step 2: Web Helper check
    setTimeout(() => {
      setChecks(prev => ({ ...prev, webHelper: 'failed' }));
      setDiagStep(3);
    }, 1200);

    // Step 3: ICA Association check
    setTimeout(() => {
      setChecks(prev => ({ ...prev, icaAssociation: 'failed' }));
      setDiagStep(4);
    }, 1800);

    // Step 4: Orphaned session check
    setTimeout(() => {
      setChecks(prev => ({ ...prev, orphanedSession: 'warning' }));
      setDiagStep(5);
      setDiagnosing(false);
    }, 2400);
  };

  const applyRepairs = () => {
    setRepairing(true);
    
    setTimeout(() => {
      setChecks(prev => ({ ...prev, webHelper: 'success' }));
    }, 1000);

    setTimeout(() => {
      setChecks(prev => ({ ...prev, icaAssociation: 'success' }));
    }, 2000);

    setTimeout(() => {
      setChecks(prev => ({ ...prev, orphanedSession: 'success' }));
      setRepairing(false);
      onResolveCitrix(); // Trigger callback in parent
    }, 3000);
  };

  const copyScript = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedScriptId(id);
    setTimeout(() => setCopiedScriptId(null), 2000);
  };

  const workspaceResetPs = `# Kill stale Citrix processes and wipe local connection preference caches
Get-Process | Where-Object { $_.Name -like "*Citrix*" } | Stop-Process -Force -ErrorAction SilentlyContinue
$CachePath = "$env:USERPROFILE\\AppData\\Local\\Citrix\\SelfService\\Cache"
if (Test-Path $CachePath) {
    Remove-Item -Path "$CachePath\\*" -Force -Recurse -ErrorAction SilentlyContinue
}
Restart-Service -Name "CitrixWebHelper" -Force`;

  const icaAssociatePs = `# Re-associate .ica launch files back to wfica32.exe Connection Engine
$CitrixPath = "C:\\Program Files (x86)\\Citrix\\ICA Client\\wfica32.exe"
if (Test-Path $CitrixPath) {
    cmd /c "assoc .ica=Citrix.ICAClient"
    cmd /c 'ftype Citrix.ICAClient="$CitrixPath" "%%1"'
}`;

  return (
    <div className="space-y-6" id="citrix-troubleshooter-view">
      
      {/* Title Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <MonitorPlay className="h-5 w-5 text-bnp-green" />
          Citrix Virtual Desktop App Fixer
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Is your remote virtual office desktop stuck on "Starting..." or refusing to load? Use our 1-click repair utility to clear local application blocks and reset your launch settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Pane: Simple Customer Diagnostics Scanner (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Wrench className="h-4 w-4 text-bnp-green" />
              1. Run Citrix App Diagnostics Check
            </h3>

            {/* Email prompt (already populated for ease) */}
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 block">Connected Account Email</label>
                <input 
                  type="email" 
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="e.g. employee@corp.com"
                  className="w-full bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-bnp-green transition-all shadow-sm"
                />
              </div>
              <button
                onClick={runDiagnostics}
                disabled={diagnosing || repairing}
                className="bg-bnp-green hover:bg-bnp-green-hover disabled:bg-slate-100 disabled:text-slate-400 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-bnp-green/10 flex items-center gap-2 transition-all shrink-0"
              >
                {diagnosing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                <span>{diagnosing ? "Scanning Citrix..." : "Check Citrix Status"}</span>
              </button>
            </div>

            {/* Diagnostic Logs Results Table */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700">Workspace Diagnostic Statuses</h4>

              <div className="space-y-2">
                {/* Checkpoint 1 */}
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs shadow-sm">
                  <div className="flex items-center gap-2">
                    <Server className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-700 font-medium font-sans">Citrix Application Installation</span>
                  </div>
                  <span>
                    {checks.workspaceApp === 'pending' && <span className="text-slate-400">Waiting for Scan</span>}
                    {checks.workspaceApp === 'success' && <span className="text-bnp-green font-semibold flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Installed (OK)</span>}
                  </span>
                </div>

                {/* Checkpoint 2 */}
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs shadow-sm">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-700 font-medium">Citrix Web Helper service</span>
                  </div>
                  <span>
                    {checks.webHelper === 'pending' && <span className="text-slate-400">Waiting for Scan</span>}
                    {checks.webHelper === 'success' && <span className="text-bnp-green font-semibold flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Working</span>}
                    {checks.webHelper === 'failed' && <span className="text-rose-600 font-bold flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5 text-rose-500" /> STALLED (Needs Restart)</span>}
                  </span>
                </div>

                {/* Checkpoint 3 */}
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs shadow-sm">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-700 font-medium">Desktop File Association (.ICA files)</span>
                  </div>
                  <span>
                    {checks.icaAssociation === 'pending' && <span className="text-slate-400">Waiting for Scan</span>}
                    {checks.icaAssociation === 'success' && <span className="text-bnp-green font-semibold flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Bound Correctly</span>}
                    {checks.icaAssociation === 'failed' && <span className="text-rose-600 font-bold flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5 text-rose-500" /> BROKEN (Opens in Notepad)</span>}
                  </span>
                </div>

                {/* Checkpoint 4 */}
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs shadow-sm">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-700 font-medium">Active Virtual Connection locks</span>
                  </div>
                  <span>
                    {checks.orphanedSession === 'pending' && <span className="text-slate-400">Waiting for Scan</span>}
                    {checks.orphanedSession === 'success' && <span className="text-bnp-green font-semibold flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Clean Connection</span>}
                    {checks.orphanedSession === 'warning' && <span className="text-amber-500 font-bold flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> CONGESTED (Session lock detected)</span>}
                  </span>
                </div>
              </div>

              {diagStep > 0 && diagStep < 5 && (
                <div className="text-[10px] text-slate-400 font-mono text-center py-1 animate-pulse">
                  Analyzing check {diagStep} of 4...
                </div>
              )}
            </div>
          </div>

          {/* Action trigger for repair */}
          <div className="pt-4 border-t border-slate-100">
            {(checks.webHelper === 'failed' || checks.icaAssociation === 'failed' || checks.orphanedSession === 'warning' || checks.orphanedSession === 'success' || isCompleted) && (
              <button
                onClick={applyRepairs}
                disabled={repairing || diagnosing}
                className="w-full bg-bnp-green hover:bg-bnp-green-hover disabled:bg-slate-100 disabled:text-slate-400 text-white px-5 py-3 rounded-xl text-xs font-bold shadow-lg shadow-bnp-green/10 flex items-center justify-center gap-2 transition-all duration-200"
              >
                {repairing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
                <span>{repairing ? "Repairing Citrix Settings..." : "Run Citrix Quick-Repair"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Pane: Advanced reference info (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-150 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-bnp-green" />
              What does this repair do?
            </span>
          </div>

          <div className="p-5 flex-1 space-y-4.5 text-xs text-slate-600 leading-relaxed">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-bnp-green"></span>
                Re-opens Stalled Web Helpers
              </h4>
              <p className="text-[11px]">
                Sometimes the background helper service crashes silently. When you try to launch your app, the web page can't talk to your laptop client. The repair tool force-restarts this helper.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-bnp-green"></span>
                Fixes broken ".ica" Associations
              </h4>
              <p className="text-[11px]">
                Normally, clicking "Launch" downloads a small `.ica` file which triggers the Citrix window. Sometimes Windows gets confused and tries to open this file in Notepad or Chrome instead. The repair forces Windows to launch it correctly.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-bnp-green"></span>
                Clears Orphaned Locks
              </h4>
              <p className="text-[11px]">
                If your home internet had a brief interruption, Citrix can think you are still logged in on a virtual computer, locking your workspace. The repair clears stale connection preferences.
              </p>
            </div>
          </div>

          {/* Advanced collapsible code view */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <details className="group">
              <summary className="text-[11px] font-semibold text-slate-500 hover:text-slate-755 cursor-pointer list-none flex justify-between items-center select-none">
                <span className="flex items-center gap-1">
                  <Code2 className="h-3.5 w-3.5 text-slate-400" />
                  View Citrix PowerShell Commands
                </span>
                <span className="transition group-open:rotate-180 text-[10px]">&darr;</span>
              </summary>
              <div className="mt-3 space-y-3.5 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono font-bold">
                    <span>PowerShell: WIPE WORKSPACE CACHE</span>
                    <button
                      onClick={() => copyScript(workspaceResetPs, 'reset')}
                      className="text-bnp-green hover:text-bnp-green-hover font-semibold flex items-center gap-1 transition-all"
                    >
                      {copiedScriptId === 'reset' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                  <pre className="p-2.5 bg-slate-900 rounded-xl font-mono text-[9px] text-bnp-green-light border border-slate-800 overflow-x-auto max-h-[80px] leading-relaxed">
                    {workspaceResetPs}
                  </pre>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono font-bold">
                    <span>PowerShell: RESTORE .ICA ASSOCIATIONS</span>
                    <button
                      onClick={() => copyScript(icaAssociatePs, 'assoc')}
                      className="text-bnp-green hover:text-bnp-green-hover font-semibold flex items-center gap-1 transition-all"
                    >
                      {copiedScriptId === 'assoc' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                  <pre className="p-2.5 bg-slate-900 rounded-xl font-mono text-[9px] text-bnp-green-light border border-slate-800 overflow-x-auto max-h-[80px] leading-relaxed">
                    {icaAssociatePs}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        </div>

      </div>

      {/* Citrix launching tips FAQ list */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
          <HelpCircle className="h-4 w-4 text-bnp-green" />
          Common Citrix launching troubleshooting tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-800">"Connection Timeout" Error</h4>
            <p className="text-slate-600 leading-relaxed">
              If you receive error code `1030` saying connection timed out, it usually means your local firewall is blocking Citrix ports. Verify that outbound ports `2598` and `1494` are allowed on your home router firewall.
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-800">Nothing happens after clicking "Launch"</h4>
            <p className="text-slate-650 leading-relaxed">
              Your browser's pop-up blocker might be preventing the virtual desktop from spawning. Look at the right side of your Chrome URL address bar, click the pop-up icon, and set "Always allow popups from corporate Citrix storefront."
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
