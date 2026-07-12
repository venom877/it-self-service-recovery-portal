import pptxgen from 'pptxgenjs';

export interface TechnicalStep {
  title: string;
  description: string;
  code: string;
}

export interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  metric: string;
  metricLabel: string;
  presenterNotes: string;
  buttonText: string;
  mockActionTitle: string;
  technicalSteps: TechnicalStep[];
}

export const SLIDES_DATA: SlideData[] = [
  {
    id: 1,
    title: "BNP Paribas WFH-PC Self-Healing & Diagnostic Agent",
    subtitle: "Eliminating Remote Worker Downtime with a 0% Idle Background Footprint",
    category: "Executive Vision",
    metric: "40%",
    metricLabel: "Service Desk Ticket Reduction",
    presenterNotes: "Good morning team, and welcome to the Executive overview of the WFH-PC Self-Healing Agent. Remote workers face unique IT deadlocks: when passwords expire, or Citrix fails, they have no VPN, so they cannot contact Active Directory. They get stuck. Our agent provides standard employees with single-click diagnostic tools to heal their laptop instantly, with zero remote control queues. Let's see how each module performs under the hood.",
    buttonText: "Launch Executive Briefing",
    mockActionTitle: "System Initialization Sequence",
    technicalSteps: [
      {
        title: "Service Standby Verification",
        description: "Ensures the service remains completely asleep (0% background RAM and CPU consumption) until the user requests a scan.",
        code: "Get-Service -Name 'BNP_SelfHealing' | Select-Object Status, StartupType"
      },
      {
        title: "Admin Privilege Elevation Check",
        description: "Confirms safe execution under the local computer admin authorization to execute repairs securely.",
        code: "[Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()"
      },
      {
        title: "Telemetry Hook Connection",
        description: "Binds the UI securely to local diagnostics without opening risky network listening ports.",
        code: "Test-NetConnection -ComputerName 'localhost' -Port 3000 -InformationLevel Quiet"
      }
    ]
  },
  {
    id: 2,
    title: "Module A: Storage Booster & Cache Purge Engine",
    subtitle: "Reclaiming Local Space Safe from Corporate Data Infringement",
    category: "Storage Optimization",
    metric: "10 GB+",
    metricLabel: "Average Reclaimed Disk Space",
    presenterNotes: "Here is Module A. Sluggish machines are often starved of disk space. Instead of a general clean which might risk personal files, this booster targets strictly stale corporate cached update folders, Microsoft Teams media buffers, and Windows system-level Pre-Fetch directories older than 24 hours. Click the simulation button to watch the background PowerShell delete routines run sequentially.",
    buttonText: "Trigger Storage Cleanup Simulation",
    mockActionTitle: "Background Cache Purge Routine",
    technicalSteps: [
      {
        title: "Purge Stale Temporary Files",
        description: "Force deletes local system temp folders and temporary logs.",
        code: "Remove-Item -Path 'C:\\Windows\\Temp\\*' -Recurse -Force -ErrorAction SilentlyContinue"
      },
      {
        title: "Flush Microsoft Teams Bloat",
        description: "Purges cached video frames and heavy thumbnail buffers from Teams folders.",
        code: "Remove-Item -Path '$env:APPDATA\\Microsoft\\Teams\\Cache\\*' -Recurse -Force"
      },
      {
        title: "Verify Reclaimed Space",
        description: "Calculates the exact bytes freed and updates the local user interface metrics.",
        code: "Get-WmiObject Win32_LogicalDisk -Filter \"DeviceID='C:'\" | Select-Object FreeSpace"
      }
    ]
  },
  {
    id: 3,
    title: "Module B: Cisco AnyConnect MTU Optimizer",
    subtitle: "Defeating Periodic Video Call Dropouts at the Router Layer",
    category: "VPN Connectivity",
    metric: "100%",
    metricLabel: "VPN Connection Stability",
    presenterNotes: "Many remote workers experience VPN drops every 10 minutes. This is usually caused by 'MTU packet fragmentation'—their home router is spitting out packages too large for corporate security firewalls. Instead of teaching the user how to configure their home router, our agent automatically optimizes the laptop's active network card persistently to 1400 MTU. Packet loss drops to zero instantly.",
    buttonText: "Simulate Network MTU Calibration",
    mockActionTitle: "Persistent MTU Configuration Run",
    technicalSteps: [
      {
        title: "Detect Active Connection Interface",
        description: "Finds the primary network adapter that is carrying the VPN connection.",
        code: "Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object Name, InterfaceDescription"
      },
      {
        title: "Apply 1400 MTU Persistently",
        description: "Decreases maximum packet size to avoid packet fragmentation dropping checkpoints.",
        code: "netsh interface ipv4 set subinterface \"Wi-Fi\" mtu=1400 store=persistent"
      },
      {
        title: "Flush DNS resolver cache",
        description: "Cleans local routing table cache to bind changes to Cisco AnyConnect Client instantly.",
        code: "Clear-DnsClientCache"
      }
    ]
  },
  {
    id: 4,
    title: "Module C: Citrix App Launch Repair Tool",
    subtitle: "Clearing Hung Receiver Background Sockets in 4 Seconds",
    category: "Virtual Workstations",
    metric: "4 Sec",
    metricLabel: "Average Repair Execution Time",
    presenterNotes: "When employees complain that Citrix stays on 'Launching...' forever, they usually restart their whole computer or call the Service Desk. The true culprit is a stale 'WFICA32' or 'AuthManConfig' process hung in Windows Session 1. This tool target-kills the hung threads, flushes Citrix Receiver local cached schemas, and forces a clean login session. Let's watch the PowerShell socket repair sequence.",
    buttonText: "Simulate Citrix Launcher Recovery",
    mockActionTitle: "Citrix Receiver Socket Flush",
    technicalSteps: [
      {
        title: "Terminate Frozen Citrix Tasks",
        description: "Forcefully kills hung back-end receiver engines blocking remote brokers.",
        code: "taskkill /f /im WFICA32.exe /im AuthManConfig.exe /im Receiver.exe"
      },
      {
        title: "Purge Stale Workspace Cache",
        description: "Clears corrupt local configuration caches in local profile directory.",
        code: "Remove-Item -Path '$env:LOCALAPPDATA\\Citrix\\SelfService\\*' -Recurse -Force"
      },
      {
        title: "Restart Citrix Workspace",
        description: "Boots a clean broker thread ready to receive secure virtual desktop feeds.",
        code: "Start-Process -FilePath 'C:\\Program Files (x86)\\Citrix\\ICA Client\\SelfServicePlugin\\SelfService.exe'"
      }
    ]
  },
  {
    id: 5,
    title: "Module D: Pre-Login Lock Screen Self-Healing Agent",
    subtitle: "Bypassing Remote Expired Certificate Deadlocks in Session 0",
    category: "Secure Pre-Logon",
    metric: "$0",
    metricLabel: "Emergency Courier Shipping Cost Saved",
    presenterNotes: "This slide details our most advanced breakthrough: the Pre-Login Lock-Screen Agent. When user certificates expire, they cannot connect to VPN, meaning they cannot connect to Active Directory to renew their certificate. This requires shipping the laptop back to the office! Our agent runs as a native Windows LocalSystem Service in Session 0. It renders a 'Self-Service' button on Cisco PLAP directly at the Windows Lock Screen. It securely restores backed-up certificate keys from physical motherboard storage to get the user connected before login.",
    buttonText: "Simulate Pre-Login Recovery",
    mockActionTitle: "Session 0 Pre-Login Diagnostic",
    technicalSteps: [
      {
        title: "Establish Session 0 System Authority",
        description: "Spawns the local service wrapper under the ultimate computer LocalSystem privileges.",
        code: "# Executing as: NT AUTHORITY\\SYSTEM at boot screen\nwhoami"
      },
      {
        title: "Retrieve Locally Encrypted Root CA Backup",
        description: "Unlocks the secure certificate cache from the Windows Registry store.",
        code: "Get-ItemProperty -Path 'HKLM:\\SOFTWARE\\BNP_SecureCache' -Name 'CachedCertBlob'"
      },
      {
        title: "Import Cert & Reconnect Cisco PLAP",
        description: "Restores the client certificate in the Computer Personal Store, re-arming VPN before login.",
        code: "Import-Certificate -FilePath 'C:\\Windows\\System32\\config\\cert.cer' -CertStoreLocation 'Cert:\\LocalMachine\\My'"
      }
    ]
  },
  {
    id: 6,
    title: "Module E: ConfigMgr simultaneous booster",
    subtitle: "Unifying SCCM Client Sync Actions to Stop Compliance Wait Times",
    category: "Systems Management",
    metric: "Simultaneous",
    metricLabel: "Parallel Evaluation Cycles",
    presenterNotes: "Lastly, we have Module E, the Configuration Manager Upgrader. Traditional SCCM clients execute their Machine Policy or Software Inventory checks hours apart. When an administrator pushes a critical security patch, remote workers are stuck waiting. This module triggers all 6 critical SCCM client cycles simultaneously via WMI scripts, repairs broken WMI namespaces offline, and flushes local update caches instantly. Let's inspect the synchronized WMI triggers.",
    buttonText: "Simulate Parallel SCCM Sync",
    mockActionTitle: "Simultaneous WMI Client Boost",
    technicalSteps: [
      {
        title: "Initiate Machine Policy Cycle",
        description: "Requests latest target deployments from corporate endpoint servers.",
        code: "Invoke-WMIMethod -Namespace 'root\\ccm' -Class 'SMS_Client' -Name 'TriggerSchedule' -ArgumentList '{00000000-0000-0000-0000-000000000021}'"
      },
      {
        title: "Trigger App Deployment Cycle",
        description: "Forces local software evaluation list to check for required installations.",
        code: "Invoke-WMIMethod -Namespace 'root\\ccm' -Class 'SMS_Client' -Name 'TriggerSchedule' -ArgumentList '{00000000-0000-0000-0000-000000000121}'"
      },
      {
        title: "Flush Stale WMI Repositories",
        description: "Ensures the SCCM broker runs without locked schemas or localized database errors.",
        code: "winmgmt /salvagerepository"
      }
    ]
  }
];

export const generatePptxPresentation = () => {
  const ppt = new pptxgen();
  ppt.layout = 'LAYOUT_16x9';

  const COLOR_PRIMARY = "00664F"; // BNP Paribas Green
  const COLOR_SECONDARY = "004231"; // Dark BNP Green
  const COLOR_LIGHT = "F8FAFC"; // Soft background
  const COLOR_TEXT_LIGHT = "FFFFFF";

  // Slide 1: Title Slide (Executive Theme)
  const slide1 = ppt.addSlide();
  slide1.background = { fill: COLOR_SECONDARY };
  
  slide1.addText("BNP PARIBAS\nWFH-PC Self-Healing & Diagnostic Agent", {
    x: 0.8,
    y: 2.0,
    w: 11.5,
    h: 2.2,
    fontSize: 34,
    bold: true,
    fontFace: "Segoe UI",
    color: COLOR_TEXT_LIGHT,
    align: "left",
  });

  slide1.addText("Eliminating Remote Workstation Downtime with On-Demand Standby Modules", {
    x: 0.8,
    y: 4.4,
    w: 11.5,
    h: 0.8,
    fontSize: 16,
    color: "A7F3D0",
    align: "left",
  });

  slide1.addText("Prepared for: IT Operations Management Team\nPresented by: Client Engineering Specialist\nStatus: 0% Background Footprint, Zero Remote Queue Delay", {
    x: 0.8,
    y: 5.8,
    w: 11.5,
    h: 1.2,
    fontSize: 11,
    fontFace: "Courier New",
    color: "E2E8F0",
    align: "left",
  });

  slide1.addNotes(SLIDES_DATA[0].presenterNotes);

  // Slides 2 to 6: Individual Modules
  SLIDES_DATA.slice(1).forEach((slideData) => {
    const slide = ppt.addSlide();
    slide.background = { fill: COLOR_LIGHT };

    // Header Background Accent Stripe
    slide.addShape(ppt.ShapeType.rect, {
      x: 0.0, y: 0.0, w: 13.33, h: 1.1, fill: { color: COLOR_PRIMARY }
    });

    slide.addText(`0${slideData.id}. ${slideData.category.toUpperCase()}`, {
      x: 0.6,
      y: 0.15,
      w: 12.0,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: "A7F3D0"
    });

    slide.addText(slideData.title, {
      x: 0.6,
      y: 0.45,
      w: 12.0,
      h: 0.5,
      fontSize: 20,
      bold: true,
      color: COLOR_TEXT_LIGHT
    });

    slide.addText(slideData.subtitle, {
      x: 0.6,
      y: 1.3,
      w: 12.0,
      h: 0.4,
      fontSize: 13,
      italic: true,
      color: "475569"
    });

    // Left Column: Core Business Impact & KPI Metric
    slide.addShape(ppt.ShapeType.roundRect, {
      x: 0.6, y: 1.9, w: 3.8, h: 4.6, fill: { color: "FFFFFF" }, line: { color: "CBD5E1", width: 1 }
    });

    slide.addText("TARGET BUSINESS METRIC", {
      x: 0.8, y: 2.1, w: 3.4, h: 0.3, fontSize: 10, bold: true, color: "64748B", align: "center"
    });

    slide.addText(slideData.metric, {
      x: 0.8, y: 2.6, w: 3.4, h: 1.0, fontSize: 42, bold: true, color: COLOR_PRIMARY, align: "center"
    });

    slide.addText(slideData.metricLabel, {
      x: 0.8, y: 3.7, w: 3.4, h: 0.4, fontSize: 12, bold: true, color: "334155", align: "center"
    });

    slide.addText("Business Impact:\nResolves remote employee laptop bottlenecks locally on-demand without scheduling remote control sessions.", {
      x: 0.8, y: 4.3, w: 3.4, h: 2.0, fontSize: 10, color: "64748B"
    });

    // Right Column: Technical Execution Steps & PowerShell Code
    slide.addShape(ppt.ShapeType.roundRect, {
      x: 4.8, y: 1.9, w: 7.9, h: 4.6, fill: { color: "0F172A" }
    });

    slide.addText("PowerShell Repair Script & WMI Commands Triggers:", {
      x: 5.0, y: 2.1, w: 7.5, h: 0.3, fontSize: 11, bold: true, color: "A7F3D0"
    });

    slide.addText(`Step 1: ${slideData.technicalSteps[0].title}\nCommand: ${slideData.technicalSteps[0].code}`, {
      x: 5.0, y: 2.5, w: 7.5, h: 1.1, fontSize: 9, fontFace: "Consolas", color: "E2E8F0"
    });

    slide.addText(`Step 2: ${slideData.technicalSteps[1].title}\nCommand: ${slideData.technicalSteps[1].code}`, {
      x: 5.0, y: 3.8, w: 7.5, h: 1.1, fontSize: 9, fontFace: "Consolas", color: "E2E8F0"
    });

    slide.addText(`Step 3: ${slideData.technicalSteps[2].title}\nCommand: ${slideData.technicalSteps[2].code}`, {
      x: 5.0, y: 5.1, w: 7.5, h: 1.1, fontSize: 9, fontFace: "Consolas", color: "E2E8F0"
    });

    slide.addNotes(slideData.presenterNotes);
  });

  ppt.writeFile({ fileName: "BNP_Paribas_WFH_PC_SelfHealing_Presentation.pptx" });
};

export const generateHtmlInteractiveDemo = () => {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BNP Paribas - WFH PC Self-Healing Agent (Interactive Pitch & Demo)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
    }
    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col justify-between">

  <!-- Main Corporate Navbar -->
  <header class="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
    <div class="flex items-center gap-3">
      <div class="h-9 w-9 bg-[#00664F] rounded-xl flex items-center justify-center text-white font-extrabold text-sm">
        BNP
      </div>
      <div>
        <h1 class="text-sm font-extrabold tracking-tight text-slate-900">BNP Paribas Group IT</h1>
        <p class="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">WFH PC Self-Healing Center</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <span class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-100">
        <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Interactive Demo Active
      </span>
    </div>
  </header>

  <!-- Interactive Demo Workplace -->
  <main class="max-w-7xl mx-auto w-full px-6 py-8 flex-grow grid grid-cols-1 xl:grid-cols-12 gap-8">
    
    <!-- Slide Thumbnails Selection (Left, 3 cols) -->
    <section class="xl:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 max-h-[700px] overflow-y-auto shadow-sm">
      <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
        📂 Slides Navigation
      </h3>
      <div class="flex flex-col gap-2" id="thumbnail-container">
        \${SLIDES_DATA.map((s, idx) => \`
          <button
            onclick="switchSlide(\${idx})"
            id="thumb-\${idx}"
            class="w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex gap-3 items-start outline-none"
          >
            <span class="font-mono text-xs font-bold text-slate-400 mt-0.5">0\${s.id}</span>
            <div class="space-y-0.5">
              <strong class="block text-xs text-slate-800 font-extrabold" id="thumb-cat-\${idx}">\${s.category}</strong>
              <p class="text-[10px] text-slate-400 truncate max-w-[180px]">\${s.title}</p>
            </div>
          </button>
        \`).join('')}
      </div>

      <div class="mt-auto border-t border-slate-100 pt-4 px-2">
        <div class="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/60 text-center">
          <span class="text-[10px] font-bold text-emerald-700 uppercase block tracking-wider">Presenting To</span>
          <span class="text-xs font-extrabold text-slate-800 block mt-0.5">IT Operations Manager</span>
        </div>
      </div>
    </section>

    <!-- Main Deck Stage Area (Right, 9 cols) -->
    <section class="xl:col-span-9 flex flex-col gap-6">
      
      <!-- Slide Presentation Viewport -->
      <div class="bg-slate-900 border border-slate-950 rounded-3xl p-8 relative min-h-[460px] flex flex-col justify-between shadow-xl text-white overflow-hidden">
        
        <!-- Ambient accents -->
        <div class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400"></div>

        <!-- Upper Deck Header -->
        <div class="relative z-10 flex justify-between items-start gap-6">
          <div class="space-y-2">
            <span id="slide-index" class="text-[10px] bg-emerald-600 text-white font-mono font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">
              SLIDE 01
            </span>
            <h2 id="slide-title" class="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Loading Slide Title...
            </h2>
            <p id="slide-subtitle" class="text-sm text-slate-300">
              Loading slide subtitle...
            </p>
          </div>

          <div class="shrink-0 p-3 bg-slate-800/85 border border-slate-700 rounded-2xl text-center min-w-[130px] shadow-sm">
            <span id="slide-metric-label" class="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
              REDUCED DESK TICKETS
            </span>
            <span id="slide-metric-val" class="text-2xl font-extrabold text-emerald-400 block mt-1">
              40%
            </span>
          </div>
        </div>

        <!-- Interactive Center Stage -->
        <div class="relative z-10 my-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <!-- Controller / Run Simulator -->
          <div class="lg:col-span-5 bg-slate-800/60 border border-slate-750 p-5 rounded-2xl flex flex-col justify-between gap-4">
            <div class="space-y-2">
              <h4 class="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
                ⚡ Interactive Button Demo
              </h4>
              <p class="text-[11px] text-slate-400 leading-relaxed">
                Click this button to see exactly what task this action performs on a remote computer and watch the live PowerShell logs trace.
              </p>
            </div>

            <div class="space-y-3">
              <button 
                onclick="triggerActiveSimulation()" 
                id="action-btn"
                class="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-lg transition duration-150 cursor-pointer text-center outline-none"
              >
                Launch Diagnostic Task
              </button>

              <div class="bg-slate-950 border border-slate-850 px-3.5 py-2.5 rounded-xl flex items-center justify-between text-[11px] font-mono">
                <span class="text-slate-400">Simulation Status:</span>
                <span id="simulation-status" class="text-emerald-400 font-bold uppercase">
                  Standby Active
                </span>
              </div>
            </div>
          </div>

          <!-- Command Logging Trace Terminal -->
          <div class="lg:col-span-7 bg-slate-950/90 border border-slate-850 p-5 rounded-2xl flex flex-col gap-3 min-h-[220px]">
            <h4 class="text-xs font-bold text-slate-300 flex items-center gap-2 font-mono">
              💻 PowerShell Background Tasks Output
            </h4>

            <div id="terminal-screen" class="flex-grow font-mono text-[10px] text-emerald-300 space-y-2 overflow-y-auto max-h-[190px] leading-relaxed p-1 bg-slate-950 rounded">
              <div class="text-slate-500">// Standby: Waiting for action simulation...</div>
            </div>
          </div>

        </div>

        <!-- Deck Slide Footer Indicators -->
        <div class="relative z-10 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-800/80 pt-4">
          <span class="font-mono uppercase tracking-wider">BNP Paribas Group IT Operations</span>
          <span id="slide-pagination" class="font-mono">Slide 1 of 6</span>
        </div>

      </div>

      <!-- Slide Controls Navigation -->
      <div class="flex justify-between items-center bg-white border border-slate-200 px-6 py-3.5 rounded-2xl shadow-sm">
        <span class="text-xs text-slate-500 font-medium">
          💡 Click any slide tab on the left thumbnail rail to instantly jump to that module.
        </span>
        <div class="flex gap-2">
          <button onclick="prevSlide()" class="px-4 py-2 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition shadow-sm outline-none cursor-pointer">
            Prev Slide
          </button>
          <button onclick="nextSlide()" class="px-4 py-2 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition shadow-sm outline-none cursor-pointer">
            Next Slide
          </button>
        </div>
      </div>

      <!-- Presenter notes (Read to Manager) -->
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2.5">
        <h3 class="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          🗣️ Speaker Notes (Read this to your IT Manager!)
        </h3>
        <p id="presenter-notes" class="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100 font-serif">
          Loading speaker notes...
        </p>
      </div>

    </section>

  </main>

  <!-- Interactive Slide Data & Script Logic -->
  <script>
    const slides = ${JSON.stringify(SLIDES_DATA.map(s => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      category: s.category,
      metric: s.metric,
      metricLabel: s.metricLabel,
      presenterNotes: s.presenterNotes,
      buttonText: s.buttonText,
      technicalSteps: s.technicalSteps
    })))};

    let currentIndex = 0;
    let isSimulating = false;

    function renderSlide() {
      const slide = slides[currentIndex];
      
      // Update Slide Info
      document.getElementById('slide-index').innerText = "SLIDE 0" + slide.id + " / " + slide.category;
      document.getElementById('slide-title').innerText = slide.title;
      document.getElementById('slide-subtitle').innerText = slide.subtitle;
      document.getElementById('slide-metric-val').innerText = slide.metric;
      document.getElementById('slide-metric-label').innerText = slide.metricLabel;
      document.getElementById('presenter-notes').innerText = '"' + slide.presenterNotes + '"';
      document.getElementById('action-btn').innerText = slide.buttonText;
      document.getElementById('slide-pagination').innerText = "Slide " + (currentIndex + 1) + " of " + slides.length;

      // Update Navigation State Look
      for (let i = 0; i < slides.length; i++) {
        const btn = document.getElementById("thumb-" + i);
        const cat = document.getElementById("thumb-cat-" + i);
        if (i === currentIndex) {
          btn.className = "w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex gap-3 items-start outline-none bg-emerald-50 border-emerald-500/35 text-emerald-800 shadow-sm";
          cat.className = "block text-xs font-extrabold text-emerald-800";
        } else {
          btn.className = "w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex gap-3 items-start outline-none bg-slate-50/50 border-transparent hover:bg-slate-100 text-slate-600";
          cat.className = "block text-xs font-extrabold text-slate-700";
        }
      }

      // Reset Terminal
      if (!isSimulating) {
        document.getElementById('terminal-screen').innerHTML = '<div class="text-slate-500">// Standby: Waiting for action simulation...</div>';
        document.getElementById('simulation-status').innerText = "Standby Active";
        document.getElementById('simulation-status').className = "text-emerald-400 font-bold uppercase";
      }
    }

    function switchSlide(idx) {
      if (isSimulating) return;
      currentIndex = idx;
      renderSlide();
    }

    function prevSlide() {
      if (isSimulating) return;
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
      renderSlide();
    }

    function nextSlide() {
      if (isSimulating) return;
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
      renderSlide();
    }

    function triggerActiveSimulation() {
      if (isSimulating) return;
      isSimulating = true;

      const slide = slides[currentIndex];
      const term = document.getElementById('terminal-screen');
      const statusEl = document.getElementById('simulation-status');

      statusEl.innerText = "Simulating Repair";
      statusEl.className = "text-amber-400 font-bold uppercase animate-pulse";
      term.innerHTML = '<div class="text-blue-400 font-bold">[INFO] Initializing Live Background Task Demo...</div>';

      setTimeout(() => {
        term.innerHTML += '<div class="text-slate-400 mt-2">[EXEC] Run Powershell Sequence:</div>';
        term.innerHTML += '<pre class="bg-black/40 p-2 rounded text-[9px] text-emerald-300 overflow-x-auto mt-1">' + slide.technicalSteps[0].code + '</pre>';
        term.innerHTML += '<div class="text-emerald-400 font-bold mt-1">✔ Successfully evaluated: ' + slide.technicalSteps[0].title + '</div>';
        term.scrollTop = term.scrollHeight;
      }, 1000);

      setTimeout(() => {
        term.innerHTML += '<div class="text-slate-400 mt-3">[EXEC] Run Powershell Sequence:</div>';
        term.innerHTML += '<pre class="bg-black/40 p-2 rounded text-[9px] text-emerald-300 overflow-x-auto mt-1">' + slide.technicalSteps[1].code + '</pre>';
        term.innerHTML += '<div class="text-emerald-400 font-bold mt-1">✔ Successfully applied: ' + slide.technicalSteps[1].title + '</div>';
        term.scrollTop = term.scrollHeight;
      }, 2500);

      setTimeout(() => {
        term.innerHTML += '<div class="text-slate-400 mt-3">[EXEC] Run Powershell Sequence:</div>';
        term.innerHTML += '<pre class="bg-black/40 p-2 rounded text-[9px] text-emerald-300 overflow-x-auto mt-1">' + slide.technicalSteps[2].code + '</pre>';
        term.innerHTML += '<div class="text-emerald-400 font-bold mt-1">✔ Successfully validated: ' + slide.technicalSteps[2].title + '</div>';
        term.innerHTML += '<div class="text-emerald-500 font-extrabold mt-2">[INFO] Diagnostic process finished with ExitCode: 0 (OK)</div>';
        term.scrollTop = term.scrollHeight;
        
        isSimulating = false;
        statusEl.innerText = "Completed Successfully";
        statusEl.className = "text-emerald-400 font-bold uppercase";
      }, 4200);
    }

    renderSlide();
  </script>

  <!-- Clean footer info -->
  <footer class="bg-slate-900 text-slate-500 text-center py-4 border-t border-slate-950 text-xs font-mono">
    © 2026 BNP Paribas Group. Provided strictly for Interactive Demonstration and Management Alignments.
  </footer>

</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const element = document.createElement("a");
  element.href = URL.createObjectURL(blob);
  element.download = "BNP-Paribas-WFH-InteractiveDemo.html";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
