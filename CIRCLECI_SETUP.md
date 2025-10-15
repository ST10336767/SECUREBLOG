# CircleCI Setup Guide for Secure Blog

This guide will walk you through connecting your secure blog application to CircleCI and setting up a complete CI/CD pipeline.

## 🚀 Step 1: Connect to CircleCI

### 1.1 Sign up for CircleCI
1. Go to [CircleCI.com](https://circleci.com)
2. Click "Sign Up" and choose "Sign up with GitHub" (recommended)
3. Authorize CircleCI to access your GitHub account

### 1.2 Add your project to CircleCI
1. Once logged in, click "Add Projects" in the sidebar
2. Find your `secureblog` repository
3. Click "Set Up Project"
4. Choose "Fastest" setup (we already have the config file)
5. Click "Set Up Project"

## 🔧 Step 2: Configure Environment Variables

### 2.1 Access Project Settings
1. In your CircleCI dashboard, click on your `secureblog` project
2. Click the gear icon (⚙️) in the top right to access Project Settings
3. Click "Environment Variables" in the left sidebar

### 2.2 Add Required Environment Variables

Add these environment variables (click "Add Environment Variable" for each):

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `RENDER_DEPLOY_HOOK_URL` | Render Deploy Hook URL | `https://api.render.com/deploy/srv-xxxxx` |
| `RENDER_SERVICE_URL` | Your Render service URL | `https://secureblog-backend.onrender.com` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/secureblog` |
| `JWT_SECRET` | JWT secret for authentication | `your-super-secret-jwt-key` |
| `NODE_ENV` | Environment setting | `production` |

### 2.3 Environment Variable Details

#### RENDER_DEPLOY_HOOK_URL
- This will be provided by Render when you set up the deploy hook
- Format: `https://api.render.com/deploy/srv-xxxxxxxxx`
- Keep this secret - it triggers deployments

#### RENDER_SERVICE_URL
- Your deployed service URL on Render
- Format: `https://your-service-name.onrender.com`
- Used for health checks

#### MONGO_URI
- MongoDB Atlas connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/database`
- Make sure to whitelist CircleCI IPs in MongoDB Atlas

#### JWT_SECRET
- Secret key for JWT token signing
- Should be a long, random string
- Generate with: `openssl rand -base64 32`

## 🏗️ Step 3: Set up Render Service

### 3.1 Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Connect your repository

### 3.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `secureblog-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd secureblog-backend && npm install`
   - **Start Command**: `cd secureblog-backend && npm start`
   - **Instance Type**: Free tier (or paid for production)

### 3.3 Set Environment Variables in Render
Add the same environment variables in Render:
- `MONGO_URI`
- `JWT_SECRET`
- `NODE_ENV=production`
- `PORT=10000` (Render's default port)

### 3.4 Create Deploy Hook
1. In your Render service dashboard
2. Go to "Settings" → "Deploy Hooks"
3. Click "Create Deploy Hook"
4. Copy the deploy hook URL
5. Add this URL as `RENDER_DEPLOY_HOOK_URL` in CircleCI

## 🔄 Step 4: Pipeline Workflow

Your CircleCI pipeline will now:

1. **Test Phase**:
   - Run ESLint on both frontend and backend
   - Run Jest tests
   - Store test results and coverage

2. **Build Phase**:
   - Build Docker image
   - Tag with commit SHA
   - Store as artifact

3. **Deploy Phase** (only on main branch):
   - Trigger Render deployment via webhook
   - Wait for deployment
   - Perform health check on `/health` endpoint

## 🧪 Step 5: Test the Pipeline

### 5.1 Trigger a Build
1. Make a small change to your code
2. Commit and push to your repository
3. Go to CircleCI dashboard to watch the pipeline

### 5.2 Monitor the Pipeline
- **Green checkmark**: All tests passed
- **Red X**: Tests failed - check logs
- **Yellow circle**: Pipeline running

### 5.3 Check Deployment
1. After successful pipeline, check your Render service
2. Visit your service URL + `/health`
3. Should return: `{"status":"ok"}`

## 🚨 Troubleshooting

### Common Issues:

#### ESLint Errors
- Check `.eslintrc` configuration
- Run `npm run lint` locally to fix issues

#### Test Failures
- Run `npm test` locally
- Check test files in `secureblog-backend/src/tests/`

#### Deployment Failures
- Verify Render service is running
- Check Render logs for errors
- Ensure environment variables are set correctly

#### Health Check Failures
- Verify `/health` endpoint is accessible
- Check if service is actually running
- Ensure SSL certificates are properly configured

## 📊 Monitoring

### CircleCI Insights
- View build times and success rates
- Monitor test coverage trends
- Set up notifications for failures

### Render Monitoring
- Monitor service uptime
- Check response times
- Set up alerts for downtime

## 🔐 Security Best Practices

1. **Never commit secrets** to your repository
2. **Use environment variables** for all sensitive data
3. **Rotate secrets regularly**
4. **Monitor access logs**
5. **Use HTTPS everywhere**

## 📝 Next Steps

After successful setup:
1. Set up branch protection rules in GitHub
2. Configure automatic deployments for staging
3. Add integration tests
4. Set up monitoring and alerting
5. Consider adding security scanning

---

**Need Help?**
- CircleCI Docs: https://circleci.com/docs/
- Render Docs: https://render.com/docs/
- Check the logs in both CircleCI and Render for detailed error messages
