import { collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc, limit, where, startAfter, getDoc, updateDoc } from 'firebase/firestore';
// import { AUTH, DB } from './firebase';

import { AUTH, DB } from '../firebaseConfig';
import Toast from 'react-native-root-toast';


let attendanceCol = collection(DB,'attendance');


export const getUserEvents = async(docLimit=4) =>{
    try{
        const user = AUTH.currentUser;
        const q = query(
            attendanceCol,
            orderBy('created_at','desc'),
            where('owner','==', user.uid),
            where('status','==','pending'),
            limit(docLimit)
        );
        const querySnapshot = await getDocs(q);
        const events = getMoreHelper(querySnapshot);

        return {
            ...events
        }
    } catch(e){
        console.log(e)
    }
}