import React from 'react';
import firestore from "./firestore";
import LoginPage from "./LoginPage";
import MainTablePage from "./MainTablePage";

export default class App extends React.Component {
    db = firestore.firestore();
    user = null;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            this.user ?
                <MainTablePage />
                :
                <LoginPage />
        );
    }
}
