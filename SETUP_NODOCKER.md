# Setup without Docker (free cloud database)

Use this if you don't have Docker or don't want to run PostgreSQL on your PC.

---

## 1. Get a free database (about 2 minutes)

1. Open **https://neon.tech** in your browser.
2. Click **Sign up** (you can use Google/GitHub).
3. Create a new project (e.g. name: `jobportal`).
4. Copy the **connection string**. It looks like:
   ```text
   postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

---

## 2. Put the URL in your project

1. Open the file **`.env`** in the project root (`c:\Users\Hp\Desktop\sanjays-job-portal\.env`).
2. Replace the line that says `DATABASE_URL=...` with your Neon URL:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
   ```
   (Use your real URL from Neon; keep the quotes.)

---

## 3. Run migrations and start the app

In a terminal, from the project folder:

```powershell
cd c:\Users\Hp\Desktop\sanjays-job-portal
npx prisma migrate dev
cd apps\web
npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## If you prefer Docker later

1. Install **Docker Desktop** and start it.
2. In the project folder run: `docker compose up -d`
3. Use the steps in **SETUP.md** (migrate, then start the app).
