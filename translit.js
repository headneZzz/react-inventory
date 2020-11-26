module.exports.translit = String.prototype.translit = String.prototype.translit || function () {
    let Chars = {
            'm': 'м',
            'M': 'М',
            '/': '-'
        },
        t = this;
    for (let i in Chars) {
        t = t.replace(new RegExp(i, 'g'), Chars[i]);
    }
    return t;
};