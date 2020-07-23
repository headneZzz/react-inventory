import React from 'react';
import MaterialTable from 'material-table';
import jsPDF from "jspdf"
import {CsvBuilder} from "filefy";
import firestore from "./firestore";

export default class MainTablePage extends React.Component {
    db = firestore.firestore();

    componentDidMount() {
        this.getItems();
    }

    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {title: 'Номер', field: 'id', editable: 'onAdd'},
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
            data: []
        }
    }

    getItems = async () => {
        const items = [];
        this.db.collection("items").get().then((querySnapshot) => {
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

    rowAdd = (newData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (newData.id == null) {
                    alert("Введите номер");
                    reject();
                } else if (this.state.data.some(el => el.id === newData.id)) {
                    alert("Такой номер уже есть");
                    reject();
                } else if (newData.purchaseDate === undefined) {
                    alert("Введите дату приобретения");
                    reject();
                } else {
                    const data = [...this.state.data];
                    Object.assign(newData, {history: []});
                    newData.purchaseDate = this.convertDate(newData.purchaseDate);
                    const {id, ...newDataWithoutId} = newData;
                    this.db.collection("items").doc(newData.id).set({...newDataWithoutId}).then(() => {
                        console.log(newData);
                        data.push(newData);
                        this.setState((prevState) => {
                            return {...prevState, data}
                        })
                    }).catch((error) => alert(error));
                    resolve();
                }
            }, 600);
        })
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
                actionee: "Админ",
                actionDate: this.convertDate(new Date())
            });
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                if (oldData) {
                    const data = [...this.state.data];
                    if(typeof newData.purchaseDate.getMonth === "function") {
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

    rowDelete = (oldData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                const data = [...this.state.data];
                this.db.collection("items").doc(oldData.id).delete().then(() => {
                    data.splice(data.indexOf(oldData), 1);
                    this.setState((prevState) => {
                        return {...prevState, data}
                    });
                }).catch((error) => alert(error));
            }, 600);
        })
    };

    rowHistory = (rowData) => {
        console.log(rowData);
        if (rowData.history.length === 0) {
            return (
                <div style={{padding: '10px 50px 10px 50px', background: "#c3dfff"}}>
                    <h2>История:</h2>
                    <hr/>
                    <h4>Пока изменений нет</h4>
                </div>
            )
        } else {
            return (
                <div style={{padding: '10px 50px 10px 50px', background: "#c3dfff"}}>
                    <h2>История:</h2>
                    <hr/>
                    <h4>Изменения: <br/> {rowData.history[0].action}</h4>
                    <h4>Исполнитель: {rowData.history[0].actionee}</h4>
                    <h4>Дата: {rowData.history[0].actionDate.toString()}</h4>
                </div>
            )
        }
    };

    byString = (o, s) => {
        if (!s) {
            return;
        }

        s = s.replace(/\[(\w+)\]/g, ".$1");
        s = s.replace(/^\./, "");
        const a = s.split(".");
        let i = 0, n = a.length;
        for (; i < n; ++i) {
            const x = a[i];
            if (o && x in o) {
                o = o[x];
            } else {
                return;
            }
        }
        return o;
    };

    getFieldValue = (rowData, columnDef, lookup = true) => {
        let value =
            typeof rowData[columnDef.field] !== "undefined"
                ? rowData[columnDef.field]
                : this.byString(rowData, columnDef.field);
        if (columnDef.lookup && lookup) {
            value = columnDef.lookup[value];
        }

        return value;
    };

    getTableData = () => {
        const columns = this.state.columns
            .filter(
                (columnDef) =>
                    !columnDef.hidden && columnDef.field && columnDef.export !== false
            )
            .sort((a, b) =>
                a.tableData.columnOrder > b.tableData.columnOrder ? 1 : -1
            );
        const data = (this.state.data
        ).map((rowData) =>
            columns.map((columnDef) => this.getFieldValue(rowData, columnDef))
        );

        return [columns, data];
    };

    exportCsv = () => {
        const [columns, data] = this.getTableData();
        console.log(columns);
        console.log(data);
        const builder = new CsvBuilder("Инвентаризация.csv");
        builder
            .setColumns(columns.map((columnDef) => columnDef.title))
            .addRows(data)
            .exportFile();
    };

    exportPdf = () => {
        const data = this.state.data;
        const columns = this.state.columns;

        let content = {
            startY: 50,
            head: [columns.map((columnDef) => columnDef.title)],
            body: data,
        };

        const unit = "pt";
        const size = "A4";
        const orientation = "landscape";

        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(15);
        doc.text("Инвентаризация", 40, 40);
        doc.autoTable(content);
        doc.save(
            (this.props.exportFileName || this.props.title || "data") + ".pdf"
        );
    };

    render() {
        return (
            <MaterialTable
                title="Инвентаризация"
                columns={this.state.columns}
                data={this.state.data}
                options={
                    {
                        pageSize: 10,
                        addRowPosition: "first",
                        filtering: true,
                        exportButton: true,
                        exportAllData: true,
                        exportCsv: (columns, renderData) => this.exportCsv(),
                        exportPdf: () => {
                            alert("В разработке")
                        }

                    }}
                editable={{
                    onRowAdd: (newData) => this.rowAdd(newData),
                    onRowUpdate: (newData, oldData) => this.rowUpdate(newData, oldData),
                    onRowDelete: (oldData) => this.rowDelete(oldData)
                }}
                detailPanel={this.rowHistory}
                localization={
                    {
                        toolbar: {
                            searchPlaceholder: 'Поиск',
                            searchTooltip: 'Поиск',
                            exportTitle: 'Экспорт',
                            exportCSVName: 'Экспорт в CSV',
                            exportPDFName: 'Экспорт в PDF'
                        },
                        header: {
                            actions: 'Действия'
                        },
                        body: {
                            addTooltip: 'Добавить',
                            editTooltip: 'Изменить',
                            deleteTooltip: 'Удалить',
                            editRow: {
                                deleteText: 'Вы уверены?',
                                cancelTooltip: 'Отмена',
                                saveTooltip: 'Подтвердить'
                            }
                        },
                        pagination: {
                            labelRowsSelect: 'строк'
                        }
                    }
                }
            />
        );
    }
}
