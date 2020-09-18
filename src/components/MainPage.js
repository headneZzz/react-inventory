import React, {useState} from "react";
import {Layout, Menu} from 'antd';
import {AppstoreOutlined, TableOutlined} from '@ant-design/icons';
import ItemsTable from "./ItemsTable";
import StocktackingItems from "./StocktackingItems";
import {getUser} from "../utils/sessionUtils";

function CurrentPage(props) {
    if (props.page === "items")
        return <ItemsTable user={getUser()}/>;
    else if (props.page === "stocktaking")
        return <StocktackingItems/>
}

export default function MainPage() {
    const { Header, Footer } = Layout;
    const [page, setPage] = useState('stocktaking');

    const handleClick = e => {
        setPage(e.key);
    };

    return (
        <Layout className="wrapper">
            <Header className="header">
                <Menu onClick={handleClick} selectedKeys={page} theme="dark" mode="horizontal">
                    <Menu.Item key="stocktaking" icon={<AppstoreOutlined/>}>
                        Инвентаризация
                    </Menu.Item>
                    <Menu.Item key="items" icon={<TableOutlined/>}>
                        Предметы
                    </Menu.Item>
                </Menu>
            </Header>
            <Layout style={{padding: '40px 50px'}}>
                <CurrentPage page={page}/>
            </Layout>
            <Footer style={{ textAlign: 'center' }}></Footer>
        </Layout>
    );
}