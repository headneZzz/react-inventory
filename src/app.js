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
                {title: 'Тип', field: 'type'},
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
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                this.setState((prevState) => {
                    const data = [...prevState.data];
                    axios.post("http://localhost:8080/insert", newData)
                        .catch((error) => {
                            alert(error);
                        });
                        data.push(newData);
                    return {...prevState, data};
                });
            }, 600);
        })
    };

    rowUpdate = (newData, oldData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                if (oldData) {
                    this.setState((prevState) => {
                        const data = [...prevState.data];
                        data[data.indexOf(oldData)] = newData;
                        return {...prevState, data};
                    });
                }
            }, 600);
        })
    };

    rowDelete = (oldData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                this.setState((prevState) => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return {...prevState, data};
                });
            }, 600);
        })
    };

    render() {
        console.log(2);
        return (
            <MaterialTable
                title="Инвентаризация"
                columns={this.state.columns}
                data={this.state.data}
                options={
                    {
                        pageSize: 10
                    }
                }
                editable={{
                    onRowAdd: (newData) => this.rowAdd(newData),
                    onRowUpdate: (newData, oldData) => this.rowUpdate(newData, oldData),
                    onRowDelete: (oldData) => this.rowDelete(oldData)
                }}

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
                                deleteText: 'Вы точно хотите удалить эту строчку?',
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
