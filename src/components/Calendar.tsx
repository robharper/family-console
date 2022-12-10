import { useMemo } from 'react';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import { useGoogleQuery } from '../auth/googleAuthProvider';
import Loading from './Loading';
import { useToday } from '../providers/todayProvider';

interface CalendarEvent {
  id: string
  summary: string
  start: {
    date?: string
    dateTime?: string
  }
}
interface CalendarData {
  items: CalendarEvent[]
}

function Calendar() {
  const today = useToday();

  const calendarRequestParams = useMemo(() => (
    {
      'timeMin': today.toISOString(),
      'maxResults': '10'
    }
  ), [today]);

  const { value, loading, retry } = useGoogleQuery<CalendarData>({
    url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    params: calendarRequestParams
  });

  if (loading) {
    return (
      <Loading/>
    );
  }

  const renderData = value?.items.map((item) => {
    return (
      <li key={item.id}>
        {item.summary} - {item.start.dateTime ?? item.start.date}
      </li>
    )
  });

  return (
    <div className="px-2 py-2">
      <h1>Calendar
        <button onClick={retry} className="ml-2 w-4 h-4">
          <ArrowPathIcon/>
        </button>
      </h1>
      <ul>
        {renderData}
      </ul>
    </div>
  );
}

export default Calendar;
