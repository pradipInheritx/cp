import {Button, Container, Nav, Navbar, Offcanvas} from "react-bootstrap";
import React, {useContext} from "react";
import {Link} from "react-router-dom";
import {useTranslation} from "../common/models/Dictionary";
import {ContentPage} from "../Contexts/ContentContext";
import AppContext from "../Contexts/AppContext";
import styled from "styled-components";
import {Gradient2} from "../styledMixins";
import Hamburger from "./Atoms/Hamburger";
import {useWindowSize} from "../hooks/useWindowSize";
import UserContext from "../Contexts/User";
import {isHomeBg} from "./App/App";

export const convertPageToMenuItem = (page: ContentPage) => {
  return {
    label: page.title,
    href: `/${page.slug}`,
  } as MenuItem;
};

export type MenuProps = {
  title?: string;
  onSelect: (eventKey: string | null) => void;
  children?: React.ReactNode;
  items: (MenuItem | undefined)[];
  pathname: string;
};

export type MenuItem = {
  eventKey?: string;
  label: string;
  href?: string;
};

const MenuContainer = styled(Offcanvas)`
  & a {
    font: var(--font-style-normal) normal var(--font-weight-normal)
      var(--font-size-13) / 29px var(--font-family-poppins);
    text-align: left;
    letter-spacing: 0.26px;
    color: var(--white);
    text-transform: capitalize;
    opacity: 1;
    &:hover {
      opacity: 0.7;
      color: var(--white);
    }
    &:focus {
      opacity: 0.7;
      color: var(--white);
    }
  }
  ${Gradient2}
`;

const NavContainer = styled(Navbar)`
  background: ${(props: { pathname: string }) => isHomeBg(props.pathname) ? "#160133" : "transparent"};
  position: fixed;
  width: 100%;
  z-index: 1000;
`;

const Dot = styled.div`
  border-radius: 50%;
  position: absolute;
  font-size: 40px;
  top: -20px;
  right: 3px;
  text-shadow: -1px 0 1px white;
  color: ${(props: { loggedIn: boolean }) => `${props.loggedIn ? "green" : "red"}`}
`;
const Menu = ({onSelect, children, items = [], title, pathname}: MenuProps) => {
  const {menuOpen, setMenuOpen, login, firstTimeLogin} =
    useContext(AppContext);

  const {user} = useContext(UserContext);
  const {width} = useWindowSize();
  const handleClose = () => setMenuOpen(false);
  const handleShow = () => setMenuOpen(true);
  const translate = useTranslation();

  const desktop = width && width > 979;
  return (
    <>
      <NavContainer
        pathname={pathname}
        collapseOnSelect
        expand="lg"
        style={{
          paddingRight:window.screen.width>979?'100px':'',
          paddingLeft:window.screen.width>979?'20px':'',
          background:
            login || firstTimeLogin || (width && width > 979)
              ? "var(--color-160133)"
              : undefined,
          boxShadow: width && width > 979 ? "1px 1px 4px #6352e8" : undefined,
        }}
      >
        <Container
          className="text-capitalize align-items-center px-2 justify-content-start"
          fluid={true}
        >
          {!desktop && (
            <div className="d-flex justify-content-start" style={{flexBasis: "25%"}}>
              <Button variant="link" onClick={handleShow} className="position-relative">
                <Hamburger/>
                {/* <Dot {...{loggedIn: !!user}}>•</Dot> */}
              </Button>
            </div>
          )}
           {desktop && (
            <div className="d-flex justify-content-start" >
              <Button variant="link" onClick={handleShow} className="position-relative">
                <Hamburger/>
                {/* <Dot {...{loggedIn: !!user}}>•</Dot> */}
              </Button>
            </div>
          )}
          {children}
         
        </Container>
      </NavContainer>

      <MenuContainer show={menuOpen} onHide={handleClose}>
        <Offcanvas.Header closeButton closeVariant="white">
          {title && <Offcanvas.Title>{title}</Offcanvas.Title>}
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Nav onSelect={onSelect} className="flex-column">
            {items
              .filter((item) => item)
              .map((item, i) => {
                if (item?.label === "-") {
                  return <React.Fragment key={i} />;
                }
                if (item?.label === "x") {
                  return <React.Fragment key={i} />;
                }
                if (item?.label === "---") {
                  return <hr key={i} />;
                }
                return item?.href ? (
                  <Nav.Link
                    key={i}
                    as={Link}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {translate(item.label)}
                  </Nav.Link>
                ) : (
                  <Nav.Link key={i} eventKey={item?.eventKey}>
                    {item && translate(item.label)}
                  </Nav.Link>
                );
              })}
          </Nav>
        </Offcanvas.Body>
      </MenuContainer>
    </>
  );
};

export default Menu;
