import React, {Component} from 'react';
import MdSync from 'react-icons/lib/md/sync';
import {connect} from 'react-redux';
import {sendEvent, clearTransactionEvent} from '/imports/modules/transactions';
import Paper from 'material-ui/Paper';
import {initiateGetBalance, intervals} from "/imports/ui/components/subcomponents/NetworkSwitch";
import RefreshIndicator from 'material-ui/RefreshIndicator';

const styles = {
  claim: {
    maxHeight: '15vw',
    textAlign: 'center',
    verticalAlign: 'middle',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  }
};

class Balance extends Component {
  
  constructor() {
    super();
    this.state = {
      refreshing: false
    }
  }
  
  refreshBalance = (dispatch, net, address) => {
    this.setState({refreshing: true});
    dispatch(sendEvent(true, "Refreshing..."));
    initiateGetBalance(dispatch, net, address).then((response) => {
      dispatch(sendEvent(true, "Received latest blockchain information."));
      setTimeout(() => dispatch(clearTransactionEvent()), 1000);
      this.setState({refreshing: false});
    });
  };
  
  componentDidMount = () => {
    initiateGetBalance(this.props.dispatch, this.props.net, this.props.address);
  };
  
  render() {
    return (
      <div id="balance">
        <div id="amountRow">
          <div className="split neo">
            <div className="label">NEO</div>
            <div className="amountBig">{this.props.neo}</div>
          </div>
          <div
            className="refresh"
            onClick={() => this.refreshBalance(this.props.dispatch, this.props.net, this.props.address)}>
            <RefreshIndicator
              percentage={100}
              top={0}
              left={0}
              status={this.state.refreshing ? 'loading' : 'ready'}
              style={styles.claim}
            />
          </div>
          <div className="split gas">
            <div className="label">GAS</div>
            <div className="amountBig">{this.props.gas < 0.001 ? 0 : this.props.gas.toPrecision(5)}</div>
          </div>
        </div>
        <div className="fiat">US {this.props.price}</div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  address: state.account.address,
  net: state.metadata.network,
  price: state.wallet.price
});

Balance = connect(mapStateToProps)(Balance);

export default Balance;