import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "../../common/models/Dictionary";
import { AvatarType } from "../../assets/avatars/Avatars";
import AvatarRadio from "./AvatarRadio";
import NFT from "../../assets/avatars/NFT";
import { useWindowSize } from "../../hooks/useWindowSize";
import UserContext from "../../Contexts/User";
import { useLocation } from "react-router-dom";

type AvatarsModalProps = {
  onSubmit: (type: AvatarType) => Promise<void>;
  onClose: () => void;
};

const Title = styled.div`
  font: var(--font-style-normal) normal medium 22px/11px
    var(--font-family-poppins);
  font-size: var(--font-size-22);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-6352e8);
  text-align: center;
  opacity: 1;
  padding: 20px;
  font-weight:400 !important;
`;

const Flex = styled.div`
  display: grid;
  grid-template-columns: repeat(
    ${(props: { width?: number }) =>
      props.width && props.width > 969 ? "5" : "2"},
    1fr
  );
  grid-gap: 10px;
  align-items: center;

  > div {
    align-self: center;
    justify-self: center;
  }
`;
const ModelWrapper = styled.div`
width:${window.screen.width>979?'350px':''}

`;

const Container = styled.div`
  background: var(--color-d4d0f3) 0 0% no-repeat padding-box;
  padding: 10px;
`;
const CloseIcon =styled.span`
color: var(--color-6352e8);
font-size: var(--font-size-22);
`

const AvatarsModal = ({ onSubmit, onClose }: AvatarsModalProps) => {
  const translate = useTranslation();
  const { width } = useWindowSize();
  const { userInfo } = useContext(UserContext);
  const [selectedAvatar,setSelectedAvatar]=useState('')
  const location = useLocation();
  const pathname = location.pathname
  
  return (
    <Container className="position-relative">
      <div className="position-absolute top-0" style={{ right: 0 }}>
        {pathname.includes('profile') && <div className="p-2 pl-0 close" role="button" onClick={onClose}>
          <CloseIcon aria-hidden="true">&times;</CloseIcon>
        </div>}
      </div>
  { !selectedAvatar &&(<>   <Title>{translate("Select Your Avatar")}</Title>
      <Flex {...{ width }}>
        {Object.values(AvatarType).map((type, i) => (
          <AvatarRadio
            key={i}
            type={type}
            checked={type === userInfo?.avatar}
            name={"avatars"}
            id={"avatar-" + type}
            onSubmit={() => onSubmit(type)}
            onClick={(id: string) => {
              // showModal(<NFT id={id} />);
              if(!selectedAvatar)setSelectedAvatar(id)
            }}
            
          />
        ))}
      </Flex></>)}
      {selectedAvatar && (<ModelWrapper style={{left:window.screen.width>979 ? "38%" : "auto"}} ><NFT setSelectedAvatar={setSelectedAvatar} id={selectedAvatar} /></ModelWrapper>)}
    </Container>
  );
};

export default AvatarsModal;
