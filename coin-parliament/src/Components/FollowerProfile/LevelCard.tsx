import React from "react";
import styled from "styled-components";
import { UserTypeProps } from "../../common/models/UserType";
import { UserProps } from "../../common/models/User";
import { useTranslation } from "../../common/models/Dictionary";
import  './Style.css';

type LevelCardProps = {
  userTypes: UserTypeProps[];
  userInfo?: UserProps;
};

const Badge = styled.span`
  background-color: #6352E8;
  font-weight: lighter;
  color: white;
  font-size: 10px;
  text-transform: uppercase;
  // width: 90px;
  text-align: center;
  display: inline-block;
  padding: 0.35em 0.65em;
  white-space: nowrap;
  vertical-align: baseline;
  line-height: 1;
`;
const I = styled.i`
  border-radius: 50%;
  position: absolute;
  font-size: 11px;
  top: 7px;
  right: 7px;
  
  font-weight:300;
  color: #6352E8;
 
    width: 16px;
    height: 16px;

    text-align: center;

    
`;
const LevelCard = ({ userInfo, userTypes }: LevelCardProps) => {
  const translate = useTranslation();
  const [tooltipShow, setTooltipShow] = React.useState(false);
  return (
    <div className=" cp_level dark_prpl_bkgnd mx-auto pb-4" style={{ position: 'relative' }}>
      {tooltipShow &&
          <div
            style={{
            display:"relative"
          }}
          >
              <div className="newtooltip2"
              style={{
                // right: "0%",
                marginLeft: "16%",
                marginTop:"0%",
                }}
              >
                  <p>Your CMP count</p>
              </div>
              </div>
            }
      <I className="bi bi-info-circle"
      onMouseDown={(e) => {
             setTooltipShow(false)
            }}
            onMouseUp={(e) => {
             setTooltipShow(true)
            }}
            onMouseEnter={() => setTooltipShow(true)}
            onMouseLeave={() => setTooltipShow(false)}       
      ></I>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <h6 className="mt-1 box_title card-header mb-2" style={{fontSize:'12px'}}>
          {translate("User Level")}
        </h6>
        {userTypes.sort((a,b) => b.index - a.index).map((userType, i) => {
            const opacity =
              userInfo?.status?.name === userType.name ? "" : " opacity-50";
            return (
              <Badge className={"rounded-pill mt-1" + opacity} key={i}>
                {userType.name}
              </Badge>
            );
          })}
        {/* <ul className="list-group mx-auto mb-3">
          {userTypes.sort((a,b) => b.index - a.index).map((userType, i) => {
            const opacity =
              userInfo?.status?.name === userType.name ? "" : " opacity-50";
            return (
              <Badge className={"rounded-pill mt-1" + opacity}>
                {userType.name}
              </Badge>
            );
          })}
        </ul> */}
      </div>
    </div>
  );
};

export default LevelCard;
