import React, { useState } from 'react';
import api from '../../../util/axios';
import { Icon } from '../../../components/ui';
import { Button } from "../../../components/ui/index";
import { notify } from '../../../util/notify';

interface AddOfficialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddOfficialModal: React.FC<AddOfficialModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    term: '2023 - Present',
    display_order: 0,
    is_active: true
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.position || !formData.term) {
      notify.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('position', formData.position);
      data.append('term', formData.term);
      data.append('display_order', formData.display_order.toString());
      data.append('is_active', formData.is_active ? '1' : '0');
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      const response = await api.post('/officials', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      notify.success(response.data.message || 'Official added successfully!');
      onSuccess();
      handleClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong!';
      notify.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      position: '',
      term: '2023 - Present',
      display_order: 0,
      is_active: true
    });
    setImageFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-bg-dark/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-lg bg-bg-light border border-border-muted rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text">
              Add Official
            </h2>
            <Button 
              onClick={handleClose}
              variant="ghost"
              className="p-2 text-text-muted hover:text-danger transition-colors cursor-pointer"
            >
              <Icon iconName="FaXmark" size={24} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Official Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Hon. Full Name"
                className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Position</label>
              <select
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all cursor-pointer"
              >
                <option value="" disabled>Select Position</option>
                <option value="Punong Barangay">Punong Barangay</option>
                <option value="Barangay Kagawad">Barangay Kagawad</option>
                <option value="SK Chairman">SK Chairman</option>
                <option value="Barangay Secretary">Barangay Secretary</option>
                <option value="Barangay Treasurer">Barangay Treasurer</option>
                <option value="Barangay Record Keeper">Barangay Record Keeper</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Term</label>
                <input
                  type="text"
                  required
                  value={formData.term}
                  onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                  placeholder="2023 - Present"
                  className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Official Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-3 text-xs text-text-muted font-bold tracking-tighter outline-none focus:border-primary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                fullWidth 
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                isLoading={isLoading}
                loadingText="Adding..."
                iconName="FaUserPlus"
                fullWidth
              >
                Add Official
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
