# Smart Hiring Platform – Setup Guide

**Don't have Docker?** Use a free cloud database instead → see **[SETUP_NODOCKER.md](./SETUP_NODOCKER.md)**.

---

Follow these steps in order (with Docker):

---

## Step 1: Start the database (PostgreSQL + Redis)

1. Open **PowerShell** or **Command Prompt**
2. Go to the project folder:
   ```
   cd c:\Users\Hp\Desktop\sanjays-job-portal
   ```
3. Run:
   ```
   docker compose up -d
   ```
4. Wait until you see "Done" – PostgreSQL and Redis will run in the background.

---

## Step 2: Run database migrations

In the same folder, run:
```
pnpm prisma migrate deploy
```
This creates the tables (User, Job, Application, Notification, etc.) in the database.

---

## Step 3: Start the app

Run:
```
cd apps\web
pnpm dev
```

Then open your browser and go to: **http://localhost:3000**

---

## Step 4: Create accounts

### First Admin (Recruiter)
1. Go to **http://localhost:3000/register**
2. Fill in name, email, password
3. Select **Admin / Recruiter** as role
4. Click **Create Account**
5. Login at **http://localhost:3000/login**
6. You can now access **Admin** to post jobs

### First User (Job Seeker)
1. Go to **http://localhost:3000/register**
2. Select **Student / Job Seeker**
3. Create account and login
4. Apply for jobs and see status updates in **Dashboard**

---

## Features

- **Users & Admins** – Register and login with role (Student or Admin)
- **Admin notifications** – When someone applies, admins see a notification
- **Status updates** – When admin approves/rejects, the applicant gets a notification in their Dashboard
- **Job fields** – Skills needed, salary, location/state
- **Filters** – Filter jobs by state (all Indian states + UTs) and skills

---

## To stop everything later

- Stop the app: press `Ctrl + C` in the terminal
- Stop the database: `docker compose down`
