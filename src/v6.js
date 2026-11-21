
// ================= v6: yeni ana ekran (panel düzeni) ve üst bar =================
const WDAYS=['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
const fullTL=v=>(v<0?'−':'')+Math.round(Math.abs(v)).toLocaleString('tr-TR')+' ₺';
function scoreName(sc){return sc>=1450?'Mükemmel':sc>=1150?'Çok iyi':sc>=900?'İyi':sc>=600?'Orta':'Zayıf'}
function pThumb(b,W=300,H=124){
  const k='p|'+b.id+'|'+Math.floor((b.done?1:b.prog)*20)+'|'+b.type+'|'+W;if(thumbCache[k])return thumbCache[k];
  const cv=document.createElement('canvas');cv.width=W*2;cv.height=H*2;const ctx=cv.getContext('2d');ctx.scale(2,2);
  const gy=H-20;const n=drawSky(ctx,W,H,gy,0.4,b.city||'istanbul',0,'sun');
  const sp=spec(b);const s=Math.min((gy-12)/(sp.h+(b.done?20:44)),(W*0.55)/(sp.W+16),1.25);
  ctx.save();ctx.translate((W-sp.W*s)/2,gy);ctx.scale(s,s);drawBuilding(ctx,b,0,0,n,800,CITY[b.city]||{sc:{},tour:0});ctx.restore();
  drawGround(ctx,W,H,gy,n);
  return thumbCache[k]=cv.toDataURL();
}
const IC={
  wheel:'<svg viewBox="0 0 32 32"><g transform="translate(16 16)">'+['#ff5c74','#ffb020','#5fd69c','#5fc9e6','#8b5cf6','#ff8a00'].map((c,i)=>{const a=i*Math.PI/3,b=a+Math.PI/3;return `<path d="M0 0L${(13*Math.cos(a)).toFixed(1)} ${(13*Math.sin(a)).toFixed(1)}A13 13 0 0 1 ${(13*Math.cos(b)).toFixed(1)} ${(13*Math.sin(b)).toFixed(1)}Z" fill="${c}"/>`}).join('')+'<circle r="3.5" fill="#fff"/></g><path d="M16 1l3 5h-6z" fill="#3b2816"/></svg>',
  office:'<svg viewBox="0 0 32 32"><rect x="9" y="4" width="14" height="25" rx="1.5" fill="#8b5cf6"/><g fill="#e9ddff"><rect x="12" y="8" width="3" height="3"/><rect x="17" y="8" width="3" height="3"/><rect x="12" y="14" width="3" height="3"/><rect x="17" y="14" width="3" height="3"/><rect x="12" y="20" width="3" height="3"/><rect x="17" y="20" width="3" height="3"/></g><rect x="14" y="25" width="4" height="4" fill="#3b2816"/></svg>',
  gavel:'<svg viewBox="0 0 24 24"><path d="M14 4l6 6-3 3-6-6zM11 7l-7 7 3 3 7-7M3 21h10"/></svg>',
  mail:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  gov:'<svg viewBox="0 0 24 24"><path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/></svg>',
  bank:'<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="12" rx="2"/><circle cx="12" cy="13" r="2.5"/><path d="M7 7V5h10v2"/></svg>',
  crown:'<svg viewBox="0 0 24 24"><path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/></svg>',
  team:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 14.5c3 0 6 2 6 5.5"/></svg>',
  city:'<svg viewBox="0 0 24 24"><path d="M2 20h20M4 20V10h5v10M9 20V5h6v15M15 20v-8h5v8"/></svg>',
  oil:'<svg viewBox="0 0 24 24"><path d="M12 3c3 4 5 6.5 5 9a5 5 0 01-10 0c0-2.5 2-5 5-9z"/></svg>',
};
function tile(act,id,ic,col,t,s,cls=''){return `<button class="stile ${cls}" data-act="${act}" data-id="${id}"><i style="background:${col}">${ic}</i><span><b>${t}</b><small>${s}</small></span></button>`}
function viewDash(){
  const doing=S.bld.filter(b=>!b.done).sort((a,b)=>b.prog-a.prog);const h=(S.hist||[]).concat([S.money]);
  const net=dailyNet(),rent=dailyRent(),biz=bizDaily(),sal=dailySalary();
  const avg=CITIES.reduce((a,c)=>a+S.idx[c.id]/S.prevIdx[c.id],0)/CITIES.length;
  const eco=avg>1.003?['Büyüme','pos']:avg<0.997?['Daralma','neg']:['Durgun',''];
  const nl=[...S.loans].sort((a,b)=>a.left-b.left)[0];
  const offers=(S.offers||[]).length,auc=(S.auction?1:0),kamu=S.kamu.length;
  const off=OFFICE[S.office];
  const projCards=doing.slice(0,2).map(b=>{const days=b.kamu?b.days:(b.dd||TYPE[b.type].days);const sp=speed(b.city)||1;const left=Math.max(1,Math.ceil((1-b.prog)*days/sp));
    return `<button class="pc" data-act="gotab" data-id="proj"><span class="art"><img src="${pThumb(b)}" alt=""><span class="tag">ŞANTİYE</span><span class="tag r">${b.units.length} · ${b.kamu?'Kamu':TYPE[b.type].uname}</span></span>
     <b>${esc(b.name)}</b><small>${CITY[b.city].n}${b.di!=null&&!b.kamu?' · '+CITY[b.city].d[b.di][0]:''}</small>
     <span class="prog"><i style="width:${b.prog*100}%"></i></span><span class="pcf"><span>%${Math.floor(b.prog*100)} yapıldı</span><span>${left} gün kaldı</span></span></button>`}).join('');
  const ready=readyGoals();
  return `<div class="dl">
   <div class="cashcard"><div class="cct"><div class="ccl"><div class="k">KASA <span class="eco ${eco[1]}">● Piyasa: ${eco[0]}</span></div>
      <div class="bigcash num">${fullTL(S.money)}</div>
      <div class="ccs"><span class="${net>=0?'pos':'neg'}">${net>=0?'▲ +':'▼ '}${fmt(net)}/gün</span> · <span>net değer ${fmt(worth())}</span></div></div>
     <div class="ccc">${spark(h.slice(-30),210,64,'#2fd38a')}${nl?`<span class="paypill">Ödeme ${nl.left} gün sonra · ${fmt(nl.amount+nl.interest)}</span>`:`<span class="paypill">Kredi borcun yok</span>`}</div></div>
    <div class="ccr"><div><small>BORÇ</small><b class="${debt()?'neg':''}">${fmt(debt())}</b></div><div><small>KİRA / GÜN</small><b class="pos">+${fmt(rent)}</b></div><div><small>İŞLETME / GÜN</small><b class="pos">+${fmt(biz)}</b></div><div><small>MAAŞ / GÜN</small><b>−${fmt(sal)}</b></div></div></div>
   <div class="ph"><b>Devam eden projeler</b><span class="meta">· ${doing.length}</span>${S.bld.some(b=>b.k>2)?'<span class="mega">MEGA PROJE</span>':''}<span class="grow"></span><button class="link" data-act="gotab" data-id="proj">Tümü ›</button></div>
   <div class="prow">${projCards}<button class="pc new" data-act="gotab" data-id="land"><span class="plus">+</span><b>Yeni proje</b><small>Arsa seç</small></button>${doing.length<2&&S.bld.some(b=>b.done)?S.bld.filter(b=>b.done).slice(0,2-doing.length).map(b=>`<button class="pc" data-act="gotab" data-id="proj"><span class="art"><img src="${pThumb(b)}" alt=""><span class="tag g">BİTTİ</span></span><b>${esc(b.name)}</b><small>${CITY[b.city].n}</small><span class="pcf"><span>${b.units.filter(u=>u==='rented').length} kirada</span><span>${b.units.filter(u=>u==='empty').length} boş</span></span></button>`).join(''):''}</div>
  </div>
  <div class="dr">
   <div class="today"><div class="k">BUGÜN</div><div class="g2">
     <button class="tbig" data-act="wheel"><i>${IC.wheel}</i><span><b>Şans çarkı</b><small>${S.daily.spun!==today()?'Çevirmeye hazır!':'Yarın yine gel'}</small></span></button>
     <button class="tbig vio" data-act="gocorp" data-id="office"><i>${IC.office}</i><span><b>Ofisim</b><small>${off.n}</small></span></button></div></div>
   <div class="sg">
    ${tile('gotab','auction',IC.gavel,'#e0a03a','İhaleler',`${auc+kamu} açık · teklif ver`)}
    ${tile('xptab','offers',IC.mail,'#22a862','Teklifler',offers?`${offers} müşteri bekliyor`:'Yeni teklif yok')}
    ${tile('gotab','biz',IC.oil,'#2f8fe8','İşletmeler',`${S.biz.length} işletme · +${fmt(biz)}`)}
    ${tile('gotab','bank',IC.bank,'#3b82f6','Banka',debt()?`Borç ${fmt(debt())}`:`Kredi puanı ${score()}`)}
    ${tile('gocorp','lux',IC.crown,'#ff8a00','Koleksiyon',`Yat, jet, ada · prestij ${prestige()}`,'hot')}
    ${tile('gocorp','staff',IC.team,'#14b8a6','Personel',`${staffCount()} kişi`)}
    ${tile('gotab','sehir',IC.city,'#ef4444','Şehrim',`${ready?ready+' ödül hazır · ':''}canlı şehir ve görevler`,'wide')}
   </div>
   <button class="explore3" data-act="gotab" data-id="land"><span><small>${(CITY[S.view]||CITY.istanbul).n.toLocaleUpperCase('tr-TR')} HARİTASI</small><b>Arsaları keşfet →</b></span><i>›</i></button>
  </div>`;
}
renderHud=(o=>function(){o();if(!S)return;
  const sc=score(),set=(id,v)=>{const e=document.getElementById(id);if(e&&e.innerHTML!==String(v))e.innerHTML=v};
  set('rank',myRank()+'.');set('wday',WDAYS[(S.day-1)%7]);
  set('hsub',`<i class="dotg"></i>Kredi puanı ${sc} · ${scoreName(sc)} · Ofis: ${OFFICE[S.office].n} · Servet ${fmt(worth())}`);
  const gb=document.getElementById('goalbadge');if(gb){const r=readyGoals();gb.hidden=!r;gb.textContent=r}
  const br=document.getElementById('brand');if(br&&br.innerHTML!==esc(S.company))br.innerHTML=esc(S.company);
})(renderHud);
