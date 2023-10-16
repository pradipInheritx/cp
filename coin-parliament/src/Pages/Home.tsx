/** @format */

import React, { useContext } from "react";
import { Image } from "react-bootstrap";
import { useTranslation } from "../common/models/Dictionary";
import Pairs from "../Components/Pairs/Pairs";
import PairsCopy from "../Components/Pairs/PairsCopy";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import UserContext from "../Contexts/User";
import Coins from "../Components/Coins/Coins";
import { calcFavorites } from "../common/utils/coins";
import AppContext from "../Contexts/AppContext";
import { HomeContainer } from "../Components/App/App";
import NotificationContext from "../Contexts/Notification";
import NotLoggedInPopup from "../Components/App/NotLoggedInPopup";
import Quotes from "../Components/Quotes";
import ContentContext from "../Contexts/ContentContext";
import { useWindowSize } from "../hooks/useWindowSize";
import InfluencersCarousel from "../Components/Users/InfluencersCarousel";
import { texts } from "../Components/LoginComponent/texts";
import { Buttons } from "../Components/Atoms/Button/Button";


const H2 = styled.h2`
  font-size: var(--font-size-xxl);
  text-align: center;
`;

const TextContainer = styled.div`
  max-width: 284px;
  margin: 0 auto;

  & p {
    font-size: 17px;
  }
`;
const Home = () => {
  const translate = useTranslation();
  const { user } = useContext(UserContext);
  const { login, firstTimeLogin, setLogin, setLoginRedirectMessage, setSignup } =
    useContext(AppContext);
  const { showModal } = useContext(NotificationContext);
  const { quotes } = useContext(ContentContext);
  const { width } = useWindowSize();
  const src = `/hpbanner${width && width > 979 ? "" : ""}.jpg`;


  return (
    <>
      <div className='p-0 w-100' style={{ background: "#160133" }}>
        <div style={{ background: "#160133" }}>
          <HomeContainer width={width} className='mb-4 p-0 '>
            {!(login || firstTimeLogin) && (
              <>
<<<<<<< HEAD
                <div
                  style={{
                    width: width && width > 969 ? "100%" : "100%",
                    height:
                      width && width > 969
                        ? "550px"
                        : '450px',
                     marginTop: width && width > 969 ? -50 :65,
                    // marginTop:'120px',
                    position: "absolute",
                }}
                >
                {/* <Image
=======
                <Image
>>>>>>> 714adc03f54b44e65218d6d6a70ca611d653c470
                  src={src}
                  style={{
                    width: width && width > 969 ? "100%" : "100%",
                    height:
                      width && width > 969
                        ? "auto"
<<<<<<< HEAD
                        : 'auto',
                     marginTop: width && width > 969 ? -50 :65,
                    // marginTop:'120px',
                    position: "absolute",
                  }}
                  /> */}
                  </div>
                {/* {window.screen.width>768 && <h2
                    style={{ zIndex: 0, position: "absolute",top:'130px' }}
                    className=' d-block'
                  >
                    <strong
                      className='text-uppercase'
                      style={{ fontSize: "45px", fontWeight: "700" }}
                    >
                      {translate("Vote to Earn")}
                    </strong>
                    
                  </h2>}
=======
                        : "auto",
                    marginTop: width && width > 969 ? "0" : "80px",
                    // marginTop:'120px',
                    position: "absolute",
                  }}
                />

>>>>>>> 714adc03f54b44e65218d6d6a70ca611d653c470
                <div
                  className='w-100 '
                  style={{
                    marginTop: window.screen.width > 979 ? "150px" : "-48px",
                  }}
                >
<<<<<<< HEAD
                  
                  

                 {window.screen.width <768 && <h2
                    style={{ zIndex: 0, position: "relative" }}
                    className='d-xl-none d-block'
                  >
                    <strong
                      className='text-uppercase'
                      style={{ fontSize: "24px", fontWeight: "700" }}
                    >
                      {translate("Vote to Earn")}
                    </strong>
                  </h2>}
                </div> */}
                    {/* <TextContainer className="mt-2" style={{textTransform:'none',fontWeight:'400'}}>
                  <p>{translate("Make better investment decisions with the world’s first social indicator")}</p>
                </TextContainer> */}
                    {/* <span className="ms-xl-2">{translate("Crypto & NFT")}</span> */}
=======

>>>>>>> 714adc03f54b44e65218d6d6a70ca611d653c470

                  {/* <TextContainer className="mt-2" >
                  <p>{translate("Make better investment decisions with the world’s first social voting indicator")}</p>
                </TextContainer> */}
              </>
            )}
          </HomeContainer>
        </div>
       <div className='pb-4 mx-0'>
          <TextContainer
            className='mt-2 d-xl-none'
            style={{
              textTransform: "none",
              fontWeight: "400",
              maxWidth: "250px",
            }}
          >
            {/* <h2
                    style={{ zIndex: 0, position: "relative",marginTop:window?.screen?.width<768?'90px': "200px" }}
                    className=' d-block text-center mb-2'
                  >
                    <strong
                      className='text-uppercase text-center'
                      style={{ fontSize: "24px", fontWeight: "700" }}
                    >
                      {translate("Vote to Earn")}
                    </strong>
                  </h2> */}
            {/* <TextContainer className="mt-2" style={{textTransform:'none',fontWeight:'400'}}>
                  <p>{translate("Make better investment decisions with the world’s first social indicator")}</p>
                </TextContainer> */}
            {/* <span className="ms-xl-2">{translate("Crypto & NFT")}</span> */}
            <H2
              style={{
                zIndex: 0,
                fontWeight: "400",
                position: "relative",
<<<<<<< HEAD
                marginTop: window.screen.width > 767 ?"260px":"120px",
=======
                marginTop: "130px",
>>>>>>> 714adc03f54b44e65218d6d6a70ca611d653c470
              }}

              className="mb-4"
            >
<<<<<<< HEAD
              {translate("HERE'S YOUR CHANCE TO VOTE, IMPACT & EARN! ")}
            </H2>
          </TextContainer>
          {window.screen.width > 979 && (
            <H2
              style={{
                // zIndex: 1,
                fontWeight: "400",
                position: "relative",
                // marginTop: "200px",
                marginTop: window.screen.width > 767 ?"260px":"120px",
                fontSize: "30px",
              }}
            >
              {translate("HERE'S YOUR CHANCE TO VOTE, IMPACT & EARN! ")}
            </H2>
          )}

         
=======
              {texts.HereYourChance}
              {/* {translate("Here's your chance to VOTE, IMPACT & EARN! ")} */}
            </H2>
          </TextContainer>
          {window.screen.width > 979 && (
            <>
              {/* <h2
             style={{ zIndex: 0, position: "relative",marginTop:window?.screen?.width<768?'90px': "200px" }}
             className=' d-block text-center mb-2'
           >
             <strong
               className='text-uppercase text-center'
               style={{ fontSize: "44px", fontWeight: "700" }}
             >
               {translate("Vote to Earn")}
             </strong>
           </h2> */}
              {/* <TextContainer className="mt-2" style={{textTransform:'none',fontWeight:'400'}}>
           <p>{translate("Make better investment decisions with the world’s first social indicator")}</p>
         </TextContainer> */}
              {/* <span className="ms-xl-2">{translate("Crypto & NFT")}</span> */}
              <H2
                style={{
                  // zIndex: 1,
                  fontWeight: "400",
                  position: "relative",
                  // marginTop: "200px",
                  fontSize: "30px",
                  marginTop: window?.screen?.width < 768 ? '100px' : "222px",
                }}

                className="mb-4"
              >
                {texts.HereYourChance}
                {/* {translate("Here's your chance to VOTE, IMPACT & EARN! ")} */}
              </H2>
            </>
          )}
          {/* <Pairs
            onFavClick={async (...args) => {
              if (user) {
                await calcFavorites(...args);
              } else {
                showModal(<NotLoggedInPopup />);
              }
            }}
          /> */}
>>>>>>> 714adc03f54b44e65218d6d6a70ca611d653c470
          {/* <Coins
            onFavClick={async (...args) => {
              if (user) {
                await calcFavorites(...args);
              } else {
                setLoginRedirectMessage("add coin to favorites");
                setLogin(true);
                // showModal(<NotLoggedInPopup/>);
              }
            }}
          /> */}
<<<<<<< HEAD
        { window.screen.width > 979 &&<H2 className='mt-3'style={{margin:'auto',textAlign:'center', fontSize:'2.5rem'}}>COMING SOON</H2>}



          {window.screen.width < 979&&<H2 className='mt-3' style={{margin:'auto',textAlign:'center',fontSize:'1.5rem'}}>COMING SOON</H2>}
        </div>
        {/* <div className='mb-4 mx-0'>
          <H2
            style={{
              zIndex: 1,
              fontWeight: "400",
              position: "relative",
              marginBottom: "20px",
            }}
          >
            {translate("")}
          </H2>
          <Pairs
=======
          <PairsCopy
>>>>>>> 714adc03f54b44e65218d6d6a70ca611d653c470
            onFavClick={async (...args) => {
              if (user) {
                await calcFavorites(...args);
              } else {
                showModal(<NotLoggedInPopup />);
              }
            }}
          />




        </div>
        <div className='mb-4 mx-0'>
          {/* <H2
            style={{
              zIndex: 1,
              fontWeight: "400",
              position: "relative",
              marginBottom: "20px",
            }}
          >
            {translate("")}
          </H2> */}
          {/* <Pairs
            onFavClick={async (...args) => {
              if (user) {
                await calcFavorites(...args);
              } else {
                showModal(<NotLoggedInPopup />);
              }
            }}
          /> */}
          {/* <Coins
            onFavClick={async (...args) => {
              if (user) {
                await calcFavorites(...args);
              } else {
                setLoginRedirectMessage("add coin to favorites");
                setLogin(true);
                showModal(<NotLoggedInPopup/>);
              }
            }}
          /> */}
        </div>
        {/* <div className='mb-5 mx-0'>
          <div className='mb-4'>
            <H2 style={{ zIndex: 0, fontWeight: "400", position: "relative" }}>
              {texts.Influencers}
            </H2>
            {!user?.uid ? <div className='d-sx-none'> {window.screen.width > 979 && <><Buttons.Primary style={{ margin: 'auto', marginTop: '4rem', fontSize: '2rem', padding: '2rem' }} onClick={e => {
              setLogin(true)
              setSignup(true)
            }}>{texts.signUp}</Buttons.Primary>
              <H2 className='mt-3' style={{ margin: 'auto', textAlign: 'center', fontSize: '1.5rem' }}>
              {("Join now and start earning rewards before anyone else").toUpperCase()}
              </H2>

            </>}</div> : <></>}



            {!user?.uid ? <div className='d-xl-none'> {window.screen.width < 979 && <><Buttons.Primary style={{ margin: 'auto', marginTop: '2rem', fontSize: '1rem', padding: '1rem' }} onClick={e => {
              setLogin(true)
              setSignup(true)
            }}>{texts.signUp}</Buttons.Primary><H2 className='mt-3' style={{ margin: 'auto', textAlign: 'center', fontSize: '1rem' }}>{("Join now and start earning rewards before anyone else").toUpperCase()}</H2></>}</div> : <></>}

          </div>
          <InfluencersCarousel />
        </div> */}
        {/* <div className='mb-5 mx-0'>
          <div className='mb-4'>
            <H2 style={{ zIndex: 1, fontWeight: "400", position: "relative" }}>
              {translate("")}
            </H2>
          </div>
          <div>
            <Quotes quotes={quotes} />
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Home;
