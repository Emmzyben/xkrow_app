import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity ,ScrollView} from 'react-native';
import { useUser } from '../../backend/user'; // Adjust path as needed
import { database, Query } from '../../backend/appwite'; // Ensure you import Query correctly
import { DATABASE_ID, COLLECTION_ID_NOTIFICATION } from '@env';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft,faBell } from '@fortawesome/free-solid-svg-icons';

// Function to convert timestamp string to Date object
const parseTimestamp = (timestamp) => {
  // Example of parsing the timestamp string to a Date object
  return new Date(timestamp.replace(/(\d+\/\d+\/\d+ \d+:\d+:\d+:\d+\.\d+) (\w+)/, '$1 $2'));
};

const Notification = ({ navigation }) => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (user) {
          const response = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_NOTIFICATION,
            [
              Query.equal('receiver_id', user.id)
            ]
          );
    
          const sortedNotifications = response.documents.map(doc => ({
            ...doc,
            timestamp: doc.timestamp ? parseTimestamp(doc.timestamp) : new Date()
          })).sort((a, b) => b.timestamp - a.timestamp);
    
          setNotifications(sortedNotifications);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    

    fetchNotifications();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error loading notifications: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Landing')}
          style={styles.leftButton}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={styles.title}>Recent Notifications</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('#')}
          style={styles.rightButton}
        >
        </TouchableOpacity>
      </View>
      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No notifications yet</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
             <View><FontAwesomeIcon icon={faBell} size={17} color='rgba(98, 36, 143, 1)' style={{marginRight:10,marginTop:10}}/></View>
             <View> 
             <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.timestamp}>{item.timestamp.toLocaleString()}</Text></View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  notificationItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    display:'flex',flexDirection:'row'
  },
  message: {
    fontSize: 13,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(98, 36, 143, 1)',
  },
  noNotifications: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding:10,
  },
});

export default Notification;
