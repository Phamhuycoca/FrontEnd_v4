import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { StyleProvider } from 'antd-style';
import { ConfigProvider, App as AntdApp } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Routers } from './routes/routers.tsx';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store.tsx';
import { PersistGate } from 'redux-persist/integration/react';
import { GlobalAlert } from './components/ui/Global/Alert.tsx';
import { GlobalConfirm } from './components/ui/Global/Confirm.tsx';
import { GlobalMessage } from './components/ui/Global/Message.tsx';
createRoot(document.getElementById('root')!).render(
  <StyleProvider hashPriority="high">
    <ConfigProvider theme={{ cssVar: { key: 'app' }, hashed: false }}>
      <AntdApp>
        <Provider store={store}>
          <PersistGate
            loading={null} persistor={persistor}>
            <Router>
              <Routes>
                {Routers.map((route) => {
                  if (route.children) {
                    return (
                      <Route key={route.path} path={route.path} element={route.element}>
                        {route.children.map((childRoute) => (
                          <Route
                            key={childRoute.path}
                            path={childRoute.path}
                            element={childRoute.element}
                          />
                        ))}
                      </Route>
                    );
                  }
                  return <Route key={route.path} path={route.path} element={route.element} />;
                })}
              </Routes>
              <GlobalMessage />
              <GlobalAlert />
              <GlobalConfirm />
            </Router>
          </PersistGate>
        </Provider>
      </AntdApp>
    </ConfigProvider>
  </StyleProvider >,
);
