import { useMemo } from "react";
import { add, sub } from 'date-fns'
import { useGoogleQuery } from "../../auth/googleAuthProvider";
import { useToday } from "../../providers/todayProvider";
import Loading from "../Loading";
import { useTimeoutFn } from "react-use";
import { MediaSearchResult, toGoogleDate } from "../../google/types";
import { shuffle } from "../../util/fns";
import Slideshow from "./Slideshow";

const ONE_HOUR_MS = 60 * 60 * 1000;

export default function GooglePhotosSlideshow() {
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

  return (
    <Slideshow images={randomPhotosList}></Slideshow>
  );
}