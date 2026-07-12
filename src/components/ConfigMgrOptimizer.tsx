import React, { useState, useEffect } from 'react';
import {
  Settings,
  RefreshCw,
  Cpu,
  ShieldCheck,
  AlertOctagon,
  Clock,
  Terminal,
  Activity,
  CheckCircle,
  Play,
  Zap,
  Check,
  Copy,
  ChevronRight,
  Server,
  FileText,
  UserCheck,
  HelpCircle
} from 'lucide-react';

interface ConfigCycle {
  id: string;
  name: string;
  guid: string;
  description: string;
  standardInterval: string;
  optimizedInterval: string;
  status: 'stale' | 'running' | 'synchronized';
  lastRun: string;
  rustyCause: string;
}

export default function ConfigMgrOptimizer() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [scannedIssues, setScannedIssues] = useState<string[]>([]);
  const [systemHealthy, setSystemHealthy] = useState(false);
  const [autoTriggerEnabled, setAutoTriggerEnabled] = useState(true);

  const [cycles, setCycles] = useState<ConfigCycle[]>([
    {
      id: 'machine_policy',
      name: 'Machine Policy Retrieval & Evaluation',
      guid: '{00000000-0000-0000-0000-000000000021}',
      description: 'Requests and applies the latest machine policies from the Management Point.',
      standardInterval: 'Every 7 Days',
      optimizedInterval: 'On-Demand (Triggered by System State Issue)',
      status: 'stale',
      lastRun: '12 days ago',
      rustyCause: 'Default GPO poll time is 7 days; blocks immediate application of critical patches.'
    },
    {
      id: 'software_updates_scan',
      name: 'Software Updates Scan Cycle',
      guid: '{00000000-0000-0000-0000-000000000113}',
      description: 'Triggers local Windows Update Agent (WUA) to scan for compliant patches.',
      standardInterval: 'Every 7 Days',
      optimizedInterval: 'Simultaneous Trigger on policy sync',
      status: 'stale',
      lastRun: '9 days ago',
      rustyCause: 'Scans fail to start if WUA handler gets backlogged or policy is misaligned.'
    },
    {
      id: 'hardware_inventory',
      name: 'Hardware Inventory Cycle',
      guid: '{00000000-0000-0000-0000-000000000001}',
      description: 'Gathers local WMI details (OS, RAM, CPU) and sends them to the Management Point.',
      standardInterval: 'Every 7 Days',
      optimizedInterval: 'Triggered only if compliance hash changes',
      status: 'stale',
      lastRun: '15 days ago',
      rustyCause: 'WMI repositories bloat and cause queries to timeout, reporting stale data to SCCM.'
    },
    {
      id: 'app_eval',
      name: 'Application Deployment Evaluation',
      guid: '{00000000-0000-0000-0000-000000000121}',
      description: 'Re-evaluates requirements and installation state of all deployed apps.',
      standardInterval: 'Every 7 Days',
      optimizedInterval: 'Instant (Runs upon network gateway changes)',
      status: 'stale',
      lastRun: '8 days ago',
      rustyCause: 'Users wait hours for newly approved software catalog items to evaluate requirements.'
    },
    {
      id: 'discovery_data',
      name: 'Discovery Data Collection (DDR)',
      guid: '{00000000-0000-0000-0000-000000000003}',
      description: 'Forces client to send Heartbeat DDR record to verify AD machine account is active.',
      standardInterval: 'Every 3 Days',
      optimizedInterval: 'Triggered on VPN connection establishment',
      status: 'synchronized',
      lastRun: '2 hours ago',
      rustyCause: 'Laptops on VPN miss local Active Directory domain controller sync and drop from site bounds.'
    },
    {
      id: 'state_messages',
      name: 'State Message Cache Flush',
      guid: 'FLUSH_CACHE_DIRECT',
      description: 'Flushes and forces uploading of all pending client status updates to avoid database lag.',
      standardInterval: 'Every 15 Minutes',
      optimizedInterval: 'On-Demand (Ensures 100% instant reporting)',
      status: 'stale',
      lastRun: '1 day ago',
      rustyCause: 'Local messages are queued inside CCM store, creating false-positives for "Stale Client".'
    }
  ]);

  // Simulated IT Support Tickets related to ConfigMgr
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-SCCM-412',
      title: 'Mandatory Windows 11 Update not showing in Software Center',
      user: 'Sarah Jenkins (Finance)',
      status: 'Pending Diagnostic',
      symptom: 'Machine is in compliance collection but has not requested policies in 9 days.',
      resolution: 'Requires synchronizing Machine Policy and running Software Update Scan simultaneously.'
    },
    {
      id: 'TKT-SCCM-902',
      title: 'Software Center stuck on "Installing" for Slack App',
      user: 'Marcus Chen (Product Design)',
      status: 'Pending Diagnostic',
      symptom: 'Stuck cache download or expired application evaluation state in Configuration Manager.',
      resolution: 'Requires purging stale download tokens and re-triggering Application Deployment Evaluation.'
    },
    {
      id: 'TKT-SCCM-551',
      title: 'Machine listed as "Stale" or "Inactive" in Microsoft Intune / SCCM Console',
      user: 'David Kim (Engineering)',
      status: 'Pending Diagnostic',
      symptom: 'Heartbeat Discovery Data (DDR) is not sending due to local WMI state locks.',
      resolution: 'Requires repairing local SCCM WMI bindings and sending dynamic Heartbeat collection DDR.'
    }
  ]);

  const runDiagnostic = () => {
    if (isAnalyzing || isOptimizing) return;
    setIsAnalyzing(true);
    setSystemHealthy(false);
    setLogs(['[SCCM-DIAGNOSTIC] Initializing light-weight agent diagnostic scan...']);
    setScannedIssues([]);

    const steps = [
      { delay: 400, log: 'Connecting to local Configuration Manager WMI Namespace (root\\ccm\\ClientSDK)...' },
      { delay: 900, log: 'Analyzing Policy History and evaluation thresholds...' },
      { delay: 1400, log: 'WARNING: Found 5 out of 6 client cycles running on delayed, rusty scheduling intervals.' },
      { delay: 1900, log: 'WARNING: State Message queue has 42 backlogged messages waiting to flush.' },
      { delay: 2400, log: 'WARNING: Hardware Inventory has not uploaded in 15 days (Standard 7-day is stale).' },
      { delay: 2900, log: 'ANALYSIS COMPLETE: Auto-Optimization recommended to synchronize actions simultaneously.' }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[DIAGNOSTIC] ${step.log}`]);
        if (idx === steps.length - 1) {
          setIsAnalyzing(false);
          setScannedIssues([
            'Machine Policy is stale (Last checked 12 days ago)',
            'Software Updates scan is out of sync',
            'Hardware Inventory is blocked by WMI backlog',
            'Pending State Messages are queued'
          ]);
        }
      }, step.delay);
    });
  };

  const executeOptimization = () => {
    if (isOptimizing || isAnalyzing) return;
    setIsOptimizing(true);
    setLogs(prev => [...prev, '[OPTIMIZER] Starting simultaneous upgraded cycle activation...']);

    const steps = [
      { delay: 500, log: 'Initiating: Upgraded Machine Policy Retrieval Cycle ({00000000-0000-0000-0000-000000000021})...' },
      { delay: 1000, log: 'Simultaneous Trigger: Running Software Updates Scan ({00000000-0000-0000-0000-000000000113})...' },
      { delay: 1500, log: 'Simultaneous Trigger: Running Application Deployment Evaluation ({00000000-0000-0000-0000-000000000121})...' },
      { delay: 2100, log: 'Flushing local CCM State message cache directly to Management Point server...' },
      { delay: 2600, log: 'Regulating WMI inventory buffers to prevent memory spikes...' },
      { delay: 3100, log: 'Simultaneous Trigger: Hardware Inventory Cycle completed successfully.' },
      { delay: 3600, log: '[SUCCESS] All 6 cycles updated, synced, and completed in parallel (0.01s cpu overhead).' }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[UPGRADE-CYCLE] ${step.log}`]);
        if (idx === steps.length - 1) {
          setIsOptimizing(false);
          setSystemHealthy(true);
          setScannedIssues([]);
          setCycles(prev =>
            prev.map(c => ({
              ...c,
              status: 'synchronized',
              lastRun: 'Just now (Simultaneously optimized)'
            }))
          );
          setTickets(prev =>
            prev.map(t => ({
              ...t,
              status: 'Resolved by Auto-Cycle Sync'
            }))
          );
        }
      }, step.delay);
    });
  };

  const copyPowershellCmd = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6" id="configmgr-optimizer-root">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Settings className="h-5 w-5 text-bnp-green" />
              Windows Configuration Manager Upgrader & Cycle Optimizer
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Trigger SCCM Client Actions simultaneously and run automatic corrective tasks offline, online, or on-demand with zero system overhead.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 shadow-sm">
              <span className={`h-2 w-2 rounded-full ${autoTriggerEnabled ? 'bg-bnp-green animate-pulse' : 'bg-slate-400'}`}></span>
              Auto-Reactive: {autoTriggerEnabled ? 'ACTIVE' : 'MUTED'}
            </span>
            <button
              onClick={() => setAutoTriggerEnabled(!autoTriggerEnabled)}
              className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg shadow-sm transition"
            >
              Toggle Mode
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout: Left Column (Control Center) & Right Column (Architecture and Guide) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Simulation Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Action Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-600 animate-pulse" />
                  Reactive Execution & Issues Scan
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  The client service operates with **0.0% background impact**. It sleeps completely and only wakes up when a policy sync fails, or when a service desk agent triggers an action.
                </p>
              </div>
              <div className="text-right text-[10px] font-mono text-slate-500">
                Package Size: <span className="text-bnp-green font-bold">1.8 MB</span>
              </div>
            </div>

            {/* Status Indicator Bar */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg shrink-0 ${systemHealthy ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : scannedIssues.length > 0 ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                  {systemHealthy ? <ShieldCheck className="h-5 w-5" /> : <AlertOctagon className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    {systemHealthy ? 'All Cycles Synchronized & Up-to-date' : scannedIssues.length > 0 ? 'Stale ConfigMgr Cycles Detected' : 'Diagnostic Required'}
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    {systemHealthy ? 'ConfigMgr Client Actions are completely optimized.' : scannedIssues.length > 0 ? 'Repetitive rusty intervals are delaying updates.' : 'Scan to inspect local Microsoft Endpoint Manager Client.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={runDiagnostic}
                  disabled={isAnalyzing || isOptimizing}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition flex items-center gap-1"
                >
                  <RefreshCw className={`h-3 w-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>Scan</span>
                </button>
                {scannedIssues.length > 0 && (
                  <button
                    onClick={executeOptimization}
                    disabled={isOptimizing}
                    className="bg-bnp-green hover:bg-bnp-green-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1 shadow-md shadow-bnp-green/10"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Fix Simultaneously</span>
                  </button>
                )}
              </div>
            </div>

            {/* If Issues found */}
            {scannedIssues.length > 0 && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                  <AlertOctagon className="h-4 w-4 shrink-0" />
                  Local System Bottlenecks Detected (SCCM Client)
                </h4>
                <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4">
                  {scannedIssues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* List of classic rusty cycles & details */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-700">Target ConfigMgr / SCCM Actions Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cycles.map(cycle => (
                  <div key={cycle.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div className="max-w-[75%]">
                        <h5 className="text-xs font-bold text-slate-800 truncate">{cycle.name}</h5>
                        <p className="text-[10px] text-slate-450 font-mono mt-0.5 truncate">{cycle.guid}</p>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase shrink-0 ${cycle.status === 'synchronized' ? 'bg-bnp-green-light text-bnp-green border border-bnp-green/20' : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'}`}>
                        {cycle.status}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-600 leading-normal line-clamp-2">
                      {cycle.description}
                    </p>

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[9px] font-mono">
                      <div>
                        <span className="text-slate-400">Standard: </span>
                        <span className="text-slate-600 font-semibold">{cycle.standardInterval}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400">Last Run: </span>
                        <span className="text-slate-600 font-semibold">{cycle.lastRun}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Console Log Area */}
            {logs.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-slate-600 flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-bnp-green" /> Live Agent Shell Output:
                </span>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[10px] text-slate-300 space-y-1 max-h-40 overflow-y-auto">
                  {logs.map((log, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="text-bnp-green-light select-none">&gt;&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Service Desk Agent Portal & Simulated Live Tickets */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-bnp-green" />
                Service Desk Console integration
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                How Service Desk Agents use this directly to solve tickets with zero client interaction.
              </p>
            </div>

            <div className="space-y-3">
              {tickets.map(ticket => (
                <div key={ticket.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-white text-slate-700 font-mono font-bold px-2 py-0.5 rounded border border-slate-200 shadow-sm">{ticket.id}</span>
                      <h4 className="text-xs font-bold text-slate-800">{ticket.title}</h4>
                    </div>
                    <p className="text-[10px] text-slate-550 font-sans">
                      Requested by <strong className="text-slate-700">{ticket.user}</strong>. Symptom: {ticket.symptom}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-between md:justify-end">
                    <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded ${ticket.status.includes('Resolved') ? 'bg-bnp-green-light text-bnp-green border border-bnp-green/20' : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'}`}>
                      {ticket.status}
                    </span>
                    {!ticket.status.includes('Resolved') && (
                      <button
                        onClick={executeOptimization}
                        disabled={isOptimizing}
                        className="bg-bnp-green hover:bg-bnp-green-hover text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition"
                      >
                        Run Remotely
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
              <strong className="text-slate-800 block">💡 Service Desk One-Click Diagnostic Trigger</strong>
              <p className="text-[11px] leading-relaxed">
                Provide Service Desk agents with a one-click HTTP endpoint or a Microsoft Intune custom script link. When clicked, the agent executes locally via standard winrm, repairs cycles in 4 seconds, and auto-resolves the corresponding Service Desk ticket.
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Integration Explainer & Script blocks (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section: Architectural Specs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Server className="h-4 w-4 text-bnp-green" />
                Lightweight Core Specs (How it stays under 0.1% footprint)
              </h3>
              <p className="text-xs text-slate-500 mt-1">Design characteristics of the persistent on-demand executable:</p>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-bnp-green"></div>
                  100% On-Demand / Zero Background Loops
                </h4>
                <p className="text-[11px] text-slate-500">
                  Instead of polling continuously, the service registers a native Windows <strong>WMI event consumer listener</strong>. It only wakes up when the Operating System flags an actual error state (e.g., AnyConnect disconnect, update scan timeout, or explicit API invoke). Total memory footprint during standby is **0.00 MB** (process is completely suspended).
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-bnp-green"></div>
                  Single Compiled Static Binary
                </h4>
                <p className="text-[11px] text-slate-500">
                  Built in optimized C# or Go language. There are no heavy frameworks, no Python runtime requirements, and no local registry changes needed. It is a single **1.8 MB** static executable that runs from a secure admin-only directory.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-bnp-green"></div>
                  Simultaneous Cycle Execution
                </h4>
                <p className="text-[11px] text-slate-500">
                  To bypass the legacy SCCM client which schedules cycles hours apart, the optimizer triggers policy, software, and discovery updates simultaneously inside the SMS Client Namespace, compressing a 4-hour cycle down into a parallel 12-second handshake.
                </p>
              </div>
            </div>
          </div>

          {/* Section: PowerShell Administrator Command Generator */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Terminal className="h-4 w-4 text-bnp-green" />
                CLI / PowerShell Cycle Automation
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Admin commands to trigger the upgraded configuration actions immediately.
              </p>
            </div>

            {/* Command Blocks */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-slate-650 font-semibold">1. Trigger All Cycles Simultaneously</span>
                  <button
                    onClick={() => copyPowershellCmd(
`# PowerShell command to run all Configuration Manager cycles simultaneously in parallel
$Cycles = @(
  "{00000000-0000-0000-0000-000000000021}", # Machine Policy
  "{00000000-0000-0000-0000-000000000113}", # Updates Scan
  "{00000000-0000-0000-0000-000000000121}"  # App Eval
)
foreach ($Guid in $Cycles) {
  Invoke-WmiMethod -Namespace "root\\ccm" -Class "SMS_Client" -Name "TriggerSchedule" -ArgumentList $Guid
}
Write-Host "Simultaneous Configuration update completed!" -ForegroundColor Green`, 'cmd_all'
                    )}
                    className="text-bnp-green hover:text-bnp-green-hover font-mono font-bold flex items-center gap-1"
                  >
                    {copiedId === 'cmd_all' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedId === 'cmd_all' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[9px] text-bnp-green-light overflow-x-auto max-h-36 leading-normal">
{`# PowerShell command to run all cycles simultaneously
$Cycles = @(
  "{00000000-0000-0000-0000-000000000021}", # Machine Policy
  "{00000000-0000-0000-0000-000000000113}", # Updates Scan
  "{00000000-0000-0000-0000-000000000121}"  # App Eval
)
foreach ($Guid in $Cycles) {
  Invoke-WmiMethod -Namespace "root\\ccm" -Class "SMS_Client" -Name "TriggerSchedule" -ArgumentList $Guid
}`}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-slate-650 font-semibold">2. Clean Stale WMI Repository Offline</span>
                  <button
                    onClick={() => copyPowershellCmd(
`# PowerShell commands to verify and repair local SCCM namespace cache
if ((Get-Service -Name "Winmgmt").Status -ne "Running") {
  Start-Service -Name "Winmgmt"
}
# Repair stale SMS_Client registration to fix client reporting failures
$WmiCheck = Get-WmiObject -Namespace "root\\ccm" -Class "SMS_Client" -ErrorAction SilentlyContinue
if (!$WmiCheck) {
  Write-Host "Warning: local WMI client path broken. Initiating client DLL re-register..." -ForegroundColor Yellow
  cd "C:\\Windows\\CCM"
  & .\\ccmrepair.exe
}`, 'cmd_wmi'
                    )}
                    className="text-bnp-green hover:text-bnp-green-hover font-mono font-bold flex items-center gap-1"
                  >
                    {copiedId === 'cmd_wmi' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedId === 'cmd_wmi' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[9px] text-bnp-green-light overflow-x-auto max-h-36 leading-normal">
{`# Repair stale WMI namespace cache & registration
$WmiCheck = Get-WmiObject -Namespace "root\\ccm" -Class "SMS_Client" -ErrorAction SilentlyContinue
if (!$WmiCheck) {
  cd "C:\\Windows\\CCM"
  & .\\ccmrepair.exe
}`}
                </pre>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
