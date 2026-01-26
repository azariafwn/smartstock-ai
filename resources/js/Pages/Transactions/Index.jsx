import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Transactions({ products, transactions }) {
    // COMMENT: Form handler menggunakan Inertia useForm
    const { data, setData, post, processing, reset, errors } = useForm({
        product_id: '',
        type: 'OUT',
        category: 'sale',
        quantity: 1,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/transactions', {
            onSuccess: () => reset(),
        });
    };

    return (
        <MainLayout>
            <Head title="Transactions" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: Transaction Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">New Transaction</h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Product</label>
                                <select 
                                    className="w-full px-4 py-2 border rounded-xl bg-white"
                                    value={data.product_id}
                                    onChange={e => setData('product_id', e.target.value)}
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                                    ))}
                                </select>
                                {errors.product_id && <p className="text-red-500 text-xs mt-1">{errors.product_id}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">Type</label>
                                    <select 
                                        className="w-full px-4 py-2 border rounded-xl bg-white"
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                    >
                                        <option value="IN">IN (Stock Entry)</option>
                                        <option value="OUT">OUT (Stock Exit)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">Category</label>
                                    <select 
                                        className="w-full px-4 py-2 border rounded-xl bg-white"
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                    >
                                        <option value="sale">Sale</option>
                                        <option value="distributed">Distributed</option>
                                        <option value="damaged">Damaged</option>
                                        <option value="lost">Lost</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Quantity</label>
                                <input 
                                    type="number" 
                                    className="w-full px-4 py-2 border rounded-xl"
                                    value={data.quantity}
                                    onChange={e => setData('quantity', e.target.value)}
                                />
                                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {processing ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT: Transaction History Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">My Recent Requests</h2>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Product</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Type</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Qty</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {transactions.map((t) => (
                                    <tr key={t.id} className="text-sm">
                                        <td className="p-4 font-medium text-slate-700">{t.product?.name}</td>
                                        <td className="p-4 text-center italic text-slate-500">{t.type} - {t.category}</td>
                                        <td className="p-4 text-center font-bold">{t.quantity}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                t.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                                                t.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}