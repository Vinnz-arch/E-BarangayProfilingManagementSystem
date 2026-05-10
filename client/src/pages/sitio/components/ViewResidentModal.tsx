import React from 'react';
import { Icon } from '../../../components/ui';
import { Button } from "../../../components/ui/index";
import * as FaIcons from 'react-icons/fa6';

interface ResidentData {
  id: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  gender: string;
  date_of_birth: string;
  is_household_type: string;
  citizenship: string;
  civil_status: string;
  occupation: string;
  school_attainment: string;
  skills: string | null;
  blood_type: string;
  is_4ps: boolean;
  is_pwd: boolean;
  is_solo_parent: boolean;
  is_senior_citizen: boolean;
}

interface ViewResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: ResidentData | null;
  sitioName?: string;
}

export const ViewResidentModal: React.FC<ViewResidentModalProps> = ({ isOpen, onClose, resident, sitioName }) => {
  if (!isOpen || !resident) return null;

  const DetailItem = ({ label, value, icon, color = "primary" }: { label: string, value: string | React.ReactNode, icon: keyof typeof FaIcons, color?: string }) => (
    <div className="bg-bg-main border border-border-muted p-4 rounded-2xl flex items-start gap-4 transition-all hover:border-primary/30 group">
      <div className={`p-2 bg-bg-light rounded-xl text-${color} border border-border-muted group-hover:scale-110 transition-transform`}>
        <Icon iconName={icon} size={18} />
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-black uppercase italic tracking-widest text-text-muted">{label}</p>
        <p className="text-sm font-bold text-text tracking-tighter uppercase italic">{value || 'N/A'}</p>
      </div>
    </div>
  );

  const StatusBadge = ({ active, label, icon }: { active: boolean, label: string, icon: keyof typeof FaIcons }) => (
    <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
      active 
        ? 'bg-success/5 border-success/20 text-success' 
        : 'bg-bg-main border-border-muted text-text-muted opacity-50'
    }`}>
      <Icon iconName={icon} size={16} />
      <span className="text-[10px] font-black uppercase italic tracking-widest">{label}</span>
      <span className="ml-auto text-[10px] font-bold uppercase">{active ? 'Yes' : 'No'}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-bg-dark/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-bg-light border border-border-muted rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-border-muted bg-bg-main/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary shadow-inner">
                <Icon iconName="FaUserLarge" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text leading-tight">
                  Resident Profile
                </h2>
                <p className="text-[10px] font-black uppercase italic tracking-widest text-primary">
                  Viewing: {resident.first_name} {resident.last_name}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-bg-main border border-border-muted rounded-xl text-text-muted hover:text-danger hover:border-danger/30 transition-all cursor-pointer"
            >
              <Icon iconName="FaXmark" size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
          
          {/* Section: Government Status - Prominent Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatusBadge active={resident.is_4ps} label="4Ps" icon="FaIdCard" />
            <StatusBadge active={resident.is_pwd} label="PWD" icon="FaWheelchair" />
            <StatusBadge active={resident.is_solo_parent} label="Solo Parent" icon="FaUserGroup" />
            <StatusBadge active={resident.is_senior_citizen} label="Senior" icon="FaPersonWalkingWithCane" />
          </div>

          {/* Section: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-text-muted">
              <div className="h-[2px] w-8 bg-border-muted"></div>
              <h3 className="text-[10px] font-black uppercase italic tracking-[0.2em]">Identity Details</h3>
              <div className="h-[2px] grow bg-border-muted"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem icon="FaUserTag" label="Full Name" value={`${resident.last_name}, ${resident.first_name} ${resident.middle_name || ''}`} />
              <DetailItem icon="FaCalendarDay" label="Birth Date" value={new Date(resident.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
              <DetailItem icon="FaVenusMars" label="Gender" value={resident.gender} />
              <DetailItem icon="FaHeart" label="Civil Status" value={resident.civil_status} />
              <DetailItem icon="FaFlag" label="Citizenship" value={resident.citizenship} />
              <DetailItem icon="FaDroplet" label="Blood Type" value={resident.blood_type} color="danger" />
            </div>
          </div>

          {/* Section: Living Situation */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-text-muted">
              <div className="h-[2px] w-8 bg-border-muted"></div>
              <h3 className="text-[10px] font-black uppercase italic tracking-[0.2em]">Household & Location</h3>
              <div className="h-[2px] grow bg-border-muted"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem icon="FaMapPin" label="Sitio Name" value={sitioName || 'Loading...'} />
              <DetailItem 
                icon="FaUsersLine" 
                label="Household Position" 
                value={resident.is_household_type === '1' ? 'Head of Household' : 'Member of Household'} 
              />
            </div>
          </div>

          {/* Section: Background */}
          <div className="space-y-4 pb-4">
            <div className="flex items-center gap-3 text-text-muted">
              <div className="h-[2px] w-8 bg-border-muted"></div>
              <h3 className="text-[10px] font-black uppercase italic tracking-[0.2em]">Professional Profile</h3>
              <div className="h-[2px] grow bg-border-muted"></div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem icon="FaGraduationCap" label="Educational Attainment" value={resident.school_attainment} />
                <DetailItem icon="FaBriefcase" label="Occupation" value={resident.occupation} />
              </div>
              <div className="bg-bg-main border border-border-muted p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Icon iconName="FaScrewdriverWrench" size={14} />
                  <p className="text-[10px] font-black uppercase italic tracking-widest text-text-muted">Specialized Skills</p>
                </div>
                <p className="text-sm font-bold text-text italic leading-relaxed">
                  {resident.skills || "No skills or certifications registered."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 bg-bg-main border-t border-border-muted flex justify-center">
          <Button 
            onClick={onClose}
            variant="ghost" 
            className="px-12 py-4 border-2 border-border-muted hover:border-primary/50"
          >
            Finish Review
          </Button>
        </div>
      </div>
    </div>
  );
};
