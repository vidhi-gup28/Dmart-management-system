# 🚀 Deployment Guide — SmartMart Management System

Yeh guide aapko poore project ko live internet par deploy karne ka step-by-step process batati hai.

---

## 🎯 Best & Simplest Free Setup:
1. **Backend**: [Render.com](https://render.com) (Free Python Web Service) ya [Railway.app](https://railway.app)
2. **Frontend**: [Vercel](https://vercel.com) (Free Static Site / React Web Hosting)

---

## 1️⃣ STEP 1: Backend Deploy Karo (Render.com par)

### Option A: Direct Web Service (Easiest)
1. Apne code ko GitHub par push karo:
   ```bash
   git add .
   git commit -m "Configure production deployment settings and dockerfiles"
   git push origin main
   ```
2. **Render Dashboard** par jao (`https://dashboard.render.com`) aur **New +** -> **Web Service** choose karo.
3. Apni GitHub repository select karo.
4. Settings fill karo:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
     ```
   - **Start Command**:
     ```bash
     gunicorn smartmart_backend.wsgi:application --bind 0.0.0.0:$PORT
     ```
5. **Environment Variables** add karo:
   - `DEBUG` = `False`
   - `SECRET_KEY` = `(Generate or enter a strong secret key)`
   - `ALLOWED_HOSTS` = `*`
   - `CSRF_TRUSTED_ORIGINS` = `https://your-frontend-app.vercel.app` (frontend link milne ke baad update kar sakte hain)
6. Click **Deploy Web Service**.
7. Deploy hone ke baad Render aapko ek URL dega (e.g., `https://smartmart-backend.onrender.com`).

---

## 2️⃣ STEP 2: Frontend Deploy Karo (Vercel par)

1. **Vercel Dashboard** par jao (`https://vercel.com/new`).
2. Apni GitHub repo import karo.
3. **Root Directory**: Select `frontend`.
4. **Build and Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Environment Variables**:
   - Name: `EXPO_PUBLIC_API_URL`
   - Value: `https://your-backend-service.onrender.com/api` (Render backend URL ke aage `/api` lagayein)
6. Click **Deploy**.
7. Kuch hi seconds me aapka frontend live ho jayega!

---

## 3️⃣ STEP 3: Local / VPS / Docker Deployment (Optional)

Agar aap apne laptop par ya VPS server (Ubuntu/Debian) par 1 command me deploy karna chahte hain:

```bash
docker-compose up --build -d
```
Isse:
- Backend `http://localhost:8000` par run hoga (Gunicorn ke sath)
- Frontend `http://localhost:8081` par run hoga (Nginx ke sath production build)

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`):
| Variable | Description | Default |
|---|---|---|
| `SECRET_KEY` | Django Secret Key | Auto fallback |
| `DEBUG` | Debug Mode (`True`/`False`) | `False` in prod |
| `ALLOWED_HOSTS` | Allowed domain names | `*` |
| `CSRF_TRUSTED_ORIGINS` | Trusted origins for CSRF | `http://localhost:8081` |

### Frontend (`frontend/.env`):
| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | Live backend API URL (e.g., `https://smartmart-api.onrender.com/api`) |
