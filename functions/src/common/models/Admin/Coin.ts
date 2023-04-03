import { firestore } from "firebase-admin";
import { v4 as uuidv4 } from "uuid";

// temp
import { getAllCoins as getAllCoin } from "../Coin";
import { getPriceOnParticularTime } from "../Rate";

type Coin = {
  coinId: any;
  coinName: string;
  symbol: any;
  coinLogo: any;
  status: string;
};

export const addCoin = async (req: any, res: any) => {
  const { coinName, symbol, coinLogo, status } = req.body;
  try {
    const id = uuidv4();
    const coin: Coin = { coinId: id, coinName, symbol, coinLogo, status };
    const coinRef = await firestore().collection("settings").doc("coins").get();
    let coinData: any = coinRef.data();
    let checkCoin = coinData.coins.find((coin: any) => {
      return coin.coinName == coinName;
    });
    if (checkCoin) {
      return res.status(409).send({
        status: false,
        message: "Already exist.",
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
      message: "New Coin Added.",
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
  const { coinId } = req.params;
  const { status } = req.body;
  try {
    const coinRef = await firestore().collection("settings").doc("coins").get();
    let coinData: any = coinRef.data();
    let getCoin = coinData.coins.find((coin: any) => {
      return coin.coinId == coinId;
    });
    if (!getCoin) {
      return res.status(404).send({
        status: false,
        message: "Coin not found",
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
      message: "Status update.",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("updateStatusOfCoin", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
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
    errorLogging("updateStatusOfCoin", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

export const getCoinById = async (req: any, res: any) => {
  const { coinId } = req.params;
  console.log("coinId ,,,,,,,,", coinId);
  try {
    const coinRef = await firestore().collection("settings").doc("coins").get();
    let coinData: any = coinRef.data();
    let getCoin = coinData.coins.find((coin: any) => {
      return coin.coinId == coinId;
    });
    if (!getCoin) {
      return res.status(404).send({
        status: false,
        message: "Coin not found",
        result: null,
      });
    }
    res.status(200).send({
      status: true,
      message: "Status update.",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("updateStatusOfCoin", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

export const getCoinData = async (req: any, res: any) => {
  const getCoins = await getAllCoin();
  var currentCoinAndPrise: any = [];
  const currentTime = Date.now();
  const beforeFourHoursTime = currentTime - 4 * 3600000;

  getCoins.forEach(async (data) => {
    const coin = data.toLowerCase() + "usdt";
    const priseCurrent = await getPriceOnParticularTime(coin, currentTime);
    const priseFourBefore = await getPriceOnParticularTime(
      coin,
      beforeFourHoursTime
    );
    console.log("priseCurrent >>>>", coin, priseCurrent, priseFourBefore);
    const differncePrise = priseFourBefore - priseCurrent;
    const differnceInPercentag = (differncePrise / beforeFourHoursTime) * 100;

    currentCoinAndPrise.push({ coinName: data, differnceInPercentag });
    console.log("Array >>>>", currentCoinAndPrise);
  });
  const arr: any = [];
  currentCoinAndPrise.forEach((coin: any) => {
    if (coin.differnceInPercentag < -5) {
      arr.push(`${coin.coinName} Gone Down`);
    }
    if (coin.differnceInPercentag > 5) {
      arr.push(`${coin.coinName} Gone Up`);
    }
  });

  // console.log("differnce --->",differnceInPercentag,differncePrise);
  // console.log("prise current--->", currentTime, priseCurrent);
  // console.log("prise 4hourBefore--->", beforeFourHoursTime, priseFourBefore);
  res.send(arr);
};

export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.info(funcName, type, error);
};
