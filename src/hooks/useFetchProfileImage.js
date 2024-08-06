import { database, ID , Query} from '../backend/appwite'; 
import { DATABASE_ID, COLLECTION_ID_PERSONAL_INFO } from '@env';

const useFetchProfileImage = async (userId) => {
  try {
    const response = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_PERSONAL_INFO,
      [Query.equal('user_id', userId)]
    );
    
    if (response.documents.length > 0) {
      return response.documents[0].image_url; 
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching profile image:', error);
    throw error;
  }
};

export default useFetchProfileImage;
