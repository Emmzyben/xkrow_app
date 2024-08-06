import React, { useEffect, useState, useContext } from 'react';
import { View, Image } from 'react-native';
import styles from '../../styles/style';
import { useUser } from '../../backend/user'; // Adjust the import path as needed

const Home = ({ navigation }) => {
  const { user, checkUser } = useUser(); // Access user context
  const [navigated, setNavigated] = useState(false); // State to track navigation

  useEffect(() => {
    // Function to handle navigation based on user session
    const handleNavigation = async () => {
      if (!navigated) {
        try {
          await checkUser(); // Ensure user data is fetched
          if (user) {
            // User is in session
            navigation.navigate('Landing');
          } else {
            // No active user session
            navigation.navigate('Login');
          }
          setNavigated(true); // Set navigated to true to prevent re-navigation
        } catch (error) {
          // Error handling if needed
          console.error('Error navigating based on user session:', error);
          navigation.navigate('Login');
          setNavigated(true); // Set navigated to true to prevent re-navigation
        }
      }
    };

    // Set a timeout to delay navigation
    const timer = setTimeout(() => {
      handleNavigation();
    }, 3000);

    // Cleanup timeout on unmount
    return () => clearTimeout(timer);
  }, [navigation, user, checkUser, navigated]); // Added navigated to dependencies

  return (
    <View style={styles.home}>
      <View>
        <Image source={require('../../../assets/logo.jpg')} />
      </View>
    </View>
  );
};

export default Home;
