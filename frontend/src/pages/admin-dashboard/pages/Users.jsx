import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import authService from '../../../utils/authService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdminUsers = () => {
  const { language } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    role: 'buyer'
  });

  const { user } = useAuth();

  useEffect(() => {
    // Load users
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.getAllUsers();

      if (result.success) {
        setUsers(Array.isArray(result.data) ? result.data : []);
      } else {
        setError(result.error || 'Failed to load users');
        setUsers([]);
      }
    } catch (err) {
      setError('Something went wrong while loading users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, userToEdit = null) => {
    setModalMode(mode);
    setError(null);
    if (mode === 'edit' && userToEdit) {
      setCurrentUser(userToEdit);
      setFormData({
        email: userToEdit.email || '',
        full_name: userToEdit.full_name || '',
        phone: userToEdit.phone || '',
        role: userToEdit.role || 'buyer'
      });
    } else {
      setCurrentUser(null);
      setFormData({
        email: '',
        full_name: '',
        phone: '',
        role: 'buyer'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    setFormData({ email: '', full_name: '', phone: '', role: 'buyer' });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.full_name) {
      toast.error(language === 'en' ? 'Please fill in required fields' : 'કૃપા કરીને જરૂરી ક્ષેત્રો ભરો');
      return;
    }

    try {
      setActionLoading('form');

      if (modalMode === 'create') {
        const result = await authService.createUser(formData);
        if (result.success) {
          // If we have data, add to list, else reload to be safe
          if (result.data) {
            setUsers(prev => [result.data, ...prev]);
          } else {
            await loadUsers();
          }
          handleCloseModal();
          toast.success(language === 'en' ? 'User created successfully' : 'વપરાશકર્તા સફળતાપૂર્વક બનાવવામાં આવ્યો');
        } else {
          toast.error(`Error: ${result.error}`);
        }
      } else {
        // Edit Mode
        const updates = {
          full_name: formData.full_name,
          phone: formData.phone,
          role: formData.role
          // Email usually not editable directly here for Auth binding reasons, keeping it mostly display
        };

        const result = await authService.updateUserProfile(currentUser.id, updates);

        if (result.success) {
          setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updates } : u));
          handleCloseModal();
          toast.success(language === 'en' ? 'User updated successfully' : 'વપરાશકર્તા અપડેટ કરવામાં આવ્યો');
        } else {
          toast.error(`Error: ${result.error}`);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = (userId) => {
    toast((t) => (
      <div className="flex flex-col gap-2 min-w-[200px]">
        <p className="font-medium text-sm">
          {language === 'en' ? 'Delete this user?' : 'આ વપરાશકર્તાને કાઢી નાખવા છે?'}
        </p>
        <div className="flex gap-2 justify-end">
          <button 
            className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-200"
            onClick={() => toast.dismiss(t.id)}
          >
            {language === 'en' ? 'Cancel' : 'રદ કરો'}
          </button>
          <button 
            className="px-3 py-1 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700"
            onClick={() => {
              toast.dismiss(t.id);
              performDeleteUser(userId);
            }}
          >
            {language === 'en' ? 'Delete' : 'ડિલીટ'}
          </button>
        </div>
      </div>
    ), { 
      duration: 5000, 
      icon: '⚠️',
      style: {
        background: '#fff',
        color: '#333',
        border: '1px solid #e5e7eb',
      }
    });
  };

  const performDeleteUser = async (userId) => {
    try {
      setActionLoading(userId);
      const result = await authService.deleteUser(userId);

      if (result.success) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        toast.success(language === 'en' ? 'User deleted successfully' : 'વપરાશકર્તા કાઢી નાખવામાં આવ્યો');
      } else {
        toast.error(result.error || 'Failed to delete user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  // Keep existing Role toggle for quick access? Maybe just rely on Edit.
  // Let's keep the dropdown in the table but also allow Edit Modal.

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-purple-600 bg-purple-50';
      case 'seller': return 'text-blue-600 bg-blue-50';
      case 'buyer': return 'text-green-600 bg-green-50';
      case 'support': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formattedUsers = users.filter(u => {
    // Role filter
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = (u.full_name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      return name.includes(q) || email.includes(q) || phone.includes(q);
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {language === 'en' ? 'Manage Users' : 'વપરાશકર્તાઓ મેનેજ કરો'}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder={language === 'en' ? 'Search users...' : 'વપરાશકર્તાઓ શોધો...'}
              className="border border-border rounded-md pl-8 pr-3 py-2 bg-background text-foreground text-sm w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Icon name="Search" size={14} className="absolute left-2.5 top-3 text-muted-foreground" />
          </div>

          <select
            className="border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">{language === 'en' ? 'All Roles' : 'બધી ભૂમિકાઓ'}</option>
            <option value="admin">{language === 'en' ? 'Admin' : 'એડમિન'}</option>
            <option value="seller">{language === 'en' ? 'Seller' : 'વેચનાર'}</option>
            <option value="buyer">{language === 'en' ? 'Buyer' : 'ખરીદનાર'}</option>
            <option value="support">{language === 'en' ? 'Support' : 'સપોર્ટ'}</option>
          </select>

          <Button onClick={loadUsers} variant="outline" size="sm">
            <Icon name="RefreshCw" size={16} />
          </Button>

          <Button onClick={() => handleOpenModal('create')} size="sm">
            <Icon name="Plus" size={16} className="mr-2" />
            {language === 'en' ? 'Add User' : 'વપરાશકર્તા ઉમેરો'}
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">{language === 'en' ? 'Loading users...' : 'વપરાશકર્તાઓ લોડ થઈ રહ્યાં છે...'}</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-destructive">
            <Icon name="AlertCircle" size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">{error}</p>
            <Button variant="outline" className="mt-4" onClick={loadUsers}>
              <Icon name="RefreshCw" size={16} className="mr-2" />
              {language === 'en' ? 'Try Again' : 'ફરી પ્રયાસ કરો'}
            </Button>
          </div>
        ) : formattedUsers.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Icon name="SearchX" size={48} className="mx-auto mb-4 opacity-20" />
            <p>{language === 'en' ? 'No users found matching your criteria' : 'તમારા માપદંડ સાથે મેળ ખાતા કોઈ વપરાશકર્તાઓ મળ્યા નથી'}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold text-foreground text-sm uppercase tracking-wider">
                      {language === 'en' ? 'User' : 'વપરાશકર્તા'}
                    </th>
                    <th className="py-4 px-2 text-left font-semibold text-foreground text-sm uppercase tracking-wider">
                      {language === 'en' ? 'Email' : 'ઈમેઈલ'}
                    </th>
                    <th className="py-4 px-2 text-left font-semibold text-foreground text-sm uppercase tracking-wider">
                      {language === 'en' ? 'Role' : 'ભૂમિકા'}
                    </th>
                    <th className="py-4 px-2 text-left font-semibold text-foreground text-sm uppercase tracking-wider">
                      {language === 'en' ? 'Created' : 'બનાવ્યું'}
                    </th>
                    <th className="py-4 px-6 text-right font-semibold text-foreground text-sm uppercase tracking-wider">
                      {language === 'en' ? 'Actions' : 'ક્રિયાઓ'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {formattedUsers.map((userData) => (
                    <tr key={userData.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            {userData.avatar_url ? (
                              <img
                                src={userData.avatar_url}
                                alt={userData.full_name}
                                className="w-full h-full rounded-full object-cover"
                                onError={(e) => { e.target.display = 'none'; }}
                              />
                            ) : (
                              <Icon name="User" size={18} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-foreground truncate">{userData.full_name}</p>
                            <p className="text-xs text-muted-foreground">{userData.phone || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-sm font-medium">{userData.email}</span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getRoleColor(userData.role)}`}>
                          {userData.role}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(userData.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full text-blue-600 hover:bg-blue-50"
                            onClick={() => handleOpenModal('edit', userData)}
                          >
                            <Icon name="Edit" size={16} />
                          </Button>
                          {userData.id !== user?.id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteUser(userData.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-4 space-y-4">
              {formattedUsers.map((userData) => (
                <div key={userData.id} className="bg-background border border-border rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                        <Icon name="User" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground truncate max-w-[150px]">{userData.full_name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${getRoleColor(userData.role)}`}>
                          {userData.role}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleOpenModal('edit', userData)}>
                        <Icon name="Edit" size={16} />
                      </Button>
                      {userData.id !== user?.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-destructive"
                          onClick={() => handleDeleteUser(userData.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-3 border-t border-border">
                    <div className="flex items-center text-xs">
                      <Icon name="Mail" size={12} className="mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{userData.email}</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <Icon name="Phone" size={12} className="mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">{userData.phone || '-'}</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <Icon name="Calendar" size={12} className="mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">{new Date(userData.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-md rounded-lg shadow-lg border border-border flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {modalMode === 'create'
                  ? (language === 'en' ? 'Add User' : 'વપરાશકર્તા ઉમેરો')
                  : (language === 'en' ? 'Edit User' : 'વપરાશકર્તા સંપાદિત કરો')}
              </h2>
              <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                <Icon name="X" size={18} />
              </Button>
            </div>

            <div className="p-4 overflow-y-auto">
              <form id="userForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {language === 'en' ? 'Email' : 'ઈમેઈલ'} <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={modalMode === 'edit'} // Email usually immutable or requires special flow
                    className="w-full border border-border rounded-md px-3 py-2 bg-background disabled:opacity-50"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {language === 'en' ? 'Full Name' : 'પૂરું નામ'} <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    className="w-full border border-border rounded-md px-3 py-2 bg-background"
                    value={formData.full_name}
                    onChange={handleFormChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {language === 'en' ? 'Phone' : 'ફોન'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full border border-border rounded-md px-3 py-2 bg-background"
                    value={formData.phone}
                    onChange={handleFormChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {language === 'en' ? 'Role' : 'ભૂમિકા'}
                  </label>
                  <select
                    name="role"
                    className="w-full border border-border rounded-md px-3 py-2 bg-background"
                    value={formData.role}
                    onChange={handleFormChange}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                    <option value="support">Support</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-border flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={handleCloseModal}>
                {language === 'en' ? 'Cancel' : 'રદ કરો'}
              </Button>
              <Button type="submit" form="userForm" disabled={!!actionLoading}>
                {actionLoading
                  ? (language === 'en' ? 'Saving...' : 'સાચવી રહ્યું છે...')
                  : (language === 'en' ? 'Save User' : 'વપરાશકર્તા સાચવો')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;