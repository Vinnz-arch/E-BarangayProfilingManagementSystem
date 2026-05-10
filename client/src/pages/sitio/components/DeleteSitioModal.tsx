import React, { useState } from 'react';
import api from '../../../util/axios';
import { Icon, Button, LoadingSpinner } from "../../../components/ui";
import { notify } from '../../../util/notify';

interface DeleteSitioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sitioId: number | null;
  sitioName: string | null;
}

export const DeleteSitioModal: React.FC<DeleteSitioModalProps> = ({ isOpen, onClose, onSuccess, sitioId, sitioName }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !sitioId) return null;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    try {
      const response = await api.delete(`/sitios/${sitioId}`, {
        data: { password }
      });
      notify.success(response.data.message || 'Sitio deleted successfully');
      onSuccess();
      handleClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Incorrect password or failed to delete';
      notify.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-bg-dark/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-bg-light border border-border-muted rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text leading-none">
                Delete Sitio
              </h2>
              <p className="text-[10px] font-bold text-danger uppercase tracking-widest mt-1">
                Security Verification Required
              </p>
            </div>
            <button 
              onClick={handleClose}
              className="p-3 text-text-muted hover:text-danger transition-colors bg-bg-main rounded-2xl border border-border-muted shadow-sm"
            >
              <Icon iconName="FaXmark" size={18} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-danger/5 border border-danger/10 p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-danger">
                <Icon iconName="FaTriangleExclamation" size={14} />
                <p className="text-[10px] font-black uppercase italic tracking-widest">Warning</p>
              </div>
              <p className="text-sm font-bold text-text tracking-tighter leading-tight">
                You are about to delete <span className="text-danger uppercase italic">"{sitioName}"</span>. This action cannot be undone.
              </p>
            </div>

            <form onSubmit={handleDelete} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">
                  Confirm Admin Password
                </label>
                <div className="relative">
                  <Icon iconName="FaLock" className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                  <input
                    type="password"
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password..."
                    className="w-full bg-bg-main border border-border-muted rounded-2xl pl-12 pr-6 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-danger transition-all placeholder:text-text-muted/50"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex-1 rounded-2xl py-6 font-black uppercase italic"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1 bg-danger hover:bg-danger/90 border-danger/20 rounded-2xl py-6 font-black uppercase italic tracking-widest gap-2"
                  disabled={isLoading || !password}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="text-white" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Icon iconName="FaTrash" />
                      <span>Confirm Delete</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
