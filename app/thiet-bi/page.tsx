import { Metadata } from 'next';
import EquipmentPage from '@/components/EquipmentPage';
import { BRAND_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Danh mục Thiết Bị - ${BRAND_NAME} Máy Công Trình | Máy Xúc Đào, Máy Xúc Lật, Máy Ủi`,
  description: `Xem danh mục đầy đủ các thiết bị máy công trình tại ${BRAND_NAME}: Máy xúc đào, máy xúc lật, máy ủi, máy lu, máy san gạt. Giá cả cạnh tranh, hỗ trợ trả góp.`,
  openGraph: {
    title: `Danh mục Thiết Bị - ${BRAND_NAME} Máy Công Trình`,
    description: 'Xem danh mục đầy đủ các thiết bị máy công trình: Máy xúc đào, máy xúc lật, máy ủi, máy lu, máy san gạt.',
    url: `${SITE_URL}/thiet-bi`,
  },
  alternates: {
    canonical: `${SITE_URL}/thiet-bi`,
  },
};

export default function EquipmentListPage() {
  return <EquipmentPage />;
}
