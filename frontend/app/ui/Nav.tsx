import Link from "next/link";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/[...nextauth]";

const Nav = async () => {
  const session = await getServerSession(options);

  return (
    <header className="font-bold bg-nav text-default-text">
      <nav className="flex justify-between items-center w-full px-10 py-4">
        <div className="flex justify-start gap-10">
          <div>The REFT Bois</div>
          <Link href="/">Home</Link>
          <Link href="/Tokenize">Tokenize</Link>
        </div>
        <div className="text-decoration-line: underline flex gap-10">
          {session ? (
            <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
          ) : (
            <div className="flex gap-10">
              <Link href="/api/auth/signin">Login</Link>
              <Link href="/Register">Sign up</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Nav;
