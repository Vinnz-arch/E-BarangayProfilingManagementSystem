import React, { useState } from 'react';
import api from '../../../util/axios';
import { Icon } from '../../../components/ui';
import { Button } from "../../../components/ui/index";
import { notify } from '../../../util/notify';


interface AddResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sitioId: number;
  onSuccess: () => void;
}

export const AddResidentModal: React.FC<AddResidentModalProps> = ({ isOpen, onClose, sitioId, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    middle_initial: '',
    household_type: '',
    gender: '',
    date_of_birth: '',
    citizenship: 'Filipino',
    civil_status: '',
    occupation: '',
    school_attainment: '',
    skills: '',
    blood_type: '',
    is_4ps: false,
    is_pwd: false
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.last_name || !formData.first_name || !formData.date_of_birth || !formData.gender || !formData.civil_status) {
      notify.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        sitio_id: sitioId
      };

      const response = await api.post('/residents', payload);
      notify.success(response.data.message || 'Resident added successfully!');
      
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
      last_name: '',
      first_name: '',
      middle_initial: '',
      household_type: '',
      gender: '',
      date_of_birth: '',
      citizenship: 'Filipino',
      civil_status: '',
      occupation: '',
      school_attainment: '',
      skills: '',
      blood_type: '',
      is_4ps: false,
      is_pwd: false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-bg-dark/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-2xl bg-bg-light border border-border-muted rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        <div className="p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text">
              Add New Resident
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Last Name"
                  className="w-full bg-bg-main border border-border-muted rounded-2xl px-4 py-3 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="First Name"
                  className="w-full bg-bg-main border border-border-muted rounded-2xl px-4 py-3 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">M.I.</label>
                <input
                  type="text"
                  value={formData.middle_initial}
                  onChange={(e) => setFormData({ ...formData, middle_initial: e.target.value })}
                  placeholder="M.I."
                  maxLength={5}
                  className="w-full bg-bg-main border border-border-muted rounded-2xl px-4 py-3 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Household Type</label>
                <input
                    type="text"
                    required
                    value={formData.household_type}
                    onChange={(e) => setFormData({ ...formData, household_type: e.target.value })}
                    placeholder="Enter household type..."
                    className="w-full bg-bg-main border border-border-muted rounded-2xl px-4 py-3 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
                  />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Gender</label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-bg-main border border-border-muted rounded-2xl px-4 py-3 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full bg-bg-main border border-border-muted rounded-2xl px-4 py-3 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Citizenship</label>
                <input
                  type="text"
                  required
                  value={formData.citizenship}
                  onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                  placeholder="Citizenship"
                  className="w-full bg-bg-main border border-border-muted rounded-2xl px-4 py-3 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Civil Status</label>
                <select
                  required
                  value={formData.civil_status}
                  onChange={(e) => setFormData({ ...formData, civil_status: e.target.value })}
                  className="w-full bg-bg-main border border-border-muted rounded-2xl px-4 py-3 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="" disabled>Select Civil Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Occupation</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="Occupation"
                  className="w-full bg-bg-main border border-border-muted rounded-2xl px-4 py-3 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">School Attainment</label>
                <input
                  type="text"
                  value={formData.school_attainment}
                  onChange={(e) => setFormData({ ...formData, school_attainment: e.target.value })}
                  placeholder="School Attainment"
                  className="w-full bg-bg-main border border-border-muted rounded-2xl px-4 py-3 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Blood Type</label>
                <select
                  value={formData.blood_type}
                  onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                  className="w-full bg-bg-main border border-border-muted rounded-2xl px-4 py-3 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Skills (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="Enter skills..."
                  className="w-full bg-bg-main border border-border-muted rounded-2xl px-4 py-3 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50 resize-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">4Ps Member</label>
                <select
                  required
                  value={formData.is_4ps ? "true" : "false"}
                  onChange={(e) => setFormData({ ...formData, is_4ps: e.target.value === "true" })}
                  className="w-full bg-bg-main border border-border-muted rounded-2xl px-4 py-3 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">PWD</label>
                <select
                  required
                  value={formData.is_pwd ? "true" : "false"}
                  onChange={(e) => setFormData({ ...formData, is_pwd: e.target.value === "true" })}
                  className="w-full bg-bg-main border border-border-muted rounded-2xl px-4 py-3 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4 sticky bottom-0 bg-bg-light pb-2">
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
                loadingText="Saving..."
                iconName="FaUserPlus"
                fullWidth
              >
                Save Resident
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
