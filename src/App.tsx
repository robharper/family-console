import React from 'react';
import GoogleLoginRequired from './auth/googleLoginRequired';
import './App.scss';



function App() {

  return (
    <GoogleLoginRequired>
      <h1>Content</h1>
    </GoogleLoginRequired>
  );
}

export default App;
