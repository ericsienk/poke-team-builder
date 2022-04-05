(()=>{"use strict";addEventListener("message",({data:{team:I,pokemon:s,interations:r=1e4,banList:i=[]}})=>{const u=new w(s),h=u.teamBuilder();I.forEach(c=>h.pick(c)),postMessage(u.createTeam(r,h.build(),i))});const n=.5,f=["hp","atk","def","spa","spd","spe"];class w{constructor(s){this.pokemon=s,this.STATS=f,this.pkmnNameMap=this.pokemon.reduce((r,i)=>(r[i.name]=i,r),{}),this.typeIndex={Bug:0,Dark:1,Dragon:2,Electric:3,Fairy:4,Fighting:5,Fire:6,Flying:7,Ghost:8,Grass:9,Ground:10,Ice:11,Normal:12,Poison:13,Psychic:14,Rock:15,Steel:16,Water:17},this.typeMatrix=[[1,2,1,1,n,n,n,n,n,2,1,1,1,n,2,1,n,1],[1,n,1,1,n,n,1,1,2,1,1,1,1,1,2,1,1,1],[1,1,2,1,0,1,1,1,1,1,1,1,1,1,1,1,n,1],[1,1,n,n,1,1,1,2,1,n,n,1,1,1,1,1,1,2],[1,2,2,1,1,2,n,1,1,1,1,1,1,n,1,1,n,1],[n,2,1,1,n,1,1,n,0,1,1,2,2,n,n,2,2,1],[2,1,n,1,1,1,n,1,1,2,1,2,1,1,1,n,2,n],[2,1,1,n,1,1,1,2,1,1,1,1,1,1,1,n,n,1],[1,n,1,1,1,1,1,1,2,1,1,1,0,1,2,1,1,1],[n,1,n,1,1,1,n,n,1,n,2,1,1,n,1,2,n,2],[n,1,1,2,1,1,2,n,1,n,1,1,1,2,1,2,2,1],[1,1,2,1,1,1,n,2,1,2,2,n,1,1,1,1,n,n],[1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,n,n,1],[1,1,1,1,2,1,1,1,n,2,n,1,1,n,1,n,0,1],[1,n,1,1,1,2,1,1,1,1,1,1,1,1,2,n,n,1],[2,1,1,1,1,n,2,2,1,1,n,2,1,1,1,1,n,1],[1,1,1,n,2,1,n,1,1,1,1,2,1,1,1,2,n,n],[1,1,n,1,1,1,2,1,1,n,2,1,1,1,1,2,1,n]]}teamBuilder(s=[]){const r=this.pkmnNameMap,i={team:[],pick:function(u){return this.team.push(r[u]),this},build:function(){return this.team},size:function(){return this.team.length}};for(let u of s)i.pick(u);return i}_avgStats(s,r){s.pk.push(r);for(let i of f)s[i]=(s[i]+r[i])/2;r.total=this._getTotalStats(r),s.total=(s.total+r.total)/2}_getPercentile(s,r){const i={};for(let u of f){const h=r.map(c=>c[u]).sort().reverse();i[u]=Math.round(100/r.length*(h.lastIndexOf(s[u])+1))}return i}_initTypeStat(s){return{pk:[],types:s,hp:0,atk:0,def:0,spa:0,spd:0,spe:0,total:0,std:{hp:0,atk:0,def:0,spa:0,spd:0,spe:0,total:0},count:0}}_processTypingStat(s,r,i){let u=s[r];u||(s[r]=u=this._initTypeStat(r)),u.count++,this._avgStats(u,i)}_typesMapToArray(s){return Object.values(s).sort((r,i)=>r.count<i.count?1:r.count>i.count?-1:0).map(r=>(r.pk.sort((i,u)=>i.total<u.total?1:i.total>u.total?-1:0),r))}_getTotalStats(s){return f.reduce((r,i)=>r+s[i],0)}analyzeTypes(s={evolved:!0,sort:["totalStats"],statsLimit:601}){const r={},i={},u=[],h=[];this.pokemon.filter(p=>{if(!p.oob||!p.oob.evos.length&&p.oob.dex_number>0){let t=this._getTotalStats(p);return t<=s.statsLimit||(p.total=t,u.push(p),!1)}return!1}).forEach(p=>{const t=p.types.sort().join("/");this._processTypingStat(r,t,p),p.types.forEach(a=>this._processTypingStat(i,a,p)),h.push(p)});const c=this._typesMapToArray(r),y=this._typesMapToArray(i);return{uniqueTypes:c,unqiueTypesMap:r,strongestUniqueType:[...f,"total"].reduce((p,t)=>(p[t]=c.reduce((a,l)=>l[t]>(a[t]||0)?l:a,{}),p),{}),types:y,typesMap:i,ubers:u.sort((p,t)=>p.total-t.total),strongestType:[...f,"total"].reduce((p,t)=>(p[t]=y.reduce((a,l)=>l[t]>(a[t]||0)?l:a,{}),p),{}),pk:h}}getSweeperScore(s){return Math.max(s.spa,s.atk)+Math.min(s.spe,115)}getTankScore(s){return(s.spd+s.def)/2+s.hp}getTypeAdvantages(s,r){const i=[],u=[],h=[],c=[];for(let y of r){for(let p of y){let t=1;const l=this.typeMatrix[this.typeIndex[p]];for(let T of s.types)t*=l[this.typeIndex[T]];t>1&&(i.push(y.join("/")),t=1),t<1&&(u.push(y.join("/")),t=1)}for(let p of s.types){let t=1;const l=this.typeMatrix[this.typeIndex[p]];for(let T of y)t*=l[this.typeIndex[T]];t>1&&(h.push(y.join("/")),t=1),t<1&&(c.push(y.join("/")),t=1)}}return{resistantTo:u,weakTo:i,strongTo:h,notEffectiveTo:c}}createTeam(s,r,i=[],u=6){const h=s,c=r?r.map(t=>t.name):[];console.log(c);const y=this.analyzeTypes();let p=null;for(;s>0;){const t=this.teamBuilder(c);for(;t.size()<u;){const d=y.pk[Math.floor(Math.random()*y.pk.length)].name;i.includes(d)||t.pick(d)}let a=this.analyzeTeam(t.build(),y);const l=a.weakTo.length,T=a.okayTo.slice(0,15).reduce((d,j)=>d+j.total,0);a.scoring=10*l+1.5*T-(a.strongTo.length+2*a.sweeperScore/20),(!p||a.scoring<p.scoring)&&(p=a,console.log(`\n****WINNER**** [${a.scoring}] ${a.team.map(d=>d.name).join()}`),postMessage(Object.assign(Object.assign({},p),{currentInteration:h-s}))),s--}return Object.assign(Object.assign({},p),{done:!0})}analyzeTeam(s,r){r=r||this.analyzeTypes();let i=0,u=0;const h=s.map(t=>{let a=Object.assign(Object.assign({pokemon:t},this.getTypeAdvantages(t,r.uniqueTypes.map(l=>l.types.split("/")))),{sweeperScore:this.getSweeperScore(t),tankScore:this.getTankScore(t)});return i+=a.sweeperScore,u+=a.tankScore,a}),c={},y={};return h.forEach(t=>{t.weakTo.forEach(a=>{c[a]=c[a]||{count:0,coveredCount:0},c[a].count++}),t.strongTo.forEach(a=>{y[a]=y[a]||{count:0},y[a].count++})}),Object.keys(y).forEach(t=>{c[t]&&c[t].coveredCount++}),{sweeperScore:i,tankScore:u,team:s.map(t=>{let a=r.unqiueTypesMap[t.types.join("/")].pk;return t.alternatives=a.filter(l=>l.name!=t.name).map(l=>l.name).join(", "),t.percentile=Object.assign({},t.types.map(l=>({type:l,percentile:this._getPercentile(t,r.typesMap[l].pk)})).reduce((l,T)=>(l[T.type]=T.percentile,l),{})),t.types.length>1&&(t.percentile[t.types.join("/")]=this._getPercentile(t,r.unqiueTypesMap[t.types.join("/")].pk)),t}),weakTo:Object.keys(c).filter(t=>0===c[t].coveredCount),strongTo:Object.keys(c).map(t=>c[t].count-c[t].coveredCount<1&&c[t].coveredCount>0&&t).filter(t=>t),okayTo:Object.keys(c).map(t=>{if(c[t].count-c[t].coveredCount>=1&&c[t].coveredCount>0)return Object.assign({type:t,total:c[t].count-c[t].coveredCount},c[t])}).filter(t=>t).sort((t,a)=>t.total-a.total).reverse()}}}})();