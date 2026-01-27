'use client';

import Image from 'next/image';
import { ZALO_URL, FACEBOOK_URL, MESSENGER_URL } from '@/lib/constants';

export default function SocialButtons() {
  return (
    <div className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-[90] flex flex-col gap-3">
      {/* Zalo Button */}
      <a
        href={ZALO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl border-2 border-slate-100 hover:border-slate-200 transition-all active:scale-95 group relative overflow-hidden hover:scale-110"
        aria-label="Liên hệ Zalo"
      >
        <Image
          src="/images/zalo.png"
          alt="Zalo"
          width={40}
          height={40}
          className="w-9 h-9 lg:w-10 lg:h-10 object-contain transition-transform group-hover:scale-110"
        />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Chat Zalo
        </span>
      </a>

      {/* Messenger Button */}
      <a
        href={MESSENGER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl border-2 border-slate-100 hover:border-slate-200 transition-all active:scale-95 group relative overflow-hidden hover:scale-110"
        aria-label="Chat Messenger"
      >
        <Image
          src="/images/messenger.png"
          alt="Messenger"
          width={40}
          height={40}
          className="w-9 h-9 lg:w-10 lg:h-10 object-contain transition-transform group-hover:scale-110"
        />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Chat Messenger
        </span>
      </a>

      {/* Facebook Button */}
      <a
        href={FACEBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl border-2 border-slate-100 hover:border-slate-200 transition-all active:scale-95 group relative overflow-hidden hover:scale-110"
        aria-label="Liên hệ Facebook"
      >
        <Image
          src="/images/facebook.png"
          alt="Facebook"
          width={40}
          height={40}
          className="w-9 h-9 lg:w-10 lg:h-10 object-contain transition-transform group-hover:scale-110"
        />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Facebook
        </span>
      </a>
    </div>
  );
}
