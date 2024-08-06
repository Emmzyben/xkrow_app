import React from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image } from 'react-native';
import styles from '../../styles/style';

const Forgot = ({ navigation }) => {
  return (
    <View style={styles.login}>
      <Text style={styles.text}>Forgot<Text>{'\n'}</Text>password?</Text>
      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder='Enter your email address' 
          keyboardType='email-address' 
        />

          <Text><Text style={{color:'red'}}>*</Text>  We will send you a message to set or reset your new password</Text>
      

        <TextInput
        value='Submit'
        keyboardType='submit'
        style={styles.button}
      />
      <TextInput/>
      </View>


    </View>
  );
};

export default Forgot;
