import React from 'react'
import { render } from 'react-dom'
import Modal from 'react-modal'
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from 'styled-components'
import { Provider } from "react-redux";
import { store, persistor } from "./store/";
import AppProvider from './context'
import Screen from './screen'
import { GlobalStyle } from './styles/GlobalStyle'
import { defaultTheme } from './styles/theme'

import ErrorBoundary from './components/ErrorBoundary';

Modal.setAppElement('#root')

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={defaultTheme}>
          <AppProvider>
            <ErrorBoundary>
              <Screen />
            </ErrorBoundary>
          </AppProvider>
          <GlobalStyle />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}

render(<App />, document.getElementById('root'))
