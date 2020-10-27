import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import UserTablePage from "./pages/UserTablePage";
import MainPage from "./pages/MainPage";
import 'antd/dist/antd.css';
import './main.css';

export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/login" component={LoginPage}/>
                <PrivateRoute path="/" component={MainPage}/>
                <PrivateRoute path="/user" component={UserTablePage}/>
            </Switch>
        </BrowserRouter>
    );
}
