import { parseISO, format } from "date-fns";
import { CalendarEvent } from "../google/types";


export default function CalendarItem({event, showDate, currentTime} : {event: CalendarEvent, showDate: boolean, currentTime: Date}) {

  let startTime = null;
  let endTime = null;
  let timeString = null;
  if (event.start.date) {
    // All-day event
    startTime = parseISO(event.start.date);
    endTime = event.end.date ? parseISO(event.end.date) : null;
    timeString = format(startTime, 'MMM dd')
  } else if (event.start.dateTime) {
    // Timed event
    startTime = parseISO(event.start.dateTime);
    endTime = event.end.dateTime ? parseISO(event.end.dateTime) : null;
    timeString = format(startTime, showDate ? 'MMM dd HH:mm' : 'HH:mm')
    if (event.end.dateTime) {
      const end = parseISO(event.end.dateTime);
      timeString += ` - ${format(end, 'HH:mm')}`;
    }
  }

  const isActive = startTime && endTime && currentTime >= startTime && currentTime < endTime;
  const isComplete = endTime && currentTime >= endTime;

  const activeClasses = isActive ? 'bg-orange-50' : 'bg-slate-100';
  const completeClasses = isComplete ? 'bg-slate-300 text-slate-500' : '';

  return (
    <li key={event.id} className={activeClasses + ' ' + completeClasses + ' rounded-xl p-2 mb-1'}>
      <p className="text-lg font-medium">{event.summary}</p>
      <div>
        {timeString}
      </div>
    </li>
  )
}