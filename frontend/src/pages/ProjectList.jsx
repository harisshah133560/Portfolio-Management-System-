import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, SearchX } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useToast } from '../context/ToastContext';
import ProjectCard from './ProjectCard';
import { SkeletonProjectCard } from '../components/common/SkeletonLoader';
import Modal from '../components/common/Modal';
import { CATEGORIES, STATUSES, SORT_OPTIONS } from '../utils/constants';
import { projectApi } from '../api/projectApi';

export default function ProjectList() {
  var searchParams = useSearchParams()[0];
  var navigate = useNavigate();
  var toast = useToast();

  var deleteIdState = useState(null);
  var deleteId = deleteIdState[0];
  var setDeleteId = deleteIdState[1];

  var initialFilters = {};
  if (searchParams.get('search')) initialFilters.search = searchParams.get('search');
  if (searchParams.get('category')) initialFilters.category = searchParams.get('category');

  var projectHook = useProjects(initialFilters);
  var projects = projectHook.projects;
  var loading = projectHook.loading;
  var pagination = projectHook.pagination;
  var filters = projectHook.filters;
  var updateFilters = projectHook.updateFilters;
  var goToPage = projectHook.goToPage;
  var resetFilters = projectHook.resetFilters;

  var handleDelete = function () {
    if (!deleteId) return;
    projectApi.deleteProject(deleteId)
      .then(function () { toast.success('Project deleted successfully'); setDeleteId(null); })
      .catch(function (err) { toast.error(err.message || 'Delete failed'); });
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="glass-panel rounded-3xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2 bg-white/90 border border-slate-200 rounded-2xl px-3 py-2.5 flex-1 max-w-md shadow-sm">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input type="text" value={filters.search} onChange={function (e) { updateFilters({ search: e.target.value }); }} placeholder="Search projects, technologies..." className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 w-full" aria-label="Search projects" />
            {filters.search && (<button onClick={function () { updateFilters({ search: '' }); }} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>)}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select value={filters.category} onChange={function (e) { updateFilters({ category: e.target.value }); }} className="input-field py-2.5 w-auto cursor-pointer" aria-label="Filter by category">
            <option value="">All Categories</option>
            {CATEGORIES.map(function (c) { return <option key={c.value} value={c.value}>{c.label}</option>; })}
          </select>
          <select value={filters.status} onChange={function (e) { updateFilters({ status: e.target.value }); }} className="input-field py-2.5 w-auto cursor-pointer" aria-label="Filter by status">
            <option value="">All Statuses</option>
            {STATUSES.map(function (s) { return <option key={s.value} value={s.value}>{s.label}</option>; })}
          </select>
          <select value={filters.sort} onChange={function (e) { updateFilters({ sort: e.target.value }); }} className="input-field py-2.5 w-auto cursor-pointer" aria-label="Sort projects">
            {SORT_OPTIONS.map(function (s) { return <option key={s.value} value={s.value}>{s.label}</option>; })}
          </select>
          <button onClick={function () { navigate('/projects/new'); }} className="btn-primary whitespace-nowrap"><Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Project</span></button>
        </div>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-sm text-slate-500 mb-4 ml-1">
        {pagination.totalItems} project{pagination.totalItems !== 1 ? 's' : ''} found
      </motion.p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(function (i) { return <SkeletonProjectCard key={i} />; })}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {projects.map(function (project, i) {
              return (
                <ProjectCard
                  key={project._id}
                  project={project}
                  index={i}
                  onEdit={function () { navigate('/projects/' + project._id + '/edit'); }}
                  onDelete={function () { setDeleteId(project._id); }}
                />
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-16 text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4"><SearchX className="w-8 h-8 text-slate-300" /></div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No projects found</h3>
          <p className="text-slate-500 text-sm mb-6">Try adjusting your search or filter criteria</p>
          <button onClick={resetFilters} className="btn-secondary">Clear Filters</button>
        </motion.div>
      )}

      {pagination.totalPages > 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2">
          <button onClick={function () { goToPage(pagination.page - 1); }} disabled={!pagination.hasPrev} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:pointer-events-none" aria-label="Previous page">&lsaquo;</button>
          {Array.from({ length: pagination.totalPages }, function (_, i) { return i + 1; }).map(function (p) {
            return (
              <button key={p} onClick={function () { goToPage(p); }} className={'w-9 h-9 rounded-lg text-sm font-medium transition-colors ' + (p === pagination.page ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-slate-50')}>
                {p}
              </button>
            );
          })}
          <button onClick={function () { goToPage(pagination.page + 1); }} disabled={!pagination.hasNext} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:pointer-events-none" aria-label="Next page">&rsaquo;</button>
        </motion.div>
      )}

      <Modal open={!!deleteId} title="Delete Project" message="Are you sure you want to delete this project? This action cannot be undone." confirmText="Delete Project" type="danger" onConfirm={handleDelete} onCancel={function () { setDeleteId(null); }} />
    </div>
  );
}