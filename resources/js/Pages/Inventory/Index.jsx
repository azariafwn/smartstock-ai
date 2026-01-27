import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { 
    Plus, Search, Edit3, Trash2, Package, 
    X, Filter, AlertTriangle, Check,
    FileSpreadsheet, FileDown // ADDED: Icon untuk Export
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

    /**
     * ADDED: handleExport Logic
     * Fungsi ini akan mengarahkan browser ke URL backend sambil membawa 
     * parameter filter yang sedang aktif agar data yang di-download sesuai.
     */
    const handleExport = (format) => {
        // Membangun query string secara manual agar lebih aman
        const queryParams = new URLSearchParams();
        queryParams.append('format', format);
        queryParams.append('category', selectedCategory);
        queryParams.append('search', searchQuery);
        queryParams.append('critical', showOnlyCritical ? '1' : '0');

        const url = `/inventory/export?${queryParams.toString()}`;
        
        // Membuka tab baru untuk download
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
        const matchesStockStatus = showOnlyCritical ? isCritical : true;

        return matchesSearch && matchesCategory && matchesStockStatus;
    });

    return (
        <MainLayout>
            <Head title="Inventory Management" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Warehouse</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and monitor your digital assets.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* ADDED: Export Buttons Container */}
                    <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mr-2">
                        <button 
                            onClick={() => handleExport('excel')}
                            className="p-2.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all"
                            title="Export to Excel"
                        >
                            <FileSpreadsheet size={18} /> Excel
                        </button>
                        <button 
                            onClick={() => handleExport('pdf')}
                            className="p-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                            title="Export to PDF"
                        >
                            <FileDown size={18} /> PDF
                        </button>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search assets..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-11 pr-4 py-3 rounded-2xl w-full md:w-64 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-medium"
                        />
                    </div>
                    {!isStaff && (
                        <button 
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            <span className="hidden md:inline font-bold pr-1">Add Product</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-10 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 mr-2">
                    <Filter size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Filter By:</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategory === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-blue-400'}`}
                    >
                        All Assets
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => setSelectedCategory(String(cat.id))}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategory === String(cat.id) ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-blue-400'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => setShowOnlyCritical(!showOnlyCritical)}
                    className={`ml-auto flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${showOnlyCritical ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 border border-rose-100 dark:border-rose-900/30'}`}
                >
                    <AlertTriangle size={14} />
                    {showOnlyCritical ? 'Showing Critical' : 'Check Low Stock'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.length > 0 ? filteredProducts.map((item) => {
                    const isLowStock = item.current_stock <= item.threshold;
                    return (
                        <div key={item.id} className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden">
                            
                            {isLowStock && <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-500/10 blur-3xl rounded-full" />}

                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl ${isLowStock ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600'}`}>
                                    <Package size={24} />
                                </div>
                                {!isStaff && (
                                    <div className="flex gap-1">
                                        <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-colors">
                                            <Edit3 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white truncate">{item.name}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.sku}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Stock Level</p>
                                    <div className="flex items-end gap-1">
                                        <span className={`text-xl font-black ${isLowStock ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}`}>
                                            {item.current_stock}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 mb-1">/ {item.threshold} min</span>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Unit Price</p>
                                    <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                                        Rp{new Intl.NumberFormat('id-ID').format(item.price)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                    item.status === 'active' 
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500' 
                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                                }`}>
                                    {item.status}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 italic">
                                    Updated {item.last_updated}
                                </span>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <Package className="mx-auto text-slate-200 mb-4" size={48} />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No assets match your criteria</p>
                    </div>
                )}
            </div>

            {/* Modal - Futuristic Glassmorphism */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={closeModal} />
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/20 p-8 transform transition-all">
                        
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                {editData ? 'Adjust Asset' : 'New Asset'}
                            </h2>
                            <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Product Identity</label>
                                    <input 
                                        type="text" 
                                        placeholder="Name" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)} 
                                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                    />
                                    {errors.name && <p className="text-rose-500 text-[10px] mt-1 ml-2 font-bold uppercase">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        type="text" 
                                        placeholder="SKU Code"
                                        value={data.sku} 
                                        onChange={e => setData('sku', e.target.value)} 
                                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                    />
                                    <select 
                                        value={data.category_id} 
                                        onChange={e => setData('category_id', e.target.value)} 
                                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-slate-200 font-medium"
                                    >
                                        <option value="">Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 block">Stock</label>
                                        <input 
                                            type="number" 
                                            value={data.stock} 
                                            onChange={e => setData('stock', e.target.value)} 
                                            className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-black"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 block">Min Alert</label>
                                        <input 
                                            type="number" 
                                            value={data.min_threshold} 
                                            onChange={e => setData('min_threshold', e.target.value)} 
                                            className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-black"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mb-1 block">Unit Price (IDR)</label>
                                    <input 
                                        type="number" 
                                        value={data.unit_price} 
                                        onChange={e => setData('unit_price', e.target.value)} 
                                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-black text-lg text-blue-600 dark:text-blue-400"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={closeModal} className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors">Cancel</button>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50"
                                >
                                    {processing ? '...' : (editData ? 'CONFIRM' : 'CREATE')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}