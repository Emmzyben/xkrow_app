import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import styles from '../../styles/style';

const Page6 = ({ navigation }) => {
  return (
    <View style={styles.Login}>
      <Text style={styles.text}>Page6</Text>
      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder='Email' 
          keyboardType='email-address' 
        />
        <TextInput 
          style={styles.input} 
          placeholder='Password' 
          secureTextEntry 
        />
        <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <TextInput
          value='Login'
          style={styles.button}
        />
        <TextInput/>
      </View>

   
      <View style={styles.google}>
     
        

        <Text style={styles.createAccountText}>
          Create An Account  
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  orText: {
    textAlign: 'center',
    color: 'grey',
  },
  createAccountText: {
    textAlign: 'center',
    color: 'grey',
  },
  imgContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  inner: {
    padding: 10,
  },
  img: {
    width: 30,
    height: 30,
  },
});

export default Page6;
