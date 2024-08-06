import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../backend/user';
import useCreatePersonalInfo from '../../hooks/useCreatePersonalInfo';
import Successfull from '../../components/successfull';

const Profile2 = ({ navigation }) => {
  const contextUser = useUser();

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // State to track success

  const handleSubmit = async () => {
    if (!businessName || !businessType || !businessCategory || !businessDescription || !address) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (contextUser && contextUser.user && contextUser.user.id) {
      const personalInfo = {
        userId: contextUser.user.id,
        businessName,
        businessType,
        businessCategory,
        businessDescription,
        address,
      };

      setLoading(true); // Start loading
      try {
        await useCreatePersonalInfo(personalInfo);
        setSuccess(true); // Set success to true
      } catch (error) {
        console.error('Error saving business information:', error);
        Alert.alert('Error', 'Failed to save business information');
      } finally {
        setLoading(false); // Stop loading
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
        <Text style={localStyles.headerTitle}>Business Information</Text>
      </View>

      <View style={styles.maincontainer}>
        <Text style={styles.text5}>Business Name</Text>
        <TextInput 
          style={styles.input1} 
          placeholder='Business Name' 
          keyboardType='default'
          value={businessName}
          onChangeText={setBusinessName}
        />

        <Text style={styles.text5}>Business Type</Text>
        <View style={localStyles.picker}>
          <Picker
            selectedValue={businessType}
            onValueChange={(itemValue) => setBusinessType(itemValue)}
            itemStyle={localStyles.pickerItem} // Apply the custom style
          >
            <Picker.Item label="Select Business Type" value="" />
            <Picker.Item label="Retail" value="retail" />
            <Picker.Item label="Wholesale" value="wholesale" />
            <Picker.Item label="Service" value="service" />
            <Picker.Item label="Manufacturing" value="manufacturing" />
          </Picker>
        </View>

        <Text style={styles.text5}>Business Category</Text>
        <View style={localStyles.picker}>
          <Picker
            selectedValue={businessCategory}
            onValueChange={(itemValue) => setBusinessCategory(itemValue)}
            itemStyle={localStyles.pickerItem} 
          >
            <Picker.Item label="Select Business Category" value="" />
            <Picker.Item label="Food & Beverage" value="food_beverage" />
            <Picker.Item label="Clothing & Apparel" value="clothing_apparel" />
            <Picker.Item label="Health & Beauty" value="health_beauty" />
            <Picker.Item label="Electronics" value="electronics" />
          </Picker>
        </View>

        <Text style={styles.text5}>Business Description</Text>
        <TextInput 
          style={styles.input1} 
          placeholder='Description' 
          keyboardType='default' 
          value={businessDescription}
          onChangeText={setBusinessDescription}
        />

        <Text style={styles.text5}>Address</Text>
        <TextInput 
          style={styles.input1} 
          placeholder='Address' 
          keyboardType='default' 
          value={address}
          onChangeText={setAddress}
        />
      </View>

      <View style={styles.lastDown}>
        <TouchableOpacity
          style={styles.btn} 
          onPress={handleSubmit}
          disabled={loading} // Disable button while loading
        >
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
  header: {
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(102, 112, 133, 1)',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 10,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18.52,
    fontWeight: '700',
    color: '#141414',
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  pickerItem: {
    fontSize: 12, // Set the font size to 12
  },
});

export default Profile2;
