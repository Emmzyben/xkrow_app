import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { database, Query } from '../../backend/appwite';
import { useUser } from '../../backend/user';
import { DATABASE_ID, COLLECTION_ID_CONVERSATIONS } from '@env';
import Nav from '../../components/nav';
import useGetAllVendor2 from '../../hooks/useGetAllVendor2';

const Chatbox = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [conversations, setConversations] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const conversationsResult = await database.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_CONVERSATIONS,
        [
          Query.equal('participants', [user.id]),
          Query.orderDesc('createdAt'),
        ]
      );

      setConversations(conversationsResult.documents);

      // Fetch profiles of all participants
      const participantIds = Array.from(new Set(conversationsResult.documents.flatMap(doc => doc.participants)));
      const profilesData = await useGetAllVendor2(participantIds);

      setProfiles(profilesData);
    } catch (error) {
      console.error('Error fetching conversations or profiles:', error);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchConversations();
    }, [user])
  );

  const handlePress = (conversationId) => {
    navigation.navigate('ChatScreen', { conversationId });
  };

  const handleStartNewConversation = () => {
    navigation.navigate('Vendors');
  };

  const renderItem = ({ item }) => {
    const participantId = item.participants.find(id => id !== user.id);
    const participantProfile = profiles[participantId] || { name: 'Unknown User', imageUrl: null };
    const lastMessageDate = new Date(item.createdAt).toLocaleString();

    return (
      <TouchableOpacity style={styles.item} onPress={() => handlePress(item.$id)}>
        <View style={styles.itemHeader}>
          <View>
            <Image style={styles.img1} source={participantProfile.imageUrl ? { uri: participantProfile.imageUrl } : require('../../../assets/logo.jpg')} />
          </View>
          <View>
            <Text style={styles.title}>{participantProfile.name}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
          </View>
        </View>
        <View></View>
        <Text style={styles.date}>{lastMessageDate}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chats</Text>
      </View>
      <View style={styles.up}>
        <TouchableOpacity style={styles.up1}><Text style={styles.innertext}>Messages</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Vendors')} style={styles.up2}><Text style={styles.innertext1}>Vendors</Text></TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <View style={styles.content}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={handleStartNewConversation}>
            <Text style={styles.buttonText}>Start New Conversation</Text>
          </TouchableOpacity>
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.content}>
          <Text style={styles.messageText}>No conversations available.</Text>
          <TouchableOpacity style={styles.button} onPress={handleStartNewConversation}>
            <Text style={styles.buttonText}>Start New Conversation</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item) => item.$id}
        />
      )}
      <Nav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  innertext: {
    color: '#fff',
    textAlign: 'center',
  },
  innertext1: {
    color: 'rgba(98, 36, 143, 1)',
    textAlign: 'center',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(102, 112, 133, 1)',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 1,
    paddingTop: 50
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 50
  },
  headerText: {
    textAlign: 'center',
    fontSize: 15.3,
    lineHeight: 18.52,
    fontWeight: '700',
    color: '#141414',
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  item: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
  },
  date: {
    fontSize: 11,
    color: '#666',
  },
  lastMessage: {
    color: '#666',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  messageText: {
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#62248F',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  up1: {
    backgroundColor: 'rgba(98, 36, 143, 1)',
    padding: 10,
    borderRadius: 20,
    margin: 10,
    width: "40%",
  },
  up2: {
    backgroundColor: 'rgba(228, 199, 228, 0.664)',
    padding: 10,
    borderRadius: 20,
    margin: 10,
    width: "40%",
  },
  up: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img1: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  }
});

export default Chatbox;
