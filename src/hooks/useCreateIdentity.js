import { database, ID } from '../backend/appwite'; 
import { DATABASE_ID, COLLECTION_ID_IDENTITY } from '@env';

const useCreateIdentity = async (identityData) => {
  const {
    userId,
    cardType,
    cardNumber,
    expiryDate,
    imageUrl,
  } = identityData;

  try {
    await database.createDocument(
      DATABASE_ID,
      COLLECTION_ID_IDENTITY,
      ID.unique(),
      {
        user_id: userId,
        card_type: cardType,
        card_number: cardNumber,
        expiry_date: expiryDate,
        imageUrl: imageUrl,
        created_at: new Date().toISOString(),
      }
    );
  } catch (error) {
    throw error;
  }
};

export default useCreateIdentity;
