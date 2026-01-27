# Quản lý ảnh trong dự án

Dự án sử dụng ảnh local được lưu trong thư mục `public/images/`. Tất cả ảnh sản phẩm, logo và hero đã được copy về local.

## Cấu trúc thư mục

```
public/images/
├── logo/
│   └── logo.png
├── hero/
│   └── hero.jpg
├── equipment/
│   ├── komatsu-pc200-8m0.png (và các ảnh phụ -2, -3)
│   ├── caterpillar-d6r.png
│   ├── hamm-3411.png (và -2)
│   ├── liugong-clg856h.png (và -2, -3)
│   ├── liugong-clg835h.png
│   ├── liugong-clg816c.png (và -2)
│   ├── xcmg-xc740k.png (và -2)
│   ├── sany-scc550a.png (và -2, -3)
│   ├── hitachi-zx200-5g.png (và -2)
│   ├── volvo-l120h.png (và -2, -3)
│   ├── xcmg-gr135.png (và -2)
│   └── doosan-dx225lca.png (và -2, -3)
└── fallback.png (ảnh fallback cho lỗi)
```

## Trạng thái ảnh

- ✅ **Logo**: Đã có local (`/images/logo/logo.png`)
- ✅ **Hero**: Đã có local (`/images/hero/hero.jpg`)
- ✅ **Equipment**: Tất cả đã có local (PNG format), mỗi sản phẩm có 1-3 ảnh
- ⚠️ **Partners**: Vẫn đang dùng URL external trong `constants.ts`

## Partner Logos

Hiện tại partner logos vẫn đang sử dụng URL external. Nếu muốn chuyển sang local:

1. Tải các ảnh từ URL sau:
   - Chailease: `https://cdn-icons-png.flaticon.com/512/3309/3309991.png` → `public/images/partners/chailease.png`
   - ACB Leasing: `https://cdn-icons-png.flaticon.com/512/2830/2830284.png` → `public/images/partners/acb-leasing.png`
   - Vinaleasing: `https://cdn-icons-png.flaticon.com/512/9372/9372221.png` → `public/images/partners/vinaleasing.png`

2. Cập nhật `constants.ts` để sử dụng đường dẫn local thay vì URL external.

## Sử dụng ảnh của riêng bạn

Bạn có thể thay thế bất kỳ ảnh nào bằng ảnh của riêng mình, chỉ cần đảm bảo:
1. Tên file khớp với tên trong `data/equipment.json`
2. Định dạng file được hỗ trợ (jpg, png, webp)
3. Đặt đúng vào thư mục tương ứng
4. Cập nhật đường dẫn trong `equipment.json` nếu cần
