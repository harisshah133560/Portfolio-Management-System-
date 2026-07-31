import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl font-extrabold text-blue-600">404</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={function () { window.history.back(); }} className="btn-secondary"><ArrowLeft className="w-4 h-4" />Go Back</button>
          <Link to="/" className="btn-primary"><Home className="w-4 h-4" />Dashboard</Link>
        </div>
      </motion.div>
    </div>
  );
}