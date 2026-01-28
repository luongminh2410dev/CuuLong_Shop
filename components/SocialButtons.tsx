'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ZALO_URL, FACEBOOK_URL, MESSENGER_URL, PHONE_NUMBERS } from '@/lib/constants';

export default function SocialButtons() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-[90]" ref={menuRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 lg:w-16 lg:h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-orange-500 transition-all active:scale-95 group relative"
        aria-label="Liên hệ"
      >
        <svg className="w-7 h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          {/* Social Media Options */}
          <div className="p-3 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Liên hệ qua mạng xã hội</p>
            <div className="space-y-1.5">
              {/* Zalo */}
              <a
                href={ZALO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border border-slate-200">
                  <Image
                    src="/images/zalo.png"
                    alt="Zalo"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-orange-500">Chat Zalo</span>
              </a>

              {/* Messenger */}
              <a
                href={MESSENGER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border border-slate-200">
                  <Image
                    src="/images/messenger.png"
                    alt="Messenger"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-orange-500">Chat Messenger</span>
              </a>

              {/* Facebook */}
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border border-slate-200">
                  <Image
                    src="/images/facebook.png"
                    alt="Facebook"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-orange-500">Facebook</span>
              </a>
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="p-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Gọi điện thoại</p>
            <div className="space-y-1.5">
              {PHONE_NUMBERS.map((phone: string, index: number) => (
                <a
                  key={index}
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-orange-500">{phone}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
