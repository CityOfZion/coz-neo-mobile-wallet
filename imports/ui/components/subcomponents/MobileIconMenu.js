import React, {Component} from 'react';
import { connect } from 'react-redux';
import { logout } from '/imports/modules/account';
import {hashHistory} from 'react-router';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';

import {version} from '../../../../package.json'

const styles = {
  iconStyle: {
    color: 'white'
  },
  menuListStyle: {
    marginLeft: 0,
    paddingLeft: 0
  },
  menuPlacement: {
    horizontal: 'right',
    vertical: 'top'
  },
  toggle: {
    marginTop: 'auto',
    marginBottom: 'auto'
  }
};

class MobileIconMenu extends Component {

  logoutHandler = () => {
    console.log('trying to log out');
    this.props.dispatch(logout());
    hashHistory.push('/');
  }
  
  render() {
    
    const {blockHeight, isMainNet, handleToggle} = this.props;
    
    return (
      <IconMenu
        iconButtonElement={
          <IconButton color="white" style={styles.iconStyle}><MoreVertIcon color="white" style={styles.iconStyle}/></IconButton>
        }
        targetOrigin={styles.menuPlacement}
        anchorOrigin={styles.menuPlacement}
        listStyle={styles.menuListStyle}
      >
        <MenuItem disabled={true}><span>Version: </span><span>{version}</span></MenuItem>
        <MenuItem disabled={true}><span>Block: </span><span>{blockHeight}</span></MenuItem>
        <Divider/>
        <MenuItem >
          <Toggle
            style={{transform: 'translateY(+50%)'}}
            label={isMainNet ? 'MainNet' : 'TestNet'}
            defaultToggled={isMainNet}
            onToggle={handleToggle}
          />
        </MenuItem>
        <MenuItem primaryText="Refresh"/>
        <MenuItem primaryText="Help"/>
        <MenuItem onClick={this.logoutHandler} primaryText="Sign out"/>
      </IconMenu>);
  }
}

const mapStateToProps = (state) => ({
  loggedIn: state.account.loggedIn
});

MobileIconMenu = connect(mapStateToProps)(MobileIconMenu);

export default MobileIconMenu;