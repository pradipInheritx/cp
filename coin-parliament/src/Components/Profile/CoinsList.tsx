/** @format */

import React, { useContext, useState, useEffect } from "react";
import { Form, Image, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";

import firebase from "firebase/compat";
import { Buttons } from "Components/Atoms/Button/Button";
import axios from "axios";
import UserContext from "Contexts/User";
import { auth } from "firebase";
import { showToast } from "App";
import { ToastType } from "Contexts/Notification";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CoinList = styled.div`
  // border:1px solid red;
   width:${window.screen.width < 767 ? "300px" : "400px"};
  background:white;
  color:black;
  padding:10px 15px;
  margin:10px 0px;
  border-radius:10px;
`;

const Boxdiv = styled.div`
  width:${window.screen.width >767 ? "60%":"99%"};
  border-radius:10px;
  background-color:#1e0243;
  padding :30px;
  display:flex;  
  flex-wrap:${window.screen.width > 767 ? "" : "wrap"}
`;

const Opctiondiv = styled.div`
  border:1px solid white;
  border-radius:10px;
  overflow:hidden;
  width:${window.screen.width > 767 ? "33%" : "98%"};
  margin:${window.screen.width > 767 ? "" : "auto"};
  font-size:15px;
  & div{
    padding:13px;
    display:flex;    
  }
`;

const Sidediv = styled.div`
width:${window.screen.width >767 ? "65%":"98%"};
margin:${window.screen.width > 767 ? "" : "auto"};
 margin-left:${window.screen.width >767 ? "20px":""};
 margin-top:${window.screen.width > 767 ? "" : "30px"};
 
`;

const Paymentdiv = styled.div`
//  width:65%;
width:${window.screen.width > 767 ? "65%" : "98%"};
margin-top:${window.screen.width > 767 ? "" : "30px"};
 display:flex;
  justify-content: center;
    align-items: center;
 margin-left:20px;
`;
const Divbutton = styled.div`
  width:60%;
  border-radius:10px;

  display:flex;
  justify-content: end;
  & button {
    width:150px;
    margin:20px 0px;
    padding:10px;
    border:none;
    border-radius:5px;
  }
`;


const CoinsList = () => {


  const [coinsList, setCoinsList] = useState([])
  const [selectPayment, setSelectPayment] = useState(0);
  const [selectCoin, setSelectCoin] = useState("none");
  const [CheckCoin, setCheckCoin] = useState(0);
  const [coinInfo, setCoinInfo] = useState([]);  
  
  // const connectOrNot = localStorage.getItem("wldp_disconnect");

  const [connectOrNot, setConnectOrNot] = React.useState(false);
  const [walletName, setWalletName] = React.useState("");
  const { userInfo, user } = useContext(UserContext);
  const [payamount, setPayamount ] = useState(99);
  const [getbalance, setGetbalance ] = useState(0);
  const [payButton, setPayButton ] = useState(false);
  const [showOptionList, setShowOptionList ] = useState(false);
  const [afterPay, setAfterPay ] = useState(false);
const ApiUrl = "https://us-central1-coin-parliament-staging.cloudfunctions.net/api/v1/"

// Insufficient balance 

  // Buy more tokens here or swap from other tokens with balance on this account here


//  For put email in userid 
  const navigate = useNavigate();
  
  useEffect(() => {
    const getCoinList = firebase
      .firestore()
      .collection("settings").doc("coins")
    getCoinList.get()
      .then((snapshot) => {
        const allList = snapshot.data()?.coins;
        setCoinsList(allList && allList);
      }).catch((error) => {
        console.log(error, "error");
      });

  }, [])

  useEffect(() => {
    // if (localStorage.getItem("wldp-cache-provider")) {   
      // @ts-ignore
    setWalletName(localStorage.getItem("wldp-cache-provider"))    
  // }
}, [connectOrNot])


//  For put email in userid 

  useEffect(() => {
    (window as any)?.wldp?.send_uid(`${user?.email}`).then((data:any) => {       
      console.log(data,"username")
    })      
  }, [])

  const mybtn = (window as any)?.wldp?.connectionWallet
    
//  for do payment 
  
  const handleAfterPayClose = () => setAfterPay(false);
  const handleAfterPayShow = () => setAfterPay(true);


  const afterPayPopup = (type:any ,msg:any) => {
  if (type=="error") {
   Swal.fire({
    icon: 'error',
    title: 'Payment Failed',
    // text: 'Your account balance is : ${balance} , This is insufficient balance for this payment',
    html: "<span>Your account balance is : " + (getbalance)  + " , This is insufficient balance for this payment</span>", 
    showCancelButton: true,
    cancelButtonColor: '#d33',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#543cd6',
     confirmButtonText: 'Try Again',
      allowOutsideClick: false,
  allowEscapeKey: false,
  // footer: '<a href="">Why do I have this issue?</a>'
}).then( async (result) => {
  if (result.isConfirmed) {
   handleAfterPayClose()
    send()
  } else if (result.isDismissed) {
    // setSelectPayment(0);
    // setSelectCoin("none");
   navigate("/profile/mine")
    await mybtn("disconnect", "true").then(() => {
        setConnectOrNot(!connectOrNot)
      })
  }
})
    } 

   if (type=="success") {
   Swal.fire({
    icon: 'success',
    title: 'Payment Successfull',
    text: msg,
    showCloseButton: false,
    confirmButtonColor: '#543cd6',
     confirmButtonText: 'Ok',
    allowOutsideClick: false,
  allowEscapeKey: false,
  // footer: '<a href="">Why do I have this issue?</a>'
}).then( async (result) => {
  if (result.isConfirmed) {
    handleAfterPayClose()
     navigate("/profile/mine")
    await mybtn("disconnect", "true").then(() => {
        setConnectOrNot(!connectOrNot)
      })
    // send()
  }
})
  }    
}

const payNow = () => {
    const headers = {
  'Content-Type': 'application/json',  
      "accept": "application/json",
  // @ts-ignore
 "Authorization": `Bearer ${auth?.currentUser?.accessToken}`,
    }
  
  const data = {
    userId: `${user?.uid}`,
    userEmail: `${sessionStorage.getItem("wldp_user")}`,
    walletType: `${localStorage.getItem("wldp-cache-provider")}`,
    amount: payamount,
    network: "5",
    // @ts-ignore
    origincurrency: `${coinInfo?.symbol.toLowerCase()}`,
    token: "ETH"
}
  
axios.post("https://us-central1-coin-parliament-staging.cloudfunctions.net/api/v1/payment/makePayment", data, {
    headers: headers
  })
  .then( async (response) => {
    // console.log(response.data ,"response")
    
    // await showToast(response?.data?.message)    
    setPayButton(false);
    // setSelectPayment(0);
    // setSelectCoin("none");
    // await mybtn("disconnect", "true").then(() => {
    //     setConnectOrNot(!connectOrNot)
    //   })
    handleAfterPayShow()
    afterPayPopup("success",response?.data?.message)
  })
  .catch((error) => {
    showToast(error.message,ToastType.ERROR)
    console.log(error
      , "errorpayment")
  })
  }
  
  const GetBalance = (accoutnId:any , token:any) => {
    const headers = {
  'Content-Type': 'application/json',  
      "accept": "application/json",
  // @ts-ignore
 "Authorization": `Bearer ${auth?.currentUser?.accessToken}`,
    }  
axios.get(`${ApiUrl}payment/balance/${accoutnId}/ethereum/${token}`,{
    headers: headers
  })
  .then((response) => {
    const balance = response?.data?.data?.balance;
    if (balance >= payamount) {
      setGetbalance(balance)
      payNow()
    } else {
      // showToast(`Your account balance is : ${balance} , This is insufficient balance for this payment`, ToastType.ERROR)  
      setPayButton(false)
      // setSelectPayment(0);
      // setSelectCoin("none");
      handleAfterPayShow()
      afterPayPopup("error",response?.data?.message)
      // mybtn("disconnect", "true").then(() => {
      //   setConnectOrNot(!connectOrNot)
      // })

    }
  })
  .catch((error) => {
    // showToast(error.message,ToastType.ERROR)
    console.log(error
      , "errorpayment")
  })
  }  

  const send = () => {
    const obj = {
      method: "getTransaction",      
      user: `${sessionStorage.getItem("wldp_user")}`,
      params: {
        // @ts-ignore
        origincurrency: `${coinInfo?.symbol.toLowerCase()}`,
        amount: payamount,
        // @ts-ignore
        // token:"ETH",
        token:`${coinInfo?.symbol.toUpperCase()}`,
        network: "5"
      },
      application: "votetoearn",
      uid:`${sessionStorage.getItem("wldp_wsid")}`,
    };
    console.log(obj, "alldata");
    (window as any).wldp.send_msg(obj).then((res: any) => {
      // @ts-ignore
      GetBalance(`${sessionStorage.getItem("wldp_account")}`, `${coinInfo?.symbol.toUpperCase()}`)    
      
    }).catch((err:any) => {
      console.log(err, "allerr")
      
    })
  };

  console.log(walletName ,"setWalletName")

  return (
    <div
      style={{
        width: "100%",
      }}
      className="d-flex justify-content-center flex-column align-items-center"
    >       
      <div className="mt-3">
        <h4>Select Payment Mode</h4>
      </div>  
      <Boxdiv className={`${window.screen.width > 767 ?"mt-5" : "mt-3"}`}
        style={{
        justifyContent:`${selectPayment == 0 ? "center" :""}`
      }}
      >
        <Opctiondiv>
          <div
            style={{
              cursor:"pointer",
              borderBottom: "1px solid white",
              background:`${selectPayment && "linear-gradient(180.07deg, #543CD6 0.05%, #361F86 48.96%, #160133 99.94%)"}`,
            }}
            onClick={() => {
              setSelectPayment(1)
            }}
          >
            <i className="bi bi-coin"></i>
            <p className="mx-2">Cryptocurrency</p>
          </div>
          <div
            style={{
              cursor: "not-allowed",
          }}
          >
            <i className="bi bi-credit-card-fill "></i>
            <p className="mx-2">Debit & Credit cards</p>
          </div>
        </Opctiondiv>
        {selectPayment == 1 && selectCoin == "none" && <Sidediv>
          <div className="pay-custom-select-container"            
          >
        <div
          className={showOptionList ? "pay-selected-text active" : "pay-selected-text"}
            onClick={() => {              
              setShowOptionList(!showOptionList)
            }
            }              
        >
          {selectCoin !=="none" ? selectCoin : "Select coin" }
        </div>
        {showOptionList && (
              <ul className="pay-select-options"
                style={{
                height:`${window.screen.width > 767 ?"300px" : "200px"}`
              }}
              >
            {coinsList.map((option:any ,index:number) => {
              return (
                <li
                  className="pay-custom-select-option"
                  data-name={option.name}
                  key={option.id}
                  onClick={ async () => {
                    setSelectCoin(option.name)
                    setCoinInfo(option)
                    setShowOptionList(!showOptionList)
                    await mybtn("disconnect", "true").then(() => {
                      setConnectOrNot(!connectOrNot)
                    })
                  }}
                >
                  {option.name}
                </li>
              );
            })}
          </ul>
        )}
      </div>
        </Sidediv>}
        

        {selectCoin != "none" && <Paymentdiv>
          <div className="d-flex flex-column justify-content-center align-items-center">
              <p
                  className="my-1"
                  style={{
                  fontSize:"20px"
                }}
            >Pay 99$ using {selectCoin}</p>
             {!walletName && 
              <>
              <p className="my-1"
                style={{
                fontSize:`${window.screen.width > 767 ?"13px" :"11px"}`,
              }}
              >
                Your are not connected with any wallat !
                  <span
                    style={{
                      color: "#3366CC",
                    cursor: "pointer",
                        fontSize:`${window.screen.width > 767 ?"13px" :"12px"}`,                      
                      }}
                  onClick={async () => {                  
                    await mybtn("disconnect", "true")
                    setConnectOrNot(true)
                    await mybtn("connect").then((data: any) => {
                      setConnectOrNot(false)
                      // @ts-ignore
                      setWalletName(localStorage.getItem("wldp-cache-provider"))
                    })
                  }}
                >  &nbsp; Connect Now </span></p>
              </>
            }                           
          </div>
        </Paymentdiv> }       
      </Boxdiv>
      {selectCoin != "none" &&
        localStorage.getItem("wldp-cache-provider") &&
      <Divbutton>
        <button
          style={{
            marginRight: "20px",
            border: "1px solid #543cd6",
            color: "#543cd6",
            background: "none",
            }}
            onClick={ async () => {
                setSelectCoin("none")
                // mybtn("disconnect", "true")
              setCoinInfo([])
              await mybtn("disconnect", "true").then(() => {
        setConnectOrNot(!connectOrNot)
      })
              }}
        >Cancel</button>
        <button
          style={{
            background: "#543cd6",
              color: "white",
            opacity:`${payButton ?"0.6":"1"}`
            }}
            disabled={payButton}
            onClick={ async () => {          
              send()
              setPayButton(true)
            }}
        >Pay Now</button>
      </Divbutton>
      }
      
        {/* <Modal
          className=""
          show={
          afterPay
          } onHide={handleAfterPayClose}
          // fullscreen="sm-down"
          backdrop="static"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: "2200" }}
        // contentClassName={"modulebackground"}
        >
          <div className="d-flex justify-content-end">
            <button type="button" className="btn-close" aria-label="Close" onClick={() => {
              handleAfterPayClose()
            }}
            // style={{color:"white" , border:"1px solid red"}}
            >

            </button>
          </div>
          <Modal.Body
          >       
               
            <div>Hello i am popup</div>
          </Modal.Body>
        </Modal> */}
      

      </div>    
  );
};

export default CoinsList;
