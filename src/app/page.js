"use client";

import { SignInButton, SignedIn, SignedOut, UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Sparkles, ArrowRight, ShieldCheck, Zap, BarChart3, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-indigo-100">
      
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-blue-50/50 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
            <Sparkles size={20} fill="currentColor" />
          </div>
          <span className="font-bold text-2xl tracking-tighter italic text-indigo-600 uppercase">Aura</span>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-8">
          <ClerkLoading>
            <Loader2 className="animate-spin text-slate-300" size={20} />
          </ClerkLoading>

          <ClerkLoaded>
            <SignedOut>
              <div className="flex items-center gap-6">
                <SignInButton mode="modal">
                  <button className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition shadow-sm cursor-pointer">
                    Get Started
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-bold text-indigo-600 hover:underline">
                  My Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full mb-10 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Beta Access</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-slate-900 to-slate-500 bg-clip-text text-transparent italic">
          Finance with <br />
          <span className="text-indigo-600">Pure Clarity.</span>
        </h1>

        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-14 font-medium leading-relaxed text-pretty">
          Aura simplifies your spending habits so you can focus on what matters. Minimal design for maximum financial insight.
        </p>
        
        {/* Auth Buttons Container */}
        <div className="flex flex-col items-center justify-center gap-6 min-h-[80px]">
          <ClerkLoading>
             <div className="bg-slate-100 animate-pulse w-64 h-16 rounded-[2rem]" />
          </ClerkLoading>

          <ClerkLoaded>
            <SignedOut>
              <div className="flex flex-col items-center gap-4">
                <SignInButton mode="modal">
                  <button className="group flex items-center gap-3 bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 hover:-translate-y-1 active:scale-95">
                    Start Your Aura
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <p className="text-sm font-bold text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">
                    Already have an account? <span className="text-indigo-600 underline">Sign In</span>
                  </p>
                </SignInButton>
              </div>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard" className="group flex items-center gap-3 bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 hover:-translate-y-1 active:scale-95">
                Go to Dashboard
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </SignedIn>
          </ClerkLoaded>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 text-left">
          {[
            { icon: <Zap className="text-amber-500" />, title: "Instant Insights", desc: "See where your money goes the moment you spend it." },
            { icon: <ShieldCheck className="text-emerald-500" />, title: "Secure by Design", desc: "Your data is encrypted and strictly private." },
            { icon: <BarChart3 className="text-indigo-500" />, title: "Visual Trends", desc: "Beautifully simple charts that reveal the 'why' behind spending." }
          ].map((feature, i) => (
            <div key={i} className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6 bg-slate-50 w-fit p-4 rounded-2xl">{feature.icon}</div>
              <h3 className="font-bold text-xl mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}