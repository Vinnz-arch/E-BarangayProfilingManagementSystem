import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { MainLayout } from "../../components/layouts";
import { Button, LoadingSpinner, Icon } from "../../components/ui";
import { ViewResidentModal } from "./components/ViewResidentModal";
import { notify } from "../../util/notify";

interface Resident {
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
  is_solo_parent: boolean;
  is_senior_citizen: boolean;
}

interface SitioData {
  id: number;
  name: string;
  address: string;
  logo: string | null;
}

const SitioResidents = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sitio, setSitio] = useState<SitioData | null>(null);
    const [residents, setResidents] = useState<Resident[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [sitioRes, residentsRes] = await Promise.all([
                axios.get(`http://127.0.0.1:8000/api/v1/sitios/${id}`),
                axios.get(`http://127.0.0.1:8000/api/v1/residents?sitio_id=${id}`)
            ]);
            setSitio(sitioRes.data);
            setResidents(residentsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            notify.error("Failed to load data");
            navigate("/app/sitio");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleView = (resident: Resident) => {
        setSelectedResident(resident);
        setIsViewModalOpen(true);
    };

    const handleDeleteResident = async (residentId: number) => {
        if (!window.confirm("Are you sure you want to delete this resident?")) return;

        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/residents/${residentId}`);
            notify.success("Resident deleted successfully");
            fetchData();
        } catch (error) {
            notify.error("Failed to delete resident");
        }
    };

    const filteredResidents = residents.filter(r => 
        `${r.first_name} ${r.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const content = (
        <div className="space-y-8 pb-20">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link 
                        to="/app/sitio"
                        className="p-2 text-text-muted hover:text-primary transition-colors bg-bg-light border border-border-muted rounded-xl"
                    >
                        <Icon iconName="FaArrowLeft" size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-text leading-none">
                            {sitio?.name || "Loading..."}
                        </h1>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">
                            Resident Management
                        </p>
                    </div>
                </div>
                <Button 
                    iconName="FaUserPlus" 
                    onClick={() => navigate(`/app/sitio/${id}/residents/create`)}
                >
                    Add Resident
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <LoadingSpinner size="lg" text="Loading Residents..." />
                </div>
            ) : (
                <>
                    {/* Sitio Info Card */}
                    <div className="bg-bg-light border border-border-muted rounded-[2rem] p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
                        <div className="w-32 h-32 rounded-3xl bg-bg-main border border-border-muted flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                            {sitio?.logo ? (
                                <img 
                                    src={`http://127.0.0.1:8000/storage/${sitio.logo}`} 
                                    alt={sitio.name} 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <Icon iconName="FaHouse" className="text-text-muted/30" size={48} />
                            )}
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text">
                                {sitio?.name}
                            </h2>
                            <p className="text-sm font-bold text-text-muted uppercase tracking-widest max-w-xl">
                                {sitio?.address}
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl mt-2">
                                <Icon iconName="FaUsers" size={16} className="text-primary" />
                                <span className="text-xs font-black uppercase italic tracking-tighter text-primary">
                                    {residents.length} Total Residents
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Resident List Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black uppercase italic tracking-tighter text-text">
                                Resident List
                            </h2>
                            <div className="relative">
                                <Icon iconName="FaMagnifyingGlass" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="Search residents..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-bg-light border border-border-muted rounded-2xl pl-10 pr-6 py-2 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all w-64"
                                />
                            </div>
                        </div>

                        {filteredResidents.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-separate border-spacing-y-3">
                                    <thead>
                                        <tr className="text-[10px] font-black uppercase italic tracking-widest text-text-muted">
                                            <th className="px-6 pb-2">Name</th>
                                            <th className="px-6 pb-2">Gender</th>
                                            <th className="px-6 pb-2">Status</th>
                                            <th className="px-6 pb-2">Occupation</th>
                                            <th className="px-6 pb-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredResidents.map((resident) => (
                                            <tr key={resident.id} className="group transition-all">
                                                <td className="px-6 py-5 bg-bg-light border-y border-l border-border-muted rounded-l-[1.5rem] shadow-sm">
                                                    <span className="text-sm font-black uppercase italic tracking-tighter text-text">
                                                        {resident.last_name}, {resident.first_name} {resident.middle_initial}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 bg-bg-light border-y border-border-muted shadow-sm">
                                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest bg-bg-main px-3 py-1 rounded-full border border-border-muted">
                                                        {resident.gender}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 bg-bg-light border-y border-border-muted shadow-sm">
                                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                                        {resident.civil_status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 bg-bg-light border-y border-border-muted shadow-sm">
                                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                                        {resident.occupation || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 bg-bg-light border-y border-r border-border-muted rounded-r-[1.5rem] text-right shadow-sm">
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleView(resident)}
                                                            className="p-2 text-text-muted hover:text-success transition-colors bg-bg-main rounded-xl border border-border-muted"
                                                            title="View Information"
                                                        >
                                                            <Icon iconName="FaEye" size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => navigate(`/app/sitio/${id}/residents/${resident.id}/edit`)}
                                                            className="p-2 text-text-muted hover:text-primary transition-colors bg-bg-main rounded-xl border border-border-muted"
                                                            title="Edit"
                                                        >
                                                            <Icon iconName="FaPen" size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteResident(resident.id)}
                                                            className="p-2 text-text-muted hover:text-danger transition-colors bg-bg-main rounded-xl border border-border-muted"
                                                            title="Delete"
                                                        >
                                                            <Icon iconName="FaTrash" size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-bg-light border border-border-muted rounded-[2rem] p-16 text-center shadow-sm">
                                <Icon iconName="FaUsersSlash" size={64} className="mx-auto mb-6 text-text-muted/10" />
                                <p className="text-text-muted italic text-sm uppercase tracking-widest font-black">
                                    {searchQuery ? "No residents match your search." : "No residents registered in this sitio yet."}
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}

            <ViewResidentModal 
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedResident(null);
                }}
                resident={selectedResident}
                sitioName={sitio?.name}
            />
        </div>
    );

    return <MainLayout content={content} />
}

export default SitioResidents;
