import React, { useState, useEffect } from 'react';
import { Github, Star, Users, ExternalLink, Trash2, Plus, AlertCircle, Loader } from 'lucide-react';
import api from '../utils/api';
import AddOpenSourceForm from './AddOpenSourceForm';

const OpenSource = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const id = localStorage.getItem('userId');
    setRole(userRole);
    setUserId(id);
    
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/open-source/all');
      
      if (response.data.success) {
        setProjects(response.data.projects || []);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load open source projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectAdded = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await api.delete(`/api/open-source/delete/${projectId}`);

      if (response.data.success) {
        setProjects(prev => prev.filter(p => p._id !== projectId));
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      alert(err.response?.data?.message || 'Failed to delete project');
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Github className="w-8 h-8 text-cyan-400" />
            Open Source Projects
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {role === 'alumni' 
              ? 'Share your contributions and showcase your work' 
              : 'Discover amazing open source projects by our alumni'}
          </p>
        </div>

        {role === 'alumni' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add Project
          </button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="text-slate-600 dark:text-slate-400">Loading projects...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && projects.length === 0 && (
        <div className="text-center py-12">
          <Github className="w-12 h-12 text-slate-500 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">No open source projects yet</p>
          {role === 'alumni' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Be the first to add one
            </button>
          )}
        </div>
      )}

      {/* Projects Grid */}
      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div
              key={project._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-cyan-500/50 transition-all group"
            >
              {/* Alumni Info */}
              {project.alumniId && (
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                  {project.alumniId.profilePhoto && (
                    <img
                      src={project.alumniId.profilePhoto}
                      alt={project.alumniId.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-600"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {project.alumniId.fullName}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Alumni</p>
                  </div>
                </div>
              )}

              {/* Project Info */}
              <div className="flex items-start gap-2 mb-3">
                <Github className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition break-words">
                  {project.name}
                </h3>
              </div>

              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Languages */}
              {project.languages && project.languages.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {project.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300 text-xs rounded-full border border-cyan-200 dark:border-cyan-500/30"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-slate-600 dark:text-slate-400 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{project.stars} stars</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>{project.contributors} contributors</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-slate-700">
                <a
                  href={project.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Repo
                </a>

                {role === 'alumni' && userId && project.alumniId?._id === userId && (
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Form Modal */}
      {showAddForm && (
        <AddOpenSourceForm
          onProjectAdded={handleProjectAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default OpenSource;
