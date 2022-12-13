import { useMemo, useState } from "react";
import { add, sub } from 'date-fns'
import { useGoogleQuery } from "../auth/googleAuthProvider";
import { useToday } from "../providers/todayProvider";
import Loading from "./Loading";
import { useTimeoutFn } from "react-use";
import SlideshowImage from "./SlideshowImage";
import { MediaSearchResult, toGoogleDate } from "../google/types";
import { shuffle } from "../util/fns";

const ONE_HOUR_MS = 60 * 60 * 1000;
const TEN_SECONDS_MS = 10 * 1000;

export default function Slideshow({photoDelay = TEN_SECONDS_MS} : {photoDelay?: number}) {
  const today = useToday();

  const photosSearchRequest = useMemo(() => {
    const dateStart = sub(today, {years: 1, months: 1});
    const dateEnd = add(sub(today, {years: 1}), {months: 1})

    return {
      url: 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
      method: 'POST',
      body: JSON.stringify({
        pageSize: '100',
        filters: {
          dateFilter: {
            ranges: [{
              startDate: toGoogleDate(dateStart),
              endDate: toGoogleDate(dateEnd),
            }]
          },
          mediaTypeFilter: {
            mediaTypes: [
              'PHOTO'
            ]
          },
          contentFilter: {
            includedContentCategories: [
              'PEOPLE',
              'ANIMALS',
              'HOLIDAYS',
              'BIRTHDAYS',
              'SELFIES'
            ]
          }
        }
      })
    };
  }, [today]);

  // Search for a list of photos
  const { value: photosList, loading, retry: searchPhotos } = useGoogleQuery<MediaSearchResult>(photosSearchRequest);

  const [, , resetPhotosSearch] = useTimeoutFn(() => {
    // Re-query for list of google photos and reset timer for another hour out
    searchPhotos();
    resetPhotosSearch();
  }, ONE_HOUR_MS);

  const randomPhotosList = useMemo(() => photosList?.mediaItems ? shuffle(photosList.mediaItems) : [], [photosList])
  const [photoIndex, setPhotoIndex] = useState(0);

  const [, , resetPhotoSelect] = useTimeoutFn(() => {
    if (photosList != null) {
      setPhotoIndex((photoIndex + 1) % randomPhotosList.length);
    }
    resetPhotoSelect();
  }, photoDelay);

  if (loading) {
    return (
      <Loading/>
    );
  }
  if (photosList == null) {
    return (
      <div>Error fetching photos</div>
    )
  }

  const nextIndex = (photoIndex + 1) % randomPhotosList.length;

  return (
    <div className="relative">
      {photoIndex % 2 ? (
        <>
          <SlideshowImage mediaItem={photosList.mediaItems[photoIndex]} className="opacity-100 transition-opacity	duration-1000 absolute top-0 left-0"></SlideshowImage>
          <SlideshowImage mediaItem={photosList.mediaItems[nextIndex]}  className="opacity-0 transition-opacity	duration-1000 absolute top-0 left-0"></SlideshowImage>
        </>
      ) : (
        <>
          <SlideshowImage mediaItem={photosList.mediaItems[nextIndex]} className="opacity-0 transition-opacity duration-1000 absolute top-0 left-0"></SlideshowImage>
          <SlideshowImage mediaItem={photosList.mediaItems[photoIndex]}  className="opacity-100 transition-opacity duration-1000 absolute top-0 left-0"></SlideshowImage>
        </>
      )}
    </div>
  );
}