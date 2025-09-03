# 🎯 Podium - AI-Powered Interview Coach

<div align="center">

![Podium Logo](https://img.shields.io/badge/Podium-Interview%20Coach-brown?style=for-the-badge&logo=microphone)

**Your personal AI-powered interview coach. Sharpen your skills, get instant feedback, and land your dream job.**

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.18+-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=flat&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

## 🌟 Overview

Podium is a cutting-edge AI-powered interview coaching platform designed to help students and professionals excel in their job interviews. Our platform combines speech-to-text technology with advanced generative AI to provide personalized, real-time feedback on your interview performance.

### 🎯 Why Podium?

- **🚀 Practice Makes Perfect:** Realistic interview simulation environment
- **🤖 AI-Powered Feedback:** Instant, objective analysis of your responses
- **📊 Progress Tracking:** Monitor your improvement over time
- **🎭 Role-Specific Questions:** Tailored questions for different job roles
- **🔒 Secure & Private:** Your data is protected and encrypted

## ✨ Features

### 🔐 **User Management**
- Secure user registration and authentication
- Profile management and settings
- JWT-based session management

### 📋 **Smart Dashboard**
- Comprehensive interview statistics
- Progress tracking and performance metrics
- Daily usage quota monitoring
- Personal achievements and milestones

### 🎤 **Practice Sessions**
- **Role-Based Questions:** SDE, Frontend, Backend, Cloud Engineer
- **Category Filtering:** DSA, System Design, Behavioral, and more
- **Real-time Audio Recording:** Browser-based voice capture
- **Speech-to-Text:** Accurate transcription of your responses

### 🧠 **AI-Powered Analysis**
- **Instant Feedback:** Powered by Google Gemini AI
- **Content Analysis:** Evaluation of technical accuracy
- **Communication Skills:** Assessment of clarity and delivery
- **Improvement Suggestions:** Actionable recommendations

### 📚 **Learning Resources**
- **CS Fundamentals Pack:** Comprehensive study materials
- **Operating Systems, OOPS, Networks, DBMS, DSA, and more**
- **Downloadable Resources:** External Google Drive integration

### 📖 **Session Management**
- **Complete History:** Review all past interview sessions
- **Searchable Transcripts:** Find specific topics or questions
- **Performance Analytics:** Track improvement over time
- **Export Capabilities:** Download session data

### 🏆 **Gamification**
- **Leaderboard System:** Compete with other users
- **Achievement Badges:** Unlock milestones
- **Streak Tracking:** Maintain consistent practice

## 🛠️ Tech Stack

### Frontend
- **React 18+** - Modern UI library
- **React Router** - Client-side routing
- **CSS3** - Custom styling with glass morphism effects
- **Web Speech API** - Browser-based audio recording

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication

### AI & External Services
- **Google Gemini AI** - Natural language processing
- **Web Speech API** - Speech-to-text conversion
- **Google Drive API** - Resource hosting

## 🚀 Quick Start

### Prerequisites
- Node.js (v18.0 or higher)
- MongoDB (v6.0 or higher)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PrajwalMutalik/Podium.git
   cd Podium
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/podium
   JWT_SECRET=your_jwt_secret_here
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   ```

5. **Start the application**
   
   **Backend (Terminal 1):**
   ```bash
   cd server
   npm start
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   ```
   Frontend: http://localhost:5173
   Backend API: http://localhost:5000
   ```

## 📁 Project Structure

```
Podium/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Context providers
│   │   ├── animations.css  # Animation styles
│   │   └── index.css       # Global styles
│   └── package.json
├── server/                 # Express backend
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── services/          # Business logic
│   └── package.json
└── README.md
```

## 🎮 Usage Guide

### Getting Started
1. **Register** for a new account or **Login** with existing credentials
2. **Navigate to Practice** to start your first interview session
3. **Choose your role** (SDE, Frontend Developer, Backend Developer, Cloud Engineer)
4. **Select question category** (All, DSA, System Design, etc.)
5. **Begin Practice Session** and start answering questions

### During Interview
- 🎤 **Click Record** to start capturing your response
- 🗣️ **Speak clearly** for better speech recognition
- ⏹️ **Stop recording** when you finish your answer
- 🤖 **Wait for AI feedback** and analysis
- 📝 **Review suggestions** for improvement

### After Interview
- 📊 **Check your Dashboard** for updated statistics
- 📚 **Visit History** to review past sessions
- 🏆 **View Leaderboard** to see your ranking
- ⚙️ **Update Settings** to customize your experience

## 🌙 Theme Support

Podium features a beautiful **dual-theme system**:

- **🌅 Light Mode:** Clean, professional interface
- **🌙 Dark Mode:** Comfortable viewing with glass morphism effects
- **🎨 Dynamic Theming:** Smooth transitions between themes
- **💎 Glass Effects:** Modern transparent UI elements

## 🔒 Security Features

- **🔐 JWT Authentication:** Secure token-based authentication
- **🛡️ Input Validation:** Server-side data validation
- **🚫 Rate Limiting:** API abuse prevention
- **🔒 Secure Headers:** CORS and security middleware
- **🗄️ Data Encryption:** Secure password hashing

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Prajwal Mutalik** - *Lead Developer* - [@PrajwalMutalik](https://github.com/PrajwalMutalik)
- **Sandesh** - *Co-Developer* - [@sandy334](https://github.com/sandy334)

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful natural language processing
- **React Community** for excellent frontend tools
- **MongoDB** for flexible data storage
- **All contributors** who help improve Podium

## 📞 Support

If you have any questions or need support:

- 📧 **Email:** Contact through the app's contact form
- 🐛 **Issues:** Report bugs on GitHub Issues
- 💡 **Feature Requests:** Submit suggestions via GitHub

---

<div align="center">

**Made with ❤️ by the Podium Team**

*Helping you land your dream job, one interview at a time.*

</div>
