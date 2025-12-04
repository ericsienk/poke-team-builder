const fs = require('fs');

const stats = JSON.parse(fs.readFileSync('pokemon_stats.json').toString());

const dex = [];
for (const [key, value] of Object.entries(stats)) {
  dex.push({
    name: key,
    ...value.stats,
    types: value.types.map((x) => {
      const [w, ...ater] = x;
      return w.toUpperCase() + ater.join('')
    }),
    abilities: value.abilities.map(({ ability}) => ability),
  })
}

fs.writeFileSync('src/assets/legends-za-dex.json', JSON.stringify(dex));