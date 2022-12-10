import GoogleLoginRequired from './auth/googleLoginRequired';
import Calendar from './components/Calendar';
import Header from './components/Header';

import './App.css';
import { TodayProvider } from './providers/todayProvider';



function App() {
  return (
    <GoogleLoginRequired scope="email https://www.googleapis.com/auth/calendar.readonly">
      <TodayProvider>
        <Header></Header>
        <Calendar></Calendar>
      </TodayProvider>
    </GoogleLoginRequired>
  );
}

export default App;
