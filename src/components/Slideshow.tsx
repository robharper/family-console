import { useMemo } from "react";
import { add, sub } from 'date-fns'
import { useGoogleQuery } from "../auth/googleAuthProvider";
import { useToday } from "../providers/todayProvider";
import Loading from "./Loading";

function toGoogleDate(date: Date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate()
  };
}

export default function Slideshow() {
  const today = useToday();

  const photosSearchRequest = useMemo(() => {
    const dateStart = sub(today, {years: 1, days: 14});
    const dateEnd = add(sub(today, {years: 1}), {days: 14})

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

  const { value, loading, retry } = useGoogleQuery<any>(photosSearchRequest);

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <div>
      <img src={value.mediaItems[Math.floor(Math.random()*value.mediaItems.length)].baseUrl + '=w2048-h1024'} alt={value.mediaItems[0].filename}/>
    </div>
  );
}