# Pizza Delivery — Full-Stack Web Application

A full-stack pizza delivery application developed for the **Oasis Infobyte Internship Program — Web Development, Level 3, Task 1**.

## Live Demo

- **Frontend:** https://pizza-delivery-client-eta.vercel.app/

## Technologies Used

- **Frontend:** React.js, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, email verification and password reset
- **Payments:** Razorpay test mode
- **Email:** Nodemailer
- **Deployment:** Vercel and Render

## Features

- User registration, email verification and login
- Forgot-password and password-reset functionality
- Pizza menu and customizable pizza options
- Shopping cart and order summary
- Razorpay test payments and Cash on Delivery
- Customer order tracking
- Separate admin login and dashboard
- Inventory management and automatic stock updates
- Scheduled low-stock email alerts

## Project Structure

- `client/` — React frontend
- `server/` — Node.js and Express backend

## Running Locally

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm start
```

Configure the required environment variables for the frontend and backend before running the application. Never commit API secrets, database credentials or email passwords.

## Payment Notice

Razorpay is configured for test-mode payments. No real payment should be made through the test integration.

## Internship

**Program:** Oasis Infobyte Internship Program  
**Track:** Web Development  
**Level:** 3  
**Task:** Pizza Delivery Full-Stack Application
