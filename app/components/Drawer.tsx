import React from "react";
import Link from "next/link";
import { MdSpaceDashboard, MdBarChart } from "react-icons/md";
import { PiChartDonutFill } from "react-icons/pi";
import { TbBulb } from "react-icons/tb";

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

        <div className="bg-white text-black min-h-full w-80 p-6 flex flex-col justify-between">
          {/* Menu */}
          <ul className="space-y-3 text-lg font-medium pt-20">
            <li>
              <Link
                href="/"
                className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-100"
              >
                <MdSpaceDashboard className="text-2xl" /> Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/portfolio"
                className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-100"
              >
                <MdBarChart className="text-2xl" /> Portfolio
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-100"
              >
                <PiChartDonutFill className="text-2xl" /> Sector Groups
              </Link>
            </li>
          </ul>

          {/* Bottom Card */}
          <div className="card bg-black text-white w-full h-72 mt-6">
            <div className="card-body p-4">
              <div className="flex gap-2">
                <TbBulb className="text-2xl" />
                <h3 className="text-lg font-bold">Insightful</h3>
              </div>
              <p className="text-sm leading-7 text-gray-300">
                This is a demo financial dashboard application built with
                Next.js and Tailwind CSS for test task provided by 8Byte
                developed by <span className="font-bold"> Darshan Boyat.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
