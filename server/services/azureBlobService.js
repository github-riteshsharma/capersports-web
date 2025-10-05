const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class AzureBlobService {
  constructor() {
    this.connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    
    if (!this.connectionString) {
      throw new Error('Azure Storage connection string is required');
    }
    
    this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
    
    // Container names
    this.containers = {
      products: process.env.AZURE_BLOB_CONTAINER_PRODUCTS || 'product-images',
      users: process.env.AZURE_BLOB_CONTAINER_USERS || 'user-avatars',
      assets: process.env.AZURE_BLOB_CONTAINER_ASSETS || 'general-assets'
    };
  }

  /**
   * Initialize containers (create if they don't exist)
   */
  async initializeContainers() {
    try {
      for (const [key, containerName] of Object.entries(this.containers)) {
        const containerClient = this.blobServiceClient.getContainerClient(containerName);
        
        // Create container if it doesn't exist
        const exists = await containerClient.exists();
        if (!exists) {
          await containerClient.create({
            access: 'blob' // Public read access for blobs
          });
          console.log(`✅ Created container: ${containerName}`);
        }
      }
    } catch (error) {
      console.error('Error initializing containers:', error);
      throw error;
    }
  }

  /**
   * Upload file to Azure Blob Storage
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} fileName - Original file name
   * @param {string} containerType - Container type (products, users, assets)
   * @param {string} folder - Optional folder path
   * @returns {Promise<string>} - Blob URL
   */
  async uploadFile(fileBuffer, fileName, containerType = 'assets', folder = '') {
    try {
      const containerName = this.containers[containerType];
      if (!containerName) {
        throw new Error(`Invalid container type: ${containerType}`);
      }

      const containerClient = this.blobServiceClient.getContainerClient(containerName);
      
      // Generate unique blob name
      const fileExtension = path.extname(fileName);
      const uniqueName = `${uuidv4()}${fileExtension}`;
      const blobName = folder ? `${folder}/${uniqueName}` : uniqueName;
      
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      
      // Determine content type
      const contentType = this.getContentType(fileExtension);
      
      // Upload file
      await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
        blobHTTPHeaders: {
          blobContentType: contentType
        }
      });
      
      // Return public URL
      const blobUrl = blockBlobClient.url;
      console.log(`✅ Uploaded file: ${blobUrl}`);
      
      return blobUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Upload multiple files
   * @param {Array} files - Array of {buffer, fileName} objects
   * @param {string} containerType - Container type
   * @param {string} folder - Optional folder path
   * @returns {Promise<Array>} - Array of blob URLs
   */
  async uploadMultipleFiles(files, containerType = 'assets', folder = '') {
    try {
      const uploadPromises = files.map(file => 
        this.uploadFile(file.buffer, file.fileName, containerType, folder)
      );
      
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw error;
    }
  }

  /**
   * Delete file from Azure Blob Storage
   * @param {string} blobUrl - Full blob URL
   * @returns {Promise<boolean>} - Success status
   */
  async deleteFile(blobUrl) {
    try {
      // Extract container and blob name from URL
      const url = new URL(blobUrl);
      const pathParts = url.pathname.split('/');
      const containerName = pathParts[1];
      const blobName = pathParts.slice(2).join('/');
      
      const containerClient = this.blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      
      await blockBlobClient.delete();
      console.log(`✅ Deleted file: ${blobUrl}`);
      
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  /**
   * Get file content type based on extension
   * @param {string} extension - File extension
   * @returns {string} - Content type
   */
  getContentType(extension) {
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain'
    };
    
    return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
  }

  /**
   * Generate SAS URL for private access
   * @param {string} blobUrl - Blob URL
   * @param {number} expiryHours - Expiry in hours (default: 24)
   * @returns {Promise<string>} - SAS URL
   */
  async generateSasUrl(blobUrl, expiryHours = 24) {
    try {
      const { BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } = require('@azure/storage-blob');
      
      // Extract container and blob name from URL
      const url = new URL(blobUrl);
      const pathParts = url.pathname.split('/');
      const containerName = pathParts[1];
      const blobName = pathParts.slice(2).join('/');
      
      const containerClient = this.blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      
      // Set expiry time
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + expiryHours);
      
      // Generate SAS token
      const sasToken = generateBlobSASQueryParameters({
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse('r'), // Read permission
        expiresOn: expiryDate
      }, new StorageSharedKeyCredential(this.accountName, process.env.AZURE_STORAGE_ACCOUNT_KEY));
      
      return `${blobUrl}?${sasToken}`;
    } catch (error) {
      console.error('Error generating SAS URL:', error);
      throw error;
    }
  }

  /**
   * List files in container
   * @param {string} containerType - Container type
   * @param {string} prefix - Optional prefix filter
   * @returns {Promise<Array>} - Array of blob info
   */
  async listFiles(containerType, prefix = '') {
    try {
      const containerName = this.containers[containerType];
      const containerClient = this.blobServiceClient.getContainerClient(containerName);
      
      const blobs = [];
      
      for await (const blob of containerClient.listBlobsFlat({ prefix })) {
        blobs.push({
          name: blob.name,
          url: `${containerClient.url}/${blob.name}`,
          size: blob.properties.contentLength,
          lastModified: blob.properties.lastModified,
          contentType: blob.properties.contentType
        });
      }
      
      return blobs;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }
}

module.exports = AzureBlobService;
