
# TimolaAdventures – Hosting Guide

## Requirements

- Ubuntu VPS (24.04.3+)
- **2 GB RAM minimum** (4 GB recommended)
- Node.js **22.18.0+**
- Git
- Database credentials (provided separately)

---

## 1. Connect to the Server

```bash
ssh ubuntu@YOUR_SERVER_IP
````

---

## 2. Install System Dependencies

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git nginx -y
```

### Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y
```

Verify:

```bash
node -v
npm -v
```

---

## 3. Clone the Project

```bash
git clone https://github.com/timolaadventures-cmd/timolaadventures.git
cd timolaadventures
```

---

## 4. Configure Environment Variables

Create the `.env` file:

```bash
nano .env
```

Add the required values (example):

```env
DATABASE_URL=your_database_url_here
BETTER_AUTH_SECRET=your-better-auth-secret
BETTER_AUTH_URL=http://your-vps-public-ip:3000
NEXT_PUBLIC_APP_URL=http://your-vps-public-ip:3000
```

Save with **CTRL + X**, then **Y**, then **ENTER**.

---

## 5. Install Dependencies

```bash
npm install
```

---

## 6. Generate Prisma Client

```bash
npx prisma generate
```

(Required before running the app)

---

## 7. Build the Application

```bash
npm run build
```

---

## 8. Start the App

```bash
npm start
```

The app will be available at:

```
http://localhost:3000
```

---

## 9. (Recommended) Run in Background with PM2

```bash
npm install -g pm2
pm2 start npm --name "timolaadventures" -- start
pm2 save
```

---

## 10. Access From Browser

You can access the website using:

```
http://YOUR_SERVER_IP:3000
```

(Optional: configure Nginx as a reverse proxy for port 80.)

---

## Notes

* `.env` **must be configured before running**
* `prisma generate` is required after install
* Use PM2 to keep the app running
* Swap memory is recommended for small servers

---

## Support

For deployment help or maintenance, contact the developer.



