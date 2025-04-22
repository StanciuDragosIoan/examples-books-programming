const tests = new Map();
tests.set(() => 2+2, 4);
tests.set(() => 2*2, 4);
tests.set(() => 2/2, 1);

for (const entry of tests) {
    console.log((entry[0])() === entry[1] ? 'PASS' : 'FAIL')
}

/*
const a = ()=>2+2;
const b = ()=>2*2;
const c = ()=>2/2;åç

const tests2 = {åç
   a : 4,
   b : 4,
   c : 1
}


//this throws tests2 is not iterable err
for (const entry of tests2) {
    console.log((entry[0])() === entry[1] ? 'PASS' : 'FAIL')
}

 */

let obj = {};

const map = new WeakMap();
map.set(obj, {key: "test"});
console.log(map.get(obj));
obj = undefined;
console.log(map.has(obj));
