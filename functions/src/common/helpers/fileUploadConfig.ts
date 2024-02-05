import * as admin from "firebase-admin";
import env from "../../env/env.json";
import Busboy from "busboy";
import {
  getAlbumDetails,
  getCardDetails,
  updateFileLink,
  errorLogging,
} from "../models/Admin/Rewards";
import { logger } from "firebase-functions/v1";

export const imageUploadFunction = async (req: any, res: any) => {
  const { fileType, forModule, id } = req.params;

  try {
    const checkId =
      forModule.toUpperCase() === "CARD"
        ? await getCardDetails(id)
        : forModule.toUpperCase() === "ALBUM"
          ? await getAlbumDetails(id)
          : { albumName: "", cardName: "", message: true };
    if (checkId?.message) {
      return res.status(400).send({
        status: false,
        message: `only ${"CARD"} and ${"ALBUM"} are allowed`,
        result: null,
      });
    } else if (!checkId?.albumName && !checkId?.cardName) {
      return res.status(404).send({
        status: false,
        message: `This ID does not exist ${id} in ${forModule}`,
        result: null,
      });
    }
    const busboy = Busboy({ headers: req.headers });
    const bucket = admin.storage().bucket(env.STORAGE_BUCKET_URL);

    //On File Event
    busboy.on("file", (fieldname: any, file: any, fileMeta: any) => {
      const fileUpload = bucket.file(
        `${checkId.albumName}/${fileMeta.filename}`
      );
      const fileStream = file.pipe(
        fileUpload.createWriteStream({
          metadata: {
            contentType: fileMeta.mimeType,
          },
        })
      );
      fileUpload
        .getSignedUrl({
          action: "read",
          expires: "03-09-2491",
        })
        .then(async (signedUrls) => {
          console.log("Public Url ------\n", signedUrls[0]);
          const result = await updateFileLink(
            forModule,
            fileType,
            id,
            signedUrls[0]
          );
          return res.status(200).send({
            status: true,
            message: "Media uploaded and card image url updated successfully",
            result: { id, ...result },
          });
        });

      //On Error Event
      fileStream.on("error", (error: any) => {
        console.error("File Upload Error Event:", error);
        return res.status(500).send({
          status: true,
          message: "Unable to upload file",
          result: null,
        });
      });
    });

    // On Finish Event
    busboy.on("finish", async () => {
      console.info("On Finish Event Called");
    });
    busboy.end(req.rawBody);
  } catch (error) {
    errorLogging("uploadFiles", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

export const avatarUploadFunction = async (req: any, res: any) => {
  const { userId } = req.params;

  try {
    // const fileSizeLimit = 2; //mb
    const busboy = Busboy({
      headers: req.headers,
      // limits: { fileSize: fileSizeLimit * 1024 * 1024 }
    });
    console.log("BUSBOY  :  ", busboy);
    const bucket = admin.storage().bucket(env.STORAGE_BUCKET_URL);

    const publicImageUrl: any = {}

    logger.info("Start uploading new file-------");

    // upload user's Avatar
    busboy.on("file", async (fieldname: any, file: any, fileMeta: any) => {
      console.log("File Meta : ", fileMeta);
      console.log("File :", file);
      console.log("fieldname : ", fieldname);

      console.log(
        "fileMeta.mimeType.includes('image') : ",
        fileMeta.mimeType.includes("image")
      );
      if (!fileMeta.mimeType.includes("image")) {
        return res.status(400).send({
          status: true,
          message: "Only allows image to upload.Aborting upload.",
          result: null,
        });
      }
      // const getFileType = (fileMeta.mimeType.split('/'))[1]
      // console.log("getFileType : ", getFileType);
      // // const fileUpload = bucket.file(`UsersAvatar/${Date.now()}.${getFileType}`); 
      // const filepath = `UsersAvatar/${Date.now()}/${fileMeta.filename}`
      // console.log("file path : ", filepath)
      // const fileUpload = bucket.file(filepath); 

      const splitFileName = fileMeta.filename.split('.');
      const filepath = `UsersAvatar/${splitFileName[0]}-${Date.now()}.${splitFileName[1]}`;
      console.log("file path : ", filepath);

      const fileUpload = bucket.file(filepath);

      const fileStream = file.pipe(
        fileUpload.createWriteStream({
          metadata: {
            contentType: fileMeta.mimeType,
          },
        })
      );

      //On Error Event
      fileStream.on("error", (error: any) => {
        console.error("File Upload Error Event:", error);
        return res.status(500).send({
          status: true,
          message: "Unable to upload file",
          result: null,
        });
      });

      fileUpload
        .getSignedUrl({
          action: "read",
          expires: "03-09-2491",
        })
        .then(async (signedUrls) => {
          console.warn("Public Url ------\n", signedUrls[0]);
          publicImageUrl['url'] = signedUrls[0]

        })

    });
    busboy.on("finish", async () => {
      await setTimeout(async () => {
        const result: any = (
          await admin.firestore().collection("users").doc(userId).get()
        ).data();
        console.log("publicImageUrl.url  : ", publicImageUrl.url)
        await admin
          .firestore()
          .collection("users")
          .doc(userId)
          .set({ avatar: publicImageUrl.url }, { merge: true });
        return res.status(200).send({
          status: true,
          message: "Update avatar successfully",
          result: { result },
        });
      }, 3000);
    });

    busboy.end(req.rawBody);
  } catch (error) {
    errorLogging("uploadFiles", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};
