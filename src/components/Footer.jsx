import React from 'react';
import FAFLogo from '../assets/FAF-Logo.png';

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 py-20">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
                {/* Left Column - Logo and Description */}
                <div className="col-span-2 space-y-6">
                    <div className="flex items-center">
                        <img src={FAFLogo} alt="FAF" className="h-10 w-auto" />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                        The modern operating system for the independent workforce. Fast hiring, accountable contracts, and fair payments.
                    </p>
                    <div className="flex gap-4">
                        <a className="text-gray-500 hover:text-blue-600 transition-colors" href="#">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M15 11a3 3 0 11-6 0m6 0a3 3 0 10-6 0m6 0h.01M21 11a3 3 0 11-6 0m6 0a3 3 0 10-6 0m6 0h.01" />
                            </svg>
                        </a>
                        <a className="text-gray-500 hover:text-blue-600 transition-colors" href="#">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </a>
                        <a className="text-gray-500 hover:text-blue-600 transition-colors" href="#">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Platform Column */}
                <div className="space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-gray-900">Platform</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><a className="hover:text-blue-600" href="#">Find Work</a></li>
                        <li><a className="hover:text-blue-600" href="#">Hire Talent</a></li>
                        <li><a className="hover:text-blue-600" href="#">Escrow Safety</a></li>
                        <li><a className="hover:text-blue-600" href="#">Global Payroll</a></li>
                    </ul>
                </div>

                {/* Company Column */}
                <div className="space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-gray-900">Company</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><a className="hover:text-blue-600" href="#">About Us</a></li>
                        <li><a className="hover:text-blue-600" href="#">Careers</a></li>
                        <li><a className="hover:text-blue-600" href="#">Press Kit</a></li>
                        <li><a className="hover:text-blue-600" href="#">Contact</a></li>
                    </ul>
                </div>

                {/* Legal Column */}
                <div className="space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-gray-900">Legal</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><a className="hover:text-blue-600" href="#">Privacy Policy</a></li>
                        <li><a className="hover:text-blue-600" href="#">Terms of Service</a></li>
                        <li><a className="hover:text-blue-600" href="#">Cookie Policy</a></li>
                    </ul>
                </div>

                {/* Support Column */}
                <div className="space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-gray-900">Support</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><a className="hover:text-blue-600" href="#">Help Center</a></li>
                        <li><a className="hover:text-blue-600" href="#">Community</a></li>
                        <li><a className="hover:text-blue-600" href="#">API Docs</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Line */}
            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-gray-600">© 2026 FAF Workforce Technologies. All rights reserved.</p>
                <div className="flex items-center gap-6 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> Systems Operational
                    </span>
                    <span className="font-medium text-gray-900">Proudly powered by FAF</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
