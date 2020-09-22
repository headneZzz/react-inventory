import React, {useEffect, useState} from 'react'
import {Layout, Menu} from 'antd';
import firestore from "../firestore";
import LocationInfo from "./LocationInfo";
import {CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined} from '@ant-design/icons';


export default function ItemsStocktacking() {
    const {SubMenu} = Menu;
    const {Content, Sider} = Layout;
    const [locations, setLocations] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(-1);

    useEffect(() => {
        const db = firestore.firestore();
        db.collection("locations").get().then((querySnapshot) => {
            const temp = [];
            querySnapshot.forEach((doc) => {
                temp.push({"id": doc.id, ...doc.data()})
            });
            setLocations(temp.sort((a, b) => a.id - b.id))
        }).catch((error) => {
            alert(error)
        });
    }, []);

    const handleClick = e => {
        setCurrentLocation(e.key)
    };

    const getMenuItemByLocationStatus = (status) =>
        locations
            .filter(location => location.status === status)
            .map(location => <Menu.Item key={location.id}>{`Кабинет ${location.id}`}</Menu.Item>);

    return (
        <Content style={{padding: '0 50px'}}>
            <a>Закончить инвентаризацию</a>
            <Layout className="site-layout-background" style={{padding: '24px 0'}}>
                <Sider className="site-layout-background" width={225}>
                    <Menu
                        onClick={handleClick}
                        mode="inline"
                        defaultOpenKeys={['OK']}
                        style={{height: '100%'}}
                    >
                        <SubMenu key="OK" icon={<CheckCircleOutlined/>} title="Все хорошо">
                            {getMenuItemByLocationStatus("OK")}
                        </SubMenu>
                        <SubMenu key="NOT_ENOUGH" icon={<CloseCircleOutlined/>} title="Что то не найдено">
                            {getMenuItemByLocationStatus("NOT_ENOUGH")}
                        </SubMenu>
                        <SubMenu key="NOT_CHECKED" icon={<InfoCircleOutlined/>} title="Еще не проверили">
                            {getMenuItemByLocationStatus("NOT_CHECKED")}
                        </SubMenu>
                    </Menu>
                </Sider>
                <Content style={{padding: '0 24px', minHeight: 280}}>
                    {currentLocation === -1 ? <></> : <LocationInfo location={currentLocation}/>}
                </Content>
            </Layout>
        </Content>
    )
}