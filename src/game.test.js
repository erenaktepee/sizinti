import test from 'node:test';
import assert from 'node:assert/strict';
import {deal,score,majority} from './game.js';
const players=Array.from({length:5},(_,i)=>({name:`P${i}`,score:0,scan:true}));
test('Her dağıtımda bir Sızıntı, geçerli konum ve dönüşen operatör vardır',()=>{for(let round=1;round<=4;round++){for(let k=0;k<100;k++){const d=deal(players,round);assert.ok(d.spy>=0&&d.spy<5);assert.ok(d.location>=0&&d.location<20);assert.equal(d.operator,round-1);assert.equal(d.roles.length,5);assert.ok(d.roles.every(Boolean));}}});
test('Doğru alarm ajanlara bir ve başlatana ek çip verir',()=>{assert.deepEqual(score(players,{spy:2},'agents',0).map(p=>p.score),[2,1,0,1,1]);});
test('Kaçan Sızıntı iki, doğru tahmin eden dört çip alır',()=>{assert.deepEqual(score(players,{spy:2},'spy').map(p=>p.score),[0,0,2,0,0]);assert.equal(score(players,{spy:2},'spy',null,true)[2].score,4);});
test('Son tarama salt çoğunluk ister; eşitlik ve dağınık oy kaçıştır',()=>{assert.equal(majority([2,2,2,0,1],5),2);assert.equal(majority([0,0,1,1],4),null);assert.equal(majority([0,0,1,2,3],5),null);});
test('Puanlama tarama jetonlarını korur ve girdiyi değiştirmez',()=>{const p=players.map((v,i)=>({...v,scan:i!==0}));const result=score(p,{spy:2},'agents');assert.equal(result[0].scan,false);assert.equal(p[0].score,0);});

test('Sıralama puana göre azalır, eşit puanlar aynı dereceyi paylaşır',async()=>{const {ranking}=await import('./game.js');const ps=[{name:'A',score:2},{name:'B',score:4},{name:'C',score:4},{name:'D',score:0}];const result=ranking(ps);assert.deepEqual(result.map(p=>[p.name,p.rank,p.seat]),[['B',1,1],['C',1,2],['A',3,0],['D',4,3]]);assert.equal(ps[0].name,'A');});
