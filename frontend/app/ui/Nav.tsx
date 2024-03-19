import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";

function Nav() {
  return (
    <Navbar fluid rounded>
      <NavbarBrand href="/">
        <img src="/images/Dunno.jpg" className="mr-3 h-6 sm:h-9" alt="LOGO" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          REFT
        </span>
        <ThemeSwitch />
      </NavbarBrand>
      <div className="flex md:order-2">
        <UserDropdown />
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink href="#" active>
          Home
        </NavbarLink>
        <NavbarLink href="#">Thing 1</NavbarLink>
        <NavbarLink href="#">Thing 2</NavbarLink>
        <NavbarLink href="#">Thing 3</NavbarLink>
        <NavbarLink href="#">Thing 4</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}

export default Nav;
