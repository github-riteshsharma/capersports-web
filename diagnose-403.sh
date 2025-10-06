#!/bin/bash

# Diagnose 403 Deployment Error
# Run this to identify why deployment is failing

set -e

echo "🔍 Diagnosing 403 Deployment Error"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-capersports-rg}"
APP_NAME="${AZURE_APP_NAME:-capersports-api}"

# Check Azure CLI
if ! command -v az &> /dev/null; then
    print_error "Azure CLI not installed"
    exit 1
fi

if ! az account show &> /dev/null; then
    print_error "Not logged in to Azure"
    echo "Run: az login"
    exit 1
fi

print_success "Azure CLI ready"
echo ""

# 1. Check App Service Status
echo "1️⃣  App Service Status"
echo "---------------------"
STATE=$(az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query "state" -o tsv 2>/dev/null || echo "NOT_FOUND")

if [ "$STATE" == "Running" ]; then
    print_success "App is Running"
elif [ "$STATE" == "NOT_FOUND" ]; then
    print_error "App Service not found"
    exit 1
else
    print_error "App is $STATE (should be Running)"
fi
echo ""

# 2. Check Basic Auth Settings
echo "2️⃣  Basic Auth Configuration"
echo "---------------------------"

SCM_AUTH=$(az resource show \
  --resource-group $RESOURCE_GROUP \
  --name scm \
  --resource-type basicPublishingCredentialsPolicies \
  --parent sites/$APP_NAME \
  --query "properties.allow" -o tsv 2>/dev/null || echo "unknown")

if [ "$SCM_AUTH" == "true" ]; then
    print_success "SCM Basic Auth is enabled"
elif [ "$SCM_AUTH" == "false" ]; then
    print_error "SCM Basic Auth is DISABLED (this causes 403 errors)"
    print_info "Fix: Run ./enable-basic-auth.sh"
else
    print_warning "Could not determine SCM Basic Auth status"
fi
echo ""

# 3. Check Authentication/Authorization
echo "3️⃣  App Service Authentication"
echo "-----------------------------"
AUTH_ENABLED=$(az webapp auth show --name $APP_NAME --resource-group $RESOURCE_GROUP --query "enabled" -o tsv 2>/dev/null || echo "false")

if [ "$AUTH_ENABLED" == "true" ]; then
    print_warning "App Service Authentication is enabled"
    print_info "This might block deployments"
else
    print_success "App Service Authentication is disabled"
fi
echo ""

# 4. Check IP Restrictions
echo "4️⃣  IP Restrictions"
echo "------------------"
RESTRICTIONS=$(az webapp config access-restriction show --name $APP_NAME --resource-group $RESOURCE_GROUP --query "length(ipSecurityRestrictions)" -o tsv 2>/dev/null || echo "0")

if [ "$RESTRICTIONS" -gt 1 ]; then
    print_warning "Found $RESTRICTIONS IP restrictions"
    print_info "These might block GitHub Actions"
    az webapp config access-restriction show --name $APP_NAME --resource-group $RESOURCE_GROUP --query "ipSecurityRestrictions[].{Name:name, IP:ipAddress, Action:action}" -o table
else
    print_success "No IP restrictions blocking deployment"
fi
echo ""

# 5. Check Deployment Settings
echo "5️⃣  Deployment Configuration"
echo "---------------------------"
RUN_FROM_PACKAGE=$(az webapp config appsettings list --name $APP_NAME --resource-group $RESOURCE_GROUP --query "[?name=='WEBSITE_RUN_FROM_PACKAGE'].value" -o tsv 2>/dev/null || echo "")

if [ -n "$RUN_FROM_PACKAGE" ] && [ "$RUN_FROM_PACKAGE" != "1" ]; then
    print_warning "WEBSITE_RUN_FROM_PACKAGE is set to: $RUN_FROM_PACKAGE"
    print_info "This might cause read-only mode"
else
    print_success "Deployment configuration looks good"
fi
echo ""

# 6. Test Deployment Endpoint
echo "6️⃣  Deployment Endpoint Test"
echo "---------------------------"
DEPLOYMENT_URL="https://$APP_NAME.scm.azurewebsites.net"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "401" ]; then
    print_success "Deployment endpoint is accessible (HTTP $HTTP_CODE)"
elif [ "$HTTP_CODE" == "403" ]; then
    print_error "Deployment endpoint returns 403 FORBIDDEN"
    print_info "This confirms the authentication issue"
else
    print_warning "Deployment endpoint returned HTTP $HTTP_CODE"
fi
echo ""

# Summary and Recommendations
echo "📋 Summary & Recommendations"
echo "============================"
echo ""

ISSUES_FOUND=0

if [ "$STATE" != "Running" ]; then
    echo "❌ Issue: App Service is not running"
    echo "   Fix: az webapp start --name $APP_NAME --resource-group $RESOURCE_GROUP"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ "$SCM_AUTH" == "false" ]; then
    echo "❌ Issue: SCM Basic Auth is disabled"
    echo "   Fix: ./enable-basic-auth.sh"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ "$AUTH_ENABLED" == "true" ]; then
    echo "⚠️  Warning: App Service Authentication is enabled"
    echo "   Consider: Disable if not needed for deployment"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ "$RESTRICTIONS" -gt 1 ]; then
    echo "⚠️  Warning: IP restrictions are configured"
    echo "   Consider: Allow GitHub Actions IP ranges"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ "$HTTP_CODE" == "403" ]; then
    echo "❌ Issue: Deployment endpoint returns 403"
    echo "   Fix: Enable Basic Auth and check permissions"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ $ISSUES_FOUND -eq 0 ]; then
    echo ""
    print_success "No obvious issues found!"
    echo ""
    print_info "If deployment still fails, try:"
    echo "  1. Get new publish profile: az webapp deployment list-publishing-profiles --name $APP_NAME --resource-group $RESOURCE_GROUP --xml"
    echo "  2. Update GitHub secret: AZURE_WEBAPP_PUBLISH_PROFILE"
    echo "  3. Switch from Service Principal to Publish Profile authentication"
else
    echo ""
    print_warning "Found $ISSUES_FOUND potential issue(s)"
    echo ""
    print_info "Quick fix command:"
    echo "  ./enable-basic-auth.sh"
fi

echo ""
print_info "For detailed solutions, see: FIX_403_RUNNING_APP.md"
echo ""
