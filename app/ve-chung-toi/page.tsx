import { Metadata } from 'next';
import AboutPage from '@/components/AboutPage';
import { BRAND_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Về chúng tôi - ${BRAND_NAME} Máy Công Trình`,
  description: `Tìm hiểu về ${BRAND_NAME} - Đại lý phân phối máy công trình chuyên nghiệp tại Hải Phòng. Với nhiều năm kinh nghiệm trong ngành thiết bị cơ giới và giải pháp tài chính linh hoạt.`,
  keywords: `${BRAND_NAME}, về chúng tôi, giới thiệu công ty, máy công trình Hải Phòng, đại lý máy xúc, thiết bị cơ giới`,
  openGraph: {
    title: `Về chúng tôi - ${BRAND_NAME}`,
    description: `Tìm hiểu về ${BRAND_NAME} - Đại lý phân phối máy công trình chuyên nghiệp tại Hải Phòng.`,
    url: `${SITE_URL}/ve-chung-toi`,
    type: 'website',
  },
  alternates: {
    canonical: `${SITE_URL}/ve-chung-toi`,
  },
};

export default function About() {
  return <AboutPage />;
}
