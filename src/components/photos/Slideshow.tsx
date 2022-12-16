import { useState } from "react";
import { useInterval } from "react-use";
import ArrowsOutIcon from '@heroicons/react/24/solid/ArrowsPointingOutIcon';
import ArrowsInIcon from '@heroicons/react/24/solid/ArrowsPointingInIcon';
import SlideshowImage from "./SlideshowImage";
import { MediaItem } from "../../google/types";

const TEN_SECONDS_MS = 60 * 1000;
const ONE_SECOND_MS = 1 * 1000;

export default function Slideshow({images, photoDelay = TEN_SECONDS_MS} : {images: MediaItem[], photoDelay?: number}) {
  const [visiblePhotoIdx, setVisiblePhotoIdx] = useState(0);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [isFullscreen, setFullscreen] = useState(true);

  const advance = () => {
    // Have to delay preload until animation complete
    setVisiblePhotoIdx((v) => v + 1);
    setTimeout(() => {
      setCurrentPhotoIdx((v) => v + 1);
    }, ONE_SECOND_MS);
  };

  useInterval(advance, photoDelay);

  // Have to keep the imgs in the same place in the DOM to create smooth crossfade animation
  const preloadPhotoIdx = currentPhotoIdx + 1;
  const evenIdx = currentPhotoIdx % 2 === 0 ? currentPhotoIdx : preloadPhotoIdx;
  const oddIdx = currentPhotoIdx % 2 === 1 ? currentPhotoIdx : preloadPhotoIdx;

  // Fixed, full screen vs contained in our parent
  const containerClasses = isFullscreen ? 'fixed top-0 left-0 w-screen h-screen bg-black text-white' : 'relative w-full h-full overflow-hidden';

  return (
    <div className={containerClasses} onClick={advance}>
      <SlideshowImage mediaItem={images[evenIdx % images.length]} contain={isFullscreen} className={
        `${evenIdx === visiblePhotoIdx ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 w-full h-full`
      }></SlideshowImage>
      <SlideshowImage mediaItem={images[oddIdx % images.length]} contain={isFullscreen} className={
        `${oddIdx === visiblePhotoIdx ? 'opacity-100' : 'opacity-0'} transition-opacity	duration-1000  absolute top-0 left-0 w-full h-full`
      }></SlideshowImage>
      <button onClick={() => setFullscreen(!isFullscreen)}
        className={`absolute top-1 right-1 w-6 h-6 opacity-50 rounded-lg ${isFullscreen ? '' : 'bg-white'}`}>
        {isFullscreen ? <ArrowsInIcon/> : <ArrowsOutIcon/>}
      </button>
    </div>
  );
}