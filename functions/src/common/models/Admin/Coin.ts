import { firestore } from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import { getAllCoins as getAllCoin } from "../Coin";
import axios from "axios";
// import { getPriceOnParticularTime } from "../Rate";

import {
  getDataFromTimestampBaseURL,
  defaultHeaderForgetDataFromTimestamp,
} from "../../consts/config";
import { sendNotification } from "../Notification";
import { messaging } from "firebase-admin";

type Coin = {
  id: any;
  coinName: string;
  symbol: any;
  coinLogo: any;
  status: string;
  voteBarRange: any
};

export const addCoin = async (req: any, res: any) => {
  const { coinName, symbol, coinLogo, voteBarRange, status } = req.body;
  try {
    const id = uuidv4();
    const coin: Coin = { id, coinName, symbol, coinLogo, voteBarRange, status };
    const coinRef = await firestore().collection("settings").doc("coins").get();
    let coinData: any = coinRef.data();
    let checkCoin = coinData.coins.find((coin: any) => {
      return coin.coinName == coinName;
    });
    if (checkCoin) {
      return res.status(409).send({
        status: false,
        message: `${coinName} coin is already exist`,
        result: null,
      });
    }

    coinData?.coins.push(coin);

    await firestore()
      .collection("settings")
      .doc("coins")
      .set(coinData, { merge: true });

    let getCoin = coinData.coins.find((coin: any) => {
      return coin.coinId == id;
    });
    res.status(200).send({
      status: true,
      message: "New coin successfully added",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("addCoin", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

export const updateStatusOfCoin = async (req: any, res: any) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const coinRef = await firestore().collection("settings").doc("coins").get();
    let coinData: any = coinRef.data();
    let getCoin = coinData.coins.find((coin: any) => {
      return coin.id == id;
    });
    if (!getCoin) {
      return res.status(404).send({
        status: false,
        message: `Coin not found: ${id}`,
        result: null,
      });
    }
    getCoin.status = status;

    await firestore()
      .collection("settings")
      .doc("coins")
      .set(coinData, { merge: true });

    res.status(200).send({
      status: true,
      message: "Coin status is successfully update",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("updateStatusOfCoin", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in updateStatusOfCoin",
      result: error,
    });
  }
};

export const updateVoteBarRangeOfCoin = async (req: any, res: any) => {
  const { id } = req.params;
  const { voteBarRange } = req.body;
  try {
    const coinRef = await firestore().collection("settings").doc("coins").get();
    let coinData: any = coinRef.data();
    let getCoin = coinData.coins.find((coin: any) => {
      return coin.id == id;
    });
    if (!getCoin) {
      return res.status(404).send({
        status: false,
        message: `${id} is not found`,
        result: null,
      });
    }
    getCoin.voteBarRange = voteBarRange;

    await firestore()
      .collection("settings")
      .doc("coins")
      .set(getCoin, { merge: true });

    res.status(200).send({
      status: true,
      message: "Coin voteBarRange is successfully update",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("updateVoteBarRangeOfCoin", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in updateVoteBarRangeOfCoin",
      result: error,
    });
  }
};

export const getAllCoins = async (req: any, res: any) => {
  try {
    const coinRef = await firestore().collection("settings").doc("coins").get();
    let coinData: any = coinRef.data();
    res.status(200).send({
      status: true,
      message: "Status update.",
      result: coinData,
    });
  } catch (error) {
    errorLogging("getAllCoins", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

export const getCoinById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    console.log("id -------", id)
    const getCoinsQuery = await firestore().collection("settings").doc("coins").get();
    let getCoinsData: any = getCoinsQuery.data();
    let getCoin = getCoinsData.coins.find((coin: any) => {
      return coin.id == id;
    });
    if (!getCoin) {
      return res.status(404).send({
        status: false,
        message: `Coin not found: ${id}`,
        result: null,
      });
    }
    res.status(200).send({
      status: true,
      message: "Get coin successfully.",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("getCoinById", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};


export const updateCoin = async (req: any, res: any) => {
  const { id } = req.params;
  const { coinName, symbol, coinLogo, voteBarRange, status } = req.body;
  try {
    const updateCoinData = {
      id,
      coinName,
      symbol,
      coinLogo,
      voteBarRange,
      status
    }
    const getAllDataQuery = await firestore()
      .collection("settings")
      .doc("coins")
      .get();

    const getAllCoinsData: any = getAllDataQuery.data();
    const getCoin: any = getAllCoinsData.coins.find((coin: any) => {
      return coin.id == id
    })
    if (!getCoin) return res.status(404).send({
      status: true,
      message: "Coin not found : " + id,
      result: null,
    });
    getCoin.coins = updateCoinData

    await firestore()
      .collection("settings")
      .doc("coins")
      .set(getCoin, { merge: true });
    // await firestore()
    //   .collection("settings")
    //   .doc("coins")
    //   .update("coins", firestore.FieldValue.arrayUnion(updateCoinData));

    res.status(200).send({
      status: true,
      message: "Coin update successfully",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("updateCoin", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in updateStatusOfCoin",
      result: error,
    });
  }
};


//Notification
const getPriceOnpaticularTime = async (coin: any, timestamp: any) => {
  try {
    const getCoinPrice = await axios.get(
      getDataFromTimestampBaseURL(coin, timestamp),
      defaultHeaderForgetDataFromTimestamp
    );

    // console.info("getCoinPrice", getCoinPrice.data);
    return getCoinPrice.data &&
      getCoinPrice.data[0] &&
      getCoinPrice.data[0].price
      ? getCoinPrice?.data[0]?.price
      : 0;
  } catch (err) {
    console.log("Error(getPriceOnpaticularTime): ", err);
    return 0;
  }
};


const getAllUsersAndSendNotification = async (
  coinName: string,
  body: string
) => {
  const getAllUsers: any = [];
  const getAllUsersRef = await firestore().collection("users").get();
  getAllUsersRef.forEach((data) => {
    getAllUsers.push({ id: data.id, ...data.data() });
  });
  const title = `🚨 ${coinName} coin  price ALERT! ⚠️`;
  for (var i = 0; i <= getAllUsers.length; i++) {
    const token = getAllUsers[i].token;
    if (!token) {
      console.log("token not found.");
      continue;
    }

    const message: messaging.Message = {
      token,
      notification: {
        title,
        body,
      },
      webpush: {
        headers: {
          Urgency: "high",
        },
        fcmOptions: {
          link: "#", // TODO: put link for deep linking
        },
      },
    };
    await sendNotification({
      token,
      message,
      body,
      title,
      id: getAllUsers[i].id,
    });
  }
};

export const getCoinCurrentAndPastDataDifference = async () => {
  try {
    const getCoins = await getAllCoin();
    const currentTime = Date.now();
    const beforeFourHoursTime = currentTime - 4 * 3600000;

    const currentCoinAndPrice: any = [];

    for (const data of getCoins) {
      const coin = data.toUpperCase() + "USDT";
      const priceCurrent = await getPriceOnpaticularTime(coin, currentTime);
      const priceFourBefore = await getPriceOnpaticularTime(
        coin,
        beforeFourHoursTime
      );
      if (priceCurrent !== 0 && priceFourBefore !== 0) {
        const differencePrice = priceFourBefore - priceCurrent;
        const differnceInPercentag =
          (differencePrice / beforeFourHoursTime) * 100;

        currentCoinAndPrice.push({ coinName: data, differnceInPercentag });
      }
    }

    currentCoinAndPrice.forEach(async (coin: any) => {
      if (coin.differnceInPercentag < -5) {
        // Write Notification
        await getAllUsersAndSendNotification(
          coin.coinName,
          `Coin ${coin.coinName}  value drop! Make your vote now! ⏬`
        );
        console.log("sent notification on down");
      }
      if (coin.differnceInPercentag > 5) {
        // Write Notification
        await getAllUsersAndSendNotification(
          coin.coinName,
          `Coin ${coin.coinName}  is on fire! Make your vote now! ⏫`
        );
        console.log("sent notification on up");
      }
    });
  } catch (err) {
    console.log("Error (getCoinCurrentAndPastDataDiffernce): ", err);
  }
};

export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.info(funcName, type, error);
};
