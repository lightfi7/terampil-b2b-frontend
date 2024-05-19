import { useEffect } from "react";

export function useTimer(callback: () => void, time_seconds: number) {
  useEffect(() => {
    const interval = setInterval(() => {
      callback && callback();
    }, time_seconds * 1000);

    return () => clearInterval(interval);
  }, []);
};
