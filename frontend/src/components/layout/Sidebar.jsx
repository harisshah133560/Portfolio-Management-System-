import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, PlusCircle, User, Settings, LogOut, Briefcase,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../common/Modal';
import { useState } from 'react';

var NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/projects', icon: FolderOpen, label: 'Projects', end: true },
  { to: '/projects/new', icon: PlusCircle, label: 'Add Project', end: true },
  { divider: true },
  { to: '/profile', icon: User, label: 'Profile', end: true },
  { to: '/settings', icon: Settings, label: 'Settings', end: true },
];

function SidebarNav(props) {
  var collapsed = props.collapsed;
  var onMobileClose = props.onMobileClose;
  var onLogoutClick = props.onLogoutClick;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="text-lg font-bold text-slate-900 tracking-tight overflow-hidden whitespace-nowrap"
            >
              Haris Shah
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map(function (item, i) {
          if (item.divider) {
            return <div key={i} className="mx-4 my-2 border-t border-slate-100" />;
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onMobileClose}
              className={function ({ isActive }) {
                return 'flex items-center gap-3 mx-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ' +
                  (isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900');
              }}
              title={item.label}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3 flex-shrink-0">
        <button
          onClick={onLogoutClick}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar(props) {
  var collapsed = props.collapsed;
  var mobileOpen = props.mobileOpen;
  var onMobileClose = props.onMobileClose;
  var toast = useToast();
  var logout = useAuth().logout;

  var modalState = useState(false);
  var showLogoutModal = modalState[0];
  var setShowLogoutModal = modalState[1];

  var handleLogout = function () {
    logout();
    toast.success('Signed out successfully');
    setShowLogoutModal(false);
    onMobileClose();
  };

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:block fixed top-0 left-0 bottom-0 bg-white border-r border-slate-200 z-40 overflow-hidden"
      >
        <SidebarNav collapsed={collapsed} onMobileClose={function () {}} onLogoutClick={function () { setShowLogoutModal(true); }} />
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-white border-r border-slate-200 z-50"
            >
              <SidebarNav collapsed={false} onMobileClose={onMobileClose} onLogoutClick={function () { setShowLogoutModal(true); }} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <Modal
        open={showLogoutModal}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        type="warning"
        onConfirm={handleLogout}
        onCancel={function () { setShowLogoutModal(false); }}
      />
    </>
  );
}