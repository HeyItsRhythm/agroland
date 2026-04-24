import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import inquiryService from '../../../utils/inquiryService';

const SellerInquiries = () => {
  const { language } = useLanguage();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    // Load inquiries
    if (user?.id) {
      loadInquiries();
    }
  }, [user?.id]);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const result = await inquiryService.getInquiriesForSeller(user.id);

      if (result.success) {
        // Transform the data to match our component's expected format
        const formattedInquiries = result.data.map(inquiry => ({
          id: inquiry.id,
          propertyTitle: inquiry.property?.title || 'Unknown Property',
          buyerName: inquiry.sender?.full_name || 'Unknown Buyer', // mapped from sender
          buyerEmail: inquiry.sender?.email || '',
          buyerPhone: inquiry.sender?.phone || inquiry.contact_mobile || '',
          message: inquiry.message || '',
          status: inquiry.status || 'new',
          createdAt: inquiry.created_at,
          propertyId: inquiry.property_id,
          response: inquiry.response
        }));

        setInquiries(formattedInquiries);
      } else {
        console.error('Failed to load inquiries:', result.error);
      }
    } catch (error) {
      console.error('Error loading inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'responded': return 'bg-indigo-100 text-indigo-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'new': return language === 'en' ? 'New' : 'નવું';
      case 'in_progress': return language === 'en' ? 'In Progress' : 'પ્રગતિશીલ';
      case 'completed': return language === 'en' ? 'Completed' : 'પૂર્ણ';
      case 'responded': return language === 'en' ? 'Responded' : 'જવાબ આપેલ';
      case 'cancelled': return language === 'en' ? 'Cancelled' : 'રદ';
      default: return status;
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    if (filter === 'all') return true;
    return inquiry.status === filter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'gu-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      const result = await inquiryService.updateInquiry(inquiryId, { status: newStatus });

      if (result.success) {
        // Update the local state with the new status
        setInquiries(prev => prev.map(inquiry =>
          inquiry.id === inquiryId
            ? { ...inquiry, status: newStatus }
            : inquiry
        ));
      } else {
        console.error('Failed to update inquiry status:', result.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleReply = async (inquiry, response) => {
    try {
      if (!response || response.trim() === '') {
        toast.error(language === 'en' ? 'Please enter a response' : 'કૃપા કરીને જવાબ દાખલ કરો');
        return;
      }

      const result = await inquiryService.respondToInquiry(inquiry.id, response);

      if (result.success) {
        // Update the local state with the new response
        setInquiries(prev => prev.map(item =>
          item.id === inquiry.id
            ? { ...item, status: 'responded', response: response }
            : item
        ));

        toast.success(language === 'en' ? 'Response sent successfully!' : 'જવાબ સફળતાપૂર્વક મોકલાયો!');
      } else {
        console.error('Failed to send response:', result.error);
        toast.error(language === 'en' ? `Failed to send response: ${result.error}` : `જવાબ મોકલવામાં નિષ્ફળ: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error(language === 'en' ? 'Error sending response' : 'જવાબ મોકલવામાં ભૂલ');
    }
  };

  const [replyText, setReplyText] = useState('');
  const [activeInquiry, setActiveInquiry] = useState(null);

  const openReplyModal = (inquiry) => {
    setActiveInquiry(inquiry);
    setReplyText(inquiry.response || '');
  };

  const closeReplyModal = () => {
    setActiveInquiry(null);
    setReplyText('');
  };

  const submitReply = () => {
    if (activeInquiry) {
      handleReply(activeInquiry, replyText);
      closeReplyModal();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {language === 'en' ? 'Inquiries - Seller Dashboard' : 'પૂછપરછ - વેચનાર ડેશબોર્ડ'}
        </title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            {language === 'en' ? 'Property Inquiries' : 'પ્રોપર્ટી પૂછપરછ'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' ? 'Manage and respond to inquiries from potential buyers' : 'સંભવિત ખરીદદારોની પૂછપરછ મેનેજ કરો અને જવાબ આપો'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'en' ? 'Total Inquiries' : 'કુલ પૂછપરછ'}
                </p>
                <p className="text-2xl font-bold text-foreground">{inquiries.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="MessageSquare" size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'en' ? 'New' : 'નવું'}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {inquiries.filter(i => i.status === 'new').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="Plus" size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'en' ? 'In Progress' : 'પ્રગતિશીલ'}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {inquiries.filter(i => i.status === 'in_progress').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon name="Clock" size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'en' ? 'Responded' : 'જવાબ આપેલ'}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {inquiries.filter(i => i.status === 'responded').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Icon name="Reply" size={24} className="text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'en' ? 'Completed' : 'પૂર્ણ'}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {inquiries.filter(i => i.status === 'completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Icon name="CheckCircle" size={24} className="text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-foreground">
              {language === 'en' ? 'Filter by status:' : 'સ્થિતિ દ્વારા ફિલ્ટર કરો:'}
            </span>
            {['all', 'new', 'in_progress', 'responded', 'completed', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
              >
                {status === 'all'
                  ? (language === 'en' ? 'All' : 'બધા')
                  : getStatusLabel(status)
                }
              </button>
            ))}
          </div>
        </div>

        {/* Inquiries List */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              {language === 'en' ? 'Inquiries' : 'પૂછપરછ'}
            </h2>
          </div>

          {filteredInquiries.length === 0 ? (
            <div className="p-12 text-center">
              <Icon name="Inbox" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {language === 'en' ? 'No inquiries found' : 'કોઈ પૂછપરછ મળી નથી'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en'
                  ? 'When buyers show interest in your properties, their inquiries will appear here.'
                  : 'જ્યારે ખરીદદારો તમારી પ્રોપર્ટીઝમાં રસ દેખાડશે, ત્યારે તેમની પૂછપરછ અહીં દેખાશે.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredInquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 space-y-4">
                      {/* Property and Buyer Info */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-foreground">
                            {inquiry.propertyTitle}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Icon name="User" size={14} />
                              <span>{inquiry.buyerName}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Icon name="Mail" size={14} />
                              <span>{inquiry.buyerEmail}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Icon name="Phone" size={14} />
                              <span>{inquiry.buyerPhone}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                            {getStatusLabel(inquiry.status)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(inquiry.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-foreground">{inquiry.message}</p>
                      </div>

                      {/* Response (if any) */}
                      {inquiry.response && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                          <p className="text-sm font-medium text-blue-800 mb-1">
                            {language === 'en' ? 'Your Response:' : 'તમારો જવાબ:'}
                          </p>
                          <p className="text-foreground">{inquiry.response}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-3">
                        <Button
                          size="sm"
                          onClick={() => openReplyModal(inquiry)}
                        >
                          <Icon name="Reply" size={16} className="mr-2" />
                          {language === 'en' ? 'Reply' : 'જવાબ આપો'}
                        </Button>

                        <select
                          value={inquiry.status}
                          onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                          className="px-3 py-1 border border-border rounded-md bg-background text-foreground text-sm"
                        >
                          <option value="new">{language === 'en' ? 'New' : 'નવું'}</option>
                          <option value="in_progress">{language === 'en' ? 'In Progress' : 'પ્રગતિશીલ'}</option>
                          <option value="responded">{language === 'en' ? 'Responded' : 'જવાબ આપેલ'}</option>
                          <option value="completed">{language === 'en' ? 'Completed' : 'પૂર્ણ'}</option>
                          <option value="cancelled">{language === 'en' ? 'Cancelled' : 'રદ'}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {activeInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {language === 'en' ? 'Reply to Inquiry' : 'પૂછપરછનો જવાબ આપો'}
              </h3>
              <button
                onClick={closeReplyModal}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {language === 'en' ? 'Property:' : 'પ્રોપર્ટી:'}
              </p>
              <p className="font-medium text-foreground">{activeInquiry.propertyTitle}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {language === 'en' ? 'Buyer:' : 'ખરીદદાર:'}
              </p>
              <p className="font-medium text-foreground">{activeInquiry.buyerName}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {language === 'en' ? 'Message:' : 'સંદેશ:'}
              </p>
              <p className="bg-muted/30 rounded-lg p-3">{activeInquiry.message}</p>
            </div>

            <div className="mb-4">
              <label htmlFor="reply" className="block text-sm font-medium text-foreground mb-1">
                {language === 'en' ? 'Your Response:' : 'તમારો જવાબ:'}
              </label>
              <textarea
                id="reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full border border-border rounded-lg p-3 min-h-[120px] bg-background text-foreground"
                placeholder={language === 'en' ? 'Type your response here...' : 'અહીં તમારો જવાબ લખો...'}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={closeReplyModal}>
                {language === 'en' ? 'Cancel' : 'રદ કરો'}
              </Button>
              <Button onClick={submitReply}>
                {language === 'en' ? 'Send Response' : 'જવાબ મોકલો'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerInquiries;