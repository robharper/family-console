import { format, parseISO } from "date-fns";
import { useMeasure } from "react-use";
import { MediaItem } from "../../google/types";

import './SlideshowImage.css';


export default function SlideshowImage({mediaItem, className, contain} : {mediaItem: MediaItem, className: string, contain: boolean}) {
  const [ref, { width: viewWidth, height: viewHieght }] = useMeasure();
  const refCast = ref as unknown as React.MutableRefObject<HTMLInputElement>;

  const datetime = parseISO(mediaItem.mediaMetadata.creationTime);
  const dateStr = format(datetime, 'MMM dd yyyy');

  // Calculate the ideal request size based on the media's size
  const aspect = mediaItem.mediaMetadata.width / mediaItem.mediaMetadata.height;
  const width = Math.round(viewWidth);
  const height = isNaN(aspect) || aspect <= 0 ? width : Math.round(viewWidth / aspect);

  return (
    <div ref={refCast} className={`${className} flex flex-col`}>
      <div className="flex-1 min-h-0">
        <img src={`${mediaItem.baseUrl}=w${Math.round(width)}-h${Math.round(height)}`}
          alt={mediaItem.filename} className={
            `rounded-xl w-full h-full ${contain ? 'object-contain' : 'object-cover'} ${height > viewHieght ? 'animate-pan' : '' }`
          }/>
      </div>
      <div className="flex-none text-center font-semibold">{dateStr}</div>
    </div>
  )
}