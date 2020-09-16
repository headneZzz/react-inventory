import React, {useEffect, useState} from 'react'
import {Menu} from 'antd';
import firestore from "../firestore";

export default function StocktackingItems() {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const db = firestore.firestore();
        db.collection("locations").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                setLocations(oldLocations => [...oldLocations, {"id": doc.id, ...doc.data()}]);
            });
        }).catch((error) => {
            alert(error)
        });
    }, []);

    const handleClick = e => {
        console.log('click ', e);
    };

    return (
        <>
            <h1>Кабинеты</h1>
            <Menu
                onClick={handleClick}
                style={{width: 175}}
                mode="inline"
            >
                {locations.sort((location1, location2) => location1.id - location2.id).map(location => <Menu.Item
                    key={location.id}>{`Кабинет ${location.id}`}</Menu.Item>)}
            </Menu>
        </>
    )
}