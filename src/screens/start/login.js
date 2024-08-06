import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useUser } from '../../backend/user';
import styles from '../../styles/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const navigation = useNavigation();
  const { user, login, checkUser } = useUser(); // Destructured for simplicity
  const isFocused = useIsFocused(); // Check if the screen is focused
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (isFocused) {
        try {
          await checkUser();
          if (user) {
            navigation.navigate('Landing');
          }
        } catch (error) {
          // console.error('Error checking user session:', error);
        }
      }
    };

    checkSession();
  }, [isFocused, user, checkUser, navigation]);

  const validate = () => {
    setError('');

    if (!email) {
      setError('An Email is required');
      return true;
    }

    if (!password) {
      setError('A Password is required');
      return true;
    }

    return false;
  };

  const handleLogin = async () => {
    if (validate()) return;

    try {
      setLoading(true);
      await login(email, password);
      setLoading(false);
      navigation.navigate('Landing');
    } catch (error) {
      // console.error('Login error:', error);
      setLoading(false);
      alert(error.message || 'Login failed');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.login}>
      <Text style={styles.text}>Welcome<Text>{'\n'}</Text>Back!</Text>
      <View style={styles.form}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput 
          style={styles.input} 
          placeholder='Email' 
          keyboardType='email-address'
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput 
            style={styles.input} 
            placeholder='Password' 
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size={17} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.text7}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.google}>
        {/* <Auth/> */}
        <View style={styles.imgContainer}>
        </View>
        <Text style={{ textAlign: 'center', color: 'grey' }}>
          Create An Account
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link2}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
