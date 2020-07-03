import React from 'react';
import MaterialTable from 'material-table';
import axios from "axios";


export default class App extends React.Component {
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
            data: []
        }
    }

    getItems = () => {
        axios.get("http://localhost:8080/get_all_items")
            .then((response) => {
                this.setState({data: response.data});
            })
            .catch((error) => {
                console.log(error);
            });
    };

    rowAdd = (newData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (newData.id == null) {
                    alert("Введите номер");
                    reject();
                } else {
                    resolve();
                    const data = [...this.state.data];
                    axios.post("http://localhost:8080/save", newData)
                        .then(() => {
                            data.push(newData);
                            this.setState((prevState) => {
                                return {...prevState, data}
                            })
                        })
                        .catch((error) => {
                            alert(error);
                        });
                }
            }, 600);
        })
    };

    rowUpdate = (newData, oldData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                if (oldData) {
                    const data = [...this.state.data];
                    axios.post("http://localhost:8080/save", newData)
                        .then(() => {
                            data[data.indexOf(oldData)] = newData;
                            this.setState((prevState) => {
                                return {...prevState, data}
                            })
                        })
                        .catch((error) => {
                            alert(error);
                        });
                }
            }, 600);
        })
    };

    rowDelete = (oldData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                const data = [...this.state.data];
                axios.delete("http://localhost:8080/delete",
                    {
                        params: {
                            id: oldData.id
                        }
                    })
                    .then(() => {
                        data.splice(data.indexOf(oldData), 1);
                        this.setState((prevState) => {
                            return {...prevState, data}
                        });
                    })
                    .catch((error) => {
                        alert(error);
                    });
            }, 600);
        })
    };

    rowHistory = (rowData) => {
        return (
            <div>
                <h2>История</h2>
                <h4>Предыдущий кабинет: {rowData.previousLocation}</h4>
                <h4>Исполнитель: {rowData.actionee}</h4>
            </div>
        )
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
                        addRowPosition: "first"
                    }
                }
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
                        },
                        header: {
                            actions: 'Действия'
                        },
                        body: {
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
