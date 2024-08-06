import { database, ID, Query } from '../backend/appwite'; 
import { DATABASE_ID, COLLECTION_ID_PERSONAL_INFO } from '@env';

const useCreateProfileImage = async (userId, imageUrl) => {
  try {
    // Search for the existing document with the same user_id using Query
    const documents = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_PERSONAL_INFO,
      [
        Query.equal('user_id', userId)
      ]
    );

    if (documents.total === 0) {
      throw new Error('No document found for the given user_id');
    }

    const documentId = documents.documents[0].$id;

    // Update the document with the new image URL
    await database.updateDocument(
      DATABASE_ID,
      COLLECTION_ID_PERSONAL_INFO,
      documentId,
      { image_url: imageUrl }
    );

    return { success: true, imageUrl };
  } catch (error) {
    console.error('Error updating profile image:', error);
    return { success: false, message: error.message || 'An error occurred while updating the profile image' };
  }
};

export default useCreateProfileImage;

