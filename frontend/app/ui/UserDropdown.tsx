import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react";

const UserDropdown = () => {
  return (
    <div>
      <Dropdown
        arrowIcon={false}
        inline
        label={
          <Avatar
            alt="User settings"
            img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            rounded
          />
        }
      >
        <DropdownHeader>
          <span className="block text-sm">Username</span>
          <span className="block truncate text-sm font-medium">
            name@email.com
          </span>
        </DropdownHeader>
        <DropdownItem>Tokens</DropdownItem>
        <DropdownItem>Wallet</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
        <DropdownDivider />
        <DropdownItem>Sign out</DropdownItem>
      </Dropdown>
    </div>
  );
};

export default UserDropdown;
