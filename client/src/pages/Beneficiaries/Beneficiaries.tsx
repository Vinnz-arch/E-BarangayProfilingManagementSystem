import { useState, useEffect } from "react";
import api from "../../util/axios";
import { MainLayout } from "../../components/layouts";
import { LoadingSpinner, Icon, Button } from "../../components/ui";
import { ViewResidentModal } from "../sitio/components/ViewResidentModal";
import { notify } from "../../util/notify";
import * as FaIcons from 'react-icons/fa6';

interface Resident {
  id: number;
  sitio_id: number;
  last_name: string;
  first_name: string;
  middle_initial: string;
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
  sitio: { name: string };
}

const Beneficiaries = () => {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<"pwd" | "solo" | "4ps" | "senior">("pwd");
    const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/residents");
            setResidents(response.data);
        } catch (error) {
            console.error("Error fetching beneficiaries:", error);
            notify.error("Failed to load beneficiaries data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleExport = async (format: 'xlsx' | 'csv') => {
        setIsExporting(true);
        setShowExportMenu(false);
        try {
            const endpointMap = {
                pwd: '/beneficiaries/pwd/export',
                solo: '/beneficiaries/solo-parent/export',
                '4ps': '/beneficiaries/4ps/export',
                senior: '/beneficiaries/senior-citizen/export'
            };

            const response = await api.get(endpointMap[activeCategory], {
                params: { format },
                responseType: 'blob'
            });

            // Create blob and download
            const blob = new Blob([response.data], { 
                type: format === 'xlsx' 
                    ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                    : 'text/csv' 
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${activeCategory}_beneficiaries_${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

            notify.success(`Exported ${activeCategory} list as ${format.toUpperCase()}`);
        } catch (error) {
            console.error("Export failed:", error);
            notify.error("Failed to export beneficiaries list");
        } finally {
            setIsExporting(false);
        }
    };

    // Calculate counts
    const stats = {
        pwd: residents.filter(r => r.is_pwd).length,
        solo: residents.filter(r => r.is_solo_parent).length,
        "4ps": residents.filter(r => r.is_4ps).length,
        senior: residents.filter(r => r.is_senior_citizen).length,
    };

    const getFilteredResidents = () => {
        switch (activeCategory) {
            case "pwd": return residents.filter(r => r.is_pwd);
            case "solo": return residents.filter(r => r.is_solo_parent);
            case "4ps": return residents.filter(r => r.is_4ps);
            case "senior": return residents.filter(r => r.is_senior_citizen);
            default: return [];
        }
    };

    const currentList = getFilteredResidents();

    const CategoryCard = ({ type, label, count, icon, colorClass }: { type: any, label: string, count: number, icon: keyof typeof FaIcons, colorClass: string }) => (
        <button 
            onClick={() => setActiveCategory(type)}
            className={`flex flex-col p-6 rounded-[2.5rem] border transition-all duration-300 text-left group ${
                activeCategory === type 
                ? `bg-bg-light border-${colorClass} shadow-xl scale-[1.02]` 
                : 'bg-bg-light border-border-muted hover:border-primary/30 shadow-sm'
            }`}
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                activeCategory === type ? `bg-${colorClass} text-bg-dark` : `bg-bg-main text-${colorClass}`
            }`}>
                <Icon iconName={icon} size={28} />
            </div>
            <p className="text-[10px] font-black uppercase italic tracking-widest text-text-muted mb-1 group-hover:text-primary transition-colors">
                Total {label}
            </p>
            <h3 className="text-4xl font-black italic tracking-tighter text-text">
                {count}
            </h3>
        </button>
    );

    const content = (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-text leading-none">
                    Beneficiaries
                </h1>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-2">
                    Barangay Social Service Monitoring
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <LoadingSpinner size="lg" text="Analyzing Records..." />
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <CategoryCard type="pwd" label="PWDs" count={stats.pwd} icon="FaWheelchair" colorClass="primary" />
                        <CategoryCard type="solo" label="Solo Parents" count={stats.solo} icon="FaUserGroup" colorClass="warning" />
                        <CategoryCard type="4ps" label="4Ps" count={stats["4ps"]} icon="FaIdCard" colorClass="success" />
                        <CategoryCard type="senior" label="Seniors" count={stats.senior} icon="FaPersonWalkingWithCane" colorClass="danger" />
                    </div>

                    {/* Category List Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] w-12 bg-primary"></div>
                                <h2 className="text-xl font-black uppercase italic tracking-tighter text-text">
                                    {activeCategory === "pwd" && "Persons with Disabilities"}
                                    {activeCategory === "solo" && "Solo Parents List"}
                                    {activeCategory === "4ps" && "4Ps Beneficiaries"}
                                    {activeCategory === "senior" && "Senior Citizens"}
                                </h2>
                            </div>

                            {currentList.length > 0 && (
                                <div className="relative">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        iconName={isExporting ? "FaSpinner" : "FaDownload"}
                                        className={isExporting ? "animate-pulse" : ""}
                                        disabled={isExporting}
                                        onClick={() => setShowExportMenu(!showExportMenu)}
                                    >
                                        {isExporting ? "Exporting..." : "Export"}
                                    </Button>
                                    
                                    {showExportMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-bg-light border border-border-muted rounded-2xl shadow-xl z-50 overflow-hidden">
                                            <button 
                                                onClick={() => handleExport('xlsx')}
                                                className="w-full px-4 py-3 text-left text-[10px] font-black uppercase italic tracking-widest text-text hover:bg-bg-main flex items-center gap-3 transition-colors"
                                            >
                                                <Icon iconName="FaFileExcel" className="text-success" />
                                                Excel (.xlsx)
                                            </button>
                                            <button 
                                                onClick={() => handleExport('csv')}
                                                className="w-full px-4 py-3 text-left text-[10px] font-black uppercase italic tracking-widest text-text hover:bg-bg-main flex items-center gap-3 transition-colors"
                                            >
                                                <Icon iconName="FaFileCsv" className="text-primary" />
                                                CSV (.csv)
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {currentList.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-separate border-spacing-y-3">
                                    <thead>
                                        <tr className="text-[10px] font-black uppercase italic tracking-widest text-text-muted">
                                            <th className="px-6 pb-2">Beneficiary Name</th>
                                            <th className="px-6 pb-2">Sitio</th>
                                            <th className="px-6 pb-2">Status</th>
                                            <th className="px-6 pb-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentList.map((resident) => (
                                            <tr key={resident.id} className="group transition-all">
                                                <td className="px-6 py-5 bg-bg-light border-y border-l border-border-muted rounded-l-[1.5rem] shadow-sm">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black uppercase italic tracking-tighter text-text">
                                                            {resident.last_name}, {resident.first_name}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-text-muted/60 uppercase">
                                                            {resident.gender} • {resident.civil_status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 bg-bg-light border-y border-border-muted shadow-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                                                        <span className="text-[10px] font-black uppercase italic tracking-tighter text-text">
                                                            Sitio {resident.sitio?.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 bg-bg-light border-y border-border-muted shadow-sm">
                                                    <span className="px-3 py-1 bg-bg-main border border-border-muted rounded-full text-[9px] font-black uppercase italic text-text-muted">
                                                        Verified
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 bg-bg-light border-y border-r border-border-muted rounded-r-[1.5rem] text-right shadow-sm">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        iconName="FaEye"
                                                        className="border border-border-muted px-4"
                                                        onClick={() => {
                                                            setSelectedResident(resident);
                                                            setIsViewModalOpen(true);
                                                        }}
                                                    >
                                                        Profile
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-bg-light border border-border-muted rounded-[2rem] p-20 text-center shadow-sm">
                                <Icon iconName="FaFolderOpen" size={64} className="mx-auto mb-6 text-text-muted/10" />
                                <p className="text-text-muted italic text-sm uppercase tracking-widest font-black">
                                    No records found for this category.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <ViewResidentModal 
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedResident(null);
                }}
                resident={selectedResident}
                sitioName={selectedResident?.sitio?.name}
            />
        </div>
    );

    return <MainLayout content={content} />
}

export default Beneficiaries
