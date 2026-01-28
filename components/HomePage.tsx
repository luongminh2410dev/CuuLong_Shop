'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Equipment } from '@/types';
import { EQUIPMENT_DATA, LEASING_PARTNERS } from '@/constants';
import { BRAND_NAME, HOTLINE, ADDRESS, LOGO_URL, CATEGORIES } from '@/lib/constants';
import { formatPrice, getProductImage, handleImageError } from '@/lib/utils';
import { ZALO_URL, FACEBOOK_URL, MESSENGER_URL, PHONE_NUMBERS } from '@/lib/constants';
import Navigation from './Navigation';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const processedEquipment = useMemo(() => {
    let result = [...EQUIPMENT_DATA];

    if (selectedCategory !== 'Tất cả') {
      result = result.filter(item => {
        if (selectedCategory === 'Máy xúc đào') return item.category === 'Máy Xúc Đào';
        if (selectedCategory === 'Máy xúc lật Liugong') return item.category === 'Máy Xúc Lật' && item.brand === 'Liugong';
        if (selectedCategory === 'Máy xúc lật mini') return item.category === 'Máy Xúc Lật' && item.name.toLowerCase().includes('mini');
        if (selectedCategory === 'Máy ủi') return item.category === 'Máy Ủi';
        if (selectedCategory === 'San gạt') return item.category === 'Máy San Gạt';
        if (selectedCategory === 'Máy lu') return item.category === 'Máy Lu';
        return true;
      });
    }

    if (searchTerm.trim()) {
      const lowTerm = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(lowTerm) ||
        item.brand.toLowerCase().includes(lowTerm) ||
        item.category.toLowerCase().includes(lowTerm)
      );
    }

    if (sortOrder === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchTerm, sortOrder, selectedCategory]);


  const CategorySelector = ({ className = "" }: { className?: string }) => (
    <div className={`overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0 ${className}`}>
      <div className="flex flex-nowrap lg:flex-wrap gap-2 min-w-max lg:min-w-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2.5 lg:px-5 lg:py-2.5 rounded-2xl text-xs lg:text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
              : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-orange-200'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );

  const EquipmentCard = ({ item }: { item: Equipment }) => (
    <Link
      href={`/thiet-bi/${item.id}`}
      className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={getProductImage(item)}
          alt={`${item.name} - ${item.brand} - ${item.category} - ${BRAND_NAME} Máy Công Trình`}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] lg:text-xs font-bold text-slate-800 uppercase tracking-wider">
          {item.brand}
        </div>
      </div>
      <div className="p-5 lg:p-6 flex-grow flex flex-col">
        <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-2 leading-tight min-h-[3rem] line-clamp-2">{item.name}</h3>
        <div className="grid grid-cols-2 gap-2 mb-4 text-[10px] lg:text-xs text-slate-500">
          <div className="bg-slate-50 p-2 rounded-xl text-center">
            <span className="block font-semibold text-slate-800">{item.specs.weight}</span>
            Cân nặng
          </div>
          <div className="bg-slate-50 p-2 rounded-xl text-center">
            <span className="block font-semibold text-slate-800">{item.specs.power}</span>
            Công suất
          </div>
        </div>
        <div className="mt-auto">
          <div className="text-orange-600 font-bold text-lg lg:text-xl mb-4">{formatPrice(item.price)}</div>
          <div className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold text-sm hover:bg-orange-500 transition-colors text-center">
            Xem chi tiết
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navigation />

      <main className="flex-grow pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="relative py-12 lg:py-20 px-4 overflow-hidden animate-in fade-in duration-500">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-orange-100/50 rounded-full blur-3xl -z-10" />
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-2xl md:text-4xl lg:text-5xl lg:leading-[1.15] font-bold text-slate-900 leading-snug mb-4 lg:mb-6">
                MÁY CÔNG TRÌNH <span className="text-orange-500">{BRAND_NAME}</span>
              </h1>
              <p className="text-base lg:text-xl text-slate-600 mb-6 lg:mb-8 max-w-2xl mx-auto lg:mx-0">
                Phân phối thiết bị cơ giới chất lượng cao tại Hải Phòng cùng giải pháp tài chính linh hoạt nhất.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/thiet-bi"
                  className="bg-orange-500 text-white px-6 py-3.5 lg:px-8 lg:py-4 rounded-2xl font-bold text-base lg:text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-200 text-center"
                >
                  Xem danh mục máy
                </Link>
                <a href={`tel:${HOTLINE.replace(/\s/g, '')}`} className="bg-white border-2 border-slate-200 text-slate-700 px-6 py-3.5 lg:px-8 lg:py-4 rounded-2xl font-bold text-base lg:text-lg hover:bg-slate-50 transition-all text-center">
                  Liên hệ ngay
                </a>
              </div>
            </div>
            <div className="flex-1 w-full max-w-lg lg:max-none relative mt-4 lg:mt-0">
              <div className="bg-white p-2 lg:p-4 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-2xl rotate-1 lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="/images/hero/hero.jpg"
                  alt="Máy công trình Cửu Long - Phân phối máy xúc đào, máy xúc lật, máy ủi chất lượng cao tại Hải Phòng"
                  onError={handleImageError}
                  className="rounded-[1.2rem] lg:rounded-[2rem] w-full h-[250px] lg:h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Service Commitment Section */}
        <section className="py-12 lg:py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="bg-white p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:border-orange-200 transition-all duration-300">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-orange-100 rounded-xl lg:rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors">
                  <svg className="w-6 h-6 lg:w-8 lg:h-8 text-orange-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-3 lg:mb-4">Đảm Bảo Chất Lượng</h3>
                <p className="text-slate-600 text-xs lg:text-sm leading-relaxed">
                  Toàn bộ máy móc tại {BRAND_NAME} đều là hàng nhập khẩu chính ngạch 100%, có đầy đủ CO/CQ.
                </p>
              </div>

              <div className="bg-white p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:border-orange-200 transition-all duration-300">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-xl lg:rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <svg className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-3 lg:mb-4">Bảo Hành Dài Hạn</h3>
                <p className="text-slate-600 text-xs lg:text-sm leading-relaxed">
                  Cam kết bảo hành lên tới 24 tháng. Đội ngũ kỹ sư lưu động sẵn sàng hỗ trợ tận nơi.
                </p>
              </div>

              <div className="bg-white p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:border-orange-200 transition-all duration-300">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-xl lg:rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                  <svg className="w-6 h-6 lg:w-8 lg:h-8 text-green-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-3 lg:mb-4">Hỗ Trợ Toàn Diện</h3>
                <p className="text-slate-600 text-xs lg:text-sm leading-relaxed">
                  Hỗ trợ trọn gói thủ tục đăng ký, đăng kiểm giúp doanh nghiệp an tâm vận hành.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Equipment Grid */}
        <section id="equipment" className="py-12 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-8 lg:mb-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Sản phẩm nổi bật</h2>
                  <div className="w-16 h-1.5 bg-orange-500 rounded-full" />
                </div>
                <Link
                  href="/thiet-bi"
                  className="text-orange-600 font-bold hover:gap-2 flex items-center transition-all text-sm lg:text-base"
                >
                  Xem tất cả
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <CategorySelector className="mb-4 lg:mb-8" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {processedEquipment.slice(0, 8).map((item) => (
                <EquipmentCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Leasing Partners */}
        <section id="leasing" className="py-12 lg:py-24 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">Giải pháp tài chính</h2>
            <p className="text-sm lg:text-base text-slate-600 max-w-2xl mx-auto mb-6">Chúng tôi hợp tác với các định chế hàng đầu mang đến phương án tối ưu cho quý khách tại Hải Phòng và toàn quốc.</p>
            <Link
              href="/tai-chinh"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold text-sm lg:text-base transition-colors shadow-lg shadow-orange-200"
            >
              <span>Tìm hiểu thêm về giải pháp tài chính</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {LEASING_PARTNERS.map((partner) => (
              <div key={partner.name} className="bg-white p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-sm border border-slate-200 hover:border-orange-500 transition-colors group flex flex-col">
                <div className="h-16 lg:h-20 flex flex-col items-center justify-center mb-6 lg:mb-8 gap-2">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-slate-50 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:bg-orange-50 transition-colors overflow-hidden p-2">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{partner.name.split(' ')[0]}</div>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-3 lg:mb-4">{partner.name}</h3>
                <p className="text-slate-600 mb-6 text-xs lg:text-sm leading-relaxed flex-grow">{partner.description}</p>
                <div className="space-y-2 lg:space-y-3 mb-6 lg:mb-8">
                  {partner.highlights.map(h => (
                    <div key={h} className="flex items-center gap-2 text-xs lg:text-sm font-medium text-slate-700">
                      <div className="w-4 h-4 lg:w-5 lg:h-5 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {h}
                    </div>
                  ))}
                </div>
                <a href={partner.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-orange-600 font-bold text-sm">
                  Website đối tác
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Product Detail Modal */}
      {selectedEquipment && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 lg:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedEquipment(null)} />
          <div className="relative w-full max-w-6xl bg-white rounded-[1.5rem] lg:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] lg:max-h-[90vh] animate-in slide-in-from-bottom-8 duration-500">
            <button onClick={() => setSelectedEquipment(null)} className="absolute top-4 right-4 z-10 w-10 h-10 lg:w-12 lg:h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-orange-500 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="h-48 sm:h-64 md:h-auto md:w-1/2 bg-slate-100 shrink-0">
              <img src={getProductImage(selectedEquipment)} alt={selectedEquipment.name} onError={handleImageError} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-6 lg:p-12 overflow-y-auto">
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 lg:mb-4">{selectedEquipment.category}</span>
              <h2 className="text-xl lg:text-4xl font-bold text-slate-900 mb-4 lg:mb-6">{selectedEquipment.name}</h2>
              <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-8">
                <div className="p-3 lg:p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                  <p className="text-[9px] text-slate-500 mb-1 uppercase font-bold">Trọng lượng</p>
                  <p className="font-bold">{selectedEquipment.specs.weight}</p>
                </div>
                <div className="p-3 lg:p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                  <p className="text-[9px] text-slate-500 mb-1 uppercase font-bold">Công suất</p>
                  <p className="font-bold">{selectedEquipment.specs.power}</p>
                </div>
              </div>
              <div className="p-4 lg:p-6 bg-orange-50 rounded-[1.2rem] lg:rounded-3xl mb-6 lg:mb-8 border border-orange-100">
                <p className="font-bold text-slate-900 mb-1 text-sm lg:text-base">Gói trả góp ước tính:</p>
                <p className="text-xl lg:text-3xl font-black text-orange-600">{formatPrice(Math.round(selectedEquipment.price * 0.02))} <span className="text-[10px] lg:text-sm text-slate-500 font-normal">/ tháng</span></p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={`tel:${HOTLINE.replace(/\s/g, '')}`} className="flex-1 bg-slate-900 text-white py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-sm lg:text-base shadow-lg shadow-slate-200 text-center hover:bg-orange-500 transition-colors">Gọi ngay</a>
                <Link href="/tai-chinh" onClick={() => setSelectedEquipment(null)} className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-sm lg:text-base transition-colors hover:bg-slate-50 text-center">Tài chính</Link>
              </div>
            </div>
          </div>
        </div>
      )}


      <footer className="bg-slate-900 text-slate-400 py-12 lg:py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 text-sm">
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1">
                <img src={LOGO_URL} alt={BRAND_NAME} className="h-12 w-auto object-contain" />
              </div>
            </div>
            <p className="max-w-lg leading-relaxed uppercase font-bold text-xs">{BRAND_NAME} - NHẬP KHẨU & PHÂN PHỐI MÁY CÔNG TRÌNH</p>
            <p className="max-w-xs leading-relaxed">Thiết bị cơ giới chất lượng hàng đầu và giải pháp tài chính linh hoạt cho doanh nghiệp.</p>
            <p className="text-slate-300">Địa chỉ: {ADDRESS}</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Liên kết</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-orange-500 transition-colors">Trang chủ</Link></li>
              <li><Link href="/thiet-bi" className="hover:text-orange-500 transition-colors">Thiết bị</Link></li>
              <li><Link href="/#leasing" className="hover:text-orange-500 transition-colors">Giải pháp tài chính</Link></li>
              <li><Link href="/ve-chung-toi" className="hover:text-orange-500 transition-colors">Về chúng tôi</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Liên hệ hỗ trợ</h4>
            <ul className="space-y-2 mb-4">
              <li><a href="#" className="hover:text-orange-500 transition-colors text-slate-300">Chính sách bảo hành</a></li>
            </ul>
            <ul className="space-y-2 mb-4">
              {PHONE_NUMBERS.map((phone, index) => {
                const formattedPhone = phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
                return (
                  <li key={index}>
                    <a 
                      href={`tel:${phone}`} 
                      className="flex items-center gap-2 text-slate-300 hover:text-orange-500 transition-colors text-sm group"
                    >
                      <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{formattedPhone}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4">
              <h5 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">Mạng xã hội</h5>
              <div className="flex gap-3">
                <a
                  href={ZALO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 hover:bg-[#0068FF] rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Zalo"
                >
                  <Image
                    src="/images/zalo.png"
                    alt="Zalo"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                  />
                </a>
                <a
                  href={MESSENGER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 hover:bg-[#0084FF] rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Messenger"
                >
                  <Image
                    src="/images/messenger.png"
                    alt="Messenger"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                  />
                </a>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 hover:bg-[#1877F2] rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Image
                    src="/images/facebook.png"
                    alt="Facebook"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs opacity-50 uppercase tracking-[0.2em]">
          © 2024 {BRAND_NAME} MÁY CÔNG TRÌNH. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
