import React from "react";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import CmtAvatar from "../../../../@coremat/CmtAvatar";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarIcon from "@material-ui/icons/Star";
import {useSelector} from "react-redux";
import CmtList from "../../../../@coremat/CmtList";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import ClearIcon from "@material-ui/icons/Clear";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import useStyles from "./index.style";
import { Block, CheckCircleOutline } from "@material-ui/icons";

import {Tooltip} from "@material-ui/core";
import { timeFromNow } from "@jumbo/utils/dateHelper";

const PaymentTrDetailView = ({open, onCloseDialog}) => {
  const classes = useStyles();  
const { currentRewardTr } = useSelector(({ RewardTr }) => RewardTr);

  return (
    <Dialog open={open} onClose={onCloseDialog} className={classes.dialogRoot}>
      <Box className={classes.userInfoRoot}>
        <Box mr={3} display="flex" alignItems="center">
          {/* <Box className={classes.avatarView} mr={{xs: 4, md: 6}}>
            <CmtAvatar size={70} src={profile_pic} alt={name} />
          </Box> */}
          <Box mt={-2}>
            <Box display="flex" alignItems="center">
              <Typography className={classes.titleRoot}>{`${currentRewardTr?.displayName}`}</Typography>
            </Box>
            
          </Box>
        </Box>
        <Box ml="auto" mt={-2} display="flex" alignItems="center">
          {/* <Box ml={1}>
            <Tooltip title={"status"}>
              <IconButton aria-label="filter list">
                {currentRewardTr?.chosen === false && <Block color="primary" />}
                {currentRewardTr?.chosen === true && <CheckCircleOutline color="primary" />}
              </IconButton>
            </Tooltip>
          </Box> */}
          <Box ml={1}>
            <IconButton onClick={onCloseDialog}>
              <ClearIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box px={6} py={5}>
        <Box mb={5} component="p" color="common.dark">
         Reward Transactions
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          {/* <EmailIcon /> */}
          Transaction ID : 
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentRewardTr?.totalVote}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          {/* <EmailIcon /> */}
          Transaction Date : 
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentRewardTr?.successVote}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 7}}>
          {/* <EmailIcon /> */}
         Transaction Amount : 
          <Box ml={5} color="primary.main" component="p" className="pointer">
            {currentRewardTr?.userScore}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mb={{xs: 4, sm: 5}}>
          Description :
          <Box ml={5}>
            
            <Box ml={5} color="primary.main" component="p" className="pointer">
            {/* {timeFromNow(currentRewardTr?.createdAt)} */}
            {currentRewardTr?.userRank}
          </Box>
          </Box>
        </Box>        
      </Box>
    </Dialog>
  );
};

export default PaymentTrDetailView;

PaymentTrDetailView.prototype = {
  open: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func
};