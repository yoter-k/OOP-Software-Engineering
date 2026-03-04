const getRandomInt = (limit) => Math.floor(Math.random() * limit);

const getDistribution = (amount, limit = 10) => {
  const numbers = {};
  for (let i = 0; i < amount; i++) {
    let num = getRandomInt(limit);
    numbers[num] = (numbers[num] || 0) + 1;
  }
  return numbers;
}

const toPercentage = (value, quantity) => 
  Math.abs(quantity - value) / quantity * 100;

module.exports = { getDistribution, toPercentage };
