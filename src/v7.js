
// ================= v7: harita, ilçe parsel kartları, projeler, proje detayı, ofis =================
let landList=false,mapFil='all',curProj=null;
const TIER7=[['Lüks','#d4503f',1.6],['Premium','#e58a1a',1.1],['Orta','#24957a',0.75],['Ekonomik','#7189a8',0]];
function tier7(dm){return TIER7.find(t=>dm>=t[2])}
const TRm2=v=>Math.round(v).toLocaleString('tr-TR')+' ₺';
const fx2=v=>v.toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2});
function cityAssets(cid,di){return S.plots.filter(p=>p.city===cid&&(di==null||p.di===di)).length+S.bld.filter(b=>b.city===cid&&!b.kamu&&(di==null||b.di===di)).length}
function adaOf(key,slot){return [100+hash(key+'ada'+Math.floor(slot/4))%880,1+hash(key+'p'+slot)%38]}

// ---------- ilçe haritası (Voronoi bölgeleri)
function clipPoly(poly,a,b,c){// a*x+b*y<=c tarafını tut
  const out=[];for(let i=0;i<poly.length;i++){const P=poly[i],Q=poly[(i+1)%poly.length];
    const pi=a*P[0]+b*P[1]-c,qi=a*Q[0]+b*Q[1]-c;
    if(pi<=0)out.push(P);if((pi<0&&qi>0)||(pi>0&&qi<0)){const t=pi/(pi-qi);out.push([P[0]+(Q[0]-P[0])*t,P[1]+(Q[1]-P[1])*t])}}
  return out;
}
function voronoi(pts,W,H){
  return pts.map((s,i)=>{let poly=[[0,0],[W,0],[W,H],[0,H]];
    pts.forEach((o,j)=>{if(i===j)return;const a=o[0]-s[0],b=o[1]-s[1];const mx=(o[0]+s[0])/2,my=(o[1]+s[1])/2;poly=clipPoly(poly,a,b,a*mx+b*my)});
    return poly});
}
const pd=poly=>'M'+poly.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+'Z';
function landShape(cid){
  const c=CITY[cid];
  if(cid==='istanbul')return {sea:`M0 182 C80 170 140 176 200 162 C226 150 222 120 226 96 C230 70 216 40 226 0 L242 0 C238 40 246 72 240 100 C236 130 250 150 280 166 C330 186 370 178 400 184 L400 220 L0 220Z`,
    labels:[[300,208,'MARMARA DENİZİ'],[120,16,'KARADENİZ'],[318,16,'KARADENİZ']]};
  if(c.sc&&c.sc.sea)return {sea:`M0 200 C90 186 160 204 240 192 C300 184 360 196 400 190 L400 220 L0 220Z`,labels:[[200,214,'DENİZ']]};
  const r=mulberry(hash('land'+cid));const pts=[];
  for(let k=0;k<36;k++){const a=k/36*Math.PI*2,n=1+(r()-0.5)*0.12;const ca=Math.cos(a),sa=Math.sin(a);
    const e=Math.pow(Math.pow(Math.abs(ca),4)+Math.pow(Math.abs(sa),4),-1/4);pts.push([200+ca*e*196*n,110+sa*e*106*n])}
  return {land:pd(pts.map(p=>[clamp(p[0],2,398),clamp(p[1],2,218)])),labels:[]};
}
function cityMap(cid){
  const c=CITY[cid],n=c.d.length,W=400,H=220;const pts=c.d.map((_,i)=>distPos(cid,i,n));
  const cells=voronoi(pts,W,H),ls=landShape(cid),uid7='m'+hash(cid)%9999;
  const clip=ls.sea?`<clipPath id="${uid7}" clip-rule="evenodd"><path clip-rule="evenodd" d="M0 0H400V220H0Z ${ls.sea}"/></clipPath>`:`<clipPath id="${uid7}"><path d="${ls.land}"/></clipPath>`;
  const ren=S.renew[cid]||[];
  const cellsH=cells.map((poly,i)=>{const dm=c.d[i][1],t=tier7(dm),mine=cityAssets(cid,i),fr=freeCount(cid,i);
    const dim=(mapFil==='mine'&&!mine)||(mapFil==='free'&&!fr);
    return `<path d="${pd(poly)}" fill="${t[1]}" class="v7cell${dim?' dim':''}" data-act="dist" data-id="${i}"/>`}).join('');
  const pins=pts.map(([x,y],i)=>{const dn=c.d[i][0],mine=cityAssets(cid,i),fr=freeCount(cid,i),k=ren.some(r=>(r.di||0)===i);
    const num=mapFil==='mine'?mine:fr;const show=mapFil!=='mine'||mine;
    return `<g class="v7pin${mine?' me':''}" data-act="dist" data-id="${i}" role="button" aria-label="${dn}">
      ${show?`<ellipse cx="${x}" cy="${y+1}" rx="5" ry="1.8" class="ps"/><path d="M${x} ${y}L${x-6.6} ${y-9}A9.5 9.5 0 1 1 ${x+6.6} ${y-9}Z" class="pc"/><circle cx="${x}" cy="${y-15}" r="6.8" class="pi"/><text x="${x}" y="${y-12}" class="pn">${num}</text>`:`<circle cx="${x}" cy="${y}" r="2.6" class="pd"/>`}
      ${k?`<circle cx="${x+12}" cy="${y-21}" r="6" class="pk"/><text x="${x+12}" y="${y-18.6}" class="pkt">D</text>`:''}
      <text x="${x}" y="${y+10}" class="pl">${dn}</text></g>`}).join('');
  const rr=mulberry(hash('blk'+cid));let blocks='';for(let k=0;k<260;k++){const x=rr()*400,y=rr()*220,w=2+rr()*4,h=2+rr()*3;blocks+=`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx=".6"/>`}
  let parks='';for(let k=0;k<14;k++){const x=rr()*400,y=rr()*220;parks+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(2+rr()*3).toFixed(1)}"/>`}
  const bridges=cid==='istanbul'?[[52,220,246],[104,224,244],[138,214,252]].map(([y,x1,x2])=>`<path d="M${x1} ${y}H${x2}" class="brg"/><path d="M${x1} ${y}H${x2}" class="brg2"/>`).join(''):'';
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="group" aria-label="${c.n} ilçe haritası">
   <defs>${clip}<pattern id="${uid7}w" width="30" height="16" patternUnits="userSpaceOnUse"><path d="M3 9q3.5-3.5 7 0t7 0" class="wave"/></pattern>
    <linearGradient id="${uid7}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fa9cc"/><stop offset="1" stop-color="#1f6f96"/></linearGradient>
    <radialGradient id="${uid7}h" cx=".3" cy=".2" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></radialGradient>
    <filter id="${uid7}f" x="-5%" y="-5%" width="110%" height="115%"><feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#0b3a52" flood-opacity=".45"/></filter></defs>
   <rect width="${W}" height="${H}" ${ls.sea?`fill="url(#${uid7}s)"`:'class="v7out"'}/><rect width="${W}" height="${H}" fill="url(#${uid7}w)" opacity="${ls.sea?1:.5}"/>
   <g filter="url(#${uid7}f)"><g clip-path="url(#${uid7})">${cellsH}<g class="blk">${blocks}</g><g class="prk">${parks}</g><rect width="400" height="220" fill="url(#${uid7}h)" pointer-events="none"/></g></g>
   ${ls.sea?`<path d="${ls.sea}" class="v7foam"/><path d="${ls.sea}" class="v7coast"/>`:`<path d="${ls.land}" class="v7foam"/><path d="${ls.land}" class="v7coast"/>`}${bridges}
   ${ls.labels.map(([x,y,t])=>`<text x="${x}" y="${y}" class="v7sl">${t}</text>`).join('')}
   <g transform="translate(${ls.sea&&cid==='istanbul'?380:22} ${ls.sea&&cid==='istanbul'?40:198})" class="cmp"><circle r="10"/><path d="M0 -8L2.6 0H-2.6Z" class="n"/><path d="M0 8L2.6 0H-2.6Z"/><text y="-11.5">K</text></g>
   ${pins}</svg>`;
}
function viewMap(cid){
  const c=CITY[cid],idx=S.idx[cid];
  const ren=(S.renew[cid]||[]).length,mineD=c.d.filter((_,i)=>cityAssets(cid,i)).length,plots=S.plots.length;
  const tiers=TIER7.map((t,i)=>{const lo=c.land*t[2]*idx,hi=i?c.land*TIER7[i-1][2]*idx:0;
    return `<div class="lg"><i style="background:${t[1]}"></i><b>${t[0]}</b><span>${i===0?fmt(lo)+' +':i===3?'< '+fmt(hi):fmt(lo)+'–'+fmt(hi)}</span></div>`}).join('');
  const locked=CITIES.filter(x=>!cityOpen(x)).length;
  return `<div class="v7h"><div class="tt"><small>${c.n.toLocaleUpperCase('tr-TR')} · ${c.d.length} İLÇE</small><b>İlçeni seç</b></div><span class="grow"></span>${ctrend(cid)}<span class="meta">Endeks ${fx2(idx)}</span><button class="v7new" data-act="x7list"><span><b>${locked?'Yeni şehir aç':'Şehir değiştir'}</b><small>${locked?locked+' şehir seni bekliyor':CITIES.length+' şehir açık'}</small></span><i>→</i></button></div>
   <div class="v7map">
    <div class="v7mapc">${cityMap(cid)}<button class="v7city" data-act="x7list"><svg viewBox="0 0 24 24"><path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>${c.n}<i>▾</i></button>
     <span class="v7hint">${mapFil==='mine'?`Rakam: varlığın · ${mineD} ilçedesin`:'Rakam: boş arsa · ilçeye dokun'}</span>${plots?`<button class="v7mine" data-act="x7plots"><b>Elindeki arsalar · ${plots}</b><small>İnşaat başlat ›</small></button>`:''}</div>
    <div class="v7side">
     <div class="k">GÖRÜNÜM</div>
     <div class="v7seg">${[['all','Tümü'],['mine','Projelerim'],['free','Boş arsa']].map(([k,nm])=>`<button data-act="x7fil" data-id="${k}" aria-pressed="${mapFil===k}">${nm}</button>`).join('')}</div>
     <div class="k">ARSA FİYATI (₺/m²)</div>${tiers}
     <div class="k">İŞARETLER</div>
     <div class="lg"><i class="pin k">D</i><b>Kentsel dönüşüm</b><span>${ren}</span></div>

    </div></div>`;
}

// ---------- parsel kartı çizimleri (kuşbakışı)
function roofSvg(x,y,w,h,kind,r){
  if(kind===0){const m=Math.min(w,h)/2;return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#c4583f"/><path d="M${x} ${y}L${x+m} ${y+m}L${x+w-m} ${y+m}L${x+w} ${y}M${x} ${y+h}L${x+m} ${y+h-m}L${x+w-m} ${y+h-m}L${x+w} ${y+h}M${x+m} ${y+m}V${y+h-m}M${x+w-m} ${y+m}V${y+h-m}" stroke="#9e3f2c" stroke-width="1" fill="none"/>`}
  let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${kind===1?'#a3a8ae':'#c9c2b4'}" stroke="#8b9096" stroke-width=".8"/>`;
  for(let i=0;i<2;i++)s+=`<rect x="${x+4+r()*(w-14)}" y="${y+4+r()*(h-14)}" width="7" height="5" fill="#eef0f2" stroke="#7d8288" stroke-width=".5"/>`;return s;
}
const ROOFC={ev:'#d0623f',villa:'#d0623f',apt:'#e3a04b',site:'#e3a04b',rez:'#7fa7c9',kule:'#6c8fb5',ofis:'#79a6c8',otel:'#d97a8a',avm:'#b9a36d',hastane:'#e8e8ef',fabrika:'#9aa6ad',depo:'#a9b0a0',yurt:'#d9a45b',stadyum:'#86b874',ozelokul:'#e0b057',marina:'#5aa9c9'};
function plotSvg(key,slot,pc,mode,b){
  const r=mulberry(hash('pl'+key+slot)),corner=hash('c'+key+slot)%4===0,ceph=cepheOf(key,slot,pc.s);
  const W=200,H=112,ry=84,x0=corner?26:0;
  const pw=clamp(ceph*3.1,56,110),pdp=clamp(pc.s/ceph*1.6,34,66),px=x0+(W-x0-pw)/2+(corner?-8:0),py=ry-6-pdp;
  let s=`<rect width="${W}" height="${H}" fill="#e6dfd2"/>`;
  // komşular
  const lw=px-x0-6,rw=W-(px+pw)-6;
  if(lw>14)s+=roofSvg(x0+3,py+4,lw,pdp-8,r()<0.5?0:1,r);
  if(rw>14)s+=roofSvg(px+pw+3,py+2,rw,pdp-4,r()<0.5?0:2,r);
  // arka sıra
  s+=`<rect x="${x0}" y="0" width="${W-x0}" height="${Math.max(4,py-6)}" fill="#d6cdbd"/>`;
  // yol + kaldırım
  s+=`<rect x="0" y="${ry-6}" width="${W}" height="6" fill="#cfc6b4"/><rect x="0" y="${ry}" width="${W}" height="${H-ry}" fill="#5d636b"/>`;
  for(let x=4;x<W;x+=16)s+=`<rect x="${x}" y="${ry+13}" width="9" height="2" fill="#f2f2f2"/>`;
  if(corner){s+=`<rect x="0" y="0" width="22" height="${ry}" fill="#5d636b"/><rect x="22" y="0" width="4" height="${ry}" fill="#cfc6b4"/>`;
    for(let y=6;y<ry-8;y+=16)s+=`<rect x="10" y="${y}" width="2" height="9" fill="#f2f2f2"/>`;
    for(let i=0;i<5;i++)s+=`<rect x="${2+i*4.4}" y="${ry+2}" width="2.6" height="10" fill="#f2f2f2"/>`}
  // parsel
  const grass=mode==='free'||mode==='plot'?'#93c66f':mode==='site'?'#c7a26a':'#b9c79d';
  s+=`<rect x="${px}" y="${py}" width="${pw}" height="${pdp}" fill="${grass}"/>`;
  if(b){const col=ROOFC[b.type]||'#e3a04b',n=clamp(b.bl||1,1,8),cols=Math.min(n,4),rows=Math.ceil(n/cols);
    const cw=(pw-8)/cols,chh=(pdp-8)/rows;
    for(let i=0;i<n;i++){const cx=px+4+(i%cols)*cw,cy=py+4+Math.floor(i/cols)*chh;
      if(b.done)s+=`<rect x="${cx+1.5}" y="${cy+1.5}" width="${cw-3}" height="${chh-3}" fill="${col}" stroke="rgba(0,0,0,.25)" stroke-width=".8"/><rect x="${cx+cw*0.3}" y="${cy+chh*0.3}" width="${cw*0.4}" height="${chh*0.4}" fill="rgba(255,255,255,.35)"/>`;
      else s+=`<rect x="${cx+1.5}" y="${cy+1.5}" width="${cw-3}" height="${chh-3}" fill="none" stroke="#8a6a3a" stroke-width="1.2" stroke-dasharray="3 2"/><rect x="${cx+2}" y="${cy+2}" width="${(cw-4)*b.prog}" height="${chh-4}" fill="${col}" opacity=".85"/>`}
    if(!b.done)s+=`<path d="M${px+pw-8} ${py+4}V${py+pdp-4}M${px+pw-8} ${py+6}H${px+8}" stroke="#f2b01e" stroke-width="2"/>`;
  }else if(mode==='rival'){s+=roofSvg(px+5,py+5,pw-10,pdp-10,hash(key+slot)%2?1:2,r)}
  // ağaçlar
  for(let x=x0+6;x<W;x+=22+r()*14){if(x>px-4&&x<px+pw+4&&mode!=='free')continue;s+=`<circle cx="${x}" cy="${ry-3}" r="3.6" fill="#4f9a45"/><circle cx="${x-1}" cy="${ry-4}" r="1.4" fill="#78bf5f"/>`}
  if(mode==='free'||mode==='plot'){
    s+=`<rect x="${px}" y="${py}" width="${pw}" height="${pdp}" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="4 3"/>`;
    [[px,py],[px+pw,py],[px,py+pdp],[px+pw,py+pdp]].forEach(([x,y])=>s+=`<circle cx="${x}" cy="${y}" r="2.4" fill="#ffb020" stroke="#fff" stroke-width=".8"/>`);
  }
  s+=`<rect x="${px+pw/2-14}" y="${py+pdp-5}" width="28" height="10" rx="5" fill="rgba(30,30,30,.75)"/><text x="${px+pw/2}" y="${py+pdp+2.3}" class="dim">${ceph} m</text>`;
  s+=`<g transform="translate(${W-12} 11)"><circle r="7.5" fill="rgba(30,30,30,.7)"/><path d="M0 -5.5l2.6 4h-5.2z" fill="#ffb020"/><text y="5" class="nk">K</text></g>`;
  s+=`<path d="M6 ${H-6}h24M6 ${H-8}v4M30 ${H-8}v4" stroke="#fff" stroke-width="1"/><text x="34" y="${H-3.5}" class="sc">10 m</text>`;
  return {svg:`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${s}</svg>`,corner,ceph};
}
function oldBldSvg(seed,year){
  const r=mulberry(hash('ob'+seed));let s=`<defs><linearGradient id="sk${seed%999}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0ea"/><stop offset="1" stop-color="#e8f3f6"/></linearGradient></defs><rect width="200" height="112" fill="url(#sk${seed%999})"/>`;
  s+=`<rect x="0" y="40" width="40" height="72" fill="#c8c2b6"/><rect x="160" y="30" width="40" height="82" fill="#bdb7aa"/>`;
  for(let y=48;y<96;y+=12){s+=`<rect x="6" y="${y}" width="9" height="7" fill="#8fa2b2"/><rect x="22" y="${y}" width="9" height="7" fill="#8fa2b2"/><rect x="167" y="${y-6}" width="9" height="7" fill="#8fa2b2"/><rect x="183" y="${y-6}" width="9" height="7" fill="#8fa2b2"/>`}
  s+=`<rect x="44" y="18" width="112" height="86" fill="#e2c89a"/><rect x="44" y="14" width="112" height="6" fill="#b55a3c"/>`;
  for(let f=0;f<5;f++){const y=24+f*16;s+=`<rect x="44" y="${y+12}" width="112" height="2" fill="#c7ab7c"/>`;
    for(let k=0;k<5;k++){const x=50+k*21;const lit=r()<0.3;s+=`<rect x="${x}" y="${y}" width="13" height="10" fill="${lit?'#ffd36b':'#5f7384'}" stroke="#f3e6cc" stroke-width="1"/>`}}
  s+=`<path d="M70 20l6 14-5 10 8 16-4 12 6 14" stroke="#4a3a2a" stroke-width="1.6" fill="none"/><path d="M128 36l-5 12 6 10-7 18" stroke="#4a3a2a" stroke-width="1.4" fill="none"/>`;
  s+=`<path d="M44 58q20 6 40 0" stroke="rgba(80,60,30,.25)" stroke-width="5" fill="none"/><rect x="0" y="104" width="200" height="8" fill="#7a7f86"/>`;
  s+=`<rect x="92" y="88" width="16" height="16" fill="#6b4a30"/>`;
  return `<svg viewBox="0 0 200 112" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${s}</svg>`;
}
function rivalOf(key,slot){return S.rivals[hash('rv'+key+slot)%S.rivals.length]}
function viewDistrict7(cid,di){
  const c=CITY[cid],[dn,dm]=c.d[di],d=getDist(cid,di),key=dkey(cid,di),t=tier7(dm);
  const m2p=c.land*dm*S.idx[cid];const ch=S.idx[cid]/S.prevIdx[cid]-1;
  // ilçe patronu
  const tally={};let me=0;d.p.forEach((pc,i)=>{if(pc.o==='r'){const rv=rivalOf(key,i);tally[rv.n]=(tally[rv.n]||0)+1}else if(pc.o==='me'||pc.o==='b')me++});
  let lead=[S.company,me];Object.entries(tally).forEach(([n,k])=>{if(k>lead[1])lead=[n,k]});
  const cards=d.p.map((pc,i)=>{
    const myPlot=S.plots.find(p=>p.key===key&&p.slot===i),myB=S.bld.find(b=>b.key===key&&b.slot===i);
    const mode=myB?'site':myPlot?'plot':pc.o==='r'?'rival':pc.o==='b'?'sold':'free';
    const art=plotSvg(key,i,pc,mode,myB||(pc.o==='b'?{type:'apt',done:1,bl:2}:null));const [ada,par]=adaOf(key,i);const em=emsalOf(key,i);
    const pr=parcelPrice(cid,di,pc);
    const st=myB?['PROJEN','me']:myPlot?['SENİN','me']:pc.o==='r'?['SATILDI','x']:pc.o==='b'?['TÜKENDİ','x']:['SATILIK','ok'];
    const foot=myB?`<b>${esc(myB.name)}</b><span>${myB.done?`${myB.units.filter(u=>u==='sold'||u==='owner').length}/${myB.units.length}`:'%'+Math.floor(myB.prog*100)} ›</span>`
      :myPlot?`<b class="go">İnşaat başlat</b><span>›</span>`:pc.o==='r'?`<b class="mut">${esc(rivalOf(key,i).n)}</b><span></span>`:pc.o==='b'?`<b class="mut">Projen tamamen satıldı</b><span></span>`:`<b class="go">Satın al</b><span>›</span>`;
    const deal=!pc.o&&pc.f<0.9?'<span class="tag g">FIRSAT</span>':'';
    const tag=`<button class="pk ${pc.o&&pc.o!=='me'?'off':''} ${myPlot||myB?'mine':''}" data-act="parcel" data-id="${i}" ${pc.o&&pc.o!=='me'?'disabled':''}>
      <span class="pa">${art.svg}${art.corner?'<span class="tag">KÖŞE</span>':''}${deal}</span>
      <span class="pb"><span class="r1"><span class="k">ARSA ${i+1}</span><span class="st ${st[1]}">${st[0]}</span></span>
       <b class="big">${m2(pc.s)}</b>${pc.o&&!myPlot?`<span class="pr mut">${fmt(pr)} değerinde</span>`:`<span class="pr">${fullTL(pr)}</span>`}
       <small>${TRm2(pr/pc.s)}/m² · Ada ${ada} / ${par}</small><small>Emsal ${fx2(em)} · ${art.ceph} m cephe</small></span>
      <span class="pf">${foot}</span></button>`;
    return tag;
  });
  const ren=(S.renew[cid]||[]).filter(r=>(r.di||0)===di).map(r=>{const em=2.4;const cap=Math.max(r.owners+2,Math.round(r.size*em/110));
    return `<button class="pk ren" data-act="x7ren" data-city="${cid}" data-id="${r.id}"><span class="pa">${oldBldSvg(hash(r.id),r.year)}<span class="tag o">DÖNÜŞÜM</span><span class="tag r br">RİSKLİ YAPI</span></span>
     <span class="pb"><span class="r1"><span class="k o">DÖNÜŞÜM ALANI</span></span><b class="big">${r.owners} daire · ${r.year}</b><span class="pr">${fullTL(r.cost)}</span>
      <small class="g">Yeni imar: ${cap} daireye kadar</small><span class="r1"><small class="k2">HAK SAHİPLERİ</small><b>${r.owners} kişi</b></span>
      <span class="hb"><i style="width:100%"></i></span></span>
     <span class="pf o"><b>Görüşmeye başla</b><span>›</span></span></button>`});
  // anahtarı olmayan arsalar (dönüşüm, ihale) ve üzerlerindeki projeler
  const extra=[...S.plots.filter(p=>p.city===cid&&(p.di??0)===di&&p.key==null),...S.bld.filter(b=>b.city===cid&&!b.kamu&&(b.di??0)===di&&b.key==null)].map(x=>{
    const isB=!!S.bld.includes(x),fk='x'+x.id,pc={s:x.size||500};const art=plotSvg(fk,0,pc,isB?'site':'plot',isB?x:null);const [ada,par]=adaOf(fk,0);
    return `<button class="pk mine" data-act="${isB?'x7proj':'build'}" data-id="${x.id}"><span class="pa">${art.svg}<span class="tag ${x.renewal?'o':''}">${x.renewal?'DÖNÜŞÜM':'İHALE'}</span></span>
     <span class="pb"><span class="r1"><span class="k">${x.renewal?esc(x.renewal).slice(0,16):'İHALE ARSASI'}</span><span class="st me">${isB?'PROJEN':'SENİN'}</span></span><b class="big">${m2(x.size||0)}</b>
      <span class="pr">${fmt(fairLand(cid,x.size||0,x.dm||1))} değerinde</span><small>Ada ${ada} / ${par}${x.owners?` · ${x.owners} hak sahibi`:''}</small><small>${art.ceph} m cephe</small></span>
     <span class="pf">${isB?`<b>${esc(x.name)}</b><span>${x.done?'Bitti':'%'+Math.floor(x.prog*100)} ›</span>`:'<b class="go">İnşaat başlat</b><span>›</span>'}</span></button>`});
  if(ren.length)cards.splice(1,0,...ren);
  if(extra.length)cards.unshift(...extra);
  const L=level(),free=d.p.map((pc,i)=>pc.o?0:pc.s).sort((a,b)=>b-a);
  const fits=TYPES.filter(t=>t.lvl<=L&&t.min>=1500).map(t=>{const k=free.filter(s=>s>=t.min).length;return k?`${t.n}: ${k} arsaya sığar`:null}).filter(Boolean).slice(0,4);
  return `<div class="v7h"><button class="v7back" data-act="backdist">‹ Harita</button><div class="tt"><small>${c.n.toLocaleUpperCase('tr-TR')} · ARSA PORTFÖYÜ</small><b>${dn}</b></div>
    <div class="v7chips"><span class="cp o">Ort. ${TRm2(m2p)}/m²</span><span class="cp" style="--c:${t[1]}">${t[0]}</span><span class="cp g">${d.p.length} arsadan ${freeCount(cid,di)} boş</span>
     <span class="cp ${ch>=0?'g':'r'}">${ch>=0?'▲':'▼'} %${Math.abs(ch*100).toLocaleString('tr-TR',{maximumFractionDigits:1})}</span>
     <span class="cp lead">♛ ${dn} patronu: <b>${esc(lead[0])}</b> · ${lead[1]} arsa</span></div></div>
   <div class="v7car" id="v7car">${cards.join('')}</div>
   <div class="v7foot"><span class="dots">${cards.map((_,i)=>i%2?'':'<i></i>').join('')}</span><span class="meta">${fits.length?fits.join(' · '):'Büyük projeler için 1.500 m² üstü arsalara bak. Tapu harcı %'+(harcRate()*100).toLocaleString('tr-TR')+'.'}</span>
    <button class="v7arrow" data-act="x7scroll" aria-label="Kaydır">›</button></div>`;
}
const viewLand6=viewLand,viewCity6=viewCity;
viewLand=function(){
  if(curCity)return viewCity(curCity);
  if(landList)return `<div class="v7h"><button class="v7back" data-act="x7map0">‹ Harita</button><div class="tt"><small>TÜRKİYE VE DÜNYA</small><b>Şehrini seç</b></div></div>`+viewLand6().replace('<h2>Arsalar</h2>','');
  curCity=CITY[S.view]&&cityOpen(CITY[S.view])?S.view:'istanbul';return viewCity(curCity);
};
viewCity=function(cid){
  const c=CITY[cid];
  if(c.abroad&&!S.branches[cid])return viewCity6(cid).replace('data-act="back">‹ İller','data-act="x7list">‹ Şehirler');
  if(curDist!=null)return viewDistrict7(cid,curDist);
  return viewMap(cid);
};
parcelSheet=(o=>function(cid,di,slot){
  const myB=S.bld.find(b=>b.key===dkey(cid,di)&&b.slot===slot);if(myB){openProj(myB.id);return}
  o(cid,di,slot);
})(parcelSheet);
function renSheet(cid,id){
  const r=(S.renew[cid]||[]).find(x=>x.id===id);if(!r)return;const c=CITY[cid];
  openSheet(`<div class="offer"><div class="ofimg" style="width:200px">${oldBldSvg(hash(r.id),r.year)}</div><div class="grow" style="min-width:0;display:flex;flex-direction:column;gap:8px">
   <span class="pill r" style="align-self:flex-start">Riskli yapı · ${r.year}</span><h2>${r.name}</h2>
   <p class="hint">${c.n} ${c.d[r.di||0][0]}'de ${m2(r.size)} arsa üzerinde. ${r.owners} hak sahibiyle anlaşırsan eski bina yıkılır, arsa sana geçer. Yeni binada her birine bir daire verirsin.</p>
   <div class="grid3"><div class="tile"><div class="k">Anlaşma bedeli</div><div class="v">${fmt(r.cost)}</div></div><div class="tile"><div class="k">Arsa değeri</div><div class="v">${fmt(fairLand(cid,r.size,r.dm||1))}</div></div><div class="tile"><div class="k">Hak sahibi</div><div class="v">${r.owners}</div></div></div>
   <div class="row"><button class="btn" data-act="close">Vazgeç</button><button class="btn primary grow" data-act="x7renok" data-city="${cid}" data-id="${r.id}">Anlaşmayı imzala · ${fmt(r.cost)}</button></div></div></div>`);
}

// ---------- projeler listesi
const viewProj6=viewProj;
function bStatus(b){if(!b.done)return ['İNŞAAT','y'];if(b.units.includes('listing'))return ['SATIŞTA','b'];if(b.units.includes('rented'))return ['KİRADA','g'];
  if(b.units.every(u=>u==='sold'||u==='owner'))return ['SATILDI','m'];return ['BİTTİ','o']}
function bDays(b){return b.kamu?b.days:(b.dd||TYPE[b.type].days*QUAL[b.q||'std'].days)}
function bLeft(b){const sp=speed(b.city);return sp>0?(1-b.prog)*bDays(b)/sp:Infinity}
function dName(b){return b.kamu?CITY[b.city].n:(b.di!=null?CITY[b.city].d[b.di][0]:CITY[b.city].n)}
function bMeta(b){if(b.kamu)return `${CITY[b.city].n} · Kamu projesi`;const t=TYPE[b.type],R=DZ[b.type]||{};
  return `${dName(b)} · ${b.units.length} ${t.uname}${b.bl>1?` · ${b.bl} ${R.each?'villa':'blok'}`:''}${b.fl?` · ${b.fl} kat`:''}`}
viewProj=function(){
  if(ptab!=='mine')return viewProj6();
  if(curProj){const b=S.bld.find(x=>x.id===curProj);if(b)return viewProjDetail(b);curProj=null}
  const offers=(S.offers||[]).length,jobs=(S.jobs||[]).length;
  const cnt={all:S.bld.length,doing:S.bld.filter(b=>!b.done).length,sale:S.bld.filter(b=>b.units.includes('listing')).length,rent:S.bld.filter(b=>b.units.includes('rented')).length,done:S.bld.filter(b=>b.done).length};
  const chips=`<div class="v7pc">${[['all','Tümü'],['doing','İnşaatta'],['sale','Satışta'],['rent','Kirada'],['done','Bitti']].map(([k,n])=>`<button data-act="xpfil" data-id="${k}" aria-pressed="${pfil===k}">${n} · ${cnt[k]}</button>`).join('')}
    <span class="sep"></span><button data-act="xptab" data-id="offers">Teklifler · ${offers}</button><button data-act="xptab" data-id="jobs">Sözleşmeli · ${jobs}</button>
    <span class="grow"></span><span class="rent">Kira geliri <b>+${fmt(dailyRent())}/gün</b></span></div>`;
  const head=`<div class="v7h"><div class="tt"><small>${S.stats.built} TAMAMLANDI · ${S.bld.length} PROJE</small><b>Projeler</b></div></div>`;
  if(!S.bld.length)return head+chips+`<div class="v7empty"><b>Henüz projen yok</b><p class="hint">Arsalar haritasından bir ilçe seç, boş bir parsel al ve üzerine inşaat başlat.</p><button class="btn primary" data-act="gotab" data-id="land">Arsa seç ›</button></div>`;
  let list=S.bld.filter(b=>pfil==='all'||(pfil==='doing'?!b.done:pfil==='sale'?b.units.includes('listing'):pfil==='rent'?b.units.includes('rented'):b.done));
  list=[...list.filter(b=>!b.done).sort((a,b)=>b.prog-a.prog),...list.filter(b=>b.done).reverse()];
  const f=list[0];
  const feat=f?(()=>{const st=bStatus(f),left=bLeft(f);
    return `<div class="v7feat"><span class="art"><img src="${pThumb(f,460,170)}" alt=""><span class="tag ${st[1]}">● ${st[0]}</span><span class="nm"><b>${esc(f.name)}</b><small>${bMeta(f)}</small></span></span>
     ${f.done?`<span class="units">${f.units.map(u=>`<i class="u u-${u}"></i>`).join('')}</span>`:`<span class="prog"><i style="width:${f.prog*100}%"></i></span>`}
     <span class="fst">${f.done?`<span><small>BİRİM DEĞERİ</small><b>${fmt(unitValue(f))}</b></span><span><small>KİRADA</small><b>${f.units.filter(u=>u==='rented').length}/${f.units.length}</b></span><span><small>KİRA / GÜN</small><b>${fmt(unitRent(f)*f.units.filter(u=>u==='rented').length)}</b></span>`
       :`<span><small>İLERLEME</small><b class="o">%${Math.floor(f.prog*100)}</b></span><span><small>KALAN</small><b>${left===Infinity?'durdu':Math.ceil(left)+' gün'}</b></span><span><small>MALİYET</small><b>${fmt(f.invest||0)}</b></span>`}</span>
     <button class="btn primary big" data-act="x7proj" data-id="${f.id}">Projeye git ›</button></div>`})():'<div class="v7feat empty"><p class="hint">Bu filtrede proje yok.</p></div>';
  const risk=atRisk();
  const banners=(risk.length?`<button class="v7ban warn" data-act="xreinfall"><span>⚠ Deprem riski: ${risk.length} binan risk altında</span><b>Güçlendir · ${fmt(risk.reduce((a,b)=>a+reinfCost(b),0))} ›</b></button>`:'')
    +(offers?`<button class="v7ban" data-act="xptab" data-id="offers"><span>${offers} müşteri senden proje istiyor</span><b>Teklifler ›</b></button>`:'')
    +(S.strike>0?`<div class="v7ban bad"><span>İşçi grevi: inşaatlar ${S.strike} gün duracak</span></div>`:'');
  const grid=list.slice(1).map(b=>{const st=bStatus(b);const occ=b.done?b.units.filter(u=>u!=='empty').length/b.units.length:b.prog;
    return `<button class="v7card" data-act="x7proj" data-id="${b.id}"><span class="art"><img src="${pThumb(b,260,92)}" alt="" loading="lazy"></span>
     <small class="st ${st[1]}">${st[0]}</small><b>${esc(b.name)}</b><small>${dName(b)} · ${b.units.length} ${b.kamu?'kamu':TYPE[b.type].uname}</small><span class="prog"><i style="width:${occ*100}%"></i></span></button>`}).join('');
  return head+chips+`<div class="v7pl">${feat}<div class="v7pr">${banners}<div class="v7grid">${grid||(list.length<2?`<button class="v7card new" data-act="gotab" data-id="land"><span class="plus">+</span><b>Yeni proje</b><small>Arsa seç</small></button>`:'')}</div></div></div>`;
};
const PHASES=[[0.15,'Hafriyat ve temel'],[0.5,'Temel ve kaba inşaat'],[0.8,'İnce işler'],[1.01,'Peyzaj ve teslim']];
function finishCost(b){return Math.max(1e5,Math.round((b.invest||5e6)*(1-b.prog)*0.3/1e4)*1e4)}
function rushCost(b){return Math.max(5e4,Math.round((b.invest||5e6)*Math.min(1-b.prog,2/bDays(b))*0.18/1e4)*1e4)}
function sceneArt(b){
  const W=520,H=380,k='d|'+b.id+'|'+Math.floor((b.done?1:b.prog)*40)+'|'+S.wx.k;if(thumbCache[k])return thumbCache[k];
  const cv=document.createElement('canvas');cv.width=W*2;cv.height=H*2;const ctx=cv.getContext('2d');ctx.scale(2,2);
  const gy=H-58;const n=drawSky(ctx,W,H,gy,0.42,b.city||'istanbul',0,S.wx.k==='storm'?'rain':S.wx.k);
  const sp=spec(b);const s=Math.min((gy-30)/(sp.h+(b.done?20:50)),(W*0.7)/(sp.W+16),2.2);
  ctx.save();ctx.translate((W-sp.W*s)/2,gy);ctx.scale(s,s);drawBuilding(ctx,b,0,0,n,800,CITY[b.city]||{sc:{},tour:0});ctx.restore();
  drawGround(ctx,W,H,gy,n);
  if(!b.done){// şantiye panosu
    ctx.fillStyle='#24384a';ctx.fillRect(W*0.08,gy-30,150,26);ctx.fillStyle='#ffb020';ctx.font='700 11px Nunito,sans-serif';ctx.fillText(String(b.name).slice(0,22),W*0.08+8,gy-18);
    ctx.fillStyle='#fff';ctx.font='600 9px Nunito,sans-serif';ctx.fillText('YAKINDA · '+(S.company||'').slice(0,18),W*0.08+8,gy-8);
    // mikser
    const mx=W*0.68,my=gy+20;ctx.fillStyle='#fff';ctx.fillRect(mx,my-14,26,14);ctx.fillStyle='#f28c28';ctx.beginPath();ctx.ellipse(mx+44,my-12,22,10,-0.15,0,7);ctx.fill();
    ctx.fillStyle='#333';[mx+6,mx+30,mx+56].forEach(x=>{ctx.beginPath();ctx.arc(x,my+1,4.5,0,7);ctx.fill()});
  }
  return thumbCache[k]=cv.toDataURL();
}
function viewProjDetail(b){
  const t=TYPE[b.type],R=DZ[b.type]||{},key=b.key,em=key!=null?emsalOf(key,b.slot):2,ce=key!=null?cepheOf(key,b.slot,b.size):Math.round(Math.sqrt(b.size||400)*0.8);
  const [ada,par]=key!=null?adaOf(key,b.slot):[100+hash(b.id)%800,1+hash(b.id+'p')%30];
  const head=`<div class="v7h"><button class="v7back" data-act="x7plist">‹ Projeler</button><div class="tt"><small>${dName(b).toLocaleUpperCase('tr-TR')} · ADA ${ada} / PARSEL ${par}</small><b>${esc(b.name)}</b></div></div>`;
  const st=bStatus(b);
  const tiles=`<div class="v7tiles"><div><small>ALAN</small><b>${m2(b.size||0)}</b></div><div><small>EMSAL</small><b>${fx2(em)}</b></div><div><small>CEPHE</small><b>${ce} m</b></div><div><small>PİYASA</small><b class="${S.idx[b.city]>=1?'g':'r'}">×${fx2(S.idx[b.city])}</b></div></div>`;
  let body;
  if(!b.done){const left=bLeft(b),ph=PHASES.find(p=>b.prog<p[0])[1];
    const plan=R.opt&&b.opt!=null?OPTS[R.opt].o[b.opt][0]:'—',pl=R.opt==='konsept'?'KONSEPT':R.opt==='boy'?'BİRİM':'PLAN';
    body=`<div class="v7site"><div class="r1"><small class="k o">${S.strike>0?'GREV · ŞANTİYE DURDU':'ŞANTİYE AKTİF'}</small><b>${left===Infinity?'durdu':left.toLocaleString('tr-TR',{maximumFractionDigits:1})+' gün kaldı'}</b></div>
      <b class="ph">${b.kamu?'Kamu binası inşaatı':ph}</b><div class="r2"><span class="prog"><i style="width:${b.prog*100}%"></i></span><b class="o">%${Math.floor(b.prog*100)}</b></div>
      <div class="spec"><span><small>${b.kamu?'TÜR':R.each?'VİLLA':(R.bn||'BLOK').toLocaleUpperCase('tr-TR')}</small><b>${b.kamu?'Kamu':b.bl||1}</b></span><span><small>KAT</small><b>${b.fl||'—'}</b></span><span><small>${pl}</small><b>${plan}</b></span><span><small>KALİTE</small><b>${QUAL[b.q||'std'].n}</b></span></div>
      <div class="r3"><button class="btn bad" data-act="x7finish" data-id="${b.id}">Hemen bitir · ${fmt(finishCost(b))}</button><button class="btn primary" data-act="x7rush" data-id="${b.id}">▶ Hızlandır −2 gün · ${fmt(rushCost(b))}</button></div></div>`;
  }else{const cnt=k=>b.units.filter(u=>u===k).length;const e=cnt('empty'),l=cnt('listing'),r=cnt('rented'),s=cnt('sold'),o=cnt('owner');const rc=repairCost(b);
    body=`<div class="v7site"><div class="r1"><small class="k g">● ${st[0]}</small><b>Bakım %${Math.round(b.cond)}</b></div>
      <div class="units big">${b.units.map(u=>`<i class="u u-${u}"></i>`).join('')}</div>
      <div class="spec"><span><small>BOŞ</small><b>${e}</b></span><span><small>SATIŞTA</small><b class="b">${l}</b></span><span><small>KİRADA</small><b class="g">${r}</b></span><span><small>SATILDI</small><b>${s+o}</b></span></div>
      <div class="spec"><span><small>BİRİM DEĞERİ</small><b>${fmt(unitValue(b))}</b></span><span><small>BİRİM KİRASI</small><b>${fmt(unitRent(b))}/gün</b></span><span><small>DEPREM</small><b class="${b.reinf?'g':'r'}">${b.reinf?'Dayanıklı':'Riskli'}</b></span></div>
      <div class="r3 wrap">${e?`<button class="btn primary small" data-act="list" data-id="${b.id}">Satışa çıkar (${e})</button><button class="btn good small" data-act="rent" data-id="${b.id}">Kirala (${e})</button>`:''}
       ${l?`<button class="btn small" data-act="unlist" data-id="${b.id}">Satıştan çek</button>`:''}${(e+l)?`<button class="btn small" data-act="quick" data-id="${b.id}">Hızlı sat −%15</button>`:''}
       ${r?`<button class="btn small" data-act="sellrented" data-id="${b.id}">Kiracılı sat</button><button class="btn small" data-act="evict" data-id="${b.id}">Tahliye</button>`:''}
       ${rc>0&&b.cond<95?`<button class="btn small" data-act="repair" data-id="${b.id}">Tadilat ${fmt(rc)}</button>`:''}${!b.reinf&&!b.kamu?`<button class="btn small" data-act="xreinf" data-id="${b.id}">Güçlendir ${fmt(reinfCost(b))}</button>`:''}</div>
      ${r||e?`<div class="seg" style="grid-template-columns:repeat(4,1fr)" role="group" aria-label="Kira seviyesi">${RR.map(([v,nm])=>`<button data-act="rr" data-id="${b.id}" data-v="${v}" aria-pressed="${b.rr===v}">Kira: ${nm}</button>`).join('')}</div>`:''}</div>`}
  const nw=S.news[0];
  return head+`<div class="v7det"><div class="scn"><img src="${sceneArt(b)}" alt=""><span class="tag ${st[1]}">● ${b.done?'TAMAMLANDI':'İNŞAAT SÜRÜYOR'} · %${Math.floor((b.done?1:b.prog)*100)}</span></div>
    <div class="rt">${tiles}${body}<div class="v7news"><span class="nw"><i></i>${nw?esc(nw.txt):'Şantiyede her şey yolunda.'}</span><button class="btn" data-act="x7map" data-city="${b.city}" data-id="${b.di??''}">Harita</button></div></div></div>`;
}
function openProj(id){closeSheet();ptab='mine';curTab='proj';curCity=null;curDist=null;S.projAlert=false;curProj=id;render();$('#main').scrollTop=0}
go=(o=>function(t){curProj=null;landList=false;o(t)})(go);
viewDash=(o=>function(){
  const doing=S.bld.filter(b=>!b.done).sort((a,b)=>b.prog-a.prog),done=S.bld.filter(b=>b.done);
  const ids=[...doing.slice(0,2).map(b=>b.id)];if(doing.length<2)ids.push(...done.slice(0,2-doing.length).map(b=>b.id));
  let i=0;return o().replace(/class="pc" data-act="gotab" data-id="proj"/g,m=>{const id=ids[i++];return id?`class="pc" data-act="x7proj" data-id="${id}"`:m});
})(viewDash);

// ---------- ofis
const OFFICE_D=[
  {wall:'#a7adb3',floor:'#8f949a',win:1,desks:1,ppl:1,tag:'Kepenkli garajda iki masa, bir hayal.'},
  {wall:'#f1e3cf',floor:'#c99a6b',win:1,desks:2,ppl:2,tag:'Sokağa bakan küçük bir büro.'},
  {wall:'#e9eef2',floor:'#b98d62',win:2,desks:4,ppl:4,tag:'Tüm kat senin, toplantı odası bile var.'},
  {wall:'#dfe6ee',floor:'#9fa7b0',win:3,desks:6,ppl:6,tag:'Plazada cam duvarlı açık ofis.'},
  {wall:'#2f3442',floor:'#5b4636',win:4,desks:3,ppl:5,tag:'Şehrin tepesinde genel merkez.'},
];
function officeArt(lv){
  const D=OFFICE_D[lv],r=mulberry(77+lv),W=440,H=240,fy=168;let s='';
  s+=`<rect width="${W}" height="${H}" fill="${D.wall}"/>`;
  // pencereler
  const sky=lv===4?['#ff9f6b','#ffd29a']:['#8ccbe8','#dff2fa'];
  s+=`<defs><linearGradient id="osk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>`;
  const wins=lv===0?[[300,40,110,120,'shutter'],[40,46,60,40]]:lv===1?[[250,34,130,96]]:lv===2?[[40,34,120,96],[260,34,140,96]]:lv===3?[[20,22,400,124]]:[[0,14,440,140]];
  wins.forEach(([x,y,w,h,kind])=>{
    if(kind==='shutter'){s+=`<rect x="${x}" y="${y}" width="${w}" height="${h+8}" fill="#7d8389"/>`;for(let yy=y+4;yy<y+h;yy+=7)s+=`<rect x="${x+2}" y="${yy}" width="${w-4}" height="3" fill="#959ba1"/>`;s+=`<rect x="${x+w/2-10}" y="${y+h-6}" width="20" height="4" fill="#5d6268"/>`;return}
    s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#osk)"/>`;
    let bx=x;while(bx<x+w){const bw=10+r()*22,bh=(lv>=3?30:14)+r()*(lv>=3?h*0.7:h*0.4);s+=`<rect x="${bx}" y="${y+h-bh}" width="${Math.min(bw,x+w-bx)}" height="${bh}" fill="${lv===4?'#6a5b7a':'#8aa3b8'}" opacity="${0.55+r()*0.4}"/>`;
      if(lv>=3)for(let wy=y+h-bh+4;wy<y+h-4;wy+=7)s+=`<rect x="${bx+3}" y="${wy}" width="${Math.max(2,Math.min(bw,x+w-bx)-6)}" height="2" fill="${lv===4?'#ffd88a':'#dceaf4'}" opacity=".7"/>`;bx+=bw+2}
    s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${lv===4?'#1c1f28':'#fff'}" stroke-width="5"/>`;
    const seg=lv>=3?Math.round(w/80):1;for(let i=1;i<=seg;i++)s+=`<rect x="${x+w*i/(seg+1)-1.5}" y="${y}" width="3" height="${h}" fill="${lv===4?'#1c1f28':'#fff'}"/>`;
  });
  // zemin
  s+=`<rect x="0" y="${fy}" width="${W}" height="${H-fy}" fill="${D.floor}"/>`;
  s+=`<defs><linearGradient id="ofl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
   <linearGradient id="oray" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
   <radialGradient id="ovig" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient></defs>`;
  s+=`<rect x="0" y="${fy}" width="${W}" height="22" fill="url(#ofl)"/><rect x="0" y="${fy-5}" width="${W}" height="5" fill="${lv===4?'#1c1f28':'rgba(0,0,0,.18)'}"/>`;
  if(lv>0){s+=`<ellipse cx="${W/2}" cy="${fy+44}" rx="${120+lv*20}" ry="20" fill="${['','#b5523f','#4f6fa8','#7c8a9a','#8a2f3c'][lv]}" opacity=".55"/><ellipse cx="${W/2}" cy="${fy+44}" rx="${108+lv*20}" ry="15" fill="none" stroke="#fff" stroke-opacity=".35" stroke-dasharray="4 3"/>`;
    wins.forEach(([x,y,w,h,kind])=>{if(kind)return;s+=`<path d="M${x} ${y+h}L${x+w} ${y+h}L${x+w+60} ${fy+60}L${x+40} ${fy+60}Z" fill="url(#oray)" opacity=".5"/>`});}
  // tavan ve lambalar
  s+=`<rect x="0" y="0" width="${W}" height="10" fill="${lv===4?'#14161d':'rgba(0,0,0,.12)'}"/>`;
  if(lv>=1)[110,220,330].forEach(x=>s+=`<rect x="${x-22}" y="10" width="44" height="4" rx="2" fill="${lv===4?'#ffd88a':'#fffbe8'}"/><path d="M${x-22} 14L${x-40} 60H${x+40}L${x+22} 14Z" fill="#fff8d0" opacity=".12"/>`);
  if(lv===1||lv===2)s+=`<rect x="${lv===1?150:40}" y="${lv===1?40:140}" width="${lv===1?58:0}" height="${lv===1?40:0}" fill="#fff" stroke="#8a6a44" stroke-width="3"/>${lv===1?'<path d="M154 76l14-16 10 10 8-6 18 12z" fill="#43b394"/><circle cx="190" cy="50" r="5" fill="#ffb020"/>':''}`;
  if(lv===0)s+=`<ellipse cx="120" cy="${fy+44}" rx="30" ry="7" fill="rgba(0,0,0,.18)"/><path d="M220 0v22" stroke="#333"/><circle cx="220" cy="26" r="5" fill="#ffe38a"/>`;
  else for(let x=0;x<W;x+=lv===3?40:28)s+=`<path d="M${x} ${fy}V${H}" stroke="rgba(0,0,0,.08)"/>`;
  // logo
  if(lv>0){const lx=lv===3?200:lv===4?196:lv===2?180:60,ly=lv>=3?lv===4?150:148:52;
    if(lv<3)s+=`<g transform="translate(${lx} ${ly})">${logoSvg(40)}</g>`;}
  // masalar
  const pos=lv===4?[[60,'sofa'],[180,'exec'],[330,'meet']]:Array.from({length:D.desks},(_,i)=>[30+(W-120)*(D.desks===1?0.3:i/(D.desks-1))+(lv===0?40:0),'desk']);
  pos.forEach(([x,kind],i)=>{
    if(kind==='sofa'){s+=`<rect x="${x-30}" y="${fy+8}" width="80" height="26" rx="8" fill="#a23b47"/><rect x="${x-34}" y="${fy-6}" width="88" height="18" rx="8" fill="#b8434f"/><rect x="${x-10}" y="${fy+38}" width="40" height="8" rx="3" fill="#3a2a20"/>`;return}
    if(kind==='meet'){s+=`<ellipse cx="${x+20}" cy="${fy+26}" rx="54" ry="12" fill="#6b4a32"/>`;for(let k=0;k<4;k++)s+=`<rect x="${x-24+k*28}" y="${fy+6}" width="14" height="16" rx="4" fill="#1d1f26"/>`;return}
    const big=kind==='exec',w=big?120:64;
    s+=`<rect x="${x-4}" y="${fy-26}" width="16" height="22" rx="4" fill="#2c3440"/>`;// sandalye sırtı
    s+=`<rect x="${x}" y="${fy-2}" width="${w}" height="8" fill="${big?'#5b3a26':lv===0?'#c9b48a':'#e9e4dc'}" stroke="rgba(0,0,0,.2)"/><rect x="${x+4}" y="${fy+6}" width="4" height="26" fill="#555"/><rect x="${x+w-8}" y="${fy+6}" width="4" height="26" fill="#555"/>`;
    s+=`<rect x="${x+w/2-12}" y="${fy-24}" width="26" height="18" rx="2" fill="#20252c"/><rect x="${x+w/2-10}" y="${fy-22}" width="22" height="13" fill="${lv===4?'#ffcf7a':'#7fd3ff'}"/><rect x="${x+w/2-1}" y="${fy-6}" width="3" height="4" fill="#20252c"/>`;
    if(i<D.ppl){const col=['#ff8a00','#2f8fe8','#22a862','#8b5cf6','#e5484d','#14b8a6'][i%6];s+=`<circle cx="${x+4}" cy="${fy-34}" r="7" fill="#f2c9a0"/><path d="M${x-6} ${fy-4}q0-22 10-22t10 22z" fill="${col}"/>`}
    if(big)s+=`<rect x="${x+w-26}" y="${fy-12}" width="16" height="10" fill="#ffd36b"/>`;
  });
  if(lv===0)s+=`<rect x="200" y="${fy+4}" width="34" height="26" fill="#c79a5b" stroke="#9c7440"/><rect x="214" y="${fy-16}" width="26" height="20" fill="#d4aa6b" stroke="#9c7440"/><circle cx="150" cy="${fy+30}" r="12" fill="#2b2b2b"/><circle cx="150" cy="${fy+30}" r="5" fill="#666"/>`;
  if(lv>=1)s+=`<rect x="${W-34}" y="${fy-34}" width="16" height="16" fill="#c27a4a"/><circle cx="${W-26}" cy="${fy-44}" r="14" fill="#4f9a45"/><circle cx="${W-32}" cy="${fy-52}" r="8" fill="#6cb85a"/>`;
  if(lv===2)s+=`<rect x="190" y="60" width="50" height="80" fill="#c9a77a"/>${[0,1,2,3].map(k=>`<rect x="194" y="${64+k*19}" width="42" height="3" fill="#8a6a44"/><rect x="${196+k*7}" y="${66+k*19}" width="6" height="14" fill="${['#e5484d','#2f8fe8','#22a862','#ff8a00'][k]}"/>`).join('')}`;
  if(lv===4)s+=`<g transform="translate(206 ${fy-118})">${logoSvg(36)}</g><rect x="388" y="${fy-50}" width="40" height="48" fill="#3a2a20"/><path d="M398 ${fy-40}h20M398 ${fy-26}h20" stroke="#ffd36b" stroke-width="3"/>`;
  s+=`<rect width="${W}" height="${H}" fill="url(#ovig)" pointer-events="none"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${s}</svg>`;
}
corpOffice=function(){
  const lv=S.office,cur=OFFICE[lv],nx=OFFICE[lv+1],D=OFFICE_D[lv];
  const track=OFFICE.map((o,i)=>`<div class="st ${i<lv?'done':i===lv?'cur':''}"><i>${i<lv?'✓':i+1}</i><small>${o.n.replace(' kulesi','').replace(' katı','')}</small></div>`).join('<span class="ln"></span>');
  const bon=[['Kredi limiti',`+%${lv*10}`,nx?'+%10':''],['Satış şansı',`+%${lv*5}`,nx?'+%5':''],['Kadro sınırı',`+${Math.floor(lv/2)}`,nx&&(lv+1)%2===0?'+1':'']];
  return `<div class="v7off"><div class="scn">${officeArt(lv)}<span class="tag">SEVİYE ${lv+1}/${OFFICE.length}</span><span class="nm"><b>${cur.n}</b><small>${D.tag}</small></span></div>
   <div class="rt"><div class="track">${track}</div>
    <div class="v7tiles">${bon.map(([k,v,n])=>`<div><small>${k.toLocaleUpperCase('tr-TR')}</small><b>${v}</b>${n?`<em>sonraki ${n}</em>`:''}</div>`).join('')}</div>
    ${nx?`<div class="nx"><div><small>SONRAKİ OFİS</small><b>${nx.n}</b><span class="meta">Personel ve kredi limitin büyür, müşteriler sana daha çok güvenir.</span></div>
      <button class="btn primary big" data-act="office" ${S.money<nx.cost?'disabled':''}>Taşın · ${fmt(nx.cost)}</button></div>`:'<div class="nx"><div><small>ZİRVEDESİN</small><b>En büyük ofis senin</b><span class="meta">Genel merkezin şehrin her yerinden görünüyor.</span></div></div>'}
   </div></div>
   <div class="card v7logo"><div class="row">${logoSvg(52)}<div class="grow"><div class="title">${esc(S.company)} logosu</div><div class="meta">Üst barda, sıralamada, ofis duvarında ve alışveriş merkezlerinde görünür.</div></div></div>
    <div class="row"><span class="meta">Şekil</span><div class="swatches">${[0,1,2,3,4,5].map(i=>`<button data-act="lshape" data-id="${i}" aria-pressed="${S.logo.shape===i}" aria-label="Şekil ${i+1}">${logoSvg(26,i,S.logo.col)}</button>`).join('')}</div>
    <span class="meta">Renk</span><div class="swatches">${LOGO_COLS.map((c,i)=>`<button data-act="lcol" data-id="${i}" aria-pressed="${S.logo.col===i}" aria-label="Renk ${i+1}"><span style="width:20px;height:20px;border-radius:50%;background:${c}"></span></button>`).join('')}</div></div></div>`;
};

document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el||el.closest('#splash'))return;const act=el.dataset.act,id=el.dataset.id;
  switch(act){
    case 'x7list':landList=true;curCity=null;curDist=null;render();$('#main').scrollTop=0;break;
    case 'x7map0':landList=false;curCity=null;curDist=null;render();break;
    case 'x7fil':mapFil=id;render();break;
    case 'x7plots':openSheet(`<h2>Elindeki arsalar</h2>${S.plots.map(plotCard).join('')}<button class="btn" data-act="close">Kapat</button>`);break;
    case 'x7ren':renSheet(el.dataset.city,id);break;
    case 'x7renok':closeSheet();acceptRenewal(el.dataset.city,id);break;
    case 'x7scroll':{const c=$('#v7car');if(c)c.scrollBy({left:c.clientWidth*0.8,behavior:'smooth'});break}
    case 'x7proj':openProj(id);break;
    case 'x7plist':curProj=null;render();$('#main').scrollTop=0;break;
    case 'x7map':{const cid=el.dataset.city;closeSheet();go('land');curCity=cid;curDist=id===''?null:+id;render();break}
    case 'x7finish':{const b=S.bld.find(x=>x.id===id);if(!b||b.done)break;if(!spend(finishCost(b)))break;complete(b,true);if(!S.bld.includes(b))curProj=null;render();break}
    case 'x7rush':{const b=S.bld.find(x=>x.id===id);if(!b||b.done)break;if(!spend(rushCost(b)))break;b.prog=Math.min(1,b.prog+2/bDays(b));sfx('build');
      if(b.prog>=1){complete(b,true);if(!S.bld.includes(b))curProj=null}else toast('Ek ekip geldi, şantiye 2 gün öne geçti.','good');render();break}
  }
});
// kaydırınca noktaları güncelle
document.addEventListener('scroll',e=>{const c=e.target;if(!c||c.id!=='v7car')return;const dots=document.querySelectorAll('.v7foot .dots i');if(!dots.length)return;
  const k=Math.round(c.scrollLeft/Math.max(1,c.scrollWidth-c.clientWidth)*(dots.length-1));dots.forEach((d,i)=>d.classList.toggle('on',i===k))},true);
render=(o=>function(){o();const m=$('#main');if(!m)return;m.classList.toggle('v7wide',(curTab==='land'&&!landList&&!(curCity&&CITY[curCity].abroad&&!S.branches[curCity]))||(curTab==='proj'&&ptab==='mine'));
  const dots=document.querySelector('.v7foot .dots i');if(dots)dots.classList.add('on')})(render);
