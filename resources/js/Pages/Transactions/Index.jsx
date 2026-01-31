import React, { useEffect } from 'react'; 
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Send, History, ArrowUpRight, ArrowDownLeft, 
    Layers, Zap, AlertCircle, CheckCircle2, Clock,
    FileSpreadsheet, FileDown 
} from 'lucide-react';

export default function Transactions({ products, transactions }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        product_id: '',
        type: 'OUT',
        category: 'sale',
        quantity: 1,
    });

    useEffect(() => {
        if (data.type === 'IN') {
            setData('category', 'restock');
        } else if (data.category === 'restock') {
            setData('category', 'sale');
        }
    }, [data.type]);

    const handleExport = (format) => {
        const params = new URLSearchParams({
            format: format,
            type: data.type,
        }).toString();
        window.open(`/transactions/export?${params}`, '_blank');
    };

    const submit = (e) => {
        e.preventDefault();
        post('/transactions', {
            onSuccess: () => reset(),
        });
    };

    return (
        <MainLayout>
            <Head title="Asset Transactions" />
            
            <header className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-6 md:w-8 bg-blue-600 rounded-full"></div>
                        <span className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-[0.3em]">Logistics Command</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Movement Control</h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">Execute and monitor asset transfers.</p>
                </div>

                <div className="flex bg-white dark:bg-slate-900 p-1 md:p-1.5 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm self-start md:self-auto">
                    <button onClick={() => handleExport('excel')} className="flex items-center gap-2 px-3 md:px-4 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg md:rounded-xl transition-all font-bold text-[10px] md:text-xs uppercase">
                        <FileSpreadsheet size={16} /> <span className="hidden md:inline">Excel</span>
                    </button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 self-center mx-1"></div>
                    <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 px-3 md:px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg md:rounded-xl transition-all font-bold text-[10px] md:text-xs uppercase">
                        <FileDown size={16} /> <span className="hidden md:inline">PDF</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                {/* LEFT: Quick Action Form */}
                <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 md:sticky md:top-28">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <div className="p-2.5 md:p-3 bg-blue-600 rounded-xl md:rounded-2xl shadow-lg shadow-blue-500/30 text-white">
                                <Zap size={18} fill="currentColor" />
                            </div>
                            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Quick Action</h2>
                        </div>

                        <form onSubmit={submit} className="space-y-4 md:space-y-6">
                            <div>
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1.5 block">Select Asset</label>
                                <div className="relative">
                                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <select className="w-full pl-11 pr-4 py-3 md:py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white appearance-none text-sm font-medium" value={data.product_id} onChange={e => setData('product_id', e.target.value)}>
                                        <option value="">Choose Product...</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} (Qty: {p.stock})</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.product_id && <p className="text-rose-500 text-[9px] mt-1.5 ml-2 font-bold uppercase">{errors.product_id}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div>
                                    <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1.5 block">Flow Type</label>
                                    <select className={`w-full px-3 py-3 md:py-4 border-none rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-xs md:text-sm transition-all ${data.type === 'IN' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'}`} value={data.type} onChange={e => setData('type', e.target.value)}>
                                        <option value="IN">STOCK IN</option>
                                        <option value="OUT">STOCK OUT</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1.5 block">Category</label>
                                    <select disabled={data.type === 'IN'} className={`w-full px-3 py-3 md:py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-medium text-xs md:text-sm transition-all ${data.type === 'IN' ? 'opacity-50 cursor-not-allowed grayscale' : ''}`} value={data.category} onChange={e => setData('category', e.target.value)}>
                                        {data.type === 'IN' ? <option value="restock">Restock</option> : (
                                            <>
                                                <option value="sale">Sale</option>
                                                <option value="distributed">Distribution</option>
                                                <option value="damaged">Damaged</option>
                                                <option value="lost">Lost</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1.5 block">Amount</label>
                                <input type="number" className="w-full px-5 py-3 md:py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-black text-xl md:text-2xl dark:text-white" value={data.quantity} onChange={e => setData('quantity', e.target.value)} />
                                {errors.quantity && <p className="text-rose-500 text-[9px] mt-1.5 ml-2 font-bold uppercase">{errors.quantity}</p>}
                            </div>

                            <button type="submit" disabled={processing} className="w-full bg-blue-600 text-white py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-xs md:text-sm">
                                {processing ? '...' : <><span className="md:inline">Execute Transfer</span><Send size={16} /></>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT: Transaction History */}
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 md:p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <History className="text-blue-600" size={22} />
                                <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white tracking-tight uppercase">Recent Flow</h2>
                            </div>
                            <span className="hidden sm:inline-flex px-4 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-widest">Live Updates</span>
                        </div>
                        
                        {/* Desktop View Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        <th className="p-6">Asset Details</th>
                                        <th className="p-6 text-center">Movement</th>
                                        <th className="p-6 text-center">Amount</th>
                                        <th className="p-6 text-right pr-10">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {transactions.map((t) => (
                                        <tr key={t.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="p-6">
                                                <p className="font-bold text-slate-800 dark:text-slate-200">{t.product?.name}</p>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase">Ref: SS-{t.id}AI</p>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-[10px] ${t.type === 'IN' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                                                    {t.type === 'IN' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />} {t.type}
                                                </span>
                                            </td>
                                            <td className="p-6 text-center font-black dark:text-slate-300 text-sm">{t.quantity} <span className="text-[10px] text-slate-400 font-normal ml-1 uppercase">Units</span></td>
                                            <td className="p-6 text-right pr-10">
                                                <StatusBadge status={t.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View List (No Scroll Needed) */}
                        <div className="md:hidden divide-y divide-slate-50 dark:divide-slate-800">
                            {transactions.map((t) => (
                                <div key={t.id} className="p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{t.product?.name}</p>
                                            <p className="text-[9px] text-slate-400 font-medium uppercase">REF: SS-{t.id}AI</p>
                                        </div>
                                        <StatusBadge status={t.status} />
                                    </div>
                                    
                                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg ${t.type === 'IN' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                                                {t.type === 'IN' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-slate-400 font-black uppercase leading-none">{t.type === 'IN' ? 'Received' : 'Issued'}</p>
                                                <p className="text-[10px] font-bold dark:text-slate-300 uppercase">{t.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] text-slate-400 font-black uppercase leading-none">Amount</p>
                                            <p className="text-sm font-black dark:text-white">{t.quantity} <span className="text-[9px] font-normal uppercase">Units</span></p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

// Helper Component for Process Status
function StatusBadge({ status }) {
    const styles = {
        pending: 'bg-amber-50 text-amber-600 dark:bg-amber-500/5',
        approved: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/5',
        rejected: 'bg-rose-50 text-rose-600 dark:bg-rose-500/5'
    };

    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
            {status === 'pending' && <Clock size={12} className="animate-spin" />}
            {status === 'approved' && <CheckCircle2 size={12} />}
            {status === 'rejected' && <AlertCircle size={12} />}
            {status}
        </div>
    );
}