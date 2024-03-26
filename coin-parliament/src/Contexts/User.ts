import React from "react";
import { NotificationProps, userConverter, UserProps } from "../common/models/User";
import { User as AuthUser } from "firebase/auth";
import { doc, Firestore, getDoc, setDoc } from "firebase/firestore";
import { V2EParliament, db, functions } from "../firebase";
import { VoteResultProps } from "../common/models/Vote";
import { httpsCallable } from "firebase/functions";
import firebase from 'firebase/app';
import sportParliament from "firebaseSportParliament";
import stockParliament from "firebaseStockParliament";
import votingParliament from "firebaseVotingParliament";
import coinParliament from "firebaseCoinParliament";
export type UserContextProps = {
  userInfo?: UserProps;
  user?: AuthUser;
  setUser: (user?: AuthUser) => void;
  setUserInfo: (user?: UserProps) => void;
  votesLast24Hours: VoteResultProps[];
  setVotesLast24Hours: (votes: VoteResultProps[]) => void;
  admin?: boolean;
  setAdmin: (a: boolean) => void;
  displayName: string;
  setDisplayName: (d: string) => void;
  notifications: NotificationProps[];
  setNotifications: (notifications: NotificationProps[]) => void;
};

const UserContext = React.createContext({} as UserContextProps);

const observeTopics = httpsCallable(functions, "observeTopics");

export const getUserInfo: (user?: AuthUser) => Promise<UserProps> = async (
  user
) => {
  if (user?.uid) {
    const ref = doc(db, "users", user?.uid).withConverter(userConverter);
    const userinfo = await getDoc<UserProps>(ref);
    const info = userinfo.data();

    if (info?.leader) {
      observeTopics({ leaders: info.leader }).then(() => void 0);
    }
    return info || ({} as UserProps);
  }

  return {} as UserProps;
};

// export const saveUsername = async (uid: string, displayName: string, avatar: string) => {
//   const userRef = doc(db, "users", uid);
//   await setDoc(userRef, { displayName/* , avatar */ }, { merge: true });
// };


export const saveUsername = async (uid: string, displayName: string, avatar: string) => { 
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { userName: displayName, /* avatar */ }, { merge: true });
};

export const saveDisplayName = async (uid: string, displayName: string, avatar: string) => {  
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { displayName, /* avatar */ }, { merge: true });
};

export const AddAllUserName = async (database:any, uid: any, userName: string, displayName: string,) => {    
  const userRef = doc(database, "users", uid);  
  await setDoc(userRef, { isVoteName: userName, displayName }, { merge: true });
  
};


export const saveFoundation = async (uid: string, foundationName: string) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { foundationName }, { merge: true });
};

export const saveUserData = async (uid: string, database: Firestore, data: { [key: string]: any }) => {
  console.log(data,"datausername")
  let userData: { [key: string]: string } = {};
  Object.keys(data).map((value) => {
    if (data[value] !== undefined) {
      console.log(value,data[value], "datausername")
      userData = { ...userData, [value]: data[value] }
    }
  });
  if (uid) {
    console.log(userData, 'saveUserData');

    const userRef = doc(database, "users", uid);
    await setDoc(userRef, userData, { merge: true });
  }
};

// export const getReferUser = async (database: any, emailArg?: string, storeRefer?: Firestore) => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const queryEmail = urlParams.get('refer');
//   const uidValue = queryEmail?.slice(-6);
//   const emailValue = queryEmail?.slice(0, 2);

//   const email = emailArg ? emailArg : localStorage.getItem('parentEmail');  

//   var user = { uid: '' };  
//   let userdata = { uid: '' };  
//   if (queryEmail) {      
//         const referUser = await database.collection('users')
//         await referUser.get().then((snapshot:any) => {
//           let data: any = []
//           snapshot.forEach((doc:any) => {
//             data.push({ ...doc.data() });
//           });          
          
//         data?.map((item: any, index: number) => {
//             if (item.uid?.slice(-6) == uidValue && item.email?.slice(0, 2) == emailValue) {
//               // setPreantId(item.uid)   
//               userdata = { ...item };
//               console.log(item,"getitem")
//             }
//           })        
//         })      
//     console.log(userdata,"userdatacheck")
//     return userdata
//   }
//   else {
//     return userdata;  
//   }
// }

export const getReferUser = async (database: any, emailArg?: string, storeRefer?: Firestore) => {
  const urlParams = new URLSearchParams(window.location.search);
  const queryEmail = urlParams.get('refer');
  const email = emailArg ? emailArg : localStorage.getItem('parentEmail');  
  let user = { uid: '' };
  if (email) {
    try {
      const referUser = await database.collection('users').where('email', '==', email).get();
      if (!referUser.empty) {
        referUser.forEach((doc: any) => {
          user = doc.data();
        });
      }

    } catch (err) {
      console.log(emailArg, err, 'email');
    }
  }
  return user;
}



export const storeAllPlatFormUserId = async (email: string) => {
  try {
    await Promise.all([
      getReferUser(V2EParliament.firestore(), email),
      getReferUser(coinParliament.firestore(), email),
      getReferUser(sportParliament.firestore(), email),
      getReferUser(stockParliament.firestore(), email),
      getReferUser(votingParliament.firestore(), email)
    ]).then((data) => {
      console.log(data,"allvalue")
      const V2E = data[0];
      const coinUser = data[1];
      const sportUser = data[2];
      const stockUser = data[3];
      const votingUser = data[4];            
      localStorage.setItem("userId", JSON.stringify({ V2E: (V2E?.uid || ''), coin: (coinUser?.uid || ''), sport: (sportUser?.uid || ''), stock: (stockUser?.uid || ''), voting: (votingUser?.uid || '') }));
      // @ts-ignore
      localStorage.setItem("DisplayName", JSON.stringify({ V2E: (V2E?.displayName || ''), coin: (coinUser?.displayName || ''), sport: (sportUser?.displayName || ''), stock: (stockUser?.displayName || ''), voting: (votingUser?.displayName || '') }));
    }).catch(() => {

    })
    // const V2E = await getReferUser(V2EParliament.firestore(), email);
    // const coinUser = await getReferUser(coinParliament.firestore(), email);
    // const sportUser = await getReferUser(sportParliament.firestore(), email);
    // const stockUser = await getReferUser(stockParliament.firestore(), email);
    // const votingUser = await getReferUser(votingParliament.firestore(), email);
  } catch (error) {

  }
}


export default UserContext;

UserContext.displayName = "User";
