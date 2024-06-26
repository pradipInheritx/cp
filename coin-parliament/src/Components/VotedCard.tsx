import React, { useContext, useState } from "react";
import {Direction, VoteResultProps} from "../common/models/Vote";
import Countdown from "react-countdown";
import {Coin} from "../common/models/Coin";
import {useTranslation} from "../common/models/Dictionary";
import styled from "styled-components";
import {
  Border1pxBlueViolet,
  PoppinsNormalBlueViolet14px,
  PoppinsNormalBlueViolet17px,
  PoppinsNormalGunsmoke9px,
} from "../styledMixins";
import moment from "moment";
import {isEmpty} from "lodash";
import SelectTimeframes from "./Coins/SelectTimeframes";
import AppContext from "../Contexts/AppContext";

const Rectangle2620 = styled.div`
  ${Border1pxBlueViolet};
  width: 345px;
  height: 75px;
  background-color: var(--white);
  border-radius: 38px;
  box-shadow: 0 3px 6px #00000029;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 35px;
  margin: 0 auto 23px;
`;

const ID13020221942 = styled.div`
  ${PoppinsNormalGunsmoke9px};
  letter-spacing: 0;
  line-height: 10px;
  white-space: nowrap;
  margin-top:5px;
`;

const YourVote = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-14) / 23px var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-160133);
  opacity: 1;
  text-align: center;

  &:first-letter {
    text-transform: capitalize;
  }
`;

const BitcoinBTCBULL24H3864490 = styled.div`
  ${PoppinsNormalBlueViolet14px};
  letter-spacing: 0;
  line-height: 14px;
  white-space: nowrap;
  display: flex;
`;

const Row1 = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-14) / var(--line-spacing-14) var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-2d2c3c);
  text-align: left;
`;

const Row2 = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-14) / var(--line-spacing-14) var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-6352e8);
  text-align: left;
`;

const Text2 = styled.div`
  ${PoppinsNormalBlueViolet17px};
  letter-spacing: 0;
  line-height: 12px;
  white-space: nowrap;
`;

const VotedCard = ({
  vote,
  coins,
  symbol1,
  symbol2,
  voteId,
  selectedTimeFrame,
  setSelectedTimeFrame
}: {
  vote: VoteResultProps;
  coins: { [symbol: string]: Coin };
  symbol1: string;
  symbol2: string;
  voteId: string;
  selectedTimeFrame?:number;
  setSelectedTimeFrame?:(n:number)=>void;
}) => {
  const [coin1, coin2] = [
    coins[symbol1] || undefined,
    coins[symbol2] || undefined,
  ];
  const { timeframes } = useContext(AppContext);
  const translate = useTranslation();
  if (!coin1) {
    return <></>;
  }
  const expirationTime = vote.expiration || 0;

  const options = symbol2 ? [symbol1, symbol2] : Object.values(Direction);
  const voted = options[vote.direction];
  const votedCoin = coin2 ? coins[voted] : coins[symbol1];

  let row1 = "",
    row2 = "";
  if (!isEmpty(vote)) {
    let valueVotingTime;
    if (Array.isArray(vote.valueVotingTime)) {
      valueVotingTime = vote.valueVotingTime[Number(vote.direction + "")];
    } else {
      valueVotingTime = vote.valueVotingTime;
    }

    valueVotingTime = Number(Number(valueVotingTime).toFixed(2));
    row1 = coin2
      ? `${votedCoin.symbol} - `
      : `${votedCoin.name} - ${votedCoin.symbol}`;
    row2 = coin2
      ? `${vote.timeframe.name} ${valueVotingTime}`
      : `${voted} - ${vote.timeframe.name} $${valueVotingTime}`;
  }

  return (
    <>
     <div className="mt-4">
        <SelectTimeframes
          {...{
            selected: selectedTimeFrame,
            timeframes,
            selectTimeframe: (timeframe) => {
              // @ts-ignore
              setSelectedTimeFrame(timeframe.index);
            },
            title: translate("select time frame"),
            voted:true,
          }}
        />
      </div>
      <div className="mb-3 mt-4 pt-2">
        <YourVote>{translate("your vote")}</YourVote>
      </div>
      <Rectangle2620>
        <div className="d-flex justify-content-between w-100">
          <div>
            <BitcoinBTCBULL24H3864490
              className={coin2 ? "flex-row" : "flex-column"}
            >
              <Row1 className="poppins-normal-blackcurrant-14px">{row1}</Row1>
              <Row2 className="poppins-normal-blue-violet-14px-2">{row2}</Row2>
            </BitcoinBTCBULL24H3864490>
            <ID13020221942>
              {voteId} - {moment(vote.voteTime).format("MM.DD.YYYY HH:mm")}
            </ID13020221942>
          </div>
          <div style={{margin:'auto'}}>
            <Text2>
              <MyCountdown expirationTime={expirationTime} />
              {coin2===undefined && <>{vote.direction?
                <>  { vote.valueVotingTime <Number(vote.valueVotingTime) + (Number(vote.valueVotingTime) * 1 / 100) && vote.valueVotingTime >Number(vote.valueVotingTime) - (Number(vote.valueVotingTime) * 1 / 100) && !vote.score ? <img style={{marginLeft:'3px'}} src={process.env.PUBLIC_URL + `/images/icons/mediumgreen.png`}/>:
                <>{vote.valueVotingTime <coin1.price  && <img style={{marginLeft:'3px'}} src={process.env.PUBLIC_URL + `/images/icons/highgreen.png`}/>}
                {vote.valueVotingTime>  coin1.price && !vote.score && <img style={{marginLeft:'3px'}} src={process.env.PUBLIC_URL + `/images/icons/lightgreen.png`}/>}</>
                }  </> :<>
                { vote.valueVotingTime <Number(vote.valueVotingTime) + (Number(vote.valueVotingTime) * 1 / 100) && vote.valueVotingTime >Number(vote.valueVotingTime) - (Number(vote.valueVotingTime) * 1 / 100) && !vote.score ? <img style={{marginLeft:'3px'}} src={process.env.PUBLIC_URL + `/images/icons/mediumgreen.png`}/>:
                <>{vote.valueVotingTime >coin1.price  && <img style={{marginLeft:'3px'}} src={process.env.PUBLIC_URL + `/images/icons/highgreen.png`}/>}
                {vote.valueVotingTime<  coin1.price  && <img style={{marginLeft:'3px'}} src={process.env.PUBLIC_URL + `/images/icons/lightgreen.png`}/>}</>
                } 
                </>
                }</>}
                 
               
              {coin2 && <>{ vote.direction?
              // @ts-ignore
                <>  { Math.abs((coin1.price / vote?.valueVotingTime[0]) - (coin2.price / vote?.valueVotingTime[1]))  <= 1 && !vote?.score ? <img src={process.env.PUBLIC_URL + `/images/icons/mediumgreen.png`}/>:
                // @ts-ignore
                <>{(coin1.price / vote?.valueVotingTime[0]) > (coin2.price / vote?.valueVotingTime[1])  &&!vote?.score && <img src={process.env.PUBLIC_URL + `/images/icons/highgreen.png`}/>}
                {/* @ts-ignore */}
                {(coin1.price / vote?.valueVotingTime[0]) < (coin2.price / vote?.valueVotingTime[1]) && !vote?.score && <img src={process.env.PUBLIC_URL + `/images/icons/lightgreen.png`}/>}</>
                // @ts-ignore
                }  </> :<>  { Math.abs((coin1.price / vote?.valueVotingTime[0]) - (coin2.price / vote?.valueVotingTime[1]))  <= 1 && !vote?.score ? <img src={process.env.PUBLIC_URL + `/images/icons/mediumgreen.png`}/>:
                // @ts-ignore
                <>{(coin1.price / vote?.valueVotingTime[0]) < (coin2.price / vote?.valueVotingTime[1])  &&!vote?.score && <img src={process.env.PUBLIC_URL + `/images/icons/highgreen.png`}/>}
                {/* @ts-ignore */}
                {(coin1.price / vote?.valueVotingTime[0]) > (coin2.price / vote?.valueVotingTime[1]) && !vote?.score && <img src={process.env.PUBLIC_URL + `/images/icons/lightgreen.png`}/>}</>
                }  </>
                }</>}
            </Text2>
            
          </div>
          
        </div>
      </Rectangle2620>
    </>
  );
};

export default VotedCard;

export const MyCountdown = ({ expirationTime }: { expirationTime: number }) => {
  
  return (
    // @ts-ignore
    <Countdown
      date={expirationTime}
      renderer={({ hours, minutes, seconds, completed }) => {
        if (completed) {
          return <span>loading...</span>;
        } else {
          return (
            <span style={{color:'#6352e8',fontSize:'17px',fontWeight:400}}>
              {hours < 10 ? `0${hours}` : hours}:
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </span>
          );
        }
      }}
    />
  );
};
