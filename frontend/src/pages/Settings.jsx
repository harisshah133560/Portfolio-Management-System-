import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Trash2, UserX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { projectApi } from '../api/projectApi';
import { authApi } from '../api/authApi';
import Modal from '../components/common/Modal';
import { formatDate } from '../utils/helpers';

export default function Settings() {
  var auth = useAuth();
  var user = auth.user;
  var logout = auth.logout;
  var toast = useToast();
  var navigate = useNavigate();

  var deleteAllState = useState(false);
  var showDeleteAll = deleteAllState[0];
  var setShowDeleteAll = deleteAllState[1];

  var deleteAccountState = useState(false);
  var showDeleteAccount = deleteAccountState[0];
  var setShowDeleteAccount = deleteAccountState[1];

  var exportProjects = function () {
    projectApi.getProjects({ limit: 1000, page: 1 })
      .then(function (res) {
        if (res.data.success) {
          var blob = new Blob([JSON.stringify(res.data.data.projects, null, 2)], { type: 'application/json' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'portfolio-projects.json';
          a.click();
          URL.revokeObjectURL(url);
          toast.success('Projects exported successfully');
        }
      })
      .catch(function () { toast.error('Export failed'); });
  };

  var handleDeleteAll = function () {
    projectApi.deleteAllProjects()
      .then(function (res) {
        toast.success(res.data.message);
        setShowDeleteAll(false);
      })
      .catch(function (err) { toast.error(err.message || 'Failed to delete projects'); });
  };

  var handleDeleteAccount = function () {
    authApi.deleteAccount()
      .then(function () {
        toast.success('Account deleted');
        logout();
        navigate('/login');
      })
      .catch(function (err) { toast.error(err.message || 'Failed to delete account'); });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900">Settings</h2>
        <p className="text-slate-500 mt-1">Manage your account and preferences</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500">Account ID</span>
            <span className="text-sm font-mono text-slate-700">{user ? user._id : ''}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500">Email</span>
            <span className="text-sm text-slate-700">{user ? user.email : ''}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500">Member Since</span>
            <span className="text-sm text-slate-700">{user ? formatDate(user.createdAt) : ''}</span>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Data Management</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div><p className="text-sm font-medium text-slate-700">Export Projects</p><p className="text-xs text-slate-400">Download all your projects as JSON</p></div>
            <button onClick={exportProjects} className="btn-secondary"><Download className="w-4 h-4" />Export</button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-slate-50">
            <div><p className="text-sm font-medium text-slate-700">Delete All Projects</p><p className="text-xs text-slate-400">Permanently remove all your portfolio projects</p></div>
            <button onClick={function () { setShowDeleteAll(true); }} className="px-4 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors inline-flex items-center gap-2"><Trash2 className="w-4 h-4" />Delete All</button>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6 border-red-100">
        <h3 className="text-sm font-bold text-red-700 mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between py-2">
          <div><p className="text-sm font-medium text-slate-700">Delete Account</p><p className="text-xs text-slate-400">Permanently delete your account and all data</p></div>
          <button onClick={function () { setShowDeleteAccount(true); }} className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors inline-flex items-center gap-2"><UserX className="w-4 h-4" />Delete Account</button>
        </div>
      </motion.div>
      <div className="h-8"></div>

      <Modal open={showDeleteAll} title="Delete All Projects" message="This will permanently delete all your portfolio projects. This action cannot be undone." confirmText="Delete All" type="danger" onConfirm={handleDeleteAll} onCancel={function () { setShowDeleteAll(false); }} />
      <Modal open={showDeleteAccount} title="Delete Account" message="This will permanently delete your account, all projects, and associated data. This action cannot be undone." confirmText="Delete Account" type="danger" onConfirm={handleDeleteAccount} onCancel={function () { setShowDeleteAccount(false); }} />
    </div>
  );
}