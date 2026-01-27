'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Equipment } from '@/types';
import { EQUIPMENT_DATA, LEASING_PARTNERS } from '@/constants';
import { BRAND_NAME, HOTLINE, ADDRESS } from '@/lib/constants';
import { formatPrice, getProductImage, handleImageError, scrollToImage } from '@/lib/utils';
import Navigation from './Navigation';

interface ProductDetailPageProps {
  product: Equipment;
}

export default function ProductDetailPage({ product }: ProductDetailPageProps) {
  // Lấy ảnh đầu tiên từ mảng images hoặc fallback về image (backward compatible)
  const productImages = product.images && product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : ['/images/fallback.png'];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUserScrollingRef = useRef(false);

  // Khởi tạo refs array khi số lượng ảnh thay đổi
  useEffect(() => {
    imageRefs.current = imageRefs.current.slice(0, productImages.length);
  }, [productImages.length]);

  // Hàm để reset timer
  const resetAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
  };

  // Scroll đến ảnh được chọn
  useEffect(() => {
    if (imageRefs.current[currentImageIndex] && scrollContainerRef.current && !isUserScrollingRef.current) {
      isScrollingRef.current = true;
      const targetImage = imageRefs.current[currentImageIndex];
      const container = scrollContainerRef.current;

      if (targetImage && container) {
        scrollToImage(container, targetImage);
      }

      // Reset flag sau khi scroll xong
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    }
  }, [currentImageIndex]);

  // Hàm khởi động lại auto-slide timer
  const startAutoSlide = () => {
    if (productImages.length > 1 && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % productImages.length;
          return nextIndex;
        });
      }, 4000);
    }
  };

  // Xử lý khi user scroll thủ công
  const handleScroll = () => {
    if (!scrollContainerRef.current || isScrollingRef.current) return;

    isUserScrollingRef.current = true;

    // Clear timeout cũ nếu có
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    // Tìm ảnh gần nhất với center của container
    let newIndex = 0;
    let minDistance = Infinity;

    imageRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const imageCenter = rect.left + rect.width / 2;
        const distance = Math.abs(imageCenter - containerCenter);

        if (distance < minDistance) {
          minDistance = distance;
          newIndex = index;
        }
      }
    });

    // Cập nhật index nếu thay đổi
    if (newIndex !== currentImageIndex && newIndex >= 0 && newIndex < productImages.length) {
      setCurrentImageIndex(newIndex);
      resetAutoSlide();

      // Khởi động lại timer sau khi user scroll xong
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
        startAutoSlide();
      }, 1000);
    }
  };

  // Auto-slide images mỗi 4 giây
  useEffect(() => {
    if (productImages.length <= 1 || isPaused) {
      resetAutoSlide();
      return;
    }

    resetAutoSlide();
    startAutoSlide();

    return () => {
      resetAutoSlide();
    };
  }, [productImages, isPaused]);

  // Hàm xử lý khi người dùng chọn ảnh (thumbnail hoặc dot)
  const handleImageSelect = (index: number) => {
    if (index === currentImageIndex) return;

    // Reset flag để đảm bảo scroll được trigger
    isUserScrollingRef.current = false;

    // Reset timer khi user chọn ảnh để đếm lại từ đầu
    resetAutoSlide();
    setCurrentImageIndex(index);

    // Scroll đến ảnh được chọn
    requestAnimationFrame(() => {
      if (imageRefs.current[index] && scrollContainerRef.current) {
        scrollToImage(scrollContainerRef.current, imageRefs.current[index]!);
      }
    });

    // Khởi động lại timer với thời gian mới (reset về 4 giây)
    setTimeout(() => {
      startAutoSlide();
    }, 1000);
  };

  const monthlyPayment = Math.round(product.price * 0.02);

  const relatedProducts = useMemo(
    () =>
      EQUIPMENT_DATA.filter(
        (item) => item.category === product.category && item.id !== product.id
      ).slice(0, 4),
    [product.category, product.id]
  );


  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navigation />

      <main className="flex-grow pt-16 lg:pt-20">
        {/* Breadcrumbs */}
        <section className="bg-slate-50 border-b border-slate-200 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-slate-500 hover:text-orange-500 transition-colors">
                Trang chủ
              </Link>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/thiet-bi" className="text-slate-500 hover:text-orange-500 transition-colors">
                Thiết bị
              </Link>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-900 font-medium">{product.name}</span>
            </nav>
          </div>
        </section>

        {/* Product Detail */}
        <section className="py-6 lg:py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
              {/* Product Images */}
              <div className="space-y-3">
                <div
                  className="relative bg-slate-100 rounded-2xl lg:rounded-3xl overflow-hidden h-[350px] lg:h-[400px] xl:h-[450px]"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {/* Container scroll ngang */}
                  <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="w-full h-full flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {productImages.map((img, index) => (
                      <div
                        key={`img-${index}`}
                        ref={(el) => {
                          imageRefs.current[index] = el;
                        }}
                        className="min-w-full h-full snap-center flex-shrink-0"
                      >
                        <img
                          src={img}
                          alt={`${product.name} - ${product.brand} - Thumbnail ${index + 1} - ${BRAND_NAME} Máy Công Trình`}
                          onError={handleImageError}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {product.brand}
                  </div>
                  {productImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {productImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handleImageSelect(index)}
                          className={`h-2 rounded-full transition-all ${index === currentImageIndex
                              ? 'w-8 bg-white'
                              : 'w-2 bg-white/50 hover:bg-white/75'
                            }`}
                          aria-label={`Xem ảnh ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {/* Thumbnail images gallery */}
                {productImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-1 max-w-xs">
                    {productImages.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => handleImageSelect(index)}
                        className={`aspect-square rounded overflow-hidden cursor-pointer border transition-all ${currentImageIndex === index ? 'border-orange-500 ring-1 ring-orange-200 border-2' : 'border-slate-200 hover:border-orange-300 border'
                          }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} - ${product.brand} - Thumbnail ${index + 1} - ${BRAND_NAME} Máy Công Trình`}
                          onError={handleImageError}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-5">
                <div>
                  <span className="inline-block px-2.5 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                    {product.category}
                  </span>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">{product.name}</h1>
                  <div className="flex items-center gap-2 text-slate-600 mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs lg:text-sm">{ADDRESS}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="p-5 bg-orange-50 rounded-2xl lg:rounded-3xl border border-orange-100">
                  <p className="text-xs lg:text-sm text-slate-600 mb-1.5">Giá bán</p>
                  <p className="text-3xl lg:text-4xl font-black text-orange-600 mb-3">{formatPrice(product.price)}</p>
                  <div className="pt-3 border-t border-orange-200">
                    <p className="text-xs lg:text-sm text-slate-600 mb-1">Gói trả góp ước tính</p>
                    <p className="text-xl lg:text-2xl font-bold text-slate-900">
                      {formatPrice(monthlyPayment)} <span className="text-sm font-normal text-slate-500">/ tháng</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1.5">* Giá chỉ mang tính chất tham khảo</p>
                  </div>
                </div>

                {/* Specifications */}
                <div className="bg-slate-50 rounded-2xl lg:rounded-3xl p-4 lg:p-5 border border-slate-100">
                  <h2 className="text-lg lg:text-xl font-bold text-slate-900 mb-3">Thông số kỹ thuật</h2>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1 uppercase font-bold">Trọng lượng</p>
                      <p className="text-base lg:text-lg font-bold text-slate-900">{product.specs.weight}</p>
                    </div>
                    <div className="bg-white p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1 uppercase font-bold">Công suất</p>
                      <p className="text-base lg:text-lg font-bold text-slate-900">{product.specs.power}</p>
                    </div>
                    <div className="bg-white p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1 uppercase font-bold">Dung tích</p>
                      <p className="text-base lg:text-lg font-bold text-slate-900">{product.specs.capacity}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={`tel:${HOTLINE.replace(/\s/g, '')}`}
                    className="flex-1 bg-slate-900 text-white py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-sm lg:text-base text-center hover:bg-orange-500 transition-colors shadow-lg shadow-slate-200"
                  >
                    Gọi ngay: {HOTLINE}
                  </a>
                  <Link
                    href="/tai-chinh"
                    className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-sm lg:text-base text-center transition-colors hover:bg-slate-50"
                  >
                    Tư vấn tài chính
                  </Link>
                </div>

                {/* Features */}
                <div className="bg-white border-2 border-slate-100 rounded-2xl lg:rounded-3xl p-4 lg:p-5">
                  <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-3">Cam kết từ {BRAND_NAME}</h3>
                  <ul className="space-y-2">
                    {[
                      'Hàng nhập khẩu chính ngạch 100%, đầy đủ CO/CQ',
                      'Bảo hành lên tới 24 tháng',
                      'Hỗ trợ trọn gói thủ tục đăng ký, đăng kiểm',
                      'Đội ngũ kỹ sư lưu động sẵn sàng hỗ trợ',
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 lg:w-5 lg:h-5 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs lg:text-sm text-slate-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="mt-12 lg:mt-16">
                <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">
                  Sản phẩm liên quan
                </h2>
                <p className="text-xs lg:text-sm text-slate-600 mb-6">
                  Các dòng máy cùng phân khúc, phù hợp để tham khảo thêm.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((item) => (
                    <Link
                      key={item.id}
                      href={`/thiet-bi/${item.id}`}
                      className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={getProductImage(item)}
                          alt={`${item.name} - ${item.brand} - ${item.category} - Sản phẩm liên quan - ${BRAND_NAME} Máy Công Trình`}
                          onError={handleImageError}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                          {item.brand}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 mb-3 text-[10px] text-slate-500">
                          <div className="bg-slate-50 p-2 rounded-xl text-center">
                            <span className="block font-semibold text-slate-800">
                              {item.specs.weight}
                            </span>
                            Cân nặng
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl text-center">
                            <span className="block font-semibold text-slate-800">
                              {item.specs.power}
                            </span>
                            Công suất
                          </div>
                        </div>
                        <div className="mt-auto">
                          <div className="text-orange-600 font-bold text-base mb-3">
                            {formatPrice(item.price)}
                          </div>
                          <div className="w-full bg-slate-900 text-white py-2.5 rounded-2xl font-semibold text-xs text-center group-hover:bg-orange-500 transition-colors">
                            Xem chi tiết
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Leasing Partners Section */}
        <section id="leasing" className="py-12 lg:py-24 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">Giải pháp tài chính</h2>
            <p className="text-sm lg:text-base text-slate-600 max-w-2xl mx-auto">
              Chúng tôi hợp tác với các định chế hàng đầu mang đến phương án tài chính tối ưu cho quý khách.
            </p>
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
                  {partner.highlights.map((h) => (
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
    </div>
  );
}
