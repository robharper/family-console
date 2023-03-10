import GoogleLoginRequired from './auth/googleLoginRequired';
import Calendar from './components/calendar/Calendar';
import Header from './components/Header';

import './App.css';
import { TodayProvider, useToday } from './providers/todayProvider';
import GooglePhotosSlideshow from './components/photos/GooglePhotosSlideshow';
import { add } from 'date-fns/esm';
import Notes from './components/Notes';
import { AppConfigProvider } from './providers/appConfigProvider';

import config from './config';

function App() {
  const today = useToday();

  const todayStart = today;
  const todayEnd = add(today, {hours: 23, minutes: 59, seconds: 59});

  const thisWeekStart = add(today, {days: 1});
  const thisWeekEnd = add(today, config.calendar.comingUp);

  return (
    <AppConfigProvider value={config}>
      <GoogleLoginRequired scope="email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/photoslibrary.readonly">
        <TodayProvider>
          <div className="w-screen h-screen flex flex-col">
            <div className="flex-none">
              <Header />
            </div>
            <div className="flex-1 min-h-0 flex flex-row items-stretch h-full">
              <div className="flex-1 overflow-auto">
                <Calendar timeMin={todayStart} timeMax={todayEnd} showDate={false} maxItems={config.calendar.maxItems}>
                  <h2 className="font-bold">Today</h2>
                </Calendar>
                <Calendar timeMin={thisWeekStart} timeMax={thisWeekEnd} showDate={true} maxItems={config.calendar.maxItems}>
                  <h2 className="font-bold">Coming Up</h2>
                </Calendar>
              </div>
              <div className="flex-1">
                <div className="h-2/5 p-2 pb-0">
                  <Notes>
                    <h2 className="font-bold">Notes</h2>
                  </Notes>
                </div>
                <div className="h-3/5 p-2">
                  <GooglePhotosSlideshow />
                </div>
              </div>
            </div>
          </div>
        </TodayProvider>
      </GoogleLoginRequired>
    </AppConfigProvider>
  );
}

export default App;
