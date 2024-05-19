import { Ref, useEffect } from "react";

export function useOutsideClick(ref: any, callback: (e: any) => void) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref?.current && !ref?.current?.contains(event?.target)) {
        callback(event?.target);
      }
    }
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref]);
}
