import React, {useEffect, useState} from 'react'
import firestore from "../../firestore";
import {Button, Input, List, Modal, Popconfirm, message} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';

export function LocationInfo(props) {
    const [items, setItems] = useState([{}]);
    const [newItemModalVisible, setNewItemModalVisible] = useState(false);
    const [newItemModalInput, setNewItemModalInput] = useState("");

    const [editItemModalVisible, setEditItemModalVisible] = useState(false);
    const [editItemModalInput, setEditItemModalInput] = useState(props.location);
    const [currentEditItemId, setCurrentEditItemId] = useState("");

    const [currentDeleteItemId, setCurrentDeleteItemId] = useState("");
    const db = firestore.firestore();

    useEffect(() => {
        db.collection("current")
            .doc("stocktaking")
            .collection(props.currentStocktaking)
            .where("location", "==", props.location)
            .get()
            .then((querySnapshot) => {
                const temp = []
                querySnapshot.forEach((doc) => {
                    temp.push({"id": doc.id, ...doc.data()})
                });
                setItems(temp.sort((a, b) => a.id - b.id))
            })
            .catch((error) => message.error("Ошибка" + error));
    }, [props]);

    const addItemInCurrentLocation = () => {
        db.collection("current")
            .doc("stocktaking")
            .collection(props.currentStocktaking)
            .doc(newItemModalInput)
            .update({
                location: props.location
            })
            .then(() => {
                setItems(prevState => [...prevState, {id: newItemModalInput, status: false}])
                setNewItemModalVisible(false)
            })
            .catch((error) => message.error("Ошибка" + error));
    };

    const saveItemChanges = () => {
        db.collection("current")
            .doc("stocktaking")
            .collection(props.currentStocktaking)
            .doc(currentEditItemId)
            .update({location: parseInt(editItemModalInput)})
            .then(() => {
                setItems(prevState => prevState.filter(item => item.id !== currentEditItemId))
                setEditItemModalVisible(false)
            })
            .catch((error) => message.error("Ошибка: " + error));
    };

    const deleteItemFromCurrentLocation = () => {
        db.collection("current")
            .doc("stocktaking")
            .collection(props.currentStocktaking)
            .doc(currentDeleteItemId)
            .update({location: 0})
            .then(() => setItems(prevState => prevState.filter(item => item.id !== currentDeleteItemId)))
            .catch((error) => message.error("Ошибка: " + error));
    };
    console.log(items)
    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={items}
                renderItem={item => (
                    <List.Item
                        actions={[
                            <a key={item.id} onClick={() => {
                                setCurrentEditItemId(item.id);
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
                            avatar={item.found ? <CheckCircleOutlined style={{color: "#52c41a"}}/> :
                                <CloseCircleOutlined style={{color: "#c40d10"}}/>}
                            title={item.id}
                            description={item.name}
                        />

                    </List.Item>

                )}>
            </List>
            <Modal
                title={currentEditItemId}
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
                <Input value={editItemModalInput} onChange={(e) => setEditItemModalInput(e.target.value)}/>
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