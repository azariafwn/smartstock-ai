import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { 
    CheckCircle2, XCircle, User, Package, 
    ArrowRight, Calendar, Inbox, ShieldCheck 
} from 'lucide-react';

export default function Approvals({ approvals }) {
    const handleAction = (id, status) => {
        let notes = null;
        if (status === 'rejected') {
            notes = prompt('Enter rejection reason (required):');
            if (!notes) return;
        }
        router.put(`/approvals/${id}`, { status, notes });
    };

    return (
        <MainLayout>
            <Head title="Authority Center" />
            
            <header className="mb-6 md:mb-10">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-1 w-6 md:w-8 bg-blue-600 rounded-full"></div>
                    <span className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-[0.3em]">Decision Engine</span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Pending Approvals</h1>
                    </div>
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 border border-blue-100 dark:border-blue-500/20">
                        <ShieldCheck size={18} />
                        <span className="text-xs font-black uppercase tracking-wider">{approvals.length} Requests</span>
                    </div>
                </div>
            </header>

            <div className="space-y-4">
                {approvals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 md:py-20 bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-800 rounded-full mb-4">
                            <Inbox size={40} className="text-slate-300 md:w-12 md:h-12" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">Clear Skies</h3>
                        <p className="text-slate-400 text-xs md:text-sm">All requests have been processed.</p>
                    </div>
                ) : (
                    approvals.map((ap) => (
                        <div key={ap.id} className="group bg-white dark:bg-slate-900 rounded-[2rem] p-5 md:p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 md:gap-6">
                                
                                {/* Requester Info */}
                                <div className="flex items-center gap-4 min-w-0 md:min-w-[200px]">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 dark:bg-slate-800 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-500 shrink-0">
                                        <User size={20} className="md:w-6 md:h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-sm md:text-base truncate">{ap.transaction.user.name}</h4>
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Calendar size={10} />
                                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-none">
                                                {new Date(ap.created_at).toLocaleDateString('en-GB')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Product & Transaction Details - FIXED MOBILE STACK */}
                                <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-4 md:gap-6 px-4 py-4 md:px-6 md:py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl md:rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg md:rounded-xl shadow-sm">
                                            <Package size={18} className="text-blue-600 md:w-5 md:h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset</p>
                                            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{ap.transaction.product.name}</p>
                                        </div>
                                    </div>

                                    <div className="hidden sm:block">
                                        <ArrowRight className="text-slate-300 dark:text-slate-700" size={20} />
                                    </div>

                                    <div className="flex-1 grid grid-cols-2 gap-4 border-t sm:border-t-0 border-slate-200 dark:border-slate-700 pt-3 sm:pt-0">
                                        <div>
                                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</p>
                                            <span className={`text-[10px] md:text-xs font-black uppercase ${ap.transaction.type === 'IN' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {ap.transaction.type} — {ap.transaction.category}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</p>
                                            <p className="font-black text-slate-800 dark:text-white text-base md:text-lg leading-none">{ap.transaction.quantity}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Decision Actions - FIXED FLEX FOR MOBILE */}
                                <div className="flex items-center gap-2 md:gap-3 md:pl-4">
                                    <button 
                                        onClick={() => handleAction(ap.id, 'rejected')}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-wider md:tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all duration-300"
                                    >
                                        <XCircle size={14} className="md:w-4 md:h-4" />
                                        Decline
                                    </button>
                                    <button 
                                        onClick={() => handleAction(ap.id, 'approved')}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-emerald-500 text-white rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-wider md:tracking-[0.2em] shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <CheckCircle2 size={14} className="md:w-4 md:h-4" />
                                        Authorize
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </MainLayout>
    );
}