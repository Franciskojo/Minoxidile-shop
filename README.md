# Minoxidile Shop - Premium E-commerce Platform

A modern MERN stack e-commerce application specializing in premium grooming and hair care products.

## 🚀 Features

- **Premium UI/UX**: High-end aesthetic with dynamic animations and responsive design.
- **Full E-commerce Functionality**: Product browsing, cart management, and checkout.
- **Vendor System**: Specialized dashboard for vendors to manage their own products.
- **Secure Payments**: Integrated with Stripe for seamless transactions.
- **Admin Dashboard**: Comprehensive management of users, orders, and products.
- **Real-time Chat**: Integrated customer support widget.

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Vanilla CSS, Framer Motion (for animations).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT with secure HTTP-only cookies.
- **Cloud Storage**: Cloudinary for product images.
- **Payments**: Stripe.

## 📦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account (for images)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Minoxidile shop"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file based on `.env.example`.
   - Add your MongoDB URI, JWT Secret, Cloudinary credentials, and Stripe keys.

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

### Seeding Data

To populate the database with sample products and users:
```bash
cd backend
npm run data:import
```

## 📜 License

This project is licensed under the MIT License.
