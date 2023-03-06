import * as admin from "firebase-admin";
import { UserTypeProps } from "./User";
import { firestore } from "firebase-admin";
import { getPriceOnParticularTime } from "../models/Rate";
import Calculation from "../models/Calculation";
import Timestamp = admin.firestore.Timestamp;
import FirestoreDataConverter = admin.firestore.FirestoreDataConverter;

export type VoteProps = {
  coin: string;
  userId: string;
  timeframe: TimeFrame;
  direction: Direction;
  valueVotingTime: number | number[];
  status?: UserTypeProps;
  trendChange?: number;
};

export const voteConverter: FirestoreDataConverter<VoteResultProps> = {
  toFirestore(modelObject: VoteResultProps): FirebaseFirestore.DocumentData {
    return modelObject;
  },
  fromFirestore(
    snapshot: FirebaseFirestore.QueryDocumentSnapshot
  ): VoteResultProps {
    const data = snapshot.data();
    return data as VoteResultProps;
  },
};

export type VoteResultProps = VoteProps & {
  voteTime: Timestamp;
  expiration: Timestamp;
  valueExpirationTime?: number | number[];
  success?: number;
  score?: number;
  CPMRangePercentage: number;
};

export type TimeFrame = {
  index: number;
  name: string;
  seconds: number;
};

export enum Direction {
  BULL,
  BEAR,
}

export const calculateOffset: (timeframe: TimeFrame) => number = (
  timeframe: TimeFrame
) => timeframe.seconds * 1000;

export const updateVotesTotal = async () => {
  console.log("Beginning execution of updateVotesTotal 2 --->");
  const app = await admin.firestore().collection("stats").doc("app").get();
  console.log("Beginning execution of updateVotesTotal --->");
  if (!app.exists || (app.exists && !app.data()?.totalVotes)) {
    const votes = await admin.firestore().collection("votes").get();

    await admin
      .firestore()
      .collection("stats")
      .doc("app")
      .set({ totalVotes: votes.size }, { merge: true });
  } else {
    await admin
      .firestore()
      .collection("stats")
      .doc("app")
      .update({ totalVotes: admin.firestore.FieldValue.increment(1) });
  }
  console.log("Finished execution of updateVotesTotal --->");
  return;
};

export const updateVotesTotalForSingleCoin = async (coin: any) => {
  const data = await admin.firestore().collection("stats").doc("totals").get();

  const mappedData = data.data();

  const obj: any = {};
  if (mappedData?.hasOwnProperty(`${coin}`)) {
    obj[`${coin}`] = {
      success: mappedData[coin].success,
      total: mappedData[coin].total + 1,
    };

    await admin.firestore().collection("stats").doc("totals").update(obj);
  } else {
    obj[`${coin}`] = {
      success: 0,
      total: 1,
    };
    const test = await admin.firestore().collection("stats").doc("totals");
    await test.set(obj, { merge: true });
  }

  console.log("Finished execution of updateVotesTotalForSingleCoin --->");
  return;
};

export const getOldAndCurrentPriceAndMakeCalculation = async (
  requestBody: any
) => {
  let price: any;
  const {
    coin1,
    coin2,
    voteId,
    voteTime,
    valueVotingTime,
    expiration,
    timestamp,
  } = requestBody;
  // Snapshot Get From ID
  const getVoteRef = firestore().collection("votes").doc(voteId);
  const getVoteInstance = await getVoteRef.get();
  const getVoteData = getVoteInstance.data();

  const vote = {
    ...getVoteData,
    expiration,
    voteTime,
    valueVotingTime,
  } as unknown as VoteResultProps;

  if (coin2) {
    let priceOne = await getPriceOnParticularTime(coin1, timestamp);
    let priceTwo = await getPriceOnParticularTime(coin2, timestamp);
    price = [priceOne, priceTwo];
  } else {
    price = await getPriceOnParticularTime(coin1, timestamp);
  }
  console.log("price =>", price);
  // console.info("Get Price On Timestamp =>", price);

  // console.info("This is before calculation =>");

  if (price) {
    const calc = new Calculation(vote, Number(price), voteId);
    await calc.calc(getVoteRef);
  }
};
