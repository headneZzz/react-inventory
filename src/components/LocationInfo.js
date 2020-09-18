import React, {useEffect, useState} from 'react'
import firestore from "../firestore";
import {List} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';

export default function LocationInfo(props) {
    const [items, setItems] = useState([{}]);

    useEffect(() => {
        const db = firestore.firestore();
        const temp = [];
        db.collection("2020").doc(props.location).get().then((doc) => {
            const itemsMap = doc.data().items;
            temp.push(Object.entries(itemsMap).map(([id, status]) => {
                return {id: id, status: status}
            }));
            setItems(temp[0]);
        }).catch((error) => {
            alert(error)
        });
    }, [props]);

    return (
        <List
            itemLayout="horizontal"
            dataSource={items}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        avatar={item.status ? <CheckCircleOutlined style={{color: "#52c41a"}}/> :
                            <CloseCircleOutlined style={{color: "#c40d10"}}/>}
                        title={<a href="https://ant.design">{item.id}</a>}
                    />
                </List.Item>
            )}>
        </List>
    )
}