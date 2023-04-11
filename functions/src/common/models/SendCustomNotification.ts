import { firestore, messaging } from "firebase-admin";
import { userConverter } from "./User";
import { sendNotification } from "./Notification";

export type CustomNotification = {
  title: string;
  body: string;
  userIds: string[];
};

export const sendCustomNotificationOnSpecificUsers = async (
  requestBody: CustomNotification
) => {
  try {
    const { title, body, userIds } = requestBody;
    console.info("ReqBody:", title, body, userIds);
    if (title && body && userIds && userIds.length) {
      const allUsers = await firestore()
        .collection("users")
        .where(firestore.FieldPath.documentId(), "in", userIds)
        .withConverter(userConverter)
        .get();
      const getAllUsersTokens: any = [];
      allUsers.docs.forEach((doc) => {
        getAllUsersTokens.push({ id: doc.id, ...doc.data() });
      });

      if (getAllUsersTokens.length) {
        for (const user of getAllUsersTokens) {
          const token = user.token ? user.token : null;
          if (token) {
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
              },
            };
            await sendNotification({
              token,
              id: user.id,
              body,
              title,
              message,
            });
          } else {
            errorLogging(
              "sendCustomNotificationOnSpecificUsers",
              "FUNCTION",
              "Token not found"
            );
          }
        }
      } else {
        errorLogging(
          "sendCustomNotificationOnSpecificUsers",
          "FUNCTION",
          "No User's Token Found"
        );
      }
    } else {
      errorLogging(
        "sendCustomNotificationOnSpecificUsers",
        "FUNCTION",
        "Please enter title, body & userIds for custom message"
      );
    }
  } catch (error: any) {
    errorLogging("sendCustomNotificationOnSpecificUsers", "FUNCTION", error);
  }
};

export const sendNotificationForFollwersFollowings = async (
  userId: string,
  coin: string
) => {
  const follwersFollwing: any = [];
  const userFindQuery = await firestore().collection("users").doc(userId).get();
  const userData: any = userFindQuery.data();
  console.log(userData);

  userData.subscribers.forEach((user: any) => {
    follwersFollwing.push(user);
  });
  userData.children.forEach((user: any) => {
    follwersFollwing.push(user);
  });

  follwersFollwing.forEach(async (id: any) => {
    var userQuery = await firestore().collection("users").doc(id).get();
    var userData: any = userQuery.data();
    var token = userData.token;

    const message: messaging.Message = {
      token,
      notification: {
        title: `${userData.displayName} just voted for ${coin} take action now!`,
        body: "",
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
      id,
      body: "",
      title: `${userData.displayName} just voted for ${coin} take action now!`,
      message,
    });
  });
};

export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.info(funcName, type, error);
};
