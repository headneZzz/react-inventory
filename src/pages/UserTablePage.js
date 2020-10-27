import React from 'react';
import MaterialTable from 'material-table';
import firestore from "../firestore";
import {getUser} from "../utils/sessionUtils";
import localization from "../utils/localization"
import {exportCsv} from "../utils/tableUtils";

export default class UserTablePage extends React.Component {
    db = firestore.firestore();

    componentDidMount() {
        this.getItems();
    }

    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {title: 'Номер', field: 'id'},
                {
                    title: 'Тип',
                    field: 'type',
                    lookup: {
                        "PC": "Системный блок",
                        "MONITOR": "Монитор",
                        "PRINTER": "Принтер",
                        "UPS": "ИБП",
                        "SCANNER": "Сканнер",
                        "ANOTHER": "Другое"
                    }
                },
                {title: 'Кабинет', field: 'location', type: 'numeric'},
                {title: 'Наименование', field: 'name'},
                {title: 'Дата приобретения', field: 'purchaseDate', type: 'date'},
                {title: 'Состояние', field: 'working', type: 'boolean'},
            ],
            data: [],
            user: getUser()
        }
    }

    getItems = async () => {
        const items = [];
        this.db.collection("items").where("location", "==", this.state.user.location).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                items.push({"id": doc.id, ...doc.data()})
            });
            this.setState({data: items})
        }).catch((error) => {
            alert(error)
        });

    };

    convertDate = (date) => {
        function pad(s) {
            return (s < 10) ? '0' + s : s;
        }

        return [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join('.');
    };

    getDiff = (newData, oldData) => {
        let difference = "";
        if (newData.type !== oldData.type) {
            difference += " | Тип: " + oldData.type + " => " + newData.type
        }
        if (newData.location !== oldData.location) {
            difference += " | Кабинет: " + oldData.location + " => " + newData.location
        }
        if (newData.name !== oldData.name) {
            difference += " | Наименование: " + oldData.name + " => " + newData.name
        }
        if (newData.working !== oldData.working) {
            difference += " | Состояние: " + oldData.working + " => " + newData.working
        }
        return difference;
    };

    rowUpdate = (newData, oldData) => {
        newData.history.unshift(
            {
                action: this.getDiff(newData, oldData),
                actionee: this.state.user.name,
                actionDate: this.convertDate(new Date())
            });
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                if (oldData) {
                    const data = [...this.state.data];
                    if (typeof newData.purchaseDate.getMonth === "function") {
                        newData.purchaseDate = this.convertDate(newData.purchaseDate);
                    }
                    const {id, ...newDataWithoutId} = newData;
                    this.db.collection("items").doc(id).set({...newDataWithoutId}).then(() => {
                        data[data.indexOf(oldData)] = newData;
                        this.setState((prevState) => {
                            return {...prevState, data}
                        })
                    }).catch((error) => alert(error));
                }
            }, 600);
        })
    };

    rowHistory = (rowData) => {
        console.log(rowData);
        if (rowData.history.length === 0) {
            return (
                <div style={{padding: '20px 50px 20px 50px', background: "#c3dfff"}}>
                    <h4>История:</h4>
                    <hr/>
                    <h6>Пока изменений нет</h6>
                </div>
            )
        } else {
            return (
                <div style={{padding: '20px 50px 20px 50px', background: "#c3dfff"}}>
                    <h4>История:</h4>
                    <hr/>
                    <h6>Изменения: <br/> {rowData.history[0].action}</h6>
                    <h6>Исполнитель: {rowData.history[0].actionee}</h6>
                    <h6>Дата: {rowData.history[0].actionDate.toString()}</h6>
                </div>
            )
        }
    };

    render() {
        return (
            <MaterialTable
                title={'Кабинет ' + this.state.user.location}
                columns={this.state.columns}
                data={this.state.data}
                options={
                    {
                        selection: true,
                        pageSize: 10,
                        addRowPosition: "first",
                        filtering: true,
                        exportButton: true,
                        exportAllData: true,
                        exportCsv: (columns, renderData) => exportCsv(),
                        exportPdf: () => {
                            alert("В разработке")
                        }

                    }}
                editable={{
                    onRowAdd: (newData) => this.rowAdd(newData)
                }}
                detailPanel={this.rowHistory}
                localization={
                    localization
                }
            />
        );
    }
}
