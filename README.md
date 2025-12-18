# puffer-tracker
Puffer is a full-stack stock tracking and market analysis application designed to help users monitor stocks, analyze market trends, and manage financial data in real time.  Built with a modern tech stack, Puffer focuses on performance, scalability, and clean architecture while keeping the user experience simple and intuitive.
🚀 Features

📈 Real-time stock price tracking

🔍 Market data powered by financial APIs

🔐 Authentication & secure user sessions

📊 Clean, responsive dashboard UI

🧠 Scalable backend with MongoDB

⚡ Server-side rendering with Next.js App Router

🛠 Tech Stack

Frontend: Next.js (App Router), React, TypeScript

Backend: Next.js Server Actions / API Routes

Database: MongoDB + Mongoose

Auth: Better Auth

APIs: Finnhub (Market Data)

Styling: Tailwind CSS

Tooling: WebStorm, Node.js

📂 Project Structure
app/          → Next.js App Router pages
components/   → Reusable UI components
lib/          → Utilities, auth, helpers
database/     → MongoDB connection & models

⚙️ Environment Variables

Create a .env.local file in the root directory and add:

MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_FINNHUB_API_KEY=your_api_key

▶️ Getting Started
npm install
npm run dev


Visit: http://localhost:3000

📌 Status

🚧 This project is under active development. New features and improvements are being added regularly.
