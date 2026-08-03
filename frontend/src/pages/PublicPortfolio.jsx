import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Code2, Github, Globe2, Linkedin, Mail, Sparkles, MonitorSmartphone, Zap } from 'lucide-react';
import { authApi } from '../api/authApi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getAssetUrl } from '../utils/helpers';

export default function PublicPortfolio() {
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    Promise.all([
      api.get('/projects/public'),
      authApi.getPublicProfile().catch(() => null),
    ])
      .then(([projectsRes, profileRes]) => {
        if (projectsRes.data.success) setProjects(projectsRes.data.data || []);
        if (profileRes && profileRes.data && profileRes.data.success) setProfile(profileRes.data.data);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  var profileName = profile && profile.name ? profile.name : 'Haris Shah';
  var profileHeadline = profile && profile.headline ? profile.headline : 'I build practical web experiences with modern tools and a strong focus on usability.';
  var profileRole = profile && profile.role ? profile.role : 'Software Developer';
  var profileAbout = profile && profile.about ? profile.about : 'I am passionate about creating clean, practical web experiences and turning ideas into polished digital products.';
  var profileEmail = profile && profile.emailAddress ? profile.emailAddress : 'haris@example.com';
  var profileGithub = profile && profile.githubUrl ? profile.githubUrl : 'https://github.com/harisshah133560';
  var profileLinkedin = profile && profile.linkedinUrl ? profile.linkedinUrl : 'https://www.linkedin.com/in/harisshah-/';
  var profileAvatar = profile && profile.avatar ? getAssetUrl(profile.avatar) : null;
  var profileCv = profile && profile.cvUrl ? profile.cvUrl : null;
  var skills = ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Express', 'REST APIs'];
  var profileInitials = profileName
    .split(' ')
    .map(function (part) { return part.charAt(0).toUpperCase(); })
    .slice(0, 2)
    .join('');

  return (
    <div className={"min-h-screen transition-colors duration-300 " + (theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_30%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900')}>
      <header className="max-w-6xl mx-auto px-6 py-6 lg:py-10">
        <nav className={"mb-8 flex flex-wrap items-center justify-between gap-4 rounded-full border px-4 py-3 shadow-sm backdrop-blur " + (theme === 'dark' ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200/80 bg-white/80')}>
          <a href="#top" className={"text-sm font-semibold " + (theme === 'dark' ? 'text-slate-100' : 'text-slate-900')}>{profileName}</a>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <a href="#about" className={"rounded-full px-3 py-1.5 transition " + (theme === 'dark' ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')}>About</a>
            <a href="#projects" className={"rounded-full px-3 py-1.5 transition " + (theme === 'dark' ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')}>Projects</a>
            <a href="#contact" className={"rounded-full px-3 py-1.5 transition " + (theme === 'dark' ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')}>Contact</a>
            <a href={isAuthenticated ? '/dashboard' : '/login'} className={"rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition " + (theme === 'dark' ? 'border-sky-700 bg-sky-600/20 text-sky-300 hover:bg-sky-600/30' : 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100')}>Admin Dashboard</a>
            <button onClick={toggleTheme} className={"rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition " + (theme === 'dark' ? 'border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50')}>
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </nav>

        <motion.div id="top" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={"rounded-[32px] border p-8 lg:p-12 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.35)] backdrop-blur " + (theme === 'dark' ? 'border-slate-800 bg-slate-900/70' : 'border-white/70 bg-white/80')}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="mb-6 flex items-center gap-4">
                {profileAvatar ? (
                  <img src={profileAvatar} alt={profileName} className="h-20 w-20 rounded-full object-cover ring-4 ring-sky-200 shadow-lg" />
                ) : (
                  <div className={"flex h-20 w-20 items-center justify-center rounded-full border text-xl font-bold shadow-lg " + (theme === 'dark' ? 'border-slate-700 bg-slate-800 text-slate-100' : 'border-slate-200 bg-white text-slate-800')}>
                    {profileInitials}
                  </div>
                )}
                <div>
                  <p className={"text-sm font-semibold uppercase tracking-[0.2em] " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>Portfolio Owner</p>
                  <p className={"text-lg font-semibold " + (theme === 'dark' ? 'text-slate-200' : 'text-slate-800')}>{profileName}</p>
                </div>
              </div>
              <div className={"inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium mb-5 " + (theme === 'dark' ? 'border-slate-700 bg-slate-800/80 text-slate-300' : 'border-slate-200 bg-white/80 text-slate-600')}>
                <Sparkles className="w-4 h-4 text-sky-600" />
                Software Developer • Portfolio Showcase
              </div>
              <h1 className={"text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight " + (theme === 'dark' ? 'text-white' : 'text-slate-900')}>
                Hi, I’m <span className="text-sky-600">{profileName}</span>
              </h1>
              <p className={"mt-5 text-lg leading-8 " + (theme === 'dark' ? 'text-slate-300' : 'text-slate-600')}>
                {profileHeadline}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#projects" className="btn-primary">View Projects <ArrowRight className="w-4 h-4" /></a>
                {profileCv ? (
                  <a href={profileCv} target="_blank" rel="noreferrer" className="btn-secondary">Download CV</a>
                ) : (
                  <a href="#contact" className="btn-secondary">Get in Touch</a>
                )}
              </div>
            </div>
            <div className={"rounded-3xl border p-6 shadow-sm min-w-[280px] " + (theme === 'dark' ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/80')}>
              <p className={"text-sm font-semibold uppercase tracking-[0.2em] " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>Currently building</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map(function (skill) {
                  return <span key={skill} className={"tech-tag " + (theme === 'dark' ? 'bg-slate-800 text-slate-200 border-slate-700' : '')}>{skill}</span>;
                })}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className={"rounded-2xl p-3 " + (theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50')}>
                  <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Projects</p>
                  <p className={"mt-1 text-lg font-semibold " + (theme === 'dark' ? 'text-white' : 'text-slate-900')}>{projects.length}</p>
                </div>
                <div className={"rounded-2xl p-3 " + (theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50')}>
                  <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Focus</p>
                  <p className={"mt-1 text-lg font-semibold " + (theme === 'dark' ? 'text-white' : 'text-slate-900')}>Full Stack</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-16">
        <section id="about" className="mb-10 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6">
          <div className={"card p-6 lg:p-8 " + (theme === 'dark' ? 'bg-slate-900 border-slate-800' : '')}>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-2 text-sky-700">
                <Briefcase className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">About Me</p>
            </div>
            <h2 className={"mt-4 text-2xl font-bold " + (theme === 'dark' ? 'text-white' : 'text-slate-900')}>{profileRole}</h2>
            <p className={"mt-3 text-base leading-7 " + (theme === 'dark' ? 'text-slate-300' : 'text-slate-600')}>
              {profileAbout}                         
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <div className={"rounded-2xl border px-4 py-3 text-sm " + (theme === 'dark' ? 'border-slate-800 bg-slate-800/70 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700')}>
                <div className={"flex items-center gap-2 font-semibold " + (theme === 'dark' ? 'text-slate-100' : 'text-slate-900')}><Briefcase className="w-4 h-4 text-sky-600" /> Product-minded development</div>
              </div>
              <div className={"rounded-2xl border px-4 py-3 text-sm " + (theme === 'dark' ? 'border-slate-800 bg-slate-800/70 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700')}>
                <div className={"flex items-center gap-2 font-semibold " + (theme === 'dark' ? 'text-slate-100' : 'text-slate-900')}><Code2 className="w-4 h-4 text-sky-600" /> Clean, maintainable code</div>
              </div>
            </div>
          </div>
          <div className={"card p-8 lg:p-10 " + (theme === 'dark' ? 'bg-slate-900 border-slate-800' : '')}>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-2 text-sky-700">
                <Mail className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Contact</p>
            </div>
            <h3 className={"mt-4 text-xl font-semibold " + (theme === 'dark' ? 'text-white' : 'text-slate-900')}>Let’s talk about your next idea</h3>
            <p className={"mt-2 text-sm leading-6 " + (theme === 'dark' ? 'text-slate-300' : 'text-slate-600')}>
              Reach out for collaborations, freelance work, or new product opportunities.
            </p>
            <div className="mt-4 space-y-3">
              <a href={'mailto:' + profileEmail} className={"flex items-center gap-3 rounded-2xl border px-4 py-3 transition " + (theme === 'dark' ? 'border-slate-800 bg-slate-800/70 text-slate-200 hover:border-sky-500 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-200 hover:bg-sky-50')}>
                <Mail className="w-5 h-5" /> {profileEmail}
              </a>
              <a href={profileLinkedin} target="_blank" rel="noreferrer" className={"flex items-center gap-3 rounded-2xl border px-4 py-3 transition " + (theme === 'dark' ? 'border-slate-800 bg-slate-800/70 text-slate-200 hover:border-sky-500 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-200 hover:bg-sky-50')}>
                <Linkedin className="w-5 h-5" /> LinkedIn
              </a>
              <a href={profileGithub} target="_blank" rel="noreferrer" className={"flex items-center gap-3 rounded-2xl border px-4 py-3 transition " + (theme === 'dark' ? 'border-slate-800 bg-slate-800/70 text-slate-200 hover:border-sky-500 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-200 hover:bg-sky-50')}>
                <Github className="w-5 h-5" /> GitHub
              </a>
            </div>
           
          </div>
        </section>

        <section id="projects" className="mb-10">
          <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Featured Work</p>
              <h2 className={"text-2xl font-bold " + (theme === 'dark' ? 'text-white' : 'text-slate-900')}>Projects</h2>
            </div>
            <div className={"rounded-2xl border px-4 py-3 text-sm " + (theme === 'dark' ? 'border-slate-800 bg-slate-900/70 text-slate-300' : 'border-slate-200 bg-white/70 text-slate-600')}>
              Built to be practical, polished, and easy to update.
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map(function (i) { return <div key={i} className={"card h-56 animate-pulse " + (theme === 'dark' ? 'bg-slate-900 border-slate-800' : '')} />; })}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map(function (project, index) {
                return (
                  <motion.article key={project._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={"card overflow-hidden " + (theme === 'dark' ? 'bg-slate-900 border-slate-800' : '')}>
                    <div className="h-44 bg-slate-100">
                      <img src={getAssetUrl(project.imageUrl, 'https://picsum.photos/seed/' + project._id + '/600/400')} alt={project.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-5">
                      <div className={"flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-400')}>
                        <Globe2 className="w-3.5 h-3.5" /> {project.category || 'Project'}
                      </div>
                      <h3 className={"mt-3 font-semibold " + (theme === 'dark' ? 'text-white' : 'text-slate-900')}>{project.title}</h3>
                      <p className={"mt-2 text-sm leading-6 " + (theme === 'dark' ? 'text-slate-300' : 'text-slate-600')}>{project.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(project.technologies || []).slice(0, 4).map(function (tech) {
                          return <span key={tech} className={"tech-tag " + (theme === 'dark' ? 'bg-slate-800 text-slate-200 border-slate-700' : '')}>{tech}</span>;
                        })}
                      </div>
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className={"mt-5 inline-flex items-center gap-2 text-sm font-semibold " + (theme === 'dark' ? 'text-sky-400 hover:text-sky-300' : 'text-sky-700 hover:text-sky-800')}>
                          <Github className="w-4 h-4" /> View on GitHub
                        </a>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <div className={"card p-10 text-center " + (theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300' : 'text-slate-600')}>Projects will appear here soon.</div>
          )}
        </section>

        <section className="mb-10 grid gap-6 lg:grid-cols-3">
          <div className={"card p-6 " + (theme === 'dark' ? 'bg-slate-900 border-slate-800' : '')}>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-2 text-sky-700"><MonitorSmartphone className="w-5 h-5" /></div>
              <div>
                <h3 className={"font-semibold " + (theme === 'dark' ? 'text-white' : 'text-slate-900')}>Responsive by design</h3>
                <p className={"mt-1 text-sm " + (theme === 'dark' ? 'text-slate-300' : 'text-slate-600')}>The experience feels polished on desktop and mobile alike.</p>
              </div>
            </div>
          </div>
          <div className={"card p-6 " + (theme === 'dark' ? 'bg-slate-900 border-slate-800' : '')}>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700"><Zap className="w-5 h-5" /></div>
              <div>
                <h3 className={"font-semibold " + (theme === 'dark' ? 'text-white' : 'text-slate-900')}>Fast and modern</h3>
                <p className={"mt-1 text-sm " + (theme === 'dark' ? 'text-slate-300' : 'text-slate-600')}>Built with React and Vite for a smooth, modern experience.</p>
              </div>
            </div>
          </div>
          <div className={"card p-6 " + (theme === 'dark' ? 'bg-slate-900 border-slate-800' : '')}>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-violet-100 p-2 text-violet-700"><Briefcase className="w-5 h-5" /></div>
              <div>
                <h3 className={"font-semibold " + (theme === 'dark' ? 'text-white' : 'text-slate-900')}>Easy to manage</h3>
                <p className={"mt-1 text-sm " + (theme === 'dark' ? 'text-slate-300' : 'text-slate-600')}>Update your profile and projects from a single dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className={"card p-8 lg:p-10 " + (theme === 'dark' ? 'bg-slate-900 border-slate-800' : '')}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Let’s connect</p>
              <h2 className={"mt-2 text-2xl font-bold " + (theme === 'dark' ? 'text-white' : 'text-slate-900')}>Interested in working together?</h2>
              <p className={"mt-3 max-w-2xl leading-7 " + (theme === 'dark' ? 'text-slate-300' : 'text-slate-600')}>
                I’m always open to meaningful collaborations, thoughtful product ideas, and opportunities to build polished digital experiences.
              </p>
            </div>
            <a href={'mailto:' + profileEmail} className="btn-primary">Say Hello</a>
          </div>
        </section>
      </main>

      <footer className={"border-t py-6 text-center text-sm " + (theme === 'dark' ? 'border-slate-800 bg-slate-900/70 text-slate-400' : 'border-slate-200/80 bg-white/70 text-slate-500')}>
        Built with React, Node.js, MongoDB, and Tailwind CSS.
      </footer>
    </div>
  );
}
