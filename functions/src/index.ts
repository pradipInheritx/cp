import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import {credential, firestore, initializeApp, messaging, ServiceAccount} from "firebase-admin";
import express from "express";
import * as bodyParser from "body-parser";
import env from "./env/env.json";

import cors from "cors";
import {
  Colors,
  isAdmin,
  userConverter,
  UserProps,
  UserTypeProps,
} from "./common/models/User";
// import {generateAuthTokens} from "./common/models/Admin/Admin";
import serviceAccount from "./serviceAccounts/coin-parliament-staging.json";
// import { getPrice } from "./common/models/Rate";
// import {getPrice, getRateRemote} from "./common/models/Rate";
import {
  getLeaderUsers,
  getLeaderUsersByIds,
  setLeaders
} from "./common/models/Calculation";
// import {getLeaderUsers, getLeaderUsersByIds, setLeaders} from "./common/models/Calculation";
// import {middleware} from "../middleware/authentication";
import {
  // calculateOffset,
  updateVotesTotal,
  updateVotesTotalForSingleCoin,
  voteConverter,
  VoteResultProps,
  getOldAndCurrentPriceAndMakeCalculation,
  checkInActivityOfVotesAndSendNotification,
} from "./common/models/Vote";
import {
  // fetchCoins,
  getAllCoins,
  getAllPairs,
  Leader,
  prepareCPVI,
  fetchAskBidCoin,
  getUpdatedDataFromWebsocket,
  getAllUpdated24HourRecords,
  removeTheBefore24HoursData,
} from "./common/models/Coin";
import { pullAll, union, uniq } from "lodash";
import Refer from "./common/models/Refer";
import {
  subscribeToTopic,
  unsubscribeToTopic,
} from "./common/models/Subscribe";
import { JWT } from "google-auth-library";
import {
  addCpmTransaction,
  checkPendingTransactions,
  CpmTransaction,
  createPaxTransaction,
  onEnteringAddress,
  PaxData,
  PaxTransaction,
  shouldHaveTransaction,
  shouldUpdateTransactions,
  updateProcessing,
} from "./common/models/PAX";
import {
  claimReward,
  addReward,
  cardHolderListing,
} from "./common/models/Reward";
import {
  cpviTaskCoin,
  cpviTaskPair,
  getCPVIForVote,
  // getUniqCoins,
  // getUniqPairsBothCombinations,
} from "./common/models/CPVI";
import sgMail from "@sendgrid/mail";
import { sendNotificationForFollwersFollowings, sendCustomNotificationOnSpecificUsers, checkUserStatusIn24hrs } from "./common/models/SendCustomNotification";
import { getCoinCurrentAndPastDataDifference } from "./common/models/Admin/Coin";

import subAdminRouter from "./routes/SubAdmin.routes";
import authAdminRouter from "./routes/Auth.routes";
import coinRouter from "./routes/Coin.routes";
import coinPairRouter from "./routes/CoinPair.routes";
import rewardsDistributionRouter from "./routes/RewardsDistribution.routes";
import rewardNftAdminRouter from "./routes/RewardNftAdmin.routes";
import timeframeRouter from "./routes/VoteSettings/timeframe.routes";
import perUserVoteRouter from "./routes/VoteSettings/perUserVotes.routes";
import userTypeSettingsRouter from "./routes/UserTypeSettings";
import voteAndSettingsRouter from "./routes/VoteSettings/VoteAndRetrunSettings.routes";
import pushNotificationSettingRouter from "./routes/PushNotificationSetting.routes";
import FollowTableRouter from "./routes/FollowTable.routes";
import PaymentRouter from "./routes/Payments.routes";
import { imageUploadFunction } from "./common/helpers/fileUploadConfig";
import { getFollowersFollowingsAndVoteCoin } from "./common/models/NotificationCalculation";
import { auth } from "./common/middleware/authentication";

// initialize express server
const app = express();
const main = express();
// Enable The CORS
app.use(cors({ origin: "*" }));
main.use(cors({ origin: "*" }));
// End
// Add the path to receive request and set json as bodyParser to process the body
main.use("/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

/**
 * @author Mukut Prasad
 * @description Added admin routes seperately
 */
app.use("/admin/sub-admin", subAdminRouter);
app.use("/admin/auth", authAdminRouter);
app.use("/admin/rewards", rewardNftAdminRouter);
app.use("/admin/coins", coinRouter);
app.use("/admin/coinsPair", coinPairRouter);
app.use("/admin/voteSetting", timeframeRouter);
app.use("/admin/voteSetting", perUserVoteRouter);
app.use("/admin/userTypeSettings", userTypeSettingsRouter);
app.use("/admin/settings", voteAndSettingsRouter);
app.use("/admin/RewardsDistribution", rewardsDistributionRouter);
app.use("/admin/PushNotificationSetting", pushNotificationSettingRouter);
app.use("/admin/FollowTable", FollowTableRouter);
app.use("/payment", PaymentRouter);

app.post("/generic/admin/uploadFiles/:forModule/:fileType/:id", auth, imageUploadFunction);


app.get("/calculateCoinCPVI", async (req, res) => {
  await cpviTaskCoin((result) => res.status(200).json(result));
});
app.get("/calculatePairCPVI", async (req, res) => {
  await cpviTaskPair((result) => res.status(200).json(result));
});

exports.api = functions.https.onRequest(main);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://coin-parliament-staging-default-rtdb.firebaseio.com",
});

exports.getAccessToken = () =>
  new Promise(function (resolve, reject) {
    const key = serviceAccount;
    const jwtClient = new JWT(
      key.client_email,
      undefined,
      key.private_key,
      ["https://www.googleapis.com/auth/firebase.messaging"],
      undefined
    );
    jwtClient.authorize(function (err: any, tokens: any) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens?.access_token);
    });
  });
const getMaxVotes = async () => {
  const getVoteAndReturnQuery = await admin.firestore().collection("settings").doc("settings").get();
  const getVoteAndReturnData: any = getVoteAndReturnQuery.data();
  return getVoteAndReturnData?.voteRules.maxVotes
}

exports.onCreateUser = functions.auth.user().onCreate(async (user) => {
  console.log("create user");
  const status: UserTypeProps = {
    name: "Member",
    weight: 1,
    index: 7,
    givenCPM: 0,
    minVote: 0,
    share: 0,
    color: Colors.PLATINUM,
  };
  const userData: UserProps = {
    uid: user.uid,
    address: "",
    avatar: user.photoURL,
    // foundationName: user.foundationName,
    country: "",
    email: user.email,
    firstName: "",
    lastName: "",
    mfa: false,
    displayName: user.displayName,
    phone: user.phoneNumber,
    subscribers: [],
    children: [],
    voteStatistics: {
      total: 0,
      successful: 0,
      score: 0,
      rank: 0,
      commission: 0,
      pax: 50,
    },
    rewardStatistics: {
      total: 0,
      claimed: 0,
      cards: [],
      extraVote: 0,
      diamonds: 0,
    },
    favorites: [],
    status,
    firstTimeLogin: true,
    refereeScrore: 0,
    googleAuthenticatorData: {},
    voteValue: await getMaxVotes()
  };
  try {
    console.log("new user >>>", userData, user.uid);
    return await admin
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set(userData);
  } catch (e) {
    console.log("create user Error....", e);
    return false;
  }
});

exports.sendPassword = functions.https.onCall(async (data) => {
  const { password } = data as { password: string };
  return password === "CPVI2022!";
});

exports.setLeadersOnce = functions.https.onCall(async () => {
  await setLeaders();
});

exports.isAdmin = functions.https.onCall(async (data) => {
  const { user } = data as { user: string };
  return await isAdmin(user);
});

type SubscribeFuncProps = { leader: Leader; userId: string; add: boolean };

exports.getUserNames = functions.https.onCall(async (data) => {
  const { userIds = [] } = data as { userIds: string[] };
  try {
    if (userIds && userIds.length > 0) {
      const usersRef = await admin
        .firestore()
        .collection("users")
        .where(admin.firestore.FieldPath.documentId(), "in", userIds)
        .get();

      return usersRef.docs.map((doc) => {
        const { displayName, email } = doc.data();
        return {
          id: doc.id,
          username: displayName || email,
        };
      });
    } else {
      console.log("empty");
      return [];
    }
  } catch (e) {
    console.log(e);
    return [];
  }
});

exports.sendMessage = functions.https.onCall(async (data) => {
  const { token, message } = data;
  const payload = {
    token,
    data: {
      message,
    },
  };

  admin
    .messaging()
    .send(payload)
    .then((messageId) => {
      return { messageId };
    })
    .catch((error) => {
      console.log("error", error);
      return new functions.https.HttpsError("internal", error.message, error);
    });
});

exports.sendCustomNotification = functions.https.onCall(async (requestBody) => {
  await sendCustomNotificationOnSpecificUsers(requestBody);
});

exports.observeTopics = functions.https.onCall(async (data, context) => {
  const { leaders = [] } = data as { leaders: string[] };
  const { auth } = context;

  const { uid } = auth || {};
  if (uid) {
    const userRef = admin
      .firestore()
      .collection("users")
      .doc(uid)
      .withConverter(userConverter);

    const userProps = await userRef.get();
    const token = userProps.data()?.token;

    leaders.forEach((leader) => {
      token && subscribeToTopic(token, leader);
    });
  }
});

exports.subscribe = functions.https.onCall(async (data) => {
  const { leader, userId, add } = data as SubscribeFuncProps;
  const userRef = admin
    .firestore()
    .collection("users")
    .doc(leader.userId)
    .withConverter(userConverter);

  const userProps = await userRef.get();
  const token = userProps.data()?.token;

  if (add) {
    const subscribers = union(userProps.data()?.subscribers, [userId]);
    await userRef.set(
      {
        subscribers,
      },
      { merge: true }
    );

    if (token) {
      subscribeToTopic(token, userId);
    }
  } else {
    await userRef.set(
      {
        subscribers: pullAll(userProps.data()?.subscribers || [], [userId]),
      },
      { merge: true }
    );

    if (token) {
      unsubscribeToTopic(token, userId);
    }
  }
});

exports.onUpdateUser = functions.firestore
  .document("users/{id}")
  .onUpdate(async (snapshot) => {
    const before = snapshot.before.data() as UserProps;
    const after = snapshot.after.data() as UserProps;
    await addReward(snapshot.after.id, before, after);

    const [should, amount] = shouldHaveTransaction(before, after);
    if (!should || !amount) {
      return;
    }
    await addCpmTransaction(snapshot.after.id, amount);
  });

exports.onEnteringAddress = functions.firestore
  .document("users/{id}")
  .onUpdate(async (snapshot) => {
    const before = snapshot.before.data() as UserProps;
    const after = snapshot.after.data() as UserProps;
    const should = await shouldUpdateTransactions(before, after);
    if (!should) {
      return;
    }
    await onEnteringAddress(snapshot);
  });

exports.onCreateCpmTransaction = functions.firestore
  .document("cpm_transactions/{id}")
  .onCreate(async (snapshot) => {
    const transaction = snapshot.data() as CpmTransaction;

    await admin
      .firestore()
      .collection("settings")
      .doc("paxData")
      .set(
        {
          blocksGiven: admin.firestore.FieldValue.increment(transaction.blocks),
        } as unknown as PaxData,
        {
          merge: true,
        }
      );

    await createPaxTransaction(transaction);
  });

exports.onVote = functions.firestore
  .document("votes/{id}")
  .onCreate(async (snapshot) => {
    console.log("function called for firebase");

    await updateVotesTotal();
    const data = snapshot.data() as VoteResultProps;
    console.log("data =>", data);

    const voteTime = admin.firestore.Timestamp.now().toMillis();
    console.log("voteTime =>", voteTime);

    await updateVotesTotalForSingleCoin(data.coin);

    const vote = {
      ...snapshot.data(),
    } as unknown as VoteResultProps;

    console.log("vote =>", vote);

    await snapshot.ref.update(vote);
    //await sendToTokens(vote);

    await admin
      .firestore()
      .collection("users")
      .doc(vote.userId)
      .update({
        "voteStatistics.total": admin.firestore.FieldValue.increment(1),
      });

    await sendNotificationForFollwersFollowings(vote.userId, data.coin); // Send notification for follower & followings
  });




exports.assignReferrer = functions.https.onCall(async (data) => {
  try {
    const { parent, child } = data as { parent: string; child: string };
    const refer = new Refer(parent, child);
    await refer.assignReferral();
  } catch (e) {
    console.log(e);
  }
});

exports.updateLeadersCron = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async () => {
    try {
      await setLeaders();

    } catch (e) {
      console.log(e);
    }
  });


//----------Start Notifications scheduler-------------
exports.noActivityIn24Hours = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async () => {
    console.log("---Start noActivityIn24Hours -------");
    await checkInActivityOfVotesAndSendNotification();
    console.log("---End noActivityIn24Hours -------");
  });

exports.getCoinCurrentAndPastDataDifference = functions.pubsub
  .schedule("every 10 minutes")
  .onRun(async () => {
    console.log("---Start getCoinCurrentAndPastDataDifference -------");
    await getCoinCurrentAndPastDataDifference();
    console.log("---End getCoinCurrentAndPastDataDifference -------");
  })

exports.checkTitleUpgrade24Hour = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(
    async () => {
      console.log("---Start checkTitleUpgrade24Hour -------");
      const date = new Date();
      const nowTime = date.getTime();
      const yesterdayTime = nowTime - (24 * 60 * 60 * 1000)
      await checkUserStatusIn24hrs(nowTime, yesterdayTime)
      await getFollowersFollowingsAndVoteCoin(nowTime, yesterdayTime);
      console.log("---End checkTitleUpgrade24Hour -------");
    }
  );

// for Testing purposes
exports.checkTitleUpgradeNotification = functions.https.onCall(
  async (data) => {
    console.log("------- call set leader function -------");
    await setLeaders();
    console.log("set leader Done");
    const { todayTime, yesterdayTime } = data;
    // const date = new Date();
    // const nowTime = date.getTime();
    // const yesterdayTime = nowTime - (24 * 60 * 60 * 1000)
    await checkUserStatusIn24hrs(todayTime, yesterdayTime);
    await getFollowersFollowingsAndVoteCoin(todayTime, yesterdayTime);
  }
);

//----------End Notifications scheduler-------------

exports.getLeadersByCoin = functions.https.onCall(async (data) => {
  const { symbol } = data as { symbol: string };

  const votes = await admin
    .firestore()
    .collection("votes")
    .withConverter(voteConverter)
    .where("coin", "==", symbol)
    .get();

  const users = uniq(votes.docs.map((v) => v.data().userId)) as string[];

  return users.reduce(
    (arr, currentUser) => {
      const userVotes = votes.docs
        .filter((v) => v.data().userId === currentUser)
        .map((v) => v.data().success);
      const total = userVotes.length;
      const success = userVotes.filter((v) => v).length;
      return [
        ...arr,
        {
          pct: (100 * success) / total,
          user: currentUser,
        },
      ];
    },
    [] as {
      pct: number;
      user: string;
    }[]
  );
});

async function getRewardTransactions(id: string, pageSize: any, pageNumber: any) {

  const transactionsBaseQuery = await admin
    .firestore()
    .collection("reward_transactions")

  const transactions = await transactionsBaseQuery
    .where("user", "==", id)
    .offset((pageNumber - 1) * pageSize)
    .limit(pageSize)
  // .orderBy('transactionTime', 'desc')

  const transactionsForCount = await admin
    .firestore()
    .collection("reward_transactions")
    .where("user", "==", id);

  const rewardsTransactionTotalCount = (await transactionsForCount.get()).size;
  console.info("rewardsTransactionTotalCount", rewardsTransactionTotalCount)
  const tempTransactionData: any[] = [];
  const querySnapshot = await transactions.get();

  await querySnapshot.forEach((doc) => {
    tempTransactionData.push({ rewardId: doc.id, ...doc.data() })
  })

  console.info("tempTransactionData", tempTransactionData)

  const rewardTransactionData = tempTransactionData.slice()
    .sort((a: any, b: any) => b.transactionTime._seconds - a.transactionTime._seconds);

  console.info("rewardTransactionData", rewardTransactionData)

  return {
    totalCount: rewardsTransactionTotalCount, rewardsTransaction: rewardTransactionData
  };
}

exports.getRewardTransactions = functions.https.onCall(async (data) => {
  const { uid, pageSize, pageNumber } = data as { uid: string, pageSize: any, pageNumber: any };
  return await getRewardTransactions(uid, pageSize, pageNumber);
});

exports.claimReward = functions.https.onCall(async (data) => {
  const { uid } = data as { uid: string };
  const reward = await claimReward(uid);
  console.log("reward --->", reward);
  return reward;
});

exports.cardHolderListing = functions.https.onCall(async (data) => {
  const { cardId } = data as { cardId: string };
  const userList = await cardHolderListing(cardId);
  console.log("userList --->", userList);
  return userList;
});

exports.checkPendingTransactions = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async () => {
    try {
      await checkPendingTransactions();
    } catch (e) {
      console.log(e);
    }
  });

exports.onCreatePaxTransaction = functions.firestore
  .document("pax_transactions/{id}")
  .onCreate(async (snapshot) => {
    const transaction = snapshot.data() as PaxTransaction;
    const user = await admin
      .firestore()
      .collection("users")
      .withConverter(userConverter)
      .doc(transaction.user)
      .get();

    try {
      const batch = admin.firestore().batch();
      await updateProcessing(batch, snapshot, user.data());
      await batch.commit();
    } catch (e) {
      console.log(e);
    }
  });

// exports.fetchCoins = functions.pubsub.schedule("* * * * *").onRun(async () => {
//   [0, 60].forEach((i) => {
//     setTimeout(async () => await fetchCoins(), i * 1000);
//   });
// });

exports.getUpdatedDataFromWebsocket = functions.pubsub
  .schedule("every 2 minutes")
  .onRun(async () => {
    await getUpdatedDataFromWebsocket();
  });

exports.getUpdatedTrendAndDeleteOlderData = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    await getAllUpdated24HourRecords();
    await removeTheBefore24HoursData();
  });

exports.prepareEveryFiveMinuteCPVI = functions.pubsub
  .schedule("*/3 * * * *")
  .onRun(async () => {
    await Promise.all([await fetchAskBidCoin()]);
  });

exports.prepareHourlyCPVI = functions.pubsub
  .schedule("0 * * * *")
  .onRun(async () => {
    await prepareCPVI(1, "hourly");
  });

exports.prepare4HourlyCPVI = functions.pubsub
  .schedule("0 */4 * * *")
  .onRun(async () => {
    await prepareCPVI(4, "fourHourly");
  });

exports.prepare24HourlyCPVI = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async () => {
    await prepareCPVI(24, "daily");

  });

exports.prepareWeeklyCPVI = functions.pubsub
  .schedule("0 0 * * 0")
  .onRun(async () => {
    await prepareCPVI(24 * 7, "weekly");
  });

exports.getCPVIForVote = functions.https.onCall(async (data) => {
  // console.log("getCPVIForVote(data) =>", data);
  return await getCPVIForVote(data);
});




exports.getOldAndCurrentPriceAndMakeCalculation = functions.https.onCall(
  async (data) => {
    await getOldAndCurrentPriceAndMakeCalculation(data);
    // After Vote Updated For The User
    const getAfterUpdatedVoteRef = await admin.firestore().collection("votes").doc(data?.voteId);
    const getAfterUpdatedVoteInstance = await getAfterUpdatedVoteRef.get();
    console.info("getAfterUpdatedVoteInstance", getAfterUpdatedVoteInstance)
    const getAfterVoteUpdatedData = getAfterUpdatedVoteInstance.data();
    console.info("getAfterVoteUpdatedData", getAfterVoteUpdatedData);
    return {
      voteId: getAfterUpdatedVoteInstance.id, ...getAfterVoteUpdatedData
    };
  }
);


const checkValidUsername = async (username: string) => {
  console.log("firebasefun");
  const users = await admin
    .firestore()
    .collection("users")
    .withConverter(userConverter)
    .get();

  const usernames = users.docs.map((u) => u.data().displayName);
  console.log("firebase", usernames);
  return (
    !usernames.includes(username) &&
    username.length >= 8 &&
    username.length <= "unique_username".length
  );
};

exports.checkValidUsername = functions.https.onCall(async (data) => {
  return await checkValidUsername(data.username);
});

type GetVotesProps = { start: number; end: number; userId: string, isOpenVote: boolean };

const getVotes = async ({ start, end, userId, isOpenVote }: GetVotesProps) => {
  console.log("voteCoinApi called isOpenVote");
  console.log("start, end, userId, isOpenVote : ", start, end, userId, isOpenVote);


  const [votes, coins, pairs] = await Promise.all([
    admin
      .firestore()
      .collection("votes")
      .withConverter(voteConverter)
      .where("userId", "==", userId)
      .get(),
    getAllCoins(),
    getAllPairs(),
  ]);


  const allVotes = votes.docs
    .map((v) => {
      return { ...v.data(), id: v.id };
    })
    .sort((a, b) => Number(b.voteTime) - Number(a.voteTime))
    .reduce(
      (total, current) => {
        if (current.coin.split("-").length === 1) {
          if (coins.includes(current.coin)) {
            total.coins.push(current);
          }
        } else {
          if (pairs.includes(current.coin)) {
            total.pairs.push(current);
          }
        }

        return total;
      },
      { coins: [], pairs: [] } as {
        coins: VoteResultProps[];
        pairs: VoteResultProps[];
      }
    );
  console.log('allVotes : ', allVotes);

  if (isOpenVote) {

    let filterVotes: any = { coins: { votes: [], total: 0 }, pairs: { votes: [], total: 0 } };

    // for coins
    if (allVotes.coins.length) {
      let coinsVotes = allVotes.coins.filter((vote) => !vote.valueExpirationTime);
      filterVotes.coins.total = coinsVotes.length;
      console.log('getAllVotesData.coins.total is called : ', coinsVotes.length, coinsVotes);
      filterVotes.coins.votes = coinsVotes.slice(start, end)
      console.log("filterVotes.coins : ", filterVotes.coins);
    };

    // For pairs
    if (allVotes.pairs.length) {
      let pairsVotes = allVotes.pairs.filter((vote) => !vote.valueExpirationTime);
      filterVotes.pairs.total = pairsVotes.slice().length;
      console.log('getAllVotesData.pairs.total is called : ', pairsVotes.length, pairsVotes);
      filterVotes.pairs.votes = pairsVotes.slice(start, end)
      console.log("filterVotes.pairs : ", filterVotes.pairs);
    };
    console.log("final filterVotes : ", filterVotes);

    return JSON.stringify(filterVotes);

  } else {

    console.log('getAllVotesData called');
    const getAllVotesData = {
      coins: {
        votes: allVotes.coins.slice(start, end),
        total: allVotes.coins.length,
      },
      pairs: {
        votes: allVotes.pairs.slice(start, end),
        total: allVotes.pairs.length,
      },
    };

    return JSON.stringify(getAllVotesData);
  }
};

exports.getVotes = functions.https.onCall(async (data) => {
  const { start, end, userId, isOpenVote } = data as GetVotesProps;
  console.log("voteApiCalled");
  return await getVotes({ start, end, userId, isOpenVote });
});

exports.getLeaderUsers = functions.https.onCall(async (data, context) => {
  const userId = context.auth?.uid || "";
  return await getLeaderUsers(userId);
});

exports.getLeaderUsersByIds = functions.https.onCall(async (data) => {
  const userIds = data.userIds;
  return await getLeaderUsersByIds(userIds);
});

exports.sendEmail = functions.https.onCall(async () => {
  console.log("email>>>>>>>>");
  sgMail.setApiKey(env.sendgrid_api_key);
  const msg = {
    to: "panchalrutul31@gmail.com",
    from: "akashpatel.inheritx@gmail.com",
    templateId: "d-25bccb1358b5403ea171becb708f334f",
    dynamic_template_data: {
      subject: "Testing Templates",
      name: "Some One",
    },
  };
  await sgMail.send(msg);
});


