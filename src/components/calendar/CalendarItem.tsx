import { parseISO, format } from "date-fns";
import { CalendarEvent } from "../../google/types";
import { useAppConfig } from "../../providers/appConfigProvider";

export default function CalendarItem({event, showDate, currentTime} : {event: CalendarEvent, showDate: boolean, currentTime: Date}) {

  const { calendar: { highlights } } = useAppConfig();

  let startTime = null;
  let endTime = null;
  let timeString = null;
  if (event.start.date) {
    // All-day event
    startTime = parseISO(event.start.date);
    endTime = event.end.date ? parseISO(event.end.date) : null;
    timeString = format(startTime, 'EEEE')
  } else if (event.start.dateTime) {
    // Timed event
    startTime = parseISO(event.start.dateTime);
    endTime = event.end.dateTime ? parseISO(event.end.dateTime) : null;
    timeString = format(startTime, showDate ? 'EEEE HH:mm' : 'HH:mm')
    if (event.end.dateTime) {
      const end = parseISO(event.end.dateTime);
      timeString += ` - ${format(end, 'HH:mm')}`;
    }
  }

  const isActive = startTime && endTime && currentTime >= startTime && currentTime < endTime;
  const isComplete = endTime && currentTime >= endTime;

  const activeClasses = isActive ? 'border-amber-500 border-2 border-solid' : '';
  const completeClasses = isComplete ? 'bg-slate-800 text-slate-500' : 'bg-slate-600';
  const classes = [activeClasses, completeClasses].join(' ');

  const swatches = Object.entries(highlights).map(([term, color]) => {
    const re = new RegExp(term, 'ig');
    if (re.test(event.summary)) {
      return color;
    }
    return null;
  }).filter(Boolean);

  if (swatches.length === 0) {
    swatches.push('slate-500');
  }

  return (
    <li key={event.id} className={classes + ' rounded-xl p-2 mb-2 last:mb-0 flex flex-row'}>
      <div className="flex-none m-1">
        {swatches.map(color => (
          <span key={color} className={`w-5 h-5 rounded-xl bg-${color} block mb-1`}></span>
        ))}
      </div>
      <div className="flex-1 ml-1">
        <p className="text-lg font-medium">{event.summary}</p>
        <div>
          {timeString}
        </div>
        {event.description && <p className="text-sm text-slate-300">{event.description}</p>}
      </div>
    </li>
  )
}