import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MainLayout } from "../../components/layouts";
import { Button, LoadingSpinner, Icon } from "../../components/ui";
import { AddSitioModal } from "./components/AddSitioModal";
import { EditSitioModal } from "./components/EditSitioModal";
import { notify } from "../../util/notify";

interface SitioData {
    id: number;
    name: string;
    address: string;
    logo: string | null;
}

const Sitio = () => {
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSitio, setSelectedSitio] = useState<SitioData | null>(null);
    const [sitios, setSitios] = useState<SitioData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSitios = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/v1/sitios");
            setSitios(response.data);
        } catch (error) {
            console.error("Error fetching sitios:", error);
            notify.error("Failed to load sitios");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSitios();
    }, []);

    const handleEdit = (sitio: SitioData) => {
        setSelectedSitio(sitio);
        setIsEditModalOpen(true);
    };

    const handleViewResidents = (sitio: SitioData) => {
        navigate(`/app/sitio/${sitio.id}/residents`);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this sitio?")) return;

        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/v1/sitios/${id}`);
            notify.success(response.data.message || "Sitio deleted successfully");
            fetchSitios();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to delete sitio";
            notify.error(errorMessage);
        }
    };

    const content = (
        <div className="space-y-12 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-text">
                    Sitio
                </h1>
                <Button 
                    iconName="FaPlus" 
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Add Sitio
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <LoadingSpinner size="lg" text="Loading Sitios..." />
                </div>
            ) : sitios.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sitios.map((sitio) => (
                        <div 
                            key={sitio.id} 
                            className="bg-bg-light border border-border-muted rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group relative"
                        >
                            <div className="flex items-start gap-5">
                                <div 
                                    className="w-20 h-20 rounded-2xl bg-bg-main border border-border-muted flex items-center justify-center overflow-hidden shrink-0 shadow-inner cursor-pointer"
                                    onClick={() => handleViewResidents(sitio)}
                                >
                                    {sitio.logo ? (
                                        <img 
                                            src={`http://127.0.0.1:8000/storage/${sitio.logo}`} 
                                            alt={sitio.name} 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <Icon iconName="FaHouse" className="text-text-muted/30" size={32} />
                                    )}
                                </div>
                                <div className="space-y-1 flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 
                                            className="text-xl font-black uppercase italic tracking-tighter text-text group-hover:text-primary transition-colors cursor-pointer"
                                            onClick={() => handleViewResidents(sitio)}
                                        >
                                            {sitio.name}
                                        </h3>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEdit(sitio)}
                                                className="p-1.5 text-text-muted hover:text-primary transition-colors bg-bg-main rounded-lg border border-border-muted"
                                                title="Edit"
                                            >
                                                <Icon iconName="FaPen" size={12} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(sitio.id)}
                                                className="p-1.5 text-text-muted hover:text-danger transition-colors bg-bg-main rounded-lg border border-border-muted"
                                                title="Delete"
                                            >
                                                <Icon iconName="FaTrash" size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider leading-relaxed">
                                        {sitio.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-bg-light border border-border-muted rounded-3xl p-12 text-center shadow-sm">
                    <Icon iconName="FaFolderOpen" size={48} className="mx-auto mb-4 text-text-muted/20" />
                    <p className="text-text-muted italic text-sm uppercase tracking-widest font-black">
                        No sitio data found.
                    </p>
                </div>
            )}

            <AddSitioModal 
                isOpen={isAddModalOpen} 
                onClose={() => {
                    setIsAddModalOpen(false);
                    fetchSitios(); 
                }} 
            />

            <EditSitioModal 
                isOpen={isEditModalOpen}
                sitio={selectedSitio}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedSitio(null);
                    fetchSitios();
                }}
            />
        </div>
    );

    return <MainLayout content={content} />
} 

export default Sitio;
