import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldAlert, 
  Wifi, 
  RefreshCw, 
  Terminal, 
  Check, 
  Copy, 
  HelpCircle,
  FileText,
  Radio,
  Sliders,
  CheckCircle,
  AlertCircle,
  Code2,
  Lock
} from 'lucide-react';

interface CiscoTroubleshooterProps {
  onResolveCisco: () => void;
}

type IssueKey = 'mtu' | 'dns' | 'adapter' | 'cert';

export default function CiscoTroubleshooter({ onResolveCisco }: CiscoTroubleshooterProps) {
  const [activeIssue, setActiveIssue] = useState<IssueKey>('mtu');
  const [resetTerminalLines, setResetTerminalLines] = useState<string[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  const [resetFinished, setResetFinished] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const isCompleted = resetFinished || localStorage.getItem('it_sd_cisco_resolved') !== '0' && localStorage.getItem('it_sd_cisco_resolved') !== null;

  const issues = {
    mtu: {
      title: "VPN Keeps Disconnecting Every 15 Mins",
      symptom: "Cisco connects successfully but randomly drops out with a timeout message during Excel sheets syncing or video calls.",
      cause: "Home Wi-Fi routers use extra PPPoE network layers which crowd standard network packets. When packet sizes exceed your router's capability, the router drops them, breaking your VPN connection.",
      solution: "Configure the Cisco network card MTU size from 1500 to 1400. This fits your router's packets perfectly, stopping accidental dropouts permanently.",
      psCode: `# Lower MTU to 1400 for Cisco AnyConnect adapter to align with WFH home routers
Get-NetAdapter | Where-Object { $_.InterfaceDescription -like "*Cisco*" } | Set-NetIPInterface -NlMtuBytes 1400
ipconfig /flushdns
Restart-Service -Name "vpnagent" -Force`
    },
    dns: {
      title: "Stuck on 'Securing Connection...' / Timeout",
      symptom: "The AnyConnect app spins forever trying to log in, and eventually shows 'Gateway not responding'.",
      cause: "Stale network routes or polluted DNS nameservers on your home router have cached the wrong address for corporate servers.",
      solution: "Flush local machine DNS resolver table, renew your home IP address lease, and clear stale XML connection records.",
      psCode: `# Flush local cache and renew local home router network lease
ipconfig /release
ipconfig /renew
ipconfig /flushdns
Remove-Item -Path "$env:ProgramData\\Cisco\\Cisco Secure Client\\VPN\\Profile\\*.xml" -Force`
    },
    adapter: {
      title: "Virtual Adapter Conflict Error",
      symptom: "VPN fails to start saying 'Unable to establish socket binding' or 'Adapter conflict'.",
      cause: "Secondary background apps (Docker, Hyper-V, VirtualBox, or VPNs) have higher priority, taking over the network sockets Cisco needs.",
      solution: "Temporarily turn off conflicting virtual adapters while WFH so Cisco secures high priority.",
      psCode: `# Disable competing virtual host controllers that block VPN sockets
Disable-NetAdapter -Name "*vEthernet*" -Confirm:$false -ErrorAction SilentlyContinue
Disable-NetAdapter -Name "*VirtualBox*" -Confirm:$false -ErrorAction SilentlyContinue`
    },
    cert: {
      title: "Security Certificate Validation Failed",
      symptom: "Cisco throws: 'Security certificate check failed' or 'Untrusted gateway'.",
      cause: "Your local machine's system clock is slightly offset from the central Active Directory server, causing authentication key mismatch.",
      solution: "Force-sync your Windows system clock with standard internet atomic servers and restart Cisco service agent.",
      psCode: `# Sync local clock with global Active Directory time servers
w32tm /config /manualpeerlist:"time.windows.com" /syncfromflags:manual /update
Restart-Service w32time
w32tm /resync`
    }
  };

  const triggerResetSimulation = () => {
    if (isResetting) return;
    setIsResetting(true);
    setResetFinished(false);
    setResetTerminalLines(["[CISCO-REPAIR-DAEMON v2.4] Checking current adapter bindings..."]);

    const steps = [
      { delay: 400, line: ">> STEP 1: Querying AnyConnect Virtual Miniport configuration..." },
      { delay: 900, line: "   Found: Cisco Secure Client Virtual Adapter." },
      { delay: 1400, line: ">> STEP 2: Checking MTU packet payload capabilities..." },
      { delay: 1900, line: "   Current MTU size: 1500 bytes (Detected standard home ISP packet ceiling)" },
      { delay: 2400, line: ">> STEP 3: Adjusting MTU profile for Work-From-Home routing..." },
      { delay: 2900, line: "   Applying safe MTU cap: 1400 bytes (Protects against home router encapsulation drops)" },
      { delay: 3500, line: "   Success: Adjusted MTU binding persistently." },
      { delay: 4000, line: ">> STEP 4: Cleansing internal Cisco connection preferences cache..." },
      { delay: 4500, line: "   Preferences.xml cleared. Stale routing endpoints pruned." },
      { delay: 5100, line: ">> STEP 5: Cycling the local AnyConnect support service agent..." },
      { delay: 5600, line: "   Restarting 'vpnagent' service... Done." },
      { delay: 6200, line: ">> STEP 6: Flashing Windows DNS resolver table..." },
      { delay: 6700, line: "   ipconfig /flushdns => OK" },
      { delay: 7200, log: "", line: ">> STEP 7: Pinging corporate secure entrance..." },
      { delay: 7700, line: "   vpn.corp.com responded in 22ms. Handshake validated successfully." },
      { delay: 8200, line: ">> SUCCESS: Cisco VPN adapter optimized for home Wi-Fi! No more drops." }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setResetTerminalLines(prev => [...prev, step.line]);
        if (idx === steps.length - 1) {
          setIsResetting(false);
          setResetFinished(true);
          onResolveCisco(); // trigger callback
        }
      }, step.delay);
    });
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [resetTerminalLines]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode('copied');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6" id="cisco-troubleshooter-view">
      
      {/* Title Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-bnp-green" />
          Cisco WFH VPN Dropout Fixer
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Are you having trouble staying connected to the corporate VPN at home? Select your symptoms below and use our one-click optimization tool to repair your network adapter.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Interactive Diagnostics selector (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sliders className="h-4 w-4 text-bnp-green" />
              1. What VPN problem are you experiencing?
            </h3>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(issues) as IssueKey[]).map((key) => {
                const isSelected = activeIssue === key;
                return (
                  <button
                    key={key}
                    id={`cisco-issue-${key}`}
                    onClick={() => {
                      setActiveIssue(key);
                      setResetFinished(false);
                      setResetTerminalLines([]);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-300 ${
                      isSelected 
                        ? 'bg-bnp-green-light border-bnp-green text-bnp-green' 
                        : 'bg-slate-50 border-transparent hover:bg-slate-100 text-slate-500'
                    }`}
                  >
                    <span className={`block font-bold text-xs mb-1 ${isSelected ? 'text-bnp-green' : 'text-slate-700'}`}>{issues[key].title}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{issues[key].symptom}</span>
                  </button>
                );
              })}
            </div>

            {/* Diagnostic Details */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 shrink-0 mt-0.5 border border-amber-500/20">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Why does this happen?</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {issues[activeIssue].cause}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 bg-bnp-green-light rounded-lg text-bnp-green shrink-0 mt-0.5 border border-bnp-green/20">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">What does the repair tool do?</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {issues[activeIssue].solution}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
            <HelpCircle className="h-4 w-4 text-slate-400 font-normal" />
            <span>This tool safely applies isolated modifications. It will never affect your home Wi-Fi password or router settings.</span>
          </div>
        </div>

        {/* Right Side: Simple One-click reset console (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-150 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 font-mono">
              <Terminal className="h-4 w-4 text-bnp-green" />
              Automated Repair Console
            </span>
            <span className="text-[10px] text-slate-400">Safe Sandbox Mode</span>
          </div>

          {/* Console Text block */}
          <div className="bg-slate-950 flex-1 p-5 font-mono text-[10px] text-slate-300 h-[280px] overflow-y-auto space-y-1.5">
            {resetTerminalLines.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-3 text-center p-4">
                <Radio className="h-9 w-9 text-slate-700 animate-pulse" />
                <div>
                  <p className="font-bold text-xs text-slate-400">Ready to repair</p>
                  <p className="text-[10px] text-slate-600 mt-1">
                    Click the button below to simulate running the diagnostic-level VPN settings repair on your laptop.
                  </p>
                </div>
              </div>
            ) : (
              resetTerminalLines.map((line, idx) => {
                let color = "text-slate-300";
                if (line.includes(">> STEP")) color = "text-bnp-green font-semibold";
                else if (line.includes("SUCCESS") || line.includes("Handshake validated")) color = "text-emerald-400";
                else if (line.includes("Stopping") || line.includes("Cleared")) color = "text-amber-400";
                else if (line.startsWith("   ")) color = "text-slate-400";
                
                return (
                  <div key={idx} className={`${color} leading-relaxed`}>
                    {line}
                  </div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* Bottom trigger action button */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            {isCompleted && (
              <div className="bg-bnp-green-light border border-bnp-green/20 p-3.5 rounded-xl text-xs space-y-1 text-center">
                <p className="font-bold text-bnp-green flex items-center justify-center gap-1.5">
                  <CheckCircle className="h-4 w-4" /> VPN Repair Done!
                </p>
                <p className="text-[10px] text-slate-600">Your network adapter MTU size is successfully locked to 1400. Connection drops stopped.</p>
              </div>
            )}

            {!isCompleted ? (
              <button
                onClick={triggerResetSimulation}
                disabled={isResetting}
                className="w-full bg-bnp-green hover:bg-bnp-green-hover disabled:bg-slate-100 disabled:text-slate-400 text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-bnp-green/10 flex items-center justify-center gap-2 transition-all duration-200"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Applying Handshake Optimization...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Run VPN Repair Tool</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={triggerResetSimulation}
                disabled={isResetting}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Re-run VPN Repair</span>
              </button>
            )}

            {/* Advanced power user code details */}
            <details className="group pt-1">
              <summary className="text-[11px] font-semibold text-slate-500 hover:text-slate-755 cursor-pointer list-none flex justify-between items-center select-none">
                <span className="flex items-center gap-1">
                  <Code2 className="h-3.5 w-3.5" />
                  View PowerShell Repair Commands
                </span>
                <span className="transition group-open:rotate-180 text-[10px]">&darr;</span>
              </summary>
              <div className="mt-3 space-y-2 text-xs">
                <div className="relative">
                  <button 
                    onClick={() => copyCode(issues[activeIssue].psCode)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
                  >
                    {copiedCode === 'copied' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[9px] text-bnp-green-light overflow-x-auto max-h-[100px] leading-relaxed">
                    {issues[activeIssue].psCode}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        </div>

      </div>

      {/* Manual support check suggestions */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-bnp-green" />
          General home Wi-Fi tips to avoid disconnects
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-1.5">
            <h4 className="font-bold text-slate-805">1. Prefer 5GHz over 2.4GHz Wi-Fi</h4>
            <p className="text-slate-650 leading-relaxed">
              Standard 2.4GHz networks get heavy interference from household appliances (microwaves, baby monitors). This introduces brief micro-drops. Cisco client disconnects immediately on micro-drops. Connect to your router's 5GHz Wi-Fi band instead.
            </p>
          </div>
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-1.5">
            <h4 className="font-bold text-slate-805">2. Turn off SIP ALG on router</h4>
            <p className="text-slate-650 leading-relaxed">
              Most home internet boxes have a setting called "SIP ALG" (Application Layer Gateway) enabled. It tries to help but often intercepts, modifies, and drops secure corporate IPSec packet keys. Log into your router page and disable SIP ALG.
            </p>
          </div>
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-1.5">
            <h4 className="font-bold text-slate-805">3. Turn off competing VPNs</h4>
            <p className="text-slate-650 leading-relaxed">
              Personal gaming VPNs or privacy-centric browser extensions try to redirect all machine traffic. They conflict with Cisco Secure Client, causing socket binding errors. Keep personal VPNs completely disabled during WFH hours.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
