🚀 Puffer Tracker

Puffer Tracker is a full-stack stock tracking and market analysis platform built to help users monitor stock prices, analyze trends, and manage financial data in real time.

It focuses on performance, scalability, and clean architecture, while keeping the user experience simple and intuitive.

✨ Features
📈 Real-time stock price tracking
🔍 Market data integration via financial APIs
🔐 Secure authentication and session management
📊 Clean and responsive dashboard UI
🧠 Scalable backend architecture
⚡ Server-side rendering with Next.js App Router
🛠 Tech Stack

Frontend

Next.js (App Router)
React
TypeScript

Backend

Next.js Server Actions / API Routes

Database

MongoDB
Mongoose

Authentication

Better Auth

APIs

Finnhub (Market Data)

Styling & Tools

Tailwind CSS
Node.js
WebStorm
📁 Project Structure
app/          → Application routes (Next.js App Router)
components/   → Reusable UI components
lib/          → Utilities, helpers, authentication logic
database/     → MongoDB connection and models
⚙️ Environment Variables

Create a .env.local file in the root directory and add:

MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_FINNHUB_API_KEY=your_api_key
▶️ Getting Started
npm install
npm run dev

Open your browser and visit:
👉 http://localhost:3000

📌 Project Status

🚧 This project is currently under active development.
New features, optimizations, and improvements are being added regularly.

💡 Vision

The goal of Puffer Tracker is to evolve into a reliable and scalable platform for real-time financial tracking, with a strong focus on performance and usability.
