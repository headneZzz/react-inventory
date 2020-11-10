import React, {useEffect, useState} from 'react'
import firestore from "../../firestore";
import {Button, Input, List, Modal, Popconfirm, message} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import qrcode from "qrcode-generator";

export function LocationInfo(props) {
    const [items, setItems] = useState([{}]);
    const [newItemModalVisible, setNewItemModalVisible] = useState(false);
    const [newItemModalInput, setNewItemModalInput] = useState("");

    const [editItemModalVisible, setEditItemModalVisible] = useState(false);
    const [editItemModalInput, setEditItemModalInput] = useState("");

    const [currentEditItem, setCurrentEditItem] = useState({});
    const [currentDeleteItemId, setCurrentDeleteItemId] = useState({});
    const db = firestore.firestore();

    useEffect(() => {
        db.collection("current")
            .doc("stocktaking")
            .collection(props.currentStocktaking)
            .doc(props.location)
            .get()
            .then((doc) => {
                const itemsMap = doc.data().items;
                const temp = [];
                const newItems = [];
                temp.push(...Object.entries(itemsMap).map(([id, status]) => {
                    return {id: id, status: status}
                }));
                temp.sort((a, b) => a.id - b.id);
                temp.forEach(item => {
                    db.collection("items")
                        .doc(item.id)
                        .get()
                        .then(newDoc => {
                                const newItem = newDoc.data();
                                newItem["id"] = item.id;
                                newItem["status"] = item.status;
                                newItems.push(newItem);
                                console.log(props.location);
                                console.log(newItem)
                            }
                        );
                });
                //FIXME
                setItems(newItems);
            })
            .catch((error) => {
                alert(error)
            });
    }, [props]);

    const addItemInCurrentLocation = () => {
        const newItems = {};
        items.forEach(item => newItems[item.id] = item.status);
        newItems[newItemModalInput] = false;
        db.collection("current")
            .doc("stocktaking")
            .collection(props.currentStocktaking)
            .doc(props.location)
            .update({
                items: newItems
            })
            .then(() => {
                setItems(prevState => [...prevState, {id: newItemModalInput, status: false}]);
                setNewItemModalVisible(false)
            })
            .catch((error) => message("Ошибка" + error));
    };

    const saveItemChanges = () => {
        message.info("Сохранение еще не работает")
    };

    const deleteItemFromCurrentLocation = () => {
        const newItems = {};
        items.forEach(item => {
            newItems[item.id] = item.status
        });
        delete newItems[currentDeleteItemId];
        db.collection("current")
            .doc("stocktaking")
            .collection(props.currentStocktaking)
            .doc(props.location)
            .update({
                items: newItems
            })
            .then(() => {
                let itemsInZeroLocation;
                db.collection("current")
                    .doc("stocktaking")
                    .collection(props.currentStocktaking)
                    .doc(props.location)
                    .get()
                    .then((doc) => {
                        itemsInZeroLocation = doc.data().items;
                        itemsInZeroLocation[currentDeleteItemId] = false;
                        db.collection("current")
                            .doc("stocktaking")
                            .collection(props.currentStocktaking)
                            .doc("0")
                            .update({
                                items: itemsInZeroLocation
                            })
                            .then(() => {
                                    setItems(prevState => prevState.filter(item => item.id !== currentDeleteItemId))
                                }
                            );
                    });
            })
            .catch((error) => message("Ошибка" + error));
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
                                Перенести
                            </a>,
                            <Popconfirm
                                title="Вы уверены, что хотите убрать предмет из этого кабинета?"
                                onConfirm={deleteItemFromCurrentLocation}
                                onCancel={() => {
                                }}
                                okText="Да"
                                cancelText="Нет"
                            >
                                <a key={item.id} onClick={() => {
                                    setCurrentDeleteItemId(item.id)
                                }} style={{color: "#c40d10"}}>
                                    Убрать
                                </a>
                            </Popconfirm>

                        ]}>
                        <List.Item.Meta
                            avatar={item.status ? <CheckCircleOutlined style={{color: "#52c41a"}}/> :
                                <CloseCircleOutlined style={{color: "#c40d10"}}/>}
                            title={item.id}
                            description={item.name}
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
                onOk={addItemInCurrentLocation}
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
                <Input value={newItemModalInput} onChange={(e) => setNewItemModalInput(e.target.value)}/>
            </Modal>
        </>
    )
}