import { useMemo, useState } from 'react';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import { useGoogleQuery } from '../auth/googleAuthProvider';
import Loading from './Loading';
import { CalendarData } from '../google/types';
import CalendarItem from './CalendarItem';
import { useInterval } from 'react-use';

const ONE_MINUTE_MS = 60 * 1000;

function Calendar({children, timeMin, timeMax, showDate} : {children?: JSX.Element | JSX.Element[], timeMin: Date, timeMax: Date, showDate: boolean}) {
  const calendarRequestParams = useMemo(() => (
    {
      'timeMin': timeMin.toISOString(),
      'timeMax': timeMax.toISOString(),
      'maxResults': '10',
      'orderBy': 'startTime',
      'singleEvents': 'true'
    }
  ), [timeMin, timeMax]);

  const { value, loading, retry } = useGoogleQuery<CalendarData>({
    url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    params: calendarRequestParams
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  useInterval(
    () => {
      setCurrentTime(new Date());
    },
    ONE_MINUTE_MS
  );



  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="px-2 py-2">
      {children}
      <button onClick={retry} className="ml-2 w-4 h-4">
        <ArrowPathIcon/>
      </button>
      <ul>
        {value?.items?.map(item => (<CalendarItem event={item} showDate={showDate} currentTime={currentTime}></CalendarItem>))}
      </ul>
      {value?.items == null || value?.items?.length === 0 ?
        <div>No events in period</div> : null
      }
    </div>
  );
}

export default Calendar;

