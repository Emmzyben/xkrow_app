import { database, ID } from '../backend/appwite'; 
import { DATABASE_ID, COLLECTION_ID_PROFILE } from '@env';

const useCreateProfile = async (profileData) => {
  const {
    userId,
    firstName,
    lastName,
    gender,
    dob,
    address,
    state,
  } = profileData;

  try {
    await database.createDocument(
      DATABASE_ID,
      COLLECTION_ID_PROFILE,
      ID.unique(),
      {
        user_id: userId,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        Dob: dob,
        address: address,
        state: state,
        created_at: new Date().toISOString(),
      }
    );
  } catch (error) {
    throw error;
  }
};

export default useCreateProfile;
