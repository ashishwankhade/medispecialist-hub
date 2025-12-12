# 🧑‍⚕️ Medispecialist Hub – Patient App (React Vite)

The **Patient App** allows users to browse doctors, book appointments, manage profiles, upload reports, and track appointment history.

## 🚀 Features
- Patient authentication (JWT)
- Browse all doctors
- Filter by department
- Book appointments
- Manage appointment history
- Upload medical documents (Cloudinary)
- Edit profile
- Responsive UI

## 🗂 Project Structure
```
Patient/
│── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── context/
│   ├── routes/
│   ├── App.jsx
│   ├── main.jsx
│── public/
│── package.json
│── vite.config.js
```

## 🔧 Tech Stack
- React + Vite  
- React Router  
- Axios  
- Context API  
- Tailwind / CSS  

## 📦 Installation
```bash
cd Patient
npm install
```

## ▶️ Development Server
```bash
npm run dev
```

Runs at:
```
http://localhost:5175
```

## 🔐 Environment Variables
Create `.env`:
```
VITE_API_KEY=http://localhost:8000
```

Production:
```
VITE_API_KEY=https://your-backend.onrender.com
```

## 🚀 Deployment (Vercel)
1. Push `Patient` folder to GitHub  
2. Import into Vercel  
3. Add environment variable:
```
VITE_API_KEY=https://your-backend.onrender.com
```
4. Deploy 🎉

## 🤝 Contributing
You may contribute enhancements via PR.

## 📄 License
Private project – for educational use.
