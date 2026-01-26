import React from 'react';
import MainLayout from '../Layouts/MainLayout.jsx';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    ReferenceLine
} from 'recharts'; 
import { Head } from '@inertiajs/react'; // UPDATE: Gunakan Head untuk title tab

export default function Dashboard({ summary, recentLogs, chartData, products, selectedProductId }) {
    return (
        <MainLayout>
            <Head title="Dashboard Overview" />
            
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">SmartStock AI</h1>
                <p className="text-gray-600">Inventory Overview & Statistics</p>
            </header>            

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Stock" value={summary.total_stock} color="blue" />
                <StatCard title="Low Stock Alerts" value={summary.low_stock} color="red" />
                <StatCard title="Pending Approvals" value={summary.pending_requests} color="yellow" />
                <StatCard title="Total Loss (Qty)" value={summary.total_loss} color="gray" />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-slate-100">
                <div className="flex items-center gap-2 mb-8">
                    <span className="p-2 bg-blue-50 rounded-lg text-xl text-blue-600 font-bold">AI</span>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Supply & Demand Analysis</h2>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Real-time Data Sync</p>
                    </div>
                    {/* Legend Manual */}
                    <div className="ml-auto flex gap-4 text-xs font-bold uppercase">
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <span className="w-3 h-3 rounded-full bg-slate-300"></span> History
                        </div>
                        <div className="flex items-center gap-1.5 text-blue-500">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span> AI Prediction
                        </div>
                    </div>
                </div>

                <div className="h-[350px] w-full overflow-x-auto">
                    {/* Pembungkus Responsive Container dengan minWidth agar bisa di-slide di mobile */}
                    <div className="min-w-[800px] h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                {/* Garis History */}
                                <Area 
                                    type="monotone" 
                                    dataKey="actual" 
                                    stroke="#94a3b8" 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#colorActual)"
                                    connectNulls={true} // Menghubungkan ke titik prediksi terdekat
                                />
                                {/* Garis Prediction */}
                                <Area 
                                    type="monotone" 
                                    dataKey="prediction" 
                                    stroke="#3b82f6" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#colorPred)"
                                    connectNulls={true}
                                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                />
                                {/* Garis Tengah Penanda Hari Ini */}
                                <ReferenceLine x={chartData.find(d => d.actual && d.prediction === null)?.date} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'Today', position: 'top', fill: '#f43f5e', fontSize: 10, fontWeight: 'bold' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <p className="mt-4 text-[10px] text-center text-slate-400 font-medium italic italic">Tip: Use horizontal scroll on smaller screens to view full timeline.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Recent Approved Transactions</h2>
                    <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-500 font-medium">Last 5 Activities</span>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-bold">Product</th>
                            <th className="p-4 font-bold text-center">Category</th>
                            <th className="p-4 font-bold text-center">Qty</th>
                            <th className="p-4 font-bold text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {recentLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50 transition text-sm">
                                <td className="p-4 font-medium text-slate-800">{log.product.name}</td>
                                <td className="p-4 text-center">
                                    {/* UPDATE: Warna badge yang lebih spesifik berdasarkan kategori */}
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                        log.category === 'sale' ? 'bg-blue-100 text-blue-700' :
                                        log.category === 'damaged' ? 'bg-red-100 text-red-700' :
                                        log.category === 'distributed' ? 'bg-emerald-100 text-emerald-700' :
                                        'bg-slate-100 text-slate-700'
                                    }`}>
                                        {log.category}
                                    </span>
                                </td>
                                <td className="p-4 text-center font-bold text-slate-700">{log.quantity}</td>
                                <td className="p-4 text-right text-gray-500">{new Date(log.created_at).toLocaleDateString('en-GB')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}

function StatCard({ title, value, color }) {
    const colors = {
        blue: 'border-blue-500 text-blue-600',
        red: 'border-red-500 text-red-600',
        yellow: 'border-yellow-500 text-yellow-600',
        gray: 'border-slate-500 text-slate-600'
    };
    return (
        <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${colors[color]} hover:shadow-md transition cursor-default`}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
            <p className="text-3xl font-black mt-1 text-slate-800">{value}</p>
        </div>
    );
}