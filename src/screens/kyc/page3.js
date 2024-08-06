import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import styles from '../../styles/style';
import { useUser } from '../../backend/user';
import useCreateBvn from '../../hooks/useCreateBvn';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const Page3 = ({ navigation }) => {
  const contextUser = useUser();
  const { createBvn, loading, error } = useCreateBvn();
  const [bvn, setBvn] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validate = () => {
    if (!bvn) {
      return 'A BVN is required';
    }
    if (!gender) {
      return 'A gender is required';
    }
    if (!dob) {
      return 'A date of birth is required';
    }
    return null;
  };

  const submitBvn = async () => {
    const errorMsg = validate();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    try {
      await createBvn({
        userId: contextUser.user.id,
        bvn,
        gender,
        dob: dob.toISOString().split('T')[0], // Formatting date for storage
      });
      navigation.navigate('Page4');
    } catch (error) {
      alert(error.message || 'Submit failed');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === 'ios');
    setDob(currentDate);
  };

  return (
    <View style={styles.kyc1}>
      <Text style={localStyles.header}>Personal Information</Text>
      <View style={styles.maincontainer}>
        <Text style={styles.text5}>BVN Number</Text>
        <TextInput 
          style={styles.input} 
          placeholder='BVN' 
          keyboardType='numeric'
          value={bvn}
          onChangeText={setBvn}
        />
        <Text style={styles.text5}>Gender</Text>
        <View style={localStyles.picker}>
        
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Select Option" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
        </View>
        <Text style={styles.text5}>Date of Birth</Text>
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
      </View>
      {error ? <Text style={styles.text7}>{error.message}</Text> : null}
      <View style={styles.lastDown}>
        <TouchableOpacity
          style={styles.btn}
          onPress={submitBvn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Proceed</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
  input2: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});

export default Page3;
