import React, {useEffect, useState} from 'react'
import {Button, Layout, Menu, PageHeader, Popconfirm, Spin, message, Modal, Upload} from 'antd';
import firestore from "../../firestore";
import {CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined} from '@ant-design/icons';
import {LocationInfo} from "./LocationInfo";
import InboxOutlined from "@ant-design/icons/es/icons/InboxOutlined";
import Header from "../../components/Header";


export default function Stocktaking() {
    const {SubMenu} = Menu;
    const {Content, Sider} = Layout;
    const [locations, setLocations] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [startStocktakingModalVisible, setStartStocktakingModalVisible] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(-1);
    const [currentStocktaking, setCurrentStocktaking] = useState();
    const db = firestore.firestore();
    const date = new Date();

    useEffect(() => {
        db.collection("locations").get().then((querySnapshot) => {
            const temp = [];
            querySnapshot.forEach((doc) => {
                temp.push({"id": doc.id, ...doc.data()})
            });
            setLocations(temp.sort((a, b) => a.id - b.id))
        }).catch((error) => {
            alert(error)
        });

        db.collection("current").doc("stocktaking").get().then((doc) => {
                setCurrentStocktaking(doc.data().date);
                setLoading(false);
            }
        ).catch((error) => {
            alert(error)
        });
    }, [isLoading]);

    const draggerProps = {
        accept: ".csv",
        name: 'file',
        action: 'upload',
        onChange(info) {
            const {status} = info.file;
            if (status !== 'uploading') {
                console.log(info.file);
            }
            if (status === 'done') {
                message.success(`Файл ${info.file.name} успешно загружен.`);
            } else if (status === 'error') {
                message.error(`Файл ${info.file.name} не загружен, произошла ошибка.`);
            }
        },
    };

    const handleClick = e => {
        setCurrentLocation(parseInt(e.key))
    };

    const getMenuItemByLocationStatus = (status) =>
        locations
            .filter(location => location.status === status)
            .map(location => <Menu.Item key={location.id}>{`Кабинет ${location.id}`}</Menu.Item>);

    const startStocktaking = () => {
        setLoading(true);
        db.collection("items").get().then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                const itemData = doc.data();
                itemData["found"] = false
                db.collection("current")
                    .doc("stocktaking")
                    .collection(date.getMonth().toString() + "." + date.getFullYear().toString())
                    .doc(doc.id)
                    .set(itemData);
            });

            locations.forEach(location => {
                    db.collection("locations")
                        .doc(location.id)
                        .set({status: "NOT_CHECKED"});
                }
            );
            //месяц и год начала новой инвентаризации
            db.collection("current")
                .doc("stocktaking")
                .set({date: date.getMonth().toString() + "." + date.getFullYear().toString()});
        }).catch((error) => {
            alert(error)
        });
        message.success('Инвентаризация начата');
    };

    const stopStocktaking = () => {
        setLoading(true);
        db.collection("current")
            .doc("stocktaking")
            .set({date: ""});
    };

    return (
        <Layout className="wrapper">
            <Header selected={"stocktaking"}/>
            <Layout>
                <Sider style={{
                    overflow: 'auto',
                    height: '90vh',
                    position: 'fixed',
                    left: 0,
                    background: "white"
                }} width={225}>
                    <Menu
                        onClick={handleClick}
                        mode="inline"
                        defaultOpenKeys={['OK', 'NOT_ENOUGH', 'NOT_CHECKED']}
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

                <Layout style={{marginLeft: 250, marginRight: 25, marginTop: 25}}>
                    <PageHeader
                        ghost={false}
                        title="Инвентаризация"
                        extra={[currentStocktaking?.length !== 0 ?
                            <Popconfirm
                                title="Вы уверены?"
                                onConfirm={stopStocktaking}
                                onCancel={() => {
                                }}
                                okText="Да"
                                cancelText="Нет"
                            >
                                <Button key="1" type="primary" danger>
                                    Закончить инвентаризацию
                                </Button>
                            </Popconfirm>
                            :
                            <>
                                <Button key="1" type="primary" onClick={() => setStartStocktakingModalVisible(true)}>
                                    Начать инвентаризацию
                                </Button>
                                <Modal
                                    title="Начало инвентаризации"
                                    visible={startStocktakingModalVisible}
                                    onOk={startStocktaking}
                                    onCancel={() => setStartStocktakingModalVisible(false)}
                                    footer={[
                                        <Button key="back" onClick={() => setStartStocktakingModalVisible(false)}>
                                            Назад
                                        </Button>,
                                        <Button key="submit" type="primary" loading={isLoading}
                                                onClick={startStocktaking}>
                                            Продолжить
                                        </Button>,
                                    ]}
                                >
                                    <p>Перед началом загрузите данные из базы, если они есть. Если их нет, просто
                                        нажмите
                                        "Продолжить", данные подгрузятся из старой базы. Загружаемые данные должны быть
                                        в
                                        виде
                                        таблицы в формате .csv со следующими колонками:
                                    </p>
                                    <ul>
                                        <li>name - название предмета</li>
                                        <li>id - инвентарник</li>
                                        <li>purchaseDate - дата принятия к учету</li>
                                    </ul>
                                    <Upload.Dragger {...draggerProps}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined/>
                                        </p>
                                        <p className="ant-upload-hint">Кликните или перетащите файл для загрузки</p>
                                    </Upload.Dragger>
                                </Modal>
                            </>
                        ]}
                    />

                    <Content className="site-layout-background" style={{
                        padding: '0 24px',
                        overflow: 'auto'
                    }}>
                        {isLoading ?
                            <div style={{textAlign: "center", paddingTop: 200}}><Spin size="large"/></div>
                            :
                            currentStocktaking !== "" ?
                                currentLocation === -1 ?
                                    <div style={{textAlign: "center", paddingTop: 200}}>Выберите кабинет слева</div>
                                    :
                                    <LocationInfo location={currentLocation} currentStocktaking={currentStocktaking}/>
                                :
                                <div style={{textAlign: "center", paddingTop: 200}}>Начните инвентаризацию</div>
                        }
                    </Content>
                </Layout>
            </Layout>
            <Layout.Footer style={{textAlign: 'center'}}>ГКУ РО "ГАРО"</Layout.Footer>
        </Layout>
    )
}