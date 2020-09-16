import React, {useState} from "react";
import {Menu} from 'antd';
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

export default function AdminPage() {
    const [page, setPage] = useState('stocktaking');

    const handleClick = e => {
        setPage(e.key);
    };

    return (
        <>
            <Menu onClick={handleClick} selectedKeys={page} mode="horizontal">
                <Menu.Item key="stocktaking" icon={<AppstoreOutlined/>}>
                    Инвентаризация
                </Menu.Item>
                <Menu.Item key="items" icon={<TableOutlined/>}>
                    Предметы
                </Menu.Item>
            </Menu>
            <CurrentPage page={page}/>
        </>
    );
}