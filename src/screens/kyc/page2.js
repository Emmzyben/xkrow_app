import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Platform, ScrollView } from 'react-native';
import styles from '../../styles/style';
import { useUser } from '../../backend/user';
import useCreateProfile from '../../hooks/useCreateProfile';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import StatePicker from '../../components/StatePicker';

const Page2 = ({ navigation }) => {
  const contextUser = useUser();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState(new Date());
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validate = () => {
    setError('');

    if (!firstName) {
      setError('A first name is required');
      return true;
    }

    if (!lastName) {
      setError('A last name is required');
      return true;
    }

    if (!gender) {
      setError('A gender is required');
      return true;
    }

    if (!dob) {
      setError('A date of birth is required');
      return true;
    }

    if (!address) {
      setError('An address is required');
      return true;
    }

    if (!state) {
      setError('A state is required');
      return true;
    }

    return false;
  };

  const submitProfile = async () => {
    if (validate()) return;

    try {
      setLoading(true);
      await useCreateProfile({
        userId: contextUser.user.id,
        firstName,
        lastName,
        gender,
        dob: dob.toISOString().split('T')[0], // Formatting date for storage
        address,
        state,
      });
      setLoading(false);
      navigation.navigate('Page3');
    } catch (error) {
      console.error('submit error:', error);
      setLoading(false);
      alert(error.message || 'submit failed');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === 'ios');
    setDob(currentDate);
  };

  return (
    <ScrollView style={styles.kyc1}>
      <Text style={localStyles.header}>Personal information</Text>
      <View style={styles.maincontainer}>
        <Text style={styles.text5}>First name</Text>
        <TextInput
          style={styles.input}
          placeholder='First name'
          keyboardType='default'
          value={firstName}
          onChangeText={setFirstName}
        />
        <Text style={styles.text5}>Last name</Text>
        <TextInput
          style={styles.input}
          placeholder='Last name'
          keyboardType='default'
          value={lastName}
          onChangeText={setLastName}
        />
        <Text style={styles.text5}>Gender</Text>
        <View style={localStyles.picker}>
          <Picker
            selectedValue={gender}
            style={styles.picker}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Picker.Item label="Select Option" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>
        <Text style={styles.text5}>Date of birth</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text style={{ color: dob ? 'black' : 'gray' }}>{dob.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dob}
            mode='date'
            display='default'
            onChange={handleDateChange}
          />
        )}
        <Text style={styles.text5}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder='Address'
          keyboardType='default'
          value={address}
          onChangeText={setAddress}
        />
        <Text style={styles.text5}>State</Text>
        <View style={localStyles.picker}>
          <StatePicker
            selectedValue={state}
            onValueChange={(itemValue) => setState(itemValue)}
          />
        </View>
        <View>
          {/* Add any additional components or content here */}
        </View>
      </View>
      {error ? <Text style={styles.text7}>{error}</Text> : null}

      <View style={styles.lastDown}>
        <TouchableOpacity
          style={styles.btn}
          onPress={submitProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Proceed</Text>
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
    marginBottom:10,
  },
});

export default Page2;
