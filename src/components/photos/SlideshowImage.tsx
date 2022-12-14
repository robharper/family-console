import { format, parseISO } from "date-fns";
import { MediaItem } from "../../google/types";


export default function SlideshowImage({mediaItem, className} : {mediaItem: MediaItem, className: string}) {

  const datetime = parseISO(mediaItem.mediaMetadata.creationTime);
  const dateStr = format(datetime, 'MMM dd yyyy');

  return (
    <div className={className}>
      <img src={mediaItem.baseUrl + '=w681-h512-c'} alt={mediaItem.filename} className="rounded-xl object-cover w-full"/>
      <div className="text-right font-semibold">{dateStr}</div>
    </div>
  )
}