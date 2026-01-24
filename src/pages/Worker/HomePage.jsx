import React from 'react';
import TeamImage from '../../assets/istockphoto-1947499362-612x612.jpg';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-blue-100">
            <main className="max-w-7xl mx-auto px-6">
                {/* Hero Section */}
                <section className="py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                            </span>
                            Join 50,000+ Professionals
                        </div>

                        {/* Headline */}
                        <h1 className="text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                            Fast.<br />Accountable.<br /><span className="text-blue-600">Fair.</span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                            The future of work is FAF. Secure your next move with escrow-backed gigs or build your career with direct brand connections.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-600/20 hover:-translate-y-0.5">
                                Start Working
                            </button>
                            <button className="bg-white border border-gray-200 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all hover:bg-gray-50">
                                Hire Top Talent
                            </button>
                        </div>
                    </div>

                    {/* Image Placeholder */}
                    <div className="flex-1 w-full relative group">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-transparent blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
                            <img
                                src={TeamImage}
                                alt="Professional team working together"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-blue-200/20 pointer-events-none"></div>
                        </div>
                    </div>
                </section>

                {/* Trust Bar */}
                <section className="py-12 border-y border-gray-100 overflow-hidden">
                    <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-8">Trusted by industry leaders</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 font-black text-2xl">⚡️ VOLT</div>
                        <div className="flex items-center gap-2 font-black text-2xl">HEXAGON</div>
                        <div className="flex items-center gap-2 font-black text-2xl">MIRA</div>
                        <div className="flex items-center gap-2 font-black text-2xl">KINETIC</div>
                        <div className="flex items-center gap-2 font-black text-2xl">ORBIT</div>
                    </div>
                </section>

                {/* Split Job Cards Section */}
                <section className="py-24 space-y-12">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl font-extrabold tracking-tight mb-4">How do you want to work?</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">Whether you're looking for an immediate side hustle or your next big career milestone, we've built the tools to protect you.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Short Term Card */}
                        <div className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-600/50 transition-all hover:shadow-xl hover:shadow-blue-600/5">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Short-term Protected Jobs</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Escrow-backed daily pay for immediate tasks. Every hour is secured by our system before you even start. Get paid within 24 hours of completion.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Guaranteed Payment Escrow
                                </li>
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Instant Rating Growth
                                </li>
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    24h Dispute Resolution
                                </li>
                            </ul>
                            <a className="inline-flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all" href="#">
                                Browse Gig Marketplace
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                        </div>

                        {/* Long Term Card */}
                        <div className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-600/50 transition-all hover:shadow-xl hover:shadow-blue-600/5">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Long-term Connections</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Build your career with direct connections to brands looking for permanent talent. Skip the recruiter black hole and talk directly to hiring managers.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Direct DM to Founders
                                </li>
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Equity & Benefits Support
                                </li>
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Portfolio Verification
                                </li>
                            </ul>
                            <a className="inline-flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all" href="#">
                                Explore Full-time Roles
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Wide Search CTA Section */}
                <section className="py-24">
                    <div className="bg-gray-900 rounded-[2rem] p-8 md:p-16 text-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_#1e69f6_0%,_transparent_40%)]"></div>
                        </div>
                        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Ready to start your next move?</h2>
                            <p className="text-white/60 text-lg">Join the fastest growing community for high-impact talent.</p>
                            <div className="flex flex-col md:flex-row gap-2 max-w-2xl mx-auto">
                                <div className="flex-1 relative group">
                                    <input
                                        className="w-full bg-white/10 border-white/20 rounded-xl px-6 py-4 text-white placeholder:text-white/40 focus:ring-2 focus:ring-blue-600 focus:bg-white/20 transition-all outline-none border-none"
                                        placeholder="Try 'Product Designer' or 'Solidity Dev'..."
                                        type="text"
                                    />
                                </div>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg whitespace-nowrap">
                                    Search All Jobs
                                </button>
                            </div>
                            <div className="flex flex-wrap justify-center gap-3 pt-4">
                                <span className="text-xs text-white/40 uppercase font-bold tracking-widest w-full mb-2">Trending</span>
                                <a className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors" href="#">UI/UX Design</a>
                                <a className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors" href="#">Rust Developer</a>
                                <a className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors" href="#">Content Marketing</a>
                                <a className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors" href="#">Growth Hacker</a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;
