# Azure Portal Setup - Quick Reference Card

## 🚀 Quick Setup Checklist

### ✅ Step 1: Resource Group (2 minutes)
```
Portal → Resource groups → + Create
├── Name: caper-sports-rg
├── Region: East US (or your preferred)
└── Create
```

### ✅ Step 2: Cosmos DB (10 minutes)
```
Portal → + Create resource → Azure Cosmos DB → MongoDB API
├── Resource Group: caper-sports-rg
├── Account Name: caper-sports-cosmos
├── Location: Same as resource group
├── Capacity mode: Provisioned throughput
├── Free Tier: Apply (if available)
├── Geo-Redundancy: Disable
└── Create → Wait 5-10 minutes
```

**After creation:**
```
Data Explorer → New Database
├── Database: capersports
├── Throughput: 400 RU/s
└── Collections: users, products, orders
```

### ✅ Step 3: Storage Account (5 minutes)
```
Portal → + Create resource → Storage account
├── Resource Group: caper-sports-rg
├── Name: capersportsstorage
├── Region: Same as resource group
├── Performance: Standard
├── Redundancy: LRS
└── Create → Wait 2-3 minutes
```

**After creation:**
```
Containers → + Container
├── product-images (Public: Blob)
├── user-avatars (Public: Blob)
└── general-assets (Public: Blob)
```

### ✅ Step 4: Get Connection Strings
**Cosmos DB:**
```
Your Cosmos DB → Connection strings → Copy Primary Connection String
```

**Storage:**
```
Your Storage → Access keys → key1 → Show → Copy Connection string
```

### ✅ Step 5: Configure App
```bash
# Install dependencies
cd server && npm install @azure/storage-blob @azure/cosmos uuid

# Update .env file with connection strings
# Start with Azure
npm run dev:azure
```

---

## 🔑 Connection String Examples

### Cosmos DB Connection String
```
mongodb://caper-sports-cosmos:KEY@caper-sports-cosmos.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@caper-sports-cosmos@
```

### Storage Connection String
```
DefaultEndpointsProtocol=https;AccountName=capersportsstorage;AccountKey=KEY;EndpointSuffix=core.windows.net
```

---

## 💰 Expected Costs

| Service | Configuration | Monthly Cost |
|---------|---------------|--------------|
| Cosmos DB | 400 RU/s, Single region | ~$25-30 |
| Blob Storage | 10GB Hot tier | ~$2-3 |
| **Total** | | **~$27-33** |

**Savings vs MongoDB Atlas + Cloudinary**: 20-40%

---

## 🎯 Key Azure Portal Locations

### Navigation Quick Links
- **Resource Groups**: Portal → Resource groups
- **Cosmos DB**: Portal → Azure Cosmos DB
- **Storage**: Portal → Storage accounts
- **Cost Management**: Portal → Cost Management + Billing
- **All Resources**: Portal → All resources

### Important Settings Pages
**Cosmos DB:**
- Connection strings: `Your DB → Connection strings`
- Data Explorer: `Your DB → Data Explorer`
- Firewall: `Your DB → Firewall and virtual networks`

**Storage:**
- Containers: `Your Storage → Containers`
- Access Keys: `Your Storage → Access keys`
- Networking: `Your Storage → Networking`

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't Do This
- Use different regions for resources
- Enable geo-redundancy (expensive)
- Set containers to private (breaks image access)
- Forget to copy connection strings
- Use uppercase in storage account name

### ✅ Do This
- Keep all resources in same region
- Use LRS redundancy for cost savings
- Set blob containers to public access
- Save connection strings securely
- Use lowercase for storage names

---

## 🔧 Troubleshooting Quick Fixes

### Connection Issues
```bash
# Check if environment variables are set
echo $AZURE_COSMOS_CONNECTION_STRING
echo $AZURE_STORAGE_CONNECTION_STRING

# Test connection
npm run dev:azure
# Look for: "✅ Connected to Azure Cosmos DB"
```

### Permission Issues
1. **Cosmos DB**: Check Firewall settings → Allow All Networks
2. **Storage**: Check container Public access level → Blob
3. **Keys**: Ensure Access keys are enabled in Storage account

### Cost Issues
1. **Monitor**: Portal → Cost Management → Cost analysis
2. **Budget**: Set budget alert at $40/month
3. **Optimize**: Use 400 RU/s minimum for Cosmos DB

---

## 📱 Mobile-Friendly Portal Tips

### Using Azure Portal on Mobile
1. **Download Azure Mobile App** for easier management
2. **Bookmark key pages** for quick access
3. **Use search** instead of navigation menus
4. **Pin important resources** to dashboard

### Quick Actions on Mobile
- View costs: App → Cost Management
- Check resource health: App → Resource Health
- Monitor usage: App → Metrics

---

## 🎉 Success Indicators

### ✅ Setup Complete When You See:
1. **Resource Group**: Contains 2 resources (Cosmos DB + Storage)
2. **Cosmos DB**: Shows "Running" status with 3 collections
3. **Storage**: Shows 3 containers with public access
4. **Application**: Console shows "Connected to Azure Cosmos DB"
5. **Health Check**: `/api/health` returns Azure services as healthy

### 📊 Monitoring Dashboard
Create a custom dashboard:
1. Portal → Dashboard → + New dashboard
2. Add tiles: Resource health, Cost analysis, Metrics
3. Pin your resource group for quick access

---

**Need Help?** 
- 📖 Full guide: `AZURE_PORTAL_SETUP.md`
- 🔧 CLI alternative: `./setup-azure.sh`
- 💬 Azure Support: Portal → Help + support
