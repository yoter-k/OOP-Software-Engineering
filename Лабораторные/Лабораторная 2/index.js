const http = require('http');
const { getDistribution, toPercentage } = require('./Lab_1_module');
const { readDataCsv } = require('./moduleReadData');

const HOST = 'localhost';
const PORT = 3000;

const onEvent = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    res.write('<h1>Общая страница отчёта</h1>');

    const checkValues = [100, 10000, 1000000, 100000000];
    const results = Array.from({ length: 10 }, () => new Array(checkValues.length));

    checkValues.forEach((amount, i) => {
        const numbers = getDistribution(amount);
        Object.keys(numbers).forEach(key => {
            let per = toPercentage(numbers[key], amount / 10);
            results[key][i] = per.toFixed(2);
        });
    });

    res.write('<h2>Таблица генерации случайных чисел</h2>');
    res.write('<table border="1" cellspacing="0" cellpadding="5">');
    res.write('<tr><th>i</th>' + checkValues.map(v => `<th>${v}</th>`).join('') + '</tr>');

    results.forEach((row, ind) => {
        res.write('<tr>');
        res.write(`<td>${ind}</td>`);
        res.write(row.map(val => `<td>${val ?? ''}</td>`).join(''));
        res.write('</tr>');
    });
    res.write('</table>');

    let arr = readDataCsv('./files/data_1.csv');
    res.write('<h2>Данные из CSV</h2>');
    res.write(arr.join('<br>'));

    res.end();
}

const server = http.createServer(onEvent);
server.listen(PORT, () => console.log(`http://${HOST}:${PORT}/`));
