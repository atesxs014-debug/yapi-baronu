
// ================= v9: iş makinesi filosu, gece mahalle, rakip savaşı, mega projeler, günlük görevler ve sezon =================
// ---------- 7) iş makineleri: her biri bir kez alınır, tam filo inşaatları %40 kısaltır
VEH.push({id:'ekskavator',n:'Ekskavatör',cost:4e6,sp:0.08,lvl:1},{id:'dozer',n:'Dozer',cost:7e6,sp:0.09,lvl:1},{id:'silindir',n:'Yol Silindiri',cost:3e6,sp:0.06,lvl:1});
VEH.forEach(v=>v.lvl=1);
drawVeh=(o=>function(ctx,id){o(ctx,id);
  const wheel=(x,y,r=6)=>{ctx.fillStyle='#1b1b1b';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.fillStyle='#8a8f96';ctx.beginPath();ctx.arc(x,y,r*0.4,0,7);ctx.fill()};
  if(id==='ekskavator'){ctx.fillStyle='#2b2b2b';ctx.fillRect(14,48,46,10);ctx.fillStyle='#f2b632';ctx.fillRect(18,30,36,18);ctx.fillStyle='#bfe0f5';ctx.fillRect(38,33,12,9);
    ctx.strokeStyle='#f2b632';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(22,34);ctx.lineTo(8,14);ctx.lineTo(2,34);ctx.stroke();ctx.fillStyle='#555';ctx.beginPath();ctx.moveTo(0,32);ctx.lineTo(10,32);ctx.lineTo(6,42);ctx.fill();
    [18,30,42,54].forEach(x=>{ctx.fillStyle='#555';ctx.beginPath();ctx.arc(x,53,4,0,7);ctx.fill()})}
  if(id==='dozer'){ctx.fillStyle='#2b2b2b';ctx.fillRect(18,46,50,12);ctx.fillStyle='#f2b632';ctx.fillRect(22,28,40,18);ctx.fillRect(44,16,18,14);ctx.fillStyle='#bfe0f5';ctx.fillRect(48,19,10,8);
    ctx.fillStyle='#8a8f96';ctx.fillRect(4,30,8,26);ctx.strokeStyle='#8a8f96';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(12,40);ctx.lineTo(24,36);ctx.stroke();[24,36,48,60].forEach(x=>{ctx.fillStyle='#555';ctx.beginPath();ctx.arc(x,52,4,0,7);ctx.fill()})}
  if(id==='silindir'){ctx.fillStyle='#8a8f96';ctx.beginPath();ctx.arc(20,48,11,0,7);ctx.fill();ctx.fillStyle='#f2b632';ctx.fillRect(26,30,40,16);ctx.fillRect(48,18,14,12);ctx.fillStyle='#bfe0f5';ctx.fillRect(51,21,8,7);wheel(66,52,7)}
})(drawVeh);
function fleetFull(){return VEH.every(v=>S.veh[v.id]&&S.veh[v.id].own>=1&&!S.veh[v.id].rented)}
function fleetOwned(){return VEH.filter(v=>S.veh[v.id]&&S.veh[v.id].own>=1).length}
function fleetMul(){return S&&S.veh&&fleetFull()?1/0.6:1}
speed=(o=>function(cid){return o(cid)*fleetMul()})(speed);
buyVeh=function(id,d){
  const v=VEH.find(x=>x.id===id),st=S.veh[id];if(!v||!st)return;
  if(d>0){if(st.own>=1)return;if(!spend(v.cost))return;st.own=1;sfx('engine');vib(40);
    toast(fleetFull()?'Filo tamamlandı! Tüm inşaatlar %40 daha kısa sürecek.':`${v.n} filoya katıldı (${fleetOwned()}/${VEH.length}).`,'good');
    if(fleetFull()){S.news.unshift({d:S.day,txt:`${S.company} iş makinesi filosunu tamamladı.`});sfx('reward')}}
  else{if(st.own-st.rented<=0)return;st.own=0;S.money+=v.cost*0.6;sfx('cash');toast(`${v.n} ikinci ele satıldı: ${fmt(v.cost*0.6)}`)}
  render();
};
corpVeh=function(){
  const full=fleetFull(),n=fleetOwned();
  return `<div class="v9fleet ${full?'full':''}"><div><small>İŞ MAKİNESİ FİLOSU</small><b>${n}/${VEH.length} makine</b><span>${full?'Tam filo aktif: tüm inşaatlar %40 daha kısa sürüyor.':`Hepsini alırsan tüm inşaat süreleri %40 düşer. Kiradaki makine sayılmaz.`}</span></div>
    <div class="fbar"><i style="width:${n/VEH.length*100}%"></i></div><em>${full?'−%40 süre':'+%'+Math.round(vehSpeed()*100)+' hız'}</em></div>
   <div class="v9vgrid">${VEH.map(v=>{const st=S.veh[v.id],own=st.own>=1;return `<div class="v9v ${own?'own':''}"><img src="${vThumb(v.id)}" alt=""><b>${v.n}</b>
     <small>+%${Math.round(v.sp*100)} hız · ${own?(st.rented?'kirada · +'+fmt(v.cost*0.012)+'/gün':'şantiyede'):fmt(v.cost)}</small>
     ${own?`<span class="row"><button class="btn small" data-act="vrent" data-id="${v.id}" data-v="${st.rented?-1:1}">${st.rented?'Geri al':'Kiraya ver'}</button>${st.rented?'':`<button class="btn small" data-act="veh" data-id="${v.id}" data-v="-1">Sat</button>`}</span>`
       :`<button class="btn primary small" data-act="veh" data-id="${v.id}" data-v="1" ${S.money<v.cost?'disabled':''}>Satın al</button>`}
     ${own?'<i class="ok">✓</i>':''}</div>`}).join('')}</div>
   <p class="hint">Günlük bakım ${fmt(vehUpkeep())}. Her makine bir kez alınır.</p>`;
};
viewProjDetail=(o=>function(b){const h=o(b);if(b.done)return h;const own=VEH.filter(v=>S.veh[v.id].own>=1&&!S.veh[v.id].rented);if(!own.length)return h;
  return h.replace('</span></div>\n    <div class="rt">',`</span><span class="vstrip">${own.slice(0,5).map(v=>`<img src="${vThumb(v.id)}" alt="${v.n}" title="${v.n}">`).join('')}${fleetFull()?'<em>TAM FİLO −%40</em>':''}</span></div>\n    <div class="rt">`)})(viewProjDetail);

// ---------- 1) gece ışıklı mahalle
viewHome=(o=>function(){return o().replace('<div class="chips">',`<div class="chips"><button class="chip night" data-act="x9night" aria-pressed="${!!scene.night}">${scene.night?'☀ Gündüz':'☾ Gece'}</button>`)})(viewHome);

// ---------- 3) rakip savaşı ve devralma
function stake(r){return (S.shares[r.id]||0)/1e6}
function acqDaily(){return S.rivals.filter(r=>r.owned).reduce((a,r)=>a+r.w*0.0012,0)}
bizDaily=(o=>function(){return o()+acqDaily()})(bizDaily);
assets=(o=>function(){return o()+S.rivals.filter(r=>r.owned).reduce((a,r)=>a+r.w*0.8,0)-S.rivals.filter(r=>r.owned).reduce((a,r)=>a+(S.shares[r.id]||0)*sharePrice(r),0)})(assets);
ranking=(o=>function(){const own=new Set(S.rivals.filter(r=>r.owned).map(r=>r.n));return o().filter(x=>x.me||!own.has(x.n))})(ranking);
function smearCost(r){return Math.max(2e6,Math.round(r.w*0.012/1e5)*1e5)}
function takeover(rid){const r=S.rivals.find(x=>x.id===rid);if(!r||r.owned||stake(r)<0.51)return;const rest=Math.round(r.w*(1-stake(r))*0.35/1e5)*1e5;
  if(!spend(rest))return;r.owned=true;S.shares[rid]=0;sfx('gavel');setTimeout(()=>sfx('reward'),300);vib([40,40,80]);coinBurst(innerWidth/2,innerHeight/2,16);
  S.news.unshift({d:S.day,txt:`${S.company}, ${r.n} şirketini devraldı!`});log(`${r.n} devralındı (${fmt(rest)}).`);
  popup(()=>showEvent('Devralma tamamlandı!',`${r.n} artık holdinginin bir parçası. Her gün yaklaşık ${fmt(r.w*0.0012)} kâr payı getirecek ve sıralamadan çıktı.`,false,true));render()}
function warAct(rid,k){const r=S.rivals.find(x=>x.id===rid);if(!r||r.owned)return;r.cd=r.cd||{};if(r.cd[k]===S.day){toast('Bu hamleyi bugün zaten yaptın. Yarın tekrar dene.','bad');return}
  if(k==='smear'){if(!spend(smearCost(r)))return;r.prev=r.w;r.w*=rnd(0.9,0.95);r.hos=Math.min(100,(r.hos||0)+25);toast(`${r.n} hakkında haberler çıktı, değeri düştü.`,'good')}
  if(k==='poach'){const s=STAFF.find(x=>x.id==='eng');if(S.staff.eng>=staffMax(s)){toast('Mühendis kadron dolu. Ofisini büyüt.','bad');return}if(!spend(3e6))return;S.staff.eng++;r.prev=r.w;r.w*=0.97;r.hos=Math.min(100,(r.hos||0)+15);toast(`${r.n} şirketinden bir mühendis transfer ettin.`,'good')}
  if(k==='peace'){const c=Math.max(1e6,Math.round(r.w*0.004/1e5)*1e5);if(!spend(c))return;r.hos=Math.max(0,(r.hos||0)-40);toast(`${r.n} ile barış masasına oturuldu.`,'good')}
  r.cd[k]=S.day;sfx('tap');render()}
function rivalStrike(){
  S.rivals.forEach(r=>{if(r.owned)return;r.hos=Math.max(0,(r.hos||0)-4);if(Math.random()>(r.hos||0)/260)return;
    const pick4=Math.floor(Math.random()*3);
    if(pick4===0){const ks=[...new Set([...S.plots,...S.bld].map(x=>x.key).filter(Boolean))];const k=ks.length?pick(ks):null;const d=k&&S.dist[k];const free=d?d.p.map((p,i)=>[p,i]).filter(([p])=>!p.o):[];
      if(free.length){const [p]=pick(free);p.o='r';const [cid,di]=k.split('|');popup(()=>showEvent(`${r.n} misilleme yaptı`,`${CITY[cid].n} ${CITY[cid].d[+di][0]}'de göz koyduğun boş bir arsayı önünden kaptılar.`,true));return}}
    if(pick4<=1){const fine=Math.min(Math.max(5e5,S.money*0.02),2e7);S.money-=fine;popup(()=>showEvent(`${r.n} dava açtı`,`Haksız rekabet davası kaybedildi. ${fmt(fine)} tazminat ödendi.`,true));return}
    const ks=STAFF.filter(s=>S.staff[s.id]>0);if(ks.length){const s=pick(ks);S.staff[s.id]--;popup(()=>showEvent(`${r.n} adamını çaldı`,`Bir ${s.n.toLocaleLowerCase('tr-TR')} daha yüksek maaşla ${r.n} şirketine geçti.`,true))}
  });
}
corpRank=function(){
  const rk=ranking();
  const cards=S.rivals.map(r=>{const st=stake(r),hos=r.hos||0;
    if(r.owned)return `<div class="v9r own" style="--c:${r.col}"><span class="lg" style="background:${r.col}">${esc(r.n[0])}</span><div class="t"><b>${esc(r.n)}</b><small>Bağlı şirketin · +${fmt(r.w*0.0012)}/gün kâr payı</small></div><span class="pill g">Senin</span></div>`;
    return `<div class="v9r" style="--c:${r.col}"><span class="lg" style="background:${r.col}">${esc(r.n[0])}</span><div class="t"><b>${esc(r.n)}</b><small>Değer ${fmt(r.w)} ${trend(r.w,r.prev||r.w)}</small>
      <span class="sk"><i style="width:${Math.min(100,st*100/0.51*1)}%"></i><em>Hissen %${(st*100).toLocaleString('tr-TR',{maximumFractionDigits:1})} · devralma için %51</em></span>
      <span class="hs ${hos>60?'hot':''}">Düşmanlık ${'●'.repeat(Math.ceil(hos/20))}${'○'.repeat(5-Math.ceil(hos/20))}</span></div>
     <div class="a">${st>=0.51?`<button class="btn primary small" data-act="x9take" data-id="${r.id}">Devral · ${fmt(r.w*(1-st)*0.35)}</button>`:`<button class="btn primary small" data-act="shbuy" data-id="${r.id}" data-v="${Math.max(1e6,Math.round(r.w*0.1/1e6)*1e6)}">%10 hisse al · ${fmt(Math.max(1e6,Math.round(r.w*0.1/1e6)*1e6))}</button>`}
      <button class="btn small" data-act="x9war" data-id="${r.id}" data-v="smear">Karalama · ${fmt(smearCost(r))}</button><button class="btn small" data-act="x9war" data-id="${r.id}" data-v="poach">Mühendis çal · ₺3 Mn</button>${hos>30?`<button class="btn small" data-act="x9war" data-id="${r.id}" data-v="peace">Barış yap</button>`:''}</div></div>`}).join('');
  return `<p class="hint">Rakiplerinin hissesini topla, %51'e ulaşınca şirketi devral. Karalama ve eleman transferiyle onları zayıflatabilirsin ama düşmanlık artar; sinirli rakipler arsa kapar, dava açar, adamını çalar.</p>
   <div class="v9rl">${cards}</div>
   <div class="k8">SIRALAMA</div><div class="card">${rk.map((x,i)=>`<div class="rank ${x.me?'me':''}"><span class="pos">${i+1}</span><span class="row" style="gap:8px;flex-wrap:nowrap">${x.me?logoSvg(22):`<span style="width:14px;height:14px;border-radius:3px;background:${x.col};flex-shrink:0"></span>`}<b style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(x.n)}</b></span><b class="num">${fmt(x.w)}</b></div>`).join('')}</div>`;
};
viewCorp=(o=>function(){return o().replace('data-id="rank" aria-pressed="'+(sub==='rank')+'">Sıralama','data-id="rank" aria-pressed="'+(sub==='rank')+'">Rakipler')})(viewCorp);

// ---------- 5) mega projeler
const MEGA=[
 {id:'stadyum',n:'Olimpiyat stadı',lvl:2,base:60e6,days:4,kind:'spor',st:['Zemin ve temel','Tribünler','Çatı ve açılış']},
 {id:'hastane',n:'Şehir hastanesi',lvl:3,base:80e6,days:4,kind:'hastane',st:['Kaba inşaat','Bloklar ve teknik altyapı','Tıbbi donanım ve açılış']},
 {id:'metro',n:'Metro hattı',lvl:4,base:120e6,days:5,kind:'kultur',st:['Tünel açma','Raylar ve istasyonlar','Trenler ve sefer']},
 {id:'kopru',n:'Boğaz köprüsü',lvl:5,base:160e6,days:5,kind:'kultur',st:['Ayak temelleri','Kuleler','Halatlar ve tabliye','Bağlantı yolları ve açılış']},
 {id:'havalimani',n:'Yeni havalimanı',lvl:6,base:240e6,days:6,kind:'kultur',st:['Hafriyat ve dolgu','Pistler','Terminal binası','Kule ve açılış']},
 {id:'kanal',n:'Kanal projesi',lvl:8,base:450e6,days:7,kind:'kultur',st:['Kazı','Şev ve set','Köprüler','Liman ve açılış']},
];
const MEGAK=Object.fromEntries(MEGA.map(m=>[m.id,m]));
function megaCost(m,i){return Math.round(m.base*(1+0.15*i)/1e6)*1e6}
function megaPay(m,i){return Math.round(megaCost(m,i)*1.32/1e6)*1e6}
function megaArt(id,prog=1){
  const sky='<defs><linearGradient id="mg'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5aa8d6"/><stop offset="1" stop-color="#cfe9f5"/></linearGradient></defs><rect width="240" height="120" fill="url(#mg'+id+')"/>';
  const g='<rect y="96" width="240" height="24" fill="#6b8f5a"/>',sea='<rect y="90" width="240" height="30" fill="#2f86b0"/><path d="M0 98h240M0 108h240" stroke="#7fc7e6" stroke-dasharray="8 10" opacity=".6"/>';
  const a={
   stadyum:g+'<ellipse cx="120" cy="86" rx="92" ry="22" fill="#d6d9de"/><ellipse cx="120" cy="80" rx="80" ry="15" fill="#4caf50"/><path d="M28 86q0-40 92-42q92 2 92 42" fill="none" stroke="#e9edf0" stroke-width="8"/><path d="M40 60l-10-18M200 60l10-18" stroke="#8a8f96" stroke-width="3"/>',
   hastane:g+'<rect x="50" y="34" width="140" height="62" fill="#eef2f6"/><rect x="96" y="18" width="48" height="78" fill="#fff"/>'+[0,1,2,3].map(r=>[0,1,2,3,4,5].map(c=>`<rect x="${58+c*22}" y="${42+r*13}" width="10" height="7" fill="#7fb6dd"/>`).join('')).join('')+'<rect x="111" y="22" width="18" height="18" rx="3" fill="#e5484d"/><path d="M120 25v12M114 31h12" stroke="#fff" stroke-width="4"/>',
   metro:'<rect width="240" height="120" fill="#3a3f4a"/><path d="M0 120V60q120-60 240 0v60z" fill="#555c68"/><rect y="96" width="240" height="6" fill="#8a8f96"/><rect x="40" y="62" width="150" height="34" rx="10" fill="#e5484d"/>'+[0,1,2,3,4].map(i=>`<rect x="${52+i*26}" y="68" width="18" height="12" rx="2" fill="#bfe0f5"/>`).join('')+'<circle cx="182" cy="86" r="4" fill="#ffd36b"/>',
   kopru:sea+'<rect x="60" y="20" width="8" height="74" fill="#c4573d"/><rect x="172" y="20" width="8" height="74" fill="#c4573d"/><rect y="70" width="240" height="6" fill="#8a5a44"/><path d="M0 72Q64 20 64 20Q120 70 176 20Q176 20 240 72" fill="none" stroke="#e9edf0" stroke-width="2"/>'+Array.from({length:20},(_,i)=>`<path d="M${12+i*11} 70V${50-Math.abs(Math.sin(i))*0}" stroke="#e9edf0" stroke-width=".6" opacity=".7"/>`).join(''),
   havalimani:g+'<rect y="92" width="240" height="8" fill="#555c68"/><path d="M0 96h240" stroke="#fff" stroke-dasharray="10 8"/><rect x="30" y="58" width="110" height="34" fill="#dfe6ee"/><path d="M30 58q55-16 110 0" fill="#9fb2c8"/><rect x="170" y="30" width="10" height="62" fill="#e9edf0"/><rect x="162" y="22" width="26" height="12" fill="#7fb6dd"/><path d="M150 40l40-6 6 4-40 8zM176 34l6-10h4l-2 12z" fill="#fff"/>',
   kanal:'<rect width="240" height="120" fill="url(#mgkanal)"/><path d="M0 60h240v60H0z" fill="#c9a46a"/><path d="M0 74h240v32H0z" fill="#2f86b0"/><path d="M0 74h240M0 106h240" stroke="#8a6a3a" stroke-width="3"/><path d="M80 84h60l-6 10h-48z" fill="#fff"/><rect x="100" y="76" width="20" height="8" fill="#e5484d"/>',
  }[id]||g;
  return `<svg viewBox="0 0 240 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${sky}${a}${prog<1?`<rect x="0" y="0" width="${240*(1-prog)}" height="120" transform="translate(${240*prog} 0)" fill="rgba(240,230,210,.55)"/><path d="M${240*prog} 0v120" stroke="#ffb020" stroke-width="2" stroke-dasharray="4 3"/>`:''}</svg>`;
}
function megaStart(id){const m=MEGAK[id];if(!m||level()<m.lvl)return;const cur=S.mega;
  if(cur&&cur.id!==id){toast('Aynı anda tek mega proje yürütebilirsin.','bad');return}
  const i=cur?cur.st:0;if(cur&&cur.run)return;if(!spend(megaCost(m,i)))return;
  S.mega={id,st:i,prog:0,run:true};sfx('gavel');vib([30,30,60]);toast(`${m.n}: ${m.st[i]} başladı.`,'good');render()}
function megaTick(dt){const g=S.mega;if(!g||!g.run)return;const m=MEGAK[g.id];g.prog+=dt/DAY_MS*(speed('istanbul')||0)/m.days;if(g.prog<1)return;
  g.run=false;g.prog=1;const pay=megaPay(m,g.st);S.money+=pay;gainXp(pay/2e6);seasonAdd(15,'Mega proje aşaması');
  if(g.st>=m.st.length-1){const bonus=Math.round(m.st.reduce((a,_,i)=>a+megaCost(m,i),0)*0.2/1e6)*1e6;S.money+=bonus;S.megaDone=S.megaDone||[];S.megaDone.push(m.id);S.mega=null;
    const lid=uid();S.landmarks.push({id:lid,city:'istanbul',kind:m.kind,name:m.n});addStreet('istanbul',lid);
    S.news.unshift({d:S.day,txt:`${m.n} ${S.company} tarafından tamamlandı. Açılışa binlerce kişi katıldı.`});sfx('reward');
    popup(()=>showEvent(`${m.n} açıldı!`,`Son aşama da bitti. Hakediş ${fmt(pay)} ve tamamlama primi ${fmt(bonus)} kasana girdi. Eser İstanbul manzaranda duruyor.`,false,true))}
  else{g.st++;g.prog=0;sfx('complete');toast(`${m.n}: aşama bitti, ${fmt(pay)} hakediş ödendi. Sıradaki aşamayı başlat.`,'good')}
  if(curTab==='auction')render()}
tick=(o=>function(dt){o(dt);megaTick(dt)})(tick);
offlineCatchup=(o=>function(){const t0=S.lastSeen||Date.now();const r=o();if(r&&S.mega&&S.mega.run){const days=Math.min(OFFLINE_MAX_DAYS,Math.floor((Date.now()-t0)/DAY_MS));megaTick(days*DAY_MS*0.5)}return r})(offlineCatchup);
function megaSection(){
  const g=S.mega,L=level();
  return `<div class="k8">MEGA PROJELER · DEVLET</div><p class="hint" style="margin:0">Çok aşamalı dev ihaleler. Her aşamayı sen finanse edersin, bitince devlet %32 kârla öder. Son aşamada tamamlama primi alırsın, eser şehrinde kalır.</p>
   <div class="v9mega">${MEGA.map(m=>{const act=g&&g.id===m.id,done=(S.megaDone||[]).includes(m.id),lock=L<m.lvl,i=act?g.st:0;
    const dots=m.st.map((s,k)=>`<i class="${done||(act&&(k<g.st))?'d':act&&k===g.st?'c':''}" title="${s}"></i>`).join('');
    let foot;
    if(done)foot='<span class="pill g">Tamamlandı</span>';
    else if(lock)foot=`<span class="pill">Seviye ${m.lvl}'de açılır</span>`;
    else if(act&&g.run)foot=`<span class="pr"><i style="width:${g.prog*100}%"></i></span><small>${m.st[i]} · %${Math.floor(g.prog*100)} · ${speed('istanbul')>0?Math.ceil((1-g.prog)*m.days/speed('istanbul'))+' gün':'durdu'}</small>`;
    else foot=`<button class="btn primary small" data-act="x9mega" data-id="${m.id}" ${(g&&!act)||S.money<megaCost(m,i)?'disabled':''}>${act?'Sonraki aşama':'İhaleyi al'} · ${fmt(megaCost(m,i))}</button><small>Hakediş ${fmt(megaPay(m,i))} · ${m.days} gün</small>`;
    return `<div class="mc ${act?'act':''} ${lock?'lock':''}"><span class="art">${megaArt(m.id,done?1:act?(g.st+g.prog)/m.st.length:1)}</span><b>${m.n}</b><span class="dots">${dots}</span><small class="st">${done?'Açıldı':act?`Aşama ${g.st+1}/${m.st.length}: ${m.st[g.st]}`:`${m.st.length} aşama`}</small>${foot}</div>`}).join('')}</div>`;
}
viewAuction=(o=>function(){return o().replace('<h2>İhale</h2>','<h2>İhale</h2>'+megaSection())})(viewAuction);

// ---------- 6) günlük görevler ve haftalık sezon
const DQ=[
 {k:'plot',n:'Bir arsa satın al',m:()=>S.stats.plots,t:[1]},
 {k:'start',n:'Yeni inşaat başlat',m:()=>S.stats.started||0,t:[1,2]},
 {k:'built',n:'Bir inşaatı bitir',m:()=>S.stats.built,t:[1]},
 {k:'sold',n:'Birim sat',m:()=>S.stats.sold,t:[2,4,6]},
 {k:'biz',n:'Holdingde işletme kur',m:()=>S.stats.bizN||0,t:[1]},
 {k:'share',n:'Borsadan ya da rakipten hisse al',m:()=>S.stats.shareN||0,t:[1,2]},
 {k:'bid',n:'Arsa ihalesine teklif ver',m:()=>S.stats.bidN||0,t:[1,2]},
 {k:'spin',n:'Şans çarkını çevir',m:()=>S.daily&&S.daily.spun===today()?1:0,t:[1]},
 {k:'hire',n:'Ekibe birini al',m:()=>S.stats.hireN||0,t:[1]},
];
const DQK=Object.fromEntries(DQ.map(q=>[q.k,q]));
function dqGen(){const r=mulberry(hash('dq'+S.day+S.company));const pool=[...DQ];const list=[];
  while(list.length<3&&pool.length){const q=pool.splice(Math.floor(r()*pool.length),1)[0];const t=q.t[Math.floor(r()*q.t.length)];list.push({k:q.k,t,base:q.k==='spin'?0:q.m(),done:false})}
  S.dq={day:S.day,list,all:false}}
function dqProg(q){const d=DQK[q.k];return d?Math.min(q.t,Math.max(0,d.m()-q.base)):0}
function dqReward(){return Math.round(8e5*(1+level()*0.5)/1e5)*1e5}
function dqReady(){if(!S.dq)return 0;return S.dq.list.filter(q=>!q.done&&dqProg(q)>=q.t).length}
const SEASON_T=[[25,'Bronz'],[55,'Gümüş'],[90,'Altın'],[130,'Elmas']];
function seasonInit(){S.season={n:(S.season?S.season.n:0)+1,start:S.day,pts:0,got:[],riv:S.rivals.map(r=>({n:r.n,col:r.col,base:rnd(40,120)}))}}
function seasonAdd(p,why){if(!S.season)seasonInit();S.season.pts+=p}
function seasonReward(i){return Math.round(2e6*(i+1)*(i+1)*(1+level()*0.4)/1e5)*1e5}
function seasonEnd(){const s=S.season;if(!s)return;const me=s.pts;const tab=[...s.riv.filter(r=>!(S.rivals.find(x=>x.n===r.n)||{}).owned).map(r=>({n:r.n,p:Math.round(r.base)})),{n:S.company,p:me,me:1}].sort((a,b)=>b.p-a.p);
  const rank=tab.findIndex(x=>x.me)+1;const prize=[0,25e6,12e6,6e6,2e6][rank]||0;const pz=Math.round(prize*(1+level()*0.3)/1e5)*1e5;if(pz)S.money+=pz;
  S.news.unshift({d:S.day,txt:`Sezon ${s.n} bitti: ${S.company} ${rank}. oldu.`});
  popup(()=>showEvent(`Sezon ${s.n} bitti`,`${me} puanla ${rank}. oldun.${pz?` Sezon ödülü ${fmt(pz)} kasana girdi.`:' Bu sefer ödül yok, yeni sezonda daha çok görev yap!'}`,!pz,!!pz));seasonInit()}
function seasonRivals(){const s=S.season;const d=Math.min(7,S.day-s.start);return [...s.riv.filter(r=>!(S.rivals.find(x=>x.n===r.n)||{}).owned).map(r=>({n:r.n,col:r.col,p:Math.round(r.base*d/7)})),{n:S.company,p:s.pts,me:1}].sort((a,b)=>b.p-a.p)}
function questHtml(){
  if(!S.dq||S.dq.day!==S.day)dqGen();if(!S.season)seasonInit();const s=S.season,left=Math.max(0,s.start+7-S.day);
  const qs=S.dq.list.map(q=>{const d=DQK[q.k],p=dqProg(q),ok=p>=q.t;return `<div class="q ${q.done?'done':ok?'ok':''}"><span class="qi">${q.done?'✓':ok?'!':'•'}</span><span class="qt"><b>${d.n}${q.t>1?` (${q.t})`:''}</b><span class="pr"><i style="width:${p/q.t*100}%"></i></span></span>
    ${q.done?'<small>Alındı</small>':ok?`<button class="btn primary small" data-act="x9q" data-id="${q.k}">Al · ${fmt(dqReward())}</button>`:`<small>${p}/${q.t} · +10 puan</small>`}</div>`}).join('');
  const all=S.dq.list.every(q=>q.done);
  const tiers=SEASON_T.map(([p,n],i)=>{const got=s.got.includes(i),ok=s.pts>=p;return `<div class="tr ${got?'got':ok?'ok':''}"><b>${n}</b><small>${p} puan</small>${got?'<em>✓</em>':ok?`<button class="btn primary small" data-act="x9tier" data-id="${i}">${fmt(seasonReward(i))}</button>`:`<em>${fmt(seasonReward(i))}</em>`}</div>`}).join('');
  const max=SEASON_T[SEASON_T.length-1][0];
  return `<div class="v9q"><div class="ql"><h2>Günlük görevler</h2><p class="meta">Gün ${S.day} · görevler her gün yenilenir</p>${qs}
    <div class="q ${all&&!S.dq.all?'ok':''}"><span class="qi">★</span><span class="qt"><b>Üçünü de bitir</b><small class="meta">Ek +10 sezon puanı ve ${fmt(dqReward())}</small></span>${S.dq.all?'<small>Alındı</small>':all?'<button class="btn primary small" data-act="x9qall">Al</button>':''}</div></div>
   <div class="qr"><h2>Sezon ${s.n}</h2><p class="meta">${left} gün kaldı · ${s.pts} puan</p><div class="sbar"><i style="width:${Math.min(100,s.pts/max*100)}%"></i>${SEASON_T.map(([p])=>`<b style="left:${p/max*100}%"></b>`).join('')}</div>
    <div class="tiers">${tiers}</div>
    <div class="k8">SEZON SIRALAMASI</div>${seasonRivals().map((x,i)=>`<div class="rank ${x.me?'me':''}"><span class="pos">${i+1}</span><b style="flex:1">${esc(x.n)}</b><b class="num">${x.p}</b></div>`).join('')}
    <p class="hint">Puan: görev 10, proje bitirme 5, mega proje aşaması 15. Sezon sonunda ilk 4'e girene ödül.</p></div></div>
   <button class="btn" data-act="close">Kapat</button>`;
}
function openQuests(){openSheet(questHtml())}
// sayaçlar
startDesign=(o=>function(){const n=S.bld.length;o();if(S.bld.length>n){S.stats.started=(S.stats.started||0)+1}})(startDesign);
buyBiz=(o=>function(t,c){const n=S.biz.length;o(t,c);if(S.biz.length>n)S.stats.bizN=(S.stats.bizN||0)+1})(buyBiz);
buyShares=(o=>function(r,a){const m=S.money;o(r,a);if(S.money<m)S.stats.shareN=(S.stats.shareN||0)+1})(buyShares);
bid=(o=>function(){const a=S.auction&&S.auction.bids;o();if(S.auction&&S.auction.bids!==a)S.stats.bidN=(S.stats.bidN||0)+1})(bid);
complete=(o=>function(b,live){o(b,live);if(!b.kamu)seasonAdd(5)})(complete);
if(typeof mBuy==='function')mBuy=(o=>function(...a){const m=S.money;o(...a);if(S.money<m)S.stats.shareN=(S.stats.shareN||0)+1})(mBuy);
newDay=(o=>function(){o();try{rivalStrike()}catch(e){}if(!S.season)seasonInit();else if(S.day>=S.season.start+7)seasonEnd();dqGen()})(newDay);
migrate=(o=>function(){o();
  VEH.forEach(v=>{const st=S.veh[v.id]=S.veh[v.id]||{own:0,rented:0};if(st.own>1){S.money+=(st.own-1)*v.cost*0.6;st.own=1}st.rented=Math.min(st.rented,st.own)});
  S.stats.started=S.stats.started||0;S.megaDone=S.megaDone||[];if(S.mega&&!MEGAK[S.mega.id])S.mega=null;S.rivals.forEach(r=>{r.hos=r.hos||0});
  if(!S.season)seasonInit();if(!S.dq||S.dq.day!==S.day)dqGen();
})(migrate);
// ana ekran: görevler ve mahalle kutucukları
IC.quest='<svg viewBox="0 0 24 24"><path d="M9 5h10M9 12h10M9 19h10M4 5l1 1 2-2M4 12l1 1 2-2M4 19l1 1 2-2"/></svg>';
viewDash=(o=>function(){const h=o();const rd=dqReady();
  return h.replace(/<button class="stile wide" data-act="gotab" data-id="sehir">([\s\S]*?)<\/button>/,(m)=>tile('x9quests','',IC.quest,'#8b5cf6','Görevler',rd?`${rd} ödül hazır · sezon ${S.season?S.season.pts:0} puan`:`Günlük görevler · sezon ${S.season?S.season.pts:0} puan`,rd?'hot':'')
    +tile('gotab','sehir',IC.city,'#1f3b6e','Mahallem',`Gece ışıklı şehrin${readyGoals()?' · '+readyGoals()+' ödül':''}`))})(viewDash);
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el||el.closest('#splash'))return;const act=el.dataset.act,id=el.dataset.id,v=el.dataset.v;
  switch(act){
    case 'x9night':scene.night=!scene.night;render();break;
    case 'x9take':takeover(id);break;
    case 'x9war':warAct(id,v);break;
    case 'x9mega':megaStart(id);break;
    case 'x9quests':openQuests();break;
    case 'x9q':{const q=S.dq&&S.dq.list.find(x=>x.k===id);if(!q||q.done||dqProg(q)<q.t)break;q.done=true;S.money+=dqReward();seasonAdd(10);sfx('reward');coinBurst(e.clientX||innerWidth/2,e.clientY||innerHeight/2,10);openQuests();render();break}
    case 'x9qall':{if(!S.dq||S.dq.all||!S.dq.list.every(q=>q.done))break;S.dq.all=true;S.money+=dqReward();seasonAdd(10);sfx('reward');openQuests();render();break}
    case 'x9tier':{const i=+id,s=S.season;if(!s||s.got.includes(i)||s.pts<SEASON_T[i][0])break;s.got.push(i);S.money+=seasonReward(i);sfx('reward');vib([20,30,20]);toast(`${SEASON_T[i][1]} ödülü: +${fmt(seasonReward(i))}`,'good');openQuests();render();break}
    case 'hire':if(el.dataset.id)S.stats.hireN=(S.stats.hireN||0)+1;break;
  }
});
