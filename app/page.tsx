import { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import { BRAND_NAME, SITE_URL } from '@/lib/constants';
import { EQUIPMENT_DATA } from '@/constants';

export const metadata: Metadata = {
  title: `${BRAND_NAME} - NHẬP KHẨU & PHÂN PHỐI MÁY CÔNG TRÌNH Hải Phòng | Bán Máy Xúc Đào, Máy Xúc Lật`,
  description: `${BRAND_NAME} chuyên phân phối máy công trình chất lượng cao tại Hải Phòng: Máy xúc đào, máy xúc lật, máy ủi, máy lu, máy san gạt. Hỗ trợ trả góp, bảo hành 24 tháng. Hotline: 0916 446 769`,
  openGraph: {
    title: `${BRAND_NAME} - NHẬP KHẨU & PHÂN PHỐI MÁY CÔNG TRÌNH Hải Phòng`,
    description: 'Chuyên phân phối máy công trình chất lượng cao tại Hải Phòng: Máy xúc đào, máy xúc lật, máy ủi, máy lu. Hỗ trợ trả góp, bảo hành 24 tháng.',
    url: SITE_URL,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

// Generate structured data for products
function generateProductStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: EQUIPMENT_DATA.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        image: item.image,
        description: `${item.name} - ${item.brand} - ${item.category}. Trọng lượng: ${item.specs.weight}, Công suất: ${item.specs.power}, Dung tích: ${item.specs.capacity}`,
        brand: {
          '@type': 'Brand',
          name: item.brand,
        },
        category: item.category,
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'VND',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/thiet-bi/${item.id}`,
        },
      },
    })),
  };
}

export default function Home() {
  const productStructuredData = generateProductStructuredData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />
      <HomePage />
    </>
  );
}
