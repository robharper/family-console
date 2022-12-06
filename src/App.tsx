import {useEffect} from 'react';
import GoogleLoginRequired from './auth/googleLoginRequired';
import './App.scss';
import Calendar from './Calendar';

function App() {

  useEffect(() => {
    console.log('App Mount');
  }, []);

  return (
    <GoogleLoginRequired scope="email https://www.googleapis.com/auth/calendar.readonly">
      <h1>Content</h1>
      <Calendar></Calendar>
    </GoogleLoginRequired>
  );
}

export default App;
