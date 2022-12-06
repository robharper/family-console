import { useEffect } from 'react';
import { useGoogleQuery } from './auth/googleAuthProvider';

interface CalendarEvent {
  id: string
  summary: string
  start: {
    date: string
  }
}
interface CalendarData {
  items: CalendarEvent[]
}

function Calendar() {
  const { value, error, loading, retry } = useGoogleQuery<CalendarData>({
    url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
  });

  // useEffect(() => {
  //   console.log('Calendar Mount');
  //   run();
  // }, []);

  const refetch = () => {
    try {
      retry();
    } catch (e) {
      console.error(e);
    }
    console.log('done!');
  };

  const renderData = value?.items.map((item) => {
    return (
      <li key={item.id}>
        {item.summary} - {item.start.date}
      </li>
    )
  });

  return (
    <div>Calendar: {loading ? 'loading' : 'done'}
      <button onClick={refetch}>Again!</button>
      <ul>
        {renderData}
      </ul>
    </div>
  );
}

export default Calendar;
