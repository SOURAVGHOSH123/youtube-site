import { useState } from "react";
import { Navbar, Sidebar } from "../component/index"

export default function Layout({ children }) {
   const [collapsed, setCollapsed] = useState(false);
   return (
      <div className="h-screen flex flex-col">
         <Navbar toggle={() => setCollapsed(!collapsed)} />

         <div className="flex flex-1 overflow-hidden">
            <Sidebar collapsed={collapsed} />
            <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
               {children}
            </main>
         </div>
      </div>
   );
}
