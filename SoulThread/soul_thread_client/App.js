
import { StyleSheet, Text, View } from 'react-native';

import { createContext,useState } from 'react';
import { AuthProvider } from './src/context/AuthContext';

import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  
  return (
    // <View style={styles.container}>
    //   {/* <Signin/> */}
    //   {/* <Signup/> */}
    //   {/* <Profile1/> */}
    //   {/* <Profile2/> */}
    //   <Profile3/>     
    // </View>

    <AuthProvider>
      <AppNavigator/>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
   
  },
});
