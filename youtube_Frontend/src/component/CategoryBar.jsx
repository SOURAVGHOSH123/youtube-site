import { useRef } from "react";
import { categories } from "../utils/constants.js";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function CategoryBar() {
   const scrollRef = useRef(null);

   const scrollAmount = 300; // px per click

   const scrollLeft = () => {
      scrollRef.current.scrollBy({
         left: -scrollAmount,
         behavior: "smooth",
      });
   };

   const scrollRight = () => {
      scrollRef.current.scrollBy({
         left: scrollAmount,
         behavior: "smooth",
      });
   };

   return (
      <div className="relative w-full flex items-center">
         {/* Left Arrow */}
         <button
            onClick={scrollLeft}
            className="absolute left-0 z-10 bg-white shadow-md p-2 rounded-full"
         >
            <FaChevronLeft />
         </button>

         {/* Categories */}
         <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto no-scrollbar px-10 py-3 w-full"
         >
            {categories.map((cat) => (
               <button
                  key={cat}
                  className="px-4 py-2 bg-gray-200 rounded-full whitespace-nowrap hover:bg-gray-300"
               >
                  {cat}
               </button>
            ))}
         </div>

         {/* Right Arrow */}
         <button
            onClick={scrollRight}
            className="absolute right-0 z-10 bg-white shadow-md p-2 rounded-full"
         >
            <FaChevronRight />
         </button>
      </div>
   );
}
