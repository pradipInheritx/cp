import { texts } from 'Components/LoginComponent/texts';
import { httpsCallable } from 'firebase/functions';
import React, { useContext, useEffect, useState } from 'react'
import { functions } from "firebase";
import UserContext from 'Contexts/User';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ButtonGroup } from "react-bootstrap";
import Button from "Components/Atoms/Button/Button";
import moment from 'moment';
import AppContext from 'Contexts/AppContext';
import axios from 'axios';
import { auth } from "firebase";
import { getPaginationData } from 'common/utils/helper';

const RewardList = styled.p`
  font-size: 10px;
  color: white;
  cursor: pointer;   
   padding:15px;   
`;
const getRewardTransactions = httpsCallable(functions, "getRewardTransactions");
function PaymentHistory() {

  const { setAlbumOpen } = useContext(AppContext);
  const { userInfo, user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [tableHeader, setTableHerder] = useState<any>([
    "Order ID", "Date", "Item", "Amount", "Payment method"
  ]);
  const [pageIndex, setPageIndex] = useState(0);
  const [rowData, setRowData] = useState<any>([]);
  const [paginationData, setPaginationData] = useState<any[]>([]);
  const ApiUrl = "https://us-central1-coin-parliament-staging.cloudfunctions.net/api/v1/"
  let navigate = useNavigate();

  useEffect(() => {
    getPaymentList()
  }, [])

  const getPaymentList = () => {
    const headers = {
      'Content-Type': 'application/json',
      "accept": "application/json",
      // @ts-ignore
      "Authorization": `Bearer ${auth?.currentUser?.accessToken}`,
    }
    axios.get(`${ApiUrl}payment/getTransactionHistory/${user?.uid}`
      , {
        headers: headers
      }
    )
      .then(async (response) => {
        setRowData(response.data.data)
        console.log(response.data.data, "response.data")
      })
      .catch((error) => {

      })
  }

  useEffect(() => {
    setPaginationData(getPaginationData(rowData, pageIndex, 10));
  }, [rowData, pageIndex]);

  return (
    <div className='pt-3 pb-3'>
      <div
        style={{
          background: "#1e0243",
          textAlign: "center",
          color: "white",
          fontSize: "12px",
          marginTop: "30px",
          marginBottom: "30px",
          paddingBottom: "20px",
          width: `${window.screen.width > 767 ? "730px" : "100%"}`,
          margin: "auto",
        }}>
        {/* Order ID | Date | Item |  Amount (fiat) | Payment method (The coin if it's cryptocurrency ) */}

        <div className='d-flex justify-content-around w-100 py-3'
          style={{
            background: "#7456ff"
          }}
        >
          {
            tableHeader.map((item: string, index: number) => {
              return (<div className=''
                style={{
                  width: `19%`,
                }}
              >
                <strong>{item}</strong>
              </div>)
            })
          }
        </div>
        {paginationData.map((item: any, index: number) => {
          return (
            <div className='d-flex justify-content-around'
              style={{
                textAlign: "center",

              }}
            >
              <div
                style={{
                  width: "19%"
                }}
              >
                <RewardList>
                  {item?.paymentDetails?.trx?.transactionHash || "NA"}
                </RewardList>
              </div>
              <div
                style={{
                  width: "19%"
                }}
              >
                <RewardList>
                  {/* {item?.transaction_time?._seconds} */}
                  {item?.transaction_time?._seconds ? moment(new Date(item?.transaction_time?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'}
                </RewardList>
              </div>
              <div
                style={{
                  width: "19%"
                }}
              >
                <RewardList>
                  {item?.transactionType == "EXTRAVOTES" ? item?.numberOfVotes + " " + "Extra Votes" : item?.transactionType || "-"}
                </RewardList>
              </div>
              <div
                style={{
                  width: "19%"
                }}
              >
                <RewardList>
                  ${item?.amount}
                </RewardList>
              </div>
              <div
                style={{
                  width: "19%"
                }}
              >
                <RewardList>
                  {item?.token || "-"}
                </RewardList>
              </div>
            </div>
          )
        })}


        {!rowData?.length && (
          <>
            {" "}
            <div className='d-flex justify-content-around w-100 mt-4'>
              {
                tableHeader.map((item: string, index: number) => {
                  return (
                    <div className=''
                      style={{
                        width: `${(100 / tableHeader.length) - 1}`,
                      }}
                    >
                      <RewardList>-</RewardList>
                    </div>)
                })
              }
            </div>
            <p className='solid' style={{ margin: "28px" }}></p>
          </>
        )}
        <ButtonGroup>
          <Button
            disabled={pageIndex === 0}
            onClick={() => setPageIndex(prev => prev - 1)}
            style={{ marginRight: '1em' }}
          >
            {texts.Prev}
          </Button>
          <Button
            disabled={(pageIndex + 1) * 10 >= rowData.length}
            onClick={() => setPageIndex(prev => prev + 1)}
          >
            {texts.Next}
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}

export default PaymentHistory