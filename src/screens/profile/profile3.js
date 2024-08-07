import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image, Platform, StyleSheet, ScrollView } from 'react-native';
import styles from '../../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../backend/user';
import useCreateProduct from '../../hooks/useCreateProduct';
import { API_URL, BUCKET_ID, PROJECT_ID } from '@env';
import Successfull from '../../components/successfull';
import * as ImagePicker from 'expo-image-picker';
import { database, ID } from '../../backend/appwite';

const Profile3 = ({ navigation }) => {
  const contextUser = useUser();
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState('');
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Function for handling image pick
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setFile(result.assets[0]);
      setFileURL(result.assets[0].uri);
    }
  };

  // Function to upload file
  const uploadFile = async (file) => {
    if (!file) {
      throw new Error("No file selected");
    }

    let filename = file.uri.split('/').pop();
    let match = /\.(\w+)$/.exec(file.uri);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append('fileId', ID.unique());
    formData.append('file', {
      uri: file.uri,
      name: filename,
      type,
    });

    const response = await sendXmlHttpRequest(formData);
    return response.$id;
  };

  // Function to handle XML HTTP Request
  const sendXmlHttpRequest = (data) => {
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = (e) => {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status === 201) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject("Request Failed");
        }
      };

      xhr.open("POST", `${API_URL}/storage/buckets/${BUCKET_ID}/files/`);
      xhr.withCredentials = true;
      xhr.setRequestHeader("X-Appwrite-Project", PROJECT_ID);
      xhr.setRequestHeader("X-Appwrite-Response-Format", "0.15.0");
      xhr.setRequestHeader("x-sdk-version", "appwrite:web:9.0.1");
      xhr.send(data);
    });
  };

  // Function for form submission
  const handleSubmit = async () => {
    if (!itemName || !price || !description || !file) {
      Alert.alert('Error', 'Please fill in all fields and add an image');
      return;
    }

    if (contextUser && contextUser.user && contextUser.user.id) {
      setLoading(true);
      try {
        const fileId = await uploadFile(file);
        const imageUrl = `${API_URL}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
        const productInfo = {
          userId: contextUser.user.id,
          itemName,
          price: parseInt(price, 10),
          description,
          imageUrl,
        };
        await useCreateProduct(productInfo);
        setSuccess(true); 
      } catch (error) {
        console.error('Error saving product information:', error);
        Alert.alert('Error', 'Failed to save product information');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'User not found');
    }
  };

  if (success) {
    return <Successfull />;
  }

  return (
    <ScrollView>
      <View style={localStyles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={localStyles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={17} />
        </TouchableOpacity>
        <Text style={localStyles.headerTitle}>Add Item</Text>
      </View>

      <View style={styles.maincontainer}>
        {fileURL && (
          <Image source={{ uri: fileURL }} style={localStyles.imagePreview} />
        )}

        <View style={styles.upload}>
          {Platform.OS === 'web' ? (
            <input type="file" onChange={handleFileChange} style={styles.fileInput}/>
          ) : (
            <TouchableOpacity onPress={handleImagePick} style={localStyles.pick}>
              <Text>Click to Add Image</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.text5}>Item Name</Text>
        <TextInput 
          style={styles.input1} 
          placeholder='Item name' 
          keyboardType='default'
          value={itemName}
          onChangeText={setItemName}
        />

        <Text style={styles.text5}>Price</Text>
        <TextInput 
          style={styles.input1} 
          placeholder='Price' 
          keyboardType='numeric'
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.text5}>Description</Text>
        <TextInput 
          style={styles.input1} 
          placeholder='Description' 
          keyboardType='default' 
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.lastDown}>
        <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  pick: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#ccc'
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(102, 112, 133, 1)',paddingTop:50
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,zIndex:10000
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 15.3,
    lineHeight: 18.52,
    fontWeight: '700',
    color: '#141414',
  },
  imagePreview: {
    width: 'auto',
    height: 120,
    marginTop: 10,
  },
  uploadButton: {
    // Add styles for the upload button if needed
  },
  fileInput: {
    // Add styles for the file input if needed
  },
});

export default Profile3;
