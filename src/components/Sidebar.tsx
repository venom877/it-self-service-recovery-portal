import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Trash2, 
  Clock, 
  ShieldAlert, 
  MonitorPlay, 
  Activity,
  Laptop,
  CheckCircle,
  AlertTriangle,
  Lock,
  Wrench,
  Presentation,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  storageReclaimed: number;
  ciscoResolvedCount: number;
  citrixResolvedCount: number;
  schedulesCount: number;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  storageReclaimed, 
  ciscoResolvedCount, 
  citrixResolvedCount,
  schedulesCount,
  isCollapsed,
  setIsCollapsed
}: SidebarProps) {

  const [isToolsCollapsed, setIsToolsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard' as TabType, label: 'Diagnostic Dashboard', icon: LayoutDashboard, subtitle: '1-Click PC Health Check', isMain: true },
    { id: 'cleanup' as TabType, label: 'Storage Booster', icon: Trash2, subtitle: 'Free up local disk space', isMain: false },
    { id: 'cisco' as TabType, label: 'Cisco VPN Fixer', icon: ShieldAlert, subtitle: 'Fix dropped connections', isMain: false },
    { id: 'citrix' as TabType, label: 'Citrix App Fixer', icon: MonitorPlay, subtitle: 'Fix launch & boot hangs', isMain: false },
    { id: 'scheduler' as TabType, label: 'Nightly Speedup', icon: Clock, subtitle: 'Auto off-peak optimizer', isMain: false },
    { id: 'lockscreen' as TabType, label: 'Lock-Screen Agent', icon: Lock, subtitle: 'Offline cert & login fixer', isMain: false },
    { id: 'configmgr' as TabType, label: 'ConfigMgr Upgrader', icon: Wrench, subtitle: 'Simultaneous cycle booster', isMain: false },
  ];

  // Derive simple health status variables
  const isDiskClean = storageReclaimed > 0;
  const isVpnFixed = ciscoResolvedCount > 0;
  const isCitrixFixed = citrixResolvedCount > 0;

  // Count active local warnings
  const activeWarningsCount = (isDiskClean ? 0 : 1) + (isVpnFixed ? 0 : 1) + (isCitrixFixed ? 0 : 1);

  return (
    <aside 
      className={`bg-white border-r border-slate-200 text-slate-700 flex flex-col justify-between h-full select-none shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-72'
      }`} 
      id="sidebar-container"
    >
      {/* Brand Header */}
      <div className={`p-4 border-b border-slate-100 flex flex-col justify-center ${isCollapsed ? 'h-16 items-center px-2' : 'p-6'}`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-bnp-green rounded-lg text-white shadow-md shadow-bnp-green/20 shrink-0">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            {!isCollapsed && (
              <div className="animate-fadeIn">
                <h1 className="font-bold text-slate-900 text-base leading-tight tracking-tight">PC Auto-Repair</h1>
                <p className="text-xs text-bnp-green font-semibold">Self-Service Diagnostic Hub</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-bnp-green transition cursor-pointer text-slate-400 ${
              isCollapsed ? 'mx-auto' : ''
            }`}
            title={isCollapsed ? "Expand sidebar navigation menu" : "Collapse sidebar navigation menu"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <div className={`flex-grow py-6 space-y-1 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {!isCollapsed ? (
          <div className="px-3 flex items-center justify-between mb-3 animate-fadeIn">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Self-Service Tools
            </p>
            <button 
              onClick={() => setIsToolsCollapsed(!isToolsCollapsed)}
              className="text-slate-400 hover:text-bnp-green transition p-1 rounded hover:bg-slate-100 cursor-pointer flex items-center justify-center"
              title={isToolsCollapsed ? "Expand troubleshooters list" : "Collapse troubleshooters list"}
            >
              {isToolsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>
          </div>
        ) : null}

        <nav className="space-y-2">
          {menuItems.map((item) => {
            // Hide sub-tools if collapsed (unless it is currently active)
            if (!isCollapsed && isToolsCollapsed && !item.isMain && activeTab !== item.id) {
              return null;
            }

            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            // Check if there is an alert flag on this item
            let hasIssue = false;
            if (item.id === 'cleanup' && !isDiskClean) hasIssue = true;
            if (item.id === 'cisco' && !isVpnFixed) hasIssue = true;
            if (item.id === 'citrix' && !isCitrixFixed) hasIssue = true;

            if (isCollapsed) {
              return (
                <div key={item.id} className="relative group flex justify-center">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer relative ${
                      isActive 
                        ? 'bg-bnp-green-light text-bnp-green border border-bnp-green/20' 
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                    }`}
                    title={item.label}
                  >
                    <IconComponent className="h-5 w-5 shrink-0" />
                    
                    {/* Badge over the icon corner */}
                    {hasIssue ? (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                    ) : item.id !== 'dashboard' && item.id !== 'scheduler' ? (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-bnp-green"></span>
                    ) : null}
                  </button>

                  {/* Elegant Floating Popover Tooltip */}
                  <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                    <span className="block font-bold">{item.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{item.subtitle}</span>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                id={`sidebar-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-bnp-green-light text-bnp-green border border-bnp-green/20' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-bnp-green/10 text-bnp-green' : 'bg-slate-100 text-slate-400'}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <span className={`block text-sm font-semibold leading-tight ${isActive ? 'text-bnp-green font-bold' : 'text-slate-700'}`}>{item.label}</span>
                    <span className="text-[10px] text-slate-400 truncate block">{item.subtitle}</span>
                  </div>
                </div>
                {hasIssue && (
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shrink-0 ml-1"></span>
                )}
                {!hasIssue && item.id !== 'dashboard' && item.id !== 'scheduler' && (
                  <span className="h-2 w-2 rounded-full bg-bnp-green shrink-0 ml-1"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Local Machine Telemetry Box */}
        {!isCollapsed ? (
          <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Laptop className="h-3.5 w-3.5 text-bnp-green" />
                This Machine Status
              </span>
              <span className="flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${activeWarningsCount > 0 ? 'bg-amber-500' : 'bg-bnp-green animate-pulse'}`}></span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  {activeWarningsCount > 0 ? `${activeWarningsCount} Alert${activeWarningsCount > 1 ? 's' : ''}` : 'Perfect'}
                </span>
              </span>
            </div>

            <div className="space-y-2 text-[11px] font-mono">
              <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                <span className="text-slate-400">Device ID:</span>
                <span className="font-bold text-slate-600">WFH-LP-773</span>
              </div>
              
              <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                <span className="text-slate-400">C: Storage:</span>
                {isDiskClean ? (
                  <span className="text-bnp-green font-bold flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Healthy
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-rose-500" /> Clean Needed
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                <span className="text-slate-400">VPN Handshake:</span>
                {isVpnFixed ? (
                  <span className="text-bnp-green font-bold flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> 1400 MTU
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-rose-500" /> MTU Clashed
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                <span className="text-slate-400">Citrix Connection:</span>
                {isCitrixFixed ? (
                  <span className="text-bnp-green font-bold flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Repaired
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-rose-500" /> Congested
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Mini Telemetry status light when collapsed */
          <div className="mt-8 flex justify-center">
            <div 
              className={`p-2.5 rounded-full border flex items-center justify-center relative group ${
                activeWarningsCount > 0 
                  ? 'bg-amber-50 border-amber-200 text-amber-500' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-500'
              }`}
            >
              <Laptop className="h-4 w-4" />
              <span className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ${
                activeWarningsCount > 0 ? 'bg-amber-500' : 'bg-bnp-green animate-pulse'
              }`}></span>

              {/* Hover Popover */}
              <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-mono p-3 rounded-lg whitespace-nowrap shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                <span className="block font-bold text-slate-300 border-b border-slate-800 pb-1 mb-1">Device: WFH-LP-773</span>
                <span className="block text-slate-400">Status: {activeWarningsCount > 0 ? `${activeWarningsCount} Alert(s) Outstanding` : 'All Systems Nominal'}</span>
                <span className="block text-slate-400">Storage: {isDiskClean ? 'Healthy' : 'Needs Cleanup'}</span>
                <span className="block text-slate-400">MTU Config: {isVpnFixed ? '1400 (Optimized)' : 'Clashed'}</span>
                <span className="block text-slate-400">Citrix: {isCitrixFixed ? 'Healthy' : 'Congested'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer system status */}
      <div className={`p-4 border-t border-slate-100 bg-slate-50 text-center ${isCollapsed ? 'px-1' : ''}`}>
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <div className="h-1.5 w-1.5 rounded-full bg-bnp-green animate-pulse shrink-0"></div>
          {!isCollapsed && <span className="animate-fadeIn">Continuous Self-Healing Active</span>}
        </div>
      </div>
    </aside>
  );
}
