import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { 
    FileText, Filter, Calendar, Layers, 
    Download, RotateCcw, Search, ChevronRight,
    FileSpreadsheet, FileDown // ADDED: Icon untuk export
} from 'lucide-react';

export default function Reports({ reports, filters }) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        category: filters.category || '',
    });

    /**
     * ADDED: handleExport Logic
     * Mengekspor data audit berdasarkan rentang waktu dan kategori yang 
     * sedang aktif di filter saat ini.
     */
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
            
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.3em]">Historical Analysis</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Audit Reports</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Deep dive into stock movement patterns.</p>
                </div>
                
                {/* UPDATED: Export Actions Group */}
                <div className="flex gap-3">
                    <button 
                        onClick={() => handleExport('excel')}
                        className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-emerald-600 font-bold text-sm hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all shadow-sm"
                    >
                        <FileSpreadsheet size={18} />
                        Excel
                    </button>
                    <button 
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-rose-600 font-bold text-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all shadow-sm"
                    >
                        <FileDown size={18} />
                        PDF
                    </button>
                </div>
            </header>

            {/* Futuristic Filter Section (Query Engine) tetap sama */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 mb-10">
                <div className="flex items-center gap-3 mb-8">
                    <Filter className="text-blue-600" size={20} />
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">Query Engine</h2>
                </div>
                
                <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Timeline Start</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="date" 
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm"
                                value={data.start_date}
                                onChange={e => setData('start_date', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Timeline End</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="date" 
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm"
                                value={data.end_date}
                                onChange={e => setData('end_date', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Asset Category</label>
                        <div className="relative">
                            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select 
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm appearance-none font-medium"
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                            >
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
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                        >
                            Execute
                        </button>
                        <button 
                            type="button"
                            onClick={resetFilter}
                            className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>
                </form>
            </div>

            {/* Data Feed Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
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
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                                                    {new Date(report.created_at).toLocaleDateString('en-GB')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="font-black text-slate-800 dark:text-slate-200 tracking-tight">{report.product?.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{report.product?.sku}</p>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{report.user?.name}</span>
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                                report.category === 'sale' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10' :
                                                report.category === 'damaged' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10' :
                                                'bg-slate-100 text-slate-600 dark:bg-slate-800'
                                            }`}>
                                                {report.category}
                                            </span>
                                        </td>
                                        <td className={`p-6 text-right pr-10 font-black text-lg ${report.type === 'IN' ? 'text-emerald-500' : 'text-blue-500'}`}>
                                            <div className="flex items-center justify-end gap-1">
                                                <span>{report.type === 'IN' ? '+' : '-'}{report.quantity}</span>
                                                <ChevronRight size={14} className="opacity-20" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}