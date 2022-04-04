(()=>{"use strict";addEventListener("message",({data:{team:w,pokemon:s,interations:r=1e4,banList:a=[]}})=>{const p=new I(s),h=p.teamBuilder();w.forEach(i=>h.pick(i)),postMessage(p.createTeam(r,h.build(),a))});const n=.5,f=["hp","atk","def","spa","spd","spe"];class I{constructor(s){this.pokemon=s,this.STATS=f,this.pkmnNameMap=this.pokemon.reduce((r,a)=>(r[a.name]=a,r),{}),this.typeIndex={Bug:0,Dark:1,Dragon:2,Electric:3,Fairy:4,Fighting:5,Fire:6,Flying:7,Ghost:8,Grass:9,Ground:10,Ice:11,Normal:12,Poison:13,Psychic:14,Rock:15,Steel:16,Water:17},this.typeMatrix=[[1,2,1,1,n,n,n,n,n,2,1,1,1,n,2,1,n,1],[1,n,1,1,n,n,1,1,2,1,1,1,1,1,2,1,1,1],[1,1,2,1,0,1,1,1,1,1,1,1,1,1,1,1,n,1],[1,1,n,n,1,1,1,2,1,n,n,1,1,1,1,1,1,2],[1,2,2,1,1,2,n,1,1,1,1,1,1,n,1,1,n,1],[n,2,1,1,n,1,1,n,0,1,1,2,2,n,n,2,2,1],[2,1,n,1,1,1,n,1,1,2,1,2,1,1,1,n,2,n],[2,1,1,n,1,1,1,2,1,1,1,1,1,1,1,n,n,1],[1,n,1,1,1,1,1,1,2,1,1,1,0,1,2,1,1,1],[n,1,n,1,1,1,n,n,1,n,2,1,1,n,1,2,n,2],[n,1,1,2,1,1,2,n,1,n,1,1,1,2,1,2,2,1],[1,1,2,1,1,1,n,2,1,2,2,n,1,1,1,1,n,n],[1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,n,n,1],[1,1,1,1,2,1,1,1,n,2,n,1,1,n,1,n,0,1],[1,n,1,1,1,2,1,1,1,1,1,1,1,1,2,n,n,1],[2,1,1,1,1,n,2,2,1,1,n,2,1,1,1,1,n,1],[1,1,1,n,2,1,n,1,1,1,1,2,1,1,1,2,n,n],[1,1,n,1,1,1,2,1,1,n,2,1,1,1,1,2,1,n]]}teamBuilder(s=[]){const r=this.pkmnNameMap,a={team:[],pick:function(p){return this.team.push(r[p]),this},build:function(){return this.team},size:function(){return this.team.length}};for(let p of s)a.pick(p);return a}_avgStats(s,r){s.pk.push(r);for(let a of f)s[a]=(s[a]+r[a])/2;r.total=this._getTotalStats(r),s.total=(s.total+r.total)/2}_getPercentile(s,r){const a={};for(let p of f){const h=r.map(i=>i[p]).sort().reverse();a[p]=Math.round(100/r.length*(h.lastIndexOf(s[p])+1))}return a}_initTypeStat(s){return{pk:[],types:s,hp:0,atk:0,def:0,spa:0,spd:0,spe:0,total:0,std:{hp:0,atk:0,def:0,spa:0,spd:0,spe:0,total:0},count:0}}_processTypingStat(s,r,a){let p=s[r];p||(s[r]=p=this._initTypeStat(r)),p.count++,this._avgStats(p,a)}_typesMapToArray(s){return Object.values(s).sort((r,a)=>r.count<a.count?1:r.count>a.count?-1:0).map(r=>(r.pk.sort((a,p)=>a.total<p.total?1:a.total>p.total?-1:0),r))}_getTotalStats(s){return f.reduce((r,a)=>r+s[a],0)}analyzeTypes(s={evolved:!0,sort:["totalStats"],statsLimit:601}){const r={},a={},p=[],h=[];this.pokemon.filter(c=>{if(!c.oob||!c.oob.evos.length&&c.oob.dex_number>0){let t=this._getTotalStats(c);return t<=s.statsLimit||(c.total=t,p.push(c),!1)}return!1}).forEach(c=>{const t=c.types.sort().join("/");this._processTypingStat(r,t,c),c.types.forEach(u=>this._processTypingStat(a,u,c)),h.push(c)});const i=this._typesMapToArray(r),y=this._typesMapToArray(a);return{uniqueTypes:i,unqiueTypesMap:r,strongestUniqueType:[...f,"total"].reduce((c,t)=>(c[t]=i.reduce((u,l)=>l[t]>(u[t]||0)?l:u,{}),c),{}),types:y,typesMap:a,ubers:p.sort((c,t)=>c.total-t.total),strongestType:[...f,"total"].reduce((c,t)=>(c[t]=y.reduce((u,l)=>l[t]>(u[t]||0)?l:u,{}),c),{}),pk:h}}getSweeperScore(s){return Math.max(s.spa,s.atk)+Math.min(s.spe,115)}getTankScore(s){return(s.spd+s.def)/2+s.hp}getTypeAdvantages(s,r){const a=[],p=[],h=[],i=[];for(let y of r){for(let c of y){let t=1;const l=this.typeMatrix[this.typeIndex[c]];for(let T of s.types)t*=l[this.typeIndex[T]];t>1&&(a.push(y.join("/")),t=1),t<1&&(p.push(y.join("/")),t=1)}for(let c of s.types){let t=1;const l=this.typeMatrix[this.typeIndex[c]];for(let T of y)t*=l[this.typeIndex[T]];t>1&&(h.push(y.join("/")),t=1),t<1&&(i.push(y.join("/")),t=1)}}return{resistantTo:p,weakTo:a,strongTo:h,notEffectiveTo:i}}createTeam(s,r,a=[],p=6){const h=r?r.map(c=>c.name):[];console.log(h);const i=this.analyzeTypes();let y=null;for(;s>0;){const c=this.teamBuilder(h);for(;c.size()<p;){const d=i.pk[Math.floor(Math.random()*i.pk.length)].name;a.includes(d)||c.pick(d)}let t=this.analyzeTeam(c.build(),i);const u=t.weakTo.length,l=t.okayTo.slice(0,15).reduce((d,A)=>d+A.total,0);t.scoring=10*u+1.5*l-(t.strongTo.length+2*t.sweeperScore/20),(!y||t.scoring<y.scoring)&&(y=t,console.log(`\n****WINNER**** [${t.scoring}] ${t.team.map(d=>d.name).join()}`)),s--}return y}analyzeTeam(s,r){r=r||this.analyzeTypes();let a=0,p=0;const h=s.map(t=>{let u=Object.assign(Object.assign({pokemon:t},this.getTypeAdvantages(t,r.uniqueTypes.map(l=>l.types.split("/")))),{sweeperScore:this.getSweeperScore(t),tankScore:this.getTankScore(t)});return a+=u.sweeperScore,p+=u.tankScore,u}),i={},y={};return h.forEach(t=>{t.weakTo.forEach(u=>{i[u]=i[u]||{count:0,coveredCount:0},i[u].count++}),t.strongTo.forEach(u=>{y[u]=y[u]||{count:0},y[u].count++})}),Object.keys(y).forEach(t=>{i[t]&&i[t].coveredCount++}),{sweeperScore:a,tankScore:p,team:s.map(t=>{let u=r.unqiueTypesMap[t.types.join("/")].pk;return t.alternatives=u.filter(l=>l.name!=t.name).map(l=>l.name).join(", "),t.percentile=Object.assign({},t.types.map(l=>({type:l,percentile:this._getPercentile(t,r.typesMap[l].pk)})).reduce((l,T)=>(l[T.type]=T.percentile,l),{})),t.types.length>1&&(t.percentile[t.types.join("/")]=this._getPercentile(t,r.unqiueTypesMap[t.types.join("/")].pk)),t}),weakTo:Object.keys(i).filter(t=>0===i[t].coveredCount),strongTo:Object.keys(i).map(t=>i[t].count-i[t].coveredCount<1&&i[t].coveredCount>0&&t).filter(t=>t),okayTo:Object.keys(i).map(t=>{if(i[t].count-i[t].coveredCount>=1&&i[t].coveredCount>0)return Object.assign({type:t,total:i[t].count-i[t].coveredCount},i[t])}).filter(t=>t).sort((t,u)=>t.total-u.total).reverse()}}}})();