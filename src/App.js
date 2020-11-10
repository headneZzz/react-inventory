import React from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import LoginPage from "./pages/login";
import PrivateRoute from "./components/PrivateRoute";
import Stocktaking from "./pages/stocktaking";
import QRCodes from "./pages/qr-codes";
import Items from "./pages/items";
import 'antd/dist/antd.css';
import './main.css';

export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/login" component={LoginPage}/>
                <PrivateRoute path="/stocktaking" component={Stocktaking}/>
                <PrivateRoute path="/items" component={Items}/>
                <PrivateRoute path="/qr-codes" component={QRCodes}/>
                <Redirect from="/" to="/stocktaking"/>
            </Switch>
        </BrowserRouter>
    );
}
