import GoogleLoginRequired from './auth/googleLoginRequired';
import Calendar from './components/calendar/Calendar';
import Header from './components/Header';

import './App.css';
import { TodayProvider, useToday } from './providers/todayProvider';
import GooglePhotosSlideshow from './components/photos/GooglePhotosSlideshow';
import { add, endOfWeek } from 'date-fns/esm';
import { startOfWeek } from 'date-fns';



function App() {
  const today = useToday();

  const todayStart = today;
  const todayEnd = add(today, {hours: 23, minutes: 59, seconds: 59});

  const thisWeekStart = startOfWeek(today);
  const thisWeekEnd = endOfWeek(today);

  return (
    <GoogleLoginRequired scope="email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/photoslibrary.readonly">
      <TodayProvider>
        <Header></Header>
        <Calendar timeMin={todayStart} timeMax={todayEnd} showDate={false}>
          <h2>Today</h2>
        </Calendar>
        <Calendar timeMin={thisWeekStart} timeMax={thisWeekEnd} showDate={true}>
          <h2>This week</h2>
        </Calendar>
        <GooglePhotosSlideshow></GooglePhotosSlideshow>
      </TodayProvider>
    </GoogleLoginRequired>
  );
}

export default App;
