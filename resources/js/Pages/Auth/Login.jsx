import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';

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
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-blue-600">SmartStock AI</h1>
                    <p className="text-slate-500 mt-2">Log in to manage your inventory</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                        <input 
                            id="email"
                            type="email" 
                            value={values.email} 
                            onChange={handleChange}
                            placeholder="admin@smartstock.ai"
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                        <input 
                            id="password"
                            type="password" 
                            value={values.password} 
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition transform active:scale-95"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    &copy; 2026 SmartStock AI System
                </div>
            </div>
        </div>
    );
}