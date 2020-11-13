function contains(name, strArr) {
    let value = 0;
    strArr.forEach(word => {
        value += name.includes(word);
    });
    return (value === 1)
}

module.exports.getTypeFromName = function getTypeFromName(name) {
    name = name.toLowerCase()
    let type = "ANOTHER"
    const monitor = ["монитор"]
    const printer = ["принтер"]
    const pc = ["компьютер", "пк", "системный блок", "сервер"]
    const ups = ["ибп", "бесперебой"]
    const scanner = ["скан"]
    if (contains(name, monitor)) {
        type = "MONITOR"
    }
    if (contains(name, printer)) {
        type = "PRINTER"
    }
    if (contains(name, pc)) {
        type = "PC"
    }
    if (contains(name, ups)) {
        type = "UPS"
    }
    if (contains(name, scanner)) {
        type = "SCANNER"
    }
    return type
}