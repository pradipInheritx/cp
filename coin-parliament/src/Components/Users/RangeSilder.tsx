import React, { useContext, useEffect, useState } from 'react'
import { Coin } from "../../common/models/Coin";
import { VoteResultProps } from "../../common/models/Vote";
import "./styles.css";
import styled, { css } from "styled-components";
import CoinsContext from '../../Contexts/CoinsContext';
import { decimal } from '../Profile/utils';
// import ReangDot2 from "../../assets/images/ReangDot2.gif";
// import ReangDot5 from "../../assets/images/ReangDot5.gif";

// const InputRange = styled.input`
//    &::-webkit-slider-thumb{  
//     // -webkit-appearance: none;      
//     // width: 35px;
//     // border: 1px solid black;  
//     // height: 35px;            
//     // background-image: url(${ReangDot2}),
//     // background-color:red;
//    }  
// `;

// const OutputDiv = styled.output`
//      position: absolute;
//     // border:1px solid red;
//     border-radius:25px;
//     width:40px;
//     height:40px;
//     background-color: black !important;
//     background-image: linear-gradient(90deg, #3d3e40, #050505);
//     animation: ripple 1s infinite;
//     // right:0px;
//     // top:-15px;
//       z-index:-4;
//    @keyframes ripple{
//     0%{
//         opacity:1;
//         -webkit-transform:scale(0);
//         transform:scale(0)
//     }
//     100%{
//         opacity:0;
//         -webkit-transform:scale(1);
//         transform:scale(1)
//     }
// }
// `;


function RangeSilder(
  {
      lastTenSec,
    vote,
    coins,
    symbol1,
    symbol2
  }: {
      lastTenSec?:any
    vote: VoteResultProps;
    coins: { [symbol: string]: Coin };
    symbol1: string;
    symbol2: string;
    })

{ 
  const [persentValue, setPersentValue] = useState<any>(0)
const {allCoinsSetting}=useContext(CoinsContext)
const [priceRange,setPriceRange]=useState(0.0015)
const getBorderColor = () => {
  // console.log('allcoin',allCoinsSetting)
  

    // let PricePer = livePrice / 100;   
    // const priceRange=()=>{
    //   if(vote?.timeframe?.seconds==60) return 0.0015
    //   if(vote?.timeframe?.seconds==300) return 0.01
    //   if(vote?.timeframe?.seconds==3600) return 0.05
    //   if(vote?.timeframe?.seconds==86400) return 0.1
    //   return 0.0015
    // }
     if (symbol2 !== undefined) {
       let bothLivePrice = [coins[symbol1]?.price, coins[symbol2]?.price];
       if(!vote?.valueVotingTime){
        setPersentValue(50) 
        return false
      }
        // @ts-ignore
       let bothCurrentPrice = [...vote?.valueVotingTime];
      //  @ts-ignore
       const newPairPrice =[(bothLivePrice[0] * decimal[symbol1].multiply - bothCurrentPrice[0] *decimal[symbol1].multiply)/priceRange ,(bothLivePrice[1] *decimal[symbol2].multiply - bothCurrentPrice[1] * decimal[symbol2].multiply)/priceRange ]
       const diffPer = [bothLivePrice[0] - bothCurrentPrice[0] ,bothLivePrice[1] - bothCurrentPrice[1] ]
       const getPer= [(diffPer[0] *1000)/bothCurrentPrice[0] + priceRange,(diffPer[1] *1000)/bothCurrentPrice[1]+priceRange]
    //   let bothCurrentPrice = [vote?.valueVotingTime[0],vote?.valueVotingTime[1],];
     let diff = [
        bothCurrentPrice[0] / bothLivePrice[0],
        bothCurrentPrice[1] / bothLivePrice[1],
    ];
         
      let winner = diff[0] < diff[1] ? 1 : 0;
      const averageValue = Math.abs(diff[0]- diff[1]) * 100;
      // if(!vote?.valueVotingTime || vote?.v alueVotingTime == NaN){
        // 60 sec - each line will be 0.01 % = 1 point
        // 5 min - each line will be 0.01 % 
        // 1 H - each line will be 0.05 % 
        // 24 H - each line will be 0.1 %
        // coin1 price diff - coin 2 price diff
        //  if coin1 = 50 +10 =60
        // if coin2= 50 - 10 
      if ((averageValue ==averageValue)) {        
        console.log('pairrange',getPer[0])
        setPersentValue(vote?.direction == 1 ? 50 -(newPairPrice[0]-newPairPrice[1]) : 50 +(newPairPrice[0]-newPairPrice[1])) 
      } else {
        if (vote?.direction == 1) {
            winner == vote?.direction
                ?
                  setPersentValue(25 + getPer[1] > 0 ? 25 + getPer[1]:0)              
                :             
                  setPersentValue(75 + getPer[1] >100 ?100 :75 + getPer[1]) 
             
        } else if (vote?.direction == 0) {
          winner != vote?.direction
            ?            
            setPersentValue(25  + getPer[0] > 0 ? 25 + getPer[0]:0) 
            :
            setPersentValue(75  + getPer[0] >100 ?100 :75 + getPer[0]) 

        }
      }       
     } else if (symbol2 == undefined) {   
      if(!vote?.valueVotingTime ){
          setPersentValue(50) 
          return false
      }
       
       let livePrice =Number(coins[symbol1]?.price)
       let votePrice = Number(vote?.valueVotingTime)
        
      
       let PricePer = livePrice;
       console.log('price',livePrice < votePrice + 1 &&
        livePrice > votePrice - 1,{
          livePrice,
          votePrice,
          vote
        }
        
        
        )
        // if(!vote?.valueVotingTime || vote?.valueVotingTime==NaN){
      
        // 1 =1 point
        // add 100 to remove decimal 
        //  get difference 
        // make calculation of bar move
       
//         let multiplyValue=10
     // @ts-ignore
        const multiplyValue = decimal[symbol1].multiply
const newPrice = ((livePrice*multiplyValue) - (votePrice * multiplyValue))/priceRange
       const diffPer = livePrice - votePrice 
       const getPer= ((diffPer *100)/votePrice) /priceRange
      //  console.log('priceRange',priceRange())
        console.log('getPer',newPrice,livePrice,votePrice)
       if(livePrice < votePrice + votePrice /10 &&
         livePrice > votePrice - votePrice /10) {  
          if  (vote?.direction == 0)setPersentValue(50 + newPrice);
          else{
            setPersentValue(50 - newPrice);
          }
        }
        else{
          if(vote?.direction == 0){
            livePrice > votePrice ?setPersentValue(75 + getPer >100 ?100 :75 + getPer):setPersentValue(25 + getPer > 0 ? 25 + getPer:0);
          }else if(vote?.direction == 1){
            livePrice > votePrice ? setPersentValue(25 + getPer > 0 ?25 + getPer:0):setPersentValue(75 + getPer >100 ?100 :75 + getPer);
          }
        }     
    }
  };
  
  
  useEffect(() => { 
    
      getBorderColor()
    
  }, [coins[symbol1]?.price ,coins[symbol2]?.price,vote?.valueVotingTime])
  useEffect(() => {
    if(!symbol1 ) return
    const data= allCoinsSetting?.find((item:any)=>item?.symbol==symbol1)
    console.log('data data',data,symbol1,allCoinsSetting)
    
    const range=vote?.timeframe?.index
    console.log('allcoin',data?.voteBarRange,range,data,allCoinsSetting)
    const rangeData= data?.voteBarRange[`${range}`]
    // @ts-ignore
    console.log('allcoin',rangeData,symbol1,vote)
  
    setPriceRange(rangeData)
   
    // const decimalPrice = decimal[symbol1].decimal
   
  }, [symbol1,allCoinsSetting,vote?.voteTime])
  
 

  return (
    <div className=''>
          {/* <p style={{color:"black"}} className="py-2">YOUR VOTE IMPACT</p> */}
      <div className="d-flex justify-content-around w-100 range">                                                    
        {/* <Golw className='border'></Golw> */}
        
        {/* <OutputDiv name="" htmlFor="silder" className='' aria-hidden='true' ></OutputDiv> */}
        <div className='grow' aria-hidden='true' ></div>
        
        <input  id="silder" type="range" min={0} max={100} value={persentValue} className={`${lastTenSec==true ?"rengeInput123 ":"rengeInput "} w-100`} >

        </input>        
      </div>
            <div className="d-flex justify-content-between mt-2"
            style={{color:"black"}}
            >                                                    
              <span>LOW</span>
              <span>MID</span>
              <span>HIGH</span>
      </div>      
    </div>
  )
}

export default RangeSilder