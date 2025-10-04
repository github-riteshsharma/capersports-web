# Instagram API Integration Setup

This guide explains how to set up real Instagram post fetching for the Caper Sports website.

## Overview

The website now includes a dynamic Instagram feed that fetches the latest 4 posts from `@caper_sports9`. When the API is not configured, it falls back to curated dummy posts.

## Files Added/Modified

### New Files
- `client/src/services/instagramService.js` - Instagram API service
- `client/.env.example` - Environment variables template

### Modified Files
- `client/src/pages/Home.js` - Updated to use dynamic Instagram posts

## Instagram Basic Display API Setup

### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Choose "Consumer" app type
4. Fill in app details

### Step 2: Add Instagram Basic Display
1. In your app dashboard, click "+ Add Product"
2. Find "Instagram Basic Display" and click "Set Up"
3. Complete the setup process

### Step 3: Get Access Token
1. Go to Instagram Basic Display > Basic Display
2. Create a new Instagram App
3. Add Instagram Test User (your @caper_sports9 account)
4. Generate Access Token
5. Exchange for Long-Lived Token (recommended)

### Step 4: Configure Environment Variables
Create a `.env` file in the `client` folder:

```bash
# Instagram Access Token
REACT_APP_INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token_here
```

### Step 5: Test the Integration
1. Restart your development server
2. The Instagram feed should now show real posts from @caper_sports9
3. Check browser console for any API errors

## API Limitations

### Instagram Basic Display API Limitations:
- **Likes/Comments**: Not available without additional permissions
- **Rate Limits**: 200 requests per hour per user
- **Token Expiry**: Long-lived tokens expire after 60 days
- **Test Users**: Limited to accounts added as test users

### Current Implementation:
- **Real Data**: Images, captions, timestamps from actual posts
- **Fallback Data**: Likes and comments are generated realistically
- **Error Handling**: Falls back to curated posts if API fails
- **Performance**: Caches results to minimize API calls

## Production Considerations

### Security
- Never expose access tokens in client-side code for production
- Consider server-side proxy for API calls
- Implement proper error handling and rate limiting

### Recommended Architecture
```
Client -> Your Server -> Instagram API
```

### Server-Side Implementation (Recommended)
1. Create API endpoint on your server (e.g., `/api/instagram/posts`)
2. Server fetches from Instagram API using stored access token
3. Client fetches from your server endpoint
4. Implement caching and rate limiting on server

## Troubleshooting

### Common Issues
1. **"Access token not found"** - Check your `.env` file
2. **API errors** - Verify token validity and permissions
3. **CORS errors** - Instagram API should work from browser
4. **Rate limiting** - Implement caching to reduce API calls

### Fallback Behavior
If Instagram API fails, the service automatically falls back to curated posts that match your brand and content style.

## Future Enhancements

### Possible Improvements
1. **Server-side caching** - Store posts in database
2. **Webhook integration** - Auto-update when new posts are published
3. **Admin panel** - Manually curate which posts to display
4. **Analytics** - Track engagement with Instagram posts

### Instagram Graph API (Advanced)
For more features like real likes/comments, consider upgrading to Instagram Graph API (requires business account and app review).

## Support

For Instagram API issues:
- [Instagram Basic Display API Documentation](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Facebook Developer Community](https://developers.facebook.com/community/)

For implementation questions, check the service file comments and console logs for debugging information.
