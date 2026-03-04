let json = `
{ 
    "a": 1, 
    "b":   { "c": 2, "d": 3 }, 
    "e": 4, 
    "fff":{ "v": 10 } 
};
`;

const re = /"(\w+)"\s*:\s*({[^{}]*})/g;

const keys = [...json.matchAll(re)].map(m => m[1]);

console.log(keys);