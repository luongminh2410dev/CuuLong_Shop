import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailPage from '@/components/ProductDetailPage';
import { EQUIPMENT_DATA } from '@/constants';
import { BRAND_NAME, SITE_URL } from '@/lib/constants';
import { Equipment } from '@/types';

// Generate static params for all products (SSG)
export async function generateStaticParams() {
  return EQUIPMENT_DATA.map((item) => ({
    id: item.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = EQUIPMENT_DATA.find((item) => item.id === id);

  if (!product) {
    return {
      title: 'Sản phẩm không tìm thấy',
    };
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const description = `${product.name} - ${product.brand}. ${product.category}. Trọng lượng: ${product.specs.weight}, Công suất: ${product.specs.power}, Dung tích: ${product.specs.capacity}. Giá: ${formatPrice(product.price)}. Hỗ trợ trả góp tại ${BRAND_NAME} Hải Phòng.`;

  // Lấy ảnh đầu tiên từ mảng images hoặc fallback về image
  const productImage = (product.images && product.images.length > 0) 
    ? product.images[0] 
    : product.image || `${SITE_URL}/images/fallback.png`;

  return {
    title: `${product.name} - ${BRAND_NAME} Máy Công Trình | Giá ${formatPrice(product.price)}`,
    description,
    keywords: `${product.name}, ${product.brand}, ${product.category}, máy công trình, ${BRAND_NAME}, Hải Phòng, giá ${formatPrice(product.price)}, trả góp`,
    openGraph: {
      title: `${product.name} - ${BRAND_NAME}`,
      description: `${product.name} - ${product.brand}. Giá: ${formatPrice(product.price)}. Hỗ trợ trả góp tại Hải Phòng.`,
      images: [productImage],
        url: `${SITE_URL}/thiet-bi/${id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - ${BRAND_NAME}`,
      description: `${product.name} - ${product.brand}. Giá: ${formatPrice(product.price)}.`,
      images: [productImage],
    },
    alternates: {
      canonical: `${SITE_URL}/thiet-bi/${id}`,
    },
  };
}

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = EQUIPMENT_DATA.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  // Generate structured data for this product
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Lấy ảnh đầu tiên từ mảng images hoặc fallback về image
  const productImage = (product.images && product.images.length > 0) 
    ? product.images[0] 
    : product.image || `${SITE_URL}/images/fallback.png`;

  const productStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images && product.images.length > 0 ? product.images : [productImage],
    description: `${product.name} - ${product.brand} - ${product.category}. Trọng lượng: ${product.specs.weight}, Công suất: ${product.specs.power}, Dung tích: ${product.specs.capacity}`,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/thiet-bi/${id}`,
      seller: {
        '@type': 'LocalBusiness',
        name: `${BRAND_NAME} Máy Công Trình`,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '24',
    },
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Thiết bị',
        item: `${SITE_URL}/thiet-bi`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${SITE_URL}/thiet-bi/${id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <ProductDetailPage product={product} />
    </>
  );
}
