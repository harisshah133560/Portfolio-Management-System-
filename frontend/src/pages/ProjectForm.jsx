import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Type, Layers, Code2, UploadCloud, PlusCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { projectApi } from '../api/projectApi';
import { CATEGORIES, STATUSES } from '../utils/constants';
import { compressImage, getAssetUrl } from '../utils/helpers';

export default function ProjectForm() {
  var params = useParams();
  var id = params.id;
  var isEdit = !!id;
  var navigate = useNavigate();
  var toast = useToast();
  var fileInputRef = useRef(null);
  var dropZoneRef = useRef(null);

  var loadingState = useState(isEdit);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var submittingState = useState(false);
  var submitting = submittingState[0];
  var setSubmitting = submittingState[1];

  var techsState = useState([]);
  var techs = techsState[0];
  var setTechs = techsState[1];

  var techInputState = useState('');
  var techInput = techInputState[0];
  var setTechInput = techInputState[1];

  var imageFileState = useState(null);
  var imageFile = imageFileState[0];
  var setImageFile = imageFileState[1];

  var imagePreviewState = useState('');
  var imagePreview = imagePreviewState[0];
  var setImagePreview = imagePreviewState[1];

  var errorsState = useState({});
  var errors = errorsState[0];
  var setErrors = errorsState[1];

  var formState = useState({
    title: '',
    description: '',
    category: '',
    status: 'planned',
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
  });
  var form = formState[0];
  var setForm = formState[1];

  useEffect(function () {
    if (!isEdit) return;
    projectApi.getProject(id)
      .then(function (res) {
        if (res.data.success) {
          var p = res.data.data;
          setForm({
            title: p.title || '',
            description: p.description || '',
            category: p.category || '',
            status: p.status || 'planned',
            githubUrl: p.githubUrl || '',
            liveUrl: p.liveUrl || '',
            imageUrl: p.imageUrl || '',
          });
          setTechs(p.technologies || []);
          if (p.imageUrl) setImagePreview(getAssetUrl(p.imageUrl));
        }
      })
      .catch(function () {
        toast.error('Project not found');
        navigate('/projects');
      })
      .finally(function () { setLoading(false); });
  }, [id, isEdit]);

  var handleChange = function (e) {
    var updated = Object.assign({}, form);
    updated[e.target.name] = e.target.value;
    setForm(updated);
    if (errors[e.target.name]) {
      var errUpdated = Object.assign({}, errors);
      delete errUpdated[e.target.name];
      setErrors(errUpdated);
    }
  };

  var addTech = function () {
    var val = techInput.trim();
    if (!val || techs.indexOf(val) !== -1) { setTechInput(''); return; }
    if (techs.length >= 10) { toast.warning('Maximum 10 technologies'); return; }
    setTechs(techs.concat([val]));
    setTechInput('');
  };

  var removeTech = function (tech) {
    setTechs(techs.filter(function (t) { return t !== tech; }));
  };

  var handleImageSelect = function (file) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setImageFile(file);
    compressImage(file).then(function (compressed) {
      setImagePreview(compressed);
    });
  };

  var handleDragOver = function (e) { e.preventDefault(); if (dropZoneRef.current) dropZoneRef.current.classList.add('border-blue-400', 'bg-blue-50'); };
  var handleDragLeave = function () { if (dropZoneRef.current) dropZoneRef.current.classList.remove('border-blue-400', 'bg-blue-50'); };
  var handleDrop = function (e) { e.preventDefault(); handleDragLeave(); if (e.dataTransfer.files[0]) handleImageSelect(e.dataTransfer.files[0]); };

  var validate = function () {
    var errs = {};
    if (!form.title.trim()) errs.title = 'Project title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.category) errs.category = 'Please select a category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  var handleSubmit = function (e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    var formData = new FormData();
    formData.append('title', form.title.trim());
    formData.append('description', form.description.trim());
    formData.append('category', form.category);
    formData.append('status', form.status);
    formData.append('githubUrl', form.githubUrl);
    formData.append('liveUrl', form.liveUrl);
    techs.forEach(function (t) { formData.append('technologies', t); });

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (imagePreview && imagePreview.indexOf('data:') === 0) {
      var byteString = atob(imagePreview.split(',')[1]);
      var mimeString = imagePreview.split(',')[0].split(':')[1].split(';')[0];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) { ia[i] = byteString.charCodeAt(i); }
      var blob = new Blob([ab], { type: mimeString });
      formData.append('image', blob, 'image.jpg');
    }

    var apiCall = isEdit ? projectApi.updateProject(id, formData) : projectApi.createProject(formData);
    apiCall
      .then(function () {
        toast.success(isEdit ? 'Project updated successfully' : 'Project created successfully');
        navigate('/projects');
      })
      .catch(function (err) { toast.error(err.message || 'Failed to save project'); })
      .finally(function () { setSubmitting(false); });
  };

  var removeImage = function () {
    setImageFile(null);
    setImagePreview('');
    var updated = Object.assign({}, form);
    updated.imageUrl = '';
    setForm(updated);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {[1, 2, 3, 4].map(function (i) {
          return (
            <div key={i} className="card p-6 space-y-4">
              <div className="w-40 h-5 rounded bg-slate-200 animate-pulse" />
              <div className="w-full h-10 rounded-lg bg-slate-200 animate-pulse" />
              <div className="w-full h-24 rounded-lg bg-slate-200 animate-pulse" />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
        <button onClick={function () { navigate('/projects'); }} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-4"><ArrowLeft className="w-4 h-4" />Back to Projects</button>
        <h2 className="text-2xl font-extrabold text-slate-900">{isEdit ? 'Edit Project' : 'Create New Project'}</h2>
        <p className="text-slate-500 mt-1">{isEdit ? 'Update your project details' : 'Fill in the details to add a new project'}</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Type className="w-4 h-4 text-blue-500" />Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Title <span className="text-red-400">*</span></label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="My Awesome Project" className={'input-field ' + (errors.title ? 'border-red-400' : '')} />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description <span className="text-red-400">*</span></label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe your project..." className={'input-field resize-none ' + (errors.description ? 'border-red-400' : '')} />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Layers className="w-4 h-4 text-blue-500" />Project Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category <span className="text-red-400">*</span></label>
              <select name="category" value={form.category} onChange={handleChange} className={'input-field cursor-pointer ' + (errors.category ? 'border-red-400' : '')}>
                <option value="">Select category</option>
                {CATEGORIES.map(function (c) { return <option key={c.value} value={c.value}>{c.label}</option>; })}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field cursor-pointer">
                {STATUSES.map(function (s) { return <option key={s.value} value={s.value}>{s.label}</option>; })}
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Code2 className="w-4 h-4 text-blue-500" />Technologies</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {techs.map(function (t) {
              return (
                <span key={t} className="tech-tag">{t}<button type="button" onClick={function () { removeTech(t); }} className="ml-0.5 text-blue-400 hover:text-red-500 transition-colors">&times;</button></span>
              );
            })}
          </div>
          <div className="flex gap-2">
            <input type="text" value={techInput} onChange={function (e) { setTechInput(e.target.value); }} onKeyDown={function (e) { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }} placeholder="Type a technology and press Enter" className="input-field flex-1 py-2.5" aria-label="Add technology" />
            <button type="button" onClick={addTech} className="btn-secondary"><PlusCircle className="w-4 h-4" />Add</button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><UploadCloud className="w-4 h-4 text-blue-500" />Links</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">GitHub Repository URL</label>
              <input name="githubUrl" value={form.githubUrl} onChange={handleChange} placeholder="https://github.com/user/repo" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Live Demo URL</label>
              <input name="liveUrl" value={form.liveUrl} onChange={handleChange} placeholder="https://myproject-demo.com" className="input-field" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><UploadCloud className="w-4 h-4 text-blue-500" />Project Image</h3>
          <div
            ref={dropZoneRef}
            onClick={function () { fileInputRef.current && fileInputRef.current.click(); }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50/50"
          >
            {imagePreview ? (
              <img src={getAssetUrl(imagePreview)} alt="Preview" className="max-h-64 mx-auto rounded-lg mb-4 object-cover" />
            ) : (
              <div>
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4"><UploadCloud className="w-8 h-8 text-slate-300" /></div>
                <p className="text-sm font-medium text-slate-700 mb-1">Drop your image here or click to browse</p>
                <p className="text-xs text-slate-400">PNG, JPG, or WebP up to 5MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={function (e) { if (e.target.files[0]) handleImageSelect(e.target.files[0]); }} className="hidden" aria-label="Upload project image" />
          </div>
          {imagePreview && <button type="button" onClick={removeImage} className="mt-3 text-sm text-red-500 hover:text-red-600 font-medium transition-colors">Remove image</button>}
        </motion.div>

        <div className="flex items-center justify-end gap-3 pt-2 pb-8">
          <button type="button" onClick={function () { navigate('/projects'); }} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary px-8">
            {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (isEdit ? 'Update Project' : 'Create Project')}
          </button>
        </div>
      </form>
    </div>
  );
}