import React from "react";

const DashboardLayout = () => {
  return (
    <section className="w-full lg:w-[80%] min-h-screen overflow-y-scroll bg-white grid grid-cols-1 gap-6 pt-24 pb-12 px-4">
      {/* Row 1: 4 cards */}
      <aside className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <section className="w-full h-48 bg-black rounded-lg"></section>
        <section className="w-full h-48 bg-black rounded-lg"></section>
        <section className="w-full h-48 bg-black rounded-lg"></section>
        <section className="w-full h-48 bg-black rounded-lg"></section>
      </aside>

      {/* Row 2: 60/40 split */}
      <aside className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 w-full h-96 bg-black rounded-lg"></section>
        <section className="w-full h-96 bg-black rounded-lg"></section>
      </aside>

      {/* Row 3: 50/50 split */}
      <aside className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="w-full h-96 bg-black rounded-lg"></section>
        <section className="w-full h-96 bg-black rounded-lg"></section>
      </aside>
    </section>
  );
};

export default DashboardLayout;
