import { database } from '../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_PROFILE } from '@env';
import { Query } from '../backend/appwite';

const useGetAllVendor2 = async (participantIds) => {
  try {
    const profilePromises = participantIds.map(id => database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_PROFILE,
      [Query.equal('user_id', id)]
    ));

    const profilesResult = await Promise.all(profilePromises);

    const profilesData = profilesResult.reduce((acc, result) => {
      if (result.total > 0) {
        const profile = result.documents[0];
        acc[profile.user_id] = {
          name: `${profile.firstName} ${profile.lastName}`,
          imageUrl: profile.image_url || null,
        };
      }
      return acc;
    }, {});

    return profilesData;
  } catch (error) {
    console.error('Error fetching personal info:', error);
    throw error;
  }
};

export default useGetAllVendor2;
