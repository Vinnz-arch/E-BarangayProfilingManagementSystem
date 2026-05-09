import { useState, useEffect, useRef, useCallback } from "react";
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
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    
    // Pagination states
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalFound, setTotalFound] = useState(0);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const fetchData = useCallback(async (isInitial = false) => {
        if (isInitial) {
            setIsLoading(true);
            setPage(1);
        } else {
            if (!hasMore || isFetchingMore) return;
            setIsFetchingMore(true);
        }

        try {
            // Fetch sitio info only once
            if (isInitial && !sitio) {
                const sitioRes = await axios.get(`http://127.0.0.1:8000/api/v1/sitios/${id}`);
                setSitio(sitioRes.data);
            }

            const currentPage = isInitial ? 1 : page;
            const params: any = {
                limit: isInitial ? 15 : 5,
                page: currentPage,
                search: searchQuery || undefined,
                sitio_id: id,
            };

            const response = await axios.get("http://127.0.0.1:8000/api/v1/residents", { params });
            
            const newResidents = response.data.data;
            if (isInitial) {
                setResidents(newResidents);
            } else {
                setResidents(prev => [...prev, ...newResidents]);
            }

            setTotalFound(response.data.total);
            setHasMore(response.data.current_page < response.data.last_page);
            setPage(response.data.current_page + 1);
        } catch (error) {
            console.error("Error fetching data:", error);
            notify.error("Failed to load data");
            if (isInitial) navigate("/app/sitio");
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    }, [id, page, hasMore, isFetchingMore, searchQuery, sitio, navigate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData(true);
        }, 300);
        return () => clearTimeout(timer);
    }, [id, searchQuery]);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            if (hasMore && !isFetchingMore && !isLoading) {
                fetchData(false);
            }
        }
    };

    const handleView = (resident: Resident) => {
        setSelectedResident(resident);
        setIsViewModalOpen(true);
    };

    const handleDeleteResident = async (residentId: number) => {
        if (!window.confirm("Are you sure you want to delete this resident?")) return;

        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/residents/${residentId}`);
            notify.success("Resident deleted successfully");
            fetchData(true);
        } catch (error) {
            notify.error("Failed to delete resident");
        }
    };

    const content = (
        <div className="space-y-8 pb-10">
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

            {isLoading && residents.length === 0 ? (
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
                                    {totalFound} Total Residents
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Resident List Section */}
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">
                                <span className="text-primary">{totalFound} Records Found</span>
                                <div className="h-1 w-1 rounded-full bg-border-muted"></div>
                                {isLoading || isFetchingMore ? (
                                    <div className="flex items-center gap-2">
                                        <LoadingSpinner size="sm" color="text-primary" />
                                        <span className="text-primary animate-pulse tracking-widest">Syncing...</span>
                                    </div>
                                ) : (
                                    <span>{hasMore ? "Scroll down to load more" : "Database up to date"}</span>
                                )}
                            </div>

                            <div className="relative">
                                <Icon iconName="FaMagnifyingGlass" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="Search residents..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-bg-light border border-border-muted rounded-2xl pl-10 pr-6 py-2.5 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all w-full md:w-64 shadow-sm"
                                />
                            </div>
                        </div>

                        {residents.length > 0 ? (
                            <div className="bg-bg-light border border-border-muted rounded-[2rem] overflow-hidden shadow-sm flex flex-col h-[500px]">
                                <div 
                                    ref={scrollContainerRef}
                                    onScroll={handleScroll}
                                    className="overflow-y-auto grow custom-scrollbar relative"
                                >
                                    <table className="w-full text-left border-separate border-spacing-0">
                                        <thead className="sticky top-0 z-20 bg-bg-light">
                                            <tr className="text-[10px] font-black uppercase italic tracking-widest text-text-muted shadow-[0_1px_0_0_oklch(var(--border-muted))]">
                                                <th className="px-6 py-5 bg-bg-light">Full Name</th>
                                                <th className="px-6 py-5 bg-bg-light">Gender</th>
                                                <th className="px-6 py-5 bg-bg-light">Category</th>
                                                <th className="px-6 py-5 bg-bg-light text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border-muted/30">
                                            {residents.map((resident) => (
                                                <tr key={resident.id} className="group hover:bg-bg-main/50 transition-colors">
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-black uppercase italic tracking-tighter text-text">
                                                                {resident.last_name}, {resident.first_name} {resident.middle_initial}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-text-muted/60 uppercase">
                                                                {resident.gender} • {resident.civil_status} • {resident.is_household_type === '1' ? 'Head' : 'Member'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest bg-bg-main px-3 py-1 rounded-full border border-border-muted">
                                                            {resident.gender}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-wrap gap-1">
                                                            {resident.is_4ps && <span className="px-2 py-0.5 bg-success/10 text-success text-[8px] font-black rounded-md border border-success/20 uppercase">4Ps</span>}
                                                            {resident.is_pwd && <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded-md border border-primary/20 uppercase">PWD</span>}
                                                            {resident.is_solo_parent && <span className="px-2 py-0.5 bg-warning/10 text-warning text-[8px] font-black rounded-md border border-warning/20 uppercase">Solo</span>}
                                                            {resident.is_senior_citizen && <span className="px-2 py-0.5 bg-danger/10 text-danger text-[8px] font-black rounded-md border border-danger/20 uppercase">Senior</span>}
                                                            {!resident.is_4ps && !resident.is_pwd && !resident.is_solo_parent && !resident.is_senior_citizen && 
                                                                <span className="text-text-muted/40 text-[10px] font-bold italic tracking-tighter">Regular</span>
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button 
                                                                onClick={() => handleView(resident)}
                                                                className="p-2 text-text-muted hover:text-success transition-colors bg-bg-light rounded-xl border border-border-muted shadow-sm"
                                                                title="View Information"
                                                            >
                                                                <Icon iconName="FaEye" size={14} />
                                                            </button>
                                                            <button 
                                                                onClick={() => navigate(`/app/sitio/${id}/residents/${resident.id}/edit`)}
                                                                className="p-2 text-text-muted hover:text-primary transition-colors bg-bg-light rounded-xl border border-border-muted shadow-sm"
                                                                title="Edit"
                                                            >
                                                                <Icon iconName="FaPen" size={14} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteResident(resident.id)}
                                                                className="p-2 text-text-muted hover:text-danger transition-colors bg-bg-light rounded-xl border border-border-muted shadow-sm"
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

                                    {/* Loading / End Indicators inside scroll area */}
                                    <div className="p-10 flex flex-col items-center justify-center">
                                        {isFetchingMore ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <LoadingSpinner size="sm" color="text-primary" />
                                                <span className="text-[10px] font-black uppercase italic tracking-widest text-text-muted animate-pulse">Fetching more records...</span>
                                            </div>
                                        ) : !hasMore && residents.length > 0 ? (
                                            <div className="flex flex-col items-center gap-2 opacity-30">
                                                <Icon iconName="FaCheck" size={16} />
                                                <span className="text-[10px] font-black uppercase italic tracking-widest">End of database reached</span>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
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
