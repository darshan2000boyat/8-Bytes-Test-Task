import Image from "next/image";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Drawer from "./components/Drawer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Drawer />
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pt-32 text-black gap-16">
        Impletement soon...
      </div>
    </>
  );
}
