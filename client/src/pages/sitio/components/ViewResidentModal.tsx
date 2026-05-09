import React from 'react';
import { Icon } from '../../../components/ui';
import { Button } from "../../../components/ui/index";

interface ResidentData {
  id: number;
  last_name: string;
  first_name: string;
  middle_initial: string;
  gender: string;
  date_of_birth: string;
  household_type: string;
  citizenship: string;
  civil_status: string;
  occupation: string;
  school_attainment: string;
  skills: string | null;
  blood_type: string;
  is_4ps: boolean;
  is_pwd: boolean;
}

interface ViewResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: ResidentData | null;
  sitioName?: string;
}

export const ViewResidentModal: React.FC<ViewResidentModalProps> = ({ isOpen, onClose, resident, sitioName }) => {
  if (!isOpen || !resident) return null;

  const DetailItem = ({ label, value, icon }: { label: string, value: string | React.ReactNode, icon: string }) => (
    <div className="bg-bg-main border border-border-muted p-4 rounded-2xl flex items-start gap-4">
      <div className="p-2 bg-bg-light rounded-xl text-primary border border-border-muted">
        <Icon iconName={icon} size={16} />
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-black uppercase italic tracking-widest text-text-muted">{label}</p>
        <p className="text-sm font-bold text-text tracking-tighter uppercase italic">{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-bg-dark/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-bg-light border border-border-muted rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-border-muted">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text leading-none">
                Resident Profile
              </h2>
              <p className="text-[10px] font-black uppercase italic tracking-widest text-text-muted mt-2">
                Viewing information for {resident.first_name} {resident.last_name}
              </p>
            </div>
            <Button 
              onClick={onClose}
              variant="ghost"
              className="p-2 text-text-muted hover:text-danger transition-colors cursor-pointer"
            >
              <Icon iconName="FaXmark" size={24} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-8">
          {/* Section: Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Icon iconName="FaUser" size={14} />
              <h3 className="text-xs font-black uppercase italic tracking-widest">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem icon="FaUserTag" label="Full Name" value={`${resident.last_name}, ${resident.first_name} ${resident.middle_initial || ''}`} />
              <DetailItem icon="FaCalendar" label="Date of Birth" value={new Date(resident.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
              <DetailItem icon="FaVenusMars" label="Gender" value={resident.gender} />
              <DetailItem icon="FaFlag" label="Citizenship" value={resident.citizenship} />
              <DetailItem icon="FaHeart" label="Civil Status" value={resident.civil_status} />
              <DetailItem icon="FaDroplet" label="Blood Type" value={resident.blood_type} />
            </div>
          is_pwd: boolean;
          is_solo_parent: boolean;
          is_senior_citizen: boolean;
          }
          ...
                  {/* Section: Residence & Status */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Icon iconName="FaHouse" size={14} />
                      <h3 className="text-xs font-black uppercase italic tracking-widest">Residence Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem icon="FaMapPin" label="Sitio Location" value={sitioName || 'Not Specified'} />
                      <DetailItem icon="FaUsers" label="Household Type" value={resident.household_type} />
                      <DetailItem icon="FaIdCard" label="4Ps Member" value={resident.is_4ps ? 'Yes' : 'No'} />
                      <DetailItem icon="FaWheelchair" label="PWD Status" value={resident.is_pwd ? 'Yes' : 'No'} />
                      <DetailItem icon="FaPersonWalkingWithCane" label="Senior Citizen" value={resident.is_senior_citizen ? 'Yes' : 'No'} />
                      <DetailItem icon="FaUserGroup" label="Solo Parent" value={resident.is_solo_parent ? 'Yes' : 'No'} />
                    </div>
                  </div>

          {/* Section: Professional */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Icon iconName="FaBriefcase" size={14} />
              <h3 className="text-xs font-black uppercase italic tracking-widest">Professional & Education</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem icon="FaGraduationCap" label="School Attainment" value={resident.school_attainment} />
                <DetailItem icon="FaHammer" label="Occupation" value={resident.occupation} />
              </div>
              <DetailItem icon="FaScrewdriverWrench" label="Skills" value={resident.skills || 'No skills listed'} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-bg-main border-t border-border-muted text-center">
          <Button 
            onClick={onClose}
            variant="ghost" 
            className="px-8 border-2 border-border-muted"
          >
            Close Profile
          </Button>
        </div>
      </div>
    </div>
  );
};
