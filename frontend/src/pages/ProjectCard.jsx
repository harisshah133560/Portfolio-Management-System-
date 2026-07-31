import { motion } from 'framer-motion';
import { Pencil, Trash2, ExternalLink, Github } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import TechTags from '../components/common/TechTags';
import { getCategoryLabel, getCategoryColor, formatRelative } from '../utils/helpers';

export default function ProjectCard(props) {
  var project = props.project;
  var index = props.index || 0;
  var onEdit = props.onEdit;
  var onDelete = props.onDelete;
  var catColor = getCategoryColor(project.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      className="card overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_35px_-20px_rgba(15,23,42,0.35)] transition-all duration-200"
    >
      <div className="relative h-52 bg-slate-100 overflow-hidden group">
        <img
          src={project.imageUrl || 'https://picsum.photos/seed/' + project._id + '/600/400'}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={function (e) { e.target.src = 'https://picsum.photos/seed/fb' + index + '/600/400'; }}
        />
        <div className="absolute top-3 right-3"><StatusBadge status={project.status} /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3 gap-2">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener" className="p-2 rounded-lg bg-white/90 hover:bg-white text-slate-700 transition-colors" title="Live Demo"><ExternalLink className="w-4 h-4" /></a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener" className="p-2 rounded-lg bg-white/90 hover:bg-white text-slate-700 transition-colors" title="GitHub"><Github className="w-4 h-4" /></a>
          )}
          <button onClick={onEdit} className="p-2 rounded-lg bg-white/90 hover:bg-white text-slate-700 transition-colors" title="Edit"><Pencil className="w-4 h-4" /></button>
          <button onClick={onDelete} className="p-2 rounded-lg bg-white/90 hover:bg-red-50 text-red-600 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-slate-900 text-base leading-snug mb-2">{project.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.description}</p>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: catColor + '15', color: catColor }}>{getCategoryLabel(project.category)}</span>
          <span className="text-xs text-slate-400">{formatRelative(project.updatedAt)}</span>
        </div>
        <TechTags technologies={project.technologies || []} />
      </div>
    </motion.div>
  );
}