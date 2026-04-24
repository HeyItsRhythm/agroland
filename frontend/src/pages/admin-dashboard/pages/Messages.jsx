import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import contactService from '../../../utils/contactService';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, new, read

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        const result = await contactService.getAllMessages();
        if (result.success) {
            setMessages(result.data);
        }
        setLoading(false);
    };

    const handleMarkAsRead = async (id) => {
        const result = await contactService.updateMessageStatus(id, 'read');
        if (result.success) {
            // Update local state
            setMessages(messages.map(msg =>
                msg.id === id ? { ...msg, status: 'read' } : msg
            ));
        }
    };

    const handleDelete = async (id) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <span className="font-medium text-sm">Are you sure you want to delete this message?</span>
                <div className="flex gap-2 justify-end">
                    <button
                        className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-200"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-3 py-1 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const result = await contactService.deleteMessage(id);
                            if (result.success) {
                                setMessages(messages.filter(msg => msg.id !== id));
                                toast.success('Message deleted successfully');
                            } else {
                                toast.error('Failed to delete message');
                            }
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), { duration: 5000, icon: '🗑️' });
    };

    const filteredMessages = messages.filter(msg => {
        if (filter === 'all') return true;
        return msg.status === filter;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Contact Messages</h2>
                    <p className="text-muted-foreground">View and manage inquiries from the contact page</p>
                </div>
                <Button onClick={fetchMessages} variant="outline" size="sm">
                    <Icon name="RefreshCw" className="mr-2" size={16} />
                    Refresh
                </Button>
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilter('all')}
                    size="sm"
                >
                    All
                </Button>
                <Button
                    variant={filter === 'new' ? 'default' : 'outline'}
                    onClick={() => setFilter('new')}
                    size="sm"
                >
                    Unread
                </Button>
                <Button
                    variant={filter === 'read' ? 'default' : 'outline'}
                    onClick={() => setFilter('read')}
                    size="sm"
                >
                    Read
                </Button>
            </div>

            {/* Messages List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Icon name="Loader2" className="animate-spin text-primary mb-4" size={40} />
                    <p className="text-muted-foreground animate-pulse text-sm font-medium">Loading messages...</p>
                </div>
            ) : filteredMessages.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
                    <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="Inbox" className="text-muted-foreground/40" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">No messages found</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                        {filter === 'all' 
                          ? "You haven't received any messages yet. They'll appear here once users contact you."
                          : `No ${filter} messages at the moment.`}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`bg-card rounded-2xl border p-5 md:p-6 transition-all shadow-sm hover:shadow-md ${
                                msg.status === 'new' ? 'border-primary/30 ring-1 ring-primary/10' : 'border-border'
                            }`}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        {msg.status === 'new' && (
                                            <span className="bg-primary text-primary-foreground text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-sm">
                                                New
                                            </span>
                                        )}
                                        <span className="bg-muted text-muted-foreground text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest">
                                            {msg.inquiry_type}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-xl text-foreground mb-4 leading-tight">{msg.subject}</h3>
                                    
                                    <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2 min-w-[140px]">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                <Icon name="User" size={14} />
                                            </div>
                                            <span className="font-semibold text-foreground truncate">{msg.full_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 min-w-[180px]">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                                <Icon name="Mail" size={14} />
                                            </div>
                                            <span className="truncate">{msg.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                                <Icon name="Phone" size={14} />
                                            </div>
                                            <span>{msg.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                <Icon name="Clock" size={14} />
                                            </div>
                                            <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex md:flex-col lg:flex-row gap-2 self-end md:self-start">
                                    {msg.status === 'new' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleMarkAsRead(msg.id)}
                                            className="h-9 px-3 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 uppercase text-[10px] font-bold tracking-wider rounded-xl"
                                        >
                                            <Icon name="CheckCircle" size={14} className="mr-2" />
                                            Mark Read
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(msg.id)}
                                        className="h-9 px-3 border-red-100 text-destructive hover:bg-destructive/10 uppercase text-[10px] font-bold tracking-wider rounded-xl"
                                    >
                                        <Icon name="Trash2" size={14} className="mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-muted/30 p-5 rounded-2xl text-sm text-foreground whitespace-pre-wrap leading-relaxed border border-border/50">
                                {msg.message}
                            </div>

                            <div className="mt-5 pt-5 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    Type: {msg.inquiry_type}
                                </div>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="w-full sm:w-auto rounded-xl shadow-sm h-10 px-6 font-bold text-xs uppercase tracking-widest"
                                  onClick={() => window.location.href = `mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                >
                                    <Icon name="Reply" size={14} className="mr-2" />
                                    Reply via Email
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Messages;
