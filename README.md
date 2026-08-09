# DeepMinds Research Lab (DmdLab)

A professional, centralized hub for the AI/ML PhD Professor-led Research Lab at MUST (Mbarara University of Science and Technology). 

This platform simplifies and automates monotonous tasks for the lab, providing a centralized repository for research articles and lab discussion videos, while serving as a bridge to external platforms like YouTube.

## 🚀 Key Features

- **Centralized Activity Hub**: Access lab discussion videos and recorded research sessions without leaving the platform.
- **Applied ML Research**: A dedicated showcase for lab projects, including human-wildlife conflict reporting and Uganda Sign Language translation.
- **Automated Workflow**: Future integration for direct-to-YouTube content management and CMS capabilities.
- **Professional SaaS UI**: Modern, responsive interface optimized for desktop and mobile, built with React and Tailwind CSS.

## 🛠 Tech Stack

### Frontend
- **React 19** & **Vite**: Modern UI library and build tool.
- **Tailwind CSS**: Utility-first styling with a custom SaaS theme.
- **Framer Motion**: Smooth, high-fidelity UI transitions and animations.
- **Lucide React**: Clean, consistent iconography.
- **Socket.io-client**: Real-time communication for lab updates.

### Backend
- **Node.js** & **Express**: Robust server-side framework.
- **MongoDB**: Scalable NoSQL database for research articles and video metadata.
- **Socket.io**: Real-time event orchestration.
- **Cloudinary**: Optimized media and image management.

## 📦 Project Structure

```text
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Modular UI components (Hero, Header, Cards)
│   │   ├── Pages/       # Main entry pages (Lobby, Articles, Videos)
│   │   └── admin/       # Internal lab management panel
├── server/          # Express backend
│   ├── models/      # MongoDB schemas (Article, Video, Announcement)
│   ├── routes/      # API endpoints
│   └── utils/       # Third-party integrations (Cloudinary, Sockets)
```

## 🛠 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DmdLab/DmdLab.git
   cd DmdLab
   ```

2. **Setup the Server**:
   ```bash
   cd server
   npm install
   cp server.env.example .env  # Configure your MongoDB and Cloudinary credentials
   npm start
   ```

3. **Setup the Client**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

## 📄 License

This project is led by the DeepMinds Research Lab at MUST. All rights reserved.
