import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { BRAND_NAME, SITE_URL, LOGO_URL } from '@/lib/constants';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: `${BRAND_NAME} - Máy Công Trình & Phân Phối Hải Phòng | Bán Máy Xúc Đào, Máy Xúc Lật`,
  description: `${BRAND_NAME} chuyên phân phối máy công trình chất lượng cao tại Hải Phòng: Máy xúc đào, máy xúc lật, máy ủi, máy lu, máy san gạt. Hỗ trợ trả góp, bảo hành 24 tháng. Hotline: 0916 446 769`,
  keywords: 'máy công trình, máy xúc đào, máy xúc lật, máy ủi, máy lu, máy san gạt, Hải Phòng, Cửu Long, thiết bị cơ giới, máy công trình Hải Phòng, bán máy xúc, cho thuê tài chính',
  authors: [{ name: `${BRAND_NAME} Máy Công Trình` }],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: `${BRAND_NAME} - Máy Công Trình & Phân Phối Hải Phòng`,
    description: 'Chuyên phân phối máy công trình chất lượng cao tại Hải Phòng: Máy xúc đào, máy xúc lật, máy ủi, máy lu. Hỗ trợ trả góp, bảo hành 24 tháng.',
    images: [LOGO_URL],
    locale: 'vi_VN',
    siteName: `${BRAND_NAME} Máy Công Trình`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_NAME} - Máy Công Trình & Phân Phối Hải Phòng`,
    description: 'Chuyên phân phối máy công trình chất lượng cao tại Hải Phòng: Máy xúc đào, máy xúc lật, máy ủi, máy lu. Hỗ trợ trả góp, bảo hành 24 tháng.',
    images: [LOGO_URL],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: `${BRAND_NAME} Máy Công Trình`,
              image: LOGO_URL,
              '@id': SITE_URL,
              url: SITE_URL,
              telephone: '+84916446769',
              priceRange: '450,000,000 VND - 4,500,000,000 VND',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'KM 90, QL 5 Mới',
                addressLocality: 'Hồng Bàng',
                addressRegion: 'Hải Phòng',
                addressCountry: 'VN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 20.8449,
                longitude: 106.6881,
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '08:00',
                closes: '17:00',
              },
              description: `Chuyên phân phối máy công trình chất lượng cao tại Hải Phòng: Máy xúc đào, máy xúc lật, máy ủi, máy lu, máy san gạt. Hỗ trợ trả góp, bảo hành 24 tháng.`,
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: `${BRAND_NAME} Máy Công Trình`,
              url: SITE_URL,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${SITE_URL}/thiet-bi?search={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
