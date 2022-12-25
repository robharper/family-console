import { useState } from "react";
import { useGetSet, useTimeoutFn } from "react-use";
import ArrowsOutIcon from '@heroicons/react/24/solid/ArrowsPointingOutIcon';
import ArrowsInIcon from '@heroicons/react/24/solid/ArrowsPointingInIcon';
import SlideshowImage from "./SlideshowImage";
import { MediaItem } from "../../google/types";

const ONE_MIN_MS = 60 * 1000;
const ONE_SECOND_MS = 1 * 1000;

export default function Slideshow({images, onError = () => {}, photoDelay = ONE_MIN_MS} : {images: MediaItem[], onError?: () => void, photoDelay?: number}) {
  const [getVisiblePhotoIdx, setVisiblePhotoIdx] = useGetSet(0);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [isFullscreen, setFullscreen] = useState(false);

  const advance = () => {
    // Advance visible to the next image (already preloaded)
    setVisiblePhotoIdx((v) => v + 1);
    // One second later set "current" to what is now visible, allow preload to move ahead
    setTimeout(() => {
      setCurrentPhotoIdx(getVisiblePhotoIdx());
    }, ONE_SECOND_MS);
    resetAdvance();
  };

  const [,, resetAdvance] = useTimeoutFn(advance, photoDelay);

  // Have to keep the imgs in the same place in the DOM to create smooth crossfade animation
  const visiblePhotoIdx = getVisiblePhotoIdx();
  const preloadPhotoIdx = currentPhotoIdx + 1;
  const evenIdx = currentPhotoIdx % 2 === 0 ? currentPhotoIdx : preloadPhotoIdx;
  const oddIdx = currentPhotoIdx % 2 === 1 ? currentPhotoIdx : preloadPhotoIdx;

  // Fixed, full screen vs contained in our parent
  const containerClasses = isFullscreen ? 'fixed top-0 left-0 w-screen h-screen bg-black text-white' : 'relative w-full h-full overflow-hidden';

  return (
    <div className={containerClasses} onClick={advance}>
      <SlideshowImage mediaItem={images[evenIdx % images.length]} contain={isFullscreen} className={
        `${evenIdx === visiblePhotoIdx ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 w-full h-full`
      } onError={onError}></SlideshowImage>
      <SlideshowImage mediaItem={images[oddIdx % images.length]} contain={isFullscreen} className={
        `${oddIdx === visiblePhotoIdx ? 'opacity-100' : 'opacity-0'} transition-opacity	duration-1000  absolute top-0 left-0 w-full h-full`
      } onError={onError}></SlideshowImage>
      <button onClick={() => setFullscreen(!isFullscreen)}
        className={`absolute top-1 right-1 w-6 h-6 opacity-50 rounded-lg ${isFullscreen ? '' : 'bg-black'}`}>
        {isFullscreen ? <ArrowsInIcon/> : <ArrowsOutIcon/>}
      </button>
    </div>
  );
}