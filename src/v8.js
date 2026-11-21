
// ================= v8: holding, yeni iş kolları, parayla açılan şehirler, 2 günlük ev =================
TYPE.ev.days=2;
// --- şehirler: İstanbul bedava, diğerleri parayla açılır
CITIES.forEach(c=>{c.lvl0=c.lvl;c.lvl=1;if(!c.abroad)c.fee=Math.max(3e6,Math.round(c.land*c.dem*700/1e6)*1e6)});
cityOpen=function(c){return c.id==='istanbul'||!!(S&&S.branches&&S.branches[c.id])};
openBranch=function(cid){
  const c=CITY[cid];if(!c||cityOpen(c))return;if(!spend(c.fee))return;
  S.branches[cid]=true;S.view=cid;log(`${c.n} açıldı (${fmt(c.fee)}).`);sfx('level');vib([30,30,60]);
  S.news.unshift({d:S.day,txt:`${S.company} ${c.n} pazarına girdi.${c.abroad?' Yurt dışında yeni bir adım!':''}`});
  toast(`${c.n} açıldı! Arsa alabilir, işletme kurabilirsin.`,'good');curCity=cid;curDist=null;landList=false;closeSheet();render();
};
// --- iş kolları
BCAT.push(['egitim','Eğitim','#8b5cf6'],['saglik','Sağlık','#e5484d'],['ulasim','Ulaşım','#2f8fe8'],['perakende','Perakende','#ff8a00'],['medya','Medya ve spor','#14b8a6']);
const MOVE={market:'perakende',otopark:'ulasim',nakliye:'ulasim',liman:'ulasim',havayolu:'ulasim',tv:'medya',futbol:'medya'};
BIZ.forEach(b=>{if(MOVE[b.id])b.cat=MOVE[b.id]});
[
 ['cay','tarim','Çay bahçesi',6e6,50e3,'tarim',['trabzon','samsun'],0,'Karadeniz yamaçlarında yaş çay.'],
 ['meyve','tarim','Meyve bahçesi',4e6,34e3,'tarim',['antalya','mersin','bursa'],0,'Narenciye, şeftali, kiraz.'],
 ['ari','hayvan','Arıcılık',1.5e6,13e3,'hayvan',['trabzon','mugla','erzurum'],0,'Çiçek balı ve polen.'],
 ['koyun','hayvan','Koyun ve keçi çiftliği',6e6,50e3,'hayvan',['van','erzurum','konya'],0,'Süt, peynir ve yün.'],
 ['besi','hayvan','Büyükbaş besi çiftliği',25e6,205e3,'hayvan',['kayseri','erzurum','konya'],0,'Et fiyatı yükseldikçe kazanç artar.'],
 ['dogalgaz','petrol','Doğalgaz dağıtım',80e6,640e3,'petrol',['istanbul','ankara','bursa'],0,'Kışın tüketim ve gelir artar.'],
 ['tanker','petrol','Tanker filosu',150e6,1.2e6,'petrol',['kocaeli','mersin','izmir'],0,'Ham petrol taşımacılığı. Kıyı şehrinde kurulur.'],
 ['kurs','egitim','Dershane',3e6,26e3,'hizmet',[],0,'Sınav dönemlerinde dolup taşar.'],
 ['kres','egitim','Kreş ve anaokulu',5e6,42e3,'hizmet',['istanbul','ankara','izmir'],0,'Büyük şehirde talep çok.'],
 ['kolej','egitim','Özel okul',25e6,205e3,'hizmet',['istanbul','ankara','izmir'],0,'Ana okuldan liseye kampüs.'],
 ['universite','egitim','Vakıf üniversitesi',250e6,1.9e6,'hizmet',['istanbul','ankara','izmir','eskisehir'],0,'Öğrenci şehirlerinde bonus.'],
 ['eczane','saglik','Eczane',2.5e6,22e3,'hizmet',[],0,'Her mahallenin ihtiyacı.'],
 ['klinik','saglik','Diş kliniği',8e6,66e3,'hizmet',[],0,'Sağlık turizmiyle de kazanır.'],
 ['lab','saglik','Tahlil laboratuvarı',20e6,162e3,'hizmet',['istanbul','ankara'],0,'Hastanelere de hizmet verir.'],
 ['hastaneb','saglik','Özel hastane',180e6,1.4e6,'hizmet',['istanbul','ankara','izmir','antalya'],0,'Yüksek yatırım, istikrarlı gelir.'],
 ['otobus','ulasim','Otobüs firması',30e6,240e3,'petrol',['ankara','istanbul','konya'],0,'Şehirlerarası seferler. Yakıt fiyatına bağlı.'],
 ['havalimani','ulasim','Bölge havalimanı',900e6,6.4e6,'hizmet',['antalya','izmir','trabzon','mugla'],0,'Turizm şehirlerinde dev gelir.'],
 ['tekel','perakende','Tekel bayi',1.2e6,11e3,'hizmet',[],0,'Sigara, içecek ve atıştırmalık.'],
 ['elektronik','perakende','Elektronik mağazası',9e6,74e3,'hizmet',[],0,'Kampanya günlerinde satış patlar.'],
 ['giyim','perakende','Giyim mağazası zinciri',15e6,122e3,'hizmet',['istanbul','bursa','izmir'],0,'Bursa tekstili ucuza gelir.'],
].forEach(([id,cat,n,cost,inc,comm,reg,risk,d])=>{if(BIZK[id])return;const o={id,cat,n,cost,inc,comm,lvl:1,reg,risk,d,coast:id==='tanker'};BIZ.push(o);BIZK[id]=o});
BIZ.forEach(b=>b.lvl=1);
const SECT=[
 ['hizmet','Hizmet','Hizmetler',0],['tarim','Tarım','Tarım',2e6],['perakende','Perakende','Mağazacılık',4e6],['hayvan','Hayvancılık','Hayvancılık',3e6],
 ['egitim','Eğitim','Eğitim',12e6],['saglik','Sağlık','Sağlık',20e6],['petrol','Petrol','Petrol',15e6],['maden','Maden','Madencilik',20e6],
 ['enerji','Enerji','Enerji',30e6],['sanayi','Sanayi','Sanayi',35e6],['ulasim','Ulaşım','Ulaşım',50e6],['medya','Medya','Medya ve Spor',120e6],
].map(([id,n,co,fee])=>({id,n,co,fee}));
const SECTK=Object.fromEntries(SECT.map(s=>[s.id,s]));
function coName(s){return `${(S.company||'').split(' ')[0]} ${s.co} A.Ş.`}
function holdLvl(cat){return (S.hold&&S.hold[cat])||0}
function holdUpCost(s){return Math.round(Math.max(s.fee,5e6)*Math.pow(1.7,holdLvl(s.id))/1e5)*1e5}
function holdCount(){return SECT.filter(s=>holdLvl(s.id)).length}
function holdValue(){return S.biz.reduce((a,b)=>a+bizInvest(b),0)*1.1+SECT.reduce((a,s)=>a+(holdLvl(s.id)?s.fee:0),0)}
function sectDaily(cat){return S.biz.filter(b=>BIZK[b.t].cat===cat).reduce((a,b)=>a+bizIncome(b),0)}
bizIncome=(o=>function(b){const d=BIZK[b.t];if(!d)return 0;const v=o(b);return v*(1+0.1*Math.max(0,holdLvl(d.cat)-1))})(bizIncome);
migrate=(o=>function(){o();
  if(!S.hold){S.hold={hizmet:1};
    CITIES.forEach(c=>{if(!c.abroad&&c.id!=='istanbul'&&level()>=c.lvl0)S.branches[c.id]=true});
    S.biz.forEach(b=>{const d=BIZK[b.t];if(d&&!S.hold[d.cat])S.hold[d.cat]=1});}
  [...S.plots,...S.bld,...S.biz].forEach(x=>{if(x.city&&x.city!=='istanbul'&&CITY[x.city])S.branches[x.city]=true});
  S.biz=S.biz.filter(b=>BIZK[b.t]);
})(migrate);
buyBiz=(o=>function(t,cid){const d=BIZK[t];if(!d)return;
  if(!holdLvl(d.cat)){toast(`Önce ${coName(SECTK[d.cat])} şirketini kurmalısın.`,'bad');return}
  if(!cityOpen(CITY[cid])){toast(`${CITY[cid].n} henüz açık değil.`,'bad');return}
  o(t,cid)})(buyBiz);
function foundSect(id){const s=SECTK[id];if(!s||holdLvl(id))return;if(!spend(s.fee))return;S.hold[id]=1;sfx('gavel');vib([30,30,60]);
  log(`${coName(s)} kuruldu.`);S.news.unshift({d:S.day,txt:`${S.company} holdingine yeni şirket: ${coName(s)}.`});toast(`${coName(s)} kuruldu!`,'good');render()}
function upSect(id){const s=SECTK[id];const l=holdLvl(id);if(!s||!l||l>=5)return;if(!spend(holdUpCost(s)))return;S.hold[id]=l+1;sfx('level');toast(`${s.n} şirketi seviye ${l+1}: işletme geliri +%${l*10}`,'good');render()}
// --- simgeler
const BGLY={tarim:'<path d="M20 32V14M20 18c-4-1-6-4-6-7 4 0 6 3 6 7zm0 0c4-1 6-4 6-7-4 0-6 3-6 7zm0 6c-4-1-6-4-6-7 4 0 6 3 6 7zm0 0c4-1 6-4 6-7-4 0-6 3-6 7z"/>',
 hayvan:'<path d="M10 24c0-5 4-9 10-9s10 4 10 9-4 6-10 6-10-1-10-6zM14 16l-2-4M26 16l2-4"/><circle cx="16" cy="22" r="1"/><circle cx="24" cy="22" r="1"/>',
 enerji:'<path d="M22 8L12 22h7l-2 10 10-14h-7z"/>',petrol:'<path d="M20 8c5 7 8 11 8 15a8 8 0 01-16 0c0-4 3-8 8-15z"/>',
 maden:'<path d="M10 30l8-8M14 12c6-2 12 0 16 4M18 22l-4-4 8-8 4 4z"/>',sanayi:'<path d="M8 32V20l7 4v-4l7 4v-4l7 4V10h3v22z"/>',hizmet:'<path d="M10 16h20l-2 14H12zM15 16a5 5 0 0110 0"/>',
 egitim:'<path d="M6 16l14-7 14 7-14 7zM12 19v7c4 3 12 3 16 0v-7M34 16v8"/>',saglik:'<path d="M16 8h8v8h8v8h-8v8h-8v-8H8v-8h8z"/>',
 ulasim:'<path d="M20 6l3 10 11 5v3l-11-2-1 8 4 3v2l-6-1-6 1v-2l4-3-1-8-11 2v-3l11-5z"/>',perakende:'<path d="M8 10h4l3 14h14l3-10H13M16 30a2 2 0 100 .1M27 30a2 2 0 100 .1"/>',
 medya:'<rect x="8" y="12" width="24" height="16" rx="2"/><path d="M15 6l5 6 5-6M14 32h12"/>'};
bizIcon=function(d,cat){const col=cat?cat[2]:'#888';return `<svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true" style="flex-shrink:0"><rect width="40" height="40" rx="10" fill="${col}"/><g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${BGLY[d.cat]||BGLY.hizmet}</g></svg>`};
function sIcon(s,sz=44){const cat=BCAT.find(x=>x[0]===s.id)||['','', '#888'];return `<svg width="${sz}" height="${sz}" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="${cat[2]}"/><g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${BGLY[s.id]||BGLY.hizmet}</g></svg>`}
// --- holding ekranı
let curSect=null;
viewBiz=function(){
  if(curSect&&SECTK[curSect])return viewSect(SECTK[curSect]);
  const n=holdCount(),inc=bizDaily();
  const cards=SECT.map(s=>{const l=holdLvl(s.id),cat=BCAT.find(x=>x[0]===s.id),own=S.biz.filter(b=>BIZK[b.t].cat===s.id).length,kinds=BIZ.filter(b=>b.cat===s.id).length;
    return `<button class="hc ${l?'on':''}" data-act="x8sect" data-id="${s.id}" style="--c:${cat[2]}"><span class="hi">${sIcon(s,40)}</span>
     <span class="ht"><small>${s.n.toLocaleUpperCase('tr-TR')}</small><b>${esc(coName(s))}</b>
     <em>${l?`Sv.${l} · ${own} işletme · <span class="g">+${fmt(sectDaily(s.id))}/gün</span>`:`${kinds} iş kolu · ${s.fee?'kuruluş '+fmt(s.fee):'ücretsiz'}`}</em></span>
     <span class="hb">${l?'Yönet ›':'Kur ›'}</span></button>`}).join('');
  return `<div class="v7h"><div class="tt"><small>${esc(S.company).toLocaleUpperCase('tr-TR')} HOLDİNG</small><b>Holding</b></div>
    <div class="v7chips"><span class="cp g">${n}/${SECT.length} şirket</span><span class="cp">${S.biz.length} işletme</span><span class="cp o">+${fmt(inc)}/gün</span><span class="cp">Değer ${fmt(holdValue())}</span></div></div>
   <p class="hint" style="margin:0">Her sektör için bir şirket kur, sonra o sektörün işletmelerini istediğin şehirde aç. Şirketi büyüttükçe o sektördeki tüm işletmelerin geliri %10 artar.</p>
   <div class="hgrid">${cards}</div>`;
};
function viewSect(s){
  const l=holdLvl(s.id),cat=BCAT.find(x=>x[0]===s.id),kinds=BIZ.filter(b=>b.cat===s.id).sort((a,b)=>a.cost-b.cost),own=S.biz.filter(b=>BIZK[b.t].cat===s.id);
  const comm=kinds[0]?kinds[0].comm:'hizmet';
  const head=`<div class="v7h"><button class="v7back" data-act="x8hold">‹ Holding</button><div class="tt"><small>${s.n.toLocaleUpperCase('tr-TR')} SEKTÖRÜ</small><b>${esc(coName(s))}</b></div></div>`;
  if(!l)return head+`<div class="hfound" style="--c:${cat[2]}">${sIcon(s,64)}<div><h2>${esc(coName(s))}</h2><p class="hint">Bu şirketi kurunca ${kinds.length} iş kolu açılır: ${kinds.map(k=>k.n).join(', ')}.</p>
    <button class="btn primary big" data-act="x8found" data-id="${s.id}">Şirketi kur · ${s.fee?fmt(s.fee):'Ücretsiz'}</button></div></div>`;
  const tiles=`<div class="v7tiles"><div><small>SEVİYE</small><b>${l}/5</b></div><div><small>GELİR BONUSU</small><b class="g">+%${(l-1)*10}</b></div><div><small>İŞLETME</small><b>${own.length}</b></div><div><small>GÜNLÜK</small><b class="g">+${fmt(sectDaily(s.id))}</b></div><div><small>PİYASA</small><b>${(S.comm[comm]||1).toFixed(2)}</b></div></div>`;
  const up=l<5?`<button class="v7ban" data-act="x8up" data-id="${s.id}"><span>Şirketi büyüt: seviye ${l+1}, gelir +%${l*10}</span><b>${fmt(holdUpCost(s))} ›</b></button>`:'<div class="v7ban"><span>Şirket en üst seviyede.</span></div>';
  const list=kinds.map(d=>`<button class="bk" data-act="bizsheet" data-id="${d.id}">${bizIcon(d,cat)}<span><b>${d.n}</b><small>${fmt(d.cost)} · günde ~${fmt(d.inc*(S.comm[d.comm]||1)*(1+0.1*(l-1)))}</small>
     <small class="m">${d.risk?`<span class="r">Riskli · %${Math.round(d.risk*100)} boş</span>`:d.reg.length?'Bonus: '+d.reg.slice(0,3).map(x=>CITY[x].n).join(', '):'Her şehirde kurulur'}</small></span><i>Kur ›</i></button>`).join('');
  const mine=own.map(b=>{const d=BIZK[b.t];return `<div class="bo">${bizIcon(d,cat)}<span><b>${d.n} <em>Sv.${b.lvl}</em></b><small>${CITY[b.city].n} · ${b.state==='drill'?`sondaj ${b.left} gün`:b.state==='dry'?'boş çıktı':`+${fmt(bizIncome(b))}/gün`}${bizRegion(b)?' · bölge bonusu':''}</small></span>
    ${b.state==='ok'&&b.lvl<5?`<button class="btn primary small" data-act="upbiz" data-id="${b.id}">Büyüt ${fmt(d.cost*0.8*b.lvl)}</button>`:''}<button class="btn small" data-act="sellbiz" data-id="${b.id}">${b.state==='dry'?'Kapat':'Sat'}</button></div>`}).join('');
  return head+tiles+up+`<div class="hcols"><div><div class="k8">KURULABİLECEK İŞLETMELER</div><div class="bkl">${list}</div></div>
    <div><div class="k8">İŞLETMELERİN · ${own.length}</div>${mine||'<div class="empty">Henüz bu sektörde işletmen yok. Soldan bir işletme seç.</div>'}</div></div>`;
}
// --- şehir listesi ve kilitli şehir ekranı
const viewLand7=viewLand;
viewLand=function(){
  if(curCity&&!cityOpen(CITY[curCity]))return viewLocked(curCity);
  if(!curCity&&landList)return viewCities();
  return viewLand7();
};
function viewCities(){
  const card=c=>{const open=cityOpen(c),k=open?cityAssets(c.id):0;
    return `<button class="ccard city ${open?'':'lock'}" data-city="${c.id}"><img src="${cityThumb(c.id)}" alt=""><span><b>${c.n}</b><small>${fmt(c.land*S.idx[c.id])}/m² · ${c.d.length} ilçe</small></span>
     <em class="${open?'g':''}">${open?(k?k+' varlık':'Açık'):fmt(c.fee)}</em></button>`};
  const tr=CITIES.filter(c=>!c.abroad),ab=CITIES.filter(c=>c.abroad);
  return `<div class="v7h"><button class="v7back" data-act="x7map0">‹ Harita</button><div class="tt"><small>${CITIES.filter(cityOpen).length} / ${CITIES.length} ŞEHİR AÇIK</small><b>Şehrini seç</b></div></div>
   <p class="hint" style="margin:0">İstanbul bedava. Diğer şehirleri bir kez ödeyip açarsın; sonra orada arsa alır, işletme kurarsın.</p>
   <div class="k8">TÜRKİYE · ${tr.length} İL</div><div class="cgrid">${tr.map(card).join('')}</div>
   <div class="k8">YURT DIŞI</div><div class="cgrid">${ab.map(card).join('')}</div>`;
}
function viewLocked(cid){
  const c=CITY[cid],bz=BIZ.filter(b=>b.reg.includes(cid));
  return `<div class="v7h"><button class="v7back" data-act="x7list">‹ Şehirler</button><div class="tt"><small>${c.abroad?'YURT DIŞI':'TÜRKİYE'} · KİLİTLİ</small><b>${c.n}</b></div></div>
   <div class="hfound lockc"><img src="${cityThumb(cid)}" alt=""><div><h2>${c.n} pazarına gir</h2>
    <div class="v7tiles"><div><small>ARSA ₺/m²</small><b>${fmt(c.land*S.idx[cid])}</b></div><div><small>TALEP</small><b>${c.dem.toFixed(2)}</b></div><div><small>İLÇE</small><b>${c.d.length}</b></div>${c.bc?`<div><small>İNŞAAT</small><b class="r">+%${Math.round((c.bc-1)*100)}</b></div>`:''}</div>
    <p class="hint">${bz.length?`Bölge bonusu veren işletmeler: ${bz.slice(0,5).map(b=>b.n).join(', ')}.`:'Burada her tür işletme kurabilirsin.'}${c.tour?' Turizm şehri: otel kiraları %40 fazla.':''}</p>
    <button class="btn primary big" data-act="branch" data-id="${cid}" ${S.money<c.fee?'disabled':''}>Şehri aç · ${fmt(c.fee)}</button>
    ${S.money<c.fee?`<p class="meta">Kasada ${fmt(c.fee-S.money)} eksik. Bankadan kredi çekebilirsin.</p>`:''}</div></div>`;
}
go=(o=>function(t){if(t!=='biz')curSect=null;o(t)})(go);
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el||el.closest('#splash'))return;const act=el.dataset.act,id=el.dataset.id;
  switch(act){
    case 'x8sect':curSect=id;render();$('#main').scrollTop=0;break;
    case 'x8hold':curSect=null;render();$('#main').scrollTop=0;break;
    case 'x8found':foundSect(id);break;
    case 'x8up':upSect(id);break;
  }
});
render=(o=>function(){o();const m=$('#main');if(!m)return;
  if((curTab==='biz')||(curTab==='auction')||(curTab==='land'&&(landList||(curCity&&!cityOpen(CITY[curCity])))))m.classList.add('v7wide');
  const nb=document.querySelector('nav [data-tab="biz"]');if(nb&&!nb.dataset.v8){nb.dataset.v8=1;nb.lastChild.textContent='Holding'}
})(render);
// küçük şehirlerde ilçeler daha doğal dağılsın
distPos=(o=>function(cid,i,n){if(cid==='istanbul')return o(cid,i,n);
  const r=mulberry(hash(cid+'pos'+i)),a=i*2.39996+hash(cid)%7,rr=Math.sqrt((i+0.6)/n)*(n<4?0.75:0.95);
  return [200+Math.cos(a)*rr*165+(r()-0.5)*14,100+Math.sin(a)*rr*70+(r()-0.5)*10]})(distPos);
