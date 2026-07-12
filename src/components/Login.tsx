import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Monitor,
  Users,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface LoginProps {
  onLogin: (portal: 'user' | 'agent', email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [selectedPortal, setSelectedPortal] = useState<'user' | 'agent' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPortal || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo purposes, accept any credentials
    onLogin(selectedPortal, email);
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)] rounded-full opacity-5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent)] rounded-full opacity-5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-[var(--primary)] flex items-center justify-center"
          >
            <Shield className="w-10 h-10 text-black" />
          </motion.div>
          <h1 className="font-display text-4xl text-[var(--primary)] mb-2">Prisma IT</h1>
          <p className="text-[var(--text-muted)]">AI-Powered Self-Service Recovery Portal</p>
        </div>

        <div className="login-card">
          {!selectedPortal ? (
            <>
              {/* Portal Selection */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-center text-lg font-medium text-[var(--text-primary)] mb-8">
                  Select your portal
                </h2>

                <div className="portal-selector">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPortal('user')}
                    className="portal-option"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--primary-glow)] flex items-center justify-center">
                      <User className="w-8 h-8 text-[var(--primary)]" />
                    </div>
                    <h3 className="font-display text-lg text-[var(--text-primary)] mb-1">User Portal</h3>
                    <p className="text-xs text-[var(--text-muted)]">Get help with your issues</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPortal('agent')}
                    className="portal-option"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--primary-glow)] flex items-center justify-center">
                      <Users className="w-8 h-8 text-[var(--primary)]" />
                    </div>
                    <h3 className="font-display text-lg text-[var(--text-primary)] mb-1">Agent Portal</h3>
                    <p className="text-xs text-[var(--text-muted)]">Service desk dashboard</p>
                  </motion.button>
                </div>
              </motion.div>

              <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
                <p className="text-xs text-[var(--text-muted)]">
                  Powered by{' '}
                  <span className="text-[var(--primary)]">Prisma AI Engine</span>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Back button */}
              <button
                onClick={() => setSelectedPortal(null)}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors mb-6"
              >
                ← Change portal
              </button>

              {/* Portal indicator */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary-glow)] flex items-center justify-center">
                  {selectedPortal === 'user' ? (
                    <User className="w-6 h-6 text-[var(--primary)]" />
                  ) : (
                    <Users className="w-6 h-6 text-[var(--primary)]" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Signing in to</p>
                  <p className="font-display text-lg text-[var(--primary)]">
                    {selectedPortal === 'user' ? 'User Portal' : 'Agent Portal'}
                  </p>
                </div>
              </div>

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@bnp.com"
                      className="input-field pl-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="input-field pl-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-[#FF6B6B]"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary justify-center mt-6 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button className="text-sm text-[var(--primary)] hover:underline">
                  Forgot your password?
                </button>
              </div>
            </>
          )}
        </div>

        {/* Features preview */}
        {!selectedPortal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 grid grid-cols-3 gap-4 text-center"
          >
            {[
              { icon: Sparkles, label: 'AI Diagnostics' },
              { icon: Monitor, label: 'Remote Repair' },
              { icon: Shield, label: 'Secure' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]"
              >
                <feature.icon className="w-6 h-6 text-[var(--primary)] mx-auto mb-2" />
                <p className="text-xs text-[var(--text-muted)]">{feature.label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
