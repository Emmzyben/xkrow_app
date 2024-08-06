import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator ,Text,TouchableOpacity} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import CustomToolbar from '../../components/customToolbar';
import { useUser } from '../../backend/user'; 
import { database, storage, Query, ID } from '../../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_CONVERSATIONS, COLLECTION_ID_MESSAGES, COLLECTION_ID_PROFILE, BUCKET_ID, API_URL, PROJECT_ID } from '@env';
import useCreateMessageNotify from '../../hooks/useCreateMessageNotify';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
const fetchUserProfiles = async (userIds) => {
  if (!userIds || userIds.length === 0) {
    return {};
  }

  try {
    const profileQuery = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_PROFILE,
      [Query.equal('$id', userIds)]
    );

    const profiles = profileQuery.documents.reduce((acc, profile) => {
      acc[profile.user_id] = `${profile.firstName} ${profile.lastName}`;
      return acc;
    }, {});
    return profiles;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return {};
  }
};
const sendXmlHttpRequest = (data) => {
  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status === 201) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject("Request Failed");
      }
    };

    xhr.open("POST", `${API_URL}/storage/buckets/${BUCKET_ID}/files`);
    xhr.withCredentials = true;
    xhr.setRequestHeader("X-Appwrite-Project", PROJECT_ID);
    xhr.setRequestHeader("X-Appwrite-Response-Format", "0.15.0");
    xhr.setRequestHeader("x-sdk-version", "appwrite:web:9.0.1");
    xhr.send(data);
  });
};

const uploadFile = async (uri) => {
  if (!uri) {
    throw new Error("No image selected");
  }

  const filename = uri.split("/").pop();
  const match = /\.(\w+)$/.exec(uri);
  const type = match ? `image/${match[1]}` : `image`;

  const formData = new FormData();
  formData.append("fileId", ID.unique());
  formData.append("file", {
    uri,
    name: filename,
    type,
  });

  const response = await sendXmlHttpRequest(formData);
  return response.$id;
};

const pickMedia = async (onSend, user) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const asset = result.assets[0];
    if (asset.uri && asset.type) {
      const fileId = await uploadFile(asset.uri);
      const fileUrl = `${API_URL}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
      const mediaMessage = {
        _id: new Date().getTime().toString(),
        text: '',
        createdAt: new Date(),
        user: {
          _id: user.id,
          name: user.name || 'User Name',
        },
        image: asset.type.startsWith('image') ? fileUrl : null,
        video: asset.type.startsWith('video') ? fileUrl : null,
      };

      onSend([mediaMessage]);
    } else {
      console.error('Asset does not have a valid URI or type.');
    }
  }
};

const ChatScreen = ({ route }) => {
  const { conversationId } = route.params;
  const { user } = useUser(); // Get the user context
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfiles, setUserProfiles] = useState({});

  const createMessageNotify = useCreateMessageNotify();

  const fetchMessages = useCallback(async () => {
    if (!user) return;
  
    try {
      const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID_MESSAGES, [
        Query.equal('conversationId', conversationId),
        Query.orderDesc('createdAt'),
      ]);
      const messageDocs = result.documents;
  
      console.log('Fetched messages:', messageDocs);
  
      const userIds = messageDocs.map((doc) => doc.userId).filter((id, index, self) => self.indexOf(id) === index);
      const profiles = await fetchUserProfiles(userIds);
      console.log('Fetched profiles:', profiles);
  
      const fetchedMessages = messageDocs.map((doc) => ({
        _id: doc.$id,
        text: doc.text,
        createdAt: new Date(doc.createdAt),
        user: {
          _id: doc.userId,
          name: profiles[doc.userId] || 'Username',
        },
        image: doc.image || null,
        video: doc.video || null,
      }));
  
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [conversationId, user]);
  
  const fetchConversation = useCallback(async () => {
    try {
      const conversation = await database.getDocument(DATABASE_ID, COLLECTION_ID_CONVERSATIONS, conversationId);
      return conversation;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }
  }, [conversationId]);
  

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const onSend = useCallback(async (messages = []) => {
    if (messages.length === 0) return;

    try {
      const message = messages[0];
      if (message.text || message.image || message.video) {
        await database.createDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, 'unique()', {
          conversationId: conversationId,
          text: message.text || '',  // Ensure text is always a string
          userId: user.id, // Use user context for user ID
          createdAt: new Date().toISOString(),
          image: message.image || null,  // Handle null value
          video: message.video || null,  // Handle null value
        });

        // Update last message in the conversation
        await database.updateDocument(DATABASE_ID, COLLECTION_ID_CONVERSATIONS, conversationId, {
          lastMessage: message.text || '',  // Ensure text is always a string
        });

        const conversation = await fetchConversation();
        if (conversation) {
          const receiverId = conversation.participants.find((participant) => participant !== user.id);
          await createMessageNotify(user.id, receiverId, 'You have a new message');
        }

        setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [conversationId, user, createMessageNotify, fetchConversation]);

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: 'rgba(98, 36, 143, 1)',
        },
        left: {
          backgroundColor: '#e0e0e0',
        },
      }}
      textStyle={{
        right: {
          color: '#fff',
        },
        left: {
          color: '#000',
        },
      }}
    />
  );

  return (
    <View style={styles.container}>
     <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Conversation</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: user.id,
            name: user.name || 'User Name',
          }}
          renderBubble={renderBubble}
          renderInputToolbar={(props) => (
            <CustomToolbar {...props} onSend={onSend} user={user} pickMedia={pickMedia} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(102, 112, 133, 1)',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 15.3,
    lineHeight: 18.52,
    fontWeight: '700',
    color: '#141414',
    flex: 1,
  },
});

export default ChatScreen;
