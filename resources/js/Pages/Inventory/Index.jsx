import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { 
    Plus, Search, Edit3, Trash2, Package, 
    X, Filter, AlertTriangle, Check,
    FileSpreadsheet, FileDown 
} from 'lucide-react';

export default function Inventory({ products, categories = [] }) {
    const { auth } = usePage().props;
    const isStaff = auth.user.role === 'staff';

    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showOnlyCritical, setShowOnlyCritical] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '', sku: '', category_id: '', stock: 0, min_threshold: 5, unit_price: 0,
    });

    const handleExport = (format) => {
        const queryParams = new URLSearchParams();
        queryParams.append('format', format);
        queryParams.append('category', selectedCategory);
        queryParams.append('search', searchQuery);
        queryParams.append('critical', showOnlyCritical ? '1' : '0');
        const url = `/inventory/export?${queryParams.toString()}`;
        window.open(url, '_blank');
    };

    const handleEdit = (product) => {
        setEditData(product);
        setData({
            name: product.name,
            sku: product.sku,
            category_id: String(product.category_id),
            stock: product.current_stock,
            min_threshold: product.threshold,
            unit_price: product.price,
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/inventory/${id}`);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditData(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editData) {
            put(`/inventory/${editData.id}`, { onSuccess: () => closeModal() });
        } else {
            post('/inventory', { onSuccess: () => closeModal() });
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || String(p.category_id) === selectedCategory;
        const isCritical = p.current_stock <= p.threshold;
        return matchesSearch && matchesCategory && (showOnlyCritical ? isCritical : true);
    });

    return (
        <MainLayout>
            <Head title="Inventory Management" />
            
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Warehouse</h1>
                    <p className="hidden md:block text-slate-500 dark:text-slate-400 font-medium">Manage and monitor your digital assets.</p>
                </div>
                
                <div className="flex items-center gap-2 md:gap-3">
                    {/* Actions Container */}
                    <div className="flex-1 md:flex-none flex items-center gap-2">
                        {/* Search Bar */}
                        <div className="relative flex-1 md:flex-none group order-2 md:order-1">
                            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-9 md:pl-11 pr-3 md:pr-4 py-2 md:py-3.5 rounded-xl md:rounded-2xl w-full md:w-64 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white text-sm font-medium"
                            />
                        </div>

                        {/* Export Buttons: Icons on Mobile, Text + Icons on Laptop */}
                        <div className="flex bg-white dark:bg-slate-900 p-1 md:p-1.5 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0 order-1 md:order-2">
                            <button 
                                onClick={() => handleExport('excel')} 
                                className="flex items-center gap-2 p-2 md:px-3 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg md:rounded-xl transition-all"
                            >
                                <FileSpreadsheet size={18} />
                                <span className="hidden md:inline font-bold text-xs">Excel</span>
                            </button>
                            <button 
                                onClick={() => handleExport('pdf')} 
                                className="flex items-center gap-2 p-2 md:px-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg md:rounded-xl transition-all"
                            >
                                <FileDown size={18} />
                                <span className="hidden md:inline font-bold text-xs">PDF</span>
                            </button>
                        </div>

                        {/* Mobile Add Product Button (Icon only) */}
                        {!isStaff && (
                            <button 
                                onClick={() => setShowModal(true)}
                                className="md:hidden order-3 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                            >
                                <Plus size={20} />
                            </button>
                        )}
                    </div>

                    {/* Desktop Add Product Button (Full button on the right) */}
                    {!isStaff && (
                        <button 
                            onClick={() => setShowModal(true)}
                            className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 items-center gap-2 font-bold"
                        >
                            <Plus size={20} />
                            <span>Add Product</span>
                        </button>
                    )}
                </div>
            </div>

            {/* --- FILTER SECTION --- */}
            <div className="flex flex-col gap-4 mb-8 md:mb-10 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                        <div className="flex items-center gap-2 text-slate-400 shrink-0 mr-1">
                            <Filter size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Filter By:</span>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setSelectedCategory('all')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-blue-400'}`}
                            >
                                All Assets
                            </button>
                            {categories.map(cat => (
                                <button 
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(String(cat.id))}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === String(cat.id) ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-blue-400'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowOnlyCritical(!showOnlyCritical)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all self-end md:self-auto ${showOnlyCritical ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 border border-rose-100 dark:border-rose-900/30'}`}
                    >
                        <AlertTriangle size={14} />
                        {showOnlyCritical ? 'Showing Critical' : 'Check Low Stock'}
                    </button>
                </div>
            </div>

            {/* --- CARDS SECTION --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.length > 0 ? filteredProducts.map((item) => {
                    const isLowStock = item.current_stock <= item.threshold;
                    return (
                        <div key={item.id} className="group bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 dark:border-slate-800 p-5 md:p-6 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all relative overflow-hidden">
                            {isLowStock && <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-500/10 blur-3xl rounded-full" />}
                            <div className="flex justify-between items-start mb-4 md:mb-6">
                                <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${isLowStock ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600'}`}>
                                    <Package size={22} />
                                </div>
                                {!isStaff && (
                                    <div className="flex gap-1">
                                        <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><Edit3 size={18} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 size={18} /></button>
                                    </div>
                                )}
                            </div>
                            <div className="mb-4 md:mb-6">
                                <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white truncate">{item.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.sku}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 md:p-3 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Stock</p>
                                    <div className="flex items-end gap-1">
                                        <span className={`text-lg md:text-xl font-black ${isLowStock ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}`}>{item.current_stock}</span>
                                        <span className="text-[9px] font-bold text-slate-400 mb-0.5">/ {item.threshold}</span>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 md:p-3 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Unit Price</p>
                                    <p className="text-xs md:text-sm font-black text-slate-800 dark:text-slate-200 truncate">Rp{new Intl.NumberFormat('id-ID').format(item.price)}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-slate-50 dark:border-slate-800">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${item.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10' : 'bg-slate-100 text-slate-500'}`}>{item.status}</span>
                                <span className="text-[9px] font-bold text-slate-400 italic">Updated {item.last_updated}</span>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <Package className="mx-auto text-slate-200 mb-4" size={40} />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No assets match criteria</p>
                    </div>
                )}
            </div>

            {/* Modal & Style tetap sama seperti sebelumnya */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={closeModal} />
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/20 p-6 md:p-8 transform transition-all">
                        <div className="flex justify-between items-center mb-6 md:mb-8">
                            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{editData ? 'Adjust Asset' : 'New Asset'}</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400"><X size={24} /></button>
                        </div>
                        <form onSubmit={submit} className="space-y-4 md:space-y-6">
                            {/* ... Content Modal ... */}
                            <div className="space-y-3 md:space-y-4">
                                <div>
                                    <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Product Identity</label>
                                    <input type="text" placeholder="Name" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white text-sm" />
                                    {errors.name && <p className="text-rose-500 text-[9px] mt-1 ml-2 font-bold uppercase">{errors.name}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    <input type="text" placeholder="SKU" value={data.sku} onChange={e => setData('sku', e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white text-sm" />
                                    <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-200 font-medium text-sm">
                                        <option value="">Category</option>
                                        {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase ml-2 block">Stock</label>
                                        <input type="number" value={data.stock} onChange={e => setData('stock', e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-black" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase ml-2 block">Min Alert</label>
                                        <input type="number" value={data.min_threshold} onChange={e => setData('min_threshold', e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-black" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Unit Price (IDR)</label>
                                    <input type="number" value={data.unit_price} onChange={e => setData('unit_price', e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-blue-600 dark:text-blue-400 font-black text-lg" />
                                </div>
                            </div>
                            <div className="flex gap-3 md:gap-4 pt-2">
                                <button type="button" onClick={closeModal} className="flex-1 py-3 md:py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm">Cancel</button>
                                <button type="submit" disabled={processing} className="flex-1 py-3 md:py-4 bg-blue-600 text-white rounded-xl md:rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50 text-sm">
                                    {processing ? '...' : (editData ? 'CONFIRM' : 'CREATE')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </MainLayout>
    );
}