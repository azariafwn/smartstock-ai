import React, { useEffect } from 'react'; 
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Send, History, ArrowUpRight, ArrowDownLeft, 
    Layers, Zap, AlertCircle, CheckCircle2, Clock,
    FileSpreadsheet, FileDown // ADDED: Icon untuk tombol export
} from 'lucide-react';

export default function Transactions({ products, transactions }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        product_id: '',
        type: 'OUT',
        category: 'sale',
        quantity: 1,
    });

    /**
     * CHANGE LOGIC: 
     * Otomasi kategori saat Stock In agar data tetap rapi di database.
     */
    useEffect(() => {
        if (data.type === 'IN') {
            setData('category', 'restock');
        } else if (data.category === 'restock') {
            setData('category', 'sale');
        }
    }, [data.type]);

    /**
     * ADDED: handleExport Logic
     * Fungsi ini akan mendownload data transaksi berdasarkan filter yang aktif.
     * Kita mengirimkan 'type' sebagai parameter agar hasil printout sesuai konteks.
     */
    const handleExport = (format) => {
        const params = new URLSearchParams({
            format: format,
            type: data.type, // Mengikuti filter type yang sedang dipilih di form (IN atau OUT)
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
            
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.3em]">Logistics Command</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Movement Control</h1>
                </div>

                {/* ADDED: Export Actions
                  * Tombol export diletakkan di header agar mudah diakses saat Admin ingin 
                  * mencetak laporan harian arus barang.
                  */}
                <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <button 
                        onClick={() => handleExport('excel')}
                        className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all font-bold text-xs uppercase"
                    >
                        <FileSpreadsheet size={18} /> Excel
                    </button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 self-center mx-1"></div>
                    <button 
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all font-bold text-xs uppercase"
                    >
                        <FileDown size={18} /> PDF
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT: Transaction Form */}
                <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 sticky top-28">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
                                <Zap size={20} fill="currentColor" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Quick Action</h2>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-2 block">Select Asset</label>
                                <div className="relative">
                                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <select 
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white appearance-none font-medium"
                                        value={data.product_id}
                                        onChange={e => setData('product_id', e.target.value)}
                                    >
                                        <option value="">Choose Product...</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} (Qty: {p.stock})</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.product_id && <p className="text-rose-500 text-[10px] mt-2 ml-2 font-bold uppercase tracking-wider">{errors.product_id}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-2 block">Flow Type</label>
                                    <select 
                                        className={`w-full px-4 py-4 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all ${
                                            data.type === 'IN' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'
                                        }`}
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                    >
                                        <option value="IN">STOCK IN</option>
                                        <option value="OUT">STOCK OUT</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-2 block">Category</label>
                                    <select 
                                        disabled={data.type === 'IN'}
                                        className={`w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-medium transition-all ${
                                            data.type === 'IN' ? 'opacity-50 cursor-not-allowed grayscale' : ''
                                        }`}
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                    >
                                        {data.type === 'IN' ? (
                                            <option value="restock">Restock / Entry</option>
                                        ) : (
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
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-2 block">Amount to Move</label>
                                <input 
                                    type="number" 
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-black text-2xl dark:text-white"
                                    value={data.quantity}
                                    onChange={e => setData('quantity', e.target.value)}
                                />
                                {errors.quantity && <p className="text-rose-500 text-[10px] mt-2 ml-2 font-bold uppercase tracking-wider">{errors.quantity}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                            >
                                {processing ? 'Processing...' : (
                                    <>
                                        Execute Transfer <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT: Transaction History */}
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <History className="text-blue-600" size={24} />
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Personal Activity Feed</h2>
                            </div>
                            <span className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-widest">Live Updates</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        <th className="p-6">Asset Details</th>
                                        <th className="p-6 text-center">Movement Type</th>
                                        <th className="p-6 text-center">Amount</th>
                                        <th className="p-6 text-right pr-10">Process Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {transactions.map((t) => (
                                        <tr key={t.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="p-6">
                                                <p className="font-bold text-slate-800 dark:text-slate-200">{t.product?.name}</p>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Ref ID: SS-{t.id}AI</p>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    {t.type === 'IN' ? (
                                                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs bg-emerald-500/10 px-3 py-1 rounded-lg">
                                                            <ArrowDownLeft size={14} /> STOCK IN
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-rose-500 font-bold text-xs bg-rose-500/10 px-3 py-1 rounded-lg">
                                                            <ArrowUpRight size={14} /> STOCK OUT
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-center text-slate-400 mt-1 uppercase font-medium tracking-tighter opacity-60">{t.category}</p>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className="text-lg font-black text-slate-700 dark:text-slate-300">
                                                    {t.quantity}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">Units</span>
                                            </td>
                                            <td className="p-6 text-right pr-10">
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                                                    t.status === 'pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/5' : 
                                                    t.status === 'approved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/5' : 
                                                    'bg-rose-50 text-rose-600 dark:bg-rose-500/5'
                                                }`}>
                                                    {t.status === 'pending' && <Clock size={12} className="animate-spin" />}
                                                    {t.status === 'approved' && <CheckCircle2 size={12} />}
                                                    {t.status === 'rejected' && <AlertCircle size={12} />}
                                                    {t.status}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}