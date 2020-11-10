import React, {useEffect, useState} from "react"
import {Layout, Card, Spin} from "antd";
import qrcode from "qrcode-generator"
import firestore from "../../firestore";
import Header from "../../components/Header";
import "./qrcodes.css"

const QRCodes = () => {
    const {Content} = Layout;
    const db = firestore.firestore();
    const [items, setItems] = useState([]);

    useEffect(() => {
        db.collection("items")
            .where("working", "==", true)
            .get()
            .then(querySnapshot => {
                    const items = [];
                    querySnapshot.forEach(doc => {
                        items.push({"id": doc.id, ...doc.data()})
                    });
                    console.log(items);
                    setItems(items);
                    items.forEach(item => {
                        const typeNumber = 0;
                        const errorCorrectionLevel = 'Q';
                        const data = item.id;
                        const qr = qrcode(typeNumber, errorCorrectionLevel);
                        qr.addData(data);
                        qr.make();
                        document.getElementById(item.id).innerHTML = qr.createImgTag(4);
                    })
                }
            );

    }, []);

    return (
        <Layout>
            <Header selected={"qr-codes"}/>
            <Content style={{padding: '0 50px'}}>
                <Layout className="site-layout-background">
                    <Content style={{padding: '0 24px', minHeight: 480}}>
                        <Card title="QR коды">
                            {items.length !== 0 ?
                                items.map(item =>
                                    <Card.Grid hoverable={false} style={{
                                        width: '25%',
                                        textAlign: 'center'
                                    }}>
                                        <div
                                            style={{height: 118, width: 118, margin: "0 auto"}}
                                            id={item.id}/>
                                        <span><b>{item.id}</b></span>
                                    </Card.Grid>)
                                :
                                <div style={{textAlign: "center", paddingTop: 100}}><Spin size="large"/></div>
                            }
                        </Card>
                    </Content>
                </Layout>
            </Content>
        </Layout>
    )
};
export default QRCodes