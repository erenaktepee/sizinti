import * as T from 'three';
export const identities = ['Netrunner','Drone Kuryesi','Aşçı Android','Siber Sağlıkçı','Ağ Muhafızı','Sokak Satıcısı','Maskeli Operatif','Neon DJ'];
export const accents = ['#00e5ff','#ff2e88','#ffe600','#ff2e88','#00e5ff','#ffe600','#e9ecf2','#ff2e88'];
export function createCharacter(index=0){
 const root=new T.Group(),body=new T.Group();root.add(body);const color=accents[index%8];
 const suit=new T.MeshStandardMaterial({color:0x192330,roughness:.62,metalness:.45});
 const armor=new T.MeshStandardMaterial({color:0x354450,roughness:.4,metalness:.65});
 const skin=new T.MeshStandardMaterial({color:index===2?0xc7d0ce:0xccad9b,roughness:.8,metalness:index===2?.6:0});
 const neon=new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:2.5,roughness:.3});
 const white=new T.MeshStandardMaterial({color:0xc0c7cf,roughness:.7});
 const black=new T.MeshStandardMaterial({color:0x070c14,metalness:.5,roughness:.3});
 function add(geo,mat,x,y,z,parent=body){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;}
 const box=(w,h,d,mat,x,y,z,parent)=>add(new T.BoxGeometry(w,h,d),mat,x,y,z,parent);
 const ball=(r,mat,x,y,z,parent)=>add(new T.SphereGeometry(r,16,12),mat,x,y,z,parent);
 const limb=(a,b,r,mat,parent=body)=>{const av=new T.Vector3(...a),bv=new T.Vector3(...b);const m=add(new T.CylinderGeometry(r*.85,r,av.distanceTo(bv),10),mat,...av.clone().add(bv).multiplyScalar(.5).toArray(),parent);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),bv.sub(av).normalize());return m;};
 // Articulated silhouette, layered shoes, knee pads, gloves and luminous trims.
 for(const side of [-1,1]){const x=side*.21;box(.32,.18,.55,black,x,.12,.09);box(.33,.035,.56,neon,x,.065,.09);limb([x,.25,0],[x,.85,0],.13,suit);ball(.135,armor,x,.9,.015);box(.18,.23,.12,armor,x,.9,.13);limb([x,.98,0],[side*.17,1.46,0],.17,suit);box(.035,.36,.04,neon,x+side*.1,.48,.13);}
 box(.62,.2,.38,black,0,1.49,0);for(let i=-2;i<=2;i++)box(.075,.13,.07,armor,i*.11,1.5,.22);
 const torso=add(new T.CylinderGeometry(.37,.29,.75,8),suit,0,1.98,0);torso.scale.z=.65;
 box(.53,.39,.11,index===3?white:armor,0,2.05,.23);box(.23,.035,.035,neon,.12,2.15,.3);
 for(const side of [-1,1]){ball(.185,index===3?white:armor,side*.43,2.23,0);limb([side*.46,2.17,0],[side*.57,1.88,.02],.115,index===3?white:suit);ball(.11,black,side*.57,1.86,.02);limb([side*.57,1.84,.02],[side*.56,1.54,.1],.10,suit);ball(.115,black,side*.56,1.5,.12);box(.055,.23,.045,neon,side*.65,1.77,.06);}
 limb([0,2.32,0],[0,2.49,0],.1,skin);
 const head=add(index===2?new T.BoxGeometry(.43,.44,.39):new T.SphereGeometry(.245,20,16),index===4?armor:skin,0,2.69,0);head.scale.set(1,1.15,.9);
 ball(.05,skin,0,2.66,.22);box(.10,.014,.018,black,0,2.56,.208);
 for(const x of [-.095,.095]){box(.065,.025,.025,black,x,2.72,.21);box(.025,.016,.03,neon,x,2.72,.228);}
 if([0,1,4,6].includes(index)){box(.42,.12,.16,black,0,2.72,.18);box(.36,.045,.04,neon,0,2.73,.275);}
 if(index!==2&&index!==4){const hair=ball(.25,index===3||index===6?white:black,0,2.86,-.035);hair.scale.set(1, .6,1);if([0,3,7].includes(index)){for(const side of [-1,1]){box(.10,.4,.19,index===3?white:black,side*.22,2.66,-.08);}}}
 if(index===0){for(const side of [-1,1]){box(.075,.67,.045,neon,side*.3,2.02,.18);}box(.32,.42,.10,armor,.6,1.22,.18);box(.22,.25,.02,neon,.6,1.25,.24);}
 if(index===1){box(.67,.75,.28,armor,0,2,-.36);box(.37,.07,.04,neon,0,2.2,-.52);box(.48,.06,.44,black,0,2.96,.08);const drone=new T.Group();body.add(drone);drone.position.set(.15,3.35,-.2);box(.22,.10,.22,armor,0,0,0,drone);for(const x of [-.3,.3])for(const z of [-.25,.25]){limb([0,0,0],[x,0,z],.018,armor,drone);const ring=add(new T.TorusGeometry(.15,.012,6,24),neon,x,0,z,drone);ring.rotation.x=Math.PI/2;}root.userData.drone=drone;}
 if(index===2){box(.50,.86,.08,black,0,1.77,.29);box(.47,.04,.03,neon,0,2.17,.35);for(const x of [-.16,.16])box(.04,.7,.03,white,x,1.68,.35);box(.04,.45,.04,armor,-.6,1.84,.2);ball(.10,white,-.6,2.10,.2);}
 if(index===3||index===6){for(const side of [-1,1]){box(.22,.88,.35,index===3?white:suit,side*.23,1.48,-.02);box(.025,.9,.025,neon,side*.11,1.6,.24);}if(index===3){const ring=add(new T.TorusGeometry(.15,.025,8,24),neon,0,2.11,.31);ring.scale.y=1.4;}else{box(.24,.33,.04,black,0,2.65,.23);box(.025,.24,.045,white,0,2.66,.26);}}
 if(index===4){const shield=box(.62,1.2,.12,armor,-.7,1.7,.30);shield.rotation.z=.14;box(.60,.045,.15,neon,-.7,2.29,.31);box(.035,1.14,.15,neon,-.99,1.70,.31);box(.7,.18,.40,armor,0,2.2,0);box(.05,.43,.05,neon,.24,2.73,-.1);}
 if(index===5){box(1.22,.08,.66,armor,0,1.65,.45);const bowl=add(new T.SphereGeometry(.20,16,10,0,Math.PI*2,0,Math.PI/2),neon,0,1.76,.52);bowl.rotation.x=Math.PI;for(const side of [-1,1])box(.05,.45,.05,neon,side*.28,2.03,.2);}
 if(index===7){for(const side of [-1,1]){const ear=add(new T.CylinderGeometry(.14,.14,.10,20),neon,side*.26,2.72,0);ear.rotation.z=Math.PI/2;}box(.95,.12,.55,black,0,1.55,.43);for(const x of [-.27,.27]){const disc=add(new T.CylinderGeometry(.17,.17,.025,24),neon,x,1.63,.43);disc.rotation.y=Math.PI/2;}for(let i=0;i<5;i++)box(.035,.035,.05,neon,(i-2)*.07,1.64,.61);}
 root.userData.body=body;return root;
}
export function characterPortrait(host){
 let renderer;try{renderer=new T.WebGLRenderer({antialias:true,alpha:true});}catch{host.innerHTML='<img src="./art/karakterler.png" alt="Gölge Ağ karakterleri">';return {show(){},mount(){}};}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x000000,0);renderer.toneMapping=T.ACESFilmicToneMapping;
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(32,1,.1,50);camera.position.set(.1,1.85,6.8);camera.lookAt(0,1.6,0);
 scene.add(new T.HemisphereLight(0xd7eaff,0x151328,3));const key=new T.DirectionalLight(0xffffff,4);key.position.set(3,5,4);scene.add(key);const rim=new T.PointLight(0xff2e88,25,12);rim.position.set(-2,2,-1);scene.add(rim);
 const floor=new T.Mesh(new T.CylinderGeometry(.9,.95,.1,64),new T.MeshStandardMaterial({color:0x101e2c,metalness:.8,roughness:.4}));floor.position.y=-.05;scene.add(floor);
 const ring=new T.Mesh(new T.TorusGeometry(.88,.015,8,64),new T.MeshBasicMaterial({color:0x00e5ff}));ring.rotation.x=Math.PI/2;scene.add(ring);
 let actor=null,index=-1,currentHost=host,angle=0,drag=false,last=0;
 renderer.domElement.setAttribute('aria-label','Döndürülebilir 3B oyuncu karakteri');renderer.domElement.addEventListener('pointerdown',e=>{drag=true;last=e.clientX;renderer.domElement.setPointerCapture(e.pointerId);});renderer.domElement.addEventListener('pointermove',e=>{if(drag){angle+=(e.clientX-last)*.012;last=e.clientX;}});renderer.domElement.addEventListener('pointerup',()=>drag=false);
 const observer=new ResizeObserver(resize);function resize(){const w=currentHost.clientWidth,h=currentHost.clientHeight;if(w&&h){renderer.setSize(w,h);camera.aspect=w/h;const halfFov=Math.tan(T.MathUtils.degToRad(camera.fov/2));const distance=Math.max(3.9/(2*halfFov),2.5/(2*halfFov*camera.aspect))*1.12;camera.position.set(.1,1.8,distance);camera.lookAt(0,1.65,0);camera.updateProjectionMatrix();}}
 function mount(el){observer.disconnect();currentHost=el;el.append(renderer.domElement);observer.observe(el);resize();}
 function show(i){if(index===i)return;index=i;if(actor){scene.remove(actor);actor.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});}actor=createCharacter(i);scene.add(actor);angle=-.23;ring.material.color.set(accents[i]);}
 mount(host);show(0);const clock=new T.Clock();renderer.setAnimationLoop(()=>{if(!currentHost.isConnected)return;const t=clock.getElapsedTime();actor.rotation.y=angle+Math.sin(t*.4)*.16;actor.userData.body.position.y=Math.sin(t*1.7)*.015;if(actor.userData.drone)actor.userData.drone.position.y=3.35+Math.sin(t*2)*.07;renderer.render(scene,camera);});return {show,mount};
}
