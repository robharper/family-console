import { createContext, useContext } from "react";

export interface AppConfig {
  calendar: {
    calendarId: string;
    highlights: Record<string,string>;
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