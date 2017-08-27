import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import WalletInfo from '../components/tabs/WalletInfo';
import TransactionHistory from '../components/tabs/TransactionHistory';
import AppBar from 'material-ui/AppBar';

import Send from '../components/tabs/Send';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

import MobileIconMenu from "../components/subcomponents/MobileIconMenu";
import LeftMenu from "../components/subcomponents/LeftMenu";

const logo = '/images/neon-logo.png';

const TransactionStatus = ({status, statusMessage}) => {
  let message = null;
  if (status === true) {
    message = (<div className="statusMessage success">
      {statusMessage}
    </div>);
  }
  else if (status === false) {
    message = <div className="statusMessage fail">{statusMessage}</div>;
  }
  return message;
};

const styles = {
  logoDiv: {
    marginTop: 'auto',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    verticalAlign: 'middle'
  },
  logo: {
    order: 1,
    height: '80%',
    verticalAlign: 'middle',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  running: {
    width: '100%',
    textAlign: 'right',
    order: 2
  },
  headline: {
    fontSize: 16,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10,
    marginTop: 50
  },
  menuListStyle: {
    marginLeft: 0,
    paddingLeft: 0
  },
  menuInfo: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  menuPlacement: {
    horizontal: 'right',
    vertical: 'top'
  },
  titleStyle: {
    fontSize: '1em'
  },
  toggle: {
    marginTop: 'auto',
    marginBottom: 'auto'
  }
};

class Dashboard extends Component {
  
  constructor() {
    super();
    this.state = {
      slideIndex: 0,
      mainNet: true,
      menuOpen: false
    };
  }
  
  handleMainNetToggle = () => {
    this.setState({mainNet: !this.state.mainNet});
  };
  
  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };
  
  handleMenuToggle = () => {
    this.setState({menuOpen: !this.state.menuOpen});
  };
  
  render = () => {
    let sendPaneClosed, statusPaneSize;
    
    if (this.props.sendPane === true) {
      sendPaneClosed = "0%";
    } else {
      if (this.props.confirmPane === false) {
        sendPaneClosed = "21%";
      } else {
        sendPaneClosed = "15%";
      }
    }
    if (this.props.status !== null) {
      statusPaneSize = "30px";
    } else {
      statusPaneSize = "0px";
    }

    if(!this.props.wif) {
      browserHistory.push('/login');
    }
    
    return (
      <div id="dashboard">
        <div id="headerInfo">
          <AppBar
            onLeftIconButtonTouchTap={this.handleMenuToggle}
            title={<div style={styles.logoDiv}><img src={logo} style={styles.logo} /><span style={styles.running}>Running on {this.state.mainNet ? 'MainNet' : 'TestNet'}</span></div>}
            titleStyle={styles.titleStyle}
            iconElementRight={
            <MobileIconMenu
              blockHeight={this.props.blockHeight}
              handleToggle={this.handleMainNetToggle}
              isMainNet={this.state.mainNet}
            />
            }
          />
          <LeftMenu handleMenuToggle={this.handleMenuToggle} open={this.state.menuOpen}/>
          <TransactionStatus status={this.props.status} statusMessage={this.props.statusMessage}/>
          <Tabs
            onChange={this.handleChange}
            value={this.state.slideIndex}
          >
            <Tab label="Wallet" value={0}/>
            <Tab label="Transfer" value={1}/>
            <Tab label="Transactions" value={2}/>
          </Tabs>
        </div>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
          style={{marginTop: "10vh"}}
        >
          <div style={styles.slide}>
            <WalletInfo/>
          </div>
          <div style={styles.slide}>
            <Send/>
          </div>
          <div style={styles.slide}>
            <TransactionHistory/>
          </div>
        </SwipeableViews>
      </div>);
  }
  
}

const mapStateToProps = (state) => ({
  wif: state.account.wif,
  sendPane: state.dashboard.sendPane,
  confirmPane: state.dashboard.confirmPane,
  status: state.transactions.success,
  statusMessage: state.transactions.message,
  blockHeight: state.metadata.blockHeight
});

Dashboard = connect(mapStateToProps)(Dashboard);

export default Dashboard;
