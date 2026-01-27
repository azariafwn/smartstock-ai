import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react'; // Tambahkan usePage
import Swal from 'sweetalert2';
import { 
    LayoutDashboard, Box, ArrowLeftRight, CheckCircle, 
    FileText, LogOut, Menu, Moon, Sun, User, UserPlus 
} from 'lucide-react';

export default function MainLayout({ children }) {
    // Ambil data auth dari props global Inertia
    const { auth } = usePage().props;
    const userRole = auth.user.role; // Asumsi kolom di DB namanya 'role'

    const { flash } = usePage().props;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDark, setIsDark] = useState(
        localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            root.style.colorScheme = 'light';
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    useEffect(() => {
        if (flash?.error) {
            Swal.fire({
                title: 'ACTION RESTRICTED',
                text: flash.error,
                icon: 'warning',
                background: isDark ? '#0f172a' : '#ffffff', // Menyesuaikan theme
                color: isDark ? '#fff' : '#000',
                confirmButtonColor: '#2563eb',
                iconColor: '#f59e0b',
                customClass: {
                    popup: 'rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl',
                    title: 'font-black tracking-tighter',
                    confirmButton: 'rounded-xl px-6 py-3 font-bold uppercase tracking-widest text-xs'
                }
            });
        }

        if (flash?.success) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: flash.success,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: isDark ? '#0f172a' : '#ffffff',
                color: isDark ? '#fff' : '#000',
            });
        }
    }, [flash, isDark]); // Re-run kalau ada flash baru atau ganti theme

    // Tambahkan properti 'roles' pada navItems untuk filter akses
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['superadmin', 'admin', 'staff'] },
        { name: 'Inventory', icon: Box, href: '/inventory', roles: ['superadmin', 'admin', 'staff'] },
        { name: 'Transactions', icon: ArrowLeftRight, href: '/transactions', roles: ['superadmin', 'admin', 'staff'] },
        { name: 'Approvals', icon: CheckCircle, href: '/approvals', roles: ['superadmin', 'admin'] }, // Staff sembunyi
        { name: 'Reports', icon: FileText, href: '/reports', roles: ['superadmin'] }, // Admin & Staff sembunyi
        { name: 'Users', icon: UserPlus, href: '/users', roles: ['superadmin'] },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f172a] transition-colors duration-500 font-sans">
            
            <aside className={`
                fixed inset-y-0 left-0 z-[60] w-72 h-screen
                bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
                transform transition-all duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                <div className="h-full flex flex-col justify-between p-6">
                    <div className="overflow-y-auto">
                        <div className="flex items-center gap-3 px-2 mb-10">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <Box className="text-white" size={24} />
                            </div>
                            <span className="text-xl font-black tracking-tighter dark:text-white uppercase">
                                Smart<span className="text-blue-600">Stock</span>
                            </span>
                        </div>
                        
                        <nav className="space-y-1">
                            {navItems
                                // FILTER: Hanya tampilkan menu jika role user terdaftar di item.roles
                                .filter(item => item.roles.includes(userRole))
                                .map((item) => {
                                    const Icon = item.icon;
                                    const isActive = window.location.pathname === item.href;
                                    return (
                                        <Link 
                                            key={item.name} 
                                            href={item.href}
                                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                                                isActive 
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <Icon size={20} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                                            <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                                        </Link>
                                    );
                            })}
                        </nav>
                    </div>

                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50 dark:bg-slate-900">
                        {/* USER INFO PANEL */}
                        <div className="px-4 py-3 mb-2 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                <User size={16} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold dark:text-white truncate uppercase">{auth.user.name}</p>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{userRole}</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsDark(!isDark)}
                            className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                            <span className="font-semibold text-sm">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>

                        <button 
                            onClick={() => router.post('/logout')}
                            className="w-full flex items-center gap-4 px-4 py-3.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all"
                        >
                            <LogOut size={20} />
                            <span className="font-semibold text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* CONTENT AREA & MOBILE HEADER tetap sama */}
            <div className={`flex flex-col min-w-0 transition-all duration-300 lg:ml-72`}>
                <header className="sticky top-0 z-40 h-20 flex items-center justify-between px-6 lg:px-10 lg:hidden bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                        <Menu size={28} />
                    </button>
                    <span className="font-black dark:text-white tracking-tighter uppercase">
                        SMART<span className="text-blue-600">STOCK</span> AI
                    </span>
                    <div className="w-10"></div>
                </header>

                <main className="p-6 lg:p-10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {isSidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}
        </div>
    );
}