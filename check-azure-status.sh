#!/bin/bash

# Quick Azure Status Check Script
# Displays current status of your Azure resources

set -e

echo "🔍 Azure Status Check"
echo "===================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-capersports-rg}"
APP_NAME="${AZURE_APP_NAME:-capersports-api}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}✗ Azure CLI not installed${NC}"
    exit 1
fi

# Check if logged in
if ! az account show &> /dev/null; then
    echo -e "${RED}✗ Not logged in to Azure${NC}"
    echo "Run: az login"
    exit 1
fi

echo -e "${GREEN}✓ Logged in to Azure${NC}"
SUBSCRIPTION=$(az account show --query name -o tsv)
echo -e "${BLUE}Subscription: $SUBSCRIPTION${NC}"
echo ""

# Check App Service
echo "📱 App Service Status:"
echo "--------------------"

if az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    STATE=$(az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query "state" -o tsv)
    AVAILABILITY=$(az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query "availabilityState" -o tsv)
    URL=$(az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query "defaultHostName" -o tsv)
    
    echo "Name: $APP_NAME"
    echo "Resource Group: $RESOURCE_GROUP"
    
    if [ "$STATE" == "Running" ]; then
        echo -e "State: ${GREEN}$STATE${NC}"
    else
        echo -e "State: ${RED}$STATE${NC}"
    fi
    
    if [ "$AVAILABILITY" == "Normal" ]; then
        echo -e "Availability: ${GREEN}$AVAILABILITY${NC}"
    else
        echo -e "Availability: ${YELLOW}$AVAILABILITY${NC}"
    fi
    
    echo "URL: https://$URL"
    
    # Test health endpoint
    echo ""
    echo "🏥 Health Check:"
    echo "---------------"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$URL/api/health" || echo "000")
    
    if [ "$HTTP_CODE" == "200" ]; then
        echo -e "${GREEN}✓ Health check passed (HTTP $HTTP_CODE)${NC}"
    elif [ "$HTTP_CODE" == "000" ]; then
        echo -e "${RED}✗ Could not connect${NC}"
    else
        echo -e "${YELLOW}⚠ Health check returned HTTP $HTTP_CODE${NC}"
    fi
    
else
    echo -e "${RED}✗ App Service '$APP_NAME' not found${NC}"
fi

echo ""
echo "🔗 Quick Links:"
echo "--------------"
echo "Portal: https://portal.azure.com/#@/resource/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$APP_NAME/appServices"
echo "Health: https://$APP_NAME.azurewebsites.net/api/health"
echo "Debug: https://$APP_NAME.azurewebsites.net/api/debug"
echo ""

# Check environment variables
echo "⚙️  Environment Variables:"
echo "------------------------"
REQUIRED_VARS=("NODE_ENV" "AZURE_COSMOS_CONNECTION_STRING" "AZURE_STORAGE_CONNECTION_STRING" "JWT_SECRET")

for VAR in "${REQUIRED_VARS[@]}"; do
    if az webapp config appsettings list --name $APP_NAME --resource-group $RESOURCE_GROUP --query "[?name=='$VAR'].name" -o tsv | grep -q "$VAR"; then
        echo -e "${GREEN}✓${NC} $VAR"
    else
        echo -e "${RED}✗${NC} $VAR (NOT SET)"
    fi
done

echo ""
echo "📊 Quick Actions:"
echo "----------------"
echo "Start app:   az webapp start --name $APP_NAME --resource-group $RESOURCE_GROUP"
echo "Stop app:    az webapp stop --name $APP_NAME --resource-group $RESOURCE_GROUP"
echo "Restart app: az webapp restart --name $APP_NAME --resource-group $RESOURCE_GROUP"
echo "View logs:   az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP"
echo ""
