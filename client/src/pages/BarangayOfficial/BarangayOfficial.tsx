import { useState, useEffect } from "react";
import axios from "axios";
import { MainLayout } from "../../components/layouts";
import { LoadingSpinner, Icon, Button } from "../../components/ui";
import { notify } from "../../util/notify";
import { AddOfficialModal } from "./components/AddOfficialModal";
import { EditOfficialModal } from "./components/EditOfficialModal";

interface Official {
    id: number;
    name: string;
    position: string;
    term: string;
    image: string | null;
    display_order: number;
    is_active: boolean;
}

const BarangayOfficial = () => {
    const [officials, setOfficials] = useState<Official[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(null);

    const fetchOfficials = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/v1/officials");
            setOfficials(response.data);
        } catch (error) {
            console.error("Error fetching officials:", error);
            notify.error("Failed to load barangay officials");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOfficials();
    }, []);

    const handleEdit = (official: Official) => {
        setSelectedOfficial(official);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to remove this official?")) return;

        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/officials/${id}`);
            notify.success("Official removed successfully");
            fetchOfficials();
        } catch (error) {
            notify.error("Failed to remove official");
        }
    };

    const filteredOfficials = officials.filter(o => 
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        o.position.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const captain = officials.find(o => o.position === "Punong Barangay");
    const others = filteredOfficials.filter(o => o.position !== "Punong Barangay");

    const OfficialCard = ({ official, featured = false }: { official: Official, featured?: boolean }) => (
        <div className={`bg-bg-light border border-border-muted rounded-[2.5rem] p-8 shadow-sm group hover:border-primary/30 transition-all duration-300 relative overflow-hidden ${featured ? 'md:col-span-2 lg:col-span-3 border-primary/20' : ''}`}>
            {featured && (
                <div className="absolute top-0 right-0 px-6 py-2 bg-primary text-bg-dark text-[10px] font-black uppercase italic tracking-widest rounded-bl-3xl">
                    Barangay Head
                </div>
            )}
            
            <div className={`flex flex-col ${featured ? 'md:flex-row' : ''} gap-8 items-center`}>
                {/* Photo Placeholder */}
                <div className={`${featured ? 'w-48 h-48' : 'w-32 h-32'} rounded-3xl bg-bg-main border border-border-muted flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:border-primary/30 transition-colors`}>
                    {official.image ? (
                        <img 
                            src={`http://127.0.0.1:8000/storage/${official.image}`} 
                            alt={official.name} 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <Icon iconName="FaUser" className="text-text-muted/20" size={featured ? 64 : 48} />
                    )}
                </div>

                <div className={`space-y-4 text-center ${featured ? 'md:text-left' : ''} grow`}>
                    <div>
                        <p className={`text-primary font-black uppercase italic tracking-widest mb-1 ${featured ? 'text-xs' : 'text-[10px]'}`}>
                            {official.position}
                        </p>
                        <h3 className={`${featured ? 'text-3xl' : 'text-xl'} font-black italic tracking-tighter text-text leading-tight`}>
                            {official.name}
                        </h3>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                            <Icon iconName="FaCalendarDays" size={12} className="text-text-muted/60" />
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                {official.term}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        <span className="px-3 py-1 bg-bg-main border border-border-muted rounded-full text-[9px] font-black uppercase italic text-text-muted">
                            {official.is_active ? 'Active Status' : 'Inactive'}
                        </span>
                        {featured && (
                            <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black uppercase italic text-primary">
                                Presiding Officer
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-2">
                    <button 
                        onClick={() => handleEdit(official)}
                        className="p-3 text-text-muted hover:text-primary transition-colors bg-bg-main rounded-2xl border border-border-muted"
                        title="Edit Information"
                    >
                        <Icon iconName="FaPen" size={16} />
                    </button>
                    <button 
                        onClick={() => handleDelete(official.id)}
                        className="p-3 text-text-muted hover:text-danger transition-colors bg-bg-main rounded-2xl border border-border-muted"
                        title="Remove Official"
                    >
                        <Icon iconName="FaTrash" size={16} />
                    </button>
                </div>
            </div>
        </div>
    );

    const content = (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter text-text leading-none">
                        Barangay Officials
                    </h1>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">
                        Public Servants & Local Governance
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                        <Icon iconName="FaMagnifyingGlass" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search by name or position..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-bg-light border border-border-muted rounded-2xl pl-10 pr-6 py-2.5 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all w-full md:w-80 shadow-sm"
                        />
                    </div>
                    <Button iconName="FaUserPlus" size="sm" onClick={() => setIsAddModalOpen(true)}>
                        Add Official
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <LoadingSpinner size="lg" text="Syncing Council Data..." />
                </div>
            ) : (
                <div className="space-y-16">
                    {/* Featured: Punong Barangay */}
                    {captain && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] w-12 bg-primary"></div>
                                <h2 className="text-xl font-black uppercase italic tracking-tighter text-text">
                                    Highest Ranking Official
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                <OfficialCard official={captain} featured />
                            </div>
                        </div>
                    )}

                    {/* Grid: Kagawads and Others */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="h-[2px] w-12 bg-border-muted"></div>
                            <h2 className="text-xl font-black uppercase italic tracking-tighter text-text">
                                Barangay Council & Staff
                            </h2>
                        </div>
                        
                        {others.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {others.map((official) => (
                                    <OfficialCard key={official.id} official={official} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-bg-light border border-border-muted rounded-[2rem] p-20 text-center shadow-sm">
                                <Icon iconName="FaUsersSlash" size={64} className="mx-auto mb-6 text-text-muted/10" />
                                <p className="text-text-muted italic text-sm uppercase tracking-widest font-black">
                                    No officials match your search query.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <AddOfficialModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchOfficials}
            />

            <EditOfficialModal 
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedOfficial(null);
                }}
                onSuccess={fetchOfficials}
                official={selectedOfficial}
            />
        </div>
    );

    return <MainLayout content={content} />
}

export default BarangayOfficial;