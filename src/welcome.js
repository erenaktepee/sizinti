import './welcome.css';

// Original pentatonic ambient melody, synthesized locally.
function soundtrack(update) {
 let ctx, master, timer, enabled=false, step=0, next=0;
 const notes=[76,79,83,79,74,78,81,78,72,76,79,76,74,78,81,86], roots=[48,43,45,47];
 function tone(note,at,duration,volume) {
  const osc=ctx.createOscillator(), gain=ctx.createGain();
  osc.frequency.value=440*2**((note-69)/12);
  gain.gain.setValueAtTime(0,at); gain.gain.linearRampToValueAtTime(volume,at+.08); gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
  osc.connect(gain); gain.connect(master); osc.start(at); osc.stop(at+duration+.05);
  osc.onended=()=>{osc.disconnect();gain.disconnect();};
 }
 function schedule(){
  if(!enabled||ctx.state!=='running')return;
  if(next<ctx.currentTime)next=ctx.currentTime+.05;
  while(next<ctx.currentTime+.25){
   tone(notes[step%16],next,1.9,.12);
   if(step%4===0){const root=roots[Math.floor(step/4)%4];[root,root+7,root+14].forEach(n=>tone(n,next,3.1,.055));}
   next+=.48;step++;
  }
 }
 async function set(on){
  try{
   if(!ctx&&on){ctx=new AudioContext();master=ctx.createGain();master.gain.value=.45;master.connect(ctx.destination);}
   if(on){await ctx.resume();enabled=true;clearInterval(timer);next=ctx.currentTime+.08;schedule();timer=setInterval(schedule,100);}
   else{enabled=false;clearInterval(timer);if(ctx)await ctx.suspend();}
   update(enabled);
  }catch{enabled=false;update(false,true);}
 }
 document.addEventListener('visibilitychange',()=>{if(!ctx||!enabled)return;if(document.hidden)ctx.suspend();else ctx.resume().then(()=>{next=ctx.currentTime+.08;});});
 return {set,toggle:()=>set(!enabled)};
}

export function showWelcome(){
 const app=document.querySelector('#app'), screen=document.createElement('section');
 screen.id='welcome';screen.setAttribute('aria-labelledby','welcome-title');
 screen.innerHTML=`<div class="welcome-top"><span>◈ GÖLGE AĞ</span><span>NEO-İSTANBUL / 2099</span></div>
 <div class="welcome-content"><span class="welcome-label">BİR SOSYAL ÇIKARIM OYUNU</span>
 <h1 id="welcome-title">SIZINTI<span>KİM SIZDIRIYOR?</span></h1>
 <p>Şehir uyumuyor.<br>Aranızdan biri her şeyi dinliyor.</p>
 <div class="welcome-facts"><span>4–8 OYUNCU</span><span>4 TUR</span><span>TEK CİHAZ</span></div>
 <button id="welcome-start" type="button">AĞA KATIL <span>↗</span></button>
 <details class="welcome-how"><summary>Nasıl oynanır?</summary><p>Kartını gizlice incele. Konumu açık etmeden sorular sor. İçinizdeki Sızıntı’yı bul ve dört turda en çok veri çipini topla.</p></details>
 <span class="welcome-hint">Arkadaşlarını topla. İlk bağlantıyı sen kur.</span></div>
 <div class="welcome-bottom"><span>41°00′ N / 28°58′ E</span><span>● SİNYAL BEKLENİYOR</span></div>`;
 const button=document.createElement('button');button.id='ambient-toggle';button.type='button';button.setAttribute('aria-pressed','false');button.textContent='♫ Müziği aç';
 let chosen=false;
 const music=soundtrack((on,failed)=>{button.setAttribute('aria-pressed',String(on));button.textContent=failed?'♫ Ses açılamadı · Tekrar dene':on?'♫ Müzik açık · Kapat':'♫ Müziği aç';});
 button.onclick=()=>{chosen=true;music.toggle();};
 app.inert=true;document.body.classList.add('at-welcome');document.body.append(screen,button);
 const start=screen.querySelector('#welcome-start');
 start.onclick=()=>{if(!chosen)music.set(true);app.inert=false;screen.remove();document.body.classList.remove('at-welcome');document.querySelector('#count')?.focus();};
 start.focus();
}
