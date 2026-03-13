const fs = require('fs')

const lines = fs.readFileSync('sem_02_labrab_01.csv', 'utf8').trim().split('\n')

lines.forEach((line, i) => {
    const nums = line.split(' ').map(Number)

    const map = new Map()
    nums.forEach(n => map.set(n, (map.get(n) || 0) + 1))

    const pairs = [...map].filter(([k, v]) => v === 2).map(([k]) => k)
    const singles = [...map].filter(([k, v]) => v === 1).map(([k]) => k)

    if (pairs.length === 2 && singles.length === 2) {
        if (pairs[0] + pairs[1] < singles[0] + singles[1]) {
            console.log(i + 1, line)
        }
    }
})