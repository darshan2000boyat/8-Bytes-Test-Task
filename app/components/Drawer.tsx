import React from "react";
import Link from "next/link";
import { MdSpaceDashboard, MdBarChart } from "react-icons/md";
import { PiChartDonutFill } from "react-icons/pi";

const Drawer = () => {
  return (
    <div className="drawer">
      {/* Checkbox toggle (linked with Navbar) */}
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="menu bg-white text-black min-h-full w-80 p-6 pt-28 space-y-3 text-lg font-medium">
          <li>
            <Link href="/" className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-100">
              <MdSpaceDashboard className="text-2xl" /> Dashboard
            </Link>
          </li>
          <li>
            <Link href="/portfolio" className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-100">
              <MdBarChart className="text-2xl" /> Portfolio
            </Link>
          </li>
          <li>
            <Link href="/about" className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-100">
              <PiChartDonutFill className="text-2xl" /> Sector Groups
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
