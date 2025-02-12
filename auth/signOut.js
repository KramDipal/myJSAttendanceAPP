import { Alert } from 'react-native';
import { AUTH } from '../firebaseConfig';


async function signOutWithMsg(user) {
  
  try {
    Alert.alert('Goodbye! ' + (user ? user.email : 'User'));
    await AUTH.signOut();
  } catch (error) {
    console.error('Error signing out: ', error);
  }
}

export { signOutWithMsg };