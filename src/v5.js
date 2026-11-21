
// ================= v5: proje tasarımı, teklifler, borsa, banka puanı, koleksiyon, deprem =================
const gauss=()=>{let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
const pct=(x,d=1)=>(x>=0?'+':'−')+'%'+Math.abs(x*100).toLocaleString('tr-TR',{maximumFractionDigits:d});
function spark(arr,w=90,h=28,col){
  if(!arr||arr.length<2)return '';const mn=Math.min(...arr),mx=Math.max(...arr),r=mx-mn||1;
  const up=arr[arr.length-1]>=arr[0];col=col||(up?'var(--good)':'var(--bad)');
  const pts=arr.map((v,i)=>`${(i/(arr.length-1)*w).toFixed(1)},${(h-2-(v-mn)/r*(h-4)).toFixed(1)}`).join(' ');
  return `<svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
}

// ---------- tasarım kuralları (kat / blok / plan)
// tall: yükseklik kat sayısıyla büyür. b: blok (ya da villa/iskele sayısı). f: kat. opt: plan seçeneği türü
const DZ={
  ev:{b0:1,bmax:1,f0:2,fmin:1,fmax:3,opt:'plan',bn:'Ev',fn:'Kat'},
  apt:{b0:1,bmax:3,f0:5,fmin:3,fmax:12,opt:'plan',tall:1},
  villa:{b0:4,bmin:2,bmax:16,f0:2,fmin:1,fmax:3,opt:'plan',bn:'Villa sayısı',fn:'Villa katı',each:1},
  rez:{b0:1,bmax:2,f0:20,fmin:10,fmax:40,opt:'plan',tall:1},
  kule:{b0:1,bmax:1,f0:40,fmin:25,fmax:90,opt:'plan',tall:1},
  site:{b0:4,bmin:2,bmax:12,f0:6,fmin:3,fmax:14,opt:'plan',tall:1},
  otel:{b0:1,bmax:2,f0:8,fmin:4,fmax:24,opt:'konsept',tall:1},
  avm:{b0:1,bmax:1,f0:3,fmin:1,fmax:6,opt:'boy',fn:'AVM katı'},
  ofis:{b0:1,bmax:2,f0:20,fmin:8,fmax:45,opt:'boy',tall:1},
  marina:{b0:2,bmin:1,bmax:6,f0:1,fmin:1,fmax:1,opt:'boy',bn:'İskele sayısı'},
  fabrika:{b0:1,bmax:4,f0:1,fmin:1,fmax:3,bn:'Üretim holü',fn:'Kat'},
  hastane:{b0:1,bmax:2,f0:6,fmin:3,fmax:14,tall:1},
  stadyum:{b0:1,bmax:1,f0:2,fmin:1,fmax:4,fn:'Tribün katı'},
  yurt:{b0:1,bmax:3,f0:5,fmin:3,fmax:12,tall:1},
  depo:{b0:1,bmax:5,f0:1,fmin:1,fmax:2,bn:'Depo binası'},
  ozelokul:{b0:1,bmax:2,f0:3,fmin:2,fmax:6,tall:1},
};
const OPTS={
  plan:{n:'Daire planı',o:[['1+1',0.7],['2+1',1],['3+1',1.3],['4+1',1.6]],def:1},
  konsept:{n:'Konsept',o:[['Oda-kahvaltı',0.9],['Yarım pansiyon',1],['Her şey dahil',1.2],['Ultra lüks',1.45]],def:1},
  boy:{n:'Birim büyüklüğü',o:[['Küçük',0.75],['Orta',1],['Büyük',1.4]],def:1},
};
const AMEN=[
  {id:'otopark',n:'Kapalı otopark',c:0.04,v:0.05},{id:'havuz',n:'Yüzme havuzu',c:0.05,v:0.065},
  {id:'spor',n:'Spor salonu',c:0.02,v:0.03},{id:'cocuk',n:'Çocuk parkı',c:0.01,v:0.018},
  {id:'guv',n:'7/24 güvenlik',c:0.015,v:0.025},{id:'peyzaj',n:'Peyzaj ve süs havuzu',c:0.02,v:0.028},
  {id:'gunes',n:'Güneş paneli',c:0.03,v:0.02},{id:'akilli',n:'Akıllı ev sistemi',c:0.025,v:0.035},
];
function emsalOf(key,slot){const h=hash(key+'#'+slot);return [1.2,1.5,1.8,2.0,2.5,3.0][h%6]}
function cepheOf(key,slot,size){const h=hash('c'+key+slot);return Math.round(Math.sqrt(size)*(0.7+(h%50)/100))}
function plotEmsal(p){return p.key!=null&&p.slot!=null?emsalOf(p.key,p.slot):2}
let dz=null;
function dzCalc(){
  const p=S.plots.find(x=>x.id===dz.pid),t=TYPE[dz.tid],R=DZ[dz.tid]||{b0:1,bmax:1,f0:1,fmin:1,fmax:1};
  const k=(dz.b/R.b0)*(dz.f/R.f0);
  const o=R.opt?OPTS[R.opt].o[dz.o][1]:1;
  const kmax=Math.max(1,p.size*plotEmsal(p)/(t.min*1.5));
  let ac=0,av=0;AMEN.forEach(a=>{if(dz.am[a.id]){ac+=a.c;av+=a.v}});
  const costMult=k*(R.opt==='plan'||R.opt==='konsept'?(0.85+0.15*o):1)*(1+ac);
  const plan=costPlan(dz.tid,p.city,dz.q);const cash=Math.round(plan.cash*costMult),base=plan.base*costMult;
  let units=t.units>1?(R.each?dz.b:Math.round(t.units*k/(R.opt==='plan'||R.opt==='boy'?o:1))):1;units=clamp(units,1,240);
  const vm=(R.opt?o*(1+0.04*dz.o):1)*(1+av);
  const archB=1+0.03*S.staff.arch,land=fairLand(p.city,p.size,p.dm)/S.idx[p.city];
  const unitBase=(land+base)/units*t.margin*CITY[p.city].dem*archB*QUAL[dz.q].val*(0.92+Math.min(p.size/t.min,2)*0.08)*(1+av)*(R.opt==='konsept'?(0.6+0.4*o):1)*(R.opt==='plan'?(1+0.04*dz.o):1);
  const days=Math.round(t.days*QUAL[dz.q].days*Math.sqrt(Math.max(0.5,k))*10)/10;
  const total=unitBase*units*S.idx[p.city];
  const why=level()<t.lvl?`Seviye ${t.lvl} gerekir`:p.size<t.min?`En az ${m2(t.min)} arsa gerekir`:(t.coast&&!CITY[p.city].sc.sea)?'Sadece deniz kenarı şehirlerde':k>kmax+1e-9?`İmar sınırı aşıldı (emsal ${plotEmsal(p).toLocaleString('tr-TR')})`:p.owners&&units<=p.owners?'Hak sahiplerine yetecek daire yok':S.money<cash?'Bütçe yetersiz':'';
  return {p,t,R,k,kmax,cash,base,units,unitBase,days,total,why,vm,use:plan.use,ac,useMult:costMult};
}
function buildSheet(pid,tid){
  const p=S.plots.find(x=>x.id===pid);if(!p)return;
  const ok=TYPES.filter(t=>level()>=t.lvl&&p.size>=t.min&&(!t.coast||CITY[p.city].sc.sea));
  tid=tid||(dz&&dz.pid===pid&&dz.tid)||(ok.find(t=>t.id==='apt')||ok[0]||TYPES[0]).id;
  const R=DZ[tid]||{b0:1,bmax:1,f0:1,fmin:1,fmax:1};
  if(!dz||dz.pid!==pid||dz.tid!==tid)dz={pid,tid,q:dz&&dz.pid===pid?dz.q:selQ,b:R.b0,f:R.f0,o:R.opt?OPTS[R.opt].def:0,am:dz&&dz.pid===pid?dz.am:{},step:1};
  const c=dzCalc();
  const slider=(key,label,min,max,val)=>min>=max?'':`<label class="sl"><span class="row"><span class="grow">${label}</span><b class="num" id="dzv-${key}">${val}</b></span><input type="range" min="${min}" max="${max}" step="1" value="${val}" data-dz="${key}"></label>`;
  const tabs=TYPES.map(t=>{const lock=level()<t.lvl||p.size<t.min||(t.coast&&!CITY[p.city].sc.sea);return `<button data-act="dztype" data-id="${t.id}" aria-pressed="${t.id===tid}" ${lock?'class="lock"':''}>${t.n.replace('Alışveriş Merkezi','AVM').replace('Ofis Plazası','Plaza')}${lock?` <small>${level()<t.lvl?'Sv.'+t.lvl:m2(t.min)}</small>`:''}</button>`}).join('');
  const step1=`
   <div class="dzgrid"><div><canvas id="dzcv" width="300" height="170" aria-label="Proje önizleme"></canvas>
    <div class="card" style="margin-top:8px"><div class="row meta"><span id="dzsum">${dzSum(c)}</span><span class="pill g">İş makineleri −%${Math.round(vehSpeed()*100)} süre</span></div>
    <div class="stat"><span>Toplam yatırım</span><b class="num" id="dzcost" style="font-size:18px">${fmt(c.cash)}</b></div>
    <div class="stat"><span>Tahmini satış değeri</span><b class="num" id="dzval">${fmt(c.total)}</b></div></div></div>
   <div class="card">
    ${slider('b',R.bn||'Blok sayısı',R.bmin||1,R.bmax,dz.b)}
    ${slider('f',R.fn||'Kat sayısı',R.fmin,R.fmax,dz.f)}
    ${R.opt?`<div class="meta">${OPTS[R.opt].n}</div><div class="seg" style="grid-template-columns:repeat(${OPTS[R.opt].o.length},1fr)">${OPTS[R.opt].o.map(([n],i)=>`<button data-act="dzopt" data-id="${i}" aria-pressed="${dz.o===i}">${n}</button>`).join('')}</div>`:''}
    <div class="meta">Malzeme</div><div class="seg">${Object.entries(QUAL).map(([k,q])=>`<button data-act="dzq" data-id="${k}" aria-pressed="${dz.q===k}">${q.n}</button>`).join('')}</div>
    <p class="meta" id="dzhint">${TYPE[tid].n}: arsa ${m2(p.size)}, emsal ${plotEmsal(p).toLocaleString('tr-TR')}. Büyüdükçe arsa maliyeti daha çok birime bölünür.</p>
    <p class="warn" id="dzwarn" ${c.why?'':'hidden'}>${c.why}</p>
    <button class="btn primary big" data-act="dzstep" data-id="2" id="dzgo" ${c.why&&!/Bütçe/.test(c.why)?'disabled':''}>Sosyal donatıları seç ›</button></div></div>`;
  const step2=`
   <p class="hint">Donatılar maliyeti biraz artırır ama birim değerini ve satış hızını yükseltir.</p>
   <div class="amen">${AMEN.map(a=>`<button data-act="dzam" data-id="${a.id}" aria-pressed="${!!dz.am[a.id]}"><b>${a.n}</b><span class="meta">maliyet +%${(a.c*100).toLocaleString('tr-TR')} · değer +%${(a.v*100).toLocaleString('tr-TR')}</span></button>`).join('')}</div>
   <div class="card"><div class="stat"><span>${dzSum(c)}</span><b class="num">${c.days} gün</b></div>
    <div class="stat"><span>Toplam yatırım</span><b class="num" style="font-size:18px">${fmt(c.cash)}</b></div>
    <div class="stat"><span>Tahmini satış değeri</span><b class="num">${fmt(c.total)}</b></div>
    <div class="stat"><span>Beklenen kâr</span><b class="num" style="color:${c.total-c.cash-(p.paid||0)>0?'var(--good)':'var(--bad)'}">${fmt(c.total-c.cash-(p.paid||0))}</b></div>
    ${c.why?`<p class="warn">${c.why}</p>`:''}
    <div class="row"><button class="btn" data-act="dzstep" data-id="1">‹ Tasarıma dön</button>
    ${c.why==='Bütçe yetersiz'?`<button class="btn" data-act="gotab" data-id="bank">Bankaya git</button>`:''}
    <button class="btn primary grow" data-act="dzgo" ${c.why?'disabled':''}>İnşaata başla</button></div></div>`;
  openSheet(`<div class="row"><h2 class="grow">Proje tasarla</h2><span class="meta">${CITY[p.city].n}${p.di!=null?' · '+CITY[p.city].d[p.di][0]:''} · ${m2(p.size)}</span></div>
   <div class="typetabs">${tabs}</div>${dz.step===1?step1:step2}`);
  if(dz.step===1)dzDraw();
}
function dzSum(c){return `${c.units} ${c.t.uname} · ${dz.b>1||c.R.bmax>1?dz.b+' '+(c.R.each?'villa':'blok')+' · ':''}${c.R.fmax>1?dz.f+' kat · ':''}${c.days} gün`}
function dzDraw(){
  const cv=$('#dzcv');if(!cv)return;const ctx=cv.getContext('2d');const W=300,H=170;cv.width=W*2;cv.height=H*2;ctx.setTransform(2,0,0,2,0,0);
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#ffb27a');g.addColorStop(0.55,'#ffd9b0');g.addColorStop(1,'#bfe3d6');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(40,90,80,.35)';for(let i=0;i<9;i++){const h=30+((i*37)%45);ctx.fillRect(i*36-6,H-18-h,26,h)}
  ctx.fillStyle='#5b8f63';ctx.fillRect(0,H-18,W,18);ctx.fillStyle='#3b4148';ctx.fillRect(0,H-8,W,8);
  const R=DZ[dz.tid]||{b0:1};const n=R.each?Math.min(dz.b,6):Math.min(dz.b,4);
  const fb=i=>({id:'dz'+dz.pid+i,type:dz.tid,q:dz.q,done:true,prog:1,fl:dz.f});
  const sp=spec(fb(0));const tw=n*(sp.W+10);const s=Math.min((W-20)/tw,(H-34)/(sp.h+30),1.6);
  ctx.save();ctx.translate((W-tw*s)/2,H-18);ctx.scale(s,s);for(let i=0;i<n;i++)drawBuilding(ctx,fb(i),i*(sp.W+10),0,0,800,{sc:{},tour:0});ctx.restore();
}
function dzLive(){
  const c=dzCalc();const set=(id,v)=>{const e=$('#'+id);if(e)e.textContent=v};
  set('dzcost',fmt(c.cash));set('dzval',fmt(c.total));set('dzsum',dzSum(c));set('dzv-b',dz.b);set('dzv-f',dz.f);
  const w=$('#dzwarn');if(w){w.hidden=!c.why;w.textContent=c.why}
  const go=$('#dzgo');if(go)go.disabled=!!(c.why&&!/Bütçe/.test(c.why));dzDraw();
}
document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.dz;if(!k||!dz)return;dz[k]=+e.target.value;dzLive()});
function startDesign(){
  const c=dzCalc();if(c.why){toast(c.why,'bad');return}
  const p=c.p,t=c.t;if(!spend(c.cash))return;
  MAT.forEach(m=>S.mat.stock[m.id]=Math.max(0,S.mat.stock[m.id]-c.use[m.id]*Math.min(1,c.useMult)));
  const units=Array(c.units).fill('empty');if(p.owners)for(let i=0;i<p.owners;i++)units[i]='owner';
  const am=Object.keys(dz.am).filter(k=>dz.am[k]);
  S.bld.push({id:p.id,city:p.city,di:p.di,key:p.key,slot:p.slot,dm:p.dm,type:t.id,q:dz.q,size:p.size,base:c.unitBase,units,invest:c.cash+(p.paid||0),prog:0,done:false,rr:1,cond:100,
    renewal:p.renewal||null,name:p.renewal?p.renewal.replace('Apartmanı','Konakları'):genName(t),k:c.k,fl:dz.f,bl:dz.b,opt:dz.o,am,dd:c.days,sp:1+am.length*0.04});
  S.plots=S.plots.filter(x=>x!==p);S.view=p.city;selQ=dz.q;
  log(`${CITY[p.city].n}: ${t.n} inşaatı başladı, ${c.units} ${t.uname}, ${fmt(c.cash)}.`);sfx('build');vib([30,60,30]);
  toast(t.n+' inşaatı başladı!','good');dz=null;closeSheet();go('home');
}

// ---------- ana ekran paneli
function homeDash(){
  const doing=S.bld.filter(b=>!b.done);const h=(S.hist||[]).concat([S.money]);
  const net=dailyNet(),rent=dailyRent(),biz=bizDaily(),sal=dailySalary();
  const offers=(S.offers||[]).length,jobs=(S.jobs||[]).length;
  return `<div class="card dash"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><div class="grow" style="min-width:0">
      <div class="k">KASA</div><div class="bigcash num">${fmt(S.money)}</div>
      <div class="meta">${net>=0?'▲':'▼'} günlük net ${fmt(net)} · servet ${fmt(worth())}</div></div>
      <div class="chart">${spark(h.slice(-30),118,46)}<div class="meta" style="text-align:right">son ${Math.min(30,h.length)} gün</div></div></div>
    <div class="grid4"><div><span class="k">Borç</span><b class="num ${debt()?'neg':''}">${fmt(debt())}</b></div><div><span class="k">Kira/gün</span><b class="num pos">+${fmt(rent)}</b></div>
     <div><span class="k">İşletme/gün</span><b class="num pos">+${fmt(biz)}</b></div><div><span class="k">Maaş/gün</span><b class="num neg">−${fmt(sal)}</b></div></div></div>
   <div class="row"><h3 class="grow">Devam eden projeler · ${doing.length}</h3><button class="link" data-act="gotab" data-id="proj">Tümü ›</button></div>
   <div class="hscroll">${doing.slice(0,8).map(b=>{const days=b.kamu?b.days:(b.dd||TYPE[b.type].days);const sp=speed(b.city)||1;
     return `<button class="pcard" data-act="gotab" data-id="proj"><img src="${bThumb(b.type,b.prog,b.q,96,b.kind)}" alt="" width="96" height="64"><span class="pill y">Şantiye</span>
      <b>${esc(b.name)}</b><span class="meta">${CITY[b.city].n}${b.di!=null&&!b.kamu?' · '+CITY[b.city].d[b.di][0]:''}</span>
      <span class="prog" style="height:5px"><i style="width:${b.prog*100}%;animation:none"></i></span><span class="meta num">%${Math.floor(b.prog*100)} · ${Math.max(1,Math.ceil((1-b.prog)*days/sp))} gün kaldı</span></button>`}).join('')}
    <button class="pcard new" data-act="gotab" data-id="land"><span class="plus">+</span><b>Yeni proje</b><span class="meta">Arsa seç</span></button></div>
   <div class="quick">
    <button data-act="wheel"><i style="background:#c56cf0">✦</i><b>Şans çarkı</b><span>${S.daily.spun!==today()?'Hazır!':'Yarın tekrar'}</span></button>
    <button data-act="xptab" data-id="offers"><i style="background:var(--accent)">✉</i><b>Teklifler</b><span>${offers?offers+' bekleyen teklif':'Yeni teklif yok'}</span></button>
    <button data-act="xptab" data-id="jobs"><i style="background:#3cb4a0">⚒</i><b>Sözleşmeli işler</b><span>${jobs?jobs+' iş sürüyor':'Aktif iş yok'}</span></button>
    <button data-act="gotab" data-id="auction"><i style="background:#e0a03a">⚖</i><b>İhaleler</b><span>${(S.auction?1:0)+S.kamu.length} açık ihale</span></button>
    <button data-act="gotab" data-id="bank"><i style="background:#4aa3df">₺</i><b>Banka</b><span>Kredi puanı ${score()}</span></button>
    <button data-act="gotab" data-id="borsa"><i style="background:#5fd69c">↗</i><b>Borsa</b><span>Portföy ${fmt(mktValue())}</span></button>
    <button data-act="gocorp" data-id="staff"><i style="background:#8f7cf0">☺</i><b>Personel</b><span>${staffCount()} kişi</span></button>
    <button data-act="gocorp" data-id="lux"><i style="background:#ff5c74">♛</i><b>Koleksiyon</b><span>Prestij ${prestige()}</span></button>
   </div>
   <button class="btn primary big explore" data-act="gotab" data-id="land"><span><small>${CITY[S.view]?CITY[S.view].n.toLocaleUpperCase('tr-TR'):'İSTANBUL'} HARİTASI</small>Arsaları keşfet</span><span>›</span></button>`;
}

// ---------- ilçe haritası
const IST_POS={Esenyurt:[52,104],Başakşehir:[96,70],Beylikdüzü:[34,144],Pendik:[360,150],Maltepe:[322,140],Ümraniye:[296,64],Üsküdar:[262,92],Ataşehir:[306,104],Bakırköy:[118,148],Kadıköy:[262,136],Şişli:[160,96],Sarıyer:[190,40],Beşiktaş:[204,118]};
function distPos(cid,i,n){
  const dn=CITY[cid].d[i][0];if(cid==='istanbul'&&IST_POS[dn])return IST_POS[dn];
  const r=mulberry(hash(cid+dn));const cols=Math.ceil(Math.sqrt(n*1.8)),rows=Math.ceil(n/cols);
  const cx=i%cols,cy=Math.floor(i/cols);return [40+cx*(320/Math.max(1,cols-1||1))+r()*18-9,34+cy*(130/Math.max(1,rows-1||1))+r()*16-8];
}
function tierOf(dm){return dm>=1.6?['Lüks','#ff5c74']:dm>=1.1?['Premium','#ff9f43']:dm>=0.75?['Orta','#3cc6a8']:['Ekonomik','#7fb2ff']}
function distMap(cid){
  const c=CITY[cid],n=c.d.length;
  const sea=cid==='istanbul'?`<path d="M0 182 C80 170 140 176 200 162 C226 150 222 120 226 96 C230 70 216 40 226 0 L400 0 L400 0 L242 0 C238 40 246 72 240 100 C236 130 250 150 280 166 C330 186 370 178 400 184 L400 220 L0 220Z" fill="#1d6f8a" opacity=".85"/><path d="M226 0 C216 40 230 70 226 96 C222 120 226 150 200 162" stroke="#7fd3ea" stroke-width="1" fill="none" opacity=".5"/><text x="300" y="206" class="mapl">MARMARA DENİZİ</text><text x="300" y="16" class="mapl">KARADENİZ</text>`
    :c.sc&&c.sc.sea?`<path d="M0 196 C100 182 200 200 300 186 C350 180 380 190 400 186 L400 220 L0 220Z" fill="#1d6f8a" opacity=".85"/>`:'';
  const nodes=c.d.map(([dn,dm],i)=>{const [x,y]=distPos(cid,i,n);const [,col]=tierOf(dm);const mine=S.plots.filter(p=>p.city===cid&&p.di===i).length+S.bld.filter(b=>b.city===cid&&b.di===i).length;
    return `<g class="mnode" data-act="dist" data-id="${i}" role="button" tabindex="0" aria-label="${dn}"><circle cx="${x}" cy="${y}" r="${mine?15:12}" fill="${col}" stroke="#fff" stroke-width="${mine?3:1.5}"/>
     <text x="${x}" y="${y+4}" text-anchor="middle" class="mapn">${freeCount(cid,i)}</text><text x="${x}" y="${y+(y>190?-18:27)}" text-anchor="middle" class="mapt">${dn}</text></g>`}).join('');
  return `<div class="map"><svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid meet" role="group" aria-label="${c.n} ilçe haritası">
    <defs><pattern id="mg" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,.05)"/></pattern></defs>
    <rect width="400" height="220" fill="#2f5e4c"/><rect width="400" height="220" fill="url(#mg)"/>${sea}${nodes}</svg>
    <div class="legend">${[['Lüks','#ff5c74'],['Premium','#ff9f43'],['Orta','#3cc6a8'],['Ekonomik','#7fb2ff']].map(([n,c])=>`<span><i style="background:${c}"></i>${n}</span>`).join('')}<span class="meta">Daire içi: boş parsel</span></div></div>`;
}
viewCity=(o=>function(cid){
  const h=o(cid);if(curDist!=null||(CITY[cid].abroad&&!S.branches[cid]))return h;
  return h.replace(/<img src="[^"]*" alt="" style="width:100%;border-radius:6px;max-height:110px;object-fit:cover">/,distMap(cid));
})(viewCity);
viewDistrict=(o=>function(cid,di){
  return o(cid,di).replace(/<span class="num">([^<]*)<\/span>/g,(m,a)=>m).replace(/data-act="parcel" data-id="(\d+)"([^>]*)><span class="pn">(\d+)<\/span>/g,(m,i,rest,pn)=>`data-act="parcel" data-id="${i}"${rest}><span class="pn">${pn}</span><span class="em">E ${emsalOf(dkey(cid,di),+i).toLocaleString('tr-TR')}</span>`);
})(viewDistrict);
parcelSheet=(o=>function(cid,di,slot){
  o(cid,di,slot);const pc=getDist(cid,di).p[slot];const sh=$('#sheet .sheet');if(!sh||$('#sheet').hidden||!sh.querySelector('[data-act="buyparcel"]'))return;
  const k=dkey(cid,di);const first=sh.querySelector('.card');
  if(first)first.insertAdjacentHTML('beforeend',`<div class="stat"><span>Emsal</span><b class="num">${emsalOf(k,slot).toLocaleString('tr-TR')}</b></div><div class="stat"><span>Cephe</span><b class="num">${cepheOf(k,slot,pc.s)} m</b></div><div class="stat"><span>İnşaat alanı</span><b class="num">${m2(Math.round(pc.s*emsalOf(k,slot)))}</b></div>`);
})(parcelSheet);

// ---------- özel siparişler (teklif + pazarlık)
const CLIENTS=[['Lumen Estates','Lyon, Fransa'],['Nordhavn Capital','Kopenhag, Danimarka'],['Atlas Properties','Kazablanka, Fas'],['Sahra Investments','Doha, Katar'],['Kervan Holding','Ankara'],
  ['Orion Development','Rotterdam, Hollanda'],['Delta Gayrimenkul','İzmir'],['Anka Grup','Bakü, Azerbaycan'],['Volga Partners','Kazan, Rusya'],['Sultana Resorts','Antalya'],['Rhein Bau AG','Köln, Almanya'],['Tiflis Yatırım','Tiflis, Gürcistan'],['Kuzey Liman A.Ş.','Samsun'],['Gulfstar Realty','Abu Dabi, BAE']];
const JOBS=[['Lüks rezidans kulesi','rez'],['Butik otel','otel'],['Sahil villaları','villa'],['Konut sitesi','site'],['İş merkezi','ofis'],['Alışveriş merkezi','avm'],['Lojistik merkezi','depo'],['Öğrenci yurdu','yurt'],['Hastane','hastane'],['Köprü','kopru'],['Fabrika','fabrika'],['Apartman','apt'],['Müstakil ev','ev'],['Gökdelen','kule'],['Marina','marina']];
function genOffer(){
  const L=level();const pool=JOBS.filter(([,t])=>t==='kopru'?L>=5:TYPE[t].lvl<=L+1);const [nm,tid]=pick(pool);const [cl,from]=pick(CLIENTS);
  const cost=Math.round((tid==='kopru'?600e6:TYPE[tid].cost)*rnd(0.8,1.5)*(1+L*0.04)/1e5)*1e5;
  const price=Math.round(cost*rnd(1.12,1.32)/1e5)*1e5;
  return {id:uid(),nm,tid:tid==='kopru'?'kule':tid,bridge:tid==='kopru',cl,from,cost,price,max:Math.round(price*rnd(1.04,1.28)),ask:price,days:Math.round((tid==='kopru'?30:TYPE[tid].days)*rnd(1.1,1.8)),pat:3,exp:S.day+6,abroad:/,/.test(from)};
}
function offerSheet(id){
  const o=S.offers.find(x=>x.id===id);if(!o)return;
  const step=Math.round(o.price*0.05/1e5)*1e5||1e5;
  openSheet(`<div class="offer"><div class="ofimg"><img src="${bThumb(o.tid,1,'lux',160)}" alt="" width="160" height="160">${o.abroad?'<span class="pill b">Yurt dışı</span>':''}</div>
   <div class="grow" style="min-width:0;display:flex;flex-direction:column;gap:8px">
    <div class="row"><span class="logo-c">${o.cl.split(' ').map(w=>w[0]).join('').slice(0,2)}</span><div class="grow"><b>${o.cl}</b><div class="meta">${o.from}</div></div>
     <span class="pat" aria-label="Sabır ${o.pat}/3">${[0,1,2].map(i=>`<i class="${i<o.pat?'on':''}"></i>`).join('')}</span></div>
    <h2>${o.nm}</h2>
    <div class="grid3"><div class="tile"><div class="k">Teklif</div><div class="v">${fmt(o.price)}</div></div><div class="tile"><div class="k">Maliyet</div><div class="v">${fmt(o.cost)}</div></div><div class="tile"><div class="k">Süre</div><div class="v">${o.days} gün</div></div></div>
    <p class="meta">Maliyeti sen karşılarsın, iş bitince müşteri bedeli öder. Karşı teklifin çok yüksekse müşterinin sabrı azalır, üç kez sabrı biterse vazgeçer.</p>
    <div class="row ctr"><button class="btn" data-act="xoff" data-id="${o.id}" data-v="-${step}" aria-label="Azalt">−</button><div class="grow" style="text-align:center"><div class="meta">Karşı teklifin</div><b class="num" style="font-size:20px">${fmt(o.ask)}</b><div class="meta">Kârın ≈ <span style="color:var(--good)">${fmt(o.ask-o.cost)}</span></div></div><button class="btn" data-act="xoff" data-id="${o.id}" data-v="${step}" aria-label="Artır">+</button></div>
    <div class="row"><button class="btn bad" data-act="xrej" data-id="${o.id}">Reddet</button><button class="btn" data-act="xcounter" data-id="${o.id}" ${o.ask<=o.price?'disabled':''}>Karşı teklif</button><button class="btn primary grow" data-act="xacc" data-id="${o.id}">Kabul et · ${fmt(o.price)}</button></div>
   </div></div>`);
}
function counterOffer(id){
  const o=S.offers.find(x=>x.id===id);if(!o)return;
  if(o.ask<=o.max&&Math.random()<1-(o.ask-o.price)/(o.max-o.price+1)*0.35){o.price=o.ask;sfx('coin');toast(`${o.cl} karşı teklifini kabul etti: ${fmt(o.ask)}`,'good');offerSheet(id);return}
  o.pat--;
  if(o.pat<=0){S.offers=S.offers.filter(x=>x!==o);sfx('alarm');closeSheet();showEvent('Müşteri vazgeçti',`${o.cl}, pazarlık uzayınca ${o.nm.toLowerCase()} işini başka firmaya verdi.`,true);render();return}
  const np=Math.round(Math.min(o.max,o.price+(o.ask-o.price)*rnd(0.25,0.5))/1e5)*1e5;o.price=Math.max(o.price,np);o.ask=Math.max(o.ask,o.price);sfx('tap');toast(`${o.cl} ${fmt(o.price)} teklif etti. Sabrı azalıyor.`);offerSheet(id);
}
function acceptOffer(id){
  const o=S.offers.find(x=>x.id===id);if(!o)return;if(!spend(o.cost))return;
  S.offers=S.offers.filter(x=>x!==o);S.jobs.push({id:o.id,nm:o.nm,tid:o.tid,cl:o.cl,from:o.from,price:o.price,cost:o.cost,days:o.days,prog:0,bridge:o.bridge});
  log(`${o.cl} ile ${o.nm} sözleşmesi imzalandı (${fmt(o.price)}).`);sfx('gavel');vib(30);toast('Sözleşme imzalandı! Şantiye kuruldu.','good');closeSheet();ptab='jobs';go('proj');
}
function jobsTick(dt){
  (S.jobs||[]).forEach(j=>{j.prog+=dt/DAY_MS*(speed('istanbul')||0)/j.days});
  const done=S.jobs.filter(j=>j.prog>=1);if(!done.length)return;
  S.jobs=S.jobs.filter(j=>j.prog<1);
  done.forEach(j=>{S.money+=j.price;gainXp(j.price/3e6);S.stats.jobs=(S.stats.jobs||0)+1;log(`${j.nm} ${j.cl}'a teslim edildi: +${fmt(j.price)}.`);
    popup(()=>openSheet(`<div class="donepop"><img src="${bThumb(j.tid,1,'lux',120)}" alt="" width="120" height="120"><div><span class="pill g">Teslim edildi</span><h2>${j.nm}</h2><p class="hint">${j.cl} (${j.from}) işi teslim aldı ve ${fmt(j.price)} ödedi. Net kârın ${fmt(j.price-j.cost)}.</p><button class="btn primary big" data-act="close">Tamam</button></div></div>`));
    sfx('reward');});
}
function popup(f){if($('#sheet').hidden&&started)f();else queue.push(f)}

// ---------- proje sekmesi: alt sekmeler, filtre, deprem güçlendirme
let ptab='mine',pfil='all';
function reinfCost(b){return Math.round(unitValue(b)*Math.max(1,b.units.length)*0.025)}
function atRisk(){return S.bld.filter(b=>b.done&&!b.kamu&&!b.reinf&&b.units.some(u=>u!=='sold'))}
viewProj=(o=>function(){
  const offers=S.offers||[],jobs=S.jobs||[];
  const tabs=`<div class="subtabs" role="group" aria-label="Proje bölümleri">${[['mine','Projelerim · '+S.bld.length],['offers','Teklifler · '+offers.length],['jobs','Sözleşmeli işler · '+jobs.length]].map(([k,n])=>`<button data-act="xptab" data-id="${k}" aria-pressed="${ptab===k}">${n}</button>`).join('')}</div>`;
  if(ptab==='offers')return `<h2>Teklifler</h2>${tabs}<p class="hint">Yurt içi ve yurt dışı müşteriler senden proje istiyor. Pazarlık et, kabul et, inşa edip teslim et.</p>
    ${offers.length?offers.map(x=>`<button class="card oc" data-act="xoffer" data-id="${x.id}"><img src="${bThumb(x.tid,1,'lux',72)}" alt="" width="72" height="72"><div class="grow" style="min-width:0;text-align:left">
     <div class="row"><b class="grow">${x.nm}</b>${x.abroad?'<span class="pill b">Yurt dışı</span>':''}</div><div class="meta">${x.cl} · ${x.from}</div>
     <div class="row meta"><span>Teklif <b class="num" style="color:var(--fg)">${fmt(x.price)}</b></span><span>Maliyet ${fmt(x.cost)}</span><span>${x.days} gün</span><span>${Math.max(0,x.exp-S.day)} gün geçerli</span></div></div></button>`).join('')
     :'<div class="empty">Şu an bekleyen teklif yok. Seviye atladıkça ve şirketin büyüdükçe daha büyük teklifler gelir.</div>'}`;
  if(ptab==='jobs')return `<h2>Sözleşmeli işler</h2>${tabs}
    ${jobs.length?jobs.map(j=>{const sp=speed('istanbul');return `<div class="card bld"><img src="${bThumb(j.tid,j.prog,'lux',72)}" width="72" height="72" alt=""><div style="min-width:0;display:flex;flex-direction:column;gap:6px">
     <div class="title">${j.nm}</div><div class="meta">${j.cl} · ${j.from} · teslimde ${fmt(j.price)}</div><div class="prog"><i style="width:${j.prog*100}%"></i></div>
     <div class="meta num">%${Math.floor(j.prog*100)} · ${sp>0?Math.ceil((1-j.prog)*j.days/sp)+' gün kaldı':'durdu'}</div></div></div>`}).join('')
     :'<div class="empty">Aktif sözleşmeli iş yok. Teklifler sekmesinden iş al.</div>'}`;
  let h=o();
  const risk=atRisk();
  const banner=risk.length?`<div class="news quake"><b>Deprem riski:</b> ${risk.length} bina güçlendirilmedi. Depremde hasar görebilirler. <button class="btn small primary" data-act="xreinfall">Hepsini güçlendir · ${fmt(risk.reduce((a,b)=>a+reinfCost(b),0))}</button></div>`:'';
  const cnt={all:S.bld.length,doing:S.bld.filter(b=>!b.done).length,sale:S.bld.filter(b=>b.units.includes('listing')).length,rent:S.bld.filter(b=>b.units.includes('rented')).length,done:S.bld.filter(b=>b.done).length};
  const fil=`<div class="chips2">${[['all','Tümü'],['doing','İnşaatta'],['sale','Satışta'],['rent','Kirada'],['done','Bitti']].map(([k,n])=>`<button data-act="xpfil" data-id="${k}" aria-pressed="${pfil===k}">${n} · ${cnt[k]}</button>`).join('')}</div>`;
  h=h.replace('<h2>Projeler</h2>',`<h2>Projeler</h2>${tabs}${banner}${S.bld.length?fil:''}`);
  if(pfil!=='all'){const keep=new Set(S.bld.filter(b=>pfil==='doing'?!b.done:pfil==='sale'?b.units.includes('listing'):pfil==='rent'?b.units.includes('rented'):b.done).map(b=>b.id));
    const doc=document.createElement('div');doc.innerHTML=h;doc.querySelectorAll('.card.bld').forEach(c=>{if(!keep.has(c.id.slice(2)))c.remove()});h=doc.innerHTML}
  // güçlendir düğmesi
  return h.replace(/<div class="card bld" id="b-([^"]+)">/g,(m,id)=>{const b=S.bld.find(x=>x.id===id);if(!b||!b.done||b.kamu)return m;
    return m+(b.reinf?'<span class="pill g reinf">Depreme dayanıklı</span>':`<button class="btn small reinf" data-act="xreinf" data-id="${id}">Güçlendir · ${fmt(reinfCost(b))}</button>`)});
})(viewProj);
function reinforce(list){const c=list.reduce((a,b)=>a+reinfCost(b),0);if(!list.length||!spend(c))return;list.forEach(b=>{b.reinf=true;b.cond=Math.min(100,b.cond+10)});sfx('build');toast(`${list.length} bina güçlendirildi.`,'good');render()}
function quake(){
  const cities=[...new Set(S.bld.filter(b=>b.done&&!b.kamu).map(b=>b.city))];if(!cities.length)return;
  const cid=pick(cities),mag=rnd(5.2,6.6).toFixed(1);const hitB=S.bld.filter(b=>b.city===cid&&b.done&&!b.kamu&&!b.reinf);
  let dmg=0;hitB.forEach(b=>{b.cond=Math.max(0,b.cond-rnd(25,50));dmg+=unitValue(b)*b.units.filter(u=>u!=='sold').length*0.04});
  S.idx[cid]=clamp(S.idx[cid]*0.95,0.75,1.45);sfx('thunder');vib([200,80,200]);
  if(dmg>0)hit(Math.round(dmg),`${CITY[cid].n}'da ${mag} deprem`,`Güçlendirilmemiş ${hitB.length} binan hasar gördü, bakım düzeyleri düştü.`);
  else showEvent(`${CITY[cid].n}'da ${mag} deprem`,'Bütün binaların güçlendirilmişti, hiçbiri hasar görmedi. Şirketinin itibarı arttı.',false,true);
}

// ---------- borsa
const MK=[
 // id, ad, tür, sektör, başlangıç fiyatı, günlük oynaklık, günlük eğilim
 ['KRTAS','Kartaş Çimento','hisse','İnşaat',42,0.024,0.0008],['DMRCL','Demirçelik','hisse','Sanayi',118,0.026,0.0006],['YPKRD','Yapı Kredi Tuğla','hisse','İnşaat',16,0.03,0.0007],
 ['ILGZB','Ilgaz Bank','hisse','Banka',31,0.022,0.0005],['TRSKT','Toros Katılım','hisse','Banka',12.4,0.02,0.0005],['BGZHV','Boğaz Havayolları','hisse','Ulaşım',264,0.028,0.0008],
 ['SFRMR','Sefer Market','hisse','Perakende',74,0.018,0.0006],['TLKNT','Telkonet','hisse','Teknoloji',57,0.03,0.001],['YZLMT','Yazılım Teknik','hisse','Teknoloji',190,0.035,0.0012],
 ['EGEEN','Ege Enerji','hisse','Enerji',9.8,0.027,0.0007],['PETRA','Petra Rafineri','hisse','Enerji',330,0.024,0.0006],['MRGYO','Marmara GYO','hisse','GYO',7.3,0.025,0.0007],
 ['TKSTB','Tekstil Birlik','hisse','Sanayi',26,0.022,0.0004],['GDAYM','Gıda Yemek','hisse','Gıda',48,0.017,0.0006],['SGRTG','Güven Sigorta','hisse','Sigorta',54,0.019,0.0006],
 ['AKDTR','Akdeniz Turizm','hisse','Turizm',88,0.026,0.0008],['MDNAU','Maden Altın','hisse','Madencilik',37,0.03,0.0008],['OTMTV','Otomotiv Anadolu','hisse','Sanayi',142,0.023,0.0007],
 ['USD','Amerikan Doları','doviz','Döviz',34.2,0.004,0.0009],['EUR','Euro','doviz','Döviz',36.9,0.005,0.0008],['GBP','İngiliz Sterlini','doviz','Döviz',43.6,0.006,0.0008],
 ['ALTIN','Gram altın','doviz','Emtia',2950,0.009,0.0009],['GUMUS','Gram gümüş','doviz','Emtia',34,0.016,0.0008],
 ['PPF','Para Piyasası Fonu','fon','Düşük risk',1.42,0.0006,0.0011],['ALF','Altın Fonu','fon','Orta risk',7.3,0.008,0.0009],['HSF','Hisse Senedi Fonu','fon','Yüksek risk',8.3,0.016,0.0011],['EBF','Eurobond Fonu','fon','Düşük risk',3.06,0.004,0.0009],
 ['HLC','Hilal Coin','kripto','Kripto',2.1e6,0.045,0.0015],['KVN','Kervan Token','kripto','Kripto',74000,0.055,0.0015],['PRA','Pera Chain','kripto','Kripto',3100,0.07,0.0012],['KEDI','Kedi Meme','kripto','Kripto',0.42,0.11,0.001],
 ['UZYMD','Uzay Madenciliği A.Ş.','riskli','Girişim',2.55,0.09,0.0005],['DKYTR','Dikey Tarım Girişimi','riskli','Girişim',4.0,0.08,0.0005],['DRNKR','Drone Kargo','riskli','Girişim',1.63,0.09,0.0005],['BYTLB','Biyoteknoloji Lab','riskli','Girişim',6.09,0.08,0.0005],['OYNST','Meteor Oyun Stüdyosu','riskli','Girişim',6.56,0.085,0.0005],
].map(([id,n,c,sec,p,v,d])=>({id,n,c,sec,p,v,d}));
const MKK=Object.fromEntries(MK.map(m=>[m.id,m]));
const MCAT=[['hisse','Hisseler'],['doviz','Döviz & Altın'],['fon','Fonlar'],['kripto','Kripto'],['riskli','Riskli'],['port','Portföyüm'],['arz','Halka arz']];
let msub='hisse',msort='az';
function mktInit(){
  S.mkt=S.mkt||{};S.port=S.port||{};
  MK.forEach(m=>{if(S.mkt[m.id])return;let p=m.p;const h=[];for(let i=0;i<30;i++){h.unshift(p);p=p/Math.exp(m.d+m.v*gauss())}S.mkt[m.id]={p:m.p,h}});
}
function mktStep(frac){MK.forEach(m=>{const s=S.mkt[m.id];s.p=Math.max(m.c==='kripto'?1e-4:0.01,s.p*Math.exp(m.d*frac+m.v*Math.sqrt(frac)*gauss()))})}
function mktDay(){
  MK.forEach(m=>{const s=S.mkt[m.id];
    if(m.c==='riskli'){const r=Math.random();if(r<0.015){s.p*=0.1;S.mnews={d:S.day,t:`${m.n} iflasın eşiğinde: hisse %90 çöktü!`}}else if(r<0.03){s.p*=2.4;S.mnews={d:S.day,t:`${m.n} büyük yatırım aldı: hisse 2,4 katına çıktı!`}}}
    s.h.push(s.p);if(s.h.length>40)s.h.shift()});
  if(Math.random()<0.35){const secs=[...new Set(MK.filter(m=>m.c==='hisse').map(m=>m.sec))];const sec=pick(secs),x=rnd(0.03,0.08)*(Math.random()<0.5?-1:1);
    MK.filter(m=>m.sec===sec).forEach(m=>S.mkt[m.id].p*=1+x);
    const good={İnşaat:'Konut satışları rekor kırdı',Banka:'Bankalar güçlü bilanço açıkladı',Enerji:'Enerji fiyatları yükseldi',Teknoloji:'Yapay zekâ yatırımları hızlandı',Turizm:'Turist sayısı rekor kırdı',Ulaşım:'Bayram öncesi biletler tükendi'}[sec];
    S.mnews={d:S.day,t:x>0?`${good||sec+' sektöründe iyimserlik'}: ${sec} hisseleri ${pct(x)}`:`${sec} şirketlerinde kâr uyarısı: ${pct(x)}`}}
}
function chg(id){const s=S.mkt[id];const prev=s.h[s.h.length-1];return s.p/prev-1}
function mktValue(){if(!S.port)return 0;let v=0;for(const id in S.port){const m=S.mkt[id];if(m)v+=S.port[id].q*m.p}return v}
function px(p){return p>=1000?p.toLocaleString('tr-TR',{maximumFractionDigits:0})+' ₺':p>=1?p.toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2})+' ₺':p.toLocaleString('tr-TR',{maximumFractionDigits:4})+' ₺'}
function mrow(m){const s=S.mkt[m.id],c=chg(m.id),own=S.port[m.id];
  return `<button class="mrow" data-act="xmkt" data-id="${m.id}"><span class="tk"><b>${m.id}</b><span class="meta">${m.n}</span>${m.c==='hisse'?`<span class="sec">${m.sec}</span>`:''}</span>
   ${spark(s.h.slice(-20).concat([s.p]),78,26)}<span class="pr"><b class="num">${px(s.p)}</b><span class="${c>=0?'up':'down'}">${pct(c,2)}</span>${own&&own.q>0?`<span class="meta">Sende ${fmt(own.q*s.p)}</span>`:''}</span></button>`}
function viewBorsa(){
  mktInit();
  const tabs=`<div class="subtabs mtabs" role="group" aria-label="Piyasalar">${MCAT.map(([k,n])=>`<button data-act="xmsub" data-id="${k}" aria-pressed="${msub===k}">${n}</button>`).join('')}</div>`;
  const news=S.mnews?`<div class="news"><b>Piyasa haberi · Gün ${S.mnews.d}:</b> ${esc(S.mnews.t)}</div>`:'';
  const head=`<div class="row"><h2 class="grow">Borsa</h2><span class="meta">Portföy <b class="num" style="color:var(--fg)">${fmt(mktValue())}</b> · fiyatlar canlı</span></div>${tabs}${news}`;
  if(msub==='arz')return head+corpStock();
  if(msub==='port'){const ids=Object.keys(S.port).filter(id=>S.port[id].q>0&&MKK[id]);let tv=0,tc=0;ids.forEach(id=>{tv+=S.port[id].q*S.mkt[id].p;tc+=S.port[id].c});
    return head+`<div class="card"><div class="stat"><span>Toplam değer</span><b class="num">${fmt(tv)}</b></div><div class="stat"><span>Maliyet</span><b class="num">${fmt(tc)}</b></div><div class="stat"><span>Kâr / zarar</span><b class="num ${tv>=tc?'pos':'neg'}">${tv>=tc?'+':'−'}${fmt(Math.abs(tv-tc))} (${tc?pct(tv/tc-1):'%0'})</b></div></div>
     ${ids.length?`<div class="mlist">${ids.map(id=>mrow(MKK[id])).join('')}</div>`:'<div class="empty">Portföyün boş. Hisse, döviz, fon ya da kripto al.</div>'}`}
  let list=MK.filter(m=>m.c===msub);
  if(msort==='up')list=[...list].sort((a,b)=>chg(b.id)-chg(a.id));else if(msort==='down')list=[...list].sort((a,b)=>chg(a.id)-chg(b.id));
  const hint={hisse:'Hisseler şirketlerin haberleriyle oynar. Komisyon %0,2.',doviz:'Döviz ve altın yavaş ama istikrarlı yükselir. Paranı enflasyondan korur.',fon:'Fonlar profesyonelce yönetilir. Düşük riskli fonlar neredeyse her gün kazandırır.',kripto:'Kripto paralar çok oynaktır. Bir günde %20 kazandırabilir ya da kaybettirebilir.',riskli:'Girişim hisseleri: çoğu zaman kaybettirir, nadiren katlar. Şirket batarsa hisse değersizleşir.'}[msub];
  return head+`<div class="row"><p class="hint grow">${hint}</p><div class="seg" style="grid-template-columns:repeat(3,auto)">${[['az','A-Z'],['up','Yükselen'],['down','Düşen']].map(([k,n])=>`<button data-act="xmsort" data-id="${k}" aria-pressed="${msort===k}">${n}</button>`).join('')}</div></div>
   <div class="mlist">${list.map(mrow).join('')}</div>`;
}
function mktSheet(id){
  const m=MKK[id],s=S.mkt[id],own=S.port[id]||{q:0,c:0},val=own.q*s.p;
  const big=spark(s.h.concat([s.p]),300,110);
  openSheet(`<div class="row"><div class="grow"><h2>${m.id} · ${m.n}</h2><div class="meta">${m.sec}${m.c==='riskli'?' · yüksek risk':''}</div></div><div style="text-align:right"><b class="num" style="font-size:20px">${px(s.p)}</b><div class="${chg(id)>=0?'up':'down'}">${pct(chg(id),2)} bugün</div></div></div>
   <div class="bigchart">${big}<div class="row meta"><span>${s.h.length} gün önce</span><span class="grow"></span><span>Bugün</span></div></div>
   <div class="card"><div class="stat"><span>Sendeki</span><b class="num">${own.q?own.q.toLocaleString('tr-TR',{maximumFractionDigits:4}):0} adet · ${fmt(val)}</b></div>
    ${own.q?`<div class="stat"><span>Kâr / zarar</span><b class="num ${val>=own.c?'pos':'neg'}">${val>=own.c?'+':'−'}${fmt(Math.abs(val-own.c))} (${pct(val/own.c-1)})</b></div>`:''}</div>
   <div class="meta">Al</div><div class="row">${[1e6,10e6,100e6,1e9].filter(a=>a<=Math.max(1e6,S.money)).map(a=>`<button class="btn primary small" data-act="xmbuy" data-id="${id}" data-v="${a}">${fmt(a)}</button>`).join('')}<button class="btn primary small" data-act="xmbuy" data-id="${id}" data-v="q25">Kasanın %25'i</button></div>
   <div class="meta">Sat</div><div class="row">${[0.25,0.5,1].map(f=>`<button class="btn small" data-act="xmsell" data-id="${id}" data-v="${f}" ${own.q?'':'disabled'}>${f===1?'Hepsini sat':'%'+f*100+' sat'}</button>`).join('')}</div>
   <button class="btn" data-act="close">Kapat</button>`);
}
function mBuy(id,v){const s=S.mkt[id];let a=v==='q25'?Math.floor(Math.max(0,S.money)*0.25):+v;if(a<1e4){toast('Kasada yeterli para yok.','bad');return}if(!spend(a))return;
  const o=S.port[id]=S.port[id]||{q:0,c:0};o.q+=a*0.998/s.p;o.c+=a;sfx('buy');vib(15);toast(`${id}: ${fmt(a)} alındı`,'good');mktSheet(id);renderHud()}
function mSell(id,f){const s=S.mkt[id],o=S.port[id];if(!o||!o.q)return;const q=o.q*f,v=q*s.p*0.998;o.c*=1-f;o.q-=q;if(f===1||o.q<1e-9){delete S.port[id]}S.money+=v;sfx('cash');toast(`${id}: ${fmt(v)} satıldı`,'good');mktSheet(id);renderHud()}

// ---------- banka: kredi puanı, bankalar
const BANKS=[
 {id:'pusula',n:'Pusula Kredi',d:'Puan sormaz, faizi yüksek',min:0,mult:0.35,t:[[7,0.09],[20,0.22]],col:'#ff5c74'},
 {id:'ilgaz',n:'Ilgaz Bank',d:'Küçük firmalara kapısı açık',min:600,mult:0.6,t:[[12,0.08],[30,0.16],[60,0.27]],col:'#3cc6a8'},
 {id:'toros',n:'Toros Katılım',d:'Uzun vadede uygun',min:900,mult:0.9,t:[[30,0.13],[60,0.22],[120,0.38]],col:'#ff9f43'},
 {id:'kordon',n:'Kordon Finans',d:'Büyük projelere kredi',min:1150,mult:1.3,t:[[30,0.11],[60,0.19],[120,0.33]],col:'#7fb2ff'},
 {id:'zirve',n:'Zirve Yatırım Bankası',d:'Sadece en iyi puanlara',min:1450,mult:2,t:[[60,0.15],[120,0.27],[240,0.48]],col:'#b9a0f2'},
];
function score(){const c=S.credit||{ok:0,early:0,late:0,neg:0};const lev=debt()/Math.max(1,assets()+Math.max(0,S.money));
  return Math.round(clamp(820+28*c.ok+12*c.early-160*c.late-4*c.neg+14*level()-380*clamp(lev,0,1.5)+(S.money<0?-150:0),300,1900))}
function bankLimit(b){const sc=score();if(sc<b.min)return 0;const used=S.loans.filter(l=>l.bank===b.id).reduce((a,l)=>a+l.amount,0);return Math.max(0,Math.round(creditLimit()*b.mult*(0.5+sc/1900)-used))}
function gauge(sc){const a=Math.PI*(1-(sc-300)/1600),x=60+48*Math.cos(a),y=58-48*Math.sin(a);
  return `<svg width="120" height="70" viewBox="0 0 120 70" aria-hidden="true"><defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#ff5c74"/><stop offset=".5" stop-color="#ffc24a"/><stop offset="1" stop-color="#5fd69c"/></linearGradient></defs>
   <path d="M12 58 A48 48 0 0 1 108 58" fill="none" stroke="url(#gg)" stroke-width="10" stroke-linecap="round"/><line x1="60" y1="58" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="58" r="5" fill="#fff"/></svg>`}
function viewBank(){
  const sc=score(),c=S.credit;const maxL=Math.max(0,...BANKS.map(bankLimit));
  const amounts=[1e6,5e6,10e6,25e6,50e6,100e6,250e6,500e6,1e9,2.5e9,5e9].filter(x=>x<=maxL);
  const sel=+($('#loanamt')?.value||amounts[Math.min(1,amounts.length-1)]||0);
  return `<h2>Banka</h2>
   <div class="card scorecard"><div class="row" style="flex-wrap:nowrap">${gauge(sc)}<div class="grow"><div class="k">KREDİ PUANI</div><div class="bigcash num">${sc}<small> / 1900</small></div>
    <span class="pill ${sc>=1300?'g':sc>=900?'y':'r'}">${sc>=1450?'Mükemmel':sc>=1150?'Çok iyi':sc>=900?'İyi':sc>=600?'Orta':'Zayıf'}</span></div></div>
    <div class="meta">Zamanında ödeme +28 · erken kapama +12 · gecikme −160 · borç/varlık oranı yükseldikçe düşer. Ödenen ${c.ok}, erken ${c.early}, geciken ${c.late}.</div></div>
   <div class="card"><div class="stat"><span>Toplam borç</span><b class="num">${fmt(debt())}</b></div><div class="stat"><span>Günlük taksit yükü</span><b class="num">${fmt(S.loans.reduce((a,l)=>a+(l.amount+l.interest)/l.days,0))}</b></div>
    <p class="hint">Vadesi dolan kredi kasadan otomatik düşer. O gün kasa eksiye düşerse gecikme sayılır ve puanın düşer.</p></div>
   <h3>Kredi teklifleri</h3>
   ${amounts.length?`<div class="row"><label class="meta" for="loanamt">Tutar</label><select id="loanamt" class="btn">${amounts.map(a=>`<option value="${a}" ${a===sel?'selected':''}>${fmt(a)}</option>`).join('')}</select></div>`:'<div class="empty">Şu an hiçbir banka kredi vermiyor. Borcunu azalt ya da puanını yükselt.</div>'}
   ${BANKS.map(b=>{const lim=bankLimit(b),locked=sc<b.min;return `<div class="card bank ${locked?'locked':''}"><div class="row"><span class="logo-c" style="background:${b.col}">${b.n.split(' ').map(w=>w[0]).join('').slice(0,2)}</span><div class="grow"><b>${b.n}</b><div class="meta">${b.d}</div></div>
     <span class="meta num">${locked?`En az ${b.min} puan`:`Limit ${fmt(lim)}`}</span></div>
     <div class="terms">${b.t.map(([d,r])=>{const rr=r*(1-0.08*S.staff.acct);return `<button data-act="xloan" data-id="${b.id}" data-days="${d}" data-rate="${r}" ${locked||!lim?'disabled':''}><b>${d} gün</b><span>faiz %${Math.round(rr*100)}</span></button>`}).join('')}</div></div>`}).join('')}
   <h3>Kredilerin</h3>
   ${S.loans.length?S.loans.map(l=>`<div class="card"><div class="row"><div class="grow"><div class="title num">${fmt(l.amount)} <span class="meta">${(BANKS.find(b=>b.id===l.bank)||{n:'Banka'}).n}</span></div>
     <div class="meta">Faiz ${fmt(l.interest)} · ${l.left} gün kaldı</div><div class="prog" style="height:4px"><i style="width:${(1-l.left/l.days)*100}%;animation:none;background:var(--info)"></i></div></div>
     <button class="btn small" data-act="repay" data-id="${l.id}">Erken kapat</button></div></div>`).join(''):'<div class="empty">Kredin yok.</div>'}
   <h3>Sigorta</h3>
   <div class="card"><div class="row"><div class="grow"><div class="title">Şirket sigortası ${S.ins?'<span class="pill g">Aktif</span>':'<span class="pill">Yok</span>'}</div>
    <div class="meta">Yangın, sel, deprem ve hırsızlık hasarlarının %80'ini öder. Grev ve cezaları karşılamaz. Günlük prim ${fmt(Math.max(20000,assets()*0.0003))}.</div></div>
    <button class="btn ${S.ins?'':'primary'}" data-act="ins">${S.ins?'İptal et':'Sigorta yaptır'}</button></div></div>`;
}
function bankLoan(bid,amount,days,rate){
  const b=BANKS.find(x=>x.id===bid);if(!b||!amount)return;if(amount>bankLimit(b)){toast(`${b.n} bu tutarı vermiyor. Limit ${fmt(bankLimit(b))}.`,'bad');return}
  const interest=Math.round(amount*rate*(1-0.08*S.staff.acct));
  S.loans.push({id:uid(),amount,interest,days,left:days,bank:bid});S.money+=amount;sfx('cash');
  log(`${b.n}: ${fmt(amount)} kredi, ${days} gün, faiz ${fmt(interest)}.`);toast(`${b.n} krediyi onayladı: +${fmt(amount)}`,'good');render();
}
repay=(o=>function(lid){const n=S.loans.length;o(lid);if(S.loans.length<n)S.credit.early++})(repay);

// ---------- koleksiyon / prestij
const LUX=[
 {id:'sedan',cat:'Araba',n:'Elektrikli sedan',c:4e6,pr:1},{id:'spor',cat:'Araba',n:'Spor coupe',c:18e6,pr:3},{id:'suv',cat:'Araba',n:'Zırhlı SUV',c:30e6,pr:4},{id:'klasik',cat:'Araba',n:'Klasik koleksiyon arabası',c:55e6,pr:5},
 {id:'tekne',cat:'Deniz',n:'Gezi teknesi · 12 m',c:25e6,pr:3},{id:'yat',cat:'Deniz',n:'Motoryat · 28 m',c:120e6,pr:8},{id:'megayat',cat:'Deniz',n:'Mega yat · 60 m',c:650e6,pr:20},
 {id:'heli',cat:'Hava',n:'Helikopter',c:90e6,pr:7},{id:'jet',cat:'Hava',n:'Özel jet',c:400e6,pr:15},
 {id:'tablo',cat:'Sanat',n:'Yağlı boya başyapıt',c:60e6,pr:5},{id:'kosk',cat:'Mülk',n:'Boğaz kıyısında köşk',c:900e6,pr:25},{id:'ada',cat:'Mülk',n:'Özel ada',c:2.5e9,pr:40},
];
const LUXK=Object.fromEntries(LUX.map(l=>[l.id,l]));
function prestige(){return Object.keys(S.lux||{}).reduce((a,k)=>a+(LUXK[k]?LUXK[k].pr:0),0)}
function presBonus(){return Math.min(0.15,prestige()*0.004)}
function luxValue(){return Object.keys(S.lux||{}).reduce((a,k)=>a+(LUXK[k]?LUXK[k].c*0.75:0),0)}
function luxIcon(l){const c={Araba:'#ff7a52',Deniz:'#5fc9e6',Hava:'#b9a0f2',Sanat:'#ffc24a',Mülk:'#5fd69c'}[l.cat];
  const p={Araba:'<path d="M8 34h48l-4-10c-1-3-4-5-7-5H22c-3 0-5 1-7 4l-6 6c-1 1-1 2-1 5z" fill="C"/><circle cx="20" cy="36" r="5" fill="#222"/><circle cx="46" cy="36" r="5" fill="#222"/><path d="M22 22h9v7H17zM34 22h10l4 7H34z" fill="#bfe6f4"/>',
   Deniz:'<path d="M6 34h52l-8 9H14z" fill="C"/><path d="M16 34V26h20l8 8z" fill="#fff"/><path d="M20 28h4v3h-4zM27 28h4v3h-4z" fill="#5fc9e6"/><path d="M4 46c6 2 10 2 16 0s10-2 16 0 10 2 16 0 8-2 10 0" stroke="#7fd3ea" fill="none" stroke-width="2"/>',
   Hava:'<path d="M8 30l40-2c6 0 10 2 10 4s-4 4-10 4L8 34z" fill="C"/><path d="M26 31l-8-14h6l12 14zM26 33l-8 13h6l12-13zM10 30l-4-8h4l6 8z" fill="#fff"/>',
   Sanat:'<rect x="12" y="10" width="40" height="32" rx="2" fill="#8a5a2b"/><rect x="16" y="14" width="32" height="24" fill="C"/><path d="M16 38l10-12 8 8 6-6 8 10z" fill="#3cc6a8"/><circle cx="40" cy="20" r="3" fill="#fff"/>',
   Mülk:'<path d="M2 44c10-6 50-6 60 0z" fill="#e8d49a"/><path d="M20 40V28l12-8 12 8v12z" fill="C"/><path d="M28 40v-6h8v6z" fill="#8a5a2b"/><path d="M48 40V22M48 22c-6 0-8 4-10 6M48 22c6 0 8 4 10 6M48 22c-2-4-6-6-9-5M48 22c2-4 6-6 9-5" stroke="#3b7d3b" stroke-width="2" fill="none"/>'}[l.cat].replace(/C/g,c);
  return `<svg width="64" height="52" viewBox="0 0 64 52" aria-hidden="true">${p}</svg>`}
function corpLux(){
  const cats=[...new Set(LUX.map(l=>l.cat))];
  return `<div class="card"><div class="row"><div class="grow"><div class="title">Prestij ${prestige()}</div><div class="meta">Koleksiyonun büyüdükçe şirketine güven artar: satış fiyatların +%${(presBonus()*100).toLocaleString('tr-TR',{maximumFractionDigits:1})} (en çok %15).</div></div><span class="meta num">Değeri ${fmt(luxValue())}</span></div></div>
   ${cats.map(cat=>`<h3>${cat}</h3><div class="luxgrid">${LUX.filter(l=>l.cat===cat).map(l=>{const own=S.lux[l.id];return `<div class="card lux ${own?'own':''}">${luxIcon(l)}<b>${l.n}</b><span class="meta">${fmt(l.c)} · prestij +${l.pr}</span>
     ${own?`<button class="btn small" data-act="xluxsell" data-id="${l.id}">Sat · ${fmt(l.c*0.75)}</button>`:`<button class="btn small primary" data-act="xlux" data-id="${l.id}">Satın al</button>`}</div>`}).join('')}</div>`).join('')}`;
}
unitValue=(o=>function(b){return o(b)*(1+presBonus())*(b.am&&b.am.length?1:1)})(unitValue);
assets=(o=>function(){return o()+(S.mkt?mktValue():0)+luxValue()})(assets);

// ---------- olay bağlantıları
migrate=(o=>function(){o();S.hist=S.hist||[];S.offers=S.offers||[];S.jobs=S.jobs||[];S.lux=S.lux||{};S.credit=S.credit||{ok:0,early:0,late:0,neg:0};S.port=S.port||{};mktInit()})(migrate);
newDay=(o=>function(){
  const before=S.loans.map(l=>l.id);o();
  const now=new Set(S.loans.map(l=>l.id));const paid=before.filter(id=>!now.has(id)).length;
  if(paid){if(S.money>=0)S.credit.ok+=paid;else{S.credit.late+=paid;toast('Kredi ödemesi gecikti, puanın düştü.','bad')}}
  if(S.money<0)S.credit.neg++;
  S.hist.push(Math.round(S.money));if(S.hist.length>60)S.hist.shift();
  mktDay();
  S.offers=S.offers.filter(x=>x.exp>S.day);
  if(S.offers.length<4&&Math.random()<(S.day<4?0.15:0.3)){const of=genOffer();S.offers.push(of);if(S.offers.length>1){toast(`Yeni teklif: ${of.nm} · ${of.cl}`);sfx('open')}else
    popup(()=>openSheet(`<div class="newoffer"><img src="${bThumb(of.tid,1,'lux',150)}" alt="" width="150" height="150"><div class="grow"><span class="pill ${of.abroad?'b':'y'}">${of.abroad?'Yurt dışı':'Yeni teklif'}</span><h2>${of.nm}</h2><p class="hint">${of.cl} · ${of.from}</p>
      <div class="stat"><span>Bedel</span><b class="num">${fmt(of.price)}</b></div><div class="stat"><span>Maliyet</span><b class="num">${fmt(of.cost)}</b></div>
      <div class="row"><button class="btn" data-act="close">Sonra</button><button class="btn primary grow" data-act="xoffer" data-id="${of.id}">İncele ›</button></div></div></div>`));sfx('open')}
  if(S.day>8&&Math.random()<0.012)quake();
})(newDay);
tick=(o=>function(dt){o(dt);jobsTick(dt)})(tick);
complete=(o=>function(b,live){o(b,live);
  if(live&&!b.kamu)popup(()=>openSheet(`<div class="donepop"><img src="${bThumb(b.type,1,b.q,140)}" alt="" width="140" height="140"><div><span class="pill g">Yapı tamamlandı</span><h2>${esc(b.name)}</h2>
   <p class="hint">${CITY[b.city].n}${b.di!=null?' · '+CITY[b.city].d[b.di][0]:''} · ${b.units.length} ${TYPE[b.type].uname} · birim değeri ${fmt(unitValue(b))}. Satışa çıkarabilir ya da kiraya verebilirsin.</p>
   <div class="row"><button class="btn" data-act="close">Tamam</button><button class="btn primary grow" data-act="xgoproj">Projeye git ›</button></div></div></div>`));
})(complete);
offlineCatchup=(o=>function(){const away=Date.now()-(S.lastSeen||Date.now());const days=Math.min(OFFLINE_MAX_DAYS,Math.floor(away/DAY_MS));
  if(days>=1&&away>=90000)(S.jobs||[]).forEach(j=>j.prog+=days*(1+0.2*S.staff.eng+vehSpeed())/j.days);
  if(days>=1)for(let i=0;i<Math.min(days,30);i++){mktStep(1);mktDay()}
  const r=o();if(S.jobs&&S.jobs.some(j=>j.prog>=1))jobsTick(0);return r})(offlineCatchup);
setInterval(()=>{if(started&&S&&S.mkt){mktStep(1/6);if(curTab==='borsa'&&$('#sheet').hidden)render()}},10000);

document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el||el.closest('#splash'))return;const a=el.dataset.act,id=el.dataset.id;
  switch(a){
    case 'gotab':closeSheet();go(id);break;
    case 'gocorp':sub=id;go('corp');break;
    case 'xgoproj':closeSheet();ptab='mine';pfil='all';go('proj');break;
    case 'xptab':ptab=id;if(curTab!=='proj')go('proj');else render();break;
    case 'xpfil':pfil=id;render();break;
    case 'xreinf':{const b=S.bld.find(x=>x.id===id);if(b)reinforce([b]);break}
    case 'xreinfall':reinforce(atRisk());break;
    case 'xoffer':offerSheet(id);break;
    case 'xoff':{const o=S.offers.find(x=>x.id===id);if(o){o.ask=Math.max(o.price,o.ask+ +el.dataset.v);sfx('tap');offerSheet(id)}break}
    case 'xcounter':counterOffer(id);break;
    case 'xacc':acceptOffer(id);break;
    case 'xrej':S.offers=S.offers.filter(x=>x.id!==id);closeSheet();render();break;
    case 'xmsub':msub=id;render();break;
    case 'xmsort':msort=id;render();break;
    case 'xmkt':mktSheet(id);break;
    case 'xmbuy':mBuy(id,el.dataset.v);break;
    case 'xmsell':mSell(id,+el.dataset.v);break;
    case 'xloan':bankLoan(id,+($('#loanamt')?.value||0),+el.dataset.days,+el.dataset.rate);break;
    case 'xlux':{const l=LUXK[id];if(l&&!S.lux[id]&&spend(l.c)){S.lux[id]=S.day;gainXp(l.pr*3);sfx('reward');coinBurst(innerWidth/2,innerHeight/2,8);toast(`${l.n} koleksiyonunda! Prestij +${l.pr}`,'good');render()}break}
    case 'xluxsell':{const l=LUXK[id];if(l&&S.lux[id]){delete S.lux[id];S.money+=l.c*0.75;sfx('cash');toast(`${l.n} satıldı: ${fmt(l.c*0.75)}`);render()}break}
    case 'dztype':{const p=dz&&S.plots.find(x=>x.id===dz.pid);if(p){sfx('tap');dz.step=1;buildSheet(p.id,id)}break}
    case 'dzopt':dz.o=+id;sfx('tap');buildSheet(dz.pid,dz.tid);break;
    case 'dzq':dz.q=id;sfx('tap');buildSheet(dz.pid,dz.tid);break;
    case 'dzam':dz.am[id]=!dz.am[id];sfx('tap');buildSheet(dz.pid,dz.tid);break;
    case 'dzstep':dz.step=+id;buildSheet(dz.pid,dz.tid);break;
    case 'dzgo':startDesign();break;
  }
});
