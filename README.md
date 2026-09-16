# 📖 Smart Dictionary

A full-stack web-based dictionary application developed as a **Web Application Development (WAD) Mini Project**.

Smart Dictionary allows users to search for word meanings, pronunciations, examples, synonyms, and antonyms. It also provides user authentication, favorites, search history, and a vocabulary quiz.

## 🌐 Live Demo

👉 https://smart-dictionary-1.onrender.com

## 💻 GitHub Repository

👉 https://github.com/upadhyayshivam303722/smart-dictionary

---

## ✨ Features

### 🔎 Dictionary Search
- Search for English words.
- View word meanings and definitions.
- View phonetic pronunciation.
- Listen to pronunciation when audio is available.
- View parts of speech.
- View examples.
- View synonyms and antonyms.
- Handles invalid or unavailable words gracefully.

### 👤 User Authentication
- User registration.
- User login.
- Password hashing using bcrypt.
- Duplicate email validation.
- Logout functionality.

### ⭐ Favorites
- Add words to Favorites.
- Remove words from Favorites.
- Prevent duplicate favorite entries.
- Favorites are stored in MongoDB.
- Favorites are associated with individual users.

### 📜 Search History
- Automatically saves successful searches.
- Prevents unnecessary duplicate entries.
- Stores search information and timestamp.
- View previous searches.
- Delete individual history entries.
- Clear complete search history.

### 🧠 Vocabulary Quiz
- Multiple-choice vocabulary questions.
- Displays quiz progress.
- Calculates score and percentage.
- Saves completed quiz scores for logged-in users.
- Guests can also attempt the quiz.

### 📱 Responsive Design
- Responsive interface for desktop and mobile devices.
- User-friendly and clean UI.
- Designed using HTML and CSS.

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- Mongoose

### Database
- MongoDB
- MongoDB Atlas

### External API
- Free Dictionary API

### Authentication & Security
- bcryptjs
- Environment variables using `.env`

### Deployment
- Render
- GitHub

---

## 🏗️ System Architecture


```text
                    ┌─────────────────────┐
                    │      User           │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Frontend          │
                    │ HTML / CSS / JS     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │     Node.js         │
                    └──────┬────────┬─────┘
                           │        │
                ┌──────────┘        └──────────────┐
                ▼                                   ▼
      ┌─────────────────┐                 ┌──────────────────┐
      │ MongoDB Atlas   │                 │ Dictionary API   │
      │                 │                 │                  │
      │ Users           │                 │ Definitions      │
      │ Favorites       │                 │ Phonetics        │
      │ Search History  │                 │ Examples         │
      │ Quiz Scores     │                 │ Synonyms         │
      └─────────────────┘                 └──────────────────┘

---

📂 Project Structure

smart-dictionary/
│
├── index.html
├── style.css
├── script.js
├── .gitignore
│
└── backend/
    ├── server.js
    ├── package.json
    ├── package-lock.json
    ├── .env.example
    │
    ├── models/
    │   ├── User.js
    │   ├── Favorite.js
    │   ├── SearchHistory.js
    │   └── QuizScore.js
    │
    └── data/
        └── dictionaryData.js

⚙️ How to Run Locally
1. Clone the Repository
git clone https://github.com/upadhyayshivam303722/smart-dictionary.git
2. Open the Project
cd smart-dictionary
3. Install Backend Dependencies
cd backend
npm install
4. Configure Environment Variables

Create a .env file inside the backend folder:

MONGODB_URI=your_mongodb_connection_string
PORT=5000
5. Start the Backend
npm start

The backend will run on:

http://localhost:5000
6. Run the Frontend

Open index.html in a browser or use VS Code Live Server.

🚀 Deployment

The application is deployed using:

Frontend: Render Static Site
Backend: Render Web Service
Database: MongoDB Atlas
Source Code: GitHub
🌐 Live Application

https://smart-dictionary-1.onrender.com

🎯 Project Objective

The objective of this project is to develop an interactive and user-friendly dictionary web application while implementing important concepts of Web Application Development.

The project demonstrates:

Frontend development
Backend development
REST API integration
MongoDB database integration
User authentication
CRUD operations
External API integration
Responsive web design
Cloud deployment
👨‍💻 Author

Shivam Upadhyay

B.Tech – Artificial Intelligence & Machine Learning
