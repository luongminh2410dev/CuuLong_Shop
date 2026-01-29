import { Metadata } from 'next';
import EquipmentPage from '@/components/EquipmentPage';
import { BRAND_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Danh mục Thiết Bị - ${BRAND_NAME} Máy Công Trình | Máy Xúc Đào, Máy Xúc Lật, Máy Ủi`,
  description: `Xem danh mục đầy đủ các thiết bị máy công trình tại ${BRAND_NAME}: Máy xúc đào, máy xúc lật, máy ủi, máy lu, máy san gạt. Giá cả cạnh tranh, hỗ trợ trả góp. Hotline: 0916 446 769`,
  keywords: ['danh mục máy công trình', 'máy xúc đào', 'máy xúc lật', 'máy ủi', 'máy lu', 'máy san gạt', 'thiết bị cơ giới', 'bán máy công trình Hải Phòng'],
  openGraph: {
    title: `Danh mục Thiết Bị - ${BRAND_NAME} Máy Công Trình`,
    description: 'Xem danh mục đầy đủ các thiết bị máy công trình: Máy xúc đào, máy xúc lật, máy ủi, máy lu, máy san gạt.',
    url: `${SITE_URL}/thiet-bi`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: `Danh mục Thiết Bị - ${BRAND_NAME}`,
    description: 'Xem danh mục đầy đủ các thiết bị máy công trình.',
  },
  alternates: {
    canonical: `${SITE_URL}/thiet-bi`,
  },
};

export default function EquipmentListPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Danh mục Thiết Bị - ${BRAND_NAME}`,
    description: 'Xem danh mục đầy đủ các thiết bị máy công trình.',
    url: `${SITE_URL}/thiet-bi`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <EquipmentPage />
    </>
  );
}
