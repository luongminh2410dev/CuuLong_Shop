import { Equipment, LeasingPartner } from './types';
import equipmentData from './data/equipment.json';

/**
 * Dữ liệu sản phẩm thiết bị được import từ file JSON
 * File nguồn: ./data/equipment.json
 */
export const EQUIPMENT_DATA: Equipment[] = equipmentData as Equipment[];

export const LEASING_PARTNERS: LeasingPartner[] = [
  {
    name: 'Chailease (CILC)',
    logo: 'https://cdn-icons-png.flaticon.com/512/3309/3309991.png',
    url: 'https://www.chailease.com.vn/',
    description: 'Tập đoàn cho thuê tài chính hàng đầu khu vực với quy trình nhanh gọn và hạn mức cao.',
    highlights: ['Hỗ trợ lên đến 90%', 'Thời hạn vay 5 năm', 'Lãi suất cạnh tranh']
  },
  {
    name: 'ACB Leasing',
    logo: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
    url: 'https://acbleasing.com.vn/',
    description: 'Thành viên của ngân hàng ACB, cung cấp giải pháp tài chính an toàn và bền vững.',
    highlights: ['Thủ tục đơn giản', 'Mạng lưới rộng khắp', 'Uy tín ngân hàng']
  },
  {
    name: 'Vinaleasing (VILC)',
    logo: 'https://cdn-icons-png.flaticon.com/512/9372/9372221.png',
    url: 'https://vinaleasing.com/',
    description: 'Đối tác tin cậy cho các doanh nghiệp xây dựng và khai khoáng tại Việt Nam.',
    highlights: ['Tư vấn chuyên sâu', 'Phí dịch vụ thấp', 'Ưu đãi máy cũ']
  }
];
