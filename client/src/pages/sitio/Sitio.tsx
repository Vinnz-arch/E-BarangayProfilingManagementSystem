import { useState } from "react";
import { MainLayout } from "../../components/layouts";
import { Button } from "../../components/ui";
import { AddSitioModal } from "./components/AddSitioModal";

const Sitio = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const content = (
        <div className="space-y-12 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-text">
                    Sitio
                </h1>
                <Button 
                    iconName="FaPlus" 
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Sitio
                </Button>
            </div>

            {/* Placeholder for Sitio list */}
            <div className="bg-bg-light border border-border-muted rounded-3xl p-8 shadow-sm">
                <p className="text-text-muted italic text-sm uppercase tracking-widest font-black">
                    Sitio data will be displayed here...
                </p>
            </div>

            <AddSitioModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
    
    return <MainLayout content={content} />
} 

export default Sitio;