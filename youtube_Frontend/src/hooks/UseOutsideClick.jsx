import { useEffect, useRef } from "react";

export default function useOutsideClick(callback) {
   const ref = useRef();

   useEffect(() => {
      function handleClick(e) {
         if (ref.current && !ref.current.contains(e.target)) {
            callback();
         }
      }
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
   }, [callback]);

   return ref;
}
