import React, { useState } from 'react';
import { 
  Bot, 
  Mail, 
  Lock, 
  User as UserIcon,
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  Eye, 
  EyeOff,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onSuccess }) => {
  const { login, signUp, loginWithGoogle } = useAuth();
  const { setCurrentView, theme, toggleTheme } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim();
    const cleanPass = password.trim();
    const cleanName = fullName.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMsg('Please enter both your email and password');
      return;
    }

    if (mode === 'signup' && !cleanName) {
      setErrorMsg('Please enter your name');
      return;
    }

    if (cleanPass.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        const res = await signUp(cleanName || cleanEmail.split('@')[0], cleanEmail, cleanPass);
        if (res.success) {
          setSuccessMsg('Account created successfully! Signing you in...');
          setTimeout(() => {
            if (onSuccess) onSuccess();
            setCurrentView('dashboard');
          }, 400);
        } else {
          setErrorMsg(res.error || 'Failed to create account. Please try again.');
        }
      } else {
        const res = await login(cleanEmail, cleanPass);
        if (res.success) {
          setSuccessMsg('Signed in successfully! Loading workspace...');
          setTimeout(() => {
            if (onSuccess) onSuccess();
            setCurrentView('dashboard');
          }, 400);
        } else {
          setErrorMsg(res.error || 'Invalid email or password');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async () => {
    setEmail('creator@viroai.com');
    setPassword('creator123');
    setIsSubmitting(true);
    try {
      const res = await login('creator@viroai.com', 'creator123');
      if (res.success) {
        setSuccessMsg('Demo workspace ready! Signing you in...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          setCurrentView('dashboard');
        }, 400);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to initialize session');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 selection:bg-purple-900 selection:text-white transition-colors">
      {/* Top right Theme switch */}
      <div className="absolute top-4 right-4">
        <button
          id="btn-auth-theme-toggle"
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-xs hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-zinc-700" />}
        </button>
      </div>

      <div className="w-full max-w-md">
        
        {/* Main Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-7 sm:p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900/90 backdrop-blur-xl">
          
          {/* Brand Icon & Heading */}
          <div className="text-center mb-6">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-800 text-white shadow-md shadow-purple-900/30 mb-3">
              <Bot className="h-6 w-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              ViroAI
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {mode === 'login' ? 'Welcome back, creator' : 'Create your account'}
            </p>
          </div>

          {/* Segmented Mode Selector */}
          <div className="mb-6 flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <button
              id="tab-mode-login"
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-white text-zinc-900 shadow-xs dark:bg-purple-800 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              Sign In
            </button>
            <button
              id="tab-mode-signup"
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-white text-zinc-900 shadow-xs dark:bg-purple-800 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-500 dark:text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500 dark:text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name for Sign Up */}
            {mode === 'signup' && (
              <div>
                <label 
                  htmlFor="input-auth-name" 
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                  <input
                    id="input-auth-name"
                    type="text"
                    required
                    placeholder="Fatima Khan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-700/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label 
                htmlFor="input-auth-email" 
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                <input
                  id="input-auth-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-700/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="input-auth-password" 
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                <input
                  id="input-auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-10 text-xs text-zinc-900 placeholder-zinc-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-700/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button
              id="btn-auth-submit"
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-800 py-3 text-xs font-semibold text-white shadow-md shadow-purple-900/30 hover:bg-purple-700 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Processing...</span>
                </span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Sign Up'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-900 px-2">
              <span>Or continue with</span>
            </div>
          </div>
          <div className="space-y-2.5">
            {/* Google Quick Sign In */}
            <button
              id="btn-auth-google"
              type="button"
              onClick={async () => {
                setErrorMsg('');
                setSuccessMsg('');
                setIsSubmitting(true);
                const res = await loginWithGoogle();
                if (res.success) {
                  setSuccessMsg('Signed in with Google! Loading workspace...');
                  setTimeout(() => {
                    if (onSuccess) onSuccess();
                    setCurrentView('dashboard');
                  }, 400);
                } else {
                  setErrorMsg(res.error || 'Google sign in failed');
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-200 bg-white py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Quick Demo Workspace Access Button */}
            <button
              id="btn-auth-demo"
              type="button"
              onClick={handleQuickDemo}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Instant Demo Workspace</span>
            </button>
          </div>

          {/* Bottom Switcher */}
          <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="font-semibold text-purple-700 dark:text-purple-400 hover:underline transition-colors"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="font-semibold text-purple-700 dark:text-purple-400 hover:underline transition-colors"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

