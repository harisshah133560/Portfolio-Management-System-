import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

var CONFIG = {
  danger: { color: '#EF4444', icon: AlertTriangle },
  warning: { color: '#F59E0B', icon: AlertCircle },
  info: { color: '#3B82F6', icon: Info },
};

export default function Modal(props) {
  var open = props.open;
  var title = props.title;
  var message = props.message;
  var confirmText = props.confirmText || 'Confirm';
  var cancelText = props.cancelText || 'Cancel';
  var type = props.type || 'danger';
  var onConfirm = props.onConfirm;
  var onCancel = props.onCancel;

  var cfg = CONFIG[type] || CONFIG.info;
  var color = cfg.color;
  var Icon = cfg.icon;

  useEffect(function () {
    var handleEsc = function (e) {
      if (e.key === 'Escape' && onCancel) onCancel();
    };
    if (open) document.addEventListener('keydown', handleEsc);
    return function () { document.removeEventListener('keydown', handleEsc); };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9000] flex items-center justify-center p-5"
      style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-md"
        onClick={function (e) { e.stopPropagation(); }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: color + '15' }}
            >
              <Icon className="w-6 h-6" style={{ color: color }} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-6 pl-16">
            {message}
          </p>
          <div className="flex items-center justify-end gap-3">
            <button onClick={onCancel} className="btn-secondary">
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: color }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}