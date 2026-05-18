import React, { useState } from 'react';
import { Icon, Button, LoadingSpinner } from "../../../components/ui";
import api from "../../../util/axios";
import { notify } from "../../../util/notify";

interface DocumentRequest {
    id: number;
    status: string;
    remarks: string | null;
    document_type: string;
}

interface UpdateStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: DocumentRequest | null;
    onSuccess: () => void;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ isOpen, onClose, request, onSuccess }) => {
    const [status, setStatus] = useState(request?.status || "Pending");
    const [remarks, setRemarks] = useState(request?.remarks || "");
    const [isUpdating, setIsUpdating] = useState(false);

    React.useEffect(() => {
        if (request) {
            setStatus(request.status);
            setRemarks(request.remarks || "");
        }
    }, [request]);

    if (!isOpen || !request) return null;

    const handleUpdate = async () => {
        setIsUpdating(true);
        try {
            await api.patch(`/document-requests/${request.id}/status`, {
                status,
                remarks: remarks || null
            });
            notify.success("Status updated successfully");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Update error:", error);
            notify.error("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-light border border-border-muted w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-8 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text leading-none">
                                Update Status
                            </h2>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">
                                {request.document_type}
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
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">New Status</label>
                            <select 
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm cursor-pointer"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Ready for Pickup">Ready for Pickup</option>
                                <option value="Claimed">Claimed</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">Remarks / Note (Optional)</label>
                            <textarea 
                                placeholder="Enter any remarks..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm resize-none h-24"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button 
                            variant="ghost" 
                            className="flex-1 rounded-2xl py-6 font-black uppercase italic"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="flex-1 rounded-2xl py-6 font-black uppercase italic tracking-widest gap-2"
                            onClick={handleUpdate}
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <>
                                    <LoadingSpinner size="sm" color="text-white" />
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <Icon iconName="FaCheck" />
                                    <span>Confirm</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};