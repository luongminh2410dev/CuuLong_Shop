import { Metadata } from 'next';
import AboutPage from '@/components/AboutPage';
import { BRAND_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Về chúng tôi - ${BRAND_NAME} Máy Công Trình`,
  description: `Tìm hiểu về ${BRAND_NAME} - Đại lý phân phối máy công trình chuyên nghiệp tại Hải Phòng. Với nhiều năm kinh nghiệm trong ngành thiết bị cơ giới và giải pháp tài chính linh hoạt. Hotline: 0916 446 769`,
  keywords: [`${BRAND_NAME}`, 'về chúng tôi', 'giới thiệu công ty', 'máy công trình Hải Phòng', 'đại lý máy xúc', 'thiết bị cơ giới', 'công ty máy công trình'],
  openGraph: {
    title: `Về chúng tôi - ${BRAND_NAME}`,
    description: `Tìm hiểu về ${BRAND_NAME} - Đại lý phân phối máy công trình chuyên nghiệp tại Hải Phòng.`,
    url: `${SITE_URL}/ve-chung-toi`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: `Về chúng tôi - ${BRAND_NAME}`,
    description: `Tìm hiểu về ${BRAND_NAME} - Đại lý phân phối máy công trình chuyên nghiệp tại Hải Phòng.`,
  },
  alternates: {
    canonical: `${SITE_URL}/ve-chung-toi`,
  },
};

export default function About() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `Về chúng tôi - ${BRAND_NAME}`,
    description: `Tìm hiểu về ${BRAND_NAME} - Đại lý phân phối máy công trình chuyên nghiệp tại Hải Phòng.`,
    url: `${SITE_URL}/ve-chung-toi`,
    mainEntity: {
      '@type': 'Organization',
      name: `${BRAND_NAME} Máy Công Trình`,
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo/logo.png`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'KM 90, QL 5 Mới',
        addressLocality: 'Hồng Bàng',
        addressRegion: 'Hải Phòng',
        addressCountry: 'VN',
      },
      telephone: '+84916446769',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <AboutPage />
    </>
  );
}
