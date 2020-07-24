import React from 'react';
import firestore from "./firestore";
import {BrowserRouter, Switch, Route, NavLink} from 'react-router-dom';
import LoginPage from "./LoginPage";
import MainTablePage from "./MainTablePage";
import PrivateRoute from "./PrivateRoute";

export default class App extends React.Component {
    db = firestore.firestore();
    user = null;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BrowserRouter>
                <div className="content">
                    <Switch>
                        <Route exact path="/" component={LoginPage}/>
                        <PrivateRoute path="/main" component={MainTablePage}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
