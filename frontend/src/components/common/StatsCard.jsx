import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function StatsCard(props) {
  var Icon = props.icon;
  var label = props.label;
  var value = props.value;
  var color = props.color;
  var delay = props.delay || 0;
  var counterRef = useRef(null);

  useEffect(function () {
    if (!counterRef.current) return;
    var start = 0;
    var target = value;
    var duration = 800;
    var inc = target / (duration / 16);
    var timer = setInterval(function () {
      start += inc;
      if (start >= target) {
        counterRef.current.textContent = target;
        clearInterval(timer);
      } else {
        counterRef.current.textContent = Math.floor(start);
      }
    }, 16);
    return function () { clearInterval(timer); };
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.05, ease: 'easeOut' }}
      className="card p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: color + '15' }}
        >
          <Icon className="w-5 h-5" style={{ color: color }} />
        </div>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p ref={counterRef} className="text-3xl font-extrabold text-slate-900">
        0
      </p>
    </motion.div>
  );
}