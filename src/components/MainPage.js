import React, {useState} from "react";
import {Layout, Menu} from 'antd';
import {AppstoreOutlined, TableOutlined, PieChartOutlined} from '@ant-design/icons';
import ItemsTable from "./ItemsTable";
import ItemsStocktacking from "./ItemsStocktacking";
import {getUser} from "../utils/sessionUtils";
import ItemsReport from "./ItemsReport";

function CurrentPage(props) {
    if (props.page === "table")
        return <ItemsTable user={getUser()}/>;
    else if (props.page === "stocktaking")
        return <ItemsStocktacking/>;
    else return <ItemsReport/>
}

export default function MainPage() {
    const {Header, Footer} = Layout;
    const [page, setPage] = useState('report');

    const handleClick = e => {
        setPage(e.key);
    };

    return (
        <Layout className="wrapper">
            <Header className="header">
                <Menu onClick={handleClick} selectedKeys={page} theme="dark" mode="horizontal">
                    <Menu.Item key="report" icon={<PieChartOutlined/>}>
                        Отчет
                    </Menu.Item>
                    <Menu.Item key="stocktaking" icon={<AppstoreOutlined/>}>
                        Инвентаризация
                    </Menu.Item>
                    <Menu.Item key="table" icon={<TableOutlined/>}>
                        Предметы
                    </Menu.Item>
                </Menu>
            </Header>
            <Layout style={{padding: '40px 50px'}}>
                <CurrentPage page={page}/>
            </Layout>
            <Footer style={{textAlign: 'center'}}></Footer>
        </Layout>
    );
}