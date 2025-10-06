#!/bin/bash

# Fix Azure App Service 403 - Site Disabled Error
# This script diagnoses and fixes common issues causing the 403 error

set -e  # Exit on error

echo "🔧 Azure App Service 403 Fix Script"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Configuration
RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-capersports-rg}"
APP_NAME="${AZURE_APP_NAME:-capersports-api}"

print_info "Configuration:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  App Service: $APP_NAME"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed"
    print_info "Install from: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

print_success "Azure CLI is installed"

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    print_warning "Not logged in to Azure"
    print_info "Logging in..."
    az login
fi

print_success "Logged in to Azure"

# Get current subscription
SUBSCRIPTION=$(az account show --query name -o tsv)
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
print_info "Current subscription: $SUBSCRIPTION"
print_info "Subscription ID: $SUBSCRIPTION_ID"
echo ""

# Step 1: Check subscription status
print_info "Step 1: Checking subscription status..."
SUBSCRIPTION_STATE=$(az account show --query "state" -o tsv)

if [ "$SUBSCRIPTION_STATE" != "Enabled" ]; then
    print_error "Subscription is not enabled: $SUBSCRIPTION_STATE"
    print_warning "Please check your billing and payment method in Azure Portal"
    print_info "Visit: https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBlade"
    exit 1
fi

print_success "Subscription is enabled"
echo ""

# Step 2: Check if resource group exists
print_info "Step 2: Checking resource group..."
if ! az group exists --name $RESOURCE_GROUP | grep -q "true"; then
    print_error "Resource group '$RESOURCE_GROUP' does not exist"
    print_info "Create it first or update the RESOURCE_GROUP variable"
    exit 1
fi

print_success "Resource group exists"
echo ""

# Step 3: Check resource group locks
print_info "Step 3: Checking for resource locks..."
LOCKS=$(az lock list --resource-group $RESOURCE_GROUP --query "length(@)" -o tsv)

if [ "$LOCKS" -gt 0 ]; then
    print_warning "Found $LOCKS lock(s) on resource group"
    az lock list --resource-group $RESOURCE_GROUP -o table
    print_info "These locks might prevent deployment. Consider removing them if appropriate."
else
    print_success "No locks found"
fi
echo ""

# Step 4: Check if App Service exists
print_info "Step 4: Checking App Service..."
if ! az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    print_error "App Service '$APP_NAME' does not exist"
    print_info "Create it first or update the APP_NAME variable"
    exit 1
fi

print_success "App Service exists"
echo ""

# Step 5: Check App Service state
print_info "Step 5: Checking App Service state..."
APP_STATE=$(az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query "state" -o tsv)

print_info "Current state: $APP_STATE"

if [ "$APP_STATE" != "Running" ]; then
    print_warning "App Service is not running (state: $APP_STATE)"
    print_info "Starting App Service..."
    
    az webapp start --name $APP_NAME --resource-group $RESOURCE_GROUP
    
    # Wait for app to start
    print_info "Waiting for app to start (30 seconds)..."
    sleep 30
    
    # Check state again
    APP_STATE=$(az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query "state" -o tsv)
    
    if [ "$APP_STATE" == "Running" ]; then
        print_success "App Service started successfully"
    else
        print_error "Failed to start App Service. Current state: $APP_STATE"
        exit 1
    fi
else
    print_success "App Service is running"
fi
echo ""

# Step 6: Check App Service Plan
print_info "Step 6: Checking App Service Plan..."
PLAN_NAME=$(az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query "appServicePlanId" -o tsv | awk -F'/' '{print $NF}')
print_info "App Service Plan: $PLAN_NAME"

PLAN_STATUS=$(az appservice plan show --name $PLAN_NAME --resource-group $RESOURCE_GROUP --query "status" -o tsv)
print_info "Plan status: $PLAN_STATUS"

if [ "$PLAN_STATUS" != "Ready" ]; then
    print_warning "App Service Plan is not ready: $PLAN_STATUS"
else
    print_success "App Service Plan is ready"
fi
echo ""

# Step 7: Check availability state
print_info "Step 7: Checking availability state..."
AVAILABILITY=$(az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query "availabilityState" -o tsv)
print_info "Availability state: $AVAILABILITY"

if [ "$AVAILABILITY" != "Normal" ]; then
    print_warning "App Service availability is not normal: $AVAILABILITY"
else
    print_success "App Service availability is normal"
fi
echo ""

# Step 8: Restart the App Service
print_info "Step 8: Restarting App Service for good measure..."
az webapp restart --name $APP_NAME --resource-group $RESOURCE_GROUP

print_info "Waiting for restart to complete (30 seconds)..."
sleep 30

print_success "App Service restarted"
echo ""

# Step 9: Test the health endpoint
print_info "Step 9: Testing health endpoint..."
HEALTH_URL="https://${APP_NAME}.azurewebsites.net/api/health"
print_info "Health URL: $HEALTH_URL"

# Wait a bit more for the app to be fully ready
sleep 10

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")

if [ "$HTTP_CODE" == "200" ]; then
    print_success "Health check passed (HTTP $HTTP_CODE)"
    print_info "Testing response..."
    curl -s "$HEALTH_URL" | jq '.' || curl -s "$HEALTH_URL"
elif [ "$HTTP_CODE" == "000" ]; then
    print_warning "Could not connect to health endpoint"
    print_info "The app might still be starting up. Try again in a few minutes."
else
    print_warning "Health check returned HTTP $HTTP_CODE"
    print_info "The app might still be initializing. Check the logs:"
    print_info "  az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP"
fi
echo ""

# Step 10: Show deployment information
print_info "Step 10: Deployment information..."
print_info "App Service URL: https://${APP_NAME}.azurewebsites.net"
print_info "Health Check: https://${APP_NAME}.azurewebsites.net/api/health"
print_info "Debug Endpoint: https://${APP_NAME}.azurewebsites.net/api/debug"
echo ""

# Step 11: Check environment variables
print_info "Step 11: Checking critical environment variables..."
ENV_VARS=$(az webapp config appsettings list --name $APP_NAME --resource-group $RESOURCE_GROUP --query "[].{Name:name}" -o tsv)

REQUIRED_VARS=("AZURE_COSMOS_CONNECTION_STRING" "AZURE_STORAGE_CONNECTION_STRING" "JWT_SECRET" "NODE_ENV")
MISSING_VARS=()

for VAR in "${REQUIRED_VARS[@]}"; do
    if echo "$ENV_VARS" | grep -q "^${VAR}$"; then
        print_success "$VAR is set"
    else
        print_error "$VAR is NOT set"
        MISSING_VARS+=("$VAR")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo ""
    print_warning "Missing environment variables: ${MISSING_VARS[*]}"
    print_info "Set them in Azure Portal:"
    print_info "  Portal → App Services → $APP_NAME → Configuration → Application settings"
    echo ""
fi

# Summary
echo ""
echo "========================================"
print_success "Diagnostic and fix script completed!"
echo "========================================"
echo ""

if [ "$APP_STATE" == "Running" ] && [ "$HTTP_CODE" == "200" ]; then
    print_success "Your App Service is running and healthy!"
    print_info "You can now try deploying again."
    echo ""
    print_info "To deploy, run:"
    echo "  cd /Users/r0s0fw2/Desktop/capersports-web"
    echo "  ./deploy-azure.sh"
elif [ "$APP_STATE" == "Running" ]; then
    print_warning "App Service is running but health check failed."
    print_info "Check the application logs:"
    echo "  az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP"
    echo ""
    print_info "Or view logs in Azure Portal:"
    print_info "  Portal → App Services → $APP_NAME → Log stream"
else
    print_error "App Service is not in a healthy state."
    print_info "Please check Azure Portal for more details:"
    print_info "  https://portal.azure.com/#@/resource/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Web/sites/${APP_NAME}/appServices"
fi

echo ""
print_info "For more help, see: FIX_AZURE_403_DISABLED.md"
echo ""
