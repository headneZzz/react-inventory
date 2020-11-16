import React, {useEffect, useState} from "react"
import {Layout, Card, Spin} from "antd";
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
                    setItems(items);
                    items.forEach(item => {
                        var QRCode = require('qrcode')
                        var canvas = document.getElementById(item.id)

                        QRCode.toCanvas(canvas, item.id, function (error) {
                            if (error) console.error(error)
                            console.log('success!');
                        })
                        // const typeNumber = 0;
                        // const errorCorrectionLevel = 'Q';
                        // const data = item.id;
                        // const qr = qrcode(typeNumber, errorCorrectionLevel);
                        // qr.addData(data);
                        // qr.make();
                        // document.getElementById(item.id).innerHTML = qr.createImgTag(4);
                    })
                }
            );

    }, []);

    return (
        <Layout>
            <Header selected={"qr-codes"}/>
            <Content style={{padding: '0 50px'}}>
                <Layout className="site-layout-background">
                    <Content style={{padding: '0 0', minHeight: 480}}>
                        <Card title="QR коды">
                            {items.length !== 0 ?
                                items.map(item =>
                                    <Card.Grid hoverable={false} style={{
                                        width: '25%',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{height: 118, width: 118, margin: "0 auto"}}>
                                            <canvas id={item.id}/>
                                        </div>

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