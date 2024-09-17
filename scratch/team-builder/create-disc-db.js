const fs = require('fs');

let all = JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', '..','src', 'assets', 'national-dex.json')));
const mapper = all.reduce((map, poke) => {
  map[poke.name] = poke;
  return map;
}, {});

const disc = JSON.parse(fs.readFileSync(require('path').join(__dirname, 'disc.json')));

const dex = [];
for (let poke of disc) {
  if (poke === 'Meowstic') {
    poke = poke + '-F';
  }
  const mapped = mapper[poke];
  if (mapped) {
    dex.push(mapped);
  } else {
    console.log(poke)
  }
}

const file = require('path').join(__dirname, '..', '..', 'src', 'assets', 'violet-dlc-dex.json');
fs.writeFileSync(file, JSON.stringify(dex));