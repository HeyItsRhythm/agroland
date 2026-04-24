import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../contexts/LanguageContext';
import pressReleaseService from '../../../utils/pressReleaseService';

const AdminPressReleases = () => {
    const { language } = useLanguage();
    const [pressReleases, setPressReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRelease, setEditingRelease] = useState(null);
    const [formData, setFormData] = useState({
        title_en: '',
        title_gu: '',
        summary_en: '',
        summary_gu: '',
        content_en: '',
        content_gu: '',
        image_url: '',
        published_date: new Date().toISOString().split('T')[0],
        is_published: true
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchPressReleases();
    }, []);

    const fetchPressReleases = async () => {
        try {
            setLoading(true);
            const result = await pressReleaseService.getAllPressReleases();
            if (result.success) {
                setPressReleases(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching press releases:', error);
        } finally {
            setLoading(false);
        }
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

        try {
            let result;
            if (editingRelease) {
                result = await pressReleaseService.updatePressRelease(editingRelease.id, formData);
            } else {
                result = await pressReleaseService.createPressRelease(formData);
            }

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: editingRelease
                        ? (language === 'en' ? 'Press release updated successfully!' : 'પ્રેસ રિલીઝ સફળતાપૂર્વક અપડેટ થયું!')
                        : (language === 'en' ? 'Press release created successfully!' : 'પ્રેસ રિલીઝ સફળતાપૂર્વક બનાવ્યું!')
                });
                setShowModal(false);
                setEditingRelease(null);
                resetForm();
                fetchPressReleases();
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } else {
                setMessage({ type: 'error', text: result.error });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    const handleEdit = (release) => {
        setEditingRelease(release);
        setFormData({
            title_en: release.title_en,
            title_gu: release.title_gu,
            summary_en: release.summary_en,
            summary_gu: release.summary_gu,
            content_en: release.content_en || '',
            content_gu: release.content_gu || '',
            image_url: release.image_url,
            published_date: release.published_date,
            is_published: release.is_published
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <span className="font-medium text-sm">
                    {language === 'en' ? 'Are you sure you want to delete this press release?' : 'શું તમે ખરેખર આ પ્રેસ રિલીઝ કાઢી નાખવા માંગો છો?'}
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
                            const result = await pressReleaseService.deletePressRelease(id);
                            if (result.success) {
                                setMessage({
                                    type: 'success',
                                    text: language === 'en' ? 'Press release deleted successfully!' : 'પ્રેસ રિલીઝ સફળતાપૂર્વક કાઢી નાખ્યું!'
                                });
                                fetchPressReleases();
                                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                            } else {
                                setMessage({ type: 'error', text: result.error });
                            }
                        }}
                    >
                        {language === 'en' ? 'Delete' : 'કાઢી નાખો'}
                    </button>
                </div>
            </div>
        ), { duration: 5000, icon: '🗑️' });
    };

    const togglePublish = async (id, currentStatus) => {
        const result = await pressReleaseService.togglePublishStatus(id, !currentStatus);
        if (result.success) {
            fetchPressReleases();
        }
    };

    const resetForm = () => {
        setFormData({
            title_en: '',
            title_gu: '',
            summary_en: '',
            summary_gu: '',
            content_en: '',
            content_gu: '',
            image_url: '',
            published_date: new Date().toISOString().split('T')[0],
            is_published: true
        });
    };

    const openAddModal = () => {
        setEditingRelease(null);
        resetForm();
        setShowModal(true);
    };

    return (
        <>
            <Helmet>
                <title>{language === 'en' ? 'Press Releases - Admin Dashboard' : 'પ્રેસ રિલીઝ - એડમિન ડેશબોર્ડ'}</title>
            </Helmet>

            <div className="max-w-7xl mx-auto pb-12">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                            {language === 'en' ? 'Press Releases' : 'પ્રેસ રિલીઝ'}
                        </h1>
                        <p className="text-muted-foreground">
                            {language === 'en' ? 'Manage press releases and announcements' : 'પ્રેસ રિલીઝ અને જાહેરાતો મેનેજ કરો'}
                        </p>
                    </div>
                    <Button onClick={openAddModal}>
                        <Icon name="Plus" size={20} className="mr-2" />
                        {language === 'en' ? 'Add Press Release' : 'પ્રેસ રિલીઝ ઉમેરો'}
                    </Button>
                </div>

                {/* Messages */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                        <Icon name={message.type === 'success' ? 'CheckCircle' : 'AlertCircle'} size={20} className="mr-2" />
                        {message.text}
                    </div>
                )}

                {/* Press Releases View */}
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">{language === 'en' ? 'Loading press releases...' : 'પ્રેસ રિલીઝ લોડ થઈ રહી છે...'}</p>
                        </div>
                    ) : pressReleases.length === 0 ? (
                        <div className="p-16 text-center">
                            <Icon name="FileText" size={64} className="text-muted-foreground/20 mx-auto mb-4" />
                            <p className="text-muted-foreground font-medium">
                                {language === 'en' ? 'No press releases found' : 'કોઈ પ્રેસ રિલીઝ મળી નથી'}
                            </p>
                            <Button variant="outline" className="mt-4" onClick={openAddModal}>
                                <Icon name="Plus" size={16} className="mr-2" />
                                {language === 'en' ? 'Add Your First Release' : 'તમારી પ્રથમ રિલીઝ ઉમેરો'}
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50 border-b border-border">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider">
                                                {language === 'en' ? 'Press Release' : 'પ્રેસ રિલીઝ'}
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider">
                                                {language === 'en' ? 'Date' : 'તારીખ'}
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider">
                                                {language === 'en' ? 'Status' : 'સ્થિતિ'}
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-foreground uppercase tracking-wider">
                                                {language === 'en' ? 'Actions' : 'ક્રિયાઓ'}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {pressReleases.map((release) => (
                                            <tr key={release.id} className="hover:bg-muted/30 transition-all">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-16 h-12 shrink-0 rounded-lg overflow-hidden border border-border bg-muted mr-4 shadow-sm">
                                                            <img
                                                                src={release.image_url}
                                                                alt={release.title_en}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-foreground truncate max-w-[300px]">
                                                                {language === 'en' ? release.title_en : release.title_gu}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground line-clamp-1 max-w-[300px] mt-0.5">
                                                                {language === 'en' ? release.summary_en : release.summary_gu}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-foreground font-medium">
                                                    {new Date(release.published_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => togglePublish(release.id, release.is_published)}
                                                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${release.is_published
                                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                            }`}
                                                    >
                                                        {release.is_published
                                                            ? (language === 'en' ? 'Published' : 'પ્રકાશિત')
                                                            : (language === 'en' ? 'Draft' : 'ડ્રાફ્ટ')}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                   <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full text-blue-600 hover:bg-blue-50"
                                                            onClick={() => handleEdit(release)}
                                                        >
                                                            <Icon name="Edit" size={16} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(release.id)}
                                                            className="h-8 w-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Icon name="Trash2" size={16} />
                                                        </Button>
                                                   </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden p-4 space-y-4">
                                {pressReleases.map((release) => (
                                    <div key={release.id} className="bg-background border border-border rounded-xl p-4 shadow-sm">
                                        <div className="flex gap-4 mb-4">
                                            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-border bg-muted shadow-sm">
                                                <img
                                                    src={release.image_url}
                                                    alt={release.title_en}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-foreground text-sm truncate pr-2">
                                                        {language === 'en' ? release.title_en : release.title_gu}
                                                    </h3>
                                                    <button
                                                        onClick={() => togglePublish(release.id, release.is_published)}
                                                        className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${release.is_published
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-muted text-muted-foreground'
                                                            }`}
                                                    >
                                                        {release.is_published
                                                            ? (language === 'en' ? 'Live' : 'પ્રકાશિત')
                                                            : (language === 'en' ? 'Draft' : 'ડ્રાફ્ટ')}
                                                    </button>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2 leading-tight">
                                                    {language === 'en' ? release.summary_en : release.summary_gu}
                                                </p>
                                                <div className="flex items-center text-[10px] text-muted-foreground font-bold">
                                                    <Icon name="Calendar" size={10} className="mr-1" />
                                                    {new Date(release.published_date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-9 px-3 rounded-lg text-xs font-bold"
                                                onClick={() => handleEdit(release)}
                                            >
                                                <Icon name="Edit" size={14} className="mr-2" />
                                                {language === 'en' ? 'Edit' : 'સંપાદિત કરો'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(release.id)}
                                                className="h-9 px-3 text-destructive border-red-200 bg-red-50 rounded-lg text-xs font-bold"
                                            >
                                                <Icon name="Trash2" size={14} className="mr-2" />
                                                {language === 'en' ? 'Delete' : 'કાઢી નાખો'}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                    <div className="bg-card w-full max-w-3xl rounded-lg shadow-lg border border-border p-6 my-8">
                        <h2 className="text-xl font-bold mb-6">
                            {editingRelease
                                ? (language === 'en' ? 'Edit Press Release' : 'પ્રેસ રિલીઝ સંપાદિત કરો')
                                : (language === 'en' ? 'Add Press Release' : 'પ્રેસ રિલીઝ ઉમેરો')}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        {language === 'en' ? 'Title (English)' : 'શીર્ષક (અંગ્રેજી)'}
                                    </label>
                                    <input
                                        type="text"
                                        name="title_en"
                                        required
                                        value={formData.title_en}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        {language === 'en' ? 'Title (Gujarati)' : 'શીર્ષક (ગુજરાતી)'}
                                    </label>
                                    <input
                                        type="text"
                                        name="title_gu"
                                        required
                                        value={formData.title_gu}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        {language === 'en' ? 'Summary (English)' : 'સારાંશ (અંગ્રેજી)'}
                                    </label>
                                    <textarea
                                        name="summary_en"
                                        required
                                        rows="3"
                                        value={formData.summary_en}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        {language === 'en' ? 'Summary (Gujarati)' : 'સારાંશ (ગુજરાતી)'}
                                    </label>
                                    <textarea
                                        name="summary_gu"
                                        required
                                        rows="3"
                                        value={formData.summary_gu}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    {language === 'en' ? 'Image URL' : 'છબી URL'}
                                </label>
                                <input
                                    type="url"
                                    name="image_url"
                                    required
                                    value={formData.image_url}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        {language === 'en' ? 'Published Date' : 'પ્રકાશન તારીખ'}
                                    </label>
                                    <input
                                        type="date"
                                        name="published_date"
                                        required
                                        value={formData.published_date}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="is_published"
                                            checked={formData.is_published}
                                            onChange={handleInputChange}
                                            className="rounded border-border"
                                        />
                                        <span className="text-sm font-medium">
                                            {language === 'en' ? 'Publish immediately' : 'તરત જ પ્રકાશિત કરો'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingRelease(null);
                                        resetForm();
                                    }}
                                >
                                    {language === 'en' ? 'Cancel' : 'રદ કરો'}
                                </Button>
                                <Button type="submit">
                                    {editingRelease
                                        ? (language === 'en' ? 'Update' : 'અપડેટ')
                                        : (language === 'en' ? 'Create' : 'બનાવો')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminPressReleases;
