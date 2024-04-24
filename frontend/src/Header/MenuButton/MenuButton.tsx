import React, { useContext, useEffect, useState, useRef } from "react";
import MenuButtonIcon from "./MenuButtonIcon";
import AuthContext from "../../store/auth-context";
import ProfileMenuDropdown from "../Dropdown/ProfileMenuDropdown";
import AuthDropdown from "../Dropdown/AuthDropdown";
import classes from "./MenuButton.module.css";
import { MouseEvent } from "../../sharedTypes/types";

const MenuButton = () => {
  const authContext = useContext(AuthContext);

  // const ref = useRef();
  const ref = useRef<HTMLDivElement | null>(null);

  const [dropdown, setDropdown] = useState<{
    show: boolean;
    component: JSX.Element | undefined;
  }>({
    show: false,
    component: undefined,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (!ref.current) return;

      if (isMenuOpen && !ref.current.contains(e.target)) {
        setIsMenuOpen(false);
        closeDropdown(e);
      }
    };

    window.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      window.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isMenuOpen]);

  const closeDropdown = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    setDropdown({ show: false, component: undefined });
  };

  const showDropDownHandler = (event: any) => {
    if (!dropdown.show) {
      const component = authContext.isLoggedin ? (
        <ProfileMenuDropdown closeDropdown={closeDropdown} />
      ) : (
        <AuthDropdown closeDropdown={closeDropdown} />
      );
      setDropdown({ show: true, component });
      setIsMenuOpen(true);
    } else {
      closeDropdown(event);
      setIsMenuOpen(false);
    }
  };

  return (
    <div
      className={classes["header-menu-button-container"]}
      onClick={showDropDownHandler}
      ref={ref}
    >
      <MenuButtonIcon isLoggedin={authContext.isLoggedin} />
      {dropdown.show && dropdown.component}
    </div>
  );
};

export default MenuButton;
