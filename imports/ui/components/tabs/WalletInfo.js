import React, {Component} from 'react';
import {connect} from 'react-redux';
import Claim from "../subcomponents/Claim.js";
import QRCode from 'qrcode';
import Copy from 'react-icons/lib/md/content-copy';
import ReactTooltip from 'react-tooltip'
import Divider from 'material-ui/Divider';
import CopyToClipboard from 'react-copy-to-clipboard';
import Balance from "../subcomponents/Balance";

class WalletInfo extends Component {
  
  componentDidMount = () => {
    QRCode.toCanvas(this.canvas, this.props.address, {version: 5}, (err) => {
      if (err) console.log(err)
    });
  }
  
  render = () => {
    if (this.props.address !== null) {
      return (
        <div id="accountInfo">
          <div className="label">Your Public Neo Address:</div>
          <div className="address">
            {this.props.address}
            <span className="copyKey">
              <CopyToClipboard text={this.props.address}>
                <Copy data-tip data-for="copyAddressTip"/>
              </CopyToClipboard>
            </span>
          </div>
          <ReactTooltip class="solidTip" id="copyAddressTip" place="bottom" type="dark" effect="solid">
            <span>Copy Public Address</span>
          </ReactTooltip>
          <Divider/>
          <Balance/>
          <Divider/>
          <Claim/>
          <Divider/>
          <div className="qrCode">
            <canvas id="qrCanvas" ref={(node) => this.canvas = node}></canvas>
          </div>
        </div>);
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => ({
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  address: state.account.address,
  net: state.metadata.network,
  price: state.wallet.price
});

WalletInfo = connect(mapStateToProps)(WalletInfo);

export default WalletInfo;
