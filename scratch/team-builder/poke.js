const DexService = require('./services/DexService');
const fs = require('fs');

let all = JSON.parse(fs.readFileSync(require('path').join(__dirname, 'data', 'national-dex.json')));
const mapper = all.reduce((map, poke) => {
  map[poke.name] = poke;
  return map;
}, {});

let legends = JSON.parse(fs.readFileSync(require('path').join(__dirname, 'data', 'legend-dex.json')));
legends = legends.map((poke) => {
  if (mapper[poke.name]) {
    return { ...mapper[poke.name], types: poke.types}
  } else {
    console.log(poke.name);
  }
});


const dex = new DexService(legends);

/*
const analysis = dex.analyzeTypes();
// console.log(analysis.types.slice(0, 3));

console.log('Ubers\n');
console.log(analysis.ubers.map(u => `[${u.total}]${u.name}`).join('\n'));

console.log(analysis.types.map(x => '::\t\t' + x.types + '\t\t::\n' + x.pk.map(x => x.name + ' [' + x.total + ']').join('\n')).join('\n\n'));

fs.writeFileSync(require('path').join(__dirname, 'data', 'stats.csv'),
 `name,type,${dex.STATS.join(',')},total\n` +
analysis.types.map(t => t.pk.map(x => `${x.name},${t.types},${dex.STATS.map(s=>x[s]).join(',')},${x.total}`).join('\n')).join('\n')

);*/


const team = dex.teamBuilder()
  // 1.pick('Togekiss')
  //.pick('Cinderace')
  // 2 .pick('Seismitoad')

  // .pick('Lapras')
  //.pick('Dracozolt')
  // .pick('Dracovish')
  // .pick('Rotom-Wash')
  // .pick('Ludicolo')
  // .pick('Abomasnow')
  // 3.pick('Reuniclus')
  // 4.pick('Rotom-Heat')
  // 5.pick('Drapion').build()
  // .pick('Hydreigon')
  // .pick('Gyarados')
  //.pick('Darmanitan-Galar')
  //.pick('Chandelure')
  //.pick('Weezing-Galar')
  // .pick('Silvally-Fairy')
  //  .pick('Toxtricity')
  // .pick('Whimsicott')
  // .pick('Excadrill')
  .pick('Typhlosion')
  .pick('Luxray')
  .pick('Garchomp')
  .pick('Samurott')
  .pick('Sylveon')
  .build();
//const gen = dex.createTeam(1000, team, ['Mimikyu', 'Centiskorch', 'Centiskorch-Gmax', 'Salazzle', 'Mimikyu-Busted', 'Durant', 'Whimsicott', 'Shiinotic', 'Rotom-Heat', 'Silvally-Fairy'], 6);
const gen = dex.createTeam(10000, team, ['Manaphy', 'Clefable', 'Thundurus', 'Shaymin', 'Darkrai', 'Whiscash', 'Gastrodon', 'Floatzel']);
console.log(gen);
console.log(`\n****WINNER**** [${gen.scoring}] \n${gen.team.map(p => p.name + ' [' + p.types.join('/') + ']').join('\n')}`);

/*
****WINNER**** [-89.19999999999999]
Typhlosion [Fire/Ghost]
Garchomp [Dragon/Ground]
Samurott [Dark/Water]
Scizor [Bug/Steel]
Sylveon [Fairy]
Electivire [Electric]
*/