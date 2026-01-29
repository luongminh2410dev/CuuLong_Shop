'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Equipment } from '@/types';
import { EQUIPMENT_DATA } from '@/constants';
import { BRAND_NAME, CATEGORIES } from '@/lib/constants';
import { formatPrice, getProductImage, handleImageError } from '@/lib/utils';
import Navigation from './Navigation';

export default function EquipmentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

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


  const CategorySelector = () => (
    <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0">
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
        <section className="py-8 lg:py-12 bg-white min-h-screen">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col gap-6 lg:gap-8 mb-8 lg:mb-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <Link
                    href="/"
                    className="flex items-center text-slate-500 hover:text-orange-500 mb-2 lg:mb-4 transition-colors font-medium text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Trang chủ
                  </Link>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Danh mục thiết bị {BRAND_NAME}</h1>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative group flex-grow md:min-w-[300px]">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Tìm theo tên máy..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 lg:py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as any)}
                      className="block w-full md:w-56 pl-4 pr-10 py-3.5 lg:py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-700 font-bold text-sm appearance-none shadow-sm"
                    >
                      <option value="none">Sắp xếp: Mặc định</option>
                      <option value="asc">Giá: Thấp đến cao</option>
                      <option value="desc">Giá: Cao đến thấp</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2.5rem] border border-slate-100">
                <h4 className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest mb-3 lg:mb-4">Bộ lọc sản phẩm</h4>
                <CategorySelector />
              </div>
            </div>

            {processedEquipment.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {processedEquipment.map((item) => (
                  <EquipmentCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-slate-50 rounded-[1.5rem] lg:rounded-[3rem] border-2 border-dashed border-slate-200">
                <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-2">Không tìm thấy sản phẩm</h3>
                <button
                  onClick={() => { setSearchTerm(''); setSortOrder('none'); setSelectedCategory('Tất cả'); }}
                  className="mt-4 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Product Detail Modal - same as HomePage */}
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
                <button className="flex-1 bg-slate-900 text-white py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-sm lg:text-base shadow-lg shadow-slate-200">Nhận báo giá</button>
                <Link href="/#leasing" onClick={() => setSelectedEquipment(null)} className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-sm lg:text-base transition-colors hover:bg-slate-50 text-center">Tài chính</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
