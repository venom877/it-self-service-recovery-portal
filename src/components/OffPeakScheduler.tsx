import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Cpu, 
  Activity, 
  Server,
  Zap,
  Sliders,
  BellRing
} from 'lucide-react';

interface ScheduleTask {
  id: string;
  title: string;
  type: 'driver' | 'patch' | 'clean';
  time: string;
  frequency: string;
  status: 'active' | 'completed';
}

export default function OffPeakScheduler() {
  const [sleepTime, setSleepTime] = useState('02:00 AM');
  const [autoSpeedup, setAutoSpeedup] = useState(true);
  
  const [schedules, setSchedules] = useState<ScheduleTask[]>([
    {
      id: "SCH-1",
      title: "Daily Storage & Application Junk Purge",
      type: "clean",
      time: "02:00 AM",
      frequency: "Every Night",
      status: "active"
    },
    {
      id: "SCH-2",
      title: "Weekly Windows Security Rollouts",
      type: "patch",
      time: "02:30 AM",
      frequency: "Every Wednesday",
      status: "active"
    },
    {
      id: "SCH-3",
      title: "Weekend Graphics & Wi-Fi Driver Optimization",
      type: "driver",
      time: "03:00 AM",
      frequency: "Every Sunday",
      status: "active"
    }
  ]);

  const handleToggleSpeedup = () => {
    setAutoSpeedup(!autoSpeedup);
  };

  // Allow custom schedule addition in a simple customer-centric way (e.g. "Add a custom sleep scan")
  const [customTitle, setCustomTitle] = useState('');
  const [customType, setCustomType] = useState<'driver' | 'patch' | 'clean'>('clean');

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle) return;

    const newTask: ScheduleTask = {
      id: `SCH-${Date.now()}`,
      title: customTitle,
      type: customType,
      time: sleepTime,
      frequency: "Daily",
      status: "active"
    };

    setSchedules(prev => [...prev, newTask]);
    setCustomTitle('');
  };

  const handleDelete = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6" id="offpeak-scheduler-view">
      
      {/* Title Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Clock className="h-5 w-5 text-bnp-green" />
          Set & Forget Nightly Speedup Scheduler
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Don't let computer updates slow down your active working day. Enable auto-pilot to apply secure patches and clean disk storage silently overnight while you sleep.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Pane: Simple Customer Toggles & Schedule List (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-6">
            
            {/* Auto Speedup master toggle card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Master Auto-Pilot Control</span>
                <h3 className="font-extrabold text-slate-800 text-base">Nightly Optimization Scan</h3>
                <p className="text-[11px] text-slate-600 max-w-sm">
                  When turned on, your computer safely cleans temporary storage caches and checks Wi-Fi driver versions automatically.
                </p>
              </div>

              <button
                onClick={handleToggleSpeedup}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  autoSpeedup 
                    ? 'bg-bnp-green hover:bg-bnp-green-hover text-white shadow-md shadow-bnp-green/10' 
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                {autoSpeedup ? '● Auto-Pilot Active' : '○ Disabled'}
              </button>
            </div>

            {/* Customizer: When do you sleep? */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                1. Choose your preferred sleep hours
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">When do you sleep?</label>
                  <select
                    value={sleepTime}
                    onChange={(e) => {
                      setSleepTime(e.target.value);
                      // Update active times in list
                      setSchedules(prev => prev.map(s => ({ ...s, time: e.target.value })));
                    }}
                    className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-bnp-green transition-all"
                  >
                    <option value="11:00 PM">11:00 PM</option>
                    <option value="12:00 AM">12:00 AM (Midnight)</option>
                    <option value="01:00 AM">01:00 AM</option>
                    <option value="02:00 AM">02:00 AM (Recommended)</option>
                    <option value="03:00 AM">03:00 AM (Recommended)</option>
                    <option value="04:00 AM">04:00 AM</option>
                  </select>
                </div>

                <div className="text-[11px] text-slate-650 flex items-center leading-relaxed">
                  Select a time when your PC is turned on but idle. Optimizations take about 2-3 minutes and complete silently.
                </div>
              </div>
            </div>

            {/* Active Schedule Cards list */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex justify-between">
                <span>Auto-Pilot Schedule ({schedules.length} Items)</span>
                {autoSpeedup && (
                  <span className="text-[10px] text-bnp-green font-mono flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-bnp-green animate-pulse"></span>
                    Arming tonight at {sleepTime}
                  </span>
                )}
              </h4>

              <div className="space-y-2">
                {schedules.map((task) => (
                  <div key={task.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl border shrink-0 ${
                        task.type === 'driver' ? 'bg-bnp-green-light border-bnp-green/20 text-bnp-green' :
                        task.type === 'patch' ? 'bg-amber-500/10 border-amber-500/25 text-amber-700' :
                        'bg-bnp-green-light border-bnp-green/20 text-bnp-green'
                      }`}>
                        {task.type === 'driver' && <Cpu className="h-4 w-4" />}
                        {task.type === 'patch' && <Server className="h-4 w-4" />}
                        {task.type === 'clean' && <Activity className="h-4 w-4" />}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">{task.title}</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Timing: {task.frequency}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-slate-800 block">{task.time}</span>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase ${
                          autoSpeedup && task.status === 'active' ? 'bg-bnp-green-light text-bnp-green border border-bnp-green/20' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {autoSpeedup ? 'Scheduled' : 'Paused'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Pane: Non-technical Benefit Explanations (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-bnp-green animate-pulse" />
                Why use Nightly Scheduler?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Understanding daytime speed preservation.</p>
            </div>

            {/* Graphic Timeline Benefit widget */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
              
              {/* Daytime installation impacts (Bad) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-rose-700 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> Daytime Installs (9 AM - 5 PM)
                  </span>
                  <span className="font-mono text-slate-500">82% Work Interruption</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-2.5 rounded-full animate-pulse" style={{ width: '85%' }}></div>
                </div>
                <p className="text-[10px] text-slate-600 leading-normal">
                  Windows update dialogs pop up mid-meeting. Driver installations restart your Wi-Fi card, dropping active Citrix desktop or Cisco VPN client sessions.
                </p>
              </div>

              {/* Nightly auto updates benefits (Good) */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-bnp-green flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Nightly Auto-Pilot (12 AM - 5 AM)
                  </span>
                  <span className="font-mono text-slate-500">0% Work Interruption</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-bnp-green h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-[10px] text-slate-600 leading-normal">
                  All security updates occur silently inside isolated sleep slots. Space recovery clears disk caches. Machine restarts happen before your morning alarm rings.
                </p>
              </div>

            </div>

            {/* Safe Speed Booster info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs text-slate-600">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-600" />
                Automatic Speed Boost Advantages
              </h4>
              <ul className="list-disc pl-4 space-y-1.5 text-[11px] leading-relaxed">
                <li>Prevents browser caches from slowing down online apps.</li>
                <li>Ensures latest Wi-Fi NIC firmware driver protects home connection stability.</li>
                <li>Saves local energy while preventing hot daytime CPU throttling.</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs">
            <BellRing className="h-4.5 w-4.5 text-bnp-green animate-pulse shrink-0" />
            <span className="text-slate-500 leading-snug">
              Pro-Tip: Keep your laptop plugged into power and connected to Wi-Fi overnight so updates apply perfectly.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
