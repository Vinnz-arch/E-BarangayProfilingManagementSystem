import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '../../components/layouts';
import { LoadingSpinner, Icon, Button } from '../../components/ui';
import api from '../../util/axios';
import { notify } from '../../util/notify';

interface Announcement {
    id: number;
    title: string;
    content: string;
    category: string;
    created_at: string;
    author?: { name: string };
}

const Announcements: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("General");
    const [customCategory, setCustomCategory] = useState("");
    const [isCustom, setIsCustom] = useState(false);

    const fetchAnnouncements = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/announcements');
            setAnnouncements(response.data);
        } catch (error) {
            console.error("Error fetching announcements:", error);
            notify.error("Failed to load announcements");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const finalCategory = isCustom ? customCategory : category;
            await api.post('/announcements', { title, content, category: finalCategory });
            notify.success("Announcement published and broadcasted!");
            setIsModalOpen(false);
            setTitle("");
            setContent("");
            setCategory("General");
            setCustomCategory("");
            setIsCustom(false);
            fetchAnnouncements();
        } catch (error) {
            notify.error("Failed to publish announcement");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this announcement?")) return;
        try {
            await api.delete(`/announcements/${id}`);
            notify.success("Announcement deleted");
            fetchAnnouncements();
        } catch (error) {
            notify.error("Failed to delete announcement");
        }
    };

    const getCategoryStyles = (cat: string) => {
        switch (cat) {
            case 'Emergency': return 'bg-danger/10 text-danger border-danger/20';
            case 'Health': return 'bg-success/10 text-success border-success/20';
            case 'Event': return 'bg-primary/10 text-primary border-primary/20';
            case 'General': return 'bg-bg-main text-text-muted border-border-muted';
            default: return 'bg-primary/5 text-primary border-primary/10';
        }
    };

    const pageContent = (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter text-text leading-none">
                        Announcements
                    </h1>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">
                        Community Broadcasts & News
                    </p>
                </div>
                <Button iconName="FaBullhorn" onClick={() => setIsModalOpen(true)}>
                    New Announcement
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <LoadingSpinner size="lg" text="Syncing Community News..." />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {announcements.map((item) => (
                        <div key={item.id} className="bg-bg-light border border-border-muted rounded-[2.5rem] p-8 shadow-sm group hover:border-primary/30 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-3 py-1 border rounded-full text-[9px] font-black uppercase italic ${getCategoryStyles(item.category)}`}>
                                    {item.category}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-text-muted">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                    <button onClick={() => handleDelete(item.id)} className="text-text-muted hover:text-danger p-1">
                                        <Icon iconName="FaTrash" size={14} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-xl font-black italic tracking-tighter text-text mb-3">{item.title}</h3>
                            <p className="text-sm text-text-muted leading-relaxed line-clamp-4 mb-6">{item.content}</p>
                            <div className="flex items-center gap-2 pt-4 border-t border-border-muted/30">
                                <div className="w-6 h-6 rounded-full bg-bg-main flex items-center justify-center border border-border-muted">
                                    <Icon iconName="FaUser" size={10} className="text-text-muted" />
                                </div>
                                <span className="text-[10px] font-black uppercase italic tracking-widest text-text-muted">
                                    Posted by {item.author?.name || 'Admin'}
                                </span>
                            </div>
                        </div>
                    ))}
                    {announcements.length === 0 && (
                        <div className="md:col-span-2 bg-bg-light border border-border-muted rounded-[2.5rem] p-20 text-center shadow-sm">
                            <Icon iconName="FaBullhorn" size={64} className="mx-auto mb-6 text-text-muted/10 opacity-20" />
                            <p className="text-text-muted italic text-sm uppercase tracking-widest font-black">
                                No announcements have been posted yet.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-bg-light border border-border-muted w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-text leading-none">
                                        Create Announcement
                                    </h2>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">
                                        Broadcast to all resident emails
                                    </p>
                                </div>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="p-3 text-text-muted hover:text-danger transition-colors bg-bg-main rounded-2xl border border-border-muted">
                                    <Icon iconName="FaXmark" size={18} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">Title</label>
                                    <input 
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm"
                                        placeholder="Enter announcement title..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">Category</label>
                                    <div className="flex gap-2">
                                        <select 
                                            value={isCustom ? "Other" : category}
                                            onChange={(e) => {
                                                if (e.target.value === "Other") {
                                                    setIsCustom(true);
                                                } else {
                                                    setIsCustom(false);
                                                    setCategory(e.target.value);
                                                }
                                            }}
                                            className="grow bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm cursor-pointer"
                                        >
                                            <option value="General">General News</option>
                                            <option value="Health">Health Advisory</option>
                                            <option value="Emergency">Emergency Alert</option>
                                            <option value="Event">Community Event</option>
                                            <option value="Other">Other (Type New...)</option>
                                        </select>
                                        {isCustom && (
                                            <button 
                                                type="button"
                                                onClick={() => setIsCustom(false)}
                                                className="px-4 bg-bg-main border border-border-muted rounded-2xl text-text-muted hover:text-danger transition-colors"
                                                title="Cancel Custom"
                                            >
                                                <Icon iconName="FaXmark" size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {isCustom && (
                                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                        <label className="text-[10px] font-black uppercase italic tracking-widest text-primary px-2">Custom Category Name</label>
                                        <input 
                                            type="text"
                                            required
                                            value={customCategory}
                                            onChange={(e) => setCustomCategory(e.target.value)}
                                            className="w-full bg-bg-main border border-primary/30 rounded-2xl px-5 py-4 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm"
                                            placeholder="e.g. Youth Program, Senior Outing..."
                                        />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted px-2">Content</label>
                                    <textarea 
                                        required
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full bg-bg-main border border-border-muted rounded-2xl px-5 py-4 text-sm font-bold tracking-tighter outline-none focus:border-primary transition-all shadow-sm resize-none h-40"
                                        placeholder="Write your announcement details here..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button variant="ghost" className="flex-1 rounded-2xl py-6 font-black uppercase italic" onClick={() => setIsModalOpen(false)}>
                                    Discard
                                </Button>
                                <Button type="submit" className="flex-1 rounded-2xl py-6 font-black uppercase italic tracking-widest gap-2" disabled={isSubmitting}>
                                    {isSubmitting ? <LoadingSpinner size="sm" color="text-white" /> : <><Icon iconName="FaBullhorn" /><span>Publish & Broadcast</span></>}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    return <MainLayout content={pageContent} />;
};

export default Announcements;