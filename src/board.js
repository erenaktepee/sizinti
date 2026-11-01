import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {locations,colors} from './game.js';
export const nodePositions=[[-14,-13],[-10,-13],[-6.6,-9.6],[-6.6,-6],[-3.5,-2.6],[3.5,-2.6],[6.6,-6],[6.6,-9.6],[10,-13],[14,-13],[-14,12],[-10,12],[-6.6,8.6],[-6.6,5],[-3.5,1.6],[3.5,1.6],[6.6,5],[6.6,8.6],[10,12],[14,12]];
export function board(host,onSelect){
 const noop={select(){},reset(){},reveal(){},clearReveal(){}};let renderer;
 try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});}catch{host.innerHTML='<p class="fallback">3B görüntü için WebGL gerekiyor. Konum listesinden oynamaya devam edebilirsin.</p>';return noop;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x07101b,0);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;host.append(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,1,.1,160);const home=new T.Vector3(3,40,35);camera.position.copy(home);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=15;controls.maxDistance=180;controls.maxPolarAngle=Math.PI*.46;controls.target.set(0,0,0);
 const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));const bloom=new UnrealBloomPass(new T.Vector2(1,1),.32,.4,1.05);composer.addPass(bloom);composer.addPass(new OutputPass());
 scene.add(new T.HemisphereLight(0xb8dfff,0x11172b,2));const light=new T.DirectionalLight(0xe7efff,3);light.position.set(-12,22,10);scene.add(light);
 const neon=col=>new T.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:.9,metalness:.5,roughness:.35});
 const dark=new T.MeshStandardMaterial({color:0x31475a,metalness:.45,roughness:.55});
 function mesh(geo,mat,x,y,z,parent=scene){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;}
 function box(w,h,d,mat,x,y,z,parent){return mesh(new T.BoxGeometry(w,h,d),mat,x,y,z,parent);}
 function tube(points,color,r=.045){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),false,'centripetal');return mesh(new T.TubeGeometry(curve,40,r,8,false),neon(color),0,0,0);}
 box(33,.7,33,dark,0,-.6,0);const texture=new T.TextureLoader().load('./art/harita_konsept.png');texture.colorSpace=T.SRGBColorSpace;
 const plane=mesh(new T.PlaneGeometry(32,32),new T.MeshStandardMaterial({map:texture,roughness:.65,metalness:.4}),0,-.2,0);plane.rotation.x=-Math.PI/2;
 // The Bosphorus follows the reference: four networks, two shores, one fractured city.
 const river=[[-3.8,-16],[-1.3,-13],[.3,-10],[1.1,-7],[.2,-4],[-1.3,-1],[-2,2],[-1.7,5],[-2.5,8],[-1.7,11],[.5,14],[2.2,16],[7.5,16],[5.5,13],[3.9,10],[3.1,7],[2,4],[2.7,1],[2.4,-2],[3.6,-5],[3.9,-8],[2.8,-11],[2,-14],[1.1,-16]];
 const shape=new T.Shape();river.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();const water=mesh(new T.ShapeGeometry(shape),new T.MeshStandardMaterial({color:0x10324b,emissive:0x06314b,emissiveIntensity:.3,metalness:.85,roughness:.21,side:T.DoubleSide}),0,-.16,0);water.rotation.x=-Math.PI/2;
 for(const z of [-12,-7,5,10])tube([[-.9,-.10,z],[.2,-.10,z+.5],[1,-.10,z]],0x237d9d,.018);
 for(const x of [-16.4,16.4])tube([[x,-.22,-16.4],[x,-.22,16.4]],0x008ea6,.025);for(const z of [-16.4,16.4])tube([[-16.4,-.22,z],[16.4,-.22,z]],0x008ea6,.025);
 const nodes=[],rings=[],labels=[],landmarks=[],packets=[];
 function label(text,x,z,color,i){const c=document.createElement('canvas');c.width=640;c.height=110;const ctx=c.getContext('2d');ctx.fillStyle='#07101bef';ctx.fillRect(0,0,640,110);ctx.fillStyle=color;ctx.fillRect(0,0,5,110);ctx.font='500 30px sans-serif';ctx.textAlign='center';ctx.fillText(text,320,66);const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthTest:false,transparent:true}));s.scale.set(5.4,.93,1);s.position.set(x,2.9,z+1.5);s.userData.id=i;scene.add(s);labels.push(s);}
 // Every station has its own miniature, instead of twenty repeated blocks.
 function landmark(i,x,z,col){const g=new T.Group();g.position.set(x,.15,z);scene.add(g);const n=neon(col),steel=dark.clone();steel.color.set(0x30465a);const b=(w,h,d,xx,y,zz,mat=steel)=>box(w,h,d,mat,xx,y,zz,g);
 const cyl=(r,h,xx,y,zz,mat=steel)=>mesh(new T.CylinderGeometry(r,r,h,16),mat,xx,y,zz,g);
 switch(i){
 case 0:b(1.6,.12,1.3,0,.2,0);b(.8,.15,.4,0,.9,0);for(const a of [-.6,.6])for(const c of [-.5,.5]){const r=mesh(new T.TorusGeometry(.24,.035,8,24),n,a,.95,c,g);r.rotation.x=Math.PI/2;}break;
 case 1:b(1.8,.35,.65,0,.3,0);b(1,.45,.50,0,.65,0);b(1.9,.05,.7,0,.48,0,n);break;
 case 2:for(let j=0;j<3;j++){b(1.5,.45,.65,0,.4+j*.47,0,j===2?n:steel);for(let k=0;k<6;k++)b(.025,.4,.68,-.65+k*.25,.4+j*.47,0);}break;
 case 3:for(const a of [-.55,.55]){cyl(.45,.65,a,.4,0);cyl(.46,.07,a,.76,0,n);}break;
 case 4:b(1.8,.15,.8,0,.25,0);b(.2,1.2,.2,-.65,.85,0);b(1.4,.1,.1,0,1.5,0,n);break;
 case 5:for(let j=0;j<7;j++){b(1-j*.07,.38,1-j*.07,0,.3+j*.41,0);b(1.03-j*.07,.035,1.03-j*.07,0,.5+j*.41,0,n);}b(.06,.8,.06,0,3.6,0,n);break;
 case 6:b(1.6,1.15,1.1,0,.6,0);b(1.3,.08,.8,0,1.22,0,n);break;
 case 7:mesh(new T.SphereGeometry(.8,20,12,0,Math.PI*2,0,Math.PI/2),steel,0,.2,0,g);for(const a of [-.6,.6]){const ring=mesh(new T.TorusGeometry(.65,.04,8,32),n,a,.85,0,g);ring.rotation.y=Math.PI/2;}break;
 case 8:b(1.25,1.4,.85,0,.75,0);b(.65,.16,.05,0,1.1,.46,n);b(.16,.65,.05,0,1.1,.47,n);break;
 case 9:cyl(.35,3.4,0,1.75,0);for(const y of [.5,2,3.4])cyl(.65,.1,0,y,0,n);break;
 case 10:b(1.7,.6,.65,0,.4,0);b(1.9,.12,1.2,0,1.5,0,n);for(const a of [-.75,.75])b(.06,1.3,.06,a,.8,0);break;
 case 11:for(const a of [-.65,0,.65]){b(.5,.7,.7,a,.45,0);b(.55,.07,.8,a,.84,0,n);}break;
 case 12:for(const a of [-.45,.45]){b(.6,.95,.6,a,.55,0);b(.45,.37,.03,a,.75,.32,n);}break;
 case 13:b(1.5,1.1,.8,0,.6,0);b(1.3,.75,.04,0,.75,.43,n);break;
 case 14:b(1.4,1.6,.85,0,.85,0);for(let j=0;j<3;j++)b(.95,.035,.04,0,.5+j*.4,.46,n);break;
 case 15:b(1.9,.65,.65,0,.5,0);for(let j=0;j<5;j++)b(.24,.23,.04,-.7+j*.35,.6,.35,n);break;
 case 16:cyl(.8,.9,0,.5,0);const ring=mesh(new T.TorusGeometry(.63,.07,8,32),n,0,1.15,0,g);break;
 case 17:for(const a of [-.55,0,.55]){b(.4,1.5,.7,a,.8,0);for(let j=0;j<5;j++)b(.29,.04,.03,a,.3+j*.25,.37,n);}break;
 case 18:b(1.3,.7,.9,0,.45,0);for(const a of [-.4,0,.4])b(.32,.27,.04,a,.96,.1,n);break;
 case 19:for(let j=0;j<5;j++){const m=b(.45,.45,.5,Math.sin(j*4)*.5,.3+j*.2,Math.cos(j*4)*.4,j===4?n:steel);m.rotation.z=j*.3;}break;
 }
 g.traverse(o=>{if(o.isMesh){o.userData.id=i;nodes.push(o);}});return g;}
 locations.forEach((name,i)=>{const [x,z]=nodePositions[i],col=colors[Math.floor(i/5)],n=neon(col);const base=mesh(new T.CylinderGeometry(1.08,1.2,.18,48),dark,x,0,z);base.userData.id=i;nodes.push(base);const ring=mesh(new T.TorusGeometry(1.12,.045,8,48),n,x,.12,z);ring.rotation.x=Math.PI/2;rings.push(ring);landmarks.push(landmark(i,x,z,col));label(`${String(i+1).padStart(2,'0')} / ${name}`,x,z,col,i);
 if(i%5){const [px,pz]=nodePositions[i-1];const path=[[px,.12,pz],[x,.12,z]];tube(path,col,.048);const p=mesh(new T.SphereGeometry(.09,8,8),new T.MeshBasicMaterial({color:col}),x,.16,z);packets.push({p,a:new T.Vector3(px,.17,pz),b:new T.Vector3(x,.17,z),offset:i*.13});}
 });
 // Suspended bridge, sky traffic, city micro-lights and weather create a living diorama.
 for(const z of [-8,8]){tube([[-4,.5,z],[4,.5,z]],0x3b6a83,.08);for(const x of [-3,3]){box(.12,2,.12,dark,x,1,z);tube([[x-1,.5,z],[x,2,z],[x+1,.5,z]],0x00a3c1,.025);}}
 const rainGeo=new T.BufferGeometry(),rain=new Float32Array(270);for(let i=0;i<90;i++){rain[i*3]=Math.sin(i*17)*18;rain[i*3+1]=(i*1.73)%9;rain[i*3+2]=Math.cos(i*13)*18;}rainGeo.setAttribute('position',new T.BufferAttribute(rain,3));const rainPoints=new T.Points(rainGeo,new T.PointsMaterial({color:0x68a4b9,size:.035,transparent:true,opacity:.5}));scene.add(rainPoints);
 const focus=new T.Group();scene.add(focus);focus.visible=false;
 const beamMat=new T.MeshBasicMaterial({color:0x00e5ff,transparent:true,opacity:.08,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending});const beam=mesh(new T.CylinderGeometry(.35,1.4,8,48,1,true),beamMat,0,4,0,focus);
 // Four-rotor search drone: its downward lens is the source of the reveal beam.
 const drone=new T.Group();drone.position.y=8.3;focus.add(drone);
 const droneGlow=neon(0x00e5ff),droneSteel=new T.MeshStandardMaterial({color:0x24384b,metalness:.8,roughness:.3});
 const hull=mesh(new T.SphereGeometry(.53,20,12),droneSteel,0,0,0,drone);hull.scale.set(1,.43,.78);
 box(.65,.055,.40,droneGlow,0,.19,0,drone);
 mesh(new T.CylinderGeometry(.18,.24,.15,24),droneSteel,0,-.23,0,drone);
 const lens=mesh(new T.CylinderGeometry(.14,.14,.035,24),droneGlow,0,-.315,0,drone);
 const propellers=[];
 for(const x of [-1.05,1.05])for(const z of [-.82,.82]){
  const arm=new T.Vector3(x,0,z),center=arm.clone().multiplyScalar(.5);
  const support=mesh(new T.CylinderGeometry(.055,.065,arm.length(),10),droneSteel,center.x,0,center.z,drone);support.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),arm.clone().normalize());
  mesh(new T.CylinderGeometry(.13,.16,.18,16),droneSteel,x,.07,z,drone);
  const guard=mesh(new T.TorusGeometry(.49,.032,8,40),droneGlow,x,.14,z,drone);guard.rotation.x=Math.PI/2;
  const rotor=new T.Group();rotor.position.set(x,.18,z);drone.add(rotor);box(.84,.025,.08,droneSteel,0,0,0,rotor);box(.08,.025,.84,droneSteel,0,0,0,rotor);propellers.push(rotor);
 }
 for(const x of [-.38,.38]){const leg=box(.035,.24,.035,droneSteel,x,-.24,.28,drone);leg.rotation.z=x>0?-.3:.3;}
 const halos=[];for(let k=0;k<3;k++){const m=mesh(new T.TorusGeometry(1.3,.035,8,64),new T.MeshBasicMaterial({color:0x00e5ff,transparent:true,opacity:.8}),0,.2,0,focus);m.rotation.x=Math.PI/2;halos.push(m);}const spot=new T.PointLight(0x00e5ff,55,14);spot.position.y=3;focus.add(spot);
 let selected=-1,revealed=-1,transition=null;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function moveCamera(target,position){transition={at:performance.now(),from:camera.position.clone(),fromTarget:controls.target.clone(),target,position};}
 controls.addEventListener('start',()=>transition=null);
 const ray=new T.Raycaster(),mouse=new T.Vector2();let down=null;
 renderer.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;const rect=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(mouse,camera);const hit=ray.intersectObjects([...nodes,...labels])[0];if(hit)onSelect(hit.object.userData.id);});
 let fittedAspect=0;
 new ResizeObserver(()=>{
  const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
  renderer.setSize(w,h);composer.setSize(w,h);const oldDistance=home.length();camera.aspect=w/h;
  home.set(3,40,35);const fitCamera=camera.clone();fitCamera.aspect=w/h;fitCamera.updateProjectionMatrix();
  for(let pass=0;pass<30;pass++){
   fitCamera.position.copy(home);fitCamera.lookAt(0,0,0);fitCamera.updateMatrixWorld(true);
   const fits=[[-17,-17],[-17,17],[17,-17],[17,17]].every(([x,z])=>{const p=new T.Vector3(x,2,z).project(fitCamera);return Math.abs(p.x)<.92&&Math.abs(p.y)<.92;});
   if(fits)break;home.multiplyScalar(1.055);
  }
  if(!fittedAspect)camera.position.copy(home);
  else if(revealed<0){if(transition)transition.position.copy(home);else camera.position.sub(controls.target).multiplyScalar(home.length()/oldDistance).add(controls.target);}
  fittedAspect=camera.aspect;camera.updateProjectionMatrix();
 }).observe(host);
 const clock=new T.Clock();renderer.setAnimationLoop(()=>{const t=clock.getElapsedTime();rings.forEach((r,i)=>r.scale.setScalar(i===selected?1.12+(reduce?0:Math.sin(t*3)*.04):1));packets.forEach(({p,a,b,offset})=>p.position.lerpVectors(a,b,reduce?.5:(t*.22+offset)%1));
 if(!reduce){for(let i=0;i<90;i++){rain[i*3+1]-=.025;if(rain[i*3+1]<0)rain[i*3+1]=9;}rainGeo.attributes.position.needsUpdate=true;}
 if(revealed>=0){const hover=reduce?0:Math.sin(t*2)*.1;drone.position.y=8.3+hover;drone.rotation.y=reduce?.2:Math.sin(t*.4)*.12;beam.scale.y=(8+hover)/8;beam.position.y=(8+hover)/2;propellers.forEach((r,i)=>r.rotation.y=reduce?0:t*(i%2?24:-24));}if(revealed>=0)halos.forEach((m,k)=>{const f=reduce?.4:(t*.45+k/3)%1;m.scale.setScalar(1+f*1.8);m.material.opacity=(1-f)*.85;});
 if(transition){let a=Math.min(1,(performance.now()-transition.at)/(reduce?1:1600));a=a*a*(3-2*a);camera.position.lerpVectors(transition.from,transition.position,a);controls.target.lerpVectors(transition.fromTarget,transition.target,a);if(a>=1)transition=null;}
 controls.update();composer.render();});
 return {select(i){selected=i;},reset(){moveCamera(new T.Vector3(),home.clone());},reveal(i,winner){revealed=i;selected=i;const [x,z]=nodePositions[i],col=winner==='spy'?0xff2e88:0x00e5ff;focus.position.set(x,.15,z);focus.visible=true;beamMat.color.set(col);droneGlow.color.set(col);droneGlow.emissive.set(col);spot.color.set(col);halos.forEach(m=>m.material.color.set(col));labels.forEach((s,j)=>{s.material.opacity=j===i?1:.42;});moveCamera(new T.Vector3(x*.72,0,z*.72),new T.Vector3(x*.72+8,23,z*.72+23));},clearReveal(){revealed=-1;focus.visible=false;labels.forEach(s=>s.material.opacity=1);this.reset();}};
}
