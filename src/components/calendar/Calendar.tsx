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
  maxItems: number;
}

function Calendar({children, timeMin, timeMax, showDate, maxItems} : CalendarProps) {
  const { calendar: { calendarId } } = useAppConfig();

  const calendarRequestParams = useMemo(() => (
    {
      'timeMin': timeMin.toISOString(),
      'timeMax': timeMax.toISOString(),
      'maxResults': `${maxItems}`,
      'orderBy': 'startTime',
      'singleEvents': 'true'
    }
  ), [timeMin, timeMax, maxItems]);

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
    <div className="p-2 m-2 bg-slate-700 rounded-xl">
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
        <div className="m-2">Nothing... relax...</div> : null
      }
    </div>
  );
}

export default Calendar;

