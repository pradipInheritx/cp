import React from "react";
import {Image} from "react-bootstrap";

export enum AvatarType {
  Angel = "Angel",
  Founder = "Founder",
  Hodler = "Hodler",
  Investor = "Investor",
  Trader = "Trader",
}

type AvatarsProps = {
  type: AvatarType;
  width?: number;
};

export const importFile = (name: string, ext: string = "png") => {
  let src = { default: "" };
  try {
    src = require(`${name}.${ext}`);
  } catch (e) {
  }

  if (!src) {
    src = { default: "" };
  }

  if (typeof src === "string") {
    src = { default: src as unknown as string };
  }

  return src;
};

const Avatars = ({ type = AvatarType.Angel, width = 160 }: AvatarsProps) => {
  const src = importFile(`./The${type}`).default || "";

  return <Image width={width} roundedCircle={true} src={src} />;
};

export default Avatars;
