import React, {Component} from 'react';
import { render } from 'react-dom';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

export default class Theme extends Component {
  constructor() {
    super();
    this.themes = {
      light: lightBaseTheme,
      dark: darkBaseTheme
    };
    
    this.state = {
      theme: this.themes.light
    }
  }
  
  componentWillMount() {
    injectTapEventPlugin();
  
  }
  
  setTheme = theme => {
    if(this.themes[theme]) this.setState({theme: theme});
  };
  
  render() {
    const {content} = this.props;
    
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(this.state.theme)}>
        {content}
      </MuiThemeProvider>
    )
  }
}