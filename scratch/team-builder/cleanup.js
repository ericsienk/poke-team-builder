const fs = require('fs');
const path = require('path');

function run() {
  let all = JSON.parse(fs.readFileSync(path.join(__dirname, 'national-dex.json')));
  const mapper = all.reduce((map, poke) => {
    map[poke.name] = poke;
    return map;
  }, {});
  
  let legends = JSON.parse(fs.readFileSync(path.join(__dirname, 'legend-dex.json')));
  legends = legends.map((poke) => {
    let mapped = {
      ...mapper[poke.name],
      types: poke.types,
      oob: {
        ...mapper[poke.name].oob,
        dex_number: poke.oob.dex_number,
      }
    };

    if (legendsAltMap[poke.oob.dex_number]) {
      mapped = {
        ...mapped,
        ...legendsAltMap[poke.oob.dex_number],
      }
    }
    
    return mapped;
  });


  fs.writeFileSync(path.join(__dirname, 'legends-arceus-dex.json'), JSON.stringify(legends, null, 4));
}

const legendsAltMap = {
  3: {
    "name": "Decidueye",
    "hp": 88,
    "atk": 112,
    "def": 80,
    "spa": 95,
    "spd": 95,
    "spe": 60,
    "types": ["Grass", "Fighting"],
  },
  6: {
    "name": "Typhlosion",
    "hp": 73,
    "atk": 84,
    "def": 78,
    "spa": 119,
    "spd": 85,
    "spe": 95,
    "types": ["Fire", "Ghost"],
  },
  9: {
    "name": "Samurott",
    "hp": 90,
    "atk": 108,
    "def": 80,
    "spa": 100,
    "spd": 65,
    "spe": 85,
    "types": ["Water", "Dark"],
  },
  84: {
    "name": "Qwilfish",
    "hp": 65,
    "atk": 95,
    "def": 85,
    "spa": 55,
    "spd": 55,
    "spe": 85,
    "types": ["Dark", "Poison"],
  },
  94: {
    "name": "Lilligant",
    "hp": 70,
    "atk": 105,
    "def": 75,
    "spa": 50,
    "spd": 75,
    "spe": 105,
    "types": ["Grass", "Fighting"],
  },
  116: {
    "name": "Sliggoo",
    "hp": 58,
    "atk": 75,
    "def": 83,
    "spa": 83,
    "spd": 113,
    "spe": 40,
    "types": ["Dragon", "Steel"],
  },
  117: {
    "name": "Goodra",
    "hp": 80,
    "atk": 100,
    "def": 100,
    "spa": 110,
    "spd": 150,
    "spe": 60,
    "types": ["Dragon", "Steel"],
  },
  150: {
    "name": "Growlithe",
    "hp": 60,
    "atk": 75,
    "def": 45,
    "spa": 65,
    "spd": 50,
    "spe": 55,
    "types": ["Fire", "Rock"],
  },
  151: {
    "name": "Arcanine",
    "hp": 95,
    "atk": 115,
    "def": 80,
    "spa": 95,
    "spd": 80,
    "spe": 90,
    "types": ["Fire", "Rock"],
  },
  192: {
    "name": "Voltorb",
    "hp": 40,
    "atk": 30,
    "def": 50,
    "spa": 55,
    "spd": 55,
    "spe": 100,
    "types": ["Electric", "Grass"],
  },
  193: {
    "name": "Electrode",
    "hp": 60,
    "atk": 50,
    "def": 70,
    "spa": 80,
    "spd": 80,
    "spe": 150,
    "types": ["Electric", "Grass"],
  },
  202: {
    "name": "Sneasel",
    "hp": 55,
    "atk": 95,
    "def": 55,
    "spa": 35,
    "spd": 75,
    "spe": 115,
    "types": ["Poison", "Fighting"],
  },
  216: {
    "name": "Avalugg",
    "hp": 95,
    "atk": 127,
    "def": 184,
    "spa": 34,
    "spd": 36,
    "spe": 38,
    "types": ["Ice", "Rock"],
  },
  219: {
    "name": "Zorua",
    "hp": 35,
    "atk": 60,
    "def": 40,
    "spa": 85,
    "spd": 40,
    "spe": 70,
    "types": ["Normal", "Ghost"],
  },
  220: {
    "name": "Zoroark",
    "hp": 55,
    "atk": 100,
    "def": 60,
    "spa": 125,
    "spd": 60,
    "spe": 110,
    "types": ["Normal", "Ghost"],
  },
  222: {
    "name": "Braviary",
    "hp": 110,
    "atk": 83,
    "def": 70,
    "spa": 112,
    "spd": 70,
    "spe": 65,
    "types": ["Psychic", "Flying"],
  },
}

run();