// import React from 'react';
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
//   scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
//   webClientId: '78881264896-bpo7sv65uunee9d46sljgo5g8saa6v99.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access). Required to get the `idToken` on the user object!
// });

// export default function App() {
//   const handleGoogleSignIn = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       console.log(JSON.stringify(userInfo, null, 2));
//     } catch (error) {
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         // user cancelled the login flow
//         console.log('User cancelled the login flow');
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         // operation (e.g. sign in) is in progress already
//         console.log('Sign in operation is in progress');
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         // play services not available or outdated
//         console.log('Play services not available or outdated');
//       } else {ss
//         // some other error happened
//         console.log('Some other error happened', error);
//       }
//     }
//   };

//   return (
//     <GoogleSigninButton
//       size={GoogleSigninButton.Size.Wide}
//       color={GoogleSigninButton.Color.Dark}
//       onPress={handleGoogleSignIn}
//     />
//   );
// }
