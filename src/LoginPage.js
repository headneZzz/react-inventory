import React from "react";
import {Button, Form, Container, Jumbotron} from "react-bootstrap";
import firestore from "./firestore";
import {setUserSession} from "./SessionUtils";

export default class LoginPage extends React.Component {
    db = firestore.firestore();

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            password: ""
        }
    }

    validateForm = () => {
        return this.state.name.length > 0 && this.state.password.length > 0;
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.db.collection("users").doc(this.state.name).get().then((doc) => {
            if ((doc.data())) {
                if (doc.data().password === this.state.password) {
                    const user = {...doc.data()};
                    console.log(user);
                    setUserSession(user);
                    this.props.history.push('/main')
                }
            }
        }).catch((error) => {
            alert(error)
        })
    };

    render() {
        return (
            <Container>
                <Jumbotron>
                    <h2>Инвентаризация</h2>
                    <form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="name" bsSize="large">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control
                                autoFocus
                                type="name"
                                value={this.state.name}
                                onChange={e => this.setState({name: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group controlId="password" bsSize="large">
                            <p>Пароль</p>
                            <Form.Control
                                value={this.state.password}
                                onChange={e => this.setState({password: e.target.value})}
                                type="password"
                            />
                        </Form.Group>
                        <Button bsSize="large" disabled={!this.validateForm()} type="submit">
                            Войти
                        </Button>
                    </form>
                </Jumbotron>
            </Container>
        );
    }
}