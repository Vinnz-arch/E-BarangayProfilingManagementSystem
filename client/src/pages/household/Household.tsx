import { useState, useEffect, useRef, useCallback } from "react";
import api from "../../util/axios";
import { MainLayout } from "../../components/layouts";
import { LoadingSpinner, Icon, Button } from "../../components/ui";
import { ViewResidentModal } from "../sitio/components/ViewResidentModal";
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
  is_4ps: boolean;
  is_pwd: boolean;
  is_solo_parent: boolean;
  is_senior_citizen: boolean;
  sitio: Sitio;
}

const HouseHold = () => {
    const [heads, setHeads] = useState<Resident[]>([]);
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
            const currentPage = isInitial ? 1 : page;
            const params: any = {
                limit: isInitial ? 15 : 5,
                page: currentPage,
                search: searchQuery || undefined,
                is_household_type: '1', // Always filter by Head of Household
            };

            const response = await api.get("/residents", { params });
            
            const newHeads = response.data.data;
            if (isInitial) {
                setHeads(newHeads);
            } else {
                setHeads(prev => [...prev, ...newHeads]);
            }

            setTotalFound(response.data.total);
            setHasMore(response.data.current_page < response.data.last_page);
            setPage(response.data.current_page + 1);
        } catch (error) {
            console.error("Error fetching heads of household:", error);
            notify.error("Failed to load household data");
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    }, [page, hasMore, isFetchingMore, searchQuery]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData(true);
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [searchQuery]);

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

    const content = (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter text-text leading-none">
                        Households
                    </h1>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">
                        List of every registered Head of Household
                    </p>
                </div>

                <div className="relative">
                    <Icon iconName="FaMagnifyingGlass" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search household head..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-bg-light border border-border-muted rounded-2xl pl-10 pr-6 py-2.5 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all w-full md:w-80 shadow-sm"
                    />
                </div>
            </div>

            {isLoading && heads.length === 0 ? (
                <div className="flex justify-center py-20">
                    <LoadingSpinner size="lg" text="Fetching Households..." />
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">
                        <span className="text-primary">{totalFound} Households Found</span>
                        <div className="h-1 w-1 rounded-full bg-border-muted"></div>
                        {isLoading || isFetchingMore ? (
                            <div className="flex items-center gap-2">
                                <LoadingSpinner size="sm" color="text-primary" />
                                <span className="text-primary animate-pulse tracking-widest">Syncing...</span>
                            </div>
                        ) : (
                            <span>{hasMore ? "Scroll down to load more" : "Master Record of Families"}</span>
                        )}
                    </div>

                    {heads.length > 0 ? (
                        <div className="bg-bg-light border border-border-muted rounded-[2rem] overflow-hidden shadow-sm flex flex-col h-[550px]">
                            <div 
                                ref={scrollContainerRef}
                                onScroll={handleScroll}
                                className="overflow-y-auto grow custom-scrollbar relative"
                            >
                                <table className="w-full text-left border-separate border-spacing-0">
                                    <thead className="sticky top-0 z-20 bg-bg-light">
                                        <tr className="text-[10px] font-black uppercase italic tracking-widest text-text-muted shadow-[0_1px_0_0_oklch(var(--border-muted))]">
                                            <th className="px-6 py-5 bg-bg-light">Household Head</th>
                                            <th className="px-6 py-5 bg-bg-light">Sitio</th>
                                            <th className="px-6 py-5 bg-bg-light">Indicators</th>
                                            <th className="px-6 py-5 bg-bg-light text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-muted/30">
                                        {heads.map((head) => (
                                            <tr key={head.id} className="group hover:bg-bg-main/50 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black uppercase italic tracking-tighter text-text">
                                                            {head.last_name}, {head.first_name} {head.middle_name}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-text-muted/60 uppercase">
                                                            {head.gender} • {head.civil_status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-success/40"></div>
                                                        <span className="text-[10px] font-black uppercase italic tracking-tighter text-text">
                                                            Sitio {head.sitio?.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {head.is_4ps && (
                                                            <span className="px-2 py-0.5 bg-success/10 text-success text-[8px] font-black rounded-md border border-success/20 uppercase">4Ps</span>
                                                        )}
                                                        {head.is_senior_citizen && (
                                                            <span className="px-2 py-0.5 bg-danger/10 text-danger text-[8px] font-black rounded-md border border-danger/20 uppercase">Senior</span>
                                                        )}
                                                        {head.is_solo_parent && (
                                                            <span className="px-2 py-0.5 bg-warning/10 text-warning text-[8px] font-black rounded-md border border-warning/20 uppercase">Solo Parent</span>
                                                        )}
                                                        {!head.is_4ps && !head.is_senior_citizen && !head.is_solo_parent && (
                                                            <span className="text-text-muted/40 text-[10px] font-bold italic tracking-tighter">Regular</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <Button 
                                                        variant="primary" 
                                                        size="sm" 
                                                        iconName="FaEye"
                                                        className="rounded-xl px-4"
                                                        onClick={() => handleView(head)}
                                                    >
                                                        View Details
                                                    </Button>
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
                                    ) : !hasMore && heads.length > 0 ? (
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
                            <Icon iconName="FaHouseUser" size={64} className="mx-auto mb-6 text-text-muted/10" />
                            <p className="text-text-muted italic text-sm uppercase tracking-widest font-black">
                                {searchQuery ? "No matching households found." : "No Head of Households found."}
                            </p>
                        </div>
                    )}
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

export default HouseHold;
