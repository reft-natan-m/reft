import Link from "next/link";

const Nav = () => {
  return (
    <nav className="flex justify-between bg-nav p-4">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <p className="text-default-text">Home</p>
        </Link>
        <Link href="/Tokenize">
          <p className="text-default-text">Tokenize</p>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <p className="text-default-text">Login</p>
        <p className="text-default-text">Logout</p>
      </div>
    </nav>
  );
};

export default Nav;
