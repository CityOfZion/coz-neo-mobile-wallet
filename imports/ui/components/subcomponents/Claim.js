import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setClaimRequest, disableClaim } from '/imports/modules/claim';
import { sendEvent, clearTransactionEvent } from '/imports/modules/transactions';
import { doClaimAllGas, doSendAsset } from 'neon-js';
import RaisedButton from 'material-ui/RaisedButton';

// To initiate claim, first send all Neo to own address, the set claimRequest state
// When new claims are available, this will trigger the claim
const doGasClaim = (dispatch, net, wif, selfAddress, ans) => {
  dispatch(sendEvent(true, "Sending Neo to Yourself..."));
  doSendAsset(net, selfAddress, wif, "Neo", ans).then((response) => {
    if (response.result === undefined){
      dispatch(sendEvent(false, "Transaction failed!"));
    } else {
      dispatch(sendEvent(true, "Waiting for transaction to clear..."));
      dispatch(setClaimRequest(true));
      dispatch(disableClaim(true));
    }
  });
};

class Claim extends Component {

  constructor() {
    super();
    
    this.state = {
      claiming: false,
      remainingSeconds: 0
    }
  }
  
  countdown() {
    this.setState({remainingSeconds: 300});
    const countdown = setInterval(() => {
      if(this.state.remainingSeconds <= 0) {
        clearInterval(countdown);
        this.setState({claiming: false});
      } else {
        this.setState({remainingSeconds: this.state.remainingSeconds - 1});
      }
    }, 1000);
  }
  
  componentDidUpdate = () => {
    // if we requested a claim and new claims are available, do claim
    if (this.props.claimRequest === true && this.props.claimWasUpdated === true){
      this.props.dispatch(setClaimRequest(false));
      doClaimAllGas(this.props.net, this.props.wif).then((response) => {
        if (response.result === true){
          this.props.dispatch(sendEvent(true, "Claim was successful! Your balance will update once the blockchain has processed it."));
        } else {
          this.props.dispatch(sendEvent(false, "Claim failed"))
        }
        setTimeout(() => {
          this.props.dispatch(clearTransactionEvent());
        }, 5000);
      });
    }
  }

  render = () => {
    let renderButton;
    const doClaim = () => {
      this.setState({claiming: true});
      this.countdown();
      doGasClaim(this.props.dispatch, this.props.net, this.props.wif, this.props.address, this.props.neo);
    };
    const claimLabel = this.state.claiming ? `${this.state.remainingSeconds}s remaining for next claim` : `Claim ${this.props.claimAmount} GAS`;

    renderButton = (<div>
      <RaisedButton
        label={claimLabel}
        primary={true}
        disabled={this.state.claiming}
        onClick={doClaim}
      />
      </div>);
    return <div id="claim">{renderButton}</div>;
  }

}

const mapStateToProps = (state) => ({
  claimAmount: state.claim.claimAmount,
  claimRequest: state.claim.claimRequest,
  claimWasUpdated: state.claim.claimWasUpdated,
  disableClaimButton: state.claim.disableClaimButton,
  claiming: state.claim.claiming,
  remainingSeconds: state.claim.remainingSeconds,
  wif: state.account.wif,
  address: state.account.address,
  net: state.metadata.network,
  neo: state.wallet.Neo
});

Claim = connect(mapStateToProps)(Claim);

export default Claim;
