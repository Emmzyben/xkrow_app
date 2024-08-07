import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState } from 'react-native';
import { account, ID } from '../backend/appwite'
import { useNavigation } from '@react-navigation/native';

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);

  const checkUser = async () => {
    try {
      const userData = await account.get(); // get the current user data
      if (userData && userData.email) {
        setUser({ id: userData.$id, email: userData.email });
        console.log('User data fetched:', userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      // console.error('Error checking user:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const register = async (email, password) => {
    try {
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      const userId = ID.unique(); 
      await account.create(userId, email, password);
      await account.createEmailPasswordSession(email, password); 
      await checkUser();
    } catch (error) {
      // console.error('Error registering:', error);
      // throw error;
    }
  };

  const login = async (email, password) => {
    try {
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      await account.createEmailPasswordSession(email, password); 
      await checkUser();
    } catch (error) {
      // console.error('Error logging in:', error);
      // throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current'); 
      setUser(null);
      navigation.navigate('Login'); 
      console.log('Session destroyed.');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // useEffect(() => {
  //   const handleAppStateChange = async (nextAppState) => {
  //     console.log(`AppState changed from ${appState} to ${nextAppState}`);
  //     if (nextAppState === 'background') {
  //       console.log('App went to background. Logging out...');
  //       await logout();
  //       console.log('logged out');
  //     }
  //     setAppState(nextAppState);
  //   };

  //   const subscription = AppState.addEventListener('change', handleAppStateChange);

  //   return () => {
  //     subscription.remove();
  //   };
  // }, [appState]);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <UserContext.Provider value={{ user, register, login, logout, checkUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUser = () => useContext(UserContext);
