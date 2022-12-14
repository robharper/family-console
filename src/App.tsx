import GoogleLoginRequired from './auth/googleLoginRequired';
import Calendar from './components/calendar/Calendar';
import Header from './components/Header';

import './App.css';
import { TodayProvider, useToday } from './providers/todayProvider';
import GooglePhotosSlideshow from './components/photos/GooglePhotosSlideshow';
import { add, endOfWeek } from 'date-fns/esm';



function App() {
  const today = useToday();

  const todayStart = today;
  const todayEnd = add(today, {hours: 23, minutes: 59, seconds: 59});

  const thisWeekStart = add(today, {days: 1});
  const thisWeekEnd = endOfWeek(today);

  return (
    <GoogleLoginRequired scope="email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/photoslibrary.readonly">
      <TodayProvider>
        <div className="w-screen h-screen flex flex-col">
          <div className="flex-none">
            <Header />
          </div>
          <div className="flex-1 min-h-0 flex flex-row items-stretch h-full">
              <div className="flex-1 overflow-auto">
                <Calendar timeMin={todayStart} timeMax={todayEnd} showDate={false}>
                  <h2 className="font-bold">Today</h2>
                </Calendar>
                <Calendar timeMin={thisWeekStart} timeMax={thisWeekEnd} showDate={true}>
                  <h2 className="font-bold">This week</h2>
                </Calendar>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 m-2">
                  <p className="p-2 h-full rounded-xl bg-white">This will be a notepad</p>
                </div>
                <div className="flex-none">
                  <GooglePhotosSlideshow />
                </div>
              </div>
          </div>
        </div>
      </TodayProvider>
    </GoogleLoginRequired>
  );
}

export default App;
