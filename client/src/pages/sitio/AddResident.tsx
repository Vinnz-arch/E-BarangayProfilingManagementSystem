import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MainLayout } from "../../components/layouts";
import { Button, Icon } from "../../components/ui";
import { notify } from '../../util/notify';

interface SitioData {
  id: number;
  name: string;
}

const AddResident = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sitio, setSitio] = useState<SitioData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    middle_initial: '',
    is_household_type: '',
    gender: '',
    date_of_birth: '',
    citizenship: 'Filipino',
    civil_status: '',
    occupation: '',
    school_attainment: '',
    skills: '',
    blood_type: '',
    is_4ps: false,
    is_pwd: false,
    is_solo_parent: false,
    is_senior_citizen: false
  });

  useEffect(() => {
    const fetchSitio = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/sitios/${id}`);
        setSitio(response.data);
      } catch (error) {
        console.error("Error fetching sitio:", error);
        notify.error("Failed to load sitio details");
      }
    };
    fetchSitio();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.last_name || !formData.first_name || !formData.date_of_birth || !formData.gender || !formData.civil_status) {
      notify.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        sitio_id: id
      };

      await axios.post('http://127.0.0.1:8000/api/v1/residents', payload);
      notify.success('Resident added successfully!');
      navigate(`/app/sitio/${id}/residents`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong!';
      notify.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
            to={`/app/sitio/${id}/residents`}
            className="p-2 text-text-muted hover:text-primary transition-colors bg-bg-light border border-border-muted rounded-xl"
        >
            <Icon iconName="FaArrowLeft" size={20} />
        </Link>
        <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-text leading-none">
                Add New Resident
            </h1>
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">
                Registering to {sitio?.name || "..."}
            </p>
        </div>
      </div>

      <div className="bg-bg-light border border-border-muted rounded-[2.5rem] p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section: Personal Information */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border-muted pb-4">
                    <Icon iconName="FaUser" size={18} className="text-primary" />
                    <h2 className="text-sm font-black uppercase italic tracking-widest text-text">Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Last Name</label>
                        <input
                        type="text"
                        required
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        placeholder="Last Name"
                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
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
                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
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
                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Household Type</label>
                        <select
                            title='household'
                            required
                            value={formData.is_household_type}
                            onChange={(e) => setFormData({ ...formData, is_household_type: e.target.value })}
                            className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all cursor-pointer"
                        >
                            <option value="" disabled>Select Household Type</option>
                            <option value="1">Head of Household</option>
                            <option value="0">Member of Household</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Gender</label>
                        <select
                        title='gender'
                        required
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all cursor-pointer"
                        >
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Date of Birth</label>
                        <input
                        title='date'
                        type="date"
                        required
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all"
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
                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Civil Status</label>
                        <select
                        title='civil status'
                        required
                        value={formData.civil_status}
                        onChange={(e) => setFormData({ ...formData, civil_status: e.target.value })}
                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all cursor-pointer"
                        >
                        <option value="" disabled>Select Civil Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Separated">Separated</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Blood Type</label>
                        <select
                        title='blood type'
                        value={formData.blood_type}
                        onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all cursor-pointer"
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
            </div>

            {/* Section: Professional & Education */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border-muted pb-4">
                    <Icon iconName="FaGraduationCap" size={18} className="text-primary" />
                    <h2 className="text-sm font-black uppercase italic tracking-widest text-text">Education & Skills</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Occupation</label>
                        <input
                        type="text"
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                        placeholder="Occupation"
                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">School Attainment</label>
                        <input
                        type="text"
                        value={formData.school_attainment}
                        onChange={(e) => setFormData({ ...formData, school_attainment: e.target.value })}
                        placeholder="School Attainment"
                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Skills (Optional)</label>
                    <textarea
                    rows={3}
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="Describe professional skills..."
                    className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/50 resize-none"
                    />
                </div>
            </div>

            {/* Section: Government Status */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border-muted pb-4">
                    <Icon iconName="FaIdCard" size={18} className="text-primary" />
                    <h2 className="text-sm font-black uppercase italic tracking-widest text-text">Government Programs</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">4Ps Member</label>
                        <select
                        title='4psmember'
                        required
                        value={formData.is_4ps ? "true" : "false"}
                        onChange={(e) => setFormData({ ...formData, is_4ps: e.target.value === "true" })}
                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all cursor-pointer"
                        >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">PWD Status</label>
                        <select
                        title='pwdstatus'
                        required
                        value={formData.is_pwd ? "true" : "false"}
                        onChange={(e) => setFormData({ ...formData, is_pwd: e.target.value === "true" })}
                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all cursor-pointer"
                        >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Solo Parent</label>
                        <select
                        title='soloparent'
                        required
                        value={formData.is_solo_parent ? "true" : "false"}
                        onChange={(e) => setFormData({ ...formData, is_solo_parent: e.target.value === "true" })}
                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all cursor-pointer"
                        >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Senior Citizen</label>
                        <select
                        title='seniorCitizen'
                        required
                        value={formData.is_senior_citizen ? "true" : "false"}
                        onChange={(e) => setFormData({ ...formData, is_senior_citizen: e.target.value === "true" })}
                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all cursor-pointer"
                        >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-6">
                <Button 
                    type="button" 
                    variant="ghost" 
                    fullWidth 
                    onClick={() => navigate(`/app/sitio/${id}/residents`)}
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    variant="primary" 
                    isLoading={isLoading}
                    loadingText="Saving Resident..."
                    iconName="FaUserPlus"
                    fullWidth
                >
                    Register Resident
                </Button>
            </div>
        </form>
      </div>
    </div>
  );

  return <MainLayout content={content} />
};

export default AddResident;
