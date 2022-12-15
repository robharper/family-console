import { useMemo, useState } from 'react';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import { useGoogleQuery } from '../../auth/googleAuthProvider';
import Loading from '../Loading';
import { CalendarData } from '../../google/types';
import CalendarItem from './CalendarItem';
import { useInterval } from 'react-use';
import { useAppConfig } from '../../providers/appConfigProvider';

const ONE_MINUTE_MS = 60 * 1000;

interface CalendarProps {
  children?: JSX.Element | JSX.Element[];
  timeMin: Date;
  timeMax: Date;
  showDate: boolean;
}

function Calendar({children, timeMin, timeMax, showDate} : CalendarProps) {
  const { calendar: { calendarId } } = useAppConfig();

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
    url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
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
    <div className="p-2 m-2 bg-slate-300 rounded-xl">
      <div className="p-2 mb-2 relative">
        {children}
        <button onClick={retry} className="absolute top-0 right-2 w-6 h-full">
          <ArrowPathIcon/>
        </button>
      </div>

      <ul className="mt-2">
        {value?.items?.map(item => (<CalendarItem key={item.id} event={item} showDate={showDate} currentTime={currentTime}></CalendarItem>))}
      </ul>
      {value?.items == null || value?.items?.length === 0 ?
        <div>No events in period</div> : null
      }
    </div>
  );
}

export default Calendar;

