import React from "react";
import firestore from "../firestore";
import {setUserSession} from "../utils/sessionUtils";
import 'antd/dist/antd.css';
import './login.css'
import {Form, Input, Button} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';

export default class LoginPage extends React.Component {
    db = firestore.firestore();

    handleSubmit = (values) => {
        this.db.collection("users").doc(values.name).get().then((doc) => {
            if ((doc.data())) {
                if (doc.data().password === values.password) {
                    const user = {"name": doc.id, ...doc.data()};
                    setUserSession(user);
                    user.type === "admin" ? this.props.history.push('/admin') : this.props.history.push('/user')
                }
            }
        }).catch((error) => {
            alert(error)
        })
    };

    render() {
        return (
            <div className="container">
                <br/>
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={this.handleSubmit}
                >
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Введите имя',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Имя"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Введите пароль',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="Пароль"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}