import { Equipment } from '@/types';

/**
 * Format giá tiền theo định dạng VND
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

/**
 * Lấy ảnh đầu tiên từ mảng images hoặc fallback về image (backward compatible)
 */
export const getProductImage = (item: Equipment): string => {
  if (item.images && item.images.length > 0) {
    return item.images[0];
  }
  return item.image || '/images/fallback.png';
};

/**
 * Xử lý lỗi khi load ảnh - set fallback image
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
  if (!e.currentTarget.src.includes('/images/fallback.png')) {
    e.currentTarget.src = '/images/fallback.png';
  }
};

/**
 * Scroll đến một element trong container
 */
export const scrollToImage = (
  container: HTMLDivElement,
  targetImage: HTMLDivElement
): void => {
  const imageLeft = targetImage.offsetLeft;
  const containerWidth = container.clientWidth;
  const imageWidth = targetImage.offsetWidth;
  const scrollPosition = imageLeft - (containerWidth / 2) + (imageWidth / 2);
  
  container.scrollTo({
    left: scrollPosition,
    behavior: 'smooth'
  });
};
