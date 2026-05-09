import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '../../../components/ui';
import { ToastProvider, Button } from "../../../components/ui/index";
import { notify } from '../../../util/notify';

interface SitioData {
  id: number;
  name: string;
  address: string;
  logo: string | null;
}

interface EditSitioModalProps {
  isOpen: boolean;
  onClose: () => void;
  sitio: SitioData | null;
}

export const EditSitioModal: React.FC<EditSitioModalProps> = ({ isOpen, onClose, sitio }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    image: null as File | null,
    imagePreview: '' as string
  });

  useEffect(() => {
    if (sitio) {
      setFormData({
        name: sitio.name,
        address: sitio.address,
        image: null,
        imagePreview: sitio.logo ? `http://127.0.0.1:8000/storage/${sitio.logo}` : ''
      });
    }
  }, [sitio, isOpen]);

  if (!isOpen || !sitio) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Cleanup previous object URL if it was created locally
      if (formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(formData.imagePreview);
      }
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) return;

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('address', formData.address);
      if (formData.image) {
        formDataToSend.append('logo', formData.image);
      }
      
      // Laravel handles PUT with FormData via _method trick or using POST with _method
      formDataToSend.append('_method', 'PUT');

      const response = await axios.post(`http://127.0.0.1:8000/api/v1/sitios/${sitio.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      notify.success(response.data.message || 'Sitio updated successfully!');
      handleClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong!';
      notify.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    onClose();
  };

  const isFormValid = formData.name.trim() !== '' && formData.address.trim() !== '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-bg-dark/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-md bg-bg-light border border-border-muted rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text">
              Edit Sitio
            </h2>
            <Button 
              onClick={handleClose}
              variant="ghost"
              className="p-2 text-text-muted hover:text-danger transition-colors cursor-pointer"
            >
              <Icon iconName="FaXmark" size={24} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                Click to change logo
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
                isLoading={isLoading}
                loadingText="Updating..."
                iconName="FaCloudArrowUp"
                fullWidth
                disabled={!isFormValid || isLoading}
              >
                Update Sitio
              </Button>
            </div>
            <ToastProvider />
          </form>
        </div>
      </div>
    </div>
  );
};
