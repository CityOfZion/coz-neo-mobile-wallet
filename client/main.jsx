import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import { AppContainer } from 'react-hot-loader';
import configureStore from '/imports/store/configureStore';
import Root from '/imports/ui/containers/Root';
import Theme from "/imports/ui/components/Theme";

function getQueryParams(qs) {
  const qs_ = qs.split('+').join(' ');
  
  let params = {};
  let tokens;
  const re = /[?&]?([^=]+)=([^&]*)/g;
  
  while (tokens = re.exec(qs_)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }
  
  return params;
}
import { hashHistory } from 'react-router'

const store = configureStore();
const history = hashHistory;

Meteor.startup(() => {
  
  if (module.hot) {
    module.hot.accept('/imports/ui/containers/Root', () => {
      const NewRoot = require('/imports/ui/containers/Root').default;
      const content = <NewRoot store={store} history={history}/>;
      render(
        <AppContainer>
          <Theme content={content}/>
        </AppContainer>,
        document.querySelector('#root')
      );
    });
  } else {
    const content = <Root store={store} history={history}/>;
  
    render(
      <AppContainer>
        <Theme content={content}/>
      </AppContainer>,
      document.querySelector('#root')
    );
  }
});