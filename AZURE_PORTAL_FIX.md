# 🚨 Azure Portal Quick Fix Guide

## Problem: "URI must include hostname, domain name, and tld"

Your Azure Cosmos DB connection string is missing or incorrect in App Service.

---

## ✅ Solution (5 Minutes)

### Step 1: Get Cosmos DB Connection String (2 min)

1. Go to https://portal.azure.com
2. Search for your Cosmos DB account (e.g., `capersports-cosmos`)
3. Click on it
4. In the left menu, click **"Connection strings"** (under Settings)
5. Click **"Show"** next to "Primary Connection String"
6. Click the **copy icon** to copy the entire string

**What it should look like:**
```
mongodb://capersports:ABC123XYZ...@capersports.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb...
```

✅ Must start with `mongodb://` or `mongodb+srv://`
✅ Must include `@hostname.cosmos.azure.com`
✅ Should be 200-400 characters long

---

### Step 2: Set in App Service (2 min)

1. In Azure Portal, search for your App Service (e.g., `capersports-web`)
2. Click on it
3. In the left menu, click **"Configuration"** (under Settings)
4. Click **"+ New application setting"**
5. Fill in:
   - **Name**: `AZURE_COSMOS_CONNECTION_STRING`
   - **Value**: (paste the connection string you copied)
6. Click **"OK"**
7. Click **"Save"** at the top
8. Click **"Continue"** to confirm restart

---

### Step 3: Verify (1 min)

Wait 30 seconds, then check:

1. In App Service, click **"Log stream"** (under Monitoring)
2. Look for these messages:
   - ✅ `Connection string validation passed`
   - ✅ `Connected to Azure Cosmos DB`
   - ✅ `Azure services initialized successfully`

Or test the health endpoint:
```bash
curl https://your-app.azurewebsites.net/api/health
```

Should return:
```json
{
  "status": "healthy",
  "azure": {
    "configured": true,
    "cosmosConnected": "initialized"
  }
}
```

---

## 🔧 Additional Settings (Optional but Recommended)

While you're in Configuration, add these too:

| Name | Value |
|------|-------|
| `AZURE_COSMOS_DATABASE_NAME` | `capersports` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | (your secret key, 32+ characters) |
| `FRONTEND_URL` | `https://your-frontend.azurestaticapps.net` |

Don't forget to click **"Save"** after adding!

---

## ❌ Common Mistakes

### Mistake 1: Copying the Key Instead of Connection String
❌ **Wrong**: `ABC123XYZ789...` (just the key)
✅ **Right**: `mongodb://capersports:ABC123XYZ789...@capersports.mongo.cosmos.azure.com:10255/...`

### Mistake 2: Incomplete Connection String
❌ **Wrong**: `mongodb://capersports:@capersports.mongo.cosmos.azure.com` (missing password)
✅ **Right**: `mongodb://capersports:PASSWORD@capersports.mongo.cosmos.azure.com:10255/...`

### Mistake 3: Wrong Connection String Type
In Cosmos DB → Connection strings, you'll see multiple options:
- ✅ **Primary Connection String** ← Use this one!
- ❌ Primary Key
- ❌ Primary MongoDB Connection String (sometimes incomplete)

### Mistake 4: Not Restarting
After changing Configuration, you MUST:
1. Click **"Save"** (top of Configuration page)
2. Click **"Continue"** to restart
3. Wait 30 seconds for restart to complete

---

## 🆘 Still Not Working?

### Check 1: Firewall Settings

1. Go to Cosmos DB → **Networking**
2. Ensure **"Allow access from Azure services"** is checked
3. Or add your App Service's outbound IPs

### Check 2: Connection String Length

In App Service → Configuration, click on `AZURE_COSMOS_CONNECTION_STRING`:
- Should be 200-400 characters
- If it's much shorter, it was truncated - copy again

### Check 3: Special Characters

If your connection string has special characters, Azure Portal handles them automatically.
Don't manually encode them!

---

## 📞 Need More Help?

- **Detailed Guide**: See [AZURE_DEPLOYMENT_TROUBLESHOOTING.md](./AZURE_DEPLOYMENT_TROUBLESHOOTING.md)
- **Automated Fix**: Run `./fix-azure-env.sh` from your terminal
- **Azure Docs**: https://docs.microsoft.com/azure/cosmos-db/mongodb/connect-account

---

## 🎯 Quick Checklist

Before asking for help, verify:

- [ ] Connection string copied from Cosmos DB → Connection strings
- [ ] Connection string starts with `mongodb://` or `mongodb+srv://`
- [ ] Connection string includes `@hostname.cosmos.azure.com`
- [ ] Connection string is 200+ characters long
- [ ] Set in App Service → Configuration → Application settings
- [ ] Clicked "Save" and confirmed restart
- [ ] Waited 30 seconds after restart
- [ ] Checked Log stream for success messages

If all checked and still failing, see the detailed troubleshooting guide!
