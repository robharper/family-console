import { useEffect, useMemo, useState } from "react";
import { add, sub } from 'date-fns'
import { useGoogleQuery } from "../../auth/googleAuthProvider";
import { useToday } from "../../providers/todayProvider";
import Loading from "../Loading";
import { useInterval } from "react-use";
import { MediaSearchResult, toGoogleDate } from "../../google/types";
import { shuffle } from "../../util/fns";
import Slideshow from "./Slideshow";
import { useAppConfig } from "../../providers/appConfigProvider";

const TEN_SEC_MS = 10 * 1000;

export default function GooglePhotosSlideshow() {
  const today = useToday();
  const { photos: { categories, ranges } } = useAppConfig();

  const photosSearchRequest = useMemo(() => {
    const rangeRequests = ranges.map(r => (
      {
        startDate: toGoogleDate(sub(today, r.start)),
        endDate: toGoogleDate(sub(today, r.end))
      }
    ))

    return {
      url: 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
      method: 'POST',
      body: JSON.stringify({
        pageSize: '100',
        filters: {
          dateFilter: {
            ranges: rangeRequests
          },
          mediaTypeFilter: {
            mediaTypes: [
              'PHOTO'
            ]
          },
          contentFilter: {
            includedContentCategories: categories
          }
        }
      })
    };
  }, [today, categories, ranges]);

  // Search for a list of photos
  const { value: photosList, loading, retry: searchPhotos } = useGoogleQuery<MediaSearchResult>(photosSearchRequest);

  // Track renewal of photos results (google photo results expire after 1 hour)
  const [renewTime, setRenewTime] = useState<Date | undefined>();
  useEffect(() => {
    // When photos updated, renew the photos list in just under 1 hour
    setRenewTime(add(new Date(), {minutes: 59}));
  }, [photosList]);

  useInterval(() => {
    const now = new Date();
    if (renewTime != null && now > renewTime) {
      // Past our renew time, fetch new photos URLs
      searchPhotos();
    } else {
      console.log('Still good!');
    }
  }, TEN_SEC_MS);

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
    <Slideshow images={randomPhotosList} onError={() => searchPhotos()}></Slideshow>
  );
}