import React, { memo } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Main from './Main';

const App = memo( () => {
    return (
      <Main />
    )
})

export default App;