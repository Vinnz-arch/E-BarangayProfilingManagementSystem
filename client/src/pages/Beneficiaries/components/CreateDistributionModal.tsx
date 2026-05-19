import React, { useState } from 'react';
import { Icon, Button, LoadingSpinner } from "../../../components/ui";
import api from "../../../util/axios";
import { notify } from "../../../util/notify";

interface CreateDistributionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateDistributionModal: React.FC<CreateDistributionModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [title, setTitle] = useState("");
    const [targetGroup, setTargetGroup] = useState("senior_citizen");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/beneficiary-distributions', {
                title,
                target_group: targetGroup,
                distribution_date: date,
                location
            });
            notify.success("Distribution event scheduled successfully");
            onSuccess();
            onClose();
            // Reset
            setTitle("");
            setDate("");
            setLocation("");
        } catch (error) {
            notify.error("Failed to schedule distribution");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-light border border-border-muted w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text leading-none">
                                Schedule Distribution
                            </h2>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">
                                Beneficiary Aid Coordinator
                            </p>
                        </div>
                        <button type="button" onClick={onClose} className="p-3 text-text-muted hover:text-danger transition-colors bg-bg-main rounded-2xl border border-border-muted shadow-sm">
                            <Icon iconName="FaXmark" size={18} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">Event Title</label>
                            <input 
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm"
                                placeholder="e.g. Q3 Senior Citizen Payout"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">Target Beneficiaries</label>
                                <select 
                                    value={targetGroup}
                                    onChange={(e) => setTargetGroup(e.target.value)}
                                    className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm cursor-pointer"
                                >
                                    <option value="senior_citizen">Seniors</option>
                                    <option value="pwd">PWDs</option>
                                    <option value="4ps">4Ps Residents</option>
                                    <option value="solo_parent">Solo Parents</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">Date & Time</label>
                                <input 
                                    type="datetime-local"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">Location</label>
                            <input 
                                type="text"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm"
                                placeholder="e.g. Barangay Multipurpose Hall"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button variant="ghost" className="flex-1 rounded-2xl py-6 font-black uppercase italic" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 rounded-2xl py-6 font-black uppercase italic tracking-widest gap-2" disabled={isSubmitting}>
                            {isSubmitting ? <LoadingSpinner size="sm" color="text-white" /> : <><Icon iconName="FaCalendarCheck" /><span>Schedule</span></>}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};