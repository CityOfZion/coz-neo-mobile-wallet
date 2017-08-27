import React, {Component} from 'react';
import PropTypes from 'prop-types';

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

export default class MobileIconMenu extends Component {

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
        <MenuItem primaryText="Sign out"/>
      </IconMenu>);
  }
}

MobileIconMenu.propTypes = {
  blockHeight: PropTypes.number,
  isMainNet: PropTypes.bool,
  handleToggle: PropTypes.func
};