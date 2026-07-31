import { useNavigate } from 'react-router-dom';
import { Menu, PanelLeftOpen, PanelLeftClose, Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

var PAGE_NAMES = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/projects/new': 'Add Project',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

export default function TopNav(props) {
  var collapsed = props.collapsed;
  var onToggle = props.onToggle;
  var onMobileOpen = props.onMobileOpen;
  var pathname = props.pathname;
  var user = useAuth().user;
  var navigate = useNavigate();
  var pageName = PAGE_NAMES[pathname] || (pathname && pathname.includes('/edit') ? 'Edit Project' : 'Dashboard');
  var avatarUrl = user && user.avatar ? user.avatar : 'https://ui-avatars.com/api/?name=' + encodeURIComponent((user && user.name) || 'U') + '&background=2563EB&color=fff&size=80&bold=true';

  var handleQuickSearch = function (e) {
    if (e.key === 'Enter') {
      var v = e.target.value.trim();
      if (v) { navigate('/projects?search=' + encodeURIComponent(v)); e.target.value = ''; }
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button onClick={onMobileOpen} className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors" aria-label="Open menu">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <button onClick={onToggle} className="hidden md:flex p-2 rounded-xl hover:bg-slate-100 transition-colors" aria-label="Toggle sidebar">
            {collapsed ? <PanelLeftOpen className="w-5 h-5 text-slate-500" /> : <PanelLeftClose className="w-5 h-5 text-slate-500" />}
          </button>
          <h1 className="text-lg font-bold text-slate-900">{pageName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 rounded-2xl px-3 py-2 border border-slate-200 w-64 shadow-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Quick search..." className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 w-full" onKeyDown={handleQuickSearch} aria-label="Quick search projects" />
          </div>
          <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors" aria-label="Notifications">
            <Bell className="w-5 h-5 text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>
          <button onClick={function () { navigate('/profile'); }} className="flex items-center gap-2.5 pl-3 border-l border-slate-200 hover:opacity-80 transition-opacity">
            <img src={avatarUrl} alt={user ? user.name : 'User'} className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm" />
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{user ? user.name : ''}</p>
              <p className="text-xs text-slate-400 leading-tight">{user ? user.email : ''}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}