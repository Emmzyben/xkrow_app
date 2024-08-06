import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Platform, ScrollView } from 'react-native';
import { useUser } from '../../backend/user';
import useCreateIdentity from '../../hooks/useCreateIdentity';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { API_URL, BUCKET_ID } from '@env';
import styles from '../../styles/style';
import { database, ID } from '../../backend/appwite';

const Page4 = ({ navigation }) => {
  const contextUser = useUser();
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardType, setCardType] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);
  const [succ, setSucc] = useState(false);

  const PROJECT_ID = '668fa63200028cf70d5c'; 

  const validate = () => {
    if (!cardType) return 'ID Card type is required';
    if (!cardNumber) return 'ID Number is required';
    if (!expiryDate) return 'Expiry Date is required';
    if (!file) return 'A valid ID card image is required';
    return null;
  };

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

      xhr.open("POST", `${API_URL}/storage/buckets/${BUCKET_ID}/files`);
      xhr.withCredentials = true;
      xhr.setRequestHeader("X-Appwrite-Project", PROJECT_ID);
      xhr.setRequestHeader("X-Appwrite-Response-Format", "0.15.0");
      xhr.setRequestHeader("x-sdk-version", "appwrite:web:9.0.1");
      xhr.send(data);
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setFile(result.assets[0]);
      setFileURL(result.assets[0].uri);
      setImage(result.assets[0].uri); // Make sure image is set to the correct URI
    }
  };

  const uploadImage = async () => {
    if (!image) {
      throw new Error("No image selected");
    }

    let filename = image.split("/").pop();

    let match = /\.(\w+)$/.exec(image);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append("fileId", ID.unique());
    formData.append("file", {
      uri: image,
      name: filename,
      type,
    });

    const response = await sendXmlHttpRequest(formData);
    setSucc(true);
    return response.$id;
  };

  const submitIdentity = async () => {
    const errorMsg = validate();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    try {
      setLoading(true);
      const fileId = await uploadImage();
      const fileUrl = `${API_URL}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
      await useCreateIdentity({
        userId: contextUser.user.id,
        cardType,
        cardNumber,
        expiryDate: expiryDate.toISOString().split('T')[0],
        imageUrl: fileUrl,
      });
      setLoading(false);
      navigation.navigate('Page5');
    } catch (error) {
      setError(error.message || 'Submit failed');
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || expiryDate;
    setShowDatePicker(Platform.OS === 'ios');
    setExpiryDate(currentDate);
  };

  return (
    <ScrollView style={styles.kyc1}>
      <Text style={localStyles.header}>Confirm your ID Card</Text>
      <View style={styles.maincontainer}>
        <Text style={styles.text5}>ID Card type</Text>
        <View style={localStyles.picker}>
          <Picker
            selectedValue={cardType}
            onValueChange={(itemValue) => setCardType(itemValue)}
          >
            <Picker.Item label="Select Option" value="" />
            <Picker.Item label="Drivers Licence" value="Drivers Licence" />
            <Picker.Item label="National ID" value="National ID" />
          </Picker>
        </View>
        <Text style={styles.text5}>ID Number</Text>
        <TextInput 
          style={styles.input} 
          placeholder='0000 0000 0000' 
          keyboardType='number-pad'
          value={cardNumber}
          onChangeText={setCardNumber}
        />
        <Text style={styles.text5}>Expiry Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text style={{ color: expiryDate ? 'black' : 'gray' }}>{expiryDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={expiryDate}
            mode='date'
            display='default'
            onChange={(event, selectedDate) => {
              handleDateChange(event, selectedDate);
              if (Platform.OS === 'android') {
                setShowDatePicker(false);
              }
            }}
          />
        )}
        <View style={styles.upload}>
          <TouchableOpacity onPress={pickImage} style={localStyles.pick}>
            <Text>Click to upload valid ID card</Text>
          </TouchableOpacity>
          {fileURL ? (
            <Image source={{ uri: fileURL }} style={{ width: 80, height: 80, marginTop: 10 }} />
          ) : null}
        </View>
      </View>
      {error ? <Text style={styles.text7}>{error}</Text> : null}
      <View style={styles.lastDown}>
        <TouchableOpacity
          style={styles.btn}
          onPress={submitIdentity}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  header: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
    padding: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  pick: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#ccc'
  }
});

export default Page4;
