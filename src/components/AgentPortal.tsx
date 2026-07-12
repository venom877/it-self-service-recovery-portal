import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Activity,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Filter,
  Plus,
  MoreVertical,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Monitor,
  Wifi,
  HardDrive,
  Shield,
  Cpu,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Ticket,
  UserCheck,
  Zap,
  Server,
} from 'lucide-react';

// Mock data for the dashboard
const mockMetrics = [
  { label: 'Active Tickets', value: 24, change: '+12%', trend: 'up', icon: Ticket, color: '#00D4AA' },
  { label: 'Resolved Today', value: 18, change: '+8%', trend: 'up', icon: CheckCircle2, color: '#00D4AA' },
  { label: 'Avg Response', value: '4.2m', change: '-15%', trend: 'down', icon: Clock, color: '#FFC107' },
  { label: 'System Health', value: '98%', change: '+2%', trend: 'up', icon: Activity, color: '#00D4AA' },
];

const mockTickets = [
  {
    id: 'TKT-001',
    user: 'Sarah Mitchell',
    email: 's.mitchell@bnp.com',
    department: 'Finance',
    issue: 'VPN disconnects during video calls',
    category: 'network',
    priority: 'high',
    status: 'open',
    time: '5 min ago',
    machine: 'WFH-LP-452',
  },
  {
    id: 'TKT-002',
    user: 'James Chen',
    email: 'j.chen@bnp.com',
    department: 'Trading',
    issue: 'Citrix workspace won\'t launch',
    category: 'citrix',
    priority: 'critical',
    status: 'in_progress',
    time: '12 min ago',
    machine: 'WFH-LP-891',
  },
  {
    id: 'TKT-003',
    user: 'Emma Wilson',
    email: 'e.wilson@bnp.com',
    department: 'HR',
    issue: 'Disk space running low',
    category: 'storage',
    priority: 'low',
    status: 'open',
    time: '28 min ago',
    machine: 'OFF-DK-234',
  },
  {
    id: 'TKT-004',
    user: 'Michael Brown',
    email: 'm.brown@bnp.com',
    department: 'Operations',
    issue: 'Certificate expired at login',
    category: 'certificate',
    priority: 'critical',
    status: 'open',
    time: '45 min ago',
    machine: 'WFH-LP-123',
  },
  {
    id: 'TKT-005',
    user: 'Lisa Anderson',
    email: 'l.anderson@bnp.com',
    department: 'Legal',
    issue: 'ConfigMgr not syncing updates',
    category: 'configmgr',
    priority: 'medium',
    status: 'resolved',
    time: '1 hour ago',
    machine: 'OFF-NY-567',
  },
];

const mockSystemStats = [
  { name: 'VPN Connections', value: 847, max: 1000, color: '#00D4AA' },
  { name: 'Citrix Sessions', value: 423, max: 500, color: '#DEDBC8' },
  { name: 'Storage Cleanup', value: 67, max: 100, color: '#FFC107' },
  { name: 'Cert Renewals', value: 12, max: 50, color: '#FF6B6B' },
];

const priorityColors = {
  critical: '#FF6B6B',
  high: '#FFC107',
  medium: '#00D4AA',
  low: '#DEDBC8',
};

const statusColors = {
  open: { bg: 'rgba(255, 193, 7, 0.15)', text: '#FFC107', border: 'rgba(255, 193, 7, 0.3)' },
  in_progress: { bg: 'rgba(0, 212, 170, 0.15)', text: '#00D4AA', border: 'rgba(0, 212, 170, 0.3)' },
  resolved: { bg: 'rgba(222, 219, 200, 0.1)', text: '#DEDBC8', border: 'rgba(222, 219, 200, 0.2)' },
};

const categoryIcons: Record<string, React.ReactNode> = {
  network: <Wifi className="w-4 h-4" />,
  citrix: <Monitor className="w-4 h-4" />,
  storage: <HardDrive className="w-4 h-4" />,
  certificate: <Shield className="w-4 h-4" />,
  configmgr: <Server className="w-4 h-4" />,
};

export default function AgentPortal() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'dashboard' | 'agents' | 'settings'>('tickets');
  const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = useMemo(() => {
    return mockTickets.filter(ticket => {
      const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
      const matchesSearch = searchQuery === '' || 
        ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [filterStatus, searchQuery]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-64 bg-[var(--bg-card)] border-r border-[var(--border)] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="font-display text-sm text-[var(--primary)]">Agent Portal</h1>
              <p className="text-[10px] text-[var(--text-muted)]">Service Desk</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`nav-item w-full ${activeTab === 'tickets' ? 'active' : ''}`}
          >
            <Ticket className="w-5 h-5" />
            <span>Tickets</span>
            <span className="ml-auto bg-[#FF6B6B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {mockTickets.filter(t => t.status === 'open').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`nav-item w-full ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('agents')}
            className={`nav-item w-full ${activeTab === 'agents' ? 'active' : ''}`}
          >
            <Users className="w-5 h-5" />
            <span>Endpoints</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`nav-item w-full ${activeTab === 'settings' ? 'active' : ''}`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>

        {/* User profile */}
        <div className="p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-elevated)]">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-black font-bold">
              VM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">Vijay Mane</p>
              <p className="text-[10px] text-[var(--text-muted)]">L2 Engineer</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors">
              <LogOut className="w-4 h-4 text-[var(--text-muted)]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-[var(--bg-card)] border-b border-[var(--border)] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-[var(--primary)]">
                {activeTab === 'tickets' && 'Ticket Queue'}
                {activeTab === 'dashboard' && 'System Dashboard'}
                {activeTab === 'agents' && 'Endpoint Management'}
                {activeTab === 'settings' && 'Settings'}
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                {activeTab === 'tickets' && `${filteredTickets.length} tickets • ${mockTickets.filter(t => t.status === 'open').length} open`}
                {activeTab === 'dashboard' && 'Real-time system monitoring'}
                {activeTab === 'agents' && 'Manage connected endpoints'}
                {activeTab === 'settings' && 'Configure portal preferences'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors">
                <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B6B] rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                  3
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockMetrics.map((metric, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="metric-card"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${metric.color}20` }}
                      >
                        <metric.icon className="w-6 h-6" style={{ color: metric.color }} />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        metric.trend === 'up' ? 'text-[#00D4AA]' : metric.trend === 'down' ? 'text-[#FF6B6B]' : 'text-[var(--text-muted)]'
                      }`}>
                        {getTrendIcon(metric.trend)}
                        <span>{metric.change}</span>
                      </div>
                    </div>
                    <div className="metric-value">{metric.value}</div>
                    <div className="metric-label">{metric.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* System Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Chart */}
                <div className="card p-6">
                  <h3 className="font-display text-lg text-[var(--primary)] mb-6">System Activity</h3>
                  <div className="space-y-4">
                    {mockSystemStats.map((stat, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[var(--text-secondary)]">{stat.name}</span>
                          <span className="text-sm font-mono text-[var(--text-primary)]">
                            {stat.value} / {stat.max}
                          </span>
                        </div>
                        <div className="h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                            transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: stat.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="card p-6">
                  <h3 className="font-display text-lg text-[var(--primary)] mb-6">Recent Actions</h3>
                  <div className="space-y-4">
                    {[
                      { action: 'VPN MTU optimized', user: 'System', time: '2 min ago', type: 'success' },
                      { action: 'Citrix cache flushed', user: 'Agent VM', time: '8 min ago', type: 'success' },
                      { action: 'Certificate restored', user: 'Agent VM', time: '15 min ago', type: 'warning' },
                      { action: 'Ticket escalated', user: 'Sarah M.', time: '23 min ago', type: 'error' },
                      { action: 'ConfigMgr sync triggered', user: 'System', time: '1 hour ago', type: 'success' },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-elevated)]"
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          item.type === 'success' ? 'bg-[#00D4AA]' :
                          item.type === 'warning' ? 'bg-[#FFC107]' : 'bg-[#FF6B6B]'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-[var(--text-primary)]">{item.action}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">by {item.user}</p>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)]">{item.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tickets View */}
          {activeTab === 'tickets' && (
            <div className="flex gap-6 h-full">
              {/* Ticket List */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Filters */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="portal-tabs">
                    {['all', 'open', 'in_progress', 'resolved'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`portal-tab ${filterStatus === status ? 'active' : ''}`}
                      >
                        {status === 'all' ? 'All' : status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>

                  <button className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-black font-medium text-sm hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4" />
                    New Ticket
                  </button>
                </div>

                {/* Ticket Cards */}
                <div className="space-y-3">
                  <AnimatePresence>
                    {filteredTickets.map((ticket, idx) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`ticket-card ${selectedTicket?.id === ticket.id ? 'selected' : ''}`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${priorityColors[ticket.priority as keyof typeof priorityColors]}20` }}
                          >
                            <span style={{ color: priorityColors[ticket.priority as keyof typeof priorityColors] }}>
                              {categoryIcons[ticket.category]}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-[var(--text-muted)]">{ticket.id}</span>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor: statusColors[ticket.status as keyof typeof statusColors].bg,
                                  color: statusColors[ticket.status as keyof typeof statusColors].text,
                                  borderColor: statusColors[ticket.status as keyof typeof statusColors].border,
                                }}
                              >
                                {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                              </span>
                            </div>

                            <h4 className="text-sm font-medium text-[var(--text-primary)] mb-1 truncate">
                              {ticket.issue}
                            </h4>

                            <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                              <span>{ticket.user}</span>
                              <span>•</span>
                              <span>{ticket.department}</span>
                              <span>•</span>
                              <span>{ticket.machine}</span>
                              <span>•</span>
                              <span>{ticket.time}</span>
                            </div>
                          </div>

                          <button className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors">
                            <MoreVertical className="w-4 h-4 text-[var(--text-muted)]" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredTickets.length === 0 && (
                    <div className="empty-state">
                      <Ticket className="empty-state-icon" />
                      <p className="text-lg font-medium text-[var(--text-secondary)]">No tickets found</p>
                      <p className="text-sm text-[var(--text-muted)]">Try adjusting your filters</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ticket Detail Panel */}
              {selectedTicket && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-96 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shrink-0"
                >
                  <div className="p-6 border-b border-[var(--border)]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-display text-[var(--primary)]">{selectedTicket.id}</span>
                      <button
                        onClick={() => setSelectedTicket(null)}
                        className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
                      >
                        <XCircle className="w-5 h-5 text-[var(--text-muted)]" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="badge"
                        style={{
                          backgroundColor: `${priorityColors[selectedTicket.priority as keyof typeof priorityColors]}20`,
                          color: priorityColors[selectedTicket.priority as keyof typeof priorityColors],
                        }}
                      >
                        {selectedTicket.priority.toUpperCase()}
                      </span>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: statusColors[selectedTicket.status as keyof typeof statusColors].bg,
                          color: statusColors[selectedTicket.status as keyof typeof statusColors].text,
                        }}
                      >
                        {selectedTicket.status === 'in_progress' ? 'In Progress' : selectedTicket.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">{selectedTicket.issue}</h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <UserCheck className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-[var(--text-secondary)]">{selectedTicket.user}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Monitor className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-[var(--text-secondary)]">{selectedTicket.machine}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-[var(--text-secondary)]">{selectedTicket.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h4 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">Quick Actions</h4>

                    <div className="space-y-2">
                      {[
                        { label: 'Run Diagnostics', icon: <Zap className="w-4 h-4" /> },
                        { label: 'Apply Fix', icon: <CheckCircle2 className="w-4 h-4" /> },
                        { label: 'Escalate', icon: <AlertTriangle className="w-4 h-4" /> },
                        { label: 'Assign to Me', icon: <UserCheck className="w-4 h-4" /> },
                      ].map((action, idx) => (
                        <button
                          key={idx}
                          className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300 group"
                        >
                          <span className="text-[var(--primary)]">{action.icon}</span>
                          <span className="text-sm text-[var(--text-primary)] flex-1 text-left">{action.label}</span>
                          <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Endpoints View */}
          {activeTab === 'agents' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg text-[var(--primary)]">Connected Endpoints</h3>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-sm hover:border-[var(--primary)] transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'WFH-LP-452', status: 'online', lastSeen: 'Just now', location: 'WFH' },
                  { name: 'WFH-LP-891', status: 'online', lastSeen: '2 min ago', location: 'WFH' },
                  { name: 'OFF-DK-234', status: 'online', lastSeen: '5 min ago', location: 'Office DK' },
                  { name: 'OFF-NY-567', status: 'offline', lastSeen: '1 hour ago', location: 'Office NY' },
                  { name: 'WFH-LP-123', status: 'online', lastSeen: 'Just now', location: 'WFH' },
                  { name: 'WFH-LP-789', status: 'busy', lastSeen: 'Just now', location: 'WFH' },
                ].map((endpoint, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-[var(--text-muted)]" />
                        <span className="text-sm font-mono text-[var(--text-primary)]">{endpoint.name}</span>
                      </div>
                      <span className={`status-dot ${endpoint.status}`} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                      <span>{endpoint.location}</span>
                      <span>{endpoint.lastSeen}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <div className="card p-6 space-y-6">
                <h3 className="font-display text-lg text-[var(--primary)]">Portal Settings</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-elevated)]">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">Email Notifications</p>
                      <p className="text-xs text-[var(--text-muted)]">Receive alerts for new tickets</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-[var(--bg-card)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--primary)] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-elevated)]">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">Sound Alerts</p>
                      <p className="text-xs text-[var(--text-muted)]">Play sound for critical tickets</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-[var(--bg-card)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--primary)] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-elevated)]">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">Auto-assign Tickets</p>
                      <p className="text-xs text-[var(--text-muted)]">Automatically assign to available agents</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-[var(--bg-card)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--primary)] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
