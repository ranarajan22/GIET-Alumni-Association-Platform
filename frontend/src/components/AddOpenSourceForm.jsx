import { useState } from 'react';
import PropTypes from 'prop-types';
import { Github, Plus, X, Loader } from 'lucide-react';
import api from '../utils/api';
import { handleError, handleSuccess } from '../utils/utils';

const AddOpenSourceForm = ({ onProjectAdded, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    languages: '',
    repoLink: '',
    stars: '',
    contributors: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.repoLink.trim()) {
      handleError('Name, description, and repository link are required');
      return;
    }

    // Validate GitHub URL
    const githubRegex = /^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;
    if (!githubRegex.test(formData.repoLink)) {
      handleError('Please enter a valid GitHub repository URL');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(
        '/api/open-source/add',
        {
          name: formData.name,
          description: formData.description,
          languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang),
          repoLink: formData.repoLink,
          stars: formData.stars ? parseInt(formData.stars) : 0,
          contributors: formData.contributors ? parseInt(formData.contributors) : 1
        }
      );

      if (response.data.success) {
        handleSuccess('Open source project added successfully!');
        setFormData({ name: '', description: '', languages: '', repoLink: '', stars: '', contributors: '' });
        onProjectAdded(response.data.project);
        onCancel();
      }
    } catch (error) {
      handleError(error.response?.data?.message || 'Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800">
          <div className="flex items-center gap-3">
            <Github className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Add Open Source Project</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., React Components Library"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what this project does..."
              rows="4"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Repository Link *
              </label>
              <input
                type="url"
                name="repoLink"
                value={formData.repoLink}
                onChange={handleChange}
                placeholder="https://github.com/username/repo"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="text-xs text-slate-400 mt-1">Must be a valid GitHub URL</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Languages (comma-separated)
              </label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="e.g., JavaScript, CSS, HTML"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                GitHub Stars
              </label>
              <input
                type="number"
                name="stars"
                value={formData.stars}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contributors
              </label>
              <input
                type="number"
                name="contributors"
                value={formData.contributors}
                onChange={handleChange}
                placeholder="1"
                min="1"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Project
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-700 text-white py-2 rounded-lg font-semibold hover:bg-slate-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOpenSourceForm;

AddOpenSourceForm.propTypes = {
  onProjectAdded: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
