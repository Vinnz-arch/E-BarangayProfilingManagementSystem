import React, { useState, useEffect } from "react";
import { MainLayout } from "../../components/layouts";
import { Button } from "../../components/ui";
import { notify } from "../../util/notify";
import api from "../../util/axios"; // use configured axios

const DisasterReadiness = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [sitios, setSitios] = useState<{ id: number; name: string }[]>([]);
    const [formData, setFormData] = useState({
        alert_type: "Weather",
        severity: "Warning",
        target_sitio: "all",
        message: "",
    });

    useEffect(() => {
        const fetchSitios = async () => {
            try {
                const response = await api.get("/sitios");
                setSitios(response.data.data);
            } catch (error) {
                console.error("Failed to fetch sitios:", error);
            }
        };
        fetchSitios();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Send the request to our Laravel backend, which will then trigger n8n server-to-server
            // This completely avoids browser CORS issues.
            await api.post("/emergency-broadcast", formData);
            
            notify.success("Emergency broadcast sent successfully!");
            setFormData({
                alert_type: "Weather",
                severity: "Warning",
                target_sitio: "all",
                message: "",
            });
        } catch (error) {
            console.error("Error sending to n8n:", error);
            notify.error("Failed to send broadcast. Please check your n8n workflow.");
        } finally {
            setIsLoading(false);
        }
    };

    const content = (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text mb-2">Disaster Readiness & Alerts</h1>
                <p className="text-text-muted">Manually trigger emergency broadcasts to residents via n8n.</p>
            </div>

            <div className="bg-bg-main p-8 rounded-3xl shadow-lg border border-border">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-text uppercase tracking-wider">Alert Type</label>
                            <select
                                name="alert_type"
                                value={formData.alert_type}
                                onChange={handleChange}
                                className="p-4 rounded-2xl bg-bg-light border border-border-muted focus:border-primary outline-none text-text transition-all shadow-inner appearance-none cursor-pointer"
                            >
                                <option value="Weather">Severe Weather</option>
                                <option value="Fire">Fire Incident</option>
                                <option value="Flood">Flooding</option>
                                <option value="Medical">Medical Emergency</option>
                                <option value="Other">Other / General</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-text uppercase tracking-wider">Severity Level</label>
                            <select
                                name="severity"
                                value={formData.severity}
                                onChange={handleChange}
                                className="p-4 rounded-2xl bg-bg-light border border-border-muted focus:border-primary outline-none text-text transition-all shadow-inner appearance-none cursor-pointer"
                            >
                                <option value="Info">Info (Standard Advisory)</option>
                                <option value="Warning">Warning (Be Prepared)</option>
                                <option value="Critical">Critical (Evacuate / Immediate Action)</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-bold text-text uppercase tracking-wider">Target Location</label>
                            <select
                                name="target_sitio"
                                value={formData.target_sitio}
                                onChange={handleChange}
                                className="p-4 rounded-2xl bg-bg-light border border-border-muted focus:border-primary outline-none text-text transition-all shadow-inner appearance-none cursor-pointer"
                            >
                                <option value="all">Entire Barangay</option>
                                {sitios?.map(sitio => (
                                    <option key={sitio.id} value={sitio.id}>{sitio.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-bold text-text uppercase tracking-wider">Warning Message</label>
                            <textarea
                                required
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Enter the exact message to be broadcasted to residents..."
                                className="p-4 rounded-2xl bg-bg-light border border-border-muted focus:border-primary outline-none text-text transition-all shadow-inner resize-none"
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <Button 
                            type="submit" 
                            isLoading={isLoading}
                            fullWidth
                            size="lg"
                            variant="primary"
                            iconName="FaTowerBroadcast"
                        >
                            Broadcast Emergency Alert
                        </Button>
                    </div>
                </form>
            </div>

            <div className="mt-8 p-6 bg-info/10 border border-info/20 rounded-2xl">
                <p className="text-sm text-info font-medium leading-relaxed">
                    💡 <strong>Note:</strong> Submitting this form sends a webhook to n8n. You must configure an n8n workflow listening on <code>/webhook/emergency-broadcast</code> to catch this data and send the SMS/Emails.
                </p>
            </div>
        </div>
    );

    return <MainLayout content={content} />;
};

export default DisasterReadiness;