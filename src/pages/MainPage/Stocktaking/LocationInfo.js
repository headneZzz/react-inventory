import React, {useEffect, useState} from 'react'
import firestore from "../../../firestore";
import {Button, Input, List, Modal, Popconfirm, message} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';

export function LocationInfo(props) {
    const [items, setItems] = useState([{}]);
    const [editItemModalVisible, setEditItemModalVisible] = useState(false);
    const [newItemModalVisible, setNewItemModalVisible] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState({});
    const db = firestore.firestore();

    useEffect(() => {
        const temp = [];
        db.collection("current").doc("stocktaking").collection(new Date().getFullYear().toString()).doc(props.location).get().then((doc) => {
            const itemsMap = doc.data().items;
            temp.push(...Object.entries(itemsMap).map(([id, status]) => {
                return {id: id, status: status}
            }));
            setItems(temp.sort((a, b) => a.id - b.id));
        }).catch((error) => {
            alert(error)
        });
    }, [props]);

    const addItemInCurrentLocation = () => {
        message.info("Добавление еще не работает")
    };

    const saveItemChanges = () => {
        message.info("Сохранение еще не работает")
    };

    const deleteItemFromCurrentLocation = () => {
        message.info("Удаление еще не работает")
    };

    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={items}
                renderItem={item => (
                    <List.Item
                        actions={[
                            <a key={item.id} onClick={() => {
                                setCurrentEditItem(item);
                                setEditItemModalVisible(true)
                            }}>
                                Изменить
                            </a>,
                            <Popconfirm
                                title="Вы уверены, что хотите убрать предмет из этого кабинета?"
                                onConfirm={deleteItemFromCurrentLocation}
                                onCancel={() => {
                                }}
                                okText="Да"
                                cancelText="Нет"
                            >
                                <a key={item.id} style={{color: "#c40d10"}}>
                                    Убрать
                                </a>
                            </Popconfirm>

                        ]}>
                        <List.Item.Meta
                            avatar={item.status ? <CheckCircleOutlined style={{color: "#52c41a"}}/> :
                                <CloseCircleOutlined style={{color: "#c40d10"}}/>}
                            title={item.id}
                        />

                    </List.Item>

                )}>
            </List>
            <Modal
                title={currentEditItem.id}
                visible={editItemModalVisible}
                onOk={saveItemChanges}
                onCancel={() => setEditItemModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setEditItemModalVisible(false)}>
                        Назад
                    </Button>,
                    <Button key="submit" type="primary" onClick={saveItemChanges}>
                        Сохранить
                    </Button>,
                ]}
            >
                <label>Кабинет</label>
                <Input value={props.location}/>
            </Modal>

            <a style={{paddingLeft: "30px"}} onClick={() => setNewItemModalVisible(true)}>Добавить предмет</a>
            <Modal
                title={"Новый предмет"}
                visible={newItemModalVisible}
                onOk={saveItemChanges}
                onCancel={() => setNewItemModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setNewItemModalVisible(false)}>
                        Назад
                    </Button>,
                    <Button key="submit" type="primary" onClick={addItemInCurrentLocation}>
                        Добавить
                    </Button>,
                ]}
            >
                <label>Инвентарник</label>
                <Input/>
            </Modal>
        </>
    )
}