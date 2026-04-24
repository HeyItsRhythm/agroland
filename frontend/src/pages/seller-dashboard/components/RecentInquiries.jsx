import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const RecentInquiries = ({ language }) => {
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const inquiries = [
    {
      id: 1,
      buyerName: language === 'en' ? 'Rajesh Patel' : 'રાજેશ પટેલ',
      buyerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      propertyTitle: language === 'en' ? 'Agricultural Land in Mehsana' : 'મહેસાણામાં કૃષિ જમીન',
      message: language === 'en' ?'I am interested in this property. Can we schedule a visit this weekend?' :'મને આ પ્રોપર્ટીમાં રસ છે. શું આપણે આ સપ્તાહાંતે મુલાકાત શેડ્યૂલ કરી શકીએ?',
      timestamp: '2025-01-15 10:30 AM',
      status: 'unread',
      phone: '+91 98765 43210',
      email: 'rajesh.patel@email.com',
      budget: '₹12,00,000 - ₹15,00,000'
    },
    {
      id: 2,
      buyerName: language === 'en' ? 'Priya Shah' : 'પ્રિયા શાહ',
      buyerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b9e0e4d8?w=100&h=100&fit=crop&crop=face',
      propertyTitle: language === 'en' ? 'Fertile Farm Land in Anand' : 'આનંદમાં ફળદ્રુપ ખેતીની જમીન',
      message: language === 'en' ?'What is the water source availability for this land? Is there a well or bore well?' :'આ જમીન માટે પાણીના સ્ત્રોતની ઉપલબ્ધતા શું છે? કૂવો કે બોર વેલ છે?',
      timestamp: '2025-01-15 09:15 AM',
      status: 'read',
      phone: '+91 87654 32109',
      email: 'priya.shah@email.com',
      budget: '₹8,00,000 - ₹10,00,000'
    },
    {
      id: 3,
      buyerName: language === 'en' ? 'Amit Desai' : 'અમિત દેસાઈ',
      buyerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      propertyTitle: language === 'en' ? 'Premium Agricultural Plot' : 'પ્રીમિયમ કૃષિ પ્લોટ',
      message: language === 'en' ?'Is the property clear of all legal disputes? Can you provide the documents?' :'શું પ્રોપર્ટી તમામ કાનૂની વિવાદોથી મુક્ત છે? તમે દસ્તાવેજો આપી શકો છો?',
      timestamp: '2025-01-14 04:45 PM',
      status: 'replied',
      phone: '+91 76543 21098',
      email: 'amit.desai@email.com',
      budget: '₹15,00,000 - ₹18,00,000'
    },
    {
      id: 4,
      buyerName: language === 'en' ? 'Neha Joshi' : 'નેહા જોશી',
      buyerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      propertyTitle: language === 'en' ? 'Organic Farm Land' : 'ઓર્ગેનિક ફાર્મ લેન્ડ',
      message: language === 'en' ?'I would like to know about the soil quality and previous crop history.' :'મને જમીનની ગુણવત્તા અને અગાઉના પાકના ઇતિહાસ વિશે જાણવું છે.',
      timestamp: '2025-01-14 02:20 PM',
      status: 'unread',
      phone: '+91 65432 10987',
      email: 'neha.joshi@email.com',
      budget: '₹6,00,000 - ₹8,00,000'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      unread: {
        color: 'bg-destructive text-destructive-foreground',
        text: language === 'en' ? 'New' : 'નવું'
      },
      read: {
        color: 'bg-warning text-warning-foreground',
        text: language === 'en' ? 'Read' : 'વાંચ્યું'
      },
      replied: {
        color: 'bg-success text-success-foreground',
        text: language === 'en' ? 'Replied' : 'જવાબ આપ્યો'
      }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const handleReply = (inquiryId) => {
    // Mock reply functionality
    console.log('Reply to inquiry:', inquiryId);
  };

  const handleMarkAsRead = (inquiryId) => {
    // Mock mark as read functionality
    console.log('Mark as read:', inquiryId);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {language === 'en' ? 'Recent Inquiries' : 'તાજેતરની પૂછપરછ'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'en' ? 'Manage buyer inquiries and responses' : 'ખરીદદારની પૂછપરછ અને જવાબો મેનેજ કરો'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Icon name="Filter" size={16} className="mr-2" />
              {language === 'en' ? 'Filter' : 'ફિલ્ટર'}
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="MoreHorizontal" size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="divide-y divide-border">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="p-4 lg:p-6 hover:bg-muted/30 transition-colors">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={inquiry.buyerAvatar}
                  alt={inquiry.buyerName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">{inquiry.buyerName}</h4>
                      {getStatusBadge(inquiry.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {language === 'en' ? 'Interested in:' : 'રસ છે:'} {inquiry.propertyTitle}
                    </p>
                    <p className="text-sm text-foreground mb-3 line-clamp-2">
                      {inquiry.message}
                    </p>
                    
                    {/* Contact Info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Icon name="Phone" size={12} />
                        <span>{inquiry.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Mail" size={12} />
                        <span>{inquiry.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="IndianRupee" size={12} />
                        <span>{inquiry.budget}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Timestamp */}
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {inquiry.timestamp}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleReply(inquiry.id)}
                  >
                    <Icon name="Reply" size={14} className="mr-2" />
                    {language === 'en' ? 'Reply' : 'જવાબ આપો'}
                  </Button>
                  
                  {inquiry.status === 'unread' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleMarkAsRead(inquiry.id)}
                    >
                      <Icon name="Check" size={14} className="mr-2" />
                      {language === 'en' ? 'Mark Read' : 'વાંચ્યું માર્ક કરો'}
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm">
                    <Icon name="Phone" size={14} className="mr-2" />
                    {language === 'en' ? 'Call' : 'કૉલ કરો'}
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Icon name="MoreHorizontal" size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="p-4 lg:p-6 border-t border-border text-center">
        <Button variant="outline">
          {language === 'en' ? 'View All Inquiries' : 'બધી પૂછપરછ જુઓ'}
          <Icon name="ArrowRight" size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default RecentInquiries;