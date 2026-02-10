import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Link as LinkIcon, ExternalLink } from 'lucide-react';
import axios from '../utils/axios';

export default function CompanyDetail() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', url: '' });

  const companies = {
    microsoft: { name: 'Microsoft', logo: '🔵' },
    google: { name: 'Google', logo: '🔍' },
    meta: { name: 'Meta', logo: '📱' },
    amazon: { name: 'Amazon', logo: '📦' },
    apple: { name: 'Apple', logo: '🍎' },
    linkedin: { name: 'LinkedIn', logo: '🔗' },
    netflix: { name: 'Netflix', logo: '🎬' },
    uber: { name: 'Uber', logo: '🚗' }
  };

  const company = companies[companyId] || { name: 'Company', logo: '🏢' };

  const handleAddArticle = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.url.trim()) {
      // call API to persist
      axios.post('/api/company-articles', { companyId, title: formData.title, url: formData.url })
        .then(res => {
          if (res.data?.success) {
            setArticles(prev => [res.data.article, ...prev]);
            setFormData({ title: '', url: '' });
            setShowForm(false);
          } else {
            alert(res.data?.message || 'Could not add article');
          }
        })
        .catch(err => {
          console.error('Add article error', err);
          alert(err.response?.data?.message || err.message || 'Error adding article');
        });
    }
  };

  const handleRemoveArticle = (id) => {
    // call delete API
    axios.delete(`/api/company-articles/${id}`)
      .then(res => {
        if (res.data?.success) {
          setArticles(prev => prev.filter(a => a._id !== id && a.id !== id));
        } else {
          alert(res.data?.message || 'Could not remove article');
        }
      })
      .catch(err => {
        console.error('Remove article error', err);
        alert(err.response?.data?.message || err.message || 'Error removing article');
      });
  };

  useEffect(() => {
    // load persisted articles
    let mounted = true;
    axios.get(`/api/company-articles/${companyId}`)
      .then(res => {
        if (!mounted) return;
        if (res.data?.success) {
          setArticles(res.data.articles || []);
        }
      })
      .catch(err => {
        console.error('Load articles error', err);
      });
    return () => { mounted = false };
  }, [companyId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-indigo-600 font-semibold transition-colors mb-4"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-6xl">{company.logo}</div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">{company.name}</h1>
              <p className="text-gray-600 mt-1">Add and manage interview resources & articles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Add Article Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all hover:shadow-lg"
          >
            <Plus size={20} />
            Add Article/Resource
          </button>
        </div>

        {/* Add Article Form */}
        {showForm && (
          <form
            onSubmit={handleAddArticle}
            className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-indigo-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Article/Resource</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Article Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., How to crack Microsoft interview"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Article URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="e.g., https://medium.com/article"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all"
                >
                  Add Article
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Articles List */}
        {articles.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📚 Articles & Resources ({articles.length})
            </h2>
            
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <LinkIcon size={20} className="text-indigo-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{article.url}</p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-200 transition-all"
                    >
                      Read Article
                      <ExternalLink size={16} />
                    </a>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <p className="text-xs text-gray-500">Added: {article.addedAt}</p>
                    <button
                      onClick={() => handleRemoveArticle(article.id)}
                      className="px-3 py-1 bg-red-100 text-red-600 font-semibold rounded hover:bg-red-200 transition-all text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
            <LinkIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Articles Yet</h3>
            <p className="text-gray-600 mb-6">
              Be the first to add articles and resources for {company.name} interview preparation!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all"
            >
              <Plus size={20} />
              Add First Article
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
