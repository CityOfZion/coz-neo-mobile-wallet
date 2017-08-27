import React from 'react';
import { Route, IndexRoute} from 'react-router';
import App from '/imports/ui/components/App';
import Login from '/imports/ui/components/Login';
import CreateWallet from '/imports/ui/components/CreateWallet';
import Send from '/imports/ui/components/tabs/Send';
import Dashboard from '/imports/ui/containers/Dashboard';
import ImportWallet from "/imports/ui/components/ImportWallet";

export default (
	<Route path="/" component={App}>
		<IndexRoute component={Login} />
		<Route path="/dashboard" component={Dashboard} />
		<Route path="/import" component={ImportWallet} />
		<Route path="/create" component={CreateWallet} />
		<Route path="/send" component={Send} />
	</Route>
);
