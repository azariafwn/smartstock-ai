import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';

export default function MainLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', icon: '📊', href: '/dashboard' },
        { name: 'Inventory', icon: '📦', href: '/inventory' },
        { name: 'Transactions', icon: '💸', href: '/transactions' },
        { name: 'Approvals', icon: '✅', href: '/approvals' },
        { name: 'Reports', icon: '📄', href: '/reports' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar Desktop & Mobile */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static
            `}>
                <div className="h-full flex flex-col p-6">
                    <div className="text-2xl font-bold text-blue-600 mb-10">SmartStock AI</div>
                    
                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                // Tambahkan logic active state jika ingin warna berbeda saat halaman dipilih
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                                    window.location.pathname === item.href 
                                    ? 'bg-blue-50 text-blue-600' 
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <span>{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <button 
                        onClick={() => router.post('/logout')}
                        className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                        <span>🚪</span>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for Mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Navbar Mobile */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-2xl">☰</button>
                    <div className="ml-4 font-bold text-blue-600">SmartStock AI</div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}