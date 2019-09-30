import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';
import { IntlProvider } from 'react-intl';
import { StoreManage } from 'mcf-core';
import { createLogger } from 'redux-logger';
import * as Module from './src/';

const logger = createLogger()
const store = new StoreManage(createHashHistory(), null, [logger]);
export default class App extends Component{
  render(){
    return (
    <Provider store={store.getStore()}>
      <IntlProvider onError={function(err) {}}>
        <Router>
          <Switch>
            <Route path="/" component={store.loadModule(Module)}></Route>
          </Switch>
        </Router>
      </IntlProvider>
    </Provider>
    )
  }
}
