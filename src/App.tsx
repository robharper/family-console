import GoogleLoginRequired from './auth/googleLoginRequired';
import Calendar from './views/Calendar';
import Header from './components/Header';

import './App.css';

function App() {
  return (
    <GoogleLoginRequired scope="email https://www.googleapis.com/auth/calendar.readonly">
      <Header></Header>
      <Calendar></Calendar>
    </GoogleLoginRequired>
  );
}

export default App;
