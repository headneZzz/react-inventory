import {Layout, Menu} from "antd";
import {AppstoreOutlined, TableOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {Link} from "react-router-dom";

export default (props) => {
    const {Header} = Layout;
    return (
        <Header className="header">
            <Menu selectedKeys={props.selected} theme="dark" mode="horizontal">
                {/*<Menu.Item key="report" icon={<PieChartOutlined/>}>*/}
                {/*    Отчет*/}
                {/*</Menu.Item>*/}
                <Menu.Item key="stocktaking" icon={<AppstoreOutlined/>}>
                    <Link to={"stocktaking"}>
                        Инвентаризация
                    </Link>
                </Menu.Item>
                <Menu.Item key="items" icon={<TableOutlined/>}>
                    <Link to={"items"}>
                        Предметы
                    </Link>
                </Menu.Item>
                <Menu.Item key="qr-codes" icon={<AppstoreOutlined/>}>
                    <Link to={"qr-codes"}>
                        QR коды
                    </Link>
                </Menu.Item>
            </Menu>
        </Header>
    )
}