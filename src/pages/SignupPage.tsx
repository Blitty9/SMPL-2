import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Navbar from '../components/landing/Navbar';
import { Button } from '../components/ui/button';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.svg';

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/editor`,
        },
      });

      if (error) throw error;

      // Redirect to thank you page
      navigate('/thank-you');
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="h-screen bg-deep-black flex flex-col overflow-hidden">
      <Navbar onLaunchEditor={() => navigate('/editor')} />
      
      <div className="flex-1 flex items-center justify-center px-4 py-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md my-auto"
        >
          <div className="relative">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#6D5AE0]/20 via-[#C7B8FF]/20 to-[#6D5AE0]/20 rounded-2xl blur-3xl" />
            
            <div className="relative bg-[#1a1a1a] border border-[#2F333A] rounded-2xl p-6 sm:p-8 shadow-2xl">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-6"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-flex items-center justify-center mb-3"
                >
                  <img src={logo} alt="SMPL Logo" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
                </motion.div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Create account</h1>
                <p className="text-graphite-gray text-sm">Start building with SMPL</p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-white mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-graphite-gray" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-[#0f0f0f] border border-[#2F333A] rounded-lg text-white placeholder-graphite-gray focus:outline-none focus:ring-2 focus:ring-[#6D5AE0] focus:border-transparent transition-all text-sm sm:text-base"
                      placeholder="you@example.com"
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-white mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-graphite-gray" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-[#0f0f0f] border border-[#2F333A] rounded-lg text-white placeholder-graphite-gray focus:outline-none focus:ring-2 focus:ring-[#6D5AE0] focus:border-transparent transition-all text-sm sm:text-base"
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="text-xs text-graphite-gray mt-1">At least 6 characters</p>
                </motion.div>

                {/* Confirm Password */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-white mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-graphite-gray" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-[#0f0f0f] border border-[#2F333A] rounded-lg text-white placeholder-graphite-gray focus:outline-none focus:ring-2 focus:ring-[#6D5AE0] focus:border-transparent transition-all text-sm sm:text-base"
                      placeholder="••••••••"
                    />
                  </div>
                </motion.div>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-2"
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full group"
                    size="lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Creating account...
                      </span>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Sign in link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-4 text-center"
              >
                <p className="text-graphite-gray text-sm">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-[#C7B8FF] hover:text-white transition-colors font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

