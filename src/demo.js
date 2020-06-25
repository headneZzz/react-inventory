import React from 'react';
import MaterialTable from 'material-table';
import axios from "axios";


export default class MaterialTableDemo extends React.Component {
    componentWillMount() {
        this.getItems();
    }

    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {title: 'Номер', field: 'id'},
                {title: 'Название', field: 'name'},
                {title: 'Кабинет', field: 'location'},
            ],
            data: []
        }
    }

    getItems = () => {
        axios.get("https://find-inventory-api-test.herokuapp.com/get_all_items")
            .then((response) => {
                this.setState({data: response.data});
            })
            .catch((error) => {
                console.log(error);
            });
    };

    render() {
        console.log(2);
        return (
            <MaterialTable
                title="Editable Example"
                columns={this.state.columns}
                data={this.state.data}
                editable={{
                    onRowAdd: (newData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                this.setState((prevState) => {
                                    const data = [...prevState.data];
                                    data.push(newData);
                                    return {...prevState, data};
                                });
                            }, 600);
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
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
                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                this.setState((prevState) => {
                                    const data = [...prevState.data];
                                    data.splice(data.indexOf(oldData), 1);
                                    return {...prevState, data};
                                });
                            }, 600);
                        }),
                }}
            />
        );
    }
}
