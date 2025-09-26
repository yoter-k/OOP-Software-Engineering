# Программная инженерия: ООП

Этот проект представляет собой эксперимент по **генерации случайных чисел** и анализу их **распределения**.

## Цель

Провести эксперимент для разных количеств испытаний (10², 10⁴, 10⁶, 10⁸) и вычислить процентное отклонение от равномерного распределения для чисел от 0 до 9.

## Результаты

Эксперимент с разным количеством испытаний показал следующее отклонение от равномерного распределения (в процентах):

| i  | 10**2 | 10**4 | 10**6 | 10**8 |
|----|-------|-------|-------|-------|
| 0  | 10.00 | 0.90  | 0.53  | 0.00  |
| 1  | 30.00 | 0.10  | 0.32  | 0.04  |
| 2  | 30.00 | 2.30  | 0.05  | 0.06  |
| 3  | 0.00  | 7.10  | 0.85  | 0.05  |
| 4  | 20.00 | 6.90  | 0.07  | 0.02  |
| 5  | 20.00 | 2.10  | 0.53  | 0.03  |
| 6  | 10.00 | 1.20  | 0.43  | 0.02  |
| 7  | 30.00 | 2.50  | 0.18  | 0.01  |
| 8  | 10.00 | 0.70  | 0.26  | 0.02  |
| 9  | 20.00 | 4.00  | 0.01  | 0.03  |

### Выводы:
- **С увеличением количества испытаний** (10² → 10⁸) процент отклонений от равномерного распределения стремится к нулю.
- При **больших числах испытаний** (10⁶, 10⁸) отклонения становятся минимальными, подтверждая, что случайные числа распределяются более равномерно.
- Для меньших значений (10², 10⁴) отклонения могут быть значительными, что связано с малым числом выборок.

### Stepik №1: [ссылка на задачу](https://stepik.org/lesson/416145/step/2?unit=405659)

```
const input = require('fs').readFileSync(0, 'utf-8').trim();
const numbers = input.split(' ').map(Number);
const result = numbers.find(num => num % 2 === 0);
console.log(result);
```

### Stepik №2: [ссылка на задачу](https://stepik.org/lesson/416145/step/3?unit=405659)

```
// put your javascript (node.js) code here
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const numbers = line.trim().split(/\s+/).map(Number);
    const oddNumbers = numbers.filter(num => num % 2 !== 0);
    console.log(oddNumbers.join(' '));
    rl.close();
});
```


### Stepik №3: [ссылка на задачу](https://stepik.org/lesson/416145/step/4?unit=405659)

```
const input = require("fs").readFileSync(0, "utf8").trim();
const numbers = input.split(" ").map(Number);

numbers.sort((a, b) => b - a);
console.log(numbers.join(" "));
```

### Stepik №4: [ссылка на задачу](https://stepik.org/lesson/416145/step/5?unit=405659)

```
// put your javascript (node.js) code here
const input = require("fs").readFileSync(0, "utf8").trim();
const numbers = input.split(" ").map(Number);

numbers.sort((a, b) => a - b);
const sum = numbers[0] + numbers[1] + numbers[2];

console.log(sum);
```

### Stepik №5: [ссылка на задачу](https://stepik.org/lesson/416145/step/6?unit=405659)
```
// put your javascript (node.js) code here
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split("\n");

const N = parseInt(input[0]);
let min = 30001;

for (let i = 1; i <= N; i++) {
    let num = parseInt(input[i]);
    if (num % 10 === 3 && num < min) {
        min = num;
    }
}

console.log(min);
```

### Stepik №6: [ссылка на задачу](https://stepik.org/lesson/416145/step/7?unit=405659)
```
// put your javascript (node.js) code here
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split(" ").map(Number);

const expectedSum = 100 * 101 / 2;
const actualSum = input.reduce((a, b) => a + b, 0);

console.log(expectedSum - actualSum);
```


### Stepik №7: [ссылка на задачу]()



### Stepik №8: [ссылка на задачу]()

### Stepik №9: [ссылка на задачу]()




