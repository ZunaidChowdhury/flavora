# 🍳 Flavora — Community Cookbook Frontend

Flavora is a premium, modern recipe sharing and discovery platform. This repository contains the Next.js frontend application, built with a polished user interface, animations, and data state synchronization.

---

## ✨ Features

- **🌅 Immersive Hero Slider**: Auto-playing recipe showcase with smooth scale animations, glowing color backdrops, and active pagination controls.
- **🏷️ Interactive Explorer**: Discover kitchen-fresh recipes filtered dynamically by categories.
- **❤️ Favourites Toggle**: Instantly add/remove recipes to your profile book with micro-animated states.
- **⭐ Interactive Reviews**: Leave custom ratings using a responsive star interaction, including character validation and detailed client-side statistics.
- **👤 Dashboard Profile**: overlapping avatar profile cards displaying registration timestamps, activity metrics, and role badges.
- **📑 Admin Center**: Clean layout interfaces to manage public recipes (visibility toggle + publish status locks) and user moderation panels.
- **🎨 Modern Design Tokens**: Curated warm orange color themes, glassmorphic dropdowns, custom select inputs, and a custom SVG loading spinner.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **File Uploads**: [UploadThing React](https://uploadthing.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Feedback**: [React Toastify](https://github.com/fkhadra/react-toastify)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v20+ recommended) installed.

### 2. Environment Setup
Create a `.env` file in the root directory and add the following:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# UploadThing Credentials
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
UPLOADTHING_TOKEN=your_uploadthing_token
```

### 3. Installation
Install the project dependencies:
```bash
npm install
```

### 4. Running Locally
Launch the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build & Deploy

Compile the production-optimized Next.js bundle:
```bash
npm run build
```

This frontend is configured for deployment on the **Vercel** platform.
