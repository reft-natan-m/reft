import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "../api/auth/[...nextauth]/[...nextauth]";

const Tokenize = async () => {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/Tokenize");
  }
  return <div>Tokenize</div>;
};

export default Tokenize;
