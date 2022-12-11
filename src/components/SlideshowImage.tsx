import { MediaItem } from "../google/types";


export default function SlideshowImage({mediaItem} : {mediaItem: MediaItem}) {

  return (
    <img src={mediaItem.baseUrl + '=w2048-h1024'} alt={mediaItem.filename}/>
  )
}