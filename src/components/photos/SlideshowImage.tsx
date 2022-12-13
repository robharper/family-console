import { MediaItem } from "../../google/types";


export default function SlideshowImage({mediaItem, className} : {mediaItem: MediaItem, className: string}) {

  return (
    <img src={mediaItem.baseUrl + '=w1362-h1024-c'} alt={mediaItem.filename} className={className}/>
  )
}