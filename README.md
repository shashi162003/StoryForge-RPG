# StoryForge RPG 🚀

**A real-time, AI-powered, collaborative storytelling game where players shape the narrative together.**

StoryForge RPG is a full-stack MERN application that allows a group of friends to join a virtual room and participate in a role-playing adventure. An AI Dungeon Master (powered by OpenAI's GPT models) generates the world, narrates events, and reacts to player actions, creating a unique, procedurally generated story every time. The experience is enhanced with AI-generated images, character stats, and a polished, real-time UI.

## ✨ Key Features

* **AI Dungeon Master:** Utilizes GPT-3.5/4 to generate dynamic story content, NPCs, and outcomes.
* **Real-time Multiplayer:** Players in the same room see story updates instantly via WebSockets (Socket.IO).
* **Comprehensive Authentication:**
    * Local user registration with OTP email verification.
    * Secure JWT-based sessions using `httpOnly` cookies.
    * Social logins with Google and GitHub.
* **Dynamic Image Generation:** Periodically illustrates key story moments with AI-generated images (Stability AI).
* **Themed Adventures (World Seeding):** Choose a genre like 'High Fantasy' or 'Cyberpunk Noir' to set the tone of the story.
* **Character Sheets & Attributes:** Players have characters with stats (Strength, Wits, Charisma) that the AI considers during actions.
* **Secret Actions ("Whisper to DM"):** Players can take private actions that only they and the AI know the outcome of.
* **Persistent NPC Memory:** A dedicated AI-managed memory helps the DM remember key characters for better story consistency.
* **Polished UI/UX:**
    * A playful, "skribbl.io"-inspired theme.
    * Light/Dark mode support.
    * Smooth animations with Framer Motion.
    * Optional ambient background sound.

---
## 🌐 Live Demo

* **Frontend (Vercel):** [`https://story-forge-rpg.vercel.app`](https://story-forge-rpg.vercel.app)
* **Backend (Render):** [`https://storyforge-rpg.onrender.com`](https://storyforge-rpg.onrender.com)



---
## 🔧 Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Axios, Zustand, Socket.IO Client
* **Backend:** Node.js, Express, MongoDB
* **Real-time:** Socket.IO
* **Authentication:** Passport.js, JWT, bcryptjs
* **AI:** OpenAI API (Text), Stability AI (Image)
* **Database:** MongoDB Atlas
* **Deployment:** Vercel (Frontend), Render (Backend)

---
## ⚙️ Setup and Installation (Local Development)

### Prerequisites

* Node.js (v18 or later)
* npm
* A MongoDB Atlas account (or a local MongoDB instance)
* API keys for OpenAI, Stability AI, Brevo (or another email service), Google, and GitHub.

### 1. Backend Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd storyforge-rpg/server

# 2. Install dependencies
npm install

# 3. Create the .env file in the /server directory
#    Copy the contents below and fill in your own credentials
touch .env

# 4. Run the server
npm run dev
```

# server/.env file:

```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret_string

# AI Keys
OPENAI_API_KEY=sk-...
STABILITY_API_KEY=sk-...

# OAuth Keys
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Deployment URLs (for local testing, these can point to localhost)
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000

# Email Service (Brevo)
BREVO_API_KEY=xkeysib-...
EMAIL_FROM=your_verified_sender_email@example.com
```

# Frontend Setup

```bash
# 1. Navigate to the client directory
cd ../client

# 2. Install dependencies
npm install

# 3. Create the .env file in the /client directory
touch .env

# 4. Run the client
npm run dev
```

# client/.env file:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

### Your application should now be running locally, with the frontend at http://localhost:5173 and the backend at http://localhost:4000.