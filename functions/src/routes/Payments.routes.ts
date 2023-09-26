import { Router } from "express";

import {
    makePayment,
    isUserUpgraded,
    getTransactionHistory,
    makePaymentToServer,
    getParentPayment,
    updateUserAfterPayment
} from "../common/models/Payments";

const PaymentRouter = Router();

PaymentRouter.post("/makePayment", makePayment);
PaymentRouter.post("/makePayment/toServer", makePaymentToServer);
PaymentRouter.post("/update/user/afterVote", updateUserAfterPayment);

PaymentRouter.get("/isUserUpgraded/:userId", isUserUpgraded);
PaymentRouter.get("/getTransactionHistory/:userId", getTransactionHistory);
PaymentRouter.get("/getParentPayment/:userId", getParentPayment);

export default PaymentRouter;
