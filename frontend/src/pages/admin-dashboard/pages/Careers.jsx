import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import careerService from '../../../utils/careerService';
import { useLanguage } from '../../../contexts/LanguageContext';

const AdminCareers = () => {
  const { language } = useLanguage();
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCareer, setCurrentCareer] = useState(null);

  const [formData, setFormData] = useState({
    title_en: '',
    title_gu: '',
    department: '',
    location: '',
    type: 'Full-time',
    salary: '',
    tags: '',
    description_en: '',
    description_gu: '',
    active: true
  });

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    setLoading(true);
    const result = await careerService.getAllCareersAdmin();
    if (result.success) {
      setCareers(result.data);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      title: { en: formData.title_en, gu: formData.title_gu },
      department: formData.department,
      location: formData.location,
      type: formData.type,
      salary: formData.salary,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      description: { en: formData.description_en, gu: formData.description_gu },
      active: formData.active
    };

    let result;
    if (isEditing && currentCareer) {
      result = await careerService.updateCareer(currentCareer._id, payload);
    } else {
      result = await careerService.createCareer(payload);
    }

    if (result.success) {
      toast.success(isEditing ? 'Job updated successfully' : 'Job created successfully');
      setShowModal(false);
      resetForm();
      fetchCareers();
    } else {
      toast.error(result.error);
    }
  };

  const handleEdit = (career) => {
    setIsEditing(true);
    setCurrentCareer(career);
    setFormData({
      title_en: career.title.en,
      title_gu: career.title.gu,
      department: career.department,
      location: career.location,
      type: career.type,
      salary: career.salary,
      tags: career.tags.join(', '),
      description_en: career.description.en,
      description_gu: career.description.gu,
      active: career.active
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-medium text-sm">
          {language === 'en' ? 'Are you sure you want to delete this job opening?' : 'શું તમે ખરેખર આ જોબ ઓપનિંગ કાઢી નાખવા માંગો છો?'}
        </span>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-200"
            onClick={() => toast.dismiss(t.id)}
          >
            {language === 'en' ? 'Cancel' : 'રદ કરો'}
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700"
            onClick={async () => {
              toast.dismiss(t.id);
              const result = await careerService.deleteCareer(id);
              if (result.success) {
                toast.success('Job deleted successfully');
                fetchCareers();
              } else {
                toast.error(result.error);
              }
            }}
          >
            {language === 'en' ? 'Delete' : 'કાઢી નાખો'}
          </button>
        </div>
      </div>
    ), { duration: 5000, icon: '🗑️' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentCareer(null);
    setFormData({
      title_en: '',
      title_gu: '',
      department: '',
      location: '',
      type: 'Full-time',
      salary: '',
      tags: '',
      description_en: '',
      description_gu: '',
      active: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'en' ? 'Careers Management' : 'કારકિર્દી વ્યવસ્થાપન'}
          </h1>
          <p className="text-gray-500">
            {language === 'en' ? 'Manage detailed job openings and applications' : 'વિગતવાર નોકરીની શરૂઆત અને એપ્લિકેશન્સનું સંચાલન કરો'}
          </p>
        </div>
        <Button onClick={() => { resetForm(); setShowModal(true); }}>
          <Icon name="Plus" className="mr-2" size={18} />
          {language === 'en' ? 'Add Position' : 'પોઝિશન ઉમેરો'}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">{language === 'en' ? 'Title' : 'શીર્ષક'}</th>
                  <th className="px-6 py-4">{language === 'en' ? 'Department' : 'વિભાગ'}</th>
                  <th className="px-6 py-4">{language === 'en' ? 'Location' : 'સ્થાન'}</th>
                  <th className="px-6 py-4">{language === 'en' ? 'Status' : 'સ્થિતિ'}</th>
                  <th className="px-6 py-4 text-center">{language === 'en' ? 'Actions' : 'ક્રિયાઓ'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {careers.length > 0 ? (
                  careers.map((career) => (
                    <tr key={career._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div>{career.title.en}</div>
                        <div className="text-xs text-gray-400">{career.title.gu}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{career.department}</td>
                      <td className="px-6 py-4 text-gray-600">{career.location}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          career.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {career.active ? (language === 'en' ? 'Active' : 'સક્રિય') : (language === 'en' ? 'Inactive' : 'નિષ્ક્રિય')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(career)}
                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Icon name="Edit" size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(career._id)}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Icon name="Trash2" size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      {language === 'en' ? 'No job openings found' : 'કોઈ જોબ ઓપનિંગ મળ્યા નથી'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing 
                  ? (language === 'en' ? 'Edit Position' : 'પોઝિશન સંપાદિત કરો')
                  : (language === 'en' ? 'New Position' : 'નવી પોઝિશન')
                }
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Icon name="X" size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
                  <input
                    type="text"
                    name="title_en"
                    value={formData.title_en}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (Gujarati)</label>
                  <input
                    type="text"
                    name="title_gu"
                    value={formData.title_gu}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                  <input
                    type="text"
                    name="salary"
                    placeholder="e.g. ₹12L - ₹18L / Year"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  placeholder="React, Node.js, Sales"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                  <textarea
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Gujarati)</label>
                  <textarea
                    name="description_gu"
                    value={formData.description_gu}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                  Active (Visible on public site)
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <Button type="button" variant="ghost" className="w-full" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="w-full">
                  {isEditing ? 'Update Position' : 'Create Position'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCareers;
