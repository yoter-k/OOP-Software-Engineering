const fs = require('fs')

const lines = fs.readFileSync('sem_02_labrab_01.csv', 'utf8').trim().split('\n')

lines.forEach((line, i) => {
    const nums = line.split(' ').map(Number)

    const set = new Set(nums)
    const sorted = [...nums].toSorted((a, b) => a - b)

    const odd = nums.every(n => n % 2 === 1)
    const uniq = set.size === nums.length
    const inc = nums.join() === sorted.join()

    if (odd && uniq && inc) {
        console.log(i + 1)
    }
})