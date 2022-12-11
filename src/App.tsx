import GoogleLoginRequired from './auth/googleLoginRequired';
import Calendar from './components/Calendar';
import Header from './components/Header';

import './App.css';
import { TodayProvider } from './providers/todayProvider';
import Slideshow from './components/Slideshow';



function App() {
  return (
    <GoogleLoginRequired scope="email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/photoslibrary.readonly">
      <TodayProvider>
        <Header></Header>
        <Calendar></Calendar>
        <Slideshow></Slideshow>
      </TodayProvider>
    </GoogleLoginRequired>
  );
}

export default App;
