// Auth
export interface GoogleTokens {
  access_token: string,
  expiry_date: number,
  id_token: string,
  refresh_token: string,
  scope: string,
  token_type: string
}

export interface GoogleCode {
  code: string
}


// Calendar
export interface CalendarEvent {
  id: string
  summary: string
  start: {
    date?: string
    dateTime?: string
  }
  end: {
    date?: string
    dateTime?: string
  }
}

export interface CalendarData {
  items: CalendarEvent[]
}

// Photos
export interface MediaItem {
  baseUrl: string;
  filename: string;
  mediaMetadata: {
    creationTime: string,
    width: number,
    height: number
  }
}

export interface MediaSearchResult {
  mediaItems: MediaItem[];
}

export function toGoogleDate(date: Date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
}
