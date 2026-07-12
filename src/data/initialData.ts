import { Ticket, ScheduleTask } from '../types';

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: "TKT-2026-081",
    user: "Sarah Jenkins",
    email: "sjenkins@corp.com",
    department: "Financial Operations",
    location: "WFH",
    subject: "Cisco Secure Client drops VPN connection every 15 minutes",
    description: "I am working from home today. My Cisco Secure Client connects successfully, but after 10-15 minutes, the connection drops with error 'The VPN connection was terminated by the peer. Reason: Idle Timeout or MTU Mismatch'. This is interrupting my Excel ledger syncing.",
    category: "cisco",
    priority: "high",
    status: "open",
    createdAt: "2026-06-25T08:12:00Z",
    suggestedAction: "Reset MTU binding, clear CSC local profile cache, and flush routing tables.",
    resolutionSteps: [
      "Open command prompt as Administrator",
      "Run 'netsh interface ipv4 show subinterfaces' to find the Wi-Fi or Ethernet adapter name",
      "Execute 'netsh interface ipv4 set subinterface \"[Adapter Name]\" mtu=1400 store=persistent' to align with ISP encapsulation limits",
      "Run 'C:\\Program Files (x86)\\Cisco\\Cisco Secure Client\\vpncli.exe' with profile clear-cache flags",
      "Perform clean flush of DNS resolver cache ('ipconfig /flushdns')"
    ]
  },
  {
    id: "TKT-2026-082",
    user: "Marcus Vance",
    email: "mvance@corp.com",
    department: "Engineering Development",
    location: "WFH",
    subject: "Citrix Virtual Machine doesn't start - stuck on 'Launching...'",
    description: "I am trying to launch my dedicated Windows VM through Citrix Workspace. It gets stuck on the 'Starting...' overlay, and after 2 minutes it disappears with error code 1030 (Connection timeout). My local receiver cache might be corrupted.",
    category: "citrix",
    priority: "critical",
    status: "open",
    createdAt: "2026-06-25T07:45:00Z",
    suggestedAction: "Reset Citrix Receiver Local cache, restart Citrix Web Helper Service, and purge stale ICA sessions.",
    resolutionSteps: [
      "Kill all active Citrix Receiver/Workspace processes in Task Manager",
      "Rename or clear '%LocalAppData%\\Citrix\\SelfService\\Cache'",
      "Restart the local Citrix Web Helper service in Services.msc",
      "Download and run Citrix Workspace Reset Utility or execute registry cache purge",
      "Initiate force logoff of any orphaned terminal service sessions on the virtual host"
    ]
  },
  {
    id: "TKT-2026-083",
    user: "Elena Rostova",
    email: "erostova@corp.com",
    department: "Customer Success",
    location: "Office",
    subject: "Low Disk Space - Machine severely sluggish, temp bloat suspected",
    description: "My laptop has become painfully slow. Excel takes 5 minutes to open, and I am getting persistent 'Your local disk C: is running out of space' alerts. Our security scanner generates massive temp files.",
    category: "cleanup",
    priority: "medium",
    status: "open",
    createdAt: "2026-06-25T06:30:00Z",
    suggestedAction: "Execute automated cleanup script for temporary files, %temp%, and Prefetch directories.",
    resolutionSteps: [
      "Purge standard user Temp directory (%temp%)",
      "Clean up system temporary directory (C:\\Windows\\Temp)",
      "Clear obsolete Prefetch application traces (C:\\Windows\\Prefetch)",
      "Remove temporary browser build storage and windows update log archives",
      "Recalculate disk space savings dynamically"
    ]
  },
  {
    id: "TKT-2026-084",
    user: "David Thorne",
    email: "dthorne@corp.com",
    department: "Quality Assurance",
    location: "Office",
    subject: "Automated off-peak driver updates and kernel patches",
    description: "Requesting server group QA-SRV-109 to be updated with the latest NVidia and Intel NIC driver patches. These need to be run during off-peak hours (12:00 AM - 5:00 AM) to prevent any performance hit or session loss during active test runs.",
    category: "scheduler",
    priority: "low",
    status: "open",
    createdAt: "2026-06-25T05:15:00Z",
    suggestedAction: "Configure and schedule off-peak patch deployment block (target: QA-SRV-109, time: 01:30 AM).",
    resolutionSteps: [
      "Audit target server active network adapters and graphics drivers",
      "Download approved stable WHQL driver cabinets from corporate repository",
      "Create high-availability snapshot before applying driver payload",
      "Schedule silent driver update execution at 1:30 AM using PowerShell Task Scheduler",
      "Set auto-reboot trigger with delayed notification to logoff any active session gracefully"
    ]
  }
];

export const INITIAL_SCHEDULES: ScheduleTask[] = [
  {
    id: "SCH-101",
    title: "SQL-DB-02 Critical Security Patching",
    type: "patch",
    target: "Production SQL Cluster (Primary)",
    time: "02:00 AM",
    frequency: "monthly",
    status: "active",
    lastRun: "2026-05-25"
  },
  {
    id: "SCH-102",
    title: "QA-Laptops Graphics Driver Push",
    type: "driver",
    target: "QA Department (Dell Latitude Core)",
    time: "01:00 AM",
    frequency: "weekly",
    status: "pending",
    lastRun: "2026-06-18"
  },
  {
    id: "SCH-103",
    title: "Core Service Desk Host Cleanup Cycle",
    type: "clean",
    target: "All VM Desktops (Standard VDI)",
    time: "03:30 AM",
    frequency: "daily",
    status: "active",
    lastRun: "2026-06-24"
  }
];
