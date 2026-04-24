import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import inquiryService from '../../../utils/inquiryService';
import notificationService from '../../../utils/notificationService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const InquiriesSection = ({ language = 'en' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadInquiries = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const result = await inquiryService.getInquiriesBySender(user.id);
      if (result.success) {
        setInquiries(result.data || []);
      }
    } catch (err) {
      setError('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [user?.id]);

  const filteredInquiries = inquiries.filter(inq => filter === 'all' || inq.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {language === 'en' ? 'Communication Hub' : 'વાતચીત હબ'}
          </h2>
          <p className="text-muted-foreground">Track your ongoing negotiations and inquiries</p>
        </div>
        <div className="flex bg-muted/30 p-1 rounded-xl border border-border">
          {['all', 'open', 'responded'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {filteredInquiries.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="MessageSquare" size={30} className="text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-bold">No inquiries found</h3>
          <p className="text-muted-foreground mt-1 mb-6">Start talking to sellers to see your messages here.</p>
          <Button onClick={() => window.location.href = '/property-listings-search'}>Find Properties</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInquiries.map((inquiry) => (
            <div key={inquiry.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Icon name="Building2" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors text-lg">
                        {inquiry.property?.title}
                      </h4>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Icon name="MapPin" size={12} className="mr-1" />
                        {inquiry.property?.location_village}, {inquiry.property?.location_district}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start md:self-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${inquiry.status === 'open' ? 'bg-blue-100 text-blue-700' :
                      inquiry.status === 'responded' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                      }`}>
                      {inquiry.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                      ID: {inquiry.id.slice(-6)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Your Inquiry</label>
                    <div className="p-4 bg-muted/30 rounded-xl text-sm italic text-muted-foreground border border-border/50">
                      "{inquiry.message}"
                    </div>
                  </div>
                  {inquiry.response ? (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <label className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1">
                        <Icon name="CheckCircle2" size={10} />
                        Seller Response
                      </label>
                      <div className="p-4 bg-green-50/50 rounded-xl text-sm font-medium text-foreground border border-green-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1 opacity-10">
                          <Icon name="Quote" size={40} />
                        </div>
                        {inquiry.response}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-6 border-2 border-dashed border-border rounded-xl">
                      <div className="text-center">
                        <Icon name="Clock" size={20} className="mx-auto text-muted-foreground mb-2 animate-pulse" />
                        <p className="text-xs text-muted-foreground font-medium">Awaiting Seller response...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-3 bg-muted/20 border-t border-border flex items-center justify-between">
                <span className="text-[10px] font-medium text-muted-foreground">
                  Last updated {new Date(inquiry.updated_at).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold uppercase tracking-wider" onClick={() => window.location.href = `/property-detail-view?id=${inquiry.property?.id}`}>
                  View Property
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InquiriesSection;