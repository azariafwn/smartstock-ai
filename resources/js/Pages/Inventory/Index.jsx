import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm, router } from '@inertiajs/react'; // UPDATE: Tambah router untuk delete

export default function Inventory({ products, categories = [] }) {
    const [showModal, setShowModal] = useState(false);
    // UPDATE: State untuk menyimpan data yang sedang diedit
    const [editData, setEditData] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        sku: '',
        category_id: '',
        stock: 0,
        min_threshold: 5,
        unit_price: 0,
    });

    // UPDATE: Fungsi untuk membuka modal Edit
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

    // UPDATE: Fungsi untuk Delete dengan konfirmasi
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
            // UPDATE: Jika mode edit, gunakan method PUT
            put(`/inventory/${editData.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/inventory', {
                onSuccess: () => closeModal(),
            });
        }
    };

    return (
        <MainLayout>
            <Head title="Inventory Management" />
            
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Inventory List</h1>
                    <p className="text-slate-500">Manage your warehouse stock items</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                    + Add New Product
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-600">Product & SKU</th>
                            <th className="p-4 text-sm font-semibold text-slate-600 text-center">Current Stock</th>
                            <th className="p-4 text-sm font-semibold text-slate-600 text-center">Price</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Last Updated</th>
                            <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.map((item) => {
                            const isLowStock = item.current_stock <= item.threshold;
                            return (
                                <tr key={item.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900">{item.name}</div>
                                        <div className="text-xs text-slate-400">{item.sku}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className={`inline-block px-3 py-1 rounded-lg font-bold ${isLowStock ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-green-50 text-green-600'}`}>
                                            {item.current_stock}
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-1 uppercase">Min: {item.threshold}</div>
                                    </td>
                                    <td className="p-4 text-center text-slate-700 font-medium">
                                        Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm">{item.last_updated}</td>
                                    <td className="p-4 text-right">
                                        {/* UPDATE: Aktifkan Button Edit & Delete */}
                                        <button 
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-600 hover:text-blue-800 font-medium mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-500 hover:text-red-700 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 transform transition-all">
                        <div className="flex justify-between items-center mb-6">
                            {/* UPDATE: Judul Dinamis */}
                            <h2 className="text-xl font-bold text-slate-800">
                                {editData ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                                    <input type="text" value={data.sku} onChange={e => setData('sku', e.target.value)} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <select 
                                        value={data.category_id} 
                                        onChange={e => setData('category_id', e.target.value)} 
                                        className="w-full px-4 py-2 border rounded-xl bg-white"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <div className="text-red-500 text-xs mt-1">{errors.category_id}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Stock</label>
                                    <input type="number" value={data.stock} onChange={e => setData('stock', e.target.value)} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Min Threshold</label>
                                    <input type="number" value={data.min_threshold} onChange={e => setData('min_threshold', e.target.value)} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1 text-slate-700">Unit Price (Max Rp99.000.000,-)</label>
                                    <input type="number" value={data.unit_price} onChange={e => setData('unit_price', e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
                                    {errors.unit_price && <p className="text-red-500 text-xs mt-1">{errors.unit_price}</p>}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition">Cancel</button>
                                <button type="submit" disabled={processing} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                                    {/* UPDATE: Label Button Dinamis */}
                                    {processing ? 'Saving...' : (editData ? 'Update Product' : 'Save Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}