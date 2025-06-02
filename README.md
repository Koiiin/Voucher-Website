# 🎁 Voucher Website 

## 📌 Mục tiêu

Ứng dụng web quản lý và trao đổi voucher giảm giá giữa người dùng, với các chức năng:

* ✅ Đăng ký / đăng nhập (hỗ trợ OAuth: Google, Facebook)
* ✅ Tạo, chỉnh sửa, xoá, tìm kiếm và lọc voucher
* ✅ Thêm vào giỏ hàng, mua voucher qua MoMo
* ✅ AI Chatbot giúp gợi ý và tìm kiếm voucher hiệu quả
* ✅ Phân loại voucher theo nền tảng (Shopee, Tiki, v.v.), danh mục, loại giảm giá
* ✅ Lưu lịch sử giao dịch & hỗ trợ phân quyền người dùng
* ✅ Crawler tự động cập nhật dữ liệu từ `portal.piggi.vn`

---

## 🧱 Kiến trúc hệ thống

> Gồm 2 phần chính: **Backend** (Node.js + Express + MongoDB) và **Frontend** (React)

### 1. Frontend (ReactJS)

#### 🧩 Thành phần chính

| Component         | Mô tả                                                         |
| ----------------- | ------------------------------------------------------------- |
| `Header.jsx`      | Thanh điều hướng chính, xử lý đăng nhập và logout             |
| `Footer.jsx`      | Thông tin bản quyền và liên kết hỗ trợ                        |
| `UserMenu.jsx`    | Dropdown menu người dùng, gồm Hồ sơ / Đăng xuất               |
| `SearchBar.jsx`   | Tìm kiếm voucher theo tên và danh mục                         |
| `VoucherCard.jsx` | Hiển thị thông tin từng voucher, xử lý thêm/xóa khỏi giỏ hàng |
| `VoucherList.jsx` | Hiển thị danh sách voucher và xử lý "Xem thêm"                |
| `Uservoucher.jsx` | Quản lý voucher cá nhân, xác nhận mua và thanh toán qua MoMo  |
| `Toast.jsx`       | Hiển thị thông báo tùy chỉnh (thành công / lỗi / info)        |
| `LoginModal.jsx`  | Popup xác nhận đăng nhập thành công / thất bại                |
| `ScrollToTop.jsx` | Tự động cuộn lên đầu trang sau mỗi lần chuyển route           |

#### 📁 Các file chính và chức năng:

| File                | Chức năng                                                                              |
| ------------------- | -------------------------------------------------------------------------------------- |
| `App.jsx`           | Khai báo route chính bằng `react-router-dom`, định tuyến và quản lý layout UI toàn cục |
| `Home.jsx`          | Trang chủ với carousel, voucher nổi bật, tin tức và FAQ                                |
| `Deals.jsx`         | Lọc voucher theo nền tảng Shopee, Tiki,... và đếm số lượng                             |
| `Login.jsx`         | Giao diện đăng nhập có OAuth và kiểm tra đăng nhập                                     |
| `Register.jsx`      | Giao diện đăng ký, kiểm tra username/password hợp lệ                                   |
| `OauthSuccess.jsx`  | Xử lý callback từ OAuth (lưu token và điều hướng)                                      |
| `User.jsx`          | Hồ sơ người dùng, thống kê và danh sách voucher đã đăng                                |
| `PaymentStatus.jsx` | Hiển thị trạng thái thanh toán MoMo                                                    |
| `Cart.jsx`          | Giỏ hàng: phân loại voucher đã sở hữu và đang chờ thanh toán                           |
| `CreateV.jsx`       | Form tạo mới voucher                                                                   |

---

### 2. Backend (Node.js)

#### 🛠️ Cấu hình kết nối MongoDB – `config/db.js`

```js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000
        });
        console.log(`✅ Kết nối MongoDB thành công: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ Kết nối thất bại!', error);
        process.exit(1);
    }
};

module.exports = connectDB;
```

#### 🔐 Authentication – `authController.js`

##### Google OAuth – `config/passport-google.js`

```js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback",
},
async (accessToken, refreshToken, profile, done) => {
  try {
    if (!profile.emails || profile.emails.length === 0) {
      return done(new Error("Không tìm thấy email từ Google"), null);
    }

    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        username: profile.emails[0].value.split("@")[0],
        email: profile.emails[0].value,
      });
    }

    done(null, user);
  } catch (error) {
    console.error("Lỗi khi xử lý đăng nhập Google:", error);
    done(error, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
```

##### Facebook OAuth – `config/passport-facebook.js`

```js
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user");

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/api/auth/facebook/callback",
  profileFields: ["id", "emails", "name", "displayName"]
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ facebookId: profile.id });
    if (existingUser) return done(null, existingUser);

    const newUser = await User.create({
      username: profile.displayName,
      email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
      facebookId: profile.id,
    });
    return done(null, newUser);
  } catch (err) {
    return done(err, null);
  }
}));
```

#### 🔐 Authentication – `authController.js`

* JWT access token (100s), refresh token (2 ngày)
* Đăng nhập truyền thống và OAuth (Google, Facebook)
* Refresh token và logout an toàn (xử lý trong `authService.js`)

#### 👤 Người dùng – `userController.js`

* Lấy thông tin người dùng
* Cập nhật hồ sơ
* Danh sách voucher do user tạo

---

## 🎟️ Quản lý Voucher – `voucherController.js`

| Chức năng                 | Mô tả                         |
| ------------------------- | ----------------------------- |
| `createVoucher()`         | Tạo mới voucher               |
| `updateVoucher()`         | Cập nhật thông tin            |
| `toggleVoucherStatus()`   | Bật/tắt hiển thị              |
| `searchVoucher()`         | Tìm kiếm voucher theo từ khóa |
| `getVouchersByPlatform()` | Lọc voucher theo nền tảng     |
| `getCategories()`         | Lấy danh sách danh mục        |
| `deleteVoucher()`         | Xóa voucher nếu là chủ sở hữu |

> Dịch vụ `voucherService.js` frontend chứa các hàm `createVoucher`, `getAllVouchers`, `getVoucherCountByPlatform`, `addToCart`, v.v.

---

## 🛒 Giỏ hàng – `cartController.js`

| API                 | Mô tả                |
| ------------------- | -------------------- |
| `POST /cart/add`    | Thêm voucher vào giỏ |
| `GET /cart`         | Xem giỏ hàng         |
| `POST /cart/remove` | Xóa voucher khỏi giỏ |

---

## 💳 Thanh toán MoMo – `payment.js`

* Khởi tạo giao dịch MoMo → nhận `payUrl`
* Xử lý callback: `/payment/status/:status`
* Giao diện kết quả xử lý tại `PaymentStatus.jsx`

---

## 🤖 AI Chatbot – `aiController.js`

* Giao tiếp với LLaMA 3 local qua API
* Trả lời gợi ý dựa trên danh sách voucher còn hiệu lực
* Sử dụng `chatService.js` trên frontend để gửi/nhận dữ liệu

---

## 🧠 Mô hình dữ liệu (MongoDB)

| Model                   | Mô tả                   |
| ----------------------- | ----------------------- |
| `User.js`               | Người dùng              |
| `Voucher.js`            | Voucher của hệ thống    |
| `UserVouchers.js`       | Voucher user tạo và bán |
| `VoucherTransaction.js` | Giao dịch thanh toán    |
| `Category.js`           | Danh mục voucher        |

---

## 📦 Hệ thống tự động (Crawler + Scheduler)

| Hàm                       | Mô tả                                    |
| ------------------------- | ---------------------------------------- |
| `runFetchScheduler()`     | Cập nhật từ `portal.piggi.vn` mỗi 5 phút |
| `runCleanupScheduler()`   | Xóa voucher hết hạn mỗi 24h              |
| `startVoucherScheduler()` | Khởi chạy trong `server.js`              |

```js
const startVoucherScheduler = require('./services/voucherService');
startVoucherScheduler();
```

---

## 📁 Cấu trúc thư mục dự án

```bash
Voucher-Web/
├── Back-end/               # Backend Node.js server
│   ├── config/             # Cấu hình OAuth và MongoDB
│   ├── controllers/        # Controller xử lý logic
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # Crawler, scheduler, payment
│   └── server.js           # Điểm khởi động backend
│
├── Front-end/              # Giao diện người dùng React
│   ├── components/         # Các component UI
│   ├── pages/              # Các trang chính (Home, Login, Deals...)
│   ├── services/           # Gọi API và xử lý logic (auth, chat, voucher)
│   ├── styles/             # CSS & Tailwind
│   └── App.jsx             # Định tuyến và layout chính
│
├── .env                    # Biến môi trường backend
├── package.json            # Quản lý package toàn cục
└── README.md               # Tài liệu dự án
```

## ⚙️ Hướng dẫn cài đặt & khởi chạy

### 1. Cài đặt toàn bộ project

```bash
git clone https://github.com/Koiiin/Voucher-Website.git
cd Voucher-Website
npm install     
cd Back-end && npm install
cd ../Front-end && npm install
```

### 2. Khởi chạy ứng dụng (dev)

```bash
cd Voucher-Website
npm run dev
```

> Chạy đồng thời frontend (`Vite`) và backend (`Express`) bằng `concurrently`

### 3. Build frontend production

```bash
npm run build
```

---

## 📦 Thư viện & Package sử dụng

### Cài đặt phụ thuộc thủ công

#### Backend:

```bash
npm install express cors express-session mongoose dotenv
npm install cors
```

#### Frontend:

```bash
npm install
npm install vite @vitejs/plugin-react
```

### Backend (`Back-end/package.json`)

* `express`, `mongoose`, `jsonwebtoken`, `passport`, `passport-google-oauth20`, `passport-facebook`
* `dotenv`, `morgan`, `cors`, `cookie-parser`, `express-session`
* `openai`, `axios`, `bcryptjs`

### Frontend (`Front-end/package.json`)

* `react`, `react-router-dom@^7`, `react-toastify`, `axios`
* `vite`, `tailwindcss`, `eslint`, `@vitejs/plugin-react`
* `@react-oauth/google`

---

## 🔐 Bảo mật

* Token JWT lưu ở `sessionStorage` hoặc Cookie HttpOnly
* Tự động làm mới token khi hết hạn (401)
* Middleware kiểm soát quyền truy cập ở backend
* OAuth bảo vệ bởi `passport` và CSRF/cookie-session

---

**🔥 Project được phát triển bởi**
* *Hoàng Ngọc Khánh - 23520717*
* *Đoàn Thanh Sang - 23521337*
* *Vũ Hoàng Khôi - 23520792*
