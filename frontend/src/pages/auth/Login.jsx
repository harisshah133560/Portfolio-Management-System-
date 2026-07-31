import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Login() {
  var emailState = useState('');
  var email = emailState[0]; var setEmail = emailState[1];
  var passwordState = useState('');
  var password = passwordState[0]; var setPassword = passwordState[1];
  var showPwState = useState(false);
  var showPw = showPwState[0]; var setShowPw = showPwState[1];
  var errorState = useState('');
  var error = errorState[0]; var setError = errorState[1];
  var submittingState = useState(false);
  var submitting = submittingState[0]; var setSubmitting = submittingState[1];
  var loginFn = useAuth().login;
  var toast = useToast();
  var navigate = useNavigate();

  var handleSubmit = function (e) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email and password are required'); return; }
    setSubmitting(true);
    loginFn(email, password)
      .then(function (result) {
        if (result.success) { toast.success('Welcome back, ' + result.data.user.name.split(' ')[0] + '!'); navigate('/', { replace: true }); }
        else { setError(result.message); }
      })
      .catch(function (err) { setError(err.message || 'Login failed'); })
      .finally(function () { setSubmitting(false); });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #F0F5FF 0%, #F8FAFC 30%, #EFF6FF 60%, #F1F5F9 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #93C5FD 0%, transparent 70%)', animation: 'af1 12s ease-in-out infinite' }} />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #60A5FA 0%, transparent 70%)', animation: 'af2 10s ease-in-out infinite' }} />
        <div className="absolute top-20 right-1/4 w-40 h-40 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)', animation: 'af3 14s ease-in-out infinite' }} />
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #BFDBFE 0%, transparent 70%)', animation: 'af2 8s ease-in-out infinite reverse' }} />
        <div className="absolute top-1/4 left-[10%] w-16 h-16 rounded-2xl opacity-10 rotate-12" style={{ background: '#3B82F6', animation: 'af4 9s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 right-[15%] w-12 h-12 rounded-xl opacity-10 -rotate-12" style={{ background: '#2563EB', animation: 'af1 11s ease-in-out infinite reverse' }} />
        <div className="absolute top-16 right-16 w-32 h-32 rounded-full opacity-10 border-4 border-blue-400" style={{ animation: 'af5 15s linear infinite' }} />
        <div className="absolute bottom-20 left-16 w-24 h-24 rounded-full opacity-8 border-4 border-blue-300" style={{ animation: 'af5 12s linear infinite reverse' }} />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]"><defs><pattern id="ad" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#3B82F6" /></pattern></defs><rect width="100%" height="100%" fill="url(#ad)" /></svg>
      </div>
      <style>{`
        @keyframes af1{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(30px,-20px) scale(1.05)}50%{transform:translate(-15px,25px) scale(0.95)}75%{transform:translate(20px,15px) scale(1.02)}}
        @keyframes af2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-25px,20px) scale(1.08)}66%{transform:translate(20px,-15px) scale(0.96)}}
        @keyframes af3{0%,100%{transform:translate(0,0)}50%{transform:translate(-30px,30px)}}
        @keyframes af4{0%,100%{transform:translate(0,0) rotate(12deg)}50%{transform:translate(20px,-25px) rotate(-8deg)}}
        @keyframes af5{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(180deg) scale(1.1)}100%{transform:rotate(360deg) scale(1)}}
      `}</style>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-500/30">
            <Briefcase className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500">Sign in to Haris Shah's portfolio dashboard</p>
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 p-8 shadow-xl shadow-blue-500/5">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input type="email" value={email} onChange={function(e){setEmail(e.target.value);}} placeholder="Enter your email" className="input-field pl-10 bg-white/60" required aria-label="Email" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={function(e){setPassword(e.target.value);}} placeholder="Enter your password" className="input-field pl-10 pr-11 bg-white/60" required aria-label="Password" />
                <button type="button" onClick={function(){setShowPw(!showPw);}} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Toggle password">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</motion.div>
            )}
            <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 rounded-xl text-base">
              {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
            </button>
          </form>
        </motion.div>
        <p className="text-center text-sm text-slate-500 mt-6">Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Sign up</Link></p>
      </motion.div>
    </div>
  );
}