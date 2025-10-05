const { MongoClient } = require('mongodb');

class AzureCosmosService {
  constructor() {
    this.connectionString = process.env.AZURE_COSMOS_CONNECTION_STRING;
    this.databaseName = process.env.AZURE_COSMOS_DATABASE_NAME || 'capersports';
    
    if (!this.connectionString) {
      throw new Error('Azure Cosmos DB connection string is required');
    }
    
    this.client = null;
    this.db = null;
  }

  /**
   * Connect to Azure Cosmos DB
   */
  async connect() {
    try {
      if (this.client && this.db) {
        return this.db;
      }

      console.log('🔗 Connecting to Azure Cosmos DB...');
      
      this.client = new MongoClient(this.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      });
      
      await this.client.connect();
      this.db = this.client.db(this.databaseName);
      
      console.log('✅ Connected to Azure Cosmos DB');
      return this.db;
    } catch (error) {
      console.error('❌ Error connecting to Azure Cosmos DB:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Azure Cosmos DB
   */
  async disconnect() {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
        this.db = null;
        console.log('✅ Disconnected from Azure Cosmos DB');
      }
    } catch (error) {
      console.error('Error disconnecting from Azure Cosmos DB:', error);
    }
  }

  /**
   * Get database instance
   */
  async getDatabase() {
    if (!this.db) {
      await this.connect();
    }
    return this.db;
  }

  /**
   * Get collection
   * @param {string} collectionName - Collection name
   */
  async getCollection(collectionName) {
    const db = await this.getDatabase();
    return db.collection(collectionName);
  }

  /**
   * Create indexes for better performance
   */
  async createIndexes() {
    try {
      const db = await this.getDatabase();
      
      // Users collection indexes
      const usersCollection = db.collection('users');
      await usersCollection.createIndex({ email: 1 }, { unique: true });
      await usersCollection.createIndex({ createdAt: -1 });
      
      // Products collection indexes
      const productsCollection = db.collection('products');
      await productsCollection.createIndex({ name: 1 });
      await productsCollection.createIndex({ category: 1 });
      await productsCollection.createIndex({ brand: 1 });
      await productsCollection.createIndex({ price: 1 });
      await productsCollection.createIndex({ 'ratings.average': -1 });
      await productsCollection.createIndex({ createdAt: -1 });
      await productsCollection.createIndex({ isActive: 1 });
      await productsCollection.createIndex({ isFeatured: 1 });
      
      // Compound indexes for common queries
      await productsCollection.createIndex({ category: 1, isActive: 1 });
      await productsCollection.createIndex({ brand: 1, isActive: 1 });
      await productsCollection.createIndex({ price: 1, isActive: 1 });
      
      // Text index for search
      await productsCollection.createIndex({
        name: 'text',
        description: 'text',
        brand: 'text',
        tags: 'text'
      });
      
      // Orders collection indexes
      const ordersCollection = db.collection('orders');
      await ordersCollection.createIndex({ user: 1 });
      await ordersCollection.createIndex({ status: 1 });
      await ordersCollection.createIndex({ createdAt: -1 });
      await ordersCollection.createIndex({ user: 1, createdAt: -1 });
      
      console.log('✅ Created all indexes');
    } catch (error) {
      console.error('Error creating indexes:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const db = await this.getDatabase();
      await db.admin().ping();
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date() };
    }
  }

  /**
   * Get database statistics
   */
  async getStats() {
    try {
      const db = await this.getDatabase();
      const stats = await db.stats();
      
      return {
        database: this.databaseName,
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        indexSize: stats.indexSize
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      throw error;
    }
  }

  /**
   * Backup collection data
   * @param {string} collectionName - Collection to backup
   * @returns {Promise<Array>} - Collection data
   */
  async backupCollection(collectionName) {
    try {
      const collection = await this.getCollection(collectionName);
      const data = await collection.find({}).toArray();
      
      console.log(`✅ Backed up ${data.length} documents from ${collectionName}`);
      return data;
    } catch (error) {
      console.error(`Error backing up collection ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Restore collection data
   * @param {string} collectionName - Collection to restore
   * @param {Array} data - Data to restore
   */
  async restoreCollection(collectionName, data) {
    try {
      const collection = await this.getCollection(collectionName);
      
      // Clear existing data
      await collection.deleteMany({});
      
      // Insert new data
      if (data.length > 0) {
        await collection.insertMany(data);
      }
      
      console.log(`✅ Restored ${data.length} documents to ${collectionName}`);
    } catch (error) {
      console.error(`Error restoring collection ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Migrate data from MongoDB to Cosmos DB
   * @param {string} sourceConnectionString - Source MongoDB connection string
   */
  async migrateFromMongoDB(sourceConnectionString) {
    let sourceClient = null;
    
    try {
      console.log('🔄 Starting migration from MongoDB to Cosmos DB...');
      
      // Connect to source MongoDB
      sourceClient = new MongoClient(sourceConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      
      await sourceClient.connect();
      const sourceDb = sourceClient.db();
      
      // Get list of collections to migrate
      const collections = await sourceDb.listCollections().toArray();
      const collectionNames = collections.map(col => col.name);
      
      console.log(`📋 Found collections to migrate: ${collectionNames.join(', ')}`);
      
      // Migrate each collection
      for (const collectionName of collectionNames) {
        console.log(`🔄 Migrating collection: ${collectionName}`);
        
        const sourceCollection = sourceDb.collection(collectionName);
        const data = await sourceCollection.find({}).toArray();
        
        if (data.length > 0) {
          await this.restoreCollection(collectionName, data);
          console.log(`✅ Migrated ${data.length} documents from ${collectionName}`);
        } else {
          console.log(`ℹ️  No data to migrate from ${collectionName}`);
        }
      }
      
      // Create indexes after migration
      await this.createIndexes();
      
      console.log('🎉 Migration completed successfully!');
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    } finally {
      if (sourceClient) {
        await sourceClient.close();
      }
    }
  }
}

module.exports = AzureCosmosService;
