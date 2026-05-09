import React, { useState } from 'react';
import { Button, Icon } from '../../../components/ui';

interface AddSitioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSitioModal: React.FC<AddSitioModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    image: null as File | null,
    imagePreview: '' as string
  });

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Cleanup previous preview if it exists
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) return;

    // Follow current data handling (Simulated state/API)
    console.log('Submitting Sitio:', formData);
    
    // Reset and close
    handleClose();
  };

  const handleClose = () => {
    // Cleanup preview URL to prevent memory leaks
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData({ name: '', address: '', image: null, imagePreview: '' });
    onClose();
  };

  const isFormValid = formData.name.trim() !== '' && formData.address.trim() !== '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - Matching MainLayout overlay style */}
      <div 
        className="absolute inset-0 bg-bg-dark/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-bg-light border border-border-muted rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text">
              Add New Sitio
            </h2>
            <Button 
              onClick={handleClose}
              className="p-2 text-text-muted hover:text-danger transition-colors cursor-pointer"
            >
              <Icon iconName="FaXmark" size={24} />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload */}
            <div className="flex flex-col items-center justify-center space-y-3 pb-2">
              <label className="text-xs font-black uppercase italic tracking-widest text-text-muted">
                Sitio Logo
              </label>
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-bg-main border-2 border-dashed border-border-muted flex items-center justify-center overflow-hidden transition-all group-hover:border-primary">
                  {formData.imagePreview ? (
                    <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Icon iconName="FaCamera" className="text-text-muted group-hover:text-primary" />
                  )}
                </div>
                <input
                  title='inputImage'
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-[10px] font-black uppercase italic tracking-widest text-text-muted">
                Click to upload logo
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase italic tracking-widest text-text-muted ml-1">
                Sitio Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter sitio name..."
                className="w-full bg-bg-main border border-border-muted rounded-2xl px-6 py-4 text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase italic tracking-widest text-text-muted ml-1">
                Sitio Address
              </label>
              <textarea
                required
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter sitio address..."
                className="w-full bg-bg-main border border-border-muted rounded-2xl px-6 py-4 text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
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
                fullWidth
                disabled={!isFormValid}
              >
                Save Sitio
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};