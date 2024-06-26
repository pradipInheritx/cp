import {
  doc,
  DocumentData,
  QueryDocumentSnapshot,
  setDoc,
  SnapshotOptions,
} from "firebase/firestore";
import React from "react";
import { Coin, CoinSnap, Rate } from "../common/models/Coin";
import { User } from "firebase/auth";
import { db, functions } from "../firebase";
import { httpsCallable } from "firebase/functions";
import { userConverter } from "../common/models/User";
import firebase from "firebase/compat";
import { ICryptoClient } from "@polygon.io/client-js";

export type Rates = { [key: string]: Rate };

export type Totals = {
  total: number;
  success: number;
};

export type Leader = {
  displayName: string;
  email: string;
  userId: string;
  avatar?: string;
  score: number;
  pct: number;
  subscribers?: number;
  leaders?: number;
  status?: string;
};

type SubscribeFuncProps = { leader: Leader; userId: string; add: boolean };

export const follow = async (leader: Leader, you: User, add: boolean) => {
  if (add) {
    await setDoc(
      doc(db, "users", you.uid).withConverter(userConverter),
      { leader: firebase.firestore.FieldValue.arrayUnion(leader.userId) },
      { merge: true }
    );
  } else {
    await setDoc(
      doc(db, "users", you.uid).withConverter(userConverter),
      { leader: firebase.firestore.FieldValue.arrayRemove(leader.userId) },
      { merge: true }
    );
  }
  const subscribe = httpsCallable(functions, "subscribe");
  await subscribe({ leader, userId: you.uid, add } as SubscribeFuncProps);
};

export const totalsConverter = {
  toFirestore(totals: { [key: string]: Totals }): DocumentData {
    return totals;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): { [key: string]: Totals } {
    const data = snapshot.data(options)!;
    return data as { [key: string]: Totals };
  },
};

export const leadersConverter = {
  toFirestore(leaders: Leader[]): DocumentData {
    return leaders;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Leader[] {
    const data = snapshot.data(options)!;
    return data.leaders as Leader[];
  },
};

export const coinDataConverter = {
  toFirestore(totals: CoinSnap): DocumentData {
    return totals;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): CoinSnap {
    const data = snapshot.data(options)!;
    return data as CoinSnap;
  },
};

export type CoinContextProps = {
  coins: { [symbol: string]: Coin };
  setCoins: (coins: { [symbol: string]: Coin }) => void;
  totals: { [key: string]: Totals };
  leaders: Leader[];
  setTotals: (totals: { [key: string]: Totals }) => void;
  setLeaders: (leaders: Leader[]) => void;
  rest: ICryptoClient;
  ws: WebSocket;
  allCoins: string[];
  allPairs: Array<string[]>;
};

const CoinsContext = React.createContext({ coins: {} } as CoinContextProps);

export default CoinsContext;

CoinsContext.displayName = "Coins";
