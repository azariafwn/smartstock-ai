import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { 
    FileText, Filter, Calendar, Layers, 
    Download, RotateCcw, Search, ChevronRight,
    FileSpreadsheet, FileDown, User, Clock
} from 'lucide-react';

export default function Reports({ reports, filters }) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        category: filters.category || '',
    });

    const handleExport = (format) => {
        const params = new URLSearchParams({
            format: format,
            start_date: data.start_date,
            end_date: data.end_date,
            category: data.category
        }).toString();

        window.open(`/reports/export?${params}`, '_blank');
    };

    const handleFilter = (e) => {
        e.preventDefault();
        get('/reports', {
            preserveState: true,
            replace: true
        });
    };

    const resetFilter = () => {
        router.get('/reports');
    };

    return (
        <MainLayout>
            <Head title="Data Intelligence Reports" />
            
            {/* --- STANDARDIZED HEADER --- */}
            <header className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                        <span className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-[0.3em]">Historical Analysis</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Audit Reports</h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Deep dive into stock movement patterns.</p>
                </div>
                
                <div className="flex gap-2 md:gap-3 bg-white dark:bg-slate-900 p-1 md:p-1.5 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm self-start md:self-auto">
                    <button 
                        onClick={() => handleExport('excel')}
                        className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-3 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg md:rounded-xl transition-all font-bold text-[10px] md:text-sm uppercase"
                    >
                        <FileSpreadsheet size={16} /> <span className="hidden md:inline">Excel</span>
                    </button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 self-center"></div>
                    <button 
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg md:rounded-xl transition-all font-bold text-[10px] md:text-sm uppercase"
                    >
                        <FileDown size={16} /> <span className="hidden md:inline">PDF</span>
                    </button>
                </div>
            </header>

            {/* --- QUERY ENGINE (FILTER) --- */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 mb-8 md:mb-10">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <Filter className="text-blue-600" size={18} />
                    <h2 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">Query Engine</h2>
                </div>
                
                <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase ml-2">Timeline Start</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input type="date" className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-xs md:text-sm" value={data.start_date} onChange={e => setData('start_date', e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase ml-2">Timeline End</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input type="date" className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-xs md:text-sm" value={data.end_date} onChange={e => setData('end_date', e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase ml-2">Asset Category</label>
                        <div className="relative">
                            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <select className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-xs md:text-sm appearance-none font-medium" value={data.category} onChange={e => setData('category', e.target.value)}>
                                <option value="">Global View</option>
                                <option value="sale">Sale</option>
                                <option value="distributed">Distributed</option>
                                <option value="damaged">Damaged</option>
                                <option value="lost">Lost</option>
                                <option value="restock">Restock</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" disabled={processing} className="flex-1 bg-blue-600 text-white py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                            Execute
                        </button>
                        <button type="button" onClick={resetFilter} className="p-2.5 md:p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl md:rounded-2xl hover:bg-slate-200 transition-all">
                            <RotateCcw size={16} />
                        </button>
                    </div>
                </form>
            </div>

            {/* --- DATA FEED SECTION --- */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                
                {/* Desktop View Table (Hidden on Mobile) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <th className="p-6">Timestamp</th>
                                <th className="p-6">Resource</th>
                                <th className="p-6">Operator</th>
                                <th className="p-6 text-center">Class</th>
                                <th className="p-6 text-right pr-10">Delta</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <Search size={40} className="text-slate-200 mb-4" />
                                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No matching logs found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                                                <Clock size={12} className="text-blue-500" />
                                                {new Date(report.created_at).toLocaleDateString('en-GB')}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="font-black text-slate-800 dark:text-slate-200 tracking-tight">{report.product?.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{report.product?.sku}</p>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                                                <User size={12} /> {report.user?.name}
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <CategoryBadge category={report.category} />
                                        </td>
                                        <td className={`p-6 text-right pr-10 font-black text-lg ${report.type === 'IN' ? 'text-emerald-500' : 'text-blue-500'}`}>
                                            {report.type === 'IN' ? '+' : '-'}{report.quantity}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View List (Hidden on Laptop, No Scroll Horizontal) */}
                <div className="md:hidden divide-y divide-slate-50 dark:divide-slate-800">
                    {reports.length === 0 ? (
                        <div className="py-12 px-6 text-center">
                            <Search size={32} className="mx-auto text-slate-200 mb-3" />
                            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">No logs found</p>
                        </div>
                    ) : (
                        reports.map((report) => (
                            <div key={report.id} className="p-5 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="min-w-0">
                                        <p className="font-black text-slate-800 dark:text-white text-sm truncate uppercase tracking-tight">{report.product?.name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{report.product?.sku}</p>
                                    </div>
                                    <div className={`text-lg font-black ${report.type === 'IN' ? 'text-emerald-500' : 'text-blue-500'}`}>
                                        {report.type === 'IN' ? '+' : '-'}{report.quantity}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock size={10} />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">
                                                {new Date(report.created_at).toLocaleDateString('en-GB')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                            <User size={10} />
                                            <span className="text-[10px] font-bold">{report.user?.name}</span>
                                        </div>
                                    </div>
                                    <CategoryBadge category={report.category} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

// Helper Badge Component
function CategoryBadge({ category }) {
    const styles = {
        sale: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10',
        damaged: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10',
        restock: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
        distributed: 'bg-slate-100 text-slate-600 dark:bg-slate-800',
        lost: 'bg-slate-100 text-slate-600 dark:bg-slate-800'
    };

    return (
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${styles[category] || styles.distributed}`}>
            {category}
        </span>
    );
}