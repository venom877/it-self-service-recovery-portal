import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import AgentPortal from './components/AgentPortal';
import Login from './components/Login';
import { motion, AnimatePresence } from 'motion/react';

type PortalType = 'user' | 'agent' | null;

export default function App() {
  const [currentPortal, setCurrentPortal] = useState<PortalType>(null);
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = (portal: PortalType, email: string) => {
    setCurrentPortal(portal);
    setUserEmail(email);
  };

  const handleLogout = () => {
    setCurrentPortal(null);
    setUserEmail('');
  };

  // Show login if not authenticated
  if (!currentPortal) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark)]">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-dark)]">
      <AnimatePresence mode="wait">
        {currentPortal === 'user' ? (
          <motion.div
            key="user"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col"
          >
            {/* Header bar */}
            <header className="h-14 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                  <span className="font-display text-sm text-black">P</span>
                </div>
                <span className="font-display text-sm text-[var(--primary)]">Prisma IT</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-[var(--text-muted)]">{userEmail}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </header>

            {/* Main content */}
            <main className="flex-1 overflow-hidden">
              <ChatInterface />
            </main>
          </motion.div>
        ) : (
          <motion.div
            key="agent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen overflow-hidden"
          >
            <AgentPortal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
