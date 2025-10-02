# Azure Deployment Checklist

Use this checklist to ensure a smooth deployment to Azure.

## Pre-Deployment

### Code Preparation
- [ ] All code committed to Git
- [ ] Repository pushed to GitHub
- [ ] `.gitignore` configured correctly
- [ ] No sensitive data in code
- [ ] All dependencies listed in `package.json`
- [ ] Build scripts tested locally

### Environment Setup
- [ ] MongoDB database ready (Atlas or Cosmos DB)
- [ ] Cloudinary account configured
- [ ] Stripe account configured
- [ ] Email service configured (Gmail App Password)
- [ ] All API keys and secrets documented

### Azure Account
- [ ] Azure account created
- [ ] Active subscription verified
- [ ] Billing alerts configured
- [ ] Resource naming convention decided

## Azure Resources Creation

### Resource Group
- [ ] Resource group created
- [ ] Appropriate region selected
- [ ] Tags added for organization

### Backend (App Service)
- [ ] App Service created
- [ ] Node.js 18 LTS runtime selected
- [ ] Linux OS selected
- [ ] Appropriate pricing tier chosen (B1 minimum)
- [ ] App Service Plan created

### Frontend (Static Web App)
- [ ] Static Web App created
- [ ] GitHub repository connected
- [ ] Build configuration set (React, /client, build)
- [ ] Free tier selected (or appropriate tier)

### Database
- [ ] MongoDB connection string obtained
- [ ] Network access configured (whitelist Azure IPs)
- [ ] Database user created with appropriate permissions
- [ ] Connection tested locally

## Configuration

### Backend Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=8080`
- [ ] `MONGODB_URI` configured
- [ ] `JWT_SECRET` generated (64+ characters)
- [ ] `JWT_EXPIRE` set
- [ ] `CLOUDINARY_CLOUD_NAME` set
- [ ] `CLOUDINARY_API_KEY` set
- [ ] `CLOUDINARY_API_SECRET` set
- [ ] `STRIPE_SECRET_KEY` set
- [ ] `STRIPE_PUBLISHABLE_KEY` set
- [ ] `SMTP_HOST` configured
- [ ] `SMTP_PORT` configured
- [ ] `SMTP_EMAIL` configured
- [ ] `SMTP_PASSWORD` configured
- [ ] `FRONTEND_URL` set to Static Web App URL
- [ ] `CORS_ORIGIN` set to Static Web App URL
- [ ] `RATE_LIMIT_MAX_REQUESTS` set
- [ ] `HELMET_ENABLED=true`

### Frontend Environment Variables
- [ ] `REACT_APP_API_URL` set to App Service URL
- [ ] `REACT_APP_STRIPE_PUBLISHABLE_KEY` set
- [ ] `REACT_APP_NAME` set
- [ ] `REACT_APP_VERSION` set
- [ ] `REACT_APP_ENV=production`
- [ ] `GENERATE_SOURCEMAP=false`
- [ ] `DISABLE_ESLINT_PLUGIN=true`

### Backend App Service Settings
- [ ] Startup command configured: `cd server && npm install && node server.js`
- [ ] Always On enabled (if using Standard tier or higher)
- [ ] HTTP version set to 2.0
- [ ] HTTPS Only enabled
- [ ] Minimum TLS version set to 1.2

## Deployment

### Backend Deployment
- [ ] Deployment Center configured
- [ ] GitHub Actions workflow created
- [ ] First deployment successful
- [ ] Logs checked for errors
- [ ] Health endpoint responding: `/api/health`

### Frontend Deployment
- [ ] GitHub Actions workflow created
- [ ] Build completed successfully
- [ ] Static files deployed
- [ ] Homepage loads correctly
- [ ] API calls working

## Testing

### Backend API Testing
- [ ] Health check endpoint works
- [ ] Authentication endpoints work (register/login)
- [ ] Product endpoints work
- [ ] Order endpoints work
- [ ] Admin endpoints work (with admin user)
- [ ] File upload works (Cloudinary)
- [ ] Email sending works
- [ ] Payment processing works (Stripe test mode)

### Frontend Testing
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Product listing page works
- [ ] Product detail page works
- [ ] Search functionality works
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] User registration works
- [ ] User login works
- [ ] User profile works
- [ ] Order history works
- [ ] Admin dashboard works (if admin)
- [ ] Responsive design works (mobile/tablet)
- [ ] Dark mode works (if implemented)

### Integration Testing
- [ ] Frontend can communicate with backend
- [ ] CORS configured correctly
- [ ] Authentication flow works end-to-end
- [ ] Payment flow works end-to-end
- [ ] Email notifications sent correctly
- [ ] Image uploads work correctly

## Security

### SSL/TLS
- [ ] HTTPS enforced on both frontend and backend
- [ ] SSL certificate valid
- [ ] HTTP redirects to HTTPS

### Headers & CORS
- [ ] Security headers configured (Helmet)
- [ ] CORS properly configured
- [ ] CSP headers set (if applicable)

### Secrets Management
- [ ] No secrets in code
- [ ] Environment variables properly set
- [ ] Consider Azure Key Vault for sensitive data

### Rate Limiting
- [ ] Rate limiting enabled
- [ ] Appropriate limits set
- [ ] DDoS protection considered

## Monitoring & Logging

### Application Insights
- [ ] Application Insights enabled
- [ ] Instrumentation key configured
- [ ] Custom events tracked (if applicable)

### Logging
- [ ] Log stream accessible
- [ ] Error logging working
- [ ] Log retention configured

### Alerts
- [ ] CPU usage alert configured
- [ ] Memory usage alert configured
- [ ] Response time alert configured
- [ ] Error rate alert configured
- [ ] Availability alert configured

### Monitoring Dashboard
- [ ] Azure Dashboard created
- [ ] Key metrics pinned
- [ ] Shared with team (if applicable)

## Performance

### Backend Optimization
- [ ] Compression enabled
- [ ] Response caching configured (if applicable)
- [ ] Database queries optimized
- [ ] Connection pooling configured

### Frontend Optimization
- [ ] Production build optimized
- [ ] Code splitting implemented
- [ ] Lazy loading implemented
- [ ] Images optimized
- [ ] CDN configured (if applicable)

### Scaling
- [ ] Auto-scaling rules configured (if needed)
- [ ] Load testing performed
- [ ] Performance benchmarks established

## Backup & Recovery

### Database Backup
- [ ] Automated backups configured
- [ ] Backup retention policy set
- [ ] Backup restoration tested

### App Service Backup
- [ ] Backup configured (if using Standard tier or higher)
- [ ] Backup schedule set
- [ ] Backup storage configured

### Disaster Recovery
- [ ] Recovery plan documented
- [ ] RTO (Recovery Time Objective) defined
- [ ] RPO (Recovery Point Objective) defined

## Documentation

### Technical Documentation
- [ ] Architecture diagram created
- [ ] API documentation updated
- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide created

### User Documentation
- [ ] User guide updated (if applicable)
- [ ] Admin guide updated
- [ ] FAQ updated

## Post-Deployment

### Domain & DNS
- [ ] Custom domain configured (if applicable)
- [ ] DNS records updated
- [ ] SSL certificate for custom domain

### SEO
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] Meta tags optimized
- [ ] Google Analytics configured (if applicable)

### Communication
- [ ] Stakeholders notified
- [ ] Users notified (if applicable)
- [ ] Support team briefed

### Maintenance
- [ ] Maintenance window scheduled
- [ ] Update process documented
- [ ] Rollback plan documented

## Cost Management

### Cost Optimization
- [ ] Appropriate pricing tiers selected
- [ ] Unused resources identified
- [ ] Reserved instances considered (for long-term)
- [ ] Cost alerts configured

### Budget
- [ ] Monthly budget set
- [ ] Cost tracking enabled
- [ ] Spending alerts configured

## Compliance & Legal

### Data Privacy
- [ ] GDPR compliance checked (if applicable)
- [ ] Privacy policy updated
- [ ] Cookie consent implemented (if applicable)
- [ ] Data retention policy defined

### Terms & Conditions
- [ ] Terms of service updated
- [ ] User agreement in place

## Final Checks

- [ ] All tests passing
- [ ] No console errors
- [ ] No broken links
- [ ] All features working as expected
- [ ] Performance acceptable
- [ ] Security scan passed
- [ ] Accessibility checked
- [ ] Cross-browser testing done
- [ ] Mobile testing done
- [ ] Load testing done (if applicable)

## Sign-Off

- [ ] Development team sign-off
- [ ] QA team sign-off
- [ ] Product owner sign-off
- [ ] Stakeholder sign-off

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Notes**: 
_______________________________________________
_______________________________________________
_______________________________________________

---

## Quick Reference

**Backend URL**: https://capersports-api-YOUR_NAME.azurewebsites.net
**Frontend URL**: https://capersports-web-YOUR_NAME.azurestaticapps.net
**Database**: MongoDB Atlas / Azure Cosmos DB
**Resource Group**: capersports-rg
**Region**: _______________

---

**Status**: 🎉 DEPLOYED | ⚠️ IN PROGRESS | ❌ NOT STARTED
