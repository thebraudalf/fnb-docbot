import { databases, appwriteConfig } from './appwrite';
import { ID, Query } from 'appwrite';

export interface SOPDocument {
  id: string;
  title: string;
  description: string;
  version: string;
  department: string;
  category: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  lastModified: Date;
  status: 'draft' | 'pending_approval' | 'approved' | 'archived';
  uploadedBy: string;
  approvedBy?: string;
  effectiveDate?: Date;
  reviewDate?: Date;
}

export interface SOPUploadData {
  title: string;
  description: string;
  version: string;
  department: string;
  category: string;
  effectiveDate?: string;
  reviewDate?: string;
}

export class SOPService {
  // Upload file to external API endpoint
  static async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch('https://hvjbrvdc-8000.inc1.devtunnels.ms/ingest', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      // Return a unique identifier for the uploaded file
      return result.fileId || result.id || ID.unique();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file to external service');
    }
  }

  // Create SOP document record in database
//   static async createSOPDocument(
//     sopData: SOPUploadData,
//     file: File,
//     fileId: string,
//     userName: string,
//     userRole: 'crew' | 'manager'
//   ): Promise<SOPDocument> {
//     try {
//       const documentData = {
//         title: sopData.title || file.name.replace(/\.[^/.]+$/, ""),
//         description: sopData.description || "",
//         version: sopData.version || "1.0",
//         department: sopData.department || "General",
//         category: sopData.category || "Operations",
//         fileName: file.name,
//         fileSize: file.size,
//         status: userRole === 'manager' ? 'approved' : 'pending_approval',
//         uploadedBy: userName,
//         effectiveDate: sopData.effectiveDate ? new Date(sopData.effectiveDate).toISOString() : null,
//         reviewDate: sopData.reviewDate ? new Date(sopData.reviewDate).toISOString() : null,
//       };

//       const response = await databases.createDocument(
//         appwriteConfig.databaseId,
//         appwriteConfig.sopCollectionId,
//         ID.unique(),
//         documentData
//       );

//       return {
//         id: response.$id,
//         title: response.title,
//         description: response.description,
//         version: response.version,
//         department: response.department,
//         category: response.category,
//         fileName: response.fileName,
//         fileSize: response.fileSize,
//         uploadDate: new Date(response.$createdAt),
//         lastModified: new Date(response.$updatedAt),
//         status: response.status,
//         uploadedBy: response.uploadedBy,
//         approvedBy: response.approvedBy,
//         effectiveDate: response.effectiveDate ? new Date(response.effectiveDate) : undefined,
//         reviewDate: response.reviewDate ? new Date(response.reviewDate) : undefined,
//       };
//     } catch (error) {
//       console.error('Error creating SOP document:', error);
//       throw new Error('Failed to save SOP document to database');
//     }
//   }

  // Get all SOP documents
  static async getSOPDocuments(): Promise<SOPDocument[]> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.sopCollectionId,
        [Query.orderDesc('$createdAt')]
      );

      return response.documents.map(doc => ({
        id: doc.$id,
        title: doc.title || 'Untitled SOP',
        description: doc.description || '',
        version: doc.version || '1.0',
        department: doc.department || 'General',
        category: doc.category || 'Operations',
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        uploadDate: new Date(doc.$createdAt),
        lastModified: new Date(doc.$updatedAt),
        status: doc.status,
        uploadedBy: doc.uploadedBy,
        approvedBy: doc.approvedBy,
        effectiveDate: doc.effectiveDate ? new Date(doc.effectiveDate) : undefined,
        reviewDate: doc.reviewDate ? new Date(doc.reviewDate) : undefined,
      }));
    } catch (error) {
      console.error('Error fetching SOP documents:', error);
      throw new Error('Failed to fetch SOP documents');
    }
  }

  // Update SOP status
  static async updateSOPStatus(
    sopId: string, 
    status: SOPDocument['status'], 
    approvedBy?: string
  ): Promise<void> {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.sopCollectionId,
        sopId,
        {
          status,
          approvedBy: status === 'approved' ? approvedBy : null,
        }
      );
    } catch (error) {
      console.error('Error updating SOP status:', error);
      throw new Error('Failed to update SOP status');
    }
  }

  // Delete SOP document
  static async deleteSOPDocument(sopId: string): Promise<void> {
    try {
      // Only delete document from database (external API handles file storage)
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.sopCollectionId,
        sopId
      );
    } catch (error) {
      console.error('Error deleting SOP document:', error);
      throw new Error('Failed to delete SOP document');
    }
  }

  // Get file download URL (placeholder - implement based on your API response)
  static getFileDownloadURL(fileName: string): string {
    // This should be updated based on how your external API provides download URLs
    return `https://hvjbrvdc-8000.inc1.devtunnels.ms/download/${fileName}`;
  }

  // Upload complete SOP (file + metadata)
  static async uploadSOP(
    file: File,
    sopData: SOPUploadData,
    userName: string,
    userRole: 'crew' | 'manager'
  ): Promise<SOPDocument> {
    try {
      // Upload the file to external API
      const fileId = await this.uploadFile(file);
      
      // Create a simple SOP document object without database storage
      const sopDocument: SOPDocument = {
        id: `sop_${Date.now()}`, // Simple ID generation
        title: sopData.title,
        description: sopData.description,
        version: sopData.version,
        department: sopData.department,
        category: sopData.category,
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date(),
        lastModified: new Date(),
        status: userRole === 'manager' ? 'approved' : 'pending_approval',
        uploadedBy: userName,
        approvedBy: userRole === 'manager' ? userName : undefined,
        effectiveDate: sopData.effectiveDate ? new Date(sopData.effectiveDate) : undefined,
        reviewDate: sopData.reviewDate ? new Date(sopData.reviewDate) : undefined,
      };

      return sopDocument;
    } catch (error) {
      console.error('Error uploading SOP:', error);
      throw error;
    }
  }
}
