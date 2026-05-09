import { useState, useEffect } from "react";
import api from "../util/axios";
import { MainLayout } from "../components/layouts";
import { LoadingSpinner, Icon } from "../components/ui";
import { notify } from "../util/notify";

interface Resident {
  id: number;
  last_name: string;
  first_name: string;
  middle_initial: string;
  gender: string;
  is_household_type: string;
  is_4ps: boolean;
  is_pwd: boolean;
  is_solo_parent: boolean;
  is_senior_citizen: boolean;
  sitio?: { name: string };
  created_at: string;
}

interface Sitio {
    id: number;
    name: string;
}

const Dashboard = () => {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [sitios, setSitios] = useState<Sitio[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [residentsRes, sitiosRes] = await Promise.all([
                api.get("/residents"),
                api.get("/sitios")
            ]);
            setResidents(residentsRes.data);
            setSitios(sitiosRes.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            notify.error("Failed to load dashboard data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Calculate stats
    const stats = {
        totalResidents: residents.length,
        totalHouseholds: residents.filter(r => r.is_household_type === '1').length,
        totalSitios: sitios.length,
        pwd: residents.filter(r => r.is_pwd).length,
        solo: residents.filter(r => r.is_solo_parent).length,
        fourPs: residents.filter(r => r.is_4ps).length,
        senior: residents.filter(r => r.is_senior_citizen).length,
        male: residents.filter(r => r.gender === 'Male').length,
        female: residents.filter(r => r.gender === 'Female').length,
    };

    const recentResidents = [...residents]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

    const StatCard = ({ label, value, icon, colorClass }: any) => (
        <div className="bg-bg-light border border-border-muted rounded-[2.5rem] p-8 shadow-sm group hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors bg-bg-main text-${colorClass}`}>
                    <Icon iconName={icon} size={28} />
                </div>
                <div className="h-1 w-12 rounded-full bg-border-muted/30"></div>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase italic tracking-widest text-text-muted mb-1">
                    {label}
                </p>
                <h3 className="text-5xl font-black italic tracking-tighter text-text">
                    {value}
                </h3>
            </div>
        </div>
    );

    const MiniStat = ({ label, value, icon, colorClass }: any) => (
        <div className="flex items-center gap-4 p-4 bg-bg-main/50 rounded-2xl border border-border-muted/50">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-bg-light text-${colorClass} shadow-sm`}>
                <Icon iconName={icon} size={18} />
            </div>
            <div>
                <p className="text-[8px] font-black uppercase italic tracking-widest text-text-muted">{label}</p>
                <p className="text-lg font-black italic tracking-tighter text-text leading-tight">{value}</p>
            </div>
        </div>
    );

    const content = (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter text-text leading-none">
                        Dashboard
                    </h1>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-2">
                        System Overview & Population Analytics
                    </p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-bg-light border border-border-muted rounded-2xl shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase italic tracking-widest text-text">System Live</span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <LoadingSpinner size="lg" text="Generating Insights..." />
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Primary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StatCard label="Total Residents" value={stats.totalResidents} icon="FaUsers" colorClass="primary" />
                        <StatCard label="Total Households" value={stats.totalHouseholds} icon="FaHouseUser" colorClass="success" />
                        <StatCard label="Total Sitios" value={stats.totalSitios} icon="FaMapLocationDot" colorClass="warning" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Demographic Breakdown */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] w-12 bg-primary"></div>
                                <h2 className="text-xl font-black uppercase italic tracking-tighter text-text">
                                    Priority Sectors
                                </h2>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <MiniStat label="PWDs" value={stats.pwd} icon="FaWheelchair" colorClass="primary" />
                                <MiniStat label="4Ps Members" value={stats.fourPs} icon="FaIdCard" colorClass="success" />
                                <MiniStat label="Solo Parents" value={stats.solo} icon="FaUserGroup" colorClass="warning" />
                                <MiniStat label="Seniors" value={stats.senior} icon="FaPersonWalkingWithCane" colorClass="danger" />
                            </div>

                            <div className="bg-bg-light border border-border-muted rounded-[2rem] p-8 shadow-sm">
                                <p className="text-[10px] font-black uppercase italic tracking-widest text-text-muted mb-6">Gender Distribution</p>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase italic">
                                            <span className="text-primary">Male ({stats.male})</span>
                                            <span className="text-text-muted">{Math.round((stats.male / stats.totalResidents) * 100) || 0}%</span>
                                        </div>
                                        <div className="h-3 w-full bg-bg-main rounded-full overflow-hidden border border-border-muted/50">
                                            <div 
                                                className="h-full bg-primary transition-all duration-1000" 
                                                style={{ width: `${(stats.male / stats.totalResidents) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase italic">
                                            <span className="text-danger">Female ({stats.female})</span>
                                            <span className="text-text-muted">{Math.round((stats.female / stats.totalResidents) * 100) || 0}%</span>
                                        </div>
                                        <div className="h-3 w-full bg-bg-main rounded-full overflow-hidden border border-border-muted/50">
                                            <div 
                                                className="h-full bg-danger transition-all duration-1000" 
                                                style={{ width: `${(stats.female / stats.totalResidents) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] w-12 bg-success"></div>
                                <h2 className="text-xl font-black uppercase italic tracking-tighter text-text">
                                    Recently Registered
                                </h2>
                            </div>

                            <div className="bg-bg-light border border-border-muted rounded-[2.5rem] overflow-hidden shadow-sm">
                                <table className="w-full text-left border-separate border-spacing-0">
                                    <thead>
                                        <tr className="text-[10px] font-black uppercase italic tracking-widest text-text-muted bg-bg-main/30">
                                            <th className="px-6 py-5 border-b border-border-muted/50">Resident</th>
                                            <th className="px-6 py-5 border-b border-border-muted/50">Sitio</th>
                                            <th className="px-6 py-5 border-b border-border-muted/50 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-muted/30">
                                        {recentResidents.map((r) => (
                                            <tr key={r.id} className="group hover:bg-bg-main/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black uppercase italic tracking-tighter text-text">
                                                            {r.last_name}, {r.first_name}
                                                        </span>
                                                        <span className="text-[8px] font-bold text-text-muted uppercase">
                                                            {r.gender}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[10px] font-black uppercase italic tracking-tighter text-text">
                                                        {r.sitio?.name || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-[10px] font-bold text-text-muted">
                                                        {new Date(r.created_at).toLocaleDateString()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {recentResidents.length === 0 && (
                                    <div className="p-12 text-center">
                                        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">No recent records</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return <MainLayout content={content} />;
};

export default Dashboard;