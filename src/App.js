import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import LoginPage from "./components/LoginPage";
import AdminTablePage from "./components/AdminTablePage";
import PrivateRoute from "./components/PrivateRoute";
import UserTablePage from "./components/UserTablePage";

export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={LoginPage}/>
                <PrivateRoute path="/admin" component={AdminTablePage}/>
                <PrivateRoute path="/user" component={UserTablePage}/>
            </Switch>
        </BrowserRouter>
    );
}
