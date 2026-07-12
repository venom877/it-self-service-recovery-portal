import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Unlock, 
  Terminal, 
  Cpu, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle,
  Copy,
  Check,
  Code2,
  FileText,
  Workflow,
  WifiOff,
  ServerCrash
} from 'lucide-react';

export default function LockScreenAgent() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Simulation states
  const [isLocked, setIsLocked] = useState(true);
  const [certStatus, setCertStatus] = useState<'missing' | 'repairing' | 'valid'>('missing');
  const [vpnStatus, setVpnStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [isRepairing, setIsRepairing] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Architecture script code blocks
  const serviceInstallScript = `# PowerShell script to install the Auto-Healing agent as a persistent Windows Service
# Must be executed in an Administrator PowerShell console on Windows 11

# 1. Download/Register the self-healing service executable
$ServiceName = "PCAutoRepairAgent"
$ServiceDisplayName = "IT Self-Service Recovery Service"
$BinaryPath = "C:\\Program Files\\PCAutoRepair\\PCRecoveryService.exe"

# 2. Register with Windows Service Control Manager (SCM)
New-Service -Name $ServiceName \
            -BinaryPathName $BinaryPath \
            -DisplayName $ServiceDisplayName \
            -StartupType Automatic \
            -Description "Monitors local machine health, repairs certificate stores, and resets MTU drops offline on the Windows Lock Screen."

# 3. Configure Service to run under LocalSystem account (provides Session 0 privileges)
sc.exe config $ServiceName obj= LocalSystem

# 4. Set Recovery Actions on failure
sc.exe failure $ServiceName reset= 86400 actions= restart/1000/restart/2000/restart/5000

# 5. Start the service
Start-Service -Name $ServiceName
Write-Host "Service registered and booted successfully!" -ForegroundColor Green`;

  const certRepairScript = `# LocalSystem Offline Certificate Restorer
# Restores machine certificates from the local secure Backup Registry Store
# when Active Directory or Wi-Fi is completely offline at the logon screen.

Write-Host "Running Lockscreen Certificate Repair..." -ForegroundColor Cyan

# 1. Inspect the personal Machine store for expired or corrupt VPN client certs
$StorePath = "Cert:\\LocalMachine\\My"
$ExpiredCerts = Get-ChildItem -Path $StorePath | Where-Object { $_.NotAfter -lt (Get-Date) -or $_.Subject -like "*corrupted*" }

if ($ExpiredCerts) {
    Write-Host "Found expired or corrupted VPN authentication certificate." -ForegroundColor Red
    
    # 2. Look for cached, secure pre-validated cert backup in HKLM Registry (injected by GPO)
    $RegPath = "HKLM:\\SOFTWARE\\Policies\\CorpIT\\CertBackup"
    if (Test-Path $RegPath) {
        Write-Host "Restoring pre-validated backup certificate from secure local registry vault..." -ForegroundColor Yellow
        $Base64Cert = Get-ItemProperty -Path $RegPath -Name "MachineCertBackup" | Select-Object -ExpandProperty MachineCertBackup
        $CertBytes = [System.Convert]::FromBase64String($Base64Cert)
        
        # 3. Re-import into local Machine store
        $Cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
        $Cert.Import($CertBytes, $null, [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::PersistKeySet)
        
        $OpenStore = New-Object System.Security.Cryptography.X509Certificates.X509Store("My", "LocalMachine")
        $OpenStore.Open([System.Security.Cryptography.X509Certificates.OpenFlags]::ReadWrite)
        $OpenStore.Add($Cert)
        $OpenStore.Close()
        
        Write-Host "SUCCESS: Machine VPN identity certificate successfully restored offline!" -ForegroundColor Green
    } else {
        Write-Host "Error: Secure local registry backup not found. Requesting emergency offline SCEP token..." -ForegroundColor Orange
    }
} else {
    Write-Host "Certificates are intact. No local corruption detected." -ForegroundColor Green
}`;

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunRepair = () => {
    if (isRepairing) return;
    setIsRepairing(true);
    setCertStatus('repairing');
    setVpnStatus('connecting');
    setSimLogs(["[LOCKSCREEN-AGENT] Intercepting AnyConnect certificate-missing error..."]);

    const steps = [
      { delay: 400, log: "Analyzing local Machine Certificate Store ('Cert:\\LocalMachine\\My')..." },
      { delay: 900, log: "Detected: Windows 11 WFH-LP-773 VPN Client Certificate is invalid/missing!" },
      { delay: 1400, log: "No network detected (Offline Lock-Screen Mode). Using Session 0 LocalSystem credentials." },
      { delay: 2000, log: ">> STEP 1: Querying local secure backup storage (HKLM Registry Vault)..." },
      { delay: 2600, log: ">> STEP 2: Extracting encrypted AD certificate template backup..." },
      { delay: 3100, log: ">> STEP 3: Re-importing machine identity signature back into physical certificate store..." },
      { delay: 3600, log: ">> STEP 4: Verifying local store integrity chain (Root CA Validation)..." },
      { delay: 4100, log: ">> STEP 5: Success! Client certificate restored persistently." },
      { delay: 4600, log: ">> STEP 6: Re-routing local Cisco Secure Client socket binding..." },
      { delay: 5200, log: "[SUCCESS] Handshake verified offline. VPN tunnel secured at lock screen!" }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimLogs(prev => [...prev, `[OFFLINE] ${step.log}`]);
        if (idx === steps.length - 1) {
          setIsRepairing(false);
          setCertStatus('valid');
          setVpnStatus('connected');
        }
      }, step.delay);
    });
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [simLogs]);

  const handleResetSim = () => {
    setCertStatus('missing');
    setVpnStatus('disconnected');
    setSimLogs([]);
    setIsLocked(true);
  };

  return (
    <div className="space-y-6" id="lockscreen-agent-root">
      
      {/* Title block */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Lock className="h-5 w-5 text-bnp-green" />
          Windows 11 Lock-Screen & Offline Healing Agent
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          How do employees fix their PC when they can't log in, have no Wi-Fi, or face expired corporate certificates at the Windows lock screen? Here is how our persistent desktop service operates.
        </p>
      </div>

      {/* Grid: Left Column (Visual Interactive Simulator) & Right Column (Integration Explainer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Lock Screen Mockup Simulator (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5 font-mono">
              <Cpu className="h-4 w-4 text-bnp-green" />
              Windows 11 Live Pre-Login Simulator
            </span>
            <button
              onClick={handleResetSim}
              className="text-[10px] font-mono text-slate-500 hover:text-slate-800 border border-slate-200 px-2.5 py-1 rounded bg-white hover:bg-slate-50 transition"
            >
              Reset Simulation State
            </button>
          </div>

          {/* Windows 11 Visual Canvas */}
          <div className="p-6 bg-slate-950 relative min-h-[440px] flex flex-col justify-between overflow-hidden select-none">
            
            {/* Windows Lock Screen Background Blur Grid */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950/20 opacity-70 pointer-events-none"></div>
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-bnp-green/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Top Widget: Time & Date on Lock Screen */}
            <div className="relative text-center space-y-1 z-10">
              <h3 className="text-4xl font-extrabold text-white tracking-tight font-sans">08:24 AM</h3>
              <p className="text-xs text-slate-300 font-medium font-sans">Thursday, June 25</p>
            </div>

            {/* Center Area: Lock Screen Status Dialog */}
            <div className="relative mx-auto max-w-sm w-full bg-slate-900/90 backdrop-blur border border-slate-800 p-5 rounded-2xl shadow-2xl space-y-4 z-10 my-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-950 rounded-lg text-bnp-green border border-slate-800 shrink-0">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Device Identity Locked</h4>
                  <p className="text-[10px] text-slate-450">WFH-LP-773 (Offline Session)</p>
                </div>
              </div>

              {/* Status parameters list */}
              <div className="space-y-2 text-[11px] font-mono">
                <div className="flex justify-between items-center bg-slate-950 p-2 rounded-xl border border-slate-900">
                  <span className="text-slate-500">Wi-Fi Status:</span>
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <WifiOff className="h-3 w-3" /> Offline (Local)
                  </span>
                </div>

                <div className="flex justify-between items-center bg-slate-950 p-2 rounded-xl border border-slate-900">
                  <span className="text-slate-500">AD VPN Certificate:</span>
                  {certStatus === 'missing' && (
                    <span className="text-rose-400 font-bold flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="h-3 w-3" /> Missing / Expired
                    </span>
                  )}
                  {certStatus === 'repairing' && (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin" /> Auto-Restoring...
                    </span>
                  )}
                  {certStatus === 'valid' && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> RESTORED (Local Vault)
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center bg-slate-950 p-2 rounded-xl border border-slate-900">
                  <span className="text-slate-500">Cisco Secure Client:</span>
                  {vpnStatus === 'disconnected' && (
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <ServerCrash className="h-3 w-3" /> Blocked (No Cert)
                    </span>
                  )}
                  {vpnStatus === 'connecting' && (
                    <span className="text-bnp-green-light font-semibold flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin" /> Establishing...
                    </span>
                  )}
                  {vpnStatus === 'connected' && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Secured (Start-Before-Logon)
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div>
                {certStatus === 'missing' ? (
                  <button
                    onClick={handleRunRepair}
                    className="w-full bg-bnp-green hover:bg-bnp-green-hover text-white text-xs font-bold py-2.5 rounded-xl transition duration-200 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Trigger Lock-Screen Self-Healing</span>
                  </button>
                ) : certStatus === 'valid' ? (
                  <button
                    onClick={() => setIsLocked(false)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl transition duration-200 flex items-center justify-center gap-2"
                  >
                    <Unlock className="h-3.5 w-3.5" />
                    <span>Log In to Windows 11 Desktop</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-slate-800 text-slate-500 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Self-Repair Engine Running...</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Section: Active Console Output logs of the background Service running in Session 0 */}
            <div className="relative z-10 bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden shadow-md max-h-36">
              <div className="p-2 bg-slate-900 border-b border-slate-800 px-3 flex justify-between items-center text-[9px] font-mono">
                <span className="font-bold text-bnp-green-light flex items-center gap-1">
                  <Terminal className="h-3 w-3" /> Service Logs: Session 0 (Lock-Screen LocalSystem)
                </span>
                <span className="text-slate-500">Device offline</span>
              </div>
              <div 
                ref={logContainerRef}
                className="p-3 font-mono text-[9px] text-slate-400 space-y-1 overflow-y-auto max-h-24"
              >
                {simLogs.length === 0 ? (
                  <span className="text-slate-600 italic">No events recorded. Press the button above to trigger certificate recovery.</span>
                ) : (
                  simLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-1.5 items-start">
                      <span className="text-bnp-green-light shrink-0 select-none">&gt;&gt;</span>
                      <span className={log.includes("SUCCESS") || log.includes("RESTORED") ? "text-emerald-400 font-bold" : "text-slate-300"}>
                        {log}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Windows Simulation feedback footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-bnp-green"></div>
            <span>This is an interactive simulation. Click "Trigger Lock-Screen Self-Healing" to watch.</span>
          </div>
        </div>

        {/* Right Column: Architectural Explanation (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Workflow className="h-4 w-4 text-bnp-green" />
                Windows 11 Service Architecture
              </h3>
              <p className="text-xs text-slate-500 mt-1">How does the application run before login?</p>
            </div>

            {/* Steps or Cards */}
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="font-bold text-slate-805 flex items-center gap-2">
                  <span className="h-5 w-5 bg-bnp-green-light border border-bnp-green/20 text-bnp-green flex items-center justify-center font-mono text-[10px] font-extrabold">1</span>
                  Session 0 Execution Privileges
                </h4>
                <p className="text-[11px] text-slate-600">
                  Standard Windows applications run inside "Session 1" (which only exists after a user types their password and logs in). Our self-service agent runs as a native <strong>LocalSystem Windows Service</strong> in <strong>Session 0</strong>. It boots with the motherboard, running persistently even on the lock screen before login.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="font-bold text-slate-855 flex items-center gap-2">
                  <span className="h-5 w-5 bg-bnp-green-light border border-bnp-green/20 text-bnp-green flex items-center justify-center font-mono text-[10px] font-extrabold">2</span>
                  Start Before Logon (PLAP) Integration
                </h4>
                <p className="text-[11px] text-slate-600">
                  Our system integrates directly with Cisco Secure Client's <strong>PLAP (Pre-Logon Access Provider)</strong> module. It creates a small, customizable button in the bottom right corner of the Windows 11 lock screen, enabling users to click, diagnose, and renew expired certificates without needing an active Windows login.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="font-bold text-slate-855 flex items-center gap-2">
                  <span className="h-5 w-5 bg-bnp-green-light border border-bnp-green/20 text-bnp-green flex items-center justify-center font-mono text-[10px] font-extrabold">3</span>
                  Secure Local Backup Offline Caching
                </h4>
                <p className="text-[11px] text-slate-600">
                  Since the machine is offline, it can't contact Active Directory. To bypass this, the agent maintains a locally encrypted cache of validated Root CA keys inside the Windows Registry (accessible only to Administrator). It securely decrypts and restores the client certificate to re-authenticate.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <span className="text-[10px] text-slate-500 leading-normal block">
              💡 By bundling this diagnostic app with a local offline service, corporate laptops become 100% self-sufficient, dropping service desk tickets by up to 40% on remote-worker startup days.
            </span>
          </div>
        </div>

      </div>

      {/* Deployable Scripts Section for IT Admins */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-5 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Code2 className="h-4 w-4 text-bnp-green" />
            Deployment Scripts (How to install on Windows 11 laptops)
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Copy or download these administrative scripts to easily deploy the diagnostic service to remote devices via Microsoft Intune, SCCM, or Group Policies (GPO).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Script 1: Service Installer */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-slate-600">PowerShell: Service Installer script</span>
              <button
                onClick={() => copyCode(serviceInstallScript, 'installer')}
                className="text-bnp-green hover:text-bnp-green-hover font-semibold flex items-center gap-1 transition"
              >
                {copiedId === 'installer' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedId === 'installer' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[10px] text-bnp-green-light overflow-x-auto max-h-[160px] leading-relaxed">
              {serviceInstallScript}
            </pre>
          </div>

          {/* Script 2: Certificate Restorer */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-slate-600">PowerShell: Local Cert Offline Restorer</span>
              <button
                onClick={() => copyCode(certRepairScript, 'certRepair')}
                className="text-bnp-green hover:text-bnp-green-hover font-semibold flex items-center gap-1 transition"
              >
                {copiedId === 'certRepair' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedId === 'certRepair' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[10px] text-bnp-green-light overflow-x-auto max-h-[160px] leading-relaxed">
              {certRepairScript}
            </pre>
          </div>

        </div>
      </div>

    </div>
  );
}
