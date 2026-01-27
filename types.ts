
/**
 * Thông số kỹ thuật của thiết bị
 */
export interface EquipmentSpecs {
  /** Trọng lượng của thiết bị (ví dụ: "20,000 kg") */
  weight: string;
  /** Công suất động cơ (ví dụ: "110 kW") */
  power: string;
  /** Dung tích/khả năng làm việc (ví dụ: "0.8 m3", "55 Tấn") */
  capacity: string;
}

/**
 * Model đầy đủ cho thiết bị máy công trình
 */
export interface Equipment {
  /** ID duy nhất của sản phẩm */
  id: string;
  /** Tên đầy đủ của sản phẩm */
  name: string;
  /** Danh mục sản phẩm (ví dụ: "Máy Xúc Đào", "Máy Ủi") */
  category: string;
  /** Thương hiệu sản phẩm (ví dụ: "Komatsu", "Caterpillar") */
  brand: string;
  /** Giá bán (đơn vị: VND) */
  price: number;
  /** URL hình ảnh sản phẩm chính (để backward compatibility) */
  image?: string;
  /** Mảng URL các hình ảnh sản phẩm */
  images: string[];
  /** Thông số kỹ thuật chi tiết */
  specs: EquipmentSpecs;
}

export interface LeasingPartner {
  name: string;
  logo: string;
  url: string;
  description: string;
  highlights: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
