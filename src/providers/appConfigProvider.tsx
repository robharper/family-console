import { createContext, useContext } from "react";

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
    categories: string[]
  }
}


const AppConfigContext = createContext<AppConfig>({} as AppConfig);

export const AppConfigProvider = AppConfigContext.Provider;

export function useAppConfig() {
  return useContext(AppConfigContext);
}