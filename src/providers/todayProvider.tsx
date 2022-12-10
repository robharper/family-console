import { createContext, useContext, useState } from "react";
import { useTimeoutFn } from "react-use";

const buildTodaysDate = () : Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

const DEFAULT_CHECK_PERIOD = 60 * 1000; // One minute

const TodayContext = createContext<Date>(buildTodaysDate());

interface TodayProviderProps {
  children: JSX.Element | JSX.Element[]
  period?: number;
}

/**
 * Provides a context value of today's date that automatically updates on day change (within period [ms])
 * @param param0
 * @returns
 */
export function TodayProvider({children, period = DEFAULT_CHECK_PERIOD}: TodayProviderProps) {
  const [today, setToday] = useState(buildTodaysDate());
  const [, , reset] = useTimeoutFn(() => {
    const todayCheck = buildTodaysDate();
    if (today.getTime() !== todayCheck.getTime()) {
      // A new day! Update provider
      setToday(todayCheck);
    }
    reset();
  }, period);

  return (
    <TodayContext.Provider value={today}>
      {children}
    </TodayContext.Provider>
  );
}

export function useToday() {
  return useContext(TodayContext);
}