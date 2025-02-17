import { collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc, limit, where, startAfter, getDoc, updateDoc } from 'firebase/firestore';
// import { AUTH, DB } from './firebase';

import { AUTH, DB } from '../firebaseConfig';
import Toast from 'react-native-root-toast';


let attendanceCol = collection(DB,'attendance');

export const createAttendance = async(formData) => {

    console.log(formData);
    try{
        // GET USER
        const user = AUTH.currentUser;
        /// POST DOC
        const docRef = doc(attendanceCol);
        // const id = docRef.id
        const attendanceData = {
            status:'pending',
            created_at: serverTimestamp(),
            owner:user.uid,
            employee: formData,
            // ...formData
        };
        await setDoc(docRef,attendanceData);
        Toast.show('Attendance created');
        return attendanceData;
    } catch(e){
        Toast.show('Oops, try again');
        console.log(e)
    }
}