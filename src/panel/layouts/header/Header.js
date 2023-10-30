import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import LogoWhite from "../../assets/images/logos/amplelogowhite.svg";
import { useRouter } from "next/router";
import { Avatar } from "@material-tailwind/react";


const Header = ({ showMobmenu }) => {


  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [user, setUser] = useState({value: null})
  

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };



  const [businessName, setBusinessName] = useState('')

  const router = useRouter()


  useEffect(() => {
    const myUser = JSON.parse(localStorage.getItem('myUser'))
    if(myUser.businessName){
      setBusinessName(myUser.businessName)
    }
    else{
      setBusinessName(myUser.name)
    }
  }, [])


  // Logout function
  const logout = ()=>{
    localStorage.removeItem("myUser");
    setUser({value:null});
    router.push(`/login`);
  }

  let headerColor = 'bg-gray-800';

  return (

    <div className={`${headerColor} text-white px-4 py-2`}>

      <div className="flex justify-between items-center">

        <div>
          <h1 className="font-normal text-lg">Hey! 
            <span className="font-semibold ml-1">
              {businessName}
            </span>
          </h1>
        </div>
        <div className="flex space-x-5">
        
          <Dropdown isOpen={dropdownOpen} toggle={toggle} >
             <DropdownToggle color="secondary" className="p-0">
               <div className={`${headerColor}`} style={{ lineHeight: "0px" }}>
                  <Avatar
                    src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60'
                    alt="avatar"
                    withBorder={true}
                    className="p-0.5"
                  />
               </div>
             </DropdownToggle>
             <DropdownMenu>
               <DropdownItem header>Info</DropdownItem>
               <DropdownItem href="/myaccount">Edit Profile</DropdownItem>
               <DropdownItem divider />
               <DropdownItem onClick={logout}>Logout</DropdownItem>
             </DropdownMenu>
           </Dropdown>
        </div>

      </div>

    </div>
  );
};
export default Header;