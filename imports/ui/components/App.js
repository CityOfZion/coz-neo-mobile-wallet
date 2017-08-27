import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

let App = ({ children }) => {
  return <div id="pageWrapper">{ children }</div>;
};

const mapStateToProps = (state) => ({
});

App = connect(mapStateToProps)(App);

export default App;
