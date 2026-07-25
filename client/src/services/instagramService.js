// Instagram Basic Display API Service
// Note: This requires Instagram Basic Display API setup and access token

const INSTAGRAM_API_BASE = 'https://graph.instagram.com';

// You'll need to get this from Instagram Basic Display API
// For development, you can use a long-lived access token
const ACCESS_TOKEN = process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN;

class InstagramService {
  /**
   * Fetch user's media (posts)
   * @param {number} limit - Number of posts to fetch (default: 4)
   * @returns {Promise<Array>} Array of Instagram posts
   */
  async getUserMedia(limit = 4) {
    try {
      if (!ACCESS_TOKEN) {
        console.warn('Instagram access token not found. Using fallback data.');
        return this.getFallbackPosts();
      }

      const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
      const url = `${INSTAGRAM_API_BASE}/me/media?fields=${fields}&limit=${limit}&access_token=${ACCESS_TOKEN}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform Instagram API data to our format
      return this.transformInstagramData(data.data);
      
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      // Return fallback data if API fails
      return this.getFallbackPosts();
    }
  }

  /**
   * Transform Instagram API data to our component format
   * @param {Array} instagramPosts - Raw Instagram API data
   * @returns {Array} Transformed posts for our component
   */
  transformInstagramData(instagramPosts) {
    return instagramPosts.map((post, index) => ({
      id: post.id,
      image: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
      caption: post.caption || 'Check out our latest post! 🔥',
      likes: this.generateRealisticLikes(index), // Instagram Basic Display doesn't provide likes
      timeAgo: this.calculateTimeAgo(post.timestamp),
      permalink: post.permalink,
      comments: this.generateRealisticComments(index) // Instagram Basic Display doesn't provide comments without additional permissions
    }));
  }

  /**
   * Calculate time ago from timestamp
   * @param {string} timestamp - ISO timestamp
   * @returns {string} Time ago string
   */
  calculateTimeAgo(timestamp) {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now - postTime;
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      return `${diffDays}d`;
    }
  }

  /**
   * Generate realistic like counts
   * @param {number} index - Post index
   * @returns {number} Like count
   */
  generateRealisticLikes(index) {
    const baseLikes = [250, 180, 320, 150];
    const randomFactor = Math.floor(Math.random() * 50) - 25; // ±25 variation
    return baseLikes[index % baseLikes.length] + randomFactor;
  }

  /**
   * Generate realistic comments for posts
   * @param {number} index - Post index
   * @returns {Array} Array of comments
   */
  generateRealisticComments(index) {
    const commentSets = [
      [
        { username: "cricket_legends_", text: "Amazing quality jerseys! 🔥", timeAgo: "2h" },
        { username: "sports_gear_pro", text: "Best custom cricket wear! 💯", timeAgo: "1h" },
        { username: "team_captain_official", text: "Thanks @caper_sports9! 🏆", timeAgo: "45m" }
      ],
      [
        { username: "athletic_wear_fan", text: "Premium quality right there! 💪", timeAgo: "3h" },
        { username: "sports_enthusiast_", text: "Love the design and fit! 😍", timeAgo: "2h" }
      ],
      [
        { username: "basketball_elite", text: "Championship level gear! 🏀", timeAgo: "4h" },
        { username: "performance_wear_", text: "Quality you can see! 👌", timeAgo: "3h" },
        { username: "sports_analyst_pro", text: "Setting new standards! 📈", timeAgo: "2h" }
      ],
      [
        { username: "team_sports_fan", text: "Best looking team gear! 🎉", timeAgo: "5h" },
        { username: "custom_jersey_lover", text: "Absolutely stunning! 😍", timeAgo: "4h" }
      ]
    ];
    
    return commentSets[index % commentSets.length] || commentSets[0];
  }

  /**
   * Fallback posts when API is unavailable
   * @returns {Array} Fallback Instagram posts
   */
  getFallbackPosts() {
    return [
      {
        id: 'fallback_1',
        image: "/images/testimonials/testimonials1.png",
        caption: "Abu Halifa Blasters dominating the field in custom @caper_sports9 jerseys! 🏏⚡ When quality meets performance 💪 #CaperSports #Cricket #CustomJerseys #TeamWear",
        likes: 247,
        timeAgo: "3h",
        permalink: "https://instagram.com/caper_sports9",
        comments: [
          { username: "cricket_legends_", text: "Absolutely stunning jerseys! The quality shows on field 🔥", timeAgo: "2h" },
          { username: "sports_gear_pro", text: "Best custom cricket wear in the game! 💯", timeAgo: "1h" },
          { username: "team_captain_ahb", text: "Thanks @caper_sports9 for making us look like champions! 🏆", timeAgo: "45m" }
        ]
      },
      {
        id: 'fallback_2',
        image: "/images/testimonials/famousPersonality1.jpg",
        caption: "The Universe Boss @chrisgayle333 trusts @caper_sports9 for premium athletic wear! 👑🏏 When legends choose quality, you know it's the real deal ⭐ #ChrisGayle #CaperSports #CricketLegend #PremiumQuality",
        likes: 1243,
        timeAgo: "6h",
        permalink: "https://instagram.com/caper_sports9",
        comments: [
          { username: "gayle_army_official", text: "Universe Boss knows the best! 🌟💪", timeAgo: "5h" },
          { username: "cricket_world_news", text: "This endorsement speaks volumes about quality! 🙌", timeAgo: "4h" },
          { username: "sports_brand_watch", text: "@caper_sports9 hitting it out of the park! 🏏🔥", timeAgo: "3h" }
        ]
      },
      {
        id: 'fallback_3',
        image: "/images/testimonials/famousPersonality2.jpg",
        caption: "Professional athlete showcasing peak performance in @caper_sports9 gear! 🏀💨 When every move counts, trust the gear that delivers 🎯 #Basketball #PerformanceWear #AthleteApproved",
        likes: 456,
        timeAgo: "12h",
        permalink: "https://instagram.com/caper_sports9",
        comments: [
          { username: "basketball_elite", text: "That's championship-level gear right there! 🏆", timeAgo: "10h" },
          { username: "performance_wear_", text: "You can see the quality in every movement 💪", timeAgo: "8h" },
          { username: "sports_analyst_pro", text: "@caper_sports9 setting new standards in athletic wear! 📈", timeAgo: "6h" }
        ]
      },
      {
        id: 'fallback_4',
        image: "/images/testimonials/testimonials2.png",
        caption: "Champions United celebrating victory in style! 🏆🎉 Another win powered by @caper_sports9 premium team wear 💙 Victory looks even better in quality gear! #Champions #TeamWear #Victory",
        likes: 328,
        timeAgo: "18h",
        permalink: "https://instagram.com/caper_sports9",
        comments: [
          { username: "champions_united_fc", text: "Proud to wear @caper_sports9! Quality that wins! 🏅", timeAgo: "16h" },
          { username: "team_sports_fan", text: "Best looking team on and off the field! 😍", timeAgo: "14h" },
          { username: "custom_sports_wear", text: "This is how you do team uniforms right! 👏", timeAgo: "12h" }
        ]
      }
    ];
  }

  /**
   * Refresh access token (for production use)
   * This would typically be handled server-side
   */
  async refreshAccessToken() {
    // This should be implemented server-side for security
    console.warn('Access token refresh should be handled server-side');
  }
}

export default new InstagramService();
