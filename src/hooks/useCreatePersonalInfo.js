import { database, ID, Query } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_PERSONAL_INFO } from '@env';

const useCreateOrUpdatePersonalInfo = async (personalInfo) => {
  const {
    userId,
    businessName,
    businessType,
    businessCategory,
    businessDescription,
    address,
  } = personalInfo;

  try {
    // Check if a document exists for the given userId
    const existingDocuments = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_PERSONAL_INFO,
      [Query.equal('user_id', userId)]
    );

    if (existingDocuments.total > 0) {
      // Update the existing document
      const documentId = existingDocuments.documents[0].$id; // Assuming only one document exists for the user
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_PERSONAL_INFO,
        documentId,
        {
          business_name: businessName,
          business_type: businessType,
          business_category: businessCategory,
          description: businessDescription,
          address: address,
          created_at: new Date().toISOString(), 
        }
      );
    } else {
      // Create a new document
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID_PERSONAL_INFO,
        ID.unique(),
        {
          user_id: userId,
          business_name: businessName,
          business_type: businessType,
          business_category: businessCategory,
          description: businessDescription,
          address: address,
          created_at: new Date().toISOString(),
        }
      );
    }
  } catch (error) {
    console.error('Error creating or updating personal info:', error);
    throw error;
  }
};

export default useCreateOrUpdatePersonalInfo;
