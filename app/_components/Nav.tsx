import AuthButton from "./AuthButton";
import User from "./User";
import Logo from "./Logo";
import Link from "next/link";

const Nav = () => {
  return (
    <div className="flex items-center justify-between w-full h-[50px] bg-sky-200 px-5">
      <Logo />
      <div className="flex gap-2">
        <User />
        <AuthButton />
      </div>
    </div>
  );
};

export default Nav;
