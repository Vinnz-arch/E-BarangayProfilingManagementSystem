import React, { useState } from 'react';
import { Icon, Button, LoadingSpinner } from "../../../components/ui";
import api from "../../../util/axios";
import { notify } from "../../../util/notify";

interface Resident {
    id: number;
    last_name: string;
    first_name: string;
    middle_name: string;
}

interface ExportDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    resident: Resident | null;
}

type DocumentType = 'barangay-clearance' | 'business-clearance' | 'certificate-of-indigency';

export const ExportDocumentModal: React.FC<ExportDocumentModalProps> = ({ isOpen, onClose, resident }) => {
    const [docType, setDocType] = useState<DocumentType>('barangay-clearance');
    const [isExporting, setIsExporting] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    
    // Dynamic fields
    const [purpose, setPurpose] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [businessAddress, setBusinessAddress] = useState("");
    const [businessType, setBusinessType] = useState("");

    if (!isOpen || !resident) return null;

    const handleRegisterRequest = async () => {
        if (!purpose && docType !== 'business-clearance') {
            notify.error("Please provide a purpose");
            return;
        }

        setIsRegistering(true);
        try {
            await api.post('/document-requests', {
                resident_id: resident.id,
                document_type: docType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                purpose: docType === 'business-clearance' 
                    ? `Business Clearance for ${businessName} (${businessType}) at ${businessAddress}`
                    : purpose
            });

            notify.success("Document request registered successfully");
            onClose();
            
            // Reset fields
            setPurpose("");
            setBusinessName("");
            setBusinessAddress("");
            setBusinessType("");
        } catch (error) {
            console.error("Registration error:", error);
            notify.error("Failed to register document request");
        } finally {
            setIsRegistering(false);
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await api.post(`/residents/${resident.id}/export-document`, {
                type: docType,
                purpose,
                business_name: businessName,
                business_address: businessAddress,
                business_type: businessType
            }, {
                responseType: 'blob'
            });

            // Create a link and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${docType}-${resident.last_name}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            notify.success("Document generated successfully");
            onClose();
            
            // Reset fields
            setPurpose("");
            setBusinessName("");
            setBusinessAddress("");
            setBusinessType("");
        } catch (error) {
            console.error("Export error:", error);
            notify.error("Failed to generate document");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-light border border-border-muted w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-8 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text leading-none">
                                Export Document
                            </h2>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">
                                For {resident.first_name} {resident.last_name}
                            </p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-3 text-text-muted hover:text-danger transition-colors bg-bg-main rounded-2xl border border-border-muted shadow-sm"
                        >
                            <Icon iconName="FaXmark" size={18} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Doc Type Selection */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">Document Type</label>
                            <select 
                                value={docType}
                                onChange={(e) => setDocType(e.target.value as DocumentType)}
                                className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm cursor-pointer"
                            >
                                <option value="barangay-clearance">Barangay Clearance</option>
                                <option value="business-clearance">Business Clearance</option>
                                <option value="certificate-of-indigency">Certificate of Indigency</option>
                            </select>
                        </div>

                        {/* Purpose (for Clearance and Indigency) */}
                        {docType !== 'business-clearance' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">Purpose / Reason</label>
                                <textarea 
                                    placeholder="Enter purpose..."
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm resize-none h-24"
                                />
                            </div>
                        )}

                        {/* Business Fields */}
                        {docType === 'business-clearance' && (
                            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">Business Name</label>
                                    <input 
                                        type="text"
                                        placeholder="Enter business name..."
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">Business Type</label>
                                        <input 
                                            type="text"
                                            placeholder="e.g. Sari-sari Store"
                                            value={businessType}
                                            onChange={(e) => setBusinessType(e.target.value)}
                                            className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">Business Address</label>
                                        <input 
                                            type="text"
                                            placeholder="Enter address..."
                                            value={businessAddress}
                                            onChange={(e) => setBusinessAddress(e.target.value)}
                                            className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <div className="flex gap-3">
                            <Button 
                                variant="ghost" 
                                className="flex-1 rounded-2xl py-6 font-black uppercase italic"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 rounded-2xl py-6 font-black uppercase italic tracking-widest gap-2"
                                onClick={handleExport}
                                disabled={isExporting || isRegistering}
                            >
                                {isExporting ? (
                                    <>
                                        <LoadingSpinner size="sm" color="text-white" />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Icon iconName="FaFileExport" />
                                        <span>Generate PDF</span>
                                    </>
                                )}
                            </Button>
                        </div>
                        <Button 
                            variant="ghost"
                            className="w-full rounded-2xl py-6 font-black uppercase italic tracking-widest gap-2 border-primary/20 hover:bg-primary/5 text-primary"
                            onClick={handleRegisterRequest}
                            disabled={isExporting || isRegistering}
                        >
                            {isRegistering ? (
                                <>
                                    <LoadingSpinner size="sm" color="text-primary" />
                                    <span>Registering...</span>
                                </>
                            ) : (
                                <>
                                    <Icon iconName="FaCloudArrowUp" />
                                    <span>Register as Official Request</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
