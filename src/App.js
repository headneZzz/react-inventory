import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import LoginPage from "./components/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import UserTablePage from "./components/UserTablePage";
import AdminPage from "./components/AdminPage";
import 'antd/dist/antd.css';
import './main.css';

export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={LoginPage}/>
                <PrivateRoute path="/admin" component={AdminPage}/>
                <PrivateRoute path="/stocktaking" component={AdminPage}/>
                <PrivateRoute path="/user" component={UserTablePage}/>
            </Switch>
        </BrowserRouter>
    );
}
