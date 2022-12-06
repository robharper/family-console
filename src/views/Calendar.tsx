import { useGoogleQuery } from '../auth/googleAuthProvider';
import Loading from '../components/Loading';

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

const params = {
  'timeMin': (new Date()).toISOString(),
  'maxResults': '10'
};

function Calendar() {
  const { value, loading, retry } = useGoogleQuery<CalendarData>({
    url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    params
  });

  if (loading) {
    return (
      <Loading/>
    );
  }

  const renderData = value?.items.map((item) => {
    return (
      <li key={item.id}>
        {item.summary} - {item.start.date}
      </li>
    )
  });

  return (
    <div>
      <h1>Calendar</h1>
      <button onClick={retry} className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Again!</button>
      <ul>
        {renderData}
      </ul>
    </div>
  );
}

export default Calendar;

