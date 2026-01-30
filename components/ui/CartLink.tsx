import { linkBaseClass } from "./Navbar";
import type { MouseEventHandler } from "react";
import { NavLink } from "./NavLink";
import Image from "next/image";

export default function CartLink({
  onClick,
}: {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <NavLink
      href="/cart"
      onClick={onClick}
      className={({ isActive }) =>
        `${linkBaseClass} flex items-center justify-center border-2 border-white/30 ${
          isActive ? "bg-sky-500" : "bg-sky-700"
        }`
      }
    >
      <Image src={"/icons/cart.png"} alt="Cart" width={24} height={24} />{" "}
      <p>Cart</p>
    </NavLink>
  );
}
