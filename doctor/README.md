# 👨‍⚕️ Medispecialist Hub – Doctor App (React Vite)

The **Doctor App** allows doctors to manage schedules, appointments, profiles, and consultations within Medispecialist Hub.

## 🚀 Features
- Doctor authentication (JWT)
- Manage doctor profile
- View & manage appointments
- Accept / Reject appointments
- View patient details
- Upload profile images
- Responsive dashboard

## 🗂 Project Structure
```
Doctor/
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
cd Doctor
npm install
```

## ▶️ Development Server
```bash
npm run dev
```

Runs at:
```
http://localhost:5174
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
1. Push `Doctor` folder to GitHub  
2. Import into Vercel  
3. Add env variable:
```
VITE_API_KEY=https://your-backend.onrender.com
```
4. Deploy 🎉

## 🤝 Contributing
PRs are welcome.

## 📄 License
Private project – for educational use.
