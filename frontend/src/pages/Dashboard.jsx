import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  DoughnutController,
  BarController
} from 'chart.js';
import { FolderOpen, CheckCircle2, Loader, Code2, PlusCircle, UserCircle2, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { projectApi } from '../api/projectApi';
import StatsCard from '../components/common/StatsCard';
import StatusBadge from '../components/common/StatusBadge';
import { SkeletonCard, SkeletonTable } from '../components/common/SkeletonLoader';
import Modal from '../components/common/Modal';
import { CATEGORIES } from '../utils/constants';
import { formatRelative, getGreeting, getCategoryLabel, getCategoryColor, getAssetUrl } from '../utils/helpers';
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  DoughnutController,
  BarController
);

export default function Dashboard() {
  var user = useAuth().user;
  var toast = useToast();
  var navigate = useNavigate();
  var statusChartRef = useRef(null);
  var categoryChartRef = useRef(null);
  var statusChartInstance = useRef(null);
  var categoryChartInstance = useRef(null);

  var statsState = useState(null);
  var stats = statsState[0];
  var setStats = statsState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var deleteIdState = useState(null);
  var deleteId = deleteIdState[0];
  var setDeleteId = deleteIdState[1];

  useEffect(function () {
    fetchStats();
    return function () {
      if (statusChartInstance.current) statusChartInstance.current.destroy();
      if (categoryChartInstance.current) categoryChartInstance.current.destroy();
    };
  }, []);

  useEffect(function () {
    if (!stats || !statusChartRef.current || !categoryChartRef.current) return;

    if (statusChartInstance.current) statusChartInstance.current.destroy();
    if (categoryChartInstance.current) categoryChartInstance.current.destroy();

    statusChartInstance.current = new ChartJS(statusChartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Planned'],
        datasets: [{
          data: [stats.completed, stats.inProgress, stats.planned],
          backgroundColor: ['#10B981', '#F59E0B', '#CBD5E1'],
          borderWidth: 0,
          borderRadius: 4,
          spacing: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
              color: '#475569'
            }
          }
        }
      }
    });

    categoryChartInstance.current = new ChartJS(categoryChartRef.current, {
      type: 'bar',
      data: {
        labels: CATEGORIES.map(function (c) { return c.label.split(' ')[0]; }),
        datasets: [{
          data: CATEGORIES.map(function (c) { return (stats.byCategory && stats.byCategory[c.value]) || 0; }),
          backgroundColor: CATEGORIES.map(function (c) { return c.color + '20'; }),
          borderColor: CATEGORIES.map(function (c) { return c.color; }),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#94A3B8' },
            grid: { color: '#F1F5F9' },
            border: { display: false }
          },
          x: {
            ticks: { font: { family: 'Plus Jakarta Sans', size: 10, weight: '600' }, color: '#64748B', maxRotation: 45 },
            grid: { display: false },
            border: { display: false }
          }
        }
      }
    });
  }, [stats]);

  var fetchStats = function () {
    projectApi.getStats()
      .then(function (res) {
        if (res.data.success) setStats(res.data.data);
      })
      .catch(function () { toast.error('Failed to load dashboard data'); })
      .finally(function () { setLoading(false); });
  };

  var handleDelete = function () {
    if (!deleteId) return;
    projectApi.deleteProject(deleteId)
      .then(function () {
        toast.success('Project deleted');
        setDeleteId(null);
        fetchStats();
      })
      .catch(function (err) { toast.error(err.message || 'Delete failed'); });
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="w-64 h-8 rounded-lg bg-slate-200 animate-pulse mb-2" />
          <div className="w-48 h-4 rounded bg-slate-200 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(function (i) { return <SkeletonCard key={i} />; })}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6"><div className="w-full h-60 rounded bg-slate-200 animate-pulse" /></div>
          <div className="card p-6"><div className="w-full h-60 rounded bg-slate-200 animate-pulse" /></div>
        </div>
        <div className="card p-6"><SkeletonTable /></div>
      </div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
          {getGreeting()}, {user ? user.name.split(' ')[0] : ''}
        </h2>
        <p className="text-slate-500">Here is an overview of your work and projects</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="card p-6 mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Quick actions</p>
            <h3 className="mt-2 text-lg font-bold text-slate-900">Keep your portfolio fresh and engaging</h3>
            <p className="mt-2 text-sm text-slate-600">Add new work, refine your profile, and share your latest achievements with visitors.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={function () { navigate('/projects/new'); }} className="btn-primary">
              <PlusCircle className="w-4 h-4" /> Add Project
            </button>
            <button onClick={function () { navigate('/profile'); }} className="btn-secondary">
              <UserCircle2 className="w-4 h-4" /> Edit Profile
            </button>
            <a href="/" target="_blank" rel="noreferrer" className="btn-secondary">
              <ExternalLink className="w-4 h-4" /> View Portfolio
            </a>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={FolderOpen} label="Total Projects" value={stats.total} color="#3B82F6" delay={1} />
        <StatsCard icon={CheckCircle2} label="Completed" value={stats.completed} color="#10B981" delay={2} />
        <StatsCard icon={Loader} label="In Progress" value={stats.inProgress} color="#F59E0B" delay={3} />
        <StatsCard icon={Code2} label="Technologies" value={stats.topTechnologies ? stats.topTechnologies.length : 0} color="#8B5CF6" delay={4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="card p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">Project Status</h3>
          <div className="max-h-[260px] flex items-center justify-center">
            <canvas ref={statusChartRef} />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="card p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">Projects by Category</h3>
          <div className="max-h-[260px]">
            <canvas ref={categoryChartRef} />
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="card">
        <div className="flex items-center justify-between p-6 pb-0">
          <h3 className="text-base font-bold text-slate-900">Recent Projects</h3>
          <button onClick={function () { navigate('/projects'); }} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="p-6 overflow-x-auto">
          {stats.recentProjects && stats.recentProjects.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Updated</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentProjects.map(function (p) {
                  return (
                    <tr key={p._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img src={getAssetUrl(p.imageUrl, 'https://picsum.photos/seed/' + p._id + '/80/80')} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate max-w-[200px]">{p.title}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[200px]">{p.description ? p.description.substring(0, 40) + '...' : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 hidden md:table-cell">
                        <span className="text-xs font-medium" style={{ color: getCategoryColor(p.category) }}>
                          {getCategoryLabel(p.category)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-xs hidden sm:table-cell">
                        {formatRelative(p.updatedAt)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={function () { navigate('/projects/' + p._id + '/edit'); }} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-blue-600" title="Edit">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={function () { setDeleteId(p._id); }} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-slate-400 hover:text-red-600" title="Delete">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
              <p className="text-slate-500 font-medium">No projects yet</p>
              <button onClick={function () { navigate('/projects/new'); }} className="btn-primary mt-4">Add Your First Project</button>
            </div>
          )}
        </div>
      </motion.div>

      <Modal
        open={!!deleteId}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete Project"
        type="danger"
        onConfirm={handleDelete}
        onCancel={function () { setDeleteId(null); }}
      />
    </div>
  );
}