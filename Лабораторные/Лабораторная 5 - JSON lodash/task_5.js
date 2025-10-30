const data = require('./json/data.js');

const hexColors = data.colors.map((color, i) => {
    const rgb = data.argb[i].slice(0, 3);
    const hex_name = '#' + rgb.map(n => n.toString(16).padStart(2,'0')).join('').toUpperCase();
    return { color, hex_name };
}).sort((a, b) => a.color.localeCompare(b.color));

console.log(JSON.stringify(hexColors, null, 4));
