import { firestore } from "firebase-admin";
import { Timestamp } from 'firebase-admin/firestore';
import axios from "axios";

//import fetch from "node-fetch";
import { log } from "firebase-functions/logger";
import env from "../../env/env.json";
import {
  isParentExistAndGetReferalAmount,
  callSmartContractPaymentFunction,
} from "./PaymentCalculation";
import * as parentConst from "../consts/payment.const.json";
import { getAllPendingPaxByUserId } from "./PAX";
import { errorLogging } from "../helpers/commonFunction.helper";
import { sendEmailForAfterUpgradeOnImmediate } from "../models/Notification";


export const callbackFromServer = async (req: any, res: any) => {
  try {
    console.info("req.body", typeof req.body, req.body);

    const getResponseOfRateLimit = await getCheckAndUpdateRateLimitOfIntent(req.body.order.intentId)
    console.log("getResponseOfRateLimit--->", getResponseOfRateLimit)

    if (getResponseOfRateLimit.status) {
      if (req.body.order && req.body.order.id) {
        const getResponseFromOrderId = await getStatusFromOrderStatusAPI(req.body.order.id);
        console.log("getResponseFromOrderId--->", getResponseFromOrderId);
        if (getResponseFromOrderId.status && (getResponseFromOrderId.data.status === parentConst.CREDIT_CARD_EVENT_BLOCKCHAIN_SUBMISSION || getResponseFromOrderId.data.status === parentConst.CREDITCARD_PAYMENT_EVENT_COMPLETED)) {
          const getTempPaymentTransaction = await firestore().collection("tempPaymentTransaction")
            .where("intentId", "==", req.body.order.intentId)
            .where("isProceedForParentTransaction", "==", false)
            .get();

          const getTempAcmeData = getTempPaymentTransaction.docs.map((tempPaymentTransaction: any) => {
            return { ...tempPaymentTransaction.data(), id: tempPaymentTransaction.id };
          });

          if (getTempAcmeData && getTempAcmeData.length) {
            const getTempTransactionData = getTempAcmeData.length ? getTempAcmeData[getTempAcmeData.length - 1] : null;

            if (getTempTransactionData) {

              const getResponseAfterParentPayment: any = await isParentExistAndGetReferalAmount(
                { userId: getTempTransactionData.userId, amount: getTempTransactionData.amount, transactionType: getTempTransactionData.transactionType, numberOfVotes: getTempTransactionData.numberOfVotes, token: getTempTransactionData.token, origincurrency: getTempTransactionData.origincurrency, paymentDetails: req.body.order, walletType: getTempTransactionData.walletType }
              );
              console.info("getResponseAfterParentPayment--->", getResponseAfterParentPayment)
              await getTempTransactionByIdUpdateAndDeleteFromParentPayment(getTempAcmeData[getTempAcmeData.length - 1].id, getResponseFromOrderId.data.status)
              console.log("Get Temp getTempTransactionData--->", getTempTransactionData.id);
            }
          } else {
            await firestore()
              .collection("callbackHistory").add({ data: { ...getResponseFromOrderId.data }, intentId: req.body.order.intentId, event: req.body.order.status, walletType: "ACME_PAYMENT_MODE", timestamp: Timestamp.now() });
            console.log("Already given to parent", getResponseFromOrderId.data.id);
          }
        }

        console.log("getResponseFromOrderId.data--->", getResponseFromOrderId.data)

        if (getResponseFromOrderId.status && (getResponseFromOrderId.data.status === parentConst.CREDITCARD_PAYMENT_EVENT_FIAT_PROVIDER || getResponseFromOrderId.data.status === parentConst.CREDITCARD_PAYMENT_EVENT_COMPLETED)) {
          const getTempPaymentTransaction = await firestore().collection("tempPaymentTransaction")
            .where("intentId", "==", req.body.order.intentId)
            .where("isProceedForActualTransaction", "==", false)
            .get();

          const getTempAcmeData = getTempPaymentTransaction.docs.map((tempPaymentTransaction: any) => {
            return { ...tempPaymentTransaction.data(), id: tempPaymentTransaction.id };
          });

          if (getTempAcmeData && getTempAcmeData.length) {

            await firestore()
              .collection("callbackHistory").add({ data: { ...getResponseFromOrderId.data }, intentId: req.body.order.intentId, event: req.body.order.status, walletType: "ACME_PAYMENT_MODE", timestamp: Timestamp.now() });

            console.info("getTempAcmeRecords", getTempAcmeData[getTempAcmeData.length - 1]);

            let requestBody: any;
            if (getTempAcmeData && getTempAcmeData.length && getTempAcmeData[getTempAcmeData.length - 1]) {
              let userId = getTempAcmeData[getTempAcmeData.length - 1].userId;
              requestBody = { userId, intentId: req.body.order.intentId, calculatedAmount: getResponseFromOrderId.data.tokenAmountInDecimals, initiatedTransactionDetails: getTempAcmeData[getTempAcmeData.length - 1], walletType: "ACME_PAYMENT_MODE", transactionType: getTempAcmeData[getTempAcmeData.length - 1].transactionType, numberOfVotes: getTempAcmeData[getTempAcmeData.length - 1].numberOfVotes, initiated: "BE" };
            } else {
              try {
                await firestore()
                  .collection("callbackHistory").add({
                    data: req.body.order,
                    event: req.body.order.status,
                    walletType: parentConst.WALLET_TYPE_ACME_PAYMENT_MODE,
                    timestamp: Timestamp.now(),
                    additionalExecutionType: parentConst.ACME_ADDITIONAL_EXECUTION_TYPE_EXTRA_INVOCATION
                  });
                console.log("Document added successfully in callback!");
              } catch (error) {
                console.error("Error while adding document on extra invocation:", error);
              }

              return res.status(200).send({
                status: true,
                message: `Intent Id is invalid or already transaction completed: ${req.body.order.intentId}`,
                data: {
                  intentId: req.body.order.intentId
                },
              });
            }

            console.log("Request Body Before", requestBody);

            const getResponseFromAcmeCreditCard = await paymentStatusOnUserFromCreditCardFunction(requestBody);
            console.log("getResponseFromAcmeCreditCard", getResponseFromAcmeCreditCard, "For Delete", getTempAcmeData[getTempAcmeData.length - 1].id);

            if (getResponseFromAcmeCreditCard.status) {
              await getTempTransactionByIdUpdateAndDeleteFromTransaction(getTempAcmeData[getTempAcmeData.length - 1].id, getResponseFromOrderId.data.status)
            }
            res.status(200).send({
              status: true,
              message: "Transaction logged in DB on transaction details",
              data: [],
            });
          } else {
            await firestore()
              .collection("callbackHistory").add({ data: { ...getResponseFromOrderId.data }, intentId: req.body.order.intentId, event: req.body.order.status, walletType: "ACME_PAYMENT_MODE", timestamp: Timestamp.now() });
            console.log("Already Actual Transaction Done");
          }
        } else {
          await firestore()
            .collection("callbackHistory").add({ ...req.body.order, event: req.body.order.status, walletType: "ACME_PAYMENT_MODE", data: { ...getResponseFromOrderId.data }, timestamp: Timestamp.now() });
          res.status(200).send({
            status: true,
            message: "Transaction logged in DB on transaction details",
            data: [],
          });
        }
      } else {
        console.log("No Order Id Found From Acme", req.body);
      }
    } else {
      console.log("Your rate limit is exhaust for this intent Id:", req.body.order.intentId);
      res.status(200).send({
        status: false,
        message: `Your rate limit is exhaust for ${req.body.order.intentId}`,
        data: [],
      });
    }
  } catch (error: any) {
    console.log("Error while call callback URL payment to Acme app server", error);
  }
};

export const getCheckAndUpdateRateLimitOfIntent = async (intentId: any) => {
  const getTempPaymentTransaction = await firestore().collection("tempPaymentTransaction")
    .where("intentId", "==", intentId)
    .get();

  const getTempAcmeData = getTempPaymentTransaction.docs.map((tempPaymentTransaction) => {
    return { id: tempPaymentTransaction.id, ...tempPaymentTransaction.data() };
  });
  const lastTransaction: any = getTempAcmeData[getTempAcmeData.length - 1];
  const currentRateLimit = lastTransaction.rateLimit;
  if (currentRateLimit > 0) {
    const updateRateLimit = currentRateLimit - 1;

    await firestore().collection("tempPaymentTransaction").doc(lastTransaction.id).update({
      rateLimit: updateRateLimit
    });

    console.log("Rate limit decremented successfully...");

    return {
      status: true,
      message: "Rate limit decremented successfully",
      data: []
    }
  } else {
    console.log("Rate limit is already zero.");
    return {
      status: false,
      message: "Rate limit is already zero",
      data: []
    }
  }

}


export const getTempTransactionByIdUpdateAndDeleteFromTransaction = async (tempTransactionId: any, webhookEvent: any) => {
  if (webhookEvent === parentConst.CREDITCARD_PAYMENT_EVENT_FIAT_PROVIDER || webhookEvent === parentConst.CREDITCARD_PAYMENT_EVENT_COMPLETED) {
    await firestore().collection('tempPaymentTransaction').doc(tempTransactionId).update({
      isProceedForActualTransaction: true
    }).then(() => {
      console.log("Temp Actual Payment Transaction Updated Successfully", tempTransactionId);
    }).catch((error: any) => {
      console.log("Error while delete from tempPaymentTransaction", error);
    });
  }
  const getTempTransactionDetails: any = (await firestore().collection('tempPaymentTransaction').doc(tempTransactionId).get()).data();
  if (getTempTransactionDetails.isProceedForActualTransaction && getTempTransactionDetails.isProceedForParentTransaction) {
    await firestore().collection('tempPaymentTransaction').doc(tempTransactionId).delete().then(() => {
      console.log("Temp Payment Transaction Deletion Start Begins", tempTransactionId);
    }).catch((error: any) => {
      console.log("Error while delete from tempPaymentTransaction", error);
    });
  }
}

export const getTempTransactionByIdUpdateAndDeleteFromParentPayment = async (tempTransactionId: any, webhookEvent: any) => {
  if (webhookEvent === parentConst.CREDIT_CARD_EVENT_BLOCKCHAIN_SUBMISSION || webhookEvent === parentConst.CREDITCARD_PAYMENT_EVENT_COMPLETED) {
    await firestore().collection('tempPaymentTransaction').doc(tempTransactionId).update({
      isProceedForParentTransaction: true
    }).then(() => {
      console.log("Temp Payment Transaction Updated Successfully", tempTransactionId);
    }).catch((error: any) => {
      console.log("Error while delete from tempPaymentTransaction", error);
    });
  }
  const getTempTransactionDetails: any = (await firestore().collection('tempPaymentTransaction').doc(tempTransactionId).get()).data();
  if (getTempTransactionDetails.isProceedForActualTransaction && getTempTransactionDetails.isProceedForParentTransaction) {
    await firestore().collection('tempPaymentTransaction').doc(tempTransactionId).delete().then(() => {
      console.log("Temp Parent Payment Transaction Deletion Start Begins", tempTransactionId);
    }).catch((error: any) => {
      console.log("Error while delete from tempPaymentTransaction", error);
    });
  }
}


export const getStatusFromOrderStatusAPI = async (orderId: any) => {
  try {
    const url = parentConst.PAYMENT_GET_ORDER_URL_PROD;
    const apiKey = parentConst.PAYMENT_WEBHOOK_API_KEY;

    const getResponseFromIntentRequest = await axios.get(`${url}?id=${orderId}`, {
      headers: {
        'X-API-KEY': apiKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (getResponseFromIntentRequest.status === 200) {
      if (getResponseFromIntentRequest && getResponseFromIntentRequest.data && getResponseFromIntentRequest.data.data && getResponseFromIntentRequest.data.data) {
        return {
          status: true,
          message: "Status fetched successfully",
          data: getResponseFromIntentRequest.data.data
        }
      } else {
        return {
          status: false,
          message: "Data status not found in success response",
          data: {}
        }
      }
    } else {
      return {
        status: false,
        message: "Error while fetch order status",
        data: {}
      }
    }
  } catch (error: any) {
    return {
      status: false,
      message: "Error while fetch the response from order API",
      data: error
    }
  }
}

export const clearAllGarbageCallbackHistory = async () => {
  try {
    const currentTime = Timestamp.now();
    const oneHoursAgo = new Date(currentTime.toMillis() - 6 * 60 * 60 * 1000);

    const callbackRef = await firestore().collection('callbackHistory');
    const queryOfCallback = callbackRef
      .where('timestamp', '<=', oneHoursAgo);

    const callbackBatch = firestore().batch();
    await queryOfCallback.get()
      .then(async (callbackSnapshot: any) => {
        if (callbackSnapshot.empty) {
          console.log('No callback created in the last 6 hour from ACME.');
          return;
        }
        callbackSnapshot.forEach(async (callbackAcmeDoc: any) => {
          console.log("callbackAcmeDoc-->", callbackAcmeDoc.id)
          const docRef = firestore().collection('callbackHistory').doc(callbackAcmeDoc.id);
          callbackBatch.delete(docRef);
        })
      })
    await callbackBatch.commit();
    console.log("Batch delete operation successful");
  } catch (error: any) {
    console.error("Error while delete the document from callback: ", error);
  }

}

export const updateAllPendingTransactionByUsingOrderAPI = async () => {
  try {
    const callbackRef = await firestore().collection('payments');
    const currentTime = Timestamp.now();
    const currentTimeStamp = new Date(currentTime.toMillis());
    const queryOfCallback = callbackRef
      .where("timestamp", "<", currentTimeStamp)
      .where("event", "in", ["BlockchainTransactionSubmission", "ProcessingFiatProviderOrder"]);

    const callbackSnapshot = await queryOfCallback.get();

    if (callbackSnapshot.empty) {
      console.log('No payment transaction with ProcessingFiatProviderOrder and BlockchainTransactionSubmission status created in the last 1 hour from ACME.');
      return;
    }

    callbackSnapshot.forEach(async (callbackAcmeDoc: any) => {
      console.log("callbackAcmeDoc-->", callbackAcmeDoc.id, "Data", callbackAcmeDoc.data());
      let getTransactionData = callbackAcmeDoc.data();
      const getResponseFromOrderId = await getStatusFromOrderStatusAPI(getTransactionData.data.id);

      console.info("getResponseFromOrderId--->", getResponseFromOrderId);
      if (getResponseFromOrderId.status && getResponseFromOrderId.data && getResponseFromOrderId.data.status === "Completed") {
        const paymentDocRef = firestore().collection('payments').doc(callbackAcmeDoc.id);
        getTransactionData.data = getResponseFromOrderId.data;

        //Remove old one doc from payments
        delete getResponseFromOrderId.data.hash;
        delete getResponseFromOrderId.data.orderId;
        delete getResponseFromOrderId.data.event;

        let getPaymentDetails = { ...getResponseFromOrderId.data, hash: getResponseFromOrderId.data.blockchainTransactionHash, orderId: `ACME-${getTransactionData.userId.slice(0, 4)}-${getResponseFromOrderId.data.blockchainTransactionHash.slice(0, 4)}` }
        // Update the document
        await paymentDocRef.update({ event: getResponseFromOrderId.data.status, data: getResponseFromOrderId.data, paymentDetails: getPaymentDetails });
      }
    })
  } catch (error) {
    console.error("Error while deleting the document from callback: ", error);
  }
}


export const updateUserAfterPayment = async (req: any, res: any) => {
  console.info("get request body", req.body);
  const {
    userId,
    walletType,
    userEmail,
    amount,
    network,
    origincurrency,
    token,
    event,
    transactionType,
    numberOfVotes,
    paymentDetails,
    dollarAmount
  } = req.body;
  await storeInDBOfPayment({
    userId,
    userEmail,
    walletType,
    amount,
    network,
    origincurrency,
    token,
    event,
    transactionType,
    numberOfVotes,
    paymentDetails,
    dollarAmount: dollarAmount || 0
  });

  await updateExtraVotePurchasedValue(userId)

  console.log("start parent payment");

  const getResponseAfterParentPayment = await isParentExistAndGetReferalAmount(
    req.body
  );
  console.info("getResponseAfterParentPayment", getResponseAfterParentPayment)

  // const getResponseAfterParentPayment = {};
  console.info("getResponseAfterParentPayment", getResponseAfterParentPayment);
  res.status(200).send({
    status: true,
    message: parentConst.MESSAGE_REFERAL_PAYMENT_INIT_SUCCESS,
    data: req.body,
  });
};

export const updateExtraVotePurchasedValue = async (userId: string) => {
  const paymentSnapshot = await firestore().collection("payments")
    .where("userId", "==", userId)
    .get();

  if (!paymentSnapshot.empty) {
    paymentSnapshot.forEach(async (doc) => {
      const paymentData = doc.data();

      // Check if the transactionType is either "EXTRAVOTES" or "UPGRADE"
      // const extraVotePurchased = ;

      // If extraVotePurchased is true, update extraVotePurchased in the userStatistics collection
      if (paymentData.transactionType === "EXTRAVOTES" || paymentData.transactionType === "UPGRADE") {
        await firestore().collection("userStatistics").doc(userId).set(
          { extraVotePurchased: true },
          { merge: true }
        );
      }
    });
  } else {
    console.log("No payment documents found for user:", userId);
  }
};



export const storeInDBOfPayment = async (metaData: any) => {
  try {
    console.info("STORE in DB", metaData)
    if (
      metaData.transactionType === parentConst.TRANSACTION_TYPE_UPGRADE &&
      metaData?.userId && (metaData.event === parentConst.PAYMENT_STATUS_APPROVED || metaData.event === parentConst.PAYMENT_STATUS_CONFIRMED)
    ) {
      console.info("For Account Upgrade", metaData.userId);
      await addIsUpgradedValue(metaData.userId);
    }
    if (metaData.transactionType === parentConst.TRANSACTION_TYPE_EXTRA_VOTES &&
      metaData?.userId && (metaData.event === parentConst.PAYMENT_STATUS_APPROVED || metaData.event === parentConst.PAYMENT_STATUS_CONFIRMED)) {
      console.info("For Vote Purchase", metaData);
      await addIsExtraVotePurchase(metaData);
    }

    console.info("Time", Timestamp.now())
    await firestore()
      .collection("payments")
      .add({ ...metaData, timestamp: Timestamp.now() });

  } catch (error) {
    console.log("Error While Store In DB", error)
  }
};

export const addIsExtraVotePurchase = async (metaData: any) => {
  const userDocumentRef = firestore().collection("users").doc(metaData.userId);
  userDocumentRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data: any = doc.data();
        console.info("data", data);
        const originalValue: number =
          data?.rewardStatistics && data?.rewardStatistics?.extraVote
            ? parseFloat(data?.rewardStatistics?.extraVote)
            : 0;
        const modifiedValue: number =
          originalValue + parseFloat(metaData.numberOfVotes);
        console.log(
          "originalValue,modifiedValue : ",
          originalValue,
          modifiedValue
        );
        data.rewardStatistics.extraVote = modifiedValue;
        userDocumentRef.set(data);
      } else {
        errorLogging(
          "isUserExtraVote",
          "ERROR",
          "Something went wrong while add the extra votes"
        );
      }
    })
    .catch((error) => {
      errorLogging("isUserExtraVote", "ERROR", error);
    });
};

export const addIsUpgradedValue = async (userId: string) => {
  const getUserDetails: any = (
    await firestore().collection("users").doc(userId).get()
  ).data();


  await sendEmailForAfterUpgradeOnImmediate(getUserDetails);

  const rewardStatistics: any = getUserDetails.rewardStatistics;
  rewardStatistics.extraVote =
    parentConst.UPGRADE_USER_VOTE + rewardStatistics.extraVote;
  rewardStatistics.diamonds =
    parentConst.UPGRADE_USER_COIN + rewardStatistics.diamonds;

  console.info("For Is Upgraded", rewardStatistics)

  await firestore()
    .collection("users")
    .doc(userId)
    .set({ isUserUpgraded: true, rewardStatistics }, { merge: true });

  // Update accountUpgrade in the userStatistics collection
  await firestore().collection("userStatistics").doc(userId).set(
    { accountUpgrade: true },
    { merge: true }
  );


  const rewardData = {
    winData: {
      firstRewardCardType: "",
      firstRewardCardId: "",
      firstRewardCard: "",
      firstRewardCardCollection: "",
      firstRewardCardSerialNo: "",
      firstRewardCardImageUrl: "",
      firstRewardCardVideoUrl: "",
      secondRewardExtraVotes: parentConst.UPGRADE_USER_VOTE,
      thirdRewardDiamonds: parentConst.UPGRADE_USER_COIN,
    },
    transactionTime: firestore.Timestamp.now(),
    user: userId,
    winningTime: rewardStatistics.claimed,
    isUserUpgraded: true
  }
  console.log("rewardData : ", rewardData);
  const addReward = await firestore().collection('reward_transactions').add(rewardData);
  if (!addReward.id) {
    console.log("rewardData is not added")
  }
};

//get user payment information by userId
export const isUserUpgraded = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const getTransactionQuery = await firestore()
      .collection("payments")
      .where("userId", "==", userId)
      .get();
    const getPaymentData = getTransactionQuery.docs.map((payment) => {
      return payment.data();
    });

    if (!getPaymentData.length) {
      return res.status(404).send({
        status: false,
        message: "Payment not found",
        data: [],
      });
    }

    res.status(200).send({
      status: true,
      message: parentConst.MESSAGE_GET_PAYMENT,
      data: getPaymentData,
    });
  } catch (error) {
    errorLogging("isUserUpgraded", "ERROR", error);
    res.status(500).send({
      status: false,
      message: parentConst.MESSAGE_SOMETHINGS_WRONG,
      result: error,
    });
  }
};

export const getParentPayment = async (req: any, res: any) => {
  try {
    const getAllPaymentArray: any = [];
    const { userId } = req.params;
    const { status, pageNumber, pageSize } = req.query;
    const getQuery = firestore()
      .collection("parentPayment")
      .where("parentUserId", "==", userId);

    const getParentPaymentQuery: any = !status
      ? await getQuery.get()
      : await getQuery.where("status", "in", [status, "CLAIMED"]).get();
    // const getParentPaymentQuery: any = !status
    //   ? await getQuery.get()
    //   : await getQuery.where("status", "==", status).get();
    getParentPaymentQuery.docs.forEach((snapshot: any) => {
      let payment = snapshot.data();
      let id = snapshot?.id;
      console.log(
        "payment: ",
        payment,
        "Parent Payment",
        payment.parentPendingPaymentId,
        "TypeOf",
        typeof payment.parentPendingPaymentId
      );
      if (payment.parentPendingPaymentId === null) {
        getAllPaymentArray.push({ ...payment, docId: id, childPayment: [] });
      }
    });
    getParentPaymentQuery.docs.forEach((snapshot: any) => {
      let payment = snapshot.data();
      let id = snapshot?.id;
      console.log("payment: ", payment);
      const getParentPaymentIndex = getAllPaymentArray.findIndex(
        (item: any) => item.docId === payment.parentPendingPaymentId
      );
      //console.info("getAllPaymentArray", getAllPaymentArray[getParentPaymentIndex], getAllPaymentArray[getParentPaymentIndex].childPayment)
      console.info("getParentPaymentIndex", getParentPaymentIndex);
      if (
        getAllPaymentArray[getParentPaymentIndex] &&
        getAllPaymentArray[getParentPaymentIndex].childPayment
      ) {
        getAllPaymentArray[getParentPaymentIndex].childPayment.push({
          ...payment,
          docId: id,
        });
      }
    });

    console.log("getAllPaymentArray:::", getAllPaymentArray);

    const paymentsSorting = getAllPaymentArray.sort(
      (a: any, b: any) => b.timestamp - a.timestamp
    );
    console.log("paymentsSorting", paymentsSorting);

    const startIndex: number = (pageNumber - 1) * pageSize;
    const endIndex: number = startIndex + parseInt(pageSize);
    console.info(
      "paymentsSorting",
      paymentsSorting.length,
      "startIndex",
      startIndex,
      "endIndex",
      endIndex
    );
    const paymentPagination = paymentsSorting.slice(startIndex, endIndex);

    log("getParentPayment : paymentPagination => ", paymentPagination);
    res.status(200).send({
      status: true,
      message: parentConst.MESSAGE_GET_PARENT_PAYMENT_HISTORY_SUCCESS,
      data: paymentPagination,
      total: getAllPaymentArray.length,
    });
  } catch (error) {
    errorLogging("getParentPayment", "ERROR", error);
    res.status(500).send({
      status: false,
      message: parentConst.MESSAGE_SOMETHINGS_WRONG,
      result: error,
    });
  }
};

export const getInstantReferalAmount = async (req: any, res: any) => {
  const { userId } = req.params;
  const getParentUser = await firestore().collection("users").doc(userId).get();
  const getParentUserData: any = getParentUser.data();
  const getUserPendingReferalAmount = await firestore()
    .collection("parentPayment")
    .where("parentUserId", "==", userId)
    .where("status", "in", [parentConst.PAYMENT_STATUS_PENDING, parentConst.PARENT_REFFERAL_PAYMENT_EVENT_STATUS_CLAIMED])
    .get();
  const getUserPendingReferalAmountData: any =
    getUserPendingReferalAmount.docs.map((payment) => {
      const id = payment.id;
      return { id, ...payment.data() };
    });
  if (getUserPendingReferalAmountData.length) {
    for (
      let pending = 0;
      pending < getUserPendingReferalAmountData.length;
      pending++
    ) {
      const getPaymentAddress = getParentUserData.wellDAddress.find(
        (address: any) =>
          address.coin === getUserPendingReferalAmountData[pending].token
      );
      if (getPaymentAddress) {
        console.info("getPaymentAddress", getPaymentAddress.address);
        // const transactionBody = {
        //     "method": parentConst.PAYMENT_METHOD,
        //     "params": {
        //         "amount": getUserPendingReferalAmountData[pending].amount || 0,
        //         "network": parentConst.PAYMENT_NETWORK,
        //         "origincurrency": parentConst.PAYMENT_ORIGIN_CURRENCY,
        //         "token": parentConst.PAYMENT_TOKEN,
        //     },
        //     "user": "Test"
        // };

        const parentTransactionDetails = {
          amount: parseFloat("0.0001"), //parseFloat(getUserPendingReferalAmountData[pending].amount) || 0,
          address: getPaymentAddress.address,
          network: "ethereum",
        };
        const getPaymentAfterTransfer = await callSmartContractPaymentFunction(
          parentTransactionDetails
        );
        const getHash = getPaymentAfterTransfer?.result?.return_value[0].hash;
        console.log("Get Hash In Call Smart API In Instant", getHash);
        console.info(
          "getUserPendingReferalAmountData[pending]?.id",
          getUserPendingReferalAmountData[pending]?.id
        );
        //const getPaymentAfterTransfer = await paymentFunction(transactionBody);
        await firestore()
          .collection("parentPayment")
          .doc(getUserPendingReferalAmountData[pending]?.id)
          .set(
            {
              status: parentConst.PAYMENT_STATUS_SUCCESS,
              parentPendingPaymentId: null,
              address: getPaymentAddress.address,
              receiveType: getParentUserData.referalReceiveType.name,
              transactionId: getHash,
            },
            { merge: true }
          );
      } else {
        getUserPendingReferalAmountData[pending].status =
          parentConst.PAYMENT_STATUS_NO_COIN_FOUND;
        const storeInParentData = {
          ...getUserPendingReferalAmountData[pending],
          parentPendingPaymentId: null,
          address: parentConst.PAYMENT_ADDRESS_NO_ADDRESS_FOUND,
          receiveType: getParentUserData.referalReceiveType.name,
          timestamp: firestore.Timestamp.now(),
        };
        console.info("storeInParentData", storeInParentData);
        await firestore().collection("parentPayment").add(storeInParentData);
      }
    }
    return res.status(200).send({
      status: true,
      message: parentConst.MESSAGE_PARENT_PENDING_PAYMENT_AMOUNT,
      data: getUserPendingReferalAmountData,
    });
  } else {
    return res.status(404).send({
      status: false,
      message: parentConst.MESSAGE_PARENT_PENDING_PAYMENT_AMOUNT_NOT_FOUND,
      data: [],
    });
  }
};

export const getTransactionHistory = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const { pageNumber, pageSize } = req.query;
    const page_number = parseInt(pageNumber);
    const page_size = parseInt(pageSize);
    const transactionHistory: any = [];
    const getTransactionQuery = await firestore()
      .collection("payments")
      .where("userId", "==", userId)
      .get();
    getTransactionQuery.docs.forEach((snapshot: any) => {
      let transaction = snapshot.data();
      console.log("Transaction data ", transaction);
      transactionHistory.push({
        amount: transaction.amount,
        numberOfVotes: transaction.numberOfVotes,
        transaction_time: transaction.timestamp,
        token: transaction.token,
        origincurrency: transaction.origincurrency,
        transactionType: transaction.transactionType,
        transaction_id: transaction.transaction_id,
        userId: transaction.userId,
        walletType: transaction.walletType,
        paymentDetails: transaction.paymentDetails,
        event: transaction && transaction.event ? transaction.event : "Failed"
      });
    });

    const transactionSorting = transactionHistory.sort(
      (a: any, b: any) =>
        b.transaction_time._seconds - a.transaction_time._seconds
    );

    const startIndex: number = (page_number - 1) * page_size;
    const endIndex: number = startIndex + page_size;
    console.log(
      "s e : ",
      typeof startIndex,
      typeof endIndex,
      startIndex,
      endIndex
    );

    console.info(transactionSorting, startIndex, endIndex);
    const transactionPagination = transactionSorting.slice(
      startIndex,
      endIndex
    );
    console.info("transactionPagination : ", transactionPagination);

    res.status(200).send({
      status: true,
      message: parentConst.MESSAGE_GET_PARENT_PAYMENT_HISTORY_SUCCESS,
      data: transactionPagination,
      total: transactionHistory.length,
    });
  } catch (error) {
    errorLogging("getTransactionHistory", "ERROR", error);
    res.status(500).send({
      status: false,
      message: parentConst.MESSAGE_SOMETHINGS_WRONG,
      result: error,
    });
  }
};

export const paymentStatusOnUserFromCreditCard = async (req: any, res: any) => {
  try {
    const getResponseFromCreditCardUpdate: any = await paymentStatusOnUserFromCreditCardFunction(req.body)
    res.status(getResponseFromCreditCardUpdate.statusCode).send(getResponseFromCreditCardUpdate);
  } catch (error: any) {
    res.status(500).send({
      status: true,
      message: "Error",
      error
    });
  }
}

export const paymentStatusOnUserFromCreditCardFunction = async (requestBody: any) => {
  try {
    console.log("requestBody--------->", requestBody)
    const { userId, transactionType, numberOfVotes, initiated, intentId, initiatedTransactionDetails, calculatedAmount } = requestBody;

    const currentTime = Timestamp.now();
    const oneHoursAgo = new Date(currentTime.toMillis() - 1 * 60 * 60 * 1000);
    const getAllTransactions = (await firestore().collection("callbackHistory").where('timestamp', '>', oneHoursAgo).get()).docs.map((transaction) => { return { callbackDetails: transaction.data(), id: transaction.id } });
    const getTransactionFromAcme: any = getAllTransactions.filter((transaction: any) => transaction.callbackDetails.intentId === intentId && (transaction.callbackDetails.event === parentConst.CREDITCARD_PAYMENT_EVENT_COMPLETED || transaction.callbackDetails.event === parentConst.CREDITCARD_PAYMENT_EVENT_FIAT_PROVIDER || transaction.callbackDetails.event === parentConst.PAYMENT_STATUS_APPROVED));
    console.log("getTransactionFromAcme : ", getTransactionFromAcme);
    if (!getTransactionFromAcme) {
      return {
        statusCode: 404,
        status: false,
        message: parentConst.ACME_TRANSACTION_NOT_FOUND,
        result: "",
      }
    }

    if (getTransactionFromAcme && getTransactionFromAcme.length && getTransactionFromAcme[getTransactionFromAcme.length - 1] && getTransactionFromAcme[getTransactionFromAcme.length - 1].callbackDetails.event == parentConst.CREDITCARD_PAYMENT_EVENT_FIAT_PROVIDER || getTransactionFromAcme[getTransactionFromAcme.length - 1].callbackDetails.event == parentConst.CREDITCARD_PAYMENT_EVENT_COMPLETED) {
      if (transactionType === parentConst.TRANSACTION_TYPE_EXTRA_VOTES) {
        await addIsExtraVotePurchase({
          userId,
          transactionType,
          numberOfVotes,
          initiated
        });
      }
      if (transactionType === parentConst.TRANSACTION_TYPE_UPGRADE) {
        await addIsUpgradedValue(userId)
      }

      let blockChainHash = getTransactionFromAcme[getTransactionFromAcme.length - 1].callbackDetails.data.blockchainTransactionHash ? getTransactionFromAcme[getTransactionFromAcme.length - 1].callbackDetails.data.blockchainTransactionHash : `INTENT-ID-${getTransactionFromAcme[getTransactionFromAcme.length - 1].callbackDetails.intentId}`;

      await firestore().collection("callbackHistory").doc(getTransactionFromAcme[getTransactionFromAcme.length - 1].id).set({
        paymentDetails
          : {
          ...getTransactionFromAcme[getTransactionFromAcme.length - 1].callbackDetails.data,
          hash: blockChainHash,
          orderId: `ACME-${userId.slice(0, 4)}-${blockChainHash.slice(0, 4)}`
        },
        event: getTransactionFromAcme[getTransactionFromAcme.length - 1].callbackDetails.event,
        userId,
        amount: calculatedAmount ? calculatedAmount : initiatedTransactionDetails.amount,
        dollarAmount: parseInt(initiatedTransactionDetails.amount) / 1000000,
        initiatedTransactionDetails,
        transactionType,
        numberOfVotes,
        initiated
      }, { merge: true });

      const getUpdatedData: any = (await firestore().collection("callbackHistory").doc(getTransactionFromAcme[getTransactionFromAcme.length - 1].id).get()).data();

      console.info("Get Updated data-->", getUpdatedData);

      const addNewPayment = await firestore().collection('payments').add({ ...getUpdatedData, timestamp: Timestamp.now() });

      console.info("addNewPayment-->", addNewPayment);

      // if (addNewPayment.id) {
      //   firestore().collection("callbackHistory").doc(getTransactionFromAcme[getTransactionFromAcme.length - 1].id).delete().then(() => {
      //     console.log(`${getTransactionFromAcme[getTransactionFromAcme.length - 1].id} Document successfully deleted from callbackHistory!`)
      //   }).catch((error) => {
      //     console.log(`${getTransactionFromAcme[getTransactionFromAcme.length - 1].id} Document is not deleted from callbackHistory! \n Error: ${error}`);
      //   });
      // };

      return {
        statusCode: 200,
        status: true,
        message: parentConst.PAYMENT_UPDATE_SUCCESS,
        getUpdatedData
      }
    } else {
      return {
        statusCode: 200,
        status: false,
        message: parentConst.PAYMENT_UPDATE_SUCCESS,
        getUpdatedData: {}
      }
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      status: true,
      message: "Error",
      error
    }
  }
}

export const createPaymentOnTempTransactionOnCreditCard = async (req: any, res: any) => {
  try {
    //Stage ---> const url = 'https://acme-stage.fly.dev/operations/dev/intent/create-pay-intent';
    //Stage ----> Key const apiKey = 'STAGE.RA7FESQ-B3MUBMI-TASJBXY-I4ZMYRA';
    const url = parentConst.PAYMENT_WEBHOOK_URL_PROD
    const apiKey = parentConst.PAYMENT_WEBHOOK_API_KEY

    const data = {
      contractAddress: req.body.contractAddress,
      to: req.body.to,
      chainId: req.body.chainId,
      amount: req.body.amount,
      intentLimit: req.body.intentLimit ? req.body.intentLimit : 0,
      redirectUrl: `${env.BASE_SITE_URL}/votepayment?userId=${req.body.userId}`,
      memo: "INITIATED"
    };

    const getResponseFromIntentRequest = await axios.post(url, data, {
      headers: {
        'X-API-KEY': apiKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (getResponseFromIntentRequest.status === 200) {

      const redirectUrl = getResponseFromIntentRequest && getResponseFromIntentRequest.data && getResponseFromIntentRequest.data.data ? getResponseFromIntentRequest.data.data : "N/A";
      const getIntentId = redirectUrl.split("pay/")[1]; //This is temporary way to find the Intent ID
      await firestore()
        .collection("tempPaymentTransaction").add({
          ...req.body,
          isProceedForActualTransaction: false,
          isProceedForParentTransaction: false,
          uniquePaymentLink: redirectUrl,
          intentId: getIntentId,
          walletType: "ACME_PAYMENT_MODE",
          rateLimit: 10,
          serverTimestamp: Timestamp.now()
        });


      console.info("Redirect URL--->", JSON.stringify(redirectUrl));

      res.status(200).send({
        status: true,
        message: parentConst.ACME_REDIRECT_URL_CREATED_SUCCESSFULLY,
        redirectUrl
      });
    } else {
      res.status(500).send({
        status: false,
        message: parentConst.ACME_REDIRECT_URL_SOMETHING_WENT_WRONG,
        redirectUrl: ""
      });
    }
  } catch (error) {
    console.info("Error", error);
    res.status(500).send({
      status: false,
      message: parentConst.MESSAGE_SOMETHINGS_WRONG,
      result: error,
    });
  }
}

export const getAllPendingPaxByUser = async (req: any, res: any) => {
  try {
    const { userId } = req.body;
    const getPendingPaxValue = await getAllPendingPaxByUserId(userId);
    console.info("getPendingPaxValue", getPendingPaxValue)
    return res.status(200).send({
      status: true,
      message: parentConst.MESSAGE_PENDING_PAX_VALUE,
      data: getPendingPaxValue,
    });
  } catch (error) {
    errorLogging("getAllPendingPaxByUser", "ERROR", error);
    res.status(500).send({
      status: false,
      message: parentConst.MESSAGE_SOMETHINGS_WRONG,
      result: error,
    });
  }
}

export const checkTransactionStatus = async (paymentDetails: any) => {
  try {
    console.log("paymentDetails : ", paymentDetails)
    console.log("paymentDetails network : ", paymentDetails.network)
    if (!paymentDetails.hash) {
      errorLogging("checkTransactionStatus", "ERROR", "Transaction hash is required")
      return {
        status: false,
        message: "Transaction hash is required"
      }
    }
    const options = {
      headers: {
        "Content-Type": "application/json",
      }
    };

    const returnFinalResponse: any = {}

    // EhterScan API
    if (paymentDetails.network == 1) {
      console.log("EtherScan")
      await axios.get(`https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${paymentDetails.hash}&apikey=${env.ETHERSCAN_API_KEY}`, options)
        .then((apiResponse: any) => {
          const response = apiResponse.data
          console.log("response : ", response)
          if (response.status === '1') {
            returnFinalResponse['data'] = response.result.status === "1" ? {
              status: true,
              message: "Transaction is confirmed"
            } : {
              status: false,
              message: "Transaction is not confirmed"
            };

          } else {
            returnFinalResponse['data'] = {
              status: false,
              message: response.message,
              reason: response.reason
            };
          }
        });
      console.log("returnFinalResponse ether: ", returnFinalResponse)
      return returnFinalResponse
    } else if (paymentDetails.network == 137) {
      // ploygonScan 
      console.log("ploygonScan")
      await axios.get(`https://api.polygonscan.com/api?module=transaction&action=gettxreceiptstatus&txhash=${paymentDetails.hash}&apikey=${env.POLYGONSCAN_API_KEY}`, options)
        .then((apiResponse: any) => {
          const response = apiResponse.data
          console.log("response : ", response)
          if (response.status === '1') {
            returnFinalResponse['data'] = response.result.status === "1" ? {
              status: true,
              message: "Transaction is confirmed"
            } : {
              status: false,
              message: "Transaction is not confirmed"
            };
          } else {
            returnFinalResponse['data'] = {
              status: false,
              message: response.message,
              reason: response.reason
            };
          }
        });
      console.log("returnFinalResponse polygon: ", returnFinalResponse)
      return returnFinalResponse
    } else if (paymentDetails.network == 56) {
      // binance 
      console.log("binance")
      await axios.get(`https://api.bscscan.com/api?module=transaction&action=gettxreceiptstatus&txhash=${paymentDetails.hash}&apikey=${env.BINANCESCAN_API_KEY}`, options)
        .then((apiResponse: any) => {
          const response = apiResponse.data
          console.log("response : ", response)
          if (response.status === '1') {
            returnFinalResponse['data'] = response.result.status === "1" ? {
              status: true,
              message: "Transaction is confirmed"
            } : {
              status: false,
              message: "Transaction is not confirmed"
            };
          } else {
            returnFinalResponse['data'] = {
              status: false,
              message: response.message,
              reason: response.reason
            };
          }
        });
      console.log("returnFinalResponse binance: ", returnFinalResponse)
      return returnFinalResponse
    }
    console.log("returnFinalResponse >>>> ", returnFinalResponse)
    // return returnFinalResponse
  } catch (error) {
    errorLogging("checkTransactionStatus", "ERROR", error)
    return false
  }
}
