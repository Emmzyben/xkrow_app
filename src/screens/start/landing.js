import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/style';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Hero from '../../components/hero';
import Nav from '../../components/nav';
import Transactions from '../../components/transactions';
import KYC from '../../components/kyc';
import KYC2 from '../../components/kyc2';
import KYC3 from '../../components/kyc3';
import { useUser } from '../../backend/user';
import { database, Query } from '../../backend/appwite';
import { DATABASE_ID, COLLECTION_ID_PROFILE, COLLECTION_ID_BVN, COLLECTION_ID_IDENTITY, COLLECTION_ID_NOTIFICATION } from '@env';
import useGetProfile from '../../hooks/useGetProfile'; // Import the useGetProfile hook

const Landing = ({ navigation }) => {
  const { user } = useUser();
  const { profile, loading, error, fetchProfile } = useGetProfile();
  const [showKYC1, setShowKYC1] = useState(false);
  const [showKYC2, setShowKYC2] = useState(false);
  const [showKYC3, setShowKYC3] = useState(false);
  const [checkingKYC, setCheckingKYC] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [lastViewedNotification, setLastViewedNotification] = useState(null);

  const checkCollections = async () => {
    try {
      const userIdQuery = [Query.equal('user_id', user.id)];

      const profileResponse = await database.listDocuments(DATABASE_ID, COLLECTION_ID_PROFILE, userIdQuery);
      const bvnResponse = await database.listDocuments(DATABASE_ID, COLLECTION_ID_BVN, userIdQuery);
      const identityResponse = await database.listDocuments(DATABASE_ID, COLLECTION_ID_IDENTITY, userIdQuery);

      if (profileResponse.total === 0) {
        setShowKYC1(true);
      } else if (bvnResponse.total === 0 && identityResponse.total === 0) {
        setShowKYC2(true);
      } else if (bvnResponse.total > 0 && identityResponse.total === 0) {
        setShowKYC3(true);
      }
    } catch (error) {
      console.error('Error checking collections:', error);
    }
  };

  const checkNotifications = async () => {
    try {
      const userIdQuery = [Query.equal('user_id', user.id)];
      const notificationResponse = await database.listDocuments(DATABASE_ID, COLLECTION_ID_NOTIFICATION, userIdQuery);

      if (notificationResponse.total > 0) {
        const newNotifications = notificationResponse.documents.filter(notification => {
          return new Date(notification.timestamp) > new Date(lastViewedNotification);
        });
        setNotificationCount(newNotifications.length);
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  useEffect(() => {
    const loadLastViewedNotification = async () => {
      try {
        const lastViewed = await AsyncStorage.getItem('lastViewedNotification');
        if (lastViewed) {
          setLastViewedNotification(new Date(lastViewed));
        } else {
          setLastViewedNotification(new Date(0)); // Default to epoch time if no timestamp is found
        }
      } catch (error) {
        console.error('Error loading last viewed notification:', error);
      }
    };

    if (user?.id) {
      loadLastViewedNotification();
      fetchProfile();
      setCheckingKYC(true);
      const intervalId = setInterval(() => {
        checkCollections();
        checkNotifications();
      }, 1000);

      // Clear interval when KYC is completed or user logs out
      return () => {
        clearInterval(intervalId);
        setCheckingKYC(false);
      };
    }
  }, [user?.id]);

  const handleNavigation = (route) => {
    setShowKYC1(false);
    setShowKYC2(false);
    setShowKYC3(false);
    navigation.navigate(route);
  };

  const handleNotificationPress = async () => {
    try {
      const now = new Date();
      await AsyncStorage.setItem('lastViewedNotification', now.toISOString());
      setLastViewedNotification(now);
      setNotificationCount(0);
      navigation.navigate('Notification');
    } catch (error) {
      console.error('Error updating last viewed notification:', error);
    }
  };

  return (
    <View style={styless.container}>
      <View style={styles.top}>
        <View style={styles.top1}>
          <Text style={styles.text2}>
            Welcome {loading ? 'Loading...' : profile ? `${profile.firstName} ${profile.lastName}` : 'User'}
          </Text>
          <Text style={styles.text7}>How's the weather in your region</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.top1} onPress={handleNotificationPress}>
            <FontAwesome5 name="bell" size={17} style={styles.icon} />
            {notificationCount > 0 && (
              <View style={styless.notificationBadge}>
                <Text style={styless.notificationCount}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Hero />
      <TouchableOpacity onPress={() => handleNavigation('Buyer1')}>
        <Text style={styles.btn2}>+ New Xkrow transaction</Text>
      </TouchableOpacity>
      <Transactions />
      {showKYC1 && <KYC onVerify={() => handleNavigation('Page1')} />}
      {showKYC2 && <KYC2 onVerify={() => handleNavigation('Page3')} />}
      {showKYC3 && <KYC3 onVerify={() => handleNavigation('Page4')} />}
      <Nav />
    </View>
  );
};

const styless = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationBadge: {
    position: 'absolute',
    top: 60,
    right: 30,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: 'white',
    fontSize: 12,
  },
});

export default Landing;
