import React, { useState } from 'react'; // Tambahkan useState
import MainLayout from '../Layouts/MainLayout.jsx';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'; 
import { Head, router } from '@inertiajs/react';
import { Package, AlertTriangle, Clock, TrendingDown, Sparkles, Box, BrainCircuit, Zap, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Dashboard({ auth, summary, recentLogs, chartData, products, selectedProductId, aiBriefing }) {
    const [isSyncing, setIsSyncing] = useState(false);

    // Fungsi untuk trigger re-sync data AI dengan Notifikasi
    const handleResync = () => {
        setIsSyncing(true);
        router.reload({ 
            only: ['aiBriefing', 'chartData'],
            onSuccess: () => {
                setIsSyncing(false);
                // Notifikasi sederhana menggunakan alert browser atau Anda bisa ganti dengan library toast
                console.log("Neural link synchronized.");
            },
            onFinish: () => setIsSyncing(false)
        });
    };

    // Fungsi untuk ganti produk yang dianalisis
    const handleProductChange = (e) => {
        router.get('/dashboard', { product_id: e.target.value }, { 
            preserveState: true,
            preserveScroll: true 
        });
    };

    // Custom Tick untuk membedakan warna tanggal Forecast di sumbu X
    const CustomXAxisTick = ({ x, y, payload, index }) => {
        const isTarget = index === chartData.length - 1;

        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="middle"
                    fill={isTarget ? "#8b5cf6" : "#94a3b8"}
                    fontSize={10}
                    fontWeight={isTarget ? "900" : "bold"}
                >
                    {payload.value}
                </text>
            </g>
        );
    };

    return (
        <MainLayout>
            <Head title="AI Command Center" />
            
            <header className="mb-4 md:mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-6 md:w-8 bg-blue-600 rounded-full"></div>
                        <span className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-[0.3em]">Neural Interface</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">System Intelligence</h1>
                    <p className="text-xs md:text-sm text-slate-400 font-medium">Real-time neural analytics engine.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* DROPDOWN SELECTOR */}
                    <div className="relative group">
                        <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={14} />
                        <select 
                            value={selectedProductId}
                            onChange={handleProductChange}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-9 pr-10 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider outline-none focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white appearance-none cursor-pointer min-w-[160px]"
                        >
                            {products && products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={12} />
                    </div>

                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-100 dark:border-emerald-500/20 text-xs xl:text-[10px] font-bold uppercase tracking-widest">
                        <Zap size={12} fill="currentColor" /> AI Active
                    </div>
                    <div className="text-xs xl:text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                </div>
            </header>            

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5 mb-6 md:mb-8">
                <StatCard title="Inventory" value={summary.total_stock} icon={Package} color="blue" subtitle="Assets" />
                <StatCard title="Critical" value={summary.low_stock} icon={AlertTriangle} color="rose" subtitle="Restock" />
                <StatCard title="Waitlist" value={summary.pending_requests} icon={Clock} color="amber" subtitle="Pending" />
                <StatCard title="Deficit" value={summary.total_loss} icon={TrendingDown} color="indigo" subtitle="Loss" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
                <div className="xl:col-span-2 space-y-5">
                    
                    {/* AI Briefing with Dynamic Sync State */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-0.5 rounded-2xl xl:rounded-3xl shadow-lg shadow-blue-500/10">
                        <div className="bg-white dark:bg-slate-900 rounded-[0.9rem] xl:rounded-[1.4rem] p-4 xl:p-4 flex flex-col md:flex-row items-center gap-4">
                            <div className="flex items-center w-full md:w-auto gap-3">
                                <div className="w-12 h-12 xl:w-12 xl:h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                    {isSyncing ? <Loader2 size={24} className="animate-spin" /> : <BrainCircuit size={24} />}
                                </div>
                                <div className="md:hidden">
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase">AI Analysis</h3>
                                </div>
                            </div>
                            
                            <div className="flex-1 text-left">
                                <h3 className="hidden md:block text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight mb-0.5">AI Stock Analysis</h3>
                                <p className="text-xs xl:text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                    {isSyncing ? "Neural Engine is processing latest movements..." : (aiBriefing || "Neural link active. Data synchronized.")}
                                </p>
                            </div>
                            
                            <button 
                                onClick={handleResync}
                                disabled={isSyncing}
                                className="w-full md:w-auto px-4 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg font-bold text-xs xl:text-[9px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSyncing ? <Loader2 size={12} className="animate-spin" /> : null}
                                {isSyncing ? "Syncing..." : "Re-Sync"}
                            </button>
                        </div>
                    </div>

                    {/* Stock Forecasting Card */}
                    <div className="bg-white dark:bg-slate-900 p-5 xl:p-6 rounded-2xl xl:rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 xl:mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600/10 rounded-xl">
                                    <Sparkles className="text-blue-600" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg xl:text-lg font-bold text-slate-800 dark:text-white uppercase tracking-tight">Stock Forecasting</h2>
                                    <p className="text-xs xl:text-[11px] text-slate-400 font-medium tracking-wide italic">Neural-Network Inventory Projection</p>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap gap-x-4 gap-y-2 px-1">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-1 bg-blue-500 rounded-full"></div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Stock</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-1 bg-rose-500 border-t border-dashed border-rose-500"></div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Safety Threshold</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-1 bg-purple-500 border-t border-dashed border-purple-500"></div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Restock Goal</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full overflow-x-auto no-scrollbar">
                            <div className="h-[250px] md:h-[280px] min-w-[600px] md:min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                                        <XAxis 
                                            dataKey="date" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={<CustomXAxisTick />} 
                                            dy={10} 
                                        />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                                        
                                        <ReferenceLine 
                                            y={summary.min_threshold || 15} 
                                            stroke="#f43f5e" 
                                            strokeDasharray="4 4"
                                            strokeWidth={2}
                                            label={{ value: 'LIMIT', fill: '#f43f5e', fontSize: 9, fontWeight: '900', position: 'right', dx: -10 }} 
                                        />
                                        
                                        <ReferenceLine 
                                            x={chartData[chartData.length - 1]?.date} 
                                            stroke="#8b5cf6" 
                                            strokeWidth={2}
                                            strokeDasharray="4 4"
                                            label={{ value: 'RESTOCK POINT', fill: '#8b5cf6', fontSize: 9, fontWeight: '900', position: 'top' }} 
                                        />

                                        <Tooltip 
                                            formatter={(value, name) => [value, name === 'actual' ? 'Live Inventory' : 'AI Predicted']}
                                            contentStyle={{ 
                                                borderRadius: '15px', border: 'none', 
                                                boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.5)',
                                                backgroundColor: '#0f172a', color: '#fff',
                                                fontSize: '12px'
                                            }}
                                        />
                                        <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} fill="url(#colorActual)" connectNulls animationDuration={1500} />
                                        <Area type="monotone" dataKey="prediction" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="8 8" fill="none" connectNulls animationDuration={2000} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white dark:bg-slate-900 p-6 xl:p-6 rounded-2xl xl:rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col xl:h-full xl:max-h-[500px]">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg xl:text-lg font-bold dark:text-white uppercase tracking-tight">Recent Flow</h2>
                        <span className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400">
                            <Clock size={14} />
                        </span>
                    </div>
                    <div className="flex-1 space-y-5 xl:space-y-4 overflow-y-auto no-scrollbar pr-1">
                        {recentLogs.map((log) => (
                            <div key={log.id} className="flex items-center gap-3 group">
                                <div className={`w-11 h-11 xl:w-10 xl:h-10 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:rotate-12 ${
                                    log.category === 'sale' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-slate-50 text-slate-600 dark:bg-slate-800'
                                }`}>
                                    <Box size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm xl:text-sm text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 transition-colors">{log.product.name}</p>
                                    <p className="text-[10px] xl:text-[9px] text-slate-400 font-black uppercase tracking-widest">{log.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-black text-sm ${log.type === 'IN' ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {log.type === 'IN' ? '+' : '-'}{log.quantity}
                                    </p>
                                    <p className="text-[10px] xl:text-[9px] text-slate-400 font-bold">{new Date(log.created_at).toLocaleDateString('en-GB')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link 
                        href="/reports" 
                        className="w-full mt-6 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-xs xl:text-[10px] uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        View All <ChevronRight size={14} />
                    </Link>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </MainLayout>
    );
}

function StatCard({ title, value, icon: Icon, color, subtitle }) {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 shadow-blue-500/10',
        rose: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 shadow-rose-500/10',
        amber: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 shadow-amber-500/10',
        indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 shadow-indigo-500/10',
    };
    
    return (
        <div className="bg-white dark:bg-slate-900 p-5 xl:p-5 rounded-3xl xl:rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all duration-300 hover:-translate-y-1 group">
            <div className={`w-11 h-11 xl:w-11 xl:h-11 rounded-xl flex items-center justify-center mb-4 xl:mb-3 transition-transform group-hover:scale-110 shadow-md ${colorClasses[color]}`}>
                <Icon size={22} className="xl:w-6 xl:h-6" />
            </div>
            <h3 className="text-[10px] xl:text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1 xl:mb-0.5 truncate">{title}</h3>
            <div className="flex items-baseline gap-2">
                <p className="text-2xl xl:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
                <p className="text-[10px] xl:text-[9px] font-bold text-slate-400 truncate">{subtitle}</p>
            </div>
        </div>
    );
}