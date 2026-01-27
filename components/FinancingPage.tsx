'use client';

import Navigation from './Navigation';
import { BRAND_NAME, HOTLINE, ADDRESS, LOGO_URL } from '@/lib/constants';
import { LEASING_PARTNERS } from '@/constants';
import { handleImageError } from '@/lib/utils';
import Link from 'next/link';

export default function FinancingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navigation />

      <main className="flex-grow pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 py-16 lg:py-24 text-white overflow-hidden">
          {/* Decorative pattern background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-block bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
                Giải pháp tài chính
              </div>
              <h1 className="text-4xl lg:text-6xl font-black mb-6">
                Giải quyết bài toán chi phí
              </h1>
              <p className="text-xl lg:text-2xl text-orange-50 max-w-3xl mx-auto mb-8 font-medium">
                Hợp tác với các đối tác cho thuê tài chính hàng đầu để mang đến phương án tài chính tối ưu cho doanh nghiệp của bạn
              </p>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-12 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Tại sao chọn giải pháp tài chính tại {BRAND_NAME}?
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Chúng tôi hiểu rằng việc đầu tư vào máy công trình là một quyết định lớn. 
                Vì vậy, chúng tôi hợp tác với các định chế tài chính uy tín hàng đầu để mang đến 
                những giải pháp linh hoạt nhất, giúp bạn giải quyết bài toán chi phí một cách hiệu quả.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  title: 'Hạn mức cao',
                  description: 'Hỗ trợ lên đến 90% giá trị thiết bị, giảm áp lực vốn ban đầu',
                  icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                },
                {
                  title: 'Thời hạn linh hoạt',
                  description: 'Thời hạn vay từ 12 tháng đến 60 tháng, phù hợp với khả năng tài chính',
                  icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                },
                {
                  title: 'Thủ tục đơn giản',
                  description: 'Quy trình nhanh gọn, hồ sơ tối giản, giải ngân nhanh chóng',
                  icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                }
              ].map((benefit, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={benefit.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-12 lg:py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Đối tác tài chính của chúng tôi
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Chúng tôi hợp tác với các định chế hàng đầu mang đến phương án tài chính tối ưu cho quý khách tại Hải Phòng và toàn quốc.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {LEASING_PARTNERS.map((partner) => (
                <div key={partner.name} className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:border-orange-500 transition-all hover:shadow-xl group">
                  {/* Partner Logo */}
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-50 transition-colors overflow-hidden p-4">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                        onError={handleImageError}
                      />
                    </div>
                  </div>

                  {/* Partner Info */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center">{partner.name}</h3>
                  <p className="text-slate-600 mb-6 text-center leading-relaxed">{partner.description}</p>

                  {/* Highlights */}
                  <div className="space-y-3 mb-6">
                    {partner.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                          <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-700 font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <a 
                    href={partner.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block w-full bg-slate-900 text-white py-3 rounded-2xl font-bold text-center hover:bg-orange-500 transition-colors"
                  >
                    Tìm hiểu thêm
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-12 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Quy trình đăng ký
              </h2>
              <p className="text-lg text-slate-600">
                Chỉ với 4 bước đơn giản để sở hữu máy công trình
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'Tư vấn & Chọn sản phẩm',
                  description: 'Chúng tôi tư vấn giúp bạn chọn sản phẩm phù hợp với nhu cầu và ngân sách'
                },
                {
                  step: '02',
                  title: 'Chuẩn bị hồ sơ',
                  description: 'Hỗ trợ chuẩn bị hồ sơ đơn giản, nhanh chóng theo yêu cầu của đối tác tài chính'
                },
                {
                  step: '03',
                  title: 'Duyệt hồ sơ & Ký hợp đồng',
                  description: 'Đối tác tài chính duyệt hồ sơ và ký hợp đồng trong thời gian ngắn nhất'
                },
                {
                  step: '04',
                  title: 'Nhận máy & Thanh toán',
                  description: 'Nhận máy và bắt đầu thanh toán theo kỳ hạn đã thỏa thuận'
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 lg:py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Sẵn sàng tìm giải pháp tài chính phù hợp?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Liên hệ với chúng tôi để được tư vấn chi tiết về các gói tài chính và chọn phương án tốt nhất cho bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${HOTLINE.replace(/\s/g, '')}`}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors shadow-xl shadow-orange-200"
              >
                Gọi ngay: {HOTLINE}
              </a>
              <Link
                href="/thiet-bi"
                className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors border border-white/20"
              >
                Xem sản phẩm
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
