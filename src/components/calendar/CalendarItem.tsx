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

  const activeClasses = isActive ? 'bg-yellow-100' : '';
  const completeClasses = isComplete ? 'bg-slate-200 text-slate-500' : '';
  const upcomingClasses = !isActive && !isComplete ? 'bg-slate-100' : '';
  const classes = [activeClasses, completeClasses, upcomingClasses].join(' ');

  let title = (<span>{event.summary}</span>);
  if (highlights) {
    for (const [term, color] of Object.entries(highlights)) {
      const summary = event.summary;
      const re = new RegExp(term, 'ig');
      if (re.test(summary)) {
        const parts = summary.split(re);
        title = (
          <span>
            {parts.map((part, index) => {
              if (index < parts.length - 1)
                return (<>{part} <em className={`font-bold text-${color}-500`}>{term}</em></>);
              else return part
            })}
          </span>
        );
      }
    }
  }

  return (
    <li key={event.id} className={classes + ' rounded-xl p-2 mb-2 last:mb-0'}>
      <p className="text-lg font-medium">{title}</p>
      <div>
        {timeString}
      </div>
    </li>
  )
}