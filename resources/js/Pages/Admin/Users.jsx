import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { UserPlus, Shield, Mail, Trash2, Edit2, X, Check, Fingerprint } from 'lucide-react';

export default function Users({ users }) {
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '', email: '', password: '', role: 'staff'
    });

    const openModal = (user = null) => {
        if (user) {
            setEditData(user);
            setData({ name: user.name, role: user.role, email: user.email, password: '' });
        } else {
            setEditData(null);
            reset();
        }
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editData) {
            put(`/users/${editData.id}`, { onSuccess: () => setShowModal(false) });
        } else {
            post('/users', { onSuccess: () => { setShowModal(false); reset(); } });
        }
    };

    return (
        <MainLayout>
            <Head title="Command Center - User Management" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Access Control</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Manage quantum nodes and operator privileges.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <UserPlus size={18} /> New Operator
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div key={user.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-blue-600">
                                <Fingerprint size={24} />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openModal(user)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={18} /></button>
                                <button onClick={() => router.delete(`/users/${user.id}`)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white truncate">{user.name}</h3>
                            <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
                                <Mail size={12} /> {user.email}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                user.role === 'superadmin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' :
                                user.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' :
                                'bg-slate-100 text-slate-600 dark:bg-slate-800'
                            }`}>
                                <Shield size={10} className="inline mr-1 mb-0.5" /> {user.role}
                            </span>
                            <span className="text-[10px] font-bold text-slate-300 uppercase italic">Joined {user.joined_at}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal - Glassmorphism style */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)} />
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-2xl relative border border-white/10 p-10">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-8">
                            {editData ? 'Update Privileges' : 'Deploy New Operator'}
                        </h2>
                        
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-4">
                                <input 
                                    placeholder="Full Name" 
                                    value={data.name} onChange={e => setData('name', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 dark:text-white"
                                />
                                {!editData && (
                                    <>
                                        <input 
                                            placeholder="Email Address" 
                                            value={data.email} onChange={e => setData('email', e.target.value)}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 dark:text-white"
                                        />
                                        <input 
                                            type="password" placeholder="Secure Password" 
                                            value={data.password} onChange={e => setData('password', e.target.value)}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 dark:text-white"
                                        />
                                    </>
                                )}
                                <select 
                                    value={data.role} onChange={e => setData('role', e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 dark:text-white font-bold"
                                >
                                    <option value="staff">Staff (Gudang)</option>
                                    <option value="admin">Admin (Back Office)</option>
                                    <option value="superadmin">Superadmin (Supervisor)</option>
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="submit" disabled={processing} className="flex-1 py-4 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-blue-700 transition-all">
                                    {editData ? 'UPDATE' : 'DEPLOY'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}