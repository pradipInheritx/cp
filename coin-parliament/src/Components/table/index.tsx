import { texts } from 'Components/LoginComponent/texts';
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components';
import { ButtonGroup } from "react-bootstrap";
import Button from "Components/Atoms/Button/Button";
import moment from 'moment';

const RewardList = styled.p`
  font-size: 10px;
  color: white;
  cursor: pointer;   
   padding:15px;   
`;
// const tableHeader = ["Transaction id", "Date", "Item", "Amount", "Payment method"];
export type tableColumnType = {
    title: string;
    assessorName: string;
    Row?: React.FC<{ value: any, data?: any }>;
}



interface TableType<T> {
    data: T[];
    headers: tableColumnType[];
    totalRecord?: number;
    loading?: boolean;
    pageSize?: number;
    pageIndex?: number;
    setPageIndex?: React.Dispatch<React.SetStateAction<number>>;
}
const Index = <T,>({ data, headers, totalRecord = 0, loading = false, pageSize, pageIndex, setPageIndex }: TableType<T>) => {
    return (
        <>
            <div className='d-flex justify-content-around w-100 py-3' style={{ background: "#7456ff" }}>
                {
                    headers.map((item: tableColumnType, index: number) => {
                        return (<div style={{ width: `19%` }} key={index}>
                            <strong>{item?.title}</strong>
                        </div>)
                    })
                }
            </div>
            {!loading && data.map((value: any, index: number) => {
                return (
                    <div className='d-flex justify-content-around' key={index} style={{ textAlign: "center", }}>
                        {
                            headers.map((item: tableColumnType, i: number) => {
                                return (
                                    <div style={{ width: "19%" }} key={i}>
                                        <RewardList>
                                            {item?.Row ?
                                                <item.Row value={value[item?.assessorName] || 'NA'} data={value} />
                                                : (value[item?.assessorName] || "NA")}
                                        </RewardList>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            })}
            {loading &&
                <div className='d-flex justify-content-around w-100 mt-4 mb-4'>
                    <span className='loading'>Loading...</span>
                </div>
            }
            {(!loading && !data?.length) && (
                <div className='d-flex justify-content-around w-100 mt-4'>
                    {
                        headers.map((val, index) => {
                            return (
                                <div key={index} className=''
                                    style={{
                                        width: `${(100 / headers.length) - 1}`,
                                    }}
                                >
                                    <RewardList>-</RewardList>
                                </div>)
                        })
                    }
                </div>
            )}
            {(!!totalRecord && pageSize && setPageIndex && pageIndex) && <>
                <ButtonGroup>
                    <Button
                        disabled={pageIndex === 1}
                        onClick={() => setPageIndex(prev => prev - 1)}
                        style={{ marginRight: '1em' }}
                    >
                        {texts.Prev}
                    </Button>
                    <Button
                        disabled={pageIndex * pageSize >= totalRecord}
                        onClick={() => setPageIndex(prev => prev + 1)}
                    >
                        {texts.Next}
                    </Button>
                </ButtonGroup>
            </>}
        </>
    )
}

export default Index;