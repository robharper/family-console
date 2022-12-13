import { useState } from "react";
import { useInterval } from "react-use";
import SlideshowImage from "./SlideshowImage";
import { MediaItem } from "../../google/types";

const TEN_SECONDS_MS = 2 * 1000;
const ONE_SECOND_MS = 1 * 1000;
/**
 * img 1, opacity 100%
 * img 2, opacity 0%
 * -- 10 s
 * img 1, opacity 0%
 * img 2, opacity 100%
 * - 1s
 * img 3, opacity 0%
 * img 2, opactiy 100%
 * -- 10s
 * img 3, opacity 100%
 * img 2, opacity 0%
 *
 * img 3, opacity 100%
 * img 4, opacity 0%
 * --
 */
export default function Slideshow({images, photoDelay = TEN_SECONDS_MS} : {images: MediaItem[], photoDelay?: number}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [firstImage, setFirstImage] = useState(true);

  useInterval(
    () => {
      setFirstImage(!firstImage);
      setTimeout(() => {
        setPhotoIndex((photoIndex + 1) % images.length);
      }, ONE_SECOND_MS);
    },
    photoDelay
  );

  const nextIndex = (photoIndex + 1) % images.length;
  const evenIdx = photoIndex % 2 === 0 ? photoIndex : nextIndex;
  const oddIdx = photoIndex % 2 === 1 ? photoIndex : nextIndex;

  return (
    <div className="relative">
      <SlideshowImage mediaItem={images[evenIdx]} className={
        (firstImage ? 'opacity-100' : 'opacity-0') + ' transition-opacity	duration-1000 absolute top-0 left-0'
      }></SlideshowImage>
      <SlideshowImage mediaItem={images[oddIdx]}  className={
        (firstImage ? 'opacity-0' : 'opacity-100') + ' transition-opacity	duration-1000 absolute top-0 left-0'
      }></SlideshowImage>
    </div>
  );
}