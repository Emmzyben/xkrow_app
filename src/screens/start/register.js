import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image,ActivityIndicator } from 'react-native';
import styles from '../../styles/style';
import { useUser } from '../../backend/user';
import { useNavigation } from '@react-navigation/native';
// import Auth from '../../components/Auth';

const Register = () => {
  const navigation = useNavigation();
  const contextUser = useUser();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    setError('');

    if (!email) {
      setError('An Email is required');
      return true;
    }

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!reg.test(email)) {
      setError('The Email is not valid');
      return true;
    }

    if (!password) {
      setError('A Password is required');
      return true;
    }

    if (password.length < 8) {
      setError('The Password needs to be longer');
      return true;
    }

    if (password !== confirmPassword) {
      setError('The Passwords do not match');
      return true;
    }

    return false;
  };

  const register = async () => {
    if (validate()) return;

    try {
      setLoading(true);
      await contextUser.register(email, password);
      setLoading(false);
      navigation.navigate('Landing');
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      alert(error.message || 'Registration failed');
    }
  };

  return (
    <View style={styles.login}>
      <Text style={styles.text}>Create an Account</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder='Email'
          keyboardType='email-address'
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder='Password'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder='Confirm Password'
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {error ? <Text style={styles.text7}>{error}</Text> : null}

        <TouchableOpacity
      style={styles.button}
      onPress={register}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.buttonText}>Create Account</Text>
      )}
    </TouchableOpacity>
      </View>

      <View style={styles.google}>
    
        <View style={styles.imgContainer}>
        {/* <Auth/>  */}
        </View>
      </View>

      <Text style={{ textAlign: 'center', color: 'grey' }}>
        Already have an account?{' '}
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link2}>Login</Text>
        </TouchableOpacity>
    </View>
  );
};

export default Register;
