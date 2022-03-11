const fs = require('fs');
const math = require('mathjs');
const pkmn = JSON.parse(fs.readFileSync(require('path').join(__dirname, '..', 'data', 'pokemon.json')));
const AH = 1;
const SE = 2;
const NV = .5;
const NE = 0;

const HP = 'hp',
  ATTACK = 'atk',
  DEFENSE = 'def',
  SPECIAL_ATK = 'spa',
  SPECIAL_DEF = 'spd',
  SPEED = 'spe';

const STATS = [HP, ATTACK, DEFENSE, SPECIAL_ATK, SPECIAL_DEF, SPEED];

class DexService {
  constructor(pokemon = pkmn) {
    this.STATS = STATS;
    this.pokemon = pokemon;
    this.pkmnNameMap = this.pokemon.reduce((map, pk) => {
      map[pk.name] = pk; return map;
    }, {});
    this.typeIndex = {
      Bug: 0,
      Dark: 1,
      Dragon: 2,
      Electric: 3,
      Fairy: 4,
      Fighting: 5,
      Fire: 6,
      Flying: 7,
      Ghost: 8,
      Grass: 9,
      Ground: 10,
      Ice: 11,
      Normal: 12,
      Poison: 13,
      Psychic: 14,
      Rock: 15,
      Steel: 16,
      Water: 17
    }

    this.typeMatrix = [
      [AH,SE,AH,AH,NV,NV,NV,NV,NV,SE,AH,AH,AH,NV,SE,AH,NV,AH],//Bug
      [AH,NV,AH,AH,NV,NV,AH,AH,SE,AH,AH,AH,AH,AH,SE,AH,AH,AH],//Dark
      [AH,AH,SE,AH,NE,AH,AH,AH,AH,AH,AH,AH,AH,AH,AH,AH,NV,AH],//Dragon
      [AH,AH,NV,NV,AH,AH,AH,SE,AH,NV,NV,AH,AH,AH,AH,AH,AH,SE],//Electric
      [AH,SE,SE,AH,AH,SE,NV,AH,AH,AH,AH,AH,AH,NV,AH,AH,NV,AH],//Fairy
      [NV,SE,AH,AH,NV,AH,AH,NV,NE,AH,AH,SE,SE,NV,NV,SE,SE,AH],//Fighting
      [SE,AH,NV,AH,AH,AH,NV,AH,AH,SE,AH,SE,AH,AH,AH,NV,SE,NV],//Fire
      [SE,AH,AH,NV,AH,AH,AH,SE,AH,AH,AH,AH,AH,AH,AH,NV,NV,AH],//Flying
      [AH,NV,AH,AH,AH,AH,AH,AH,SE,AH,AH,AH,NE,AH,SE,AH,AH,AH],//Ghost
      [NV,AH,NV,AH,AH,AH,NV,NV,AH,NV,SE,AH,AH,NV,AH,SE,NV,SE],//Grass
      [NV,AH,AH,SE,AH,AH,SE,NV,AH,NV,AH,AH,AH,SE,AH,SE,SE,AH],//Ground
      [AH,AH,SE,AH,AH,AH,NV,SE,AH,SE,SE,NV,AH,AH,AH,AH,NV,NV],//Ice
      [AH,AH,AH,AH,AH,AH,AH,AH,NE,AH,AH,AH,AH,AH,AH,NV,NV,AH],//Normal
      [AH,AH,AH,AH,SE,AH,AH,AH,NV,SE,NV,AH,AH,NV,AH,NV,NE,AH],//Poison
      [AH,NV,AH,AH,AH,SE,AH,AH,AH,AH,AH,AH,AH,AH,SE,NV,NV,AH],//Pyschic
      [SE,AH,AH,AH,AH,NV,SE,SE,AH,AH,NV,SE,AH,AH,AH,AH,NV,AH],//Rock
      [AH,AH,AH,NV,SE,AH,NV,AH,AH,AH,AH,SE,AH,AH,AH,SE,NV,NV],//Steel
      [AH,AH,NV,AH,AH,AH,SE,AH,AH,NV,SE,AH,AH,AH,AH,SE,AH,NV],//Water
    ]
  }
  
  teamBuilder(team = []) {
    const pkmnNameMap = this.pkmnNameMap;
    const builder = {
      team: [],
      pick: function (name) {
        this.team.push(pkmnNameMap[name]);
        return this;
      },
      build: function () {
        return this.team;
      },
      size: function () {
        return this.team.length;
      }
    }

    for (let pk of team) {
      builder.pick(pk);
    }

    return builder;
  }

  _avgStats(avgObject, statObject) {
    avgObject.pk.push(statObject);
    for (let stat of STATS) {
      avgObject[stat] = (avgObject[stat] + statObject[stat]) / 2;
      // avgObject.std[stat] = math.std(avgObject.pk.map((p) => p[stat]));
    }
    statObject.total = this._getTotalStats(statObject);
    avgObject.total = (avgObject.total + statObject.total) / 2;
    // avgObject.std.total = math.std(avgObject.pk.map((p) => p.total));
  }

  _getPercentile(pk, pokemon) {
    const percentile = {};
    for (let stat of STATS) {
      const range = pokemon.map(p => p[stat]).sort().reverse();
      percentile[stat] = Math.round((100 / pokemon.length) * (range.lastIndexOf(pk[stat]) + 1));
    }
    // percentile.total = Math.round((100 / pokemon.length) * (range.lastIndexOf(pk.total) + 1));
    return percentile;
  }

  _initTypeStat(typing) {
    return {
      pk: [],
      types: typing,
      hp: 0,
      atk: 0,
      def: 0,
      spa: 0,
      spd: 0,
      spe: 0,
      total: 0,
      std: {
        hp: 0,
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0,
        total: 0,
      },
      count: 0
    };
  }

  _processTypingStat(typesMap, type, pk) {
    let mapped = typesMap[type];
    if (!mapped) {
      typesMap[type] = mapped = this._initTypeStat(type)
    }

    mapped.count++;
    this._avgStats(mapped, pk, mapped.count);
  }

  _typesMapToArray(typesMap) {
    return Object.values(typesMap).sort((a, b) => {
      if (a.count < b.count) return 1;
      if (a.count > b.count) return -1;
      return 0;
    }).map(type => {
      type.pk.sort((a, b) => {
        if (a.total < b.total) return 1;
        if (a.total > b.total) return -1;
        return 0;
      });
      return type;
    });
  }

  _getTotalStats(statsObject) {
    return STATS.reduce((total, stat) => total + statsObject[stat], 0);
  }

  // 569
  analyzeTypes(options = { evolved: true, sort: ['totalStats'], statsLimit: 601 }) {
    const unqiueTypesMap = {};
    const typesMap = {};
    const ubers = [];
    const pool = [];

    this.pokemon.filter(x => {
      if (!x.oob || !x.oob.evos.length && x.oob.dex_number > 0) {
        let total = this._getTotalStats(x);
        if (total <= options.statsLimit) {
          return true;
        } else {
          x.total = total;
          ubers.push(x);
        }
      }
    }).forEach(pk => {
      const uniqueTyping = pk.types.sort().join('/');
      this._processTypingStat(unqiueTypesMap, uniqueTyping, pk);
      pk.types.forEach(type => this._processTypingStat(typesMap, type, pk)); 
      pool.push(pk);
    });

    const uniqueTypes = this._typesMapToArray(unqiueTypesMap);
    const types = this._typesMapToArray(typesMap);

    return {
      uniqueTypes: uniqueTypes,
      unqiueTypesMap: unqiueTypesMap,
      strongestUniqueType: [...STATS, 'total'].reduce((map, stat) => {
        map[stat] = uniqueTypes.reduce((max, type) => type[stat] > (max[stat] || 0) ? type : max, {});
        return map;
      }, {}),
      types: types,
      typesMap: typesMap,
      ubers: ubers.sort((a, b) => a.total - b.total),
      strongestType: [...STATS, 'total'].reduce((map, stat) => {
        map[stat] = types.reduce((max, type) => type[stat] > (max[stat] || 0) ? type : max, {});
        return map;
      }, {}),
      pk: pool
    };
  }

  getSweeperScore(pk) {
    return Math.max(pk[SPECIAL_ATK], pk[ATTACK]) + Math.min(pk[SPEED], 115);
  }

  getTankScore(pk) {
    return ((pk[SPECIAL_DEF] + pk[DEFENSE]) / 2) + pk[HP];
  }

  getTypeAdvantages(pk, availableTypes) {
    const weakTo = [];
    const resistantTo = [];
    const strongTo = [];
    const notEffectiveTo = [];
    for (let availableTyping of availableTypes) {
      for (let attackerType of availableTyping) {
        let defendingTypeMultiplier = 1;

        const attackerTypeIndex = this.typeIndex[attackerType];
        const attackerTypeInfo = this.typeMatrix[attackerTypeIndex];

        for (let defenderType of pk.types) {
          const defenderIndex = this.typeIndex[defenderType];

          defendingTypeMultiplier *= attackerTypeInfo[defenderIndex]
        }

        if (defendingTypeMultiplier > 1) {
          weakTo.push(availableTyping.join('/'));
          defendingTypeMultiplier = 1;
        }

        if (defendingTypeMultiplier < 1) {
          resistantTo.push(availableTyping.join('/'));
          defendingTypeMultiplier = 1;
        }
      }

      for (let attackerType of pk.types) {
        let attackingTypeMultiplier = 1;

        const attackerTypeIndex = this.typeIndex[attackerType];
        const attackerTypeInfo = this.typeMatrix[attackerTypeIndex];

        for (let defenderType of availableTyping) {
          const defenderIndex = this.typeIndex[defenderType];

          attackingTypeMultiplier *= attackerTypeInfo[defenderIndex];
        }

        if (attackingTypeMultiplier > 1) {
          strongTo.push(availableTyping.join('/'));
          attackingTypeMultiplier = 1;
        }
  
        if (attackingTypeMultiplier < 1) {
          notEffectiveTo.push(availableTyping.join('/'));
          attackingTypeMultiplier = 1;
        }
      }
    }

    return {resistantTo, weakTo, strongTo, notEffectiveTo};
  }

  createTeam(iterations, seedTeam, banList = [], size = 6) {
    const names = seedTeam ? seedTeam.map(x => x.name) : [];
    console.log(names);
    const dex = this.analyzeTypes();
    let winnerTeam = null;
    while (iterations > 0) {
      const teamBuilder = this.teamBuilder(names);

      while (teamBuilder.size() < size) {
        const randomPick = dex.pk[Math.floor(Math.random() * dex.pk.length)].name;
        if (!banList.includes(randomPick)) {
          teamBuilder.pick(randomPick);
        }
      }

      let analysis = this.analyzeTeam(teamBuilder.build(), dex);

      const weakToScore = analysis.weakTo.length;
      const topOkayToScore = analysis.okayTo.slice(0, 15).reduce((total, x) => total + x.total, 0);
      const strongToScore = analysis.strongTo.length;
      const statsScore = analysis.sweeperScore * 2;// + analysis.tankScore;

     // analysis.scoring = ((weakToScore * 10) + (topOkayToScore * 1.5)) - (strongToScore + (statsScore / 10));
       analysis.scoring = ((weakToScore * 10) + (topOkayToScore * 1.5)) - (strongToScore + (statsScore / 20));

      if (!winnerTeam || analysis.scoring < winnerTeam.scoring) {
        winnerTeam = analysis;
        // console.log(winnerTeam);
        console.log(`\n****WINNER**** [${analysis.scoring}] ${analysis.team.map(p => p.name).join()}`);

      } else {
        console.log(`\n[${analysis.scoring}] ${analysis.team.map(p => p.name).join()}`);
      }

      iterations--;
    }

    return winnerTeam;
  }

  analyzeTeam(team, dex) {
    dex = dex || this.analyzeTypes();

    let sweeperScore = 0,
      tankScore = 0;
    const teamBreakdown = team.map(pk => {
      let p = {
        pokemon: pk,
        ...this.getTypeAdvantages(pk, dex.uniqueTypes.map(u => u.types.split('/'))),
        sweeperScore: this.getSweeperScore(pk),
        tankScore: this.getTankScore(pk)
      }
      sweeperScore += p.sweeperScore;
      tankScore += p.tankScore;
      return p;
    });

    const weakToMap = {}, strongToMap = {};
    teamBreakdown.forEach(pk => {
      pk.weakTo.forEach(w => {
        weakToMap[w] = (weakToMap[w] || { count: 0, coveredCount: 0 });
        weakToMap[w].count++;
      });
      pk.strongTo.forEach(s => {
        strongToMap[s] = (strongToMap[s] || { count: 0 });
        strongToMap[s].count++;
      });
    })

    Object.keys(strongToMap).forEach(key => {
      if (weakToMap[key]) {
        weakToMap[key].coveredCount++;
      }
    });

    const stats = {
      sweeperScore: sweeperScore,
      tankScore: tankScore,
      team: team.map(pk => {
        let pks = dex.unqiueTypesMap[pk.types.join('/')].pk;
        pk.alternatives = pks.filter(p => {
          return p.name != pk.name;
        }).map(p => p.name).join(', ');

        pk.percentile = {
          ...pk.types.map(type => {
            return { type: type, percentile: this._getPercentile(pk, dex.typesMap[type].pk) }
          }).reduce((o, t) => {
            o[t.type] = t.percentile;
            return o;
          }, {})
        };

        if (pk.types.length > 1) {
          pk.percentile[pk.types.join('/')] = this._getPercentile(pk, dex.unqiueTypesMap[pk.types.join('/')].pk);
        }

        // pk.percentile = JSON.stringify(pk.percentile);

        return pk;
      }),
      weakTo: Object.keys(weakToMap).filter(x => 
        weakToMap[x].coveredCount === 0
      ),
      strongTo: Object.keys(weakToMap).map(x => {
        if (weakToMap[x].count - weakToMap[x].coveredCount < 1 && weakToMap[x].coveredCount > 0) {
          return x;
        }
      }).filter(x => x),
      okayTo: Object.keys(weakToMap).map(x => {
        if (weakToMap[x].count - weakToMap[x].coveredCount >= 1 && weakToMap[x].coveredCount > 0) {
          return {type: x, total: weakToMap[x].count - weakToMap[x].coveredCount, ...weakToMap[x]};
        }
      }).filter(x => x).sort((a, b) => a.total - b.total).reverse()//.map(x => `${x.type} (${x.coveredCount}:${x.count} Over-responsible) [${dex.unqiueTypesMap[x.type].pk.map(x => x.name).join()}]`),
    }

    // stats.weakToCount = stats.weakTo.reduce((total, type) => {
    //   total += dex.unqiueTypesMap[type].pk.length;
    //   return total;
    // }, 0);

    // stats.strongToCount = stats.strongTo.reduce((total, type) => {
    //   total += dex.unqiueTypesMap[type].pk.length;
    //   return total;
    // }, 0);

    // stats.OkayToCount = stats.strongTo.reduce((total, type) => {
    //   total += dex.unqiueTypesMap[type].pk.length;
    //   return total;
    // }, 0);

    return stats;

  }
}

module.exports = DexService;