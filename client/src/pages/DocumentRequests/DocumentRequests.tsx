import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '../../components/layouts';
import { LoadingSpinner, Icon, Button } from '../../components/ui';
import api from '../../util/axios';
import { notify } from '../../util/notify';
import { UpdateStatusModal } from './components/UpdateStatusModal';

interface Resident {
    id: number;
    first_name: string;
    last_name: string;
    sitio?: { name: string };
}

interface DocumentRequest {
    id: number;
    resident_id: number;
    document_type: string;
    purpose: string;
    status: string;
    tracking_number: string;
    remarks: string | null;
    created_at: string;
    resident: Resident;
}

const DocumentRequests: React.FC = () => {
    const [requests, setRequests] = useState<DocumentRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/document-requests');
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
            notify.error("Failed to load document requests");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleUpdateStatus = (request: DocumentRequest) => {
        setSelectedRequest(request);
        setIsUpdateModalOpen(true);
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = 
            req.resident.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.resident.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.tracking_number.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || req.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-warning/10 text-warning border-warning/20';
            case 'Processing': return 'bg-primary/10 text-primary border-primary/20';
            case 'Ready for Pickup': return 'bg-success/10 text-success border-success/20';
            case 'Claimed': return 'bg-bg-main text-text-muted border-border-muted';
            case 'Rejected': return 'bg-danger/10 text-danger border-danger/20';
            default: return 'bg-bg-main text-text';
        }
    };

    const content = (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter text-text leading-none">
                        Document Requests
                    </h1>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">
                        Application Queue & Notification System
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                        <Icon iconName="FaMagnifyingGlass" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search resident or tracking #..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-bg-light border border-border-muted rounded-2xl pl-10 pr-6 py-2.5 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all w-full md:w-80 shadow-sm"
                        />
                    </div>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-bg-light border border-border-muted rounded-2xl px-4 py-2.5 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Ready for Pickup">Ready for Pickup</option>
                        <option value="Claimed">Claimed</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <LoadingSpinner size="lg" text="Syncing Application Queue..." />
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">
                        <span className="text-primary">{filteredRequests.length} Requests Found</span>
                        <div className="h-1 w-1 rounded-full bg-border-muted"></div>
                        <span>Database up to date</span>
                    </div>

                    {filteredRequests.length > 0 ? (
                        <div className="bg-bg-light border border-border-muted rounded-[2.5rem] overflow-hidden shadow-sm">
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase italic tracking-widest text-text-muted bg-bg-main/30">
                                        <th className="px-6 py-5 border-b border-border-muted/50">Tracking # & Date</th>
                                        <th className="px-6 py-5 border-b border-border-muted/50">Resident</th>
                                        <th className="px-6 py-5 border-b border-border-muted/50">Document Type</th>
                                        <th className="px-6 py-5 border-b border-border-muted/50">Status</th>
                                        <th className="px-6 py-5 border-b border-border-muted/50 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-muted/30">
                                    {filteredRequests.map((req) => (
                                        <tr key={req.id} className="group hover:bg-bg-main/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase italic tracking-tighter text-primary">
                                                        {req.tracking_number}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-text-muted uppercase">
                                                        {new Date(req.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black uppercase italic tracking-tighter text-text">
                                                        {req.resident.last_name}, {req.resident.first_name}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-text-muted/60 uppercase">
                                                        {req.resident.sitio?.name || "No Sitio"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-[10px] font-black uppercase italic tracking-tighter text-text">
                                                    {req.document_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 border rounded-full text-[9px] font-black uppercase italic ${getStatusColor(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button 
                                                    onClick={() => handleUpdateStatus(req)}
                                                    className="p-3 text-text-muted hover:text-primary transition-colors bg-bg-light rounded-2xl border border-border-muted shadow-sm"
                                                    title="Update Status"
                                                >
                                                    <Icon iconName="FaArrowRotateRight" size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-bg-light border border-border-muted rounded-[2rem] p-20 text-center shadow-sm">
                            <Icon iconName="FaFileCircleExclamation" size={64} className="mx-auto mb-6 text-text-muted/10" />
                            <p className="text-text-muted italic text-sm uppercase tracking-widest font-black">
                                No document requests found matching your filters.
                            </p>
                        </div>
                    )}
                </div>
            )}

            <UpdateStatusModal 
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedRequest(null);
                }}
                request={selectedRequest}
                onSuccess={fetchRequests}
            />
        </div>
    );

    return <MainLayout content={content} />;
};

export default DocumentRequests;