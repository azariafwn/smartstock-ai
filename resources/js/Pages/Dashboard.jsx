import React from 'react';
import MainLayout from '../Layouts/MainLayout.jsx';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'; 
import { Head } from '@inertiajs/react';
import { Package, AlertTriangle, Clock, TrendingDown, Sparkles, Box, BrainCircuit, Zap, ChevronRight } from 'lucide-react';

export default function Dashboard({ summary, recentLogs, chartData }) {
    return (
        <MainLayout>
            <Head title="AI Command Center" />
            
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.3em]">Neural Interface</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">System Intelligence</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-100 dark:border-emerald-500/20 text-xs font-bold uppercase tracking-widest">
                        <Zap size={14} fill="currentColor" /> AI Core: Active
                    </div>
                    <div className="text-sm font-medium text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                </div>
            </header>            

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Inventory" value={summary.total_stock} icon={Package} color="blue" subtitle="Total Assets" />
                <StatCard title="Critical" value={summary.low_stock} icon={AlertTriangle} color="rose" subtitle="Needs Restock" />
                <StatCard title="Waitlist" value={summary.pending_requests} icon={Clock} color="amber" subtitle="Pending Approval" />
                <StatCard title="Deficit" value={summary.total_loss} icon={TrendingDown} color="indigo" subtitle="Damaged/Lost" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* AI Forecast Chart Section */}
                <div className="xl:col-span-2 space-y-6">
                    {/* NEW: AI Insight Briefing */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-1 rounded-[2rem] shadow-xl shadow-blue-500/20">
                        <div className="bg-white dark:bg-slate-900 rounded-[1.9rem] p-6 flex flex-col md:flex-row items-center gap-6">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                                <BrainCircuit size={32} />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-tight">AI Stock Analysis</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Based on the last 30 days, we project a <span className="text-blue-600 font-bold">12% increase</span> in demand for Electronic assets. Ensure min-thresholds are adjusted by next Monday.
                                </p>
                            </div>
                            <button className="px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shrink-0">
                                Run Re-Sync
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-600/10 rounded-2xl">
                                    <Sparkles className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Prediction Engine</h2>
                                    <p className="text-sm text-slate-400 font-medium tracking-wide">Flow Projection (Real vs Synthetic AI)</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            borderRadius: '20px', border: 'none', 
                                            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
                                            backgroundColor: '#0f172a', color: '#fff',
                                            fontSize: '12px', fontWeight: 'bold'
                                        }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={4} fill="url(#colorActual)" connectNulls />
                                    <Area type="monotone" dataKey="prediction" stroke="#8b5cf6" strokeWidth={4} strokeDasharray="10 10" fill="none" connectNulls />
                                    <ReferenceLine x={chartData.find(d => d.actual && d.prediction === null)?.date} stroke="#f43f5e" strokeDasharray="3 3" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold dark:text-white uppercase tracking-tight">Recent Flow</h2>
                        <span className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400">
                            <Clock size={16} />
                        </span>
                    </div>
                    <div className="flex-1 space-y-6">
                        {recentLogs.map((log) => (
                            <div key={log.id} className="flex items-center gap-4 group">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:rotate-12 ${
                                    log.category === 'sale' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-slate-50 text-slate-600 dark:bg-slate-800'
                                }`}>
                                    <Box size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 transition-colors">{log.product.name}</p>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{log.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-black ${log.type === 'IN' ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {log.type === 'IN' ? '+' : '-'}{log.quantity}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-bold">{new Date(log.created_at).toLocaleDateString('en-GB')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
                        View All Operations <ChevronRight size={14} />
                    </button>
                </div>
            </div>
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
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all duration-300 hover:-translate-y-2 group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-lg ${colorClasses[color]}`}>
                <Icon size={28} />
            </div>
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</h3>
            <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
                <p className="text-[10px] font-bold text-slate-400 truncate">{subtitle}</p>
            </div>
        </div>
    );
}