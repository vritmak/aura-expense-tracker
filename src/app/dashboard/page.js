"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { 
  Plus, Wallet, ArrowLeft, X, Loader2, Trash2, 
  TrendingUp, BarChart3, PieChart as PieIcon, 
  Calendar, Info
} from 'lucide-react';
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function Dashboard() {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false); // Fix for Hydration Error
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  // Fix: Wait until the component is mounted in the browser
  useEffect(() => {
    setMounted(true);
    if (user) fetchExpenses();
  }, [user]);

  async function fetchExpenses() {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) setExpenses(data);
  }

  // --- SMART ANALYTICS LOGIC ---
  const analytics = useMemo(() => {
    if (expenses.length === 0) return { 
      currentMonthTotal: 0, 
      highestMonthTotal: 0, 
      avgMonthTotal: 0, 
      currentMonthExpenses: [] 
    };

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Grouping by Month
    const monthlyGroups = expenses.reduce((acc, exp) => {
      const date = new Date(exp.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[key] = (acc[key] || 0) + exp.amount;
      return acc;
    }, {});

    const monthlyTotals = Object.values(monthlyGroups);
    const highestMonthTotal = Math.max(...monthlyTotals);
    const avgMonthTotal = monthlyTotals.reduce((a, b) => a + b, 0) / monthlyTotals.length;

    // Filter Current Month
    const currentMonthExpenses = expenses.filter(exp => {
      const date = new Date(exp.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return key === currentMonthKey;
    });

    const currentMonthTotal = currentMonthExpenses.reduce((a, b) => a + b.amount, 0);

    return { currentMonthTotal, highestMonthTotal, avgMonthTotal, currentMonthExpenses };
  }, [expenses]);

  // --- PIE CHART DATA ---
  const chartData = useMemo(() => {
    const categories = analytics.currentMonthExpenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [analytics]);

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // --- ACTIONS ---
  async function addExpense(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('expenses').insert([
      { name, amount: parseFloat(amount), category, user_id: user.id }
    ]);
    if (!error) {
      setName(""); setAmount(""); setCategory("Food"); setIsModalOpen(false); fetchExpenses();
    }
    setLoading(false);
  }

  async function deleteExpense(id) {
    if (confirm("Permanently remove this entry?")) {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (!error) fetchExpenses();
    }
  }

  // If not mounted, return a simple skeleton to avoid hydration mismatch
  if (!mounted) return <div className="min-h-screen bg-[#fafafa]" />;

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans pb-20 selection:bg-indigo-100">
      
      {/* Navbar */}
      <nav className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-4 text-indigo-600 uppercase font-black tracking-tighter text-2xl italic">
          <a href="/"><ArrowLeft size={24} className="text-slate-400 hover:text-indigo-600 transition-colors"/></a> Aura
        </div>
        <div className="flex items-center gap-4">
           <span className="text-xs font-bold text-slate-400 uppercase hidden sm:block">Hello, {user?.firstName}</span>
           <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6">
        
        {/* Row 1: Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="md:col-span-2 bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 flex flex-col justify-between group cursor-pointer hover:bg-indigo-700 transition-all" onClick={() => setIsModalOpen(true)}>
            <div>
               <div className="flex justify-between items-start">
                 <Plus size={32} className="mb-4 group-hover:rotate-90 transition-transform duration-500"/>
                 <span className="bg-white/10 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">Monthly Spend</span>
               </div>
               <h2 className="text-4xl font-black tracking-tighter">
                 ₹{analytics.currentMonthTotal.toLocaleString('en-IN')}
               </h2>
               <p className="opacity-70 font-bold uppercase text-[10px] tracking-[0.2em] mt-1 italic tracking-tighter">Total for this month</p>
            </div>
            <p className="text-[10px] font-black mt-8 bg-white/20 w-fit px-4 py-2 rounded-full uppercase tracking-widest">Add Record +</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="bg-amber-50 w-fit p-3 rounded-2xl text-amber-600 mb-4"><TrendingUp size={20}/></div>
            <h3 className="text-2xl font-black tracking-tighter text-slate-800">
              ₹{analytics.highestMonthTotal.toLocaleString('en-IN')}
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">All-Time Peak Month</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="bg-emerald-50 w-fit p-3 rounded-2xl text-emerald-600 mb-4"><BarChart3 size={20}/></div>
            <h3 className="text-2xl font-black tracking-tighter text-slate-800">
              ₹{analytics.avgMonthTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Monthly Average</p>
          </div>
        </div>

        {/* Row 2: Analysis & History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Analysis Card */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <PieIcon size={18} className="text-indigo-600"/>
                <h3 className="font-black text-sm uppercase tracking-[0.1em] text-slate-400 italic">Month Analysis</h3>
              </div>
            </div>
            
            {analytics.currentMonthExpenses.length > 0 ? (
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" stroke="none">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: 'bold' }} />
                    <Legend verticalAlign="bottom" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-300">
                 <PieIcon size={48} className="opacity-10"/>
                 <p className="italic text-sm font-medium text-center">No transactions recorded for this month.</p>
              </div>
            )}
          </div>

          {/* History List */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <h3 className="font-black text-sm uppercase tracking-[0.1em] text-slate-400">Transaction History</h3>
              <span className="text-[10px] font-black bg-indigo-50 px-3 py-1 rounded-full text-indigo-600 uppercase tracking-tighter">{expenses.length} Total Records</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50 px-4 pb-4 scrollbar-hide">
              {expenses.map((item) => (
                <div key={item.id} className="p-6 flex justify-between items-center hover:bg-slate-50/80 transition group rounded-[2rem]">
                  <div className="flex items-center gap-5">
                    <div className="bg-white border border-slate-100 p-3 rounded-2xl text-slate-400 group-hover:text-indigo-600 transition-all duration-300">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 tracking-tight">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                        {new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • {item.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <p className="font-black text-slate-900 tracking-tighter text-lg">-₹{item.amount.toLocaleString('en-IN')}</p>
                    <button onClick={() => deleteExpense(item.id)} className="text-slate-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 p-2"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Manual Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-900 transition-colors"><X size={28}/></button>
            <h2 className="text-3xl font-black tracking-tighter mb-10">Record Entry</h2>
            <form onSubmit={addExpense} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Merchant Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="e.g. Starbucks" className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition outline-none font-bold text-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Amount (₹)</label>
                <input required value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" placeholder="0.00" className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition outline-none font-black text-slate-800 text-2xl" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800 appearance-none">
                  <option>Food</option><option>Transport</option><option>Shopping</option><option>Bills</option><option>Entertainment</option><option>Others</option>
                </select>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex justify-center items-center gap-3">
                {loading ? <Loader2 className="animate-spin" /> : "Save Transaction"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}