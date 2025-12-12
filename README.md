# 🛠 Medispecialist Hub – Admin Panel (React Vite)

The **Admin Panel** is used to manage the entire Medispecialist Hub ecosystem — doctors, patients, departments, appointments, analytics, and system configurations.

## 🚀 Features
- Admin authentication (JWT)
- Manage doctors (approve/reject)
- Manage patients
- Manage departments & specializations
- View system statistics & reports
- Appointment overview
- Fully responsive dashboard
- API communication with backend

## 🗂 Project Structure
```
admin/
│── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── routes/
│   ├── utils/
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
- Context API / Redux (if used)  
- Tailwind / CSS  

## 📦 Installation
```bash
cd admin
npm install
```

## ▶️ Run Development Server
```bash
npm run dev
```

App runs at:
```
http://localhost:5173
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
1. Push `admin` folder to GitHub  
2. Import repo into Vercel  
3. Add env variable:
```
VITE_API_KEY=https://your-backend.onrender.com
```
4. Deploy 🎉

## 🤝 Contributing
Open a pull request for improvements.

## 📄 License
Private project – for educational use.
