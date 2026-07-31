import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

var ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

var COLORS = {
  success: { bg: '#ECFDF5', border: '#10B981', text: '#065F46' },
  error: { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B' },
  warning: { bg: '#FFFBEB', border: '#F59E0B', text: '#92400E' },
  info: { bg: '#EFF6FF', border: '#3B82F6', text: '#1E40AF' },
};

export default function Toast(props) {
  var message = props.message;
  var type = props.type;
  var duration = props.duration;
  var onClose = props.onClose;

  var removingState = useState(false);
  var removing = removingState[0];
  var setRemoving = removingState[1];

  var Icon = ICONS[type] || Info;
  var color = COLORS[type] || COLORS.info;

  useEffect(function () {
    if (duration > 0) {
      var timer = setTimeout(function () {
        setRemoving(true);
        setTimeout(onClose, 300);
      }, duration);
      return function () { clearTimeout(timer); };
    }
  }, [duration, onClose]);

  var handleClose = function () {
    setRemoving(true);
    setTimeout(onClose, 300);
  };

  if (removing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 120, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 120, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="pointer-events-auto min-w-[320px] max-w-[420px]"
    >
      <div
        className="rounded-xl shadow-lg p-4 flex items-start gap-3"
        style={{
          background: color.bg,
          border: '1px solid ' + color.border + '22',
          borderLeft: '4px solid ' + color.border,
        }}
      >
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: color.border }} />
        <p className="flex-1 text-sm font-medium" style={{ color: color.text }}>
          {message}
        </p>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-0.5 rounded hover:bg-black/5 transition-colors"
          style={{ color: color.border + '88' }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}