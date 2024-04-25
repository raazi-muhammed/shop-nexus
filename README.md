# Shop Nexus
**Shop Nexus** is an e-commerce platform designed for multiple vendors, powered by the MERN stack. It facilitates online sales for various shops and offers a range of features, including coupon management, event scheduling, messaging, premium membership with benefits (subscription services), user verification, sales reporting, wallet functionality, secure payment processing, user and seller account management, and comprehensive product, stock, and order management.

## Features

### Home Page
- Dynamic home page with sections for recent products, best selling items, and frequently asked questions.
- Product details page with image zoom, reviews, related products, and seller information.

### Product Management
- Sellers can add, edit, and soft delete products, manage stock, and upload product images using Cloudinary.
- Admins have full control over products, orders, coupons, and events.

### Checkout & Orders
- Users can view and manage their orders, including cancellation, return, and invoice download.
- Payment integration with RazorPay, wallet, and cash on delivery options.

### Events & Coupons
- Create and manage coupons and events based on various criteria such as category, products, and discounts.
- Exclusive events for Shop Nexus Plus members.

### Shop Nexus Plus
- Real-time messaging between users and sellers, recurring payments, free shipping, and exclusive events.

### Analytics
- Dashboard and sales reports for admins and sellers with charts and downloadable reports in multiple formats.

### Wallet
- Users and sellers can add money to their wallet, make payments, and view transaction history.

### Referral
- Generate referral codes and signup links, and receive credits on account creation and first purchase.

### User, Seller & Admin Management
- Authentication and authorization mechanisms for users, sellers, and admins.
- User verification via email using JWT and Nodemailer.
- User profile management, including details editing, password reset, and avatar changes.

## Tech Stack

- **Frontend**: React, Redux, SCSS, Bootstrap
- **Backend**: Node.js, Express.js, MongoDB
- **Libraries & Services**: Socket.IO, Razorpay, Firebase, Nodemailer, Cloudinary, Multer, Morgan, JWT
