'use client';

import Navigation from './Navigation';
import { BRAND_NAME, HOTLINE, ADDRESS, LOGO_URL, PHONE_NUMBERS } from '@/lib/constants';
import { handleImageError } from '@/lib/utils';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navigation />

      <main className="flex-grow pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="relative bg-white py-16 lg:py-24 border-b border-slate-200 overflow-hidden">
          {/* Decorative pattern background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgb(148 163 184) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="max-w-5xl mx-auto px-4 relative z-10">
            <div className="text-center">
              {/* Logo với decorative border */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full blur-xl opacity-30 animate-pulse" />
                  <div className="relative bg-white p-6 lg:p-8 rounded-full shadow-2xl border-4 border-orange-100">
                    <img
                      src={LOGO_URL}
                      alt={BRAND_NAME}
                      onError={handleImageError}
                      className="h-20 lg:h-28 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Title và Description */}
              <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6">
                {BRAND_NAME}
              </h1>
              <p className="text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto mb-8 font-medium">
                Đại lý phân phối máy công trình chuyên nghiệp tại Hải Phòng
              </p>

              {/* Stats hoặc highlights */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-12 max-w-3xl mx-auto">
                {[
                  { label: 'Năm kinh nghiệm', value: '10+' },
                  { label: 'Sản phẩm', value: '50+' },
                  { label: 'Khách hàng', value: '500+' },
                  { label: 'Dự án', value: '1000+' }
                ].map((stat, index) => (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-white p-4 lg:p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-3xl lg:text-4xl font-black text-orange-600 mb-2">{stat.value}</div>
                    <div className="text-xs lg:text-sm text-slate-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-12 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="prose prose-lg max-w-none">
              {/* Giới thiệu chung */}
              <div className="mb-12 lg:mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                  Giới thiệu chung
                </h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    <strong className="text-slate-900">{BRAND_NAME} Máy Công Trình</strong> là đơn vị chuyên phân phối và cung cấp các thiết bị máy công trình chất lượng cao tại khu vực Hải Phòng và các tỉnh thành lân cận.
                  </p>
                  <p>
                    Với nhiều năm kinh nghiệm trong ngành, chúng tôi tự hào là đối tác tin cậy của nhiều doanh nghiệp, công ty xây dựng và các đơn vị thi công lớn nhỏ trên toàn quốc.
                  </p>
                  <p>
                    Chúng tôi chuyên cung cấp các dòng máy công trình chính hãng từ các thương hiệu hàng đầu như Komatsu, Caterpillar, Hitachi, XCMG, Liugong, Sany và nhiều thương hiệu uy tín khác.
                  </p>
                </div>
              </div>

              {/* Sứ mệnh */}
              <div className="mb-12 lg:mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                  Sứ mệnh
                </h2>
                <div className="bg-orange-50 rounded-3xl p-6 lg:p-8 border border-orange-100">
                  <p className="text-lg text-slate-800 leading-relaxed">
                    Mang đến cho khách hàng những giải pháp thiết bị cơ giới tối ưu nhất,
                    cùng với dịch vụ hỗ trợ chuyên nghiệp và các phương án tài chính linh hoạt,
                    giúp khách hàng phát triển bền vững và thành công trong các dự án của mình.
                  </p>
                </div>
              </div>

              {/* Giá trị cốt lõi */}
              <div className="mb-12 lg:mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                  Giá trị cốt lõi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Chất lượng',
                      description: 'Chỉ cung cấp thiết bị chính hãng, đầy đủ CO/CQ, đảm bảo chất lượng và độ bền cao.',
                      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    },
                    {
                      title: 'Uy tín',
                      description: 'Cam kết minh bạch trong giao dịch, giá cả cạnh tranh và dịch vụ hỗ trợ tận tâm.',
                      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                    },
                    {
                      title: 'Chuyên nghiệp',
                      description: 'Đội ngũ kỹ sư giàu kinh nghiệm, tư vấn chính xác và hỗ trợ kỹ thuật 24/7.',
                      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    },
                    {
                      title: 'Đồng hành',
                      description: 'Hỗ trợ trọn gói từ tư vấn, mua bán đến bảo hành, bảo trì và giải pháp tài chính.',
                      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                    }
                  ].map((value, index) => (
                    <div key={index} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={value.icon} />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dịch vụ */}
              <div className="mb-12 lg:mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                  Dịch vụ của chúng tôi
                </h2>
                <div className="space-y-4">
                  {[
                    'Phân phối máy công trình chính hãng: Máy xúc đào, máy xúc lật, máy ủi, máy lu, máy san gạt',
                    'Tư vấn kỹ thuật chuyên sâu và hỗ trợ lựa chọn thiết bị phù hợp với nhu cầu',
                    'Hỗ trợ trọn gói thủ tục đăng ký, đăng kiểm và các giấy tờ pháp lý',
                    'Bảo hành lên tới 24 tháng và dịch vụ bảo trì, sửa chữa chuyên nghiệp',
                    'Giải pháp tài chính linh hoạt với các đối tác cho thuê tài chính hàng đầu',
                    'Đội ngũ kỹ sư lưu động sẵn sàng hỗ trợ kỹ thuật tại hiện trường'
                  ].map((service, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{service}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thông tin liên hệ */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 lg:p-12 text-white">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">Liên hệ với chúng tôi</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Địa chỉ</p>
                      <p className="text-slate-300">{ADDRESS}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.47 5.47l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-2">Hotline</p>
                      <div className="space-y-2">
                        {PHONE_NUMBERS.map((phone, index) => (
                          <a
                            key={index}
                            href={`tel:${phone}`}
                            className="block text-orange-400 hover:text-orange-300 font-bold text-lg transition-colors"
                          >
                            {phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/10">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold transition-colors"
                  >
                    <span>Xem sản phẩm</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
