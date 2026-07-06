import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, CheckCircle2, AlertCircle, Info, Package, DollarSign, UserPlus, FileText } from 'lucide-react';
import { adminService } from '../../services';
import { Button } from '../../components/ui';

export default function AdminNotifications() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['adminNotifications'],
    queryFn: adminService.getNotifications,
    refetchInterval: 30000, // Refresh every 30s
  });

  const markReadMutation = useMutation({
    mutationFn: (name) => adminService.markNotificationRead(name),
    onSuccess: () => queryClient.invalidateQueries(['adminNotifications']),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => adminService.markAllNotificationsRead(),
    onSuccess: () => queryClient.invalidateQueries(['adminNotifications']),
  });

  const getIcon = (subject, type) => {
    if (subject.includes('Customer')) return <UserPlus className="w-5 h-5 text-blue-500" />;
    if (subject.includes('Payment')) return <DollarSign className="w-5 h-5 text-emerald-500" />;
    if (subject.includes('Stock')) return <Package className="w-5 h-5 text-amber-500" />;
    if (subject.includes('Sales Order')) return <FileText className="w-5 h-5 text-violet-500" />;
    
    if (type === 'Alert') return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (type === 'Warning') return <AlertCircle className="w-5 h-5 text-amber-500" />;
    return <Info className="w-5 h-5 text-blue-500" />;
  };

  const getTimeAgo = (dateStr) => {
    const diff = new Date() - new Date(dateStr);
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-600" />
            Notification Center
          </h2>
          <p className="text-gray-500 text-sm mt-1">You have {unreadCount} unread notifications</p>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => markAllReadMutation.mutate()}
            isLoading={markAllReadMutation.isLoading}
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark All Read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-gray-500 text-center py-12">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="text-gray-400 text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div 
              key={notif.name} 
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${notif.read ? 'bg-white border-gray-100 opacity-70' : 'bg-blue-50/50 border-blue-100 shadow-sm'}`}
            >
              <div className="shrink-0 mt-1 bg-white p-2 rounded-full shadow-sm">
                {getIcon(notif.subject, notif.type)}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <h3 className={`font-semibold truncate ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>
                    {notif.subject}
                  </h3>
                  <span className="shrink-0 text-xs text-gray-400 font-medium">{getTimeAgo(notif.creation)}</span>
                </div>
                <p className={`text-sm mt-1 ${notif.read ? 'text-gray-500' : 'text-gray-700'}`}>
                  {notif.email_content}
                </p>
                {notif.document_type && notif.document_name && (
                  <a href={`/app/${notif.document_type.toLowerCase().replace(' ', '-')}/${notif.document_name}`} target="_blank" rel="noreferrer" className="inline-block mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 transition">
                    View {notif.document_type} →
                  </a>
                )}
              </div>
              {!notif.read && (
                <button
                  onClick={() => markReadMutation.mutate(notif.name)}
                  className="shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-200 hover:bg-green-50 transition tooltip"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
