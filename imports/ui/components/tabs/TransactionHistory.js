import React, { Component } from 'react';
import { connect } from 'react-redux';
import { syncTransactionHistory } from "/imports/ui/components/NetworkSwitch";
import Divider from 'material-ui/Divider';

// TODO: make this a user setting
const getExplorerLink = (net, txid) => {
  let base;
  if (net === "MainNet"){
    base = "http://antcha.in";
  } else {
    base = "http://testnet.antcha.in";
  }
  return base + "/tx/hash/" + txid;
}

// helper to open an external web link
const openExplorer = (srcLink) => {
  console.log(srcLink);
}

class TransactionHistory extends Component {

  componentDidMount = () => {
    syncTransactionHistory(this.props.dispatch, this.props.net, this.props.address);
  }

  render = () =>
    <div id="transactionInfo">
      <div className="columnHeader">Transaction History</div>
      <Divider/>
      <ul id="transactionList">
        {this.props.transactions.map((t, i) => {
          let formatAmount;
          if (t.type === "NEO"){ formatAmount = parseInt(t.amount); }
          else{ formatAmount = parseFloat(t.amount).toPrecision(5); }
          // ignore precision rounding errors for GAS
          if ((formatAmount > 0 && formatAmount < 0.001) || (formatAmount < 0 && formatAmount > -0.001)){
            formatAmount = 0.0.toPrecision(5);
          }
          return (<li key={i}>
              <div className="txid" onClick={() => openExplorer(getExplorerLink(this.props.net, t.txid))}>
                {t.txid.substring(0,32)}</div><div className="amount">{formatAmount} {t.type}
              </div></li>);
        })}
      </ul>
    </div>;
}

const mapStateToProps = (state) => ({
  address: state.account.address,
  net: state.metadata.network,
  transactions: state.wallet.transactions
});

TransactionHistory = connect(mapStateToProps)(TransactionHistory);

export default TransactionHistory;
