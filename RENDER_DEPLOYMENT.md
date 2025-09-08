# 🚀 Deploy Podium to Render

## Step-by-Step Render Deployment

### Prerequisites
- GitHub repository with your code
- Render account (free tier available)
- MongoDB Atlas account for database

### 1. Backend Deployment (Express/Node.js)

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Connect your GitHub account
   - Select your Podium repository
   - Choose "server" as the root directory

3. **Configuration**
   ```
   Name: podium-backend (or your preferred name)
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Environment Variables**
   Add these in the Environment section:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secure_jwt_secret_here
   ASSEMBLYAI_API_KEY=your_assemblyai_key
   GEMINI_API_KEY=leave_empty_or_your_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   PORT=10000
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (usually 3-5 minutes)
   - Note your backend URL: `https://your-app-name.onrender.com`

### 2. Frontend Deployment (React/Vite)

1. **Create New Web Service**
   - Click "New +" → "Web Service" again
   - Select same repository
   - Choose "client" as the root directory

2. **Configuration**
   ```
   Name: podium-frontend (or your preferred name)
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Your app will be live at: `https://your-frontend-name.onrender.com`

### 3. Update Backend CORS

After frontend deployment, update your backend CORS settings:

In `server/index.js`, add your frontend Render URL to allowed origins:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://your-frontend-name.onrender.com', // Add this line
  process.env.FRONTEND_URL,
];
```

### 4. Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [cloud.mongodb.com](https://cloud.mongodb.com)
   - Create free tier cluster

2. **Network Access**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allow all - Render uses dynamic IPs)

3. **Database User**
   - Create database user with read/write permissions
   - Copy connection string to MONGODB_URI environment variable

### 5. Testing Your Deployment

1. Visit your frontend URL
2. Try registering a new account
3. Test the interview practice feature
4. Check that all features work correctly

### 6. Custom Domain (Optional)

1. **In Render Dashboard**
   - Go to your frontend service
   - Click "Settings" → "Custom Domains"
   - Add your domain name

2. **DNS Configuration**
   - Point your domain's CNAME to your Render URL
   - Wait for DNS propagation (up to 24 hours)

### 7. SSL Certificate

- Render automatically provides SSL certificates for all deployments
- Your app will be accessible via HTTPS

### Troubleshooting

**Common Issues:**
- **Build Fails**: Check build logs for missing dependencies
- **CORS Errors**: Ensure frontend URL is in backend CORS whitelist
- **Database Connection**: Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- **Environment Variables**: Double-check all required variables are set

**Free Tier Limitations:**
- Services spin down after 15 minutes of inactivity
- Cold starts may take 30+ seconds
- Limited to 750 hours/month

### Render vs Other Platforms

| Feature | Render | Vercel | Railway | Heroku |
|---------|--------|--------|---------|--------|
| **Free Tier** | ✅ 750h/month | ✅ Unlimited | ✅ $5 credit | ❌ Discontinued |
| **Backend Support** | ✅ Full Node.js | ❌ Serverless only | ✅ Full Node.js | ✅ Full Node.js |
| **Auto-deploy** | ✅ Git integration | ✅ Git integration | ✅ Git integration | ✅ Git integration |
| **Custom Domains** | ✅ Free SSL | ✅ Free SSL | ✅ Paid SSL | ✅ Paid SSL |
| **Cold Starts** | ~30 seconds | ~1 second | ~10 seconds | ~30 seconds |

Your Podium app is now live on Render! 🎉
