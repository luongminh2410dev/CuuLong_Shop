import { Metadata } from 'next';
import FinancingPage from '@/components/FinancingPage';
import { BRAND_NAME, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Giải pháp Tài chính - ${BRAND_NAME} Máy Công Trình`,
  description: `Tìm hiểu về các giải pháp tài chính linh hoạt tại ${BRAND_NAME}. Hợp tác với các đối tác cho thuê tài chính hàng đầu như Chailease, ACB Leasing, Vinaleasing để hỗ trợ khách hàng giải quyết bài toán chi phí.`,
  keywords: `giải pháp tài chính, cho thuê tài chính, leasing, ${BRAND_NAME}, Chailease, ACB Leasing, Vinaleasing, trả góp máy công trình, Hải Phòng`,
  openGraph: {
    title: `Giải pháp Tài chính - ${BRAND_NAME}`,
    description: `Tìm hiểu về các giải pháp tài chính linh hoạt tại ${BRAND_NAME}. Hợp tác với các đối tác cho thuê tài chính hàng đầu.`,
    url: `${SITE_URL}/tai-chinh`,
    type: 'website',
  },
  alternates: {
    canonical: `${SITE_URL}/tai-chinh`,
  },
};

export default function Financing() {
  return <FinancingPage />;
}
