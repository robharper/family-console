import {useEffect, useState} from 'react';
import { useGoogleQuery } from './auth/googleQuery';

function Calendar() {
  const googleQuery = useGoogleQuery();

  const [eventData, setEventData] = useState<string | null>(null);

  useEffect(() => {
    console.log('querying');
    googleQuery?.({url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events'}).then((data) => {
      console.log(data);
      setEventData('done');
    })
  }, [googleQuery]);


  useEffect(() => {
    console.log('Calendar Mount');
  }, []);

  return (
    <div>Calendar: {eventData}</div>
  );
}

export default Calendar;
