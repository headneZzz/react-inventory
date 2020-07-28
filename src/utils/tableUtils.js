import {CsvBuilder} from "filefy";
import jsPDF from "jspdf";

const byString = (o, s) => {
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

const getFieldValue = (rowData, columnDef, lookup = true) => {
    let value =
        typeof rowData[columnDef.field] !== "undefined"
            ? rowData[columnDef.field]
            : byString(rowData, columnDef.field);
    if (columnDef.lookup && lookup) {
        value = columnDef.lookup[value];
    }

    return value;
};

const getTableData = () => {
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
        columns.map((columnDef) => getFieldValue(rowData, columnDef))
    );

    return [columns, data];
};

const exportCsv = () => {
    const [columns, data] = getTableData();
    console.log(columns);
    console.log(data);
    const builder = new CsvBuilder("Инвентаризация.csv");
    builder
        .setColumns(columns.map((columnDef) => columnDef.title))
        .addRows(data)
        .exportFile();
};

const exportPdf = () => {
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

export {exportCsv, exportPdf}