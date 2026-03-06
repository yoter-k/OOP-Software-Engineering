const fs = require("fs");
const text = fs.readFileSync("task_03.txt", "utf8");
const re = /[1-9A-F][0-9A-F]*[02468ACE]/g;
const arr = text.match(re);

if (!arr) {
    console.log("Нет чисел");
} else {

    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].length > max.length) {
            max = arr[i];

        } else if (arr[i].length === max.length) {

            if (BigInt("0x" + arr[i]) > BigInt("0x" + max)) {
                max = arr[i];
            }

        }
    }

    console.log(max);
}