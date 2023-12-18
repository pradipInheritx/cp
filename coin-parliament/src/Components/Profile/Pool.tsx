import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import UserContext, { getReferUser } from "../../Contexts/User";
import Share from "./Share";
import ShareCopy from "./ShareCopy";
import Info from "./Info";
import { getUsers } from "./Follow";
import { Leader } from "../../Contexts/CoinsContext";
import PoolMiningCard from "./PoolMiningCard";
import VBG from "../../assets/images/VBG.png"
import VBGM from "../../assets/images/VBGM.png"
import coinParliament from "firebaseCoinParliament";
const Pool = () => {
  const { user, userInfo } = useContext(UserContext);
  const [cmpValue, setCmpValue] = useState(0)
  
  const [children, setChildren] = useState<Leader[]>([]);


  const childrenActivity = async () => {     
    try {
      const referUser = await coinParliament.firestore().collection('users').where('email', '==', userInfo?.email).get();
      if (!referUser.empty) {
        referUser.forEach((doc: any) => {          
          setCmpValue(doc.data()?.voteStatistics?.commission || 0)   
          console.log(doc.data(),"doc.data()")
        });
      }
    } catch (err) {
      console.log( err, 'email');
    }    
    // Number(userInfo?.voteStatistics?.commission || 0).toFixed(2) || 0
  }  
  
  useEffect(() => {       
      childrenActivity()        
  }, [])
  

  const referralUrl = (value: any, url?: any, uid?: any) => {
    const lastSixCharacters = uid.slice(-6);
    // Get the first 2 characters
    const firstTwoCharacters = value.slice(0, 2);
    
    const result = firstTwoCharacters + lastSixCharacters;

    if (url == "") {            
      return `${document.location.protocol}//${document.location.host}/sign-up?refer=${result}`
    }
    else {      
      return `${document.location.protocol}//${url}/?refer=${value}`
    }
  };  
  
  
  useEffect(() => {
    getUsers({ users: userInfo?.children, setUsers: setChildren });
  }, [userInfo?.children]);

  return (
    <>
      <div className={`${window.screen.width > 767 ? "pt-4" : ""}`}
        // style={{
        //   backgroundColor: "rgb(22, 1, 51)",
        // }}
        style={{
          // backgroundColor: '#160133'
          backgroundImage: `${window.screen.width > 767 ? `url(${VBG})` : `url(${VBGM})`}`,
          backgroundRepeat: `${window.screen.width > 767 ? "repeat" : "repeat"}`,
          backgroundPosition: "0 0 0 0",
          backgroundSize: "100%",
          // backgroundSize: "cover",
          // backgroundAttachment: "fixed",
        }}
      >
        <div className="mb-3">
          <ShareCopy
            url={referralUrl}
            text={"share & earn"}
            shareText={`Hey,%0ajoin me on Coin Parliament and earn rewards for your opinion!%0aLet's vote together!`}
          />
        </div>
        <div className="mb-3">
          <Info
            friends={userInfo?.children?.length || 0}
            cpm={cmpValue}
          />
        </div>
        <div className='pb-2'>
          {children.map((child) => {
            return (
              <div className="mb-2" key={child?.userId}>
                <PoolMiningCard user={child} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Pool;
