import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../util/axios";
import { Button, Icon } from "../../components/ui";
import { notify } from "../../util/notify";
import { PATHS } from "../../routes/path";
import { ToastProvider } from "../../components/ui";

const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post("/login", formData);
            
            localStorage.setItem("token", response.data.access_token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            
            notify.success(`Welcome back, ${response.data.user.name}!`);
            navigate(PATHS.APP.DASHBOARD);
        } catch (error: any) {
            const message = error.response?.data?.message || "Invalid credentials";
            notify.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
            <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-bg-light border border-border-muted rounded-[3rem] shadow-2xl overflow-hidden relative z-10">
                
                {/* Visual Side */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-bg-dark text-bg-light relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-10 left-10 text-[12rem] font-black italic leading-none select-none">PMB</div>
                        <div className="absolute bottom-10 right-10 text-[12rem] font-black italic leading-none select-none">2026</div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <Icon iconName="FaMapLocationDot" className="text-bg-dark" size={20} />
                            </div>
                            <span className="text-xl font-black uppercase italic tracking-tighter">PeopleMap</span>
                        </div>
                        
                        <div className="space-y-6">
                            <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-[0.9]">
                                Manage Your <br />
                                <span className="text-primary">Community.</span>
                            </h1>
                            <p className="text-lg font-bold text-bg-light/60 uppercase tracking-widest max-w-md text-black">
                                The ultimate demographic mapping and resident management system for modern barangays.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-6">
                        <div className="flex -space-x-4">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-bg-dark bg-bg-light/10 flex items-center justify-center overflow-hidden">
                                    <Icon iconName="FaUser" size={20} className="text-bg-light/30" />
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] font-black uppercase italic tracking-widest text-indigo-900  text-bg-light/40">
                            Trusted by <br /> Local Officials
                        </p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 lg:p-20 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full space-y-10">
                        <div>
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-text leading-none">
                                Login to System
                            </h2>
                            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-3">
                                Enter your credentials to continue
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted ml-1">Email Address</label>
                                <div className="relative">
                                    <Icon iconName="FaEnvelope" className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                    <input 
                                        type="email" 
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="admin@barangay.gov"
                                        className="w-full bg-bg-main border border-border-muted rounded-2xl pl-14 pr-6 py-5 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/30"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end ml-1">
                                    <label className="text-[10px] font-black uppercase italic tracking-widest text-text-muted">Password</label>
                                </div>
                                <div className="relative">
                                    <Icon iconName="FaLock" className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                    <input 
                                        type="password" 
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        placeholder="••••••••••••"
                                        className="w-full bg-bg-main border border-border-muted rounded-2xl pl-14 pr-6 py-5 text-sm text-text font-bold tracking-tighter outline-none focus:border-primary transition-all placeholder:text-text-muted/30"
                                    />
                                </div>
                                <button type="button" className="text-[9px] font-black uppercase italic tracking-widest text-primary hover:underline">“Forgot your password? Contact your administrator.”</button>
                            </div>

                            <div className="pt-4">
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    fullWidth 
                                    isLoading={isLoading}
                                    loadingText="Authenticating..."
                                    className="py-5 text-base"
                                >
                                    Login to Dashboard
                                </Button>
                            </div>
                        </form>
                            <ToastProvider />
                        <div className="pt-8 text-center">
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                                PeopleMap Baranggay v2.0 &copy; 2026
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        
    );
};

export default Login;
