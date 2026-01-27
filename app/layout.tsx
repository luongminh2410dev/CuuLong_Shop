import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { BRAND_NAME, SITE_URL, LOGO_URL } from '@/lib/constants';
import SocialButtons from '@/components/SocialButtons';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} - NHẬP KHẨU & PHÂN PHỐI MÁY CÔNG TRÌNH Hải Phòng | Bán Máy Xúc Đào, Máy Xúc Lật`,
    template: `%s | ${BRAND_NAME} Máy Công Trình`,
  },
  description: `${BRAND_NAME} chuyên phân phối máy công trình chất lượng cao tại Hải Phòng: Máy xúc đào, máy xúc lật, máy ủi, máy lu, máy san gạt. Hỗ trợ trả góp, bảo hành 24 tháng. Hotline: 0916 446 769`,
  keywords: ['máy công trình', 'máy xúc đào', 'máy xúc lật', 'máy ủi', 'máy lu', 'máy san gạt', 'Hải Phòng', 'Cửu Long', 'thiết bị cơ giới', 'máy công trình Hải Phòng', 'bán máy xúc', 'cho thuê tài chính', 'leasing', 'máy xúc đào Hải Phòng', 'máy xúc lật Hải Phòng'],
  authors: [{ name: `${BRAND_NAME} Máy Công Trình` }],
  creator: `${BRAND_NAME} Máy Công Trình`,
  publisher: `${BRAND_NAME} Máy Công Trình`,
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: `${BRAND_NAME} Máy Công Trình`,
    title: `${BRAND_NAME} - NHẬP KHẨU & PHÂN PHỐI MÁY CÔNG TRÌNH Hải Phòng`,
    description: 'Chuyên phân phối máy công trình chất lượng cao tại Hải Phòng: Máy xúc đào, máy xúc lật, máy ủi, máy lu. Hỗ trợ trả góp, bảo hành 24 tháng.',
    images: [
      {
        url: LOGO_URL,
        width: 1200,
        height: 630,
        alt: `${BRAND_NAME} Máy Công Trình`,
      },
    ],
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_NAME} - NHẬP KHẨU & PHÂN PHỐI MÁY CÔNG TRÌNH Hải Phòng`,
    description: 'Chuyên phân phối máy công trình chất lượng cao tại Hải Phòng: Máy xúc đào, máy xúc lật, máy ủi, máy lu. Hỗ trợ trả góp, bảo hành 24 tháng.',
    images: [LOGO_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // Thêm Google Search Console verification code nếu có
    // google: 'your-verification-code',
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        <SocialButtons />
      </body>
    </html>
  );
}
