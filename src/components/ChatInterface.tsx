import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  ChevronRight,
  Terminal,
  Shield,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  type?: 'text' | 'action' | 'code' | 'info';
  actions?: ActionItem[];
}

interface ActionItem {
  label: string;
  action: string;
  icon: React.ReactNode;
  description: string;
}

interface DiagnosticResult {
  category: string;
  confidence: number;
  description: string;
  suggestedActions: ActionItem[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Sample diagnostic responses
const diagnosticResponses: Record<string, DiagnosticResult> = {
  vpn: {
    category: 'Cisco VPN',
    confidence: 94,
    description: 'VPN connection instability detected. Likely MTU packet fragmentation at home router level.',
    severity: 'high',
    suggestedActions: [
      {
        label: 'Fix VPN MTU',
        action: 'fix_mtu',
        icon: <Shield className="w-4 h-4" />,
        description: 'Optimize network adapter to 1400 MTU',
      },
      {
        label: 'Reset VPN Client',
        action: 'reset_vpn',
        icon: <RefreshCw className="w-4 h-4" />,
        description: 'Clear VPN cache and reconnect',
      },
      {
        label: 'View Script',
        action: 'view_script',
        icon: <Terminal className="w-4 h-4" />,
        description: 'Show PowerShell fix script',
      },
    ],
  },
  citrix: {
    category: 'Citrix Workspace',
    confidence: 91,
    description: 'Citrix Receiver session locked. WFICA32 process appears stuck in memory.',
    severity: 'medium',
    suggestedActions: [
      {
        label: 'Flush Citrix Cache',
        action: 'flush_citrix',
        icon: <RefreshCw className="w-4 h-4" />,
        description: 'Clear stuck sessions and cache',
      },
      {
        label: 'Restart Receiver',
        action: 'restart_receiver',
        icon: <Zap className="w-4 h-4" />,
        description: 'Force restart Citrix services',
      },
    ],
  },
  disk: {
    category: 'Storage',
    confidence: 88,
    description: 'C: drive running low on space. Microsoft Teams and temp caches consuming ~8.4 GB.',
    severity: 'low',
    suggestedActions: [
      {
        label: 'Clean Temp Files',
        action: 'clean_temp',
        icon: <Sparkles className="w-4 h-4" />,
        description: 'Remove stale temp and cache files',
      },
      {
        label: 'Run Full Cleanup',
        action: 'full_cleanup',
        icon: <Terminal className="w-4 h-4" />,
        description: 'Execute complete disk optimization',
      },
    ],
  },
  certificate: {
    category: 'Certificate',
    confidence: 96,
    description: 'Client certificate expired. AD authentication blocked at pre-login screen.',
    severity: 'critical',
    suggestedActions: [
      {
        label: 'Restore Certificate',
        action: 'restore_cert',
        icon: <Shield className="w-4 h-4" />,
        description: 'Re-import from secure local vault',
      },
      {
        label: 'Request Renewal',
        action: 'request_cert',
        icon: <ExternalLink className="w-4 h-4" />,
        description: 'Open certificate renewal portal',
      },
    ],
  },
  configmgr: {
    category: 'ConfigMgr',
    confidence: 85,
    description: 'SCCM client out of sync. Multiple policy cycles running at different intervals.',
    severity: 'medium',
    suggestedActions: [
      {
        label: 'Sync All Cycles',
        action: 'sync_cycles',
        icon: <RefreshCw className="w-4 h-4" />,
        description: 'Trigger simultaneous evaluation',
      },
      {
        label: 'Reset WMI',
        action: 'reset_wmi',
        icon: <Terminal className="w-4 h-4" />,
        description: 'Repair WMI repository',
      },
    ],
  },
};

const quickPrompts = [
  'VPN keeps disconnecting',
  'Citrix won\'t load',
  'My computer is slow',
  'Certificate expired',
  'ConfigMgr not updating',
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'Hello! I\'m your IT Assistant. Describe your issue in plain English, paste an error code, or click a quick option below.',
      timestamp: new Date(),
      type: 'info',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showActions, setShowActions] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  const analyzeInput = (text: string): DiagnosticResult | null => {
    const lower = text.toLowerCase();

    if (lower.includes('vpn') || lower.includes('mtu') || lower.includes('cisco') || lower.includes('disconnect') || lower.includes('packet')) {
      return diagnosticResponses.vpn;
    }
    if (lower.includes('citrix') || lower.includes('receiver') || lower.includes('workspace') || lower.includes('launch')) {
      return diagnosticResponses.citrix;
    }
    if (lower.includes('disk') || lower.includes('storage') || lower.includes('space') || lower.includes('slow') || lower.includes('temp') || lower.includes('cache') || lower.includes('teams')) {
      return diagnosticResponses.disk;
    }
    if (lower.includes('cert') || lower.includes('certificate') || lower.includes('expired') || lower.includes('login') || lower.includes('password')) {
      return diagnosticResponses.certificate;
    }
    if (lower.includes('configmgr') || lower.includes('sccm') || lower.includes('update') || lower.includes('policy') || lower.includes('sync')) {
      return diagnosticResponses.configmgr;
    }

    // Generic response for unrecognized issues
    return {
      category: 'General',
      confidence: 72,
      description: 'I\'m analyzing your issue. Based on your description, this appears to be a system-level problem that may require manual intervention.',
      severity: 'medium',
      suggestedActions: [
        {
          label: 'Run Diagnostics',
          action: 'run_diag',
          icon: <Sparkles className="w-4 h-4" />,
          description: 'Execute full system scan',
        },
        {
          label: 'Create Ticket',
          action: 'create_ticket',
          icon: <AlertTriangle className="w-4 h-4" />,
          description: 'Escalate to service desk',
        },
      ],
    };
  };

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = analyzeInput(messageText);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: result?.description || 'I\'m analyzing your issue...',
      timestamp: new Date(),
      type: 'action',
      actions: result?.suggestedActions,
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
    setShowActions(aiMessage.id);
  };

  const handleAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      fix_mtu: '# Applying MTU fix...\n\nSet-NetAdapter | Where-Object {$_.Status -eq "Up"} | ForEach-Object {\n    netsh interface ipv4 set subinterface "$($_.Name)" mtu=1400 store=persistent\n}\n\n✓ MTU optimized to 1400',
      reset_vpn: '# Resetting Cisco VPN client...\n\nClear-DnsClientCache\nStop-Process -Name "vpnui" -Force -ErrorAction SilentlyContinue\nStart-Sleep -Seconds 2\n\n✓ VPN client reset complete',
      flush_citrix: '# Flushing Citrix workspace...\n\nStop-Process -Name "WFICA32","Receiver","SelfService" -Force -ErrorAction SilentlyContinue\nRemove-Item -Path "$env:LOCALAPPDATA\\Citrix\\SelfService\\*" -Recurse -Force -ErrorAction SilentlyContinue\n\n✓ Citrix cache cleared',
      clean_temp: '# Cleaning temp directories...\n\nRemove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue\nRemove-Item -Path "C:\\Windows\\Temp\\*" -Recurse -Force -ErrorAction SilentlyContinue\n\n✓ Freed ~8.4 GB of space',
      run_diag: '# Running full diagnostics...\n\n[1/5] Checking storage... OK\n[2/5] Checking network adapters... OK\n[3/5] Checking Citrix services... OK\n[4/5] Checking certificates... OK\n[5/5] Checking ConfigMgr... OK\n\n✓ All systems scanned',
    };

    const responseText = actionMessages[action] || '# Action not yet implemented';

    const actionMessage: Message = {
      id: (Date.now() + Math.random()).toString(),
      role: 'ai',
      content: responseText,
      timestamp: new Date(),
      type: 'code',
    };

    setMessages(prev => [...prev, actionMessage]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="glass-strong px-6 py-4 border-b border-[rgba(222,219,200,0.1)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="font-display text-xl text-[var(--primary)]">IT Self-Service Portal</h1>
            <p className="text-sm text-[var(--text-muted)]">AI-Powered Diagnostics & Recovery</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="status-dot online" />
            <span className="text-xs text-[var(--text-muted)]">System Online</span>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    message.role === 'user' ? 'bg-[var(--primary)]' : 'bg-[var(--bg-elevated)] border border-[var(--border)]'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-black" />
                    ) : (
                      <Bot className="w-5 h-5 text-[var(--primary)]" />
                    )}
                  </div>

                  {/* Message content */}
                  <div className="space-y-3">
                    <div className={message.role === 'user' ? 'message-user' : 'message-ai'}>
                      <div className="p-4">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {message.type === 'action' && message.actions && showActions === message.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2"
                      >
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Suggested Actions</p>
                        <div className="flex flex-wrap gap-2">
                          {message.actions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleAction(action.action)}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300 group"
                            >
                              <span className="text-[var(--primary)] group-hover:scale-110 transition-transform">
                                {action.icon}
                              </span>
                              <span className="text-sm text-[var(--text-primary)]">{action.label}</span>
                              <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Code block */}
                    {message.type === 'code' && (
                      <div className="bg-[#0D0D0D] border border-[var(--border)] rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
                          <span className="text-xs text-[var(--text-muted)] font-mono">PowerShell</span>
                          <button
                            onClick={() => copyToClipboard(message.content)}
                            className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
                          >
                            <Copy className="w-4 h-4 text-[var(--text-muted)]" />
                          </button>
                        </div>
                        <pre className="p-4 text-sm font-mono text-[var(--accent)] overflow-x-auto">
                          <code>{message.content}</code>
                        </pre>
                      </div>
                    )}

                    {/* Timestamp */}
                    <p className="text-[10px] text-[var(--text-muted)] px-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center">
                <Bot className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div className="message-ai">
                <div className="typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick prompts */}
      <div className="px-6 pb-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-[var(--text-muted)] mb-3 uppercase tracking-wider">Quick Issues</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="glass-strong px-6 py-4 border-t border-[rgba(222,219,200,0.1)]">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Describe your issue or paste an error code..."
              rows={1}
              className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-5 py-4 pr-14 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:shadow-[0_0_20px_rgba(222,219,200,0.1)] transition-all duration-300 resize-none"
              style={{ maxHeight: '150px', minHeight: '56px' }}
            />

            {/* Voice button */}
            <button
              onClick={toggleListening}
              className={`absolute right-20 bottom-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isListening
                  ? 'bg-[#FF6B6B] text-white animate-pulse-glow'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Send button */}
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className="absolute right-3 bottom-3 w-10 h-10 rounded-xl bg-[var(--primary)] text-black flex items-center justify-center hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Voice waveform when listening */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 60 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-center gap-1 pt-4"
              >
                <div className="waveform">
                  <div className="waveform-bar" />
                  <div className="waveform-bar" />
                  <div className="waveform-bar" />
                  <div className="waveform-bar" />
                  <div className="waveform-bar" />
                </div>
                <span className="ml-4 text-sm text-[var(--accent)]">Listening...</span>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-[10px] text-[var(--text-muted)] mt-3">
            Press Enter to send • Shift+Enter for new line • Click mic to speak
          </p>
        </div>
      </div>
    </div>
  );
}
