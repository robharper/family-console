import { createContext, useContext } from "react";

interface PhotoRange {
  start: Record<string, number>
  end: Record<string, number>
}
export interface AppConfig {
  calendar: {
    // Calendar Id from google, usually something like `<id>@group.calendar.google.com` or `primary`
    calendarId: string;
    // date-fns value to look ahead, e.g. `{weeks: 1}`
    comingUp: Record<string, number>;
    // String value color highlighting, terms --> colors
    highlights: Record<string,string>;
    // Max number of items to show in calendar
    maxItems: number;
  }
  photos: {
    categories: string[],
    ranges: PhotoRange[]
  }
}


const AppConfigContext = createContext<AppConfig>({} as AppConfig);

export const AppConfigProvider = AppConfigContext.Provider;

export function useAppConfig() {
  return useContext(AppConfigContext);
}