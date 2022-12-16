import { format, parseISO } from "date-fns";
import { useMeasure } from "react-use";
import { MediaItem } from "../../google/types";


export default function SlideshowImage({mediaItem, className, contain} : {mediaItem: MediaItem, className: string, contain: boolean}) {
  const [ref, { width, height }] = useMeasure();
  const refCast = ref as unknown as React.MutableRefObject<HTMLInputElement>;

  console.log(width, height);

  const datetime = parseISO(mediaItem.mediaMetadata.creationTime);
  const dateStr = format(datetime, 'MMM dd yyyy');

  return (
    <div ref={refCast} className={`${className} flex flex-col`}>
      <div className="flex-1 min-h-0">
        <img src={`${mediaItem.baseUrl}=w${Math.round(width)}-h${Math.round(height)}`}
          alt={mediaItem.filename} className={`rounded-xl w-full h-full ${contain ? 'object-contain' : 'object-cover'}`}/>
      </div>
      <div className="flex-none text-center font-semibold">{dateStr}</div>
    </div>
  )
}