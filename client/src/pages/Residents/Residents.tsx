import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../util/axios";
import { MainLayout } from "../../components/layouts";
import { Button, LoadingSpinner, Icon } from "../../components/ui";
import { ViewResidentModal } from "../sitio/components/ViewResidentModal";
import { ExportDocumentModal } from "./components/ExportDocumentModal";
import { notify } from "../../util/notify";

interface Sitio {
    id: number;
    name: string;
}

interface Resident {
  id: number;
  sitio_id: number;
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
  contact_number: string | null;
  email_address: string | null;
  is_4ps: boolean;
  is_pwd: boolean;
  is_solo_parent: boolean;
  is_senior_citizen: boolean;
  sitio: Sitio;
}

const Residents = () => {
    const navigate = useNavigate();
    const [residents, setResidents] = useState<Resident[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    
    // Pagination states
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalFound, setTotalFound] = useState(0);

    // Filter states
    const [sitioFilter, setSitioFilter] = useState<string>("all");
    const [programFilter, setProgramFilter] = useState<string>("all");
    const [sitios, setSitios] = useState<Sitio[]>([]);

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
            const currentPage = isInitial ? 1 : page;
            const params: any = {
                limit: isInitial ? 15 : 5, // Fetch 15 initially to ensure overflow, then 5 more each scroll
                page: currentPage,
                search: searchQuery || undefined,
                sitio_id: sitioFilter === "all" ? undefined : sitioFilter,
            };

            if (programFilter === "4ps") params.is_4ps = true;
            else if (programFilter === "pwd") params.is_pwd = true;
            else if (programFilter === "solo") params.is_solo_parent = true;
            else if (programFilter === "senior") params.is_senior_citizen = true;

            const response = await api.get("/residents", { params });
            
            const newResidents = response.data.data;
            if (isInitial) {
                setResidents(newResidents);
            } else {
                setResidents(prev => [...prev, ...newResidents]);
            }

            setTotalFound(response.data.total);
            setHasMore(response.data.current_page < response.data.last_page);
            setPage(response.data.current_page + 1);

            // Fetch sitios only if not already loaded
            if (sitios.length === 0) {
                const sitiosRes = await api.get("/sitios");
                setSitios(sitiosRes.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            notify.error("Failed to load residents");
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    }, [page, hasMore, isFetchingMore, searchQuery, sitioFilter, programFilter, sitios.length]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData(true);
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [searchQuery, sitioFilter, programFilter]);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        
        // Trigger when within 100px of bottom
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

    const handleEdit = (resident: Resident) => {
        navigate(`/app/sitio/${resident.sitio_id}/residents/${resident.id}/edit`);
    };

    const handleExportClick = (resident: Resident) => {
        setSelectedResident(resident);
        setIsExportModalOpen(true);
    };

    const handleDeleteResident = async (residentId: number) => {
        if (!window.confirm("Are you sure you want to delete this resident?")) return;

        try {
            await api.delete(`/residents/${residentId}`);
            notify.success("Resident deleted successfully");
            fetchData(true);
        } catch (error) {
            notify.error("Failed to delete resident");
        }
    };

    const content = (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter text-text leading-none">
                        Residents
                    </h1>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">
                        Global Resident Database
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Icon iconName="FaMagnifyingGlass" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search name..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-bg-light border border-border-muted rounded-2xl pl-10 pr-6 py-2.5 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all w-full md:w-64 shadow-sm"
                        />
                    </div>

                    {/* Sitio Filter */}
                    <select 
                        value={sitioFilter}
                        onChange={(e) => setSitioFilter(e.target.value)}
                        className="bg-bg-light border border-border-muted rounded-2xl px-4 py-2.5 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm cursor-pointer"
                    >
                        <option value="all">All Sitios</option>
                        {sitios.map(s => (
                            <option key={s.id} value={s.id.toString()}>{s.name}</option>
                        ))}
                    </select>

                    {/* Program Filter */}
                    <select 
                        value={programFilter}
                        onChange={(e) => setProgramFilter(e.target.value)}
                        className="bg-bg-light border border-border-muted rounded-2xl px-4 py-2.5 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm cursor-pointer"
                    >
                        <option value="all">All Programs</option>
                        <option value="4ps">4Ps Members</option>
                        <option value="pwd">PWD</option>
                        <option value="solo">Solo Parents</option>
                        <option value="senior">Seniors</option>
                    </select>
                </div>
            </div>

            <div className="space-y-6">
                {/* Summary Row */}
                <div className="flex items-center gap-4 text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">
                    <span className="text-primary">{totalFound} Residents Found</span>
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

                {isLoading && residents.length === 0 ? (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner size="lg" text="Syncing Database..." />
                    </div>
                ) : residents.length > 0 ? (
                    <div className="bg-bg-light border border-border-muted rounded-[2rem] overflow-hidden shadow-sm flex flex-col h-[550px]">
                        <div 
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="overflow-y-auto grow custom-scrollbar relative"
                        >
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead className="sticky top-0 z-20 bg-bg-light">
                                    <tr className="text-[10px] font-black uppercase italic tracking-widest text-text-muted shadow-[0_1px_0_0_oklch(var(--border-muted))]">
                                        <th className="px-6 py-5 bg-bg-light">Full Name</th>
                                        <th className="px-6 py-5 bg-bg-light">Sitio</th>
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
                                                        {resident.last_name}, {resident.first_name} {resident.middle_name}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-text-muted/60 uppercase">
                                                        {resident.gender} • {resident.civil_status} • {resident.is_household_type === '1' ? 'Head' : 'Member'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                                                    <span className="text-[10px] font-black uppercase italic tracking-tighter text-text">
                                                        {resident.sitio?.name}
                                                    </span>
                                                </div>
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
                                                        onClick={() => handleExportClick(resident)}
                                                        className="p-2 text-text-muted hover:text-primary transition-colors bg-bg-light rounded-xl border border-border-muted shadow-sm"
                                                        title="Export Documents"
                                                    >
                                                        <Icon iconName="FaFileExport" size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEdit(resident)}
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
                    <div className="bg-bg-light border border-border-muted rounded-[2rem] p-20 text-center shadow-sm">
                        <Icon iconName="FaUsersSlash" size={64} className="mx-auto mb-6 text-text-muted/10" />
                        <p className="text-text-muted italic text-sm uppercase tracking-widest font-black">
                            No residents found matching your current filters.
                        </p>
                        <Button variant="ghost" size="sm" className="mt-4" onClick={() => {setSearchQuery(""); setSitioFilter("all"); setProgramFilter("all");}}>
                            Clear All Filters
                        </Button>
                    </div>
                )}
            </div>

            <ViewResidentModal 
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedResident(null);
                }}
                resident={selectedResident}
                sitioName={selectedResident?.sitio?.name}
            />

            <ExportDocumentModal 
                isOpen={isExportModalOpen}
                onClose={() => {
                    setIsExportModalOpen(false);
                    setSelectedResident(null);
                }}
                resident={selectedResident}
            />
        </div>
    );

    return <MainLayout content={content} /> 
}

export default Residents