import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';

export default function Approvals({ approvals }) {
    const handleAction = (id, status) => {
        const notes = status === 'rejected' ? prompt('Enter rejection reason:') : null;
        router.put(`/approvals/${id}`, { status, notes });
    };

    return (
        <MainLayout>
            <Head title="Pending Approvals" />
            
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Pending Approvals</h1>
                <p className="text-slate-500">Review and approve stock transaction requests</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Requester</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Product</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Type</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Qty</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {approvals.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-400 italic">No pending requests found.</td>
                            </tr>
                        ) : (
                            approvals.map((ap) => (
                                <tr key={ap.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4">
                                        <div className="font-semibold">{ap.transaction.user.name}</div>
                                        <div className="text-xs text-slate-400">{new Date(ap.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-4 font-medium">{ap.transaction.product.name}</td>
                                    <td className="p-4 text-center uppercase text-xs font-bold">
                                        <span className={ap.transaction.type === 'IN' ? 'text-green-600' : 'text-blue-600'}>
                                            {ap.transaction.type} - {ap.transaction.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center font-bold">{ap.transaction.quantity}</td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => handleAction(ap.id, 'approved')}
                                            className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-100 mr-2 transition"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleAction(ap.id, 'rejected')}
                                            className="bg-red-50 text-red-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-100 transition"
                                        >
                                            Reject
                                        </button>
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