import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import UserContext from "../../Contexts/User";
import Share from "./Share";
import Info from "./Info";
import { getUsers } from "./Follow";
import { Leader } from "../../Contexts/CoinsContext";
import PoolMiningCard from "./PoolMiningCard";

const Pool = () => {
  const { user, userInfo } = useContext(UserContext);
  const referralUrl = `${document.location.protocol}//${document.location.host}/?refer=${user?.uid}`;
  const [children, setChildren] = useState<Leader[]>([]);
  const childrenActivity = Number(
    Number(userInfo?.voteStatistics?.commission || 0).toFixed(2) || 0
  );
console.log('referal user',children)
  useEffect(() => {
    getUsers({ users: userInfo?.children, setUsers: setChildren });
  }, [userInfo?.children]);

  return (
    <>
      <Container className="pt-4">
        <div className="mb-3">
          <Share
            url={referralUrl}
            text={"share & earn"}
            shareText={"coin parliament"}
          />
        </div>
        <div className="mb-3">
          <Info
            friends={userInfo?.children?.length || 0}
            cpm={childrenActivity || 0}
          />
        </div>
        <div>
          {children.map((child) => {
            return (
              <div className="mb-2">
                <PoolMiningCard user={child} />
              </div>
            );
          })}
        </div>
      </Container>
    </>
  );
};

export default Pool;
