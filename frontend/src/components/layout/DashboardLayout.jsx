import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function DashboardLayout(props) {
  var children = props.children;
  var location = useLocation();

  var collapsedState = useState(false);
  var collapsed = collapsedState[0];
  var setCollapsed = collapsedState[1];

  var mobileState = useState(false);
  var mobileOpen = mobileState[0];
  var setMobileOpen = mobileState[1];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.08),_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#f1f5f9_100%)]">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={function () { setMobileOpen(false); }}
      />

      {/* Desktop: animated margin. Mobile: no margin. */}
      <div
        className="md:transition-[margin] md:duration-300 md:ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768
            ? (collapsed ? 72 : 260) + 'px'
            : '0px',
        }}
        id="main-content-area"
      >
        <TopNav
          collapsed={collapsed}
          onToggle={function () { setCollapsed(!collapsed); }}
          onMobileOpen={function () { setMobileOpen(true); }}
          pathname={location.pathname}
        />

        <main className="p-4 md:p-6 lg:p-8 min-h-[calc(100vh-65px)]">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Sync sidebar width with main content on desktop resize */}
      <style>{`
        @media (min-width: 768px) {
          #main-content-area {
            margin-left: ${collapsed ? '72px' : '260px'} !important;
          }
        }
        @media (max-width: 767px) {
          #main-content-area {
            margin-left: 0px !important;
          }
        }
      `}</style>
    </div>
  );
}