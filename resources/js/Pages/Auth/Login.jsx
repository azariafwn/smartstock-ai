import React, { useState } from 'react';
import { router, usePage, Head } from '@inertiajs/react';
import { Box, Lock, Mail, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export default function Login() {
    const { errors } = usePage().props;
    const [values, setValues] = useState({
        email: '',
        password: '',
    });

    function handleChange(e) {
        const key = e.target.id;
        const value = e.target.value;
        setValues(values => ({
            ...values,
            [key]: value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        router.post('/login', values);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050810] p-6 relative overflow-hidden font-sans">
            <Head title="Quantum Authentication" />
            
            {/* --- CUSTOM FUTURISTIC BACKGROUND --- */}
            <div className="absolute inset-0 z-0">
                {/* Dynamic Gradient Orbs */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[140px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '3s' }}></div>
                
                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                
                {/* Animated Lines/Particles */}
                <div className="absolute top-1/4 left-1/4 w-1 h-20 bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-20 animate-bounce" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-1/3 right-1/4 w-1 h-32 bg-gradient-to-b from-transparent via-indigo-500 to-transparent opacity-20 animate-bounce" style={{ animationDuration: '6s' }}></div>
            </div>

            <div className="w-full max-w-[460px] relative z-10">
                {/* Logo Section with Scanner Effect */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative group">
                        <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] mb-6 transform group-hover:rotate-6 transition-all duration-700">
                            <Box className="text-white relative z-10" size={36} />
                            {/* Scanning Line */}
                            <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
                                <div className="w-full h-1/2 bg-white/20 absolute top-[-100%] animate-[scan_3s_infinite] shadow-[0_0_15px_#fff]"></div>
                            </div>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-black tracking-[ -0.05em] text-white uppercase flex items-center gap-2">
                        Smart<span className="text-blue-500">Stock</span> <span className="text-sm font-light text-slate-500 tracking-[0.3em] self-center ml-1">AI</span>
                    </h1>
                    
                    <div className="flex items-center gap-2 mt-4 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-md">
                        <Cpu size={14} className="text-blue-400 animate-spin-slow" />
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Neural Link Established</span>
                    </div>
                </div>

                {/* --- GLASSMORPHISM LOGIN CARD --- */}
                <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="mb-8 border-l-4 border-blue-500 pl-6">
                        <h2 className="text-xl font-bold text-white tracking-tight">Access Control</h2>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Identity Verification Required</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">Operator Identity</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input 
                                    id="email"
                                    type="email" 
                                    value={values.email} 
                                    onChange={handleChange}
                                    placeholder="admin@smartstock.ai"
                                    className="w-full pl-14 pr-4 py-4.5 bg-white/5 border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all text-white font-medium placeholder:text-slate-600"
                                />
                            </div>
                            {errors.email && <p className="text-rose-500 text-[10px] mt-2 ml-2 font-bold uppercase tracking-wider animate-pulse">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">Secret Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input 
                                    id="password"
                                    type="password" 
                                    value={values.password} 
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-4 py-4.5 bg-white/5 border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all text-white font-medium placeholder:text-slate-600"
                                />
                            </div>
                            {errors.password && <p className="text-rose-500 text-[10px] mt-2 ml-2 font-bold uppercase tracking-wider animate-pulse">{errors.password}</p>}
                        </div>

                        <button 
                            type="submit" 
                            className="group w-full relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs active:scale-95"
                        >
                            <div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-[-20deg] translate-x-[-150%] group-hover:translate-x-[400%] transition-transform duration-700"></div>
                            Authorize Access <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center space-y-4">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encryption Active</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em]">
                        &copy; 2026 SmartStock AI &bull; Quantum Node 01
                    </p>
                </div>
            </div>

            {/* --- CUSTOM CSS FOR SCAN ANIMATION --- */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scan {
                    0% { top: -100%; }
                    100% { top: 100%; }
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}} />
        </div>
    );
}