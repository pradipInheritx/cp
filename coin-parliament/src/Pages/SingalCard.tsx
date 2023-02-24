/** @format */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Leaderboard from "../Components/Leaderboard";
import NftOneCard from "./NftOneCard";
import "./styles.css";
import {leaders as leaders, userInfo as userInfo1} from "../Components//Coins/testData";
import UserContext from "../Contexts/User";
import CoinsContext from "../Contexts/CoinsContext";
import AppContext from "../Contexts/AppContext";
import {setChecked} from "../common/models/User";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { functions } from "../firebase";
import { httpsCallable } from "@firebase/functions";
import firebase from "firebase/compat";
import { Other } from "./SingleCoin";
import { translate, useTranslation } from "../common/models/Dictionary";

const CenterItem = styled.div`
  background-color: #f2f2f2;  
overFlow-x:hidden;
  width:100%;
  
  // & p {
  //   font-weight: 100;
  //   text-align: center;
  //   padding: 20px;
  //   font-size: 20px;
  //   color: #160133;
  //   text-transform: uppercase;
  // }
  // & strong {
  //   // font-weight: 400;
  //   text-align: center;
  //   // padding: 30px;
  //   font-size: 20px;
  //   color: #160133;
    
  // }
`;
const SummerCard = styled.div`
width:${window.screen.width > 767 ? "730px" : "100%"};
margin:auto;
display: flex;
justify-content:center;  
`;

const SingalCard = () => {
  // const [cards, setCards] = useState(
    
  //   {
  //     id: 1,
  //     cardType: "COMMON",
  //     cardNo: "CP244",
  //     cardHeader: "INVESTOR",
  //     type: "SUMMER",
  //   },
    
  // );
  
  const [CardValue, setCardValue] = useState([]);
  const [backCards, setBackCards] = useState<any>([]);
  const { user, userInfo } = useContext(UserContext);
  const { leaders } = useContext(CoinsContext);
  const { userTypes } = useContext(AppContext);
  const [chosen, setChosen] = useState<string | undefined>();
  

// console.log(user, userInfo , leaders,"useruserInfoleaders")

  const BackSideCard = (value: string | number) => {
    // @ts-ignore
    let allBackCard = backCards;
    // @ts-ignore
    // setBackCards(backCards == value ? "" : value);
    backCards.length > 0
      ? backCards?.map((items: any, index: number) => {
        if (items == value) {
          // @ts-ignore
          allBackCard.splice(index, 1);
          setBackCards(allBackCard);
        } else {
          // @ts-ignore

          setBackCards([...backCards, value]);
        }
        // @ts-ignore
      })
      : setBackCards([...backCards, value]);
  };

  

  const [cardsDetails, setCardsDetails] = useState<any>()
  const [nftAlbumData, setNftAlbumData] = useState<any>()
  const [followersDetails, setFollowersDetails] = useState<any>()
  const [followersShow, setFollowersShow] = useState<any>([])
  let params = useParams();
  const translate = useTranslation();
  const { type, id } = params;
   const navigate = useNavigate();

  console.log(params,"params")
// const claimReward = httpsCallable(functions, "claimReward");
  const getList = httpsCallable(functions, `cardHolderListing`);

  const getFollwersList = async(id:any) => {
    const result = await getList({ cardId: Number(id) }).then((list) => {
      // @ts-ignore
      const FollowerList= list?.data?.map((items: any) => {                 
        return {
          leaders: items?.leader?.length || 0,
          displayName:items?.displayName,
          userId: items?.uid,
          avatar: items?.avatar,
          status: items?.status?.name,
          phone:items?.phone,
          country: items?.country,
          score: items?.voteStatistics?.score,
          totalVote: items?.voteStatistics?.total,
          subscribers: 5,
          pct: items?.voteStatistics?.successful / items?.voteStatistics?.total,
          firstName: items?.firstName,
          email:items?.email,
          lastName: items?.lastName,
        }
      })
setFollowersDetails(FollowerList)


      // @ts-ignore          
      // list?.data?.map((items: any) => {
      //   console.log(items,"items")
        
      // })
    }).catch((error) => {
      console.log(`error: ${JSON.stringify(error)}`);
    });;
                // setRewardTimer(result);
                // console.log("reward", result);  
  }
   const getNftCard = () => {
  const getCards = firebase
            .firestore()
            .collection("nft_gallery")
    getCards.get()
      .then((snapshot) => {                
       let allcollection= snapshot.docs.map((doc) => doc.data())        
        console.log(allcollection,"allcollection")
        allcollection?.map((card) => {
          if (card?.collectionName==type) {
            setNftAlbumData(card?.setDetails)
            // card?.map(() => {
              
            // })
          }          
        })
      }).catch((error) => {
        console.log(error,"error");
      })
      ;    
}
  useEffect(() => {      
    getFollwersList(id)
    getNftCard()
    // alllist= getList({cardID:id})
  }, []) 
  console.log(followersDetails,"followersDetails")
  
  
  return (
    <div className=''>
      <div className='h-100 '>
       

        <CenterItem className="">          
          {/* <div className="text-center">
            <p>{cards.cardType}</p>
          </div> */}
          <div
            style={{
              backgroundColor: "white",  
              borderRadius: "0px 0px 87px 0px",
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
            }}>        
          <SummerCard>
            {nftAlbumData?.map((items:any, index:number) => {
              return (
                <div className=''
                 style={{width:`${window.screen.width<767?"70%":"38%"}`}}
                >
                  {/* @ts-ignore */}
                  
                  {/* @ts-ignore */}                  
                    {items?.cards.map((item: any) => {
                      if (item?.cardId == id) {
                        return (
                        <>
                          <NftOneCard
                            
                            DivClass={item?.type}
                            HeaderText={item?.type}
                            HeaderClass={`${item?.type}_text`}
                            Serie={items?.name}
                            BackCardName={item?.name}
                            Rarity={item?.type}
                            Quantity={item?.quantity}
                              holderNo={item?.noOfCardHolders}
                              cardNo={`${((items?.name)?.toUpperCase())?.slice(0, 3) + items?.id}`}
                            // Disable={"CardDisebal"}
                            // When you pass CardDisebal this name then card is Disable
                            cardHeader={`${item?.name}`}
                            // cardNo={`${item.cardNo}`}
                            id={item?.cardId}
                            BackSideCard={BackSideCard}
                            // flipCard={backCards == item.id ? true : false}
                            flipCard={backCards?.includes(item?.cardId)}
                          />
                        </>
                      );
                      }
                      
                    })}
                  <div className="d-flex justify-content-center  pt-2 pb-4">
                    <Other onClick={() => {
                      navigate(-1);
                    }}>{translate("Veiw All Cards")}</Other>
                  </div>              
                </div>
              );
            })}
              
          </SummerCard>
          
          </div>
          
          <div>  
            <div>
          <div className="text-center my-3">
                <span style={{
                  color: "black",
                  fontWeight: 500,
                fontSize:"15px"
                }}>Card Holders</span>                

          </div>   
           <div>
            <Leaderboard            
          {...{
          expanded: true,
          leaders: followersDetails?.filter((leader:any) => {
            return (
              // @ts-ignore
              leader?.status?.toLowerCase() === chosen?.toLowerCase() || !chosen
            );
          }),          
          userInfo,
          setChecked:setChecked(leaders, user),
        }}
            />            
          </div>
        </div>
          </div>
        </CenterItem>        
      </div>
    </div>
  );
};

export default SingalCard;


