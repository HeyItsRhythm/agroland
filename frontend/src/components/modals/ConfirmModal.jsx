import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Icon from '../AppIcon';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText, 
  cancelText, 
  loading = false,
  variant = 'destructive' // 'destructive' or 'primary'
}) => {
  // Prevent body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={loading ? undefined : onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
        >
          <div className="p-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
              variant === 'destructive' ? 'bg-rose-50 text-rose-500' : 'bg-primary/10 text-primary'
            }`}>
              <Icon name={variant === 'destructive' ? 'AlertTriangle' : 'HelpCircle'} size={28} />
            </div>

            <h3 className="text-xl font-black font-heading text-slate-900 mb-3 tracking-tight">
              {title}
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              {message}
            </p>
          </div>

          <div className="px-8 pb-8 flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] border-slate-200 hover:bg-slate-50 transition-all"
            >
              {cancelText || 'Cancel'}
            </Button>
            <Button
              variant={variant === 'destructive' ? 'destructive' : 'default'}
              onClick={onConfirm}
              loading={loading}
              className={`flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-95 ${
                variant === 'destructive' ? 'shadow-rose-100' : 'shadow-primary/10'
              }`}
            >
              {confirmText || 'Confirm'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
