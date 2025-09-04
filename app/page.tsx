import Image from "next/image";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Drawer from "./components/Drawer";
import DashboardLayout from "./components/DashboardLayout";

export default function Home() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Drawer />
      <DashboardLayout />
    </>
  );
}
