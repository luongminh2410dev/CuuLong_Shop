'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BRAND_NAME, HOTLINE, LOGO_URL } from '@/lib/constants';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = pathname === '/';
  const isEquipment = pathname === '/thiet-bi';
  const isAbout = pathname === '/ve-chung-toi';
  const isFinancing = pathname === '/tai-chinh';

  // Hàm xử lý scroll đến section với offset cho header (chỉ cho mobile)
  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    // Đợi một chút để menu đóng trước khi scroll
    setTimeout(() => {
      const element = document.querySelector(hash);
      if (element) {
        // Chỉ áp dụng offset trên mobile (screen width < 1024px)
        const isMobile = window.innerWidth < 1024;
        const headerHeight = isMobile ? 64 : 0; // Mobile: 64px, Desktop: không cần offset vì scrollIntoView đã đủ
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <>
      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}
      >
        <div
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 w-[80%] max-w-sm h-full bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col rounded-l-[2.5rem] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="h-20 flex items-center justify-end px-8 border-b border-slate-50">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 bg-slate-100 text-slate-900 rounded-full hover:bg-orange-500 hover:text-white transition-all active:scale-90"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-grow flex flex-col justify-center px-8 space-y-6">
            <div className="flex justify-center pb-4">
              <img src={LOGO_URL} alt={BRAND_NAME} className="h-20 w-auto object-contain" />
            </div>
            <div className="space-y-2">
              {[
                { label: 'Trang chủ', href: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { label: 'Thiết bị', href: '/thiet-bi', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                { label: 'Tài chính', href: '/tai-chinh', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { label: 'Về chúng tôi', href: '/ve-chung-toi', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }
              ].map((item, idx) => {
                const isHashLink = item.href.includes('#');
                const isAboutPage = item.href === '/ve-chung-toi';
                const isFinancingPage = item.href === '/tai-chinh';
                const isActive = (item.href === '/' && isHome) || 
                                 (item.href === '/thiet-bi' && isEquipment) || 
                                 (isAboutPage && isAbout) ||
                                 (isFinancingPage && isFinancing);
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={isHashLink ? (e) => handleScrollToSection(e, item.href.split('#')[1] ? `#${item.href.split('#')[1]}` : '') : () => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-5 w-full p-5 rounded-[1.5rem] text-left transition-all duration-300 transform ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'} ${isActive ? 'bg-orange-500 text-white shadow-xl shadow-orange-200' : 'bg-white text-slate-800 hover:bg-slate-50 border border-transparent'
                      }`}
                    style={{ transitionDelay: `${150 + idx * 75}ms` }}
                  >
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                      </svg>
                    </div>
                    <span className="text-lg font-bold">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="p-8 border-t border-slate-50">
            <a
              href={`tel:${HOTLINE.replace(/\s/g, '')}`}
              className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-slate-200 active:scale-95 transition-transform"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.47 5.47l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 12.18 2 5V3z" />
              </svg>
              {HOTLINE}
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${isScrolled
        ? 'bg-white/70 backdrop-blur-xl border-slate-200/80'
        : 'bg-white/95 backdrop-blur-sm border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 lg:gap-2">
            <div className="p-0.5 lg:p-1">
              <img src={LOGO_URL} alt={BRAND_NAME} className="h-12 lg:h-16 w-auto object-contain" />
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className={`${isHome ? 'text-orange-500' : 'text-slate-600'} hover:text-orange-500 font-medium transition-colors`}>Trang chủ</Link>
            <Link href="/thiet-bi" className={`${isEquipment ? 'text-orange-500' : 'text-slate-600'} hover:text-orange-500 font-medium transition-colors`}>Thiết bị</Link>
            <Link href="/tai-chinh" className={`${isFinancing ? 'text-orange-500' : 'text-slate-600'} hover:text-orange-500 font-medium transition-colors`}>Tài chính</Link>
            <Link href="/ve-chung-toi" className={`${isAbout ? 'text-orange-500' : 'text-slate-600'} hover:text-orange-500 font-medium transition-colors`}>Về chúng tôi</Link>
          </div>

          <div className="flex items-center gap-2">
            <a href={`tel:${HOTLINE.replace(/\s/g, '')}`} className="bg-slate-900 text-white px-3.5 py-2 lg:px-6 lg:py-2.5 rounded-full text-xs lg:text-sm font-semibold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200 flex items-center gap-1.5 md:gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.47 5.47l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="hidden sm:inline">Hotline:</span> {HOTLINE}
            </a>
            <button
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all active:scale-90"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
