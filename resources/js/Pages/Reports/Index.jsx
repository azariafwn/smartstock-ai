import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router, useForm } from '@inertiajs/react';

export default function Reports({ reports, filters }) {
    // COMMENT: Inisialisasi form filter dengan data dari URL saat ini
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        category: filters.category || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        // COMMENT: Kirim filter kembali ke route yang sama menggunakan method GET
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
            <Head title="Inventory Reports" />
            
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Inventory Reports</h1>
                <p className="text-slate-500">Analyze your historical stock movements and trends</p>
            </div>

            {/* NEW: FILTER SECTION */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 text-slate-600">Start Date</label>
                        <input 
                            type="date" 
                            className="w-full px-4 py-2 border rounded-xl"
                            value={data.start_date}
                            onChange={e => setData('start_date', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 text-slate-600">End Date</label>
                        <input 
                            type="date" 
                            className="w-full px-4 py-2 border rounded-xl"
                            value={data.end_date}
                            onChange={e => setData('end_date', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 text-slate-600">Category</label>
                        <select 
                            className="w-full px-4 py-2 border rounded-xl bg-white"
                            value={data.category}
                            onChange={e => setData('category', e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="sale">Sale</option>
                            <option value="distributed">Distributed</option>
                            <option value="damaged">Damaged</option>
                            <option value="lost">Lost</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition"
                        >
                            Apply
                        </button>
                        <button 
                            type="button"
                            onClick={resetFilter}
                            className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>

            {/* REPORT TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Product</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">User</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Category</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Quantity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {reports.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-400 italic">No report data found for the selected filters.</td>
                            </tr>
                        ) : (
                            reports.map((report) => (
                                <tr key={report.id} className="text-sm hover:bg-slate-50 transition">
                                    <td className="p-4 text-slate-500">{new Date(report.created_at).toLocaleDateString('en-GB')}</td>
                                    <td className="p-4 font-bold text-slate-800">{report.product?.name}</td>
                                    <td className="p-4 text-slate-600">{report.user?.name}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            report.category === 'sale' ? 'bg-blue-100 text-blue-700' :
                                            report.category === 'damaged' ? 'bg-red-100 text-red-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                            {report.category}
                                        </span>
                                    </td>
                                    <td className={`p-4 text-center font-black ${report.type === 'IN' ? 'text-emerald-600' : 'text-blue-600'}`}>
                                        {report.type === 'IN' ? '+' : '-'}{report.quantity}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}