(()=>{
const SAVE_KEY='yapibaronu.v1', SET_KEY='yapibaronu.settings';
const DAY_MS=60000;            // 1 gerçek dakika = 1 oyun günü
const OFFLINE_MAX_DAYS=240;    // en fazla 4 saatlik çevrimdışı gelir

const D=(str)=>str.split(',').map(x=>{const [n,m]=x.split(':');return [n,+m]});
const CITIES=[
 {id:'istanbul',n:'İstanbul',land:30000,dem:1.14,lvl:1,sc:{sea:1,hill:'#6f8f73',hill2:'#5a7860',domes:1,bridge:1,far:1},
  d:D('Esenyurt:0.45,Başakşehir:0.7,Beylikdüzü:0.65,Pendik:0.7,Maltepe:0.9,Ümraniye:0.85,Üsküdar:1.2,Ataşehir:1.3,Bakırköy:1.5,Kadıköy:1.7,Şişli:1.6,Sarıyer:1.9,Beşiktaş:2.1')},
 {id:'kocaeli',n:'Kocaeli',land:11000,dem:1.0,lvl:2,sc:{sea:1,hill:'#5f7f60',hill2:'#4c6a50',far:1},d:D('İzmit:1,Gebze:1.1,Gölcük:0.8,Başiskele:0.9')},
 {id:'tekirdag',n:'Tekirdağ',land:8000,dem:0.97,lvl:2,sc:{sea:1,hill:'#8a9a6a',hill2:'#6f7f55'},d:D('Süleymanpaşa:1,Çorlu:1.05,Çerkezköy:0.9,Şarköy:0.85')},
 {id:'bursa',n:'Bursa',land:13000,dem:1.0,lvl:2,cold:1,sc:{hill:'#5d7f6a',hill2:'#4a6a58',snow:1,peak:1},d:D('Nilüfer:1.3,Osmangazi:1,Yıldırım:0.8,Mudanya:1.1,İnegöl:0.75')},
 {id:'sakarya',n:'Sakarya',land:8000,dem:0.96,lvl:3,sc:{hill:'#4f8a5a',hill2:'#3d6f48'},d:D('Adapazarı:1,Serdivan:1.15,Sapanca:1.2,Karasu:0.9')},
 {id:'eskisehir',n:'Eskişehir',land:9000,dem:0.98,lvl:3,cold:1,sc:{hill:'#b0a07a',hill2:'#988a66'},d:D('Tepebaşı:1.05,Odunpazarı:1,Sivrihisar:0.6')},
 {id:'ankara',n:'Ankara',land:17000,dem:1.02,lvl:3,cold:1,sc:{hill:'#b49a72',hill2:'#9a8160',far:1},d:D('Çankaya:1.5,Keçiören:0.8,Yenimahalle:1,Etimesgut:0.85,Gölbaşı:1.1,Sincan:0.65')},
 {id:'izmir',n:'İzmir',land:24000,dem:1.06,lvl:4,sc:{sea:1,hill:'#8a9a6a',hill2:'#6f7f55',palm:1},d:D('Konak:1.2,Karşıyaka:1.3,Bornova:1.1,Buca:0.85,Çeşme:1.8,Urla:1.5')},
 {id:'konya',n:'Konya',land:7000,dem:0.95,lvl:4,cold:1,sc:{hill:'#c2a878',hill2:'#a89064'},d:D('Selçuklu:1.1,Meram:1,Karatay:0.85,Ereğli:0.7')},
 {id:'antalya',n:'Antalya',land:21000,dem:1.08,lvl:5,tour:1,sc:{sea:1,hill:'#6a8aa0',hill2:'#56748a',peak:1,palm:1},d:D('Muratpaşa:1.2,Konyaaltı:1.4,Lara:1.5,Alanya:1.1,Kemer:1.3,Manavgat:0.9')},
 {id:'adana',n:'Adana',land:9000,dem:0.98,lvl:5,sc:{hill:'#a8a07a',hill2:'#8f8864',palm:1},d:D('Seyhan:1,Çukurova:1.2,Yüreğir:0.75,Ceyhan:0.7')},
 {id:'mersin',n:'Mersin',land:10000,dem:1.0,lvl:5,sc:{sea:1,hill:'#8fa080',hill2:'#76876a',palm:1},d:D('Yenişehir:1.1,Mezitli:1.15,Tarsus:0.8,Erdemli:0.85')},
 {id:'gaziantep',n:'Gaziantep',land:9500,dem:0.99,lvl:5,sc:{hill:'#bfa57a',hill2:'#a68c64'},d:D('Şahinbey:0.9,Şehitkamil:1.1,Nizip:0.7')},
 {id:'kayseri',n:'Kayseri',land:8500,dem:0.97,lvl:5,cold:1,sc:{hill:'#9a8f86',hill2:'#857a72',peak:1,snow:1},d:D('Melikgazi:1.1,Kocasinan:0.95,Talas:1.05')},
 {id:'samsun',n:'Samsun',land:8500,dem:0.97,lvl:5,sc:{sea:1,hill:'#4f8a5a',hill2:'#3d6f48'},d:D('Atakum:1.2,İlkadım:1,Canik:0.85,Bafra:0.75')},
 {id:'trabzon',n:'Trabzon',land:9000,dem:0.97,lvl:6,cold:1,sc:{sea:1,hill:'#3f7a4f',hill2:'#2f5f3e'},d:D('Ortahisar:1.1,Akçaabat:1,Yomra:0.9,Uzungöl:1.3')},
 {id:'mugla',n:'Muğla',land:30000,dem:1.12,lvl:6,tour:1,sc:{sea:1,hill:'#b9a780',hill2:'#a09068',white:1,palm:1},d:D('Bodrum:1.6,Marmaris:1.2,Fethiye:1.1,Datça:1.3,Dalaman:0.8')},
 {id:'diyarbakir',n:'Diyarbakır',land:7000,dem:0.93,lvl:6,sc:{hill:'#a8906a',hill2:'#8f7856'},d:D('Kayapınar:1.1,Bağlar:0.85,Sur:0.95,Yenişehir:1')},
 {id:'batman',n:'Batman',land:5000,dem:0.9,lvl:6,sc:{hill:'#a8906a',hill2:'#8f7856'},d:D('Merkez:1,Kozluk:0.7,Hasankeyf:0.8')},
 {id:'erzurum',n:'Erzurum',land:6000,dem:0.92,lvl:7,cold:1,sc:{hill:'#8e9a8a',hill2:'#78857a',peak:1,snow:1},d:D('Yakutiye:1,Palandöken:1.2,Aziziye:0.8')},
 {id:'van',n:'Van',land:5500,dem:0.9,lvl:7,cold:1,sc:{sea:1,hill:'#8e9a8a',hill2:'#78857a',peak:1,snow:1},d:D('İpekyolu:1,Tuşba:0.95,Edremit:1.1')},
 {id:'baku',n:'Bakü',land:30000,dem:1.12,lvl:8,abroad:1,fee:40e6,bc:1.2,sc:{sea:1,hill:'#b39b74',hill2:'#9a835e',flames:1,far:1},d:D('Sabail:1.4,Nasimi:1.2,Yasamal:1,Khatai:0.9')},
 {id:'berlin',n:'Berlin',land:70000,dem:1.16,lvl:9,abroad:1,fee:120e6,bc:1.5,cold:1,sc:{hill:'#6a7f73',hill2:'#56695f',spire:1,far:1},d:D('Mitte:1.5,Kreuzberg:1.2,Charlottenburg:1.3,Neukölln:0.9')},
 {id:'dubai',n:'Dubai',land:60000,dem:1.24,lvl:10,abroad:1,fee:200e6,bc:1.4,tour:1,sc:{sea:1,hill:'#d9b77e',hill2:'#c9a46a',palm:1,mega:1,far:1},d:D('Downtown:1.6,Marina:1.5,Jumeirah:1.4,Deira:0.9,Palm:2')},
 {id:'paris',n:'Paris',land:95000,dem:1.18,lvl:11,abroad:1,fee:300e6,bc:1.6,sc:{hill:'#7c8f7a',hill2:'#667a66',lattice:1,far:1},d:D('Le Marais:1.5,Montmartre:1.2,La Défense:1.3,Bastille:1.1')},
 {id:'londra',n:'Londra',land:110000,dem:1.2,lvl:12,abroad:1,fee:400e6,bc:1.7,cold:1,sc:{sea:1,hill:'#6b7f78',hill2:'#58695f',spire:1,far:1},d:D('Kensington:1.6,Camden:1.1,Canary Wharf:1.4,Hackney:0.95')},
 {id:'newyork',n:'New York',land:150000,dem:1.25,lvl:13,abroad:1,fee:600e6,bc:1.8,cold:1,sc:{sea:1,hill:'#6b7a80',hill2:'#56656b',mega:1,far:1},d:D('Manhattan:1.8,Brooklyn:1.2,Queens:1,Bronx:0.8')},
 {id:'tokyo',n:'Tokyo',land:130000,dem:1.22,lvl:14,abroad:1,fee:700e6,bc:1.7,sc:{hill:'#7a8a9a',hill2:'#66768a',peak:1,snow:1,mega:1,far:1},d:D('Shibuya:1.6,Shinjuku:1.5,Minato:1.7,Taito:1')},
];
const CITY=Object.fromEntries(CITIES.map(c=>[c.id,c]));

const TYPES=[
 {id:'ev',n:'Müstakil Ev',min:250,units:1,cost:3.0e6,days:4,margin:1.35,yield:0.0035,lvl:1,uname:'ev'},
 {id:'apt',n:'Apartman',min:500,units:8,cost:16e6,days:7,margin:1.4,yield:0.0035,lvl:1,uname:'daire'},
 {id:'villa',n:'Villa Sitesi',min:1500,units:4,cost:36e6,days:9,margin:1.5,yield:0.0033,lvl:2,uname:'villa'},
 {id:'rez',n:'Rezidans',min:1800,units:24,cost:85e6,days:12,margin:1.5,yield:0.0036,lvl:3,uname:'daire'},
 {id:'otel',n:'Otel',min:2500,units:1,cost:160e6,days:15,margin:1.45,yield:0.0062,lvl:4,uname:'işletme'},
 {id:'fabrika',n:'Fabrika',min:4000,units:1,cost:140e6,days:13,margin:1.35,yield:0.0068,lvl:4,uname:'tesis'},
 {id:'avm',n:'Alışveriş Merkezi',min:5000,units:30,cost:320e6,days:18,margin:1.5,yield:0.005,lvl:5,uname:'dükkan'},
 {id:'ofis',n:'Ofis Plazası',min:3000,units:40,cost:260e6,days:16,margin:1.5,yield:0.0045,lvl:6,uname:'ofis'},
 {id:'kule',n:'Gökdelen',min:3500,units:80,cost:700e6,days:25,margin:1.6,yield:0.0037,lvl:7,uname:'daire'},
 {id:'hastane',n:'Özel Hastane',min:5000,units:1,cost:520e6,days:22,margin:1.45,yield:0.0066,lvl:8,uname:'işletme'},
 {id:'stadyum',n:'Stadyum',min:8000,units:1,cost:1.1e9,days:30,margin:1.45,yield:0.0072,lvl:9,uname:'işletme'},
 {id:'yurt',n:'Öğrenci Yurdu',min:800,units:1,cost:22e6,days:8,margin:1.35,yield:0.0062,lvl:2,uname:'işletme'},
 {id:'depo',n:'Lojistik Deposu',min:2000,units:1,cost:45e6,days:8,margin:1.3,yield:0.0066,lvl:3,uname:'tesis'},
 {id:'site',n:'Konut Sitesi',min:4000,units:48,cost:180e6,days:16,margin:1.5,yield:0.0035,lvl:4,uname:'daire'},
 {id:'ozelokul',n:'Özel Okul',min:2500,units:1,cost:90e6,days:12,margin:1.4,yield:0.0064,lvl:5,uname:'işletme'},
 {id:'marina',n:'Marina',min:5000,units:60,cost:400e6,days:20,margin:1.55,yield:0.0042,lvl:8,uname:'tekne yeri',coast:1},
];
const TYPE=Object.fromEntries(TYPES.map(t=>[t.id,t]));
const QUAL={eco:{n:'Ekonomik',cost:0.8,val:0.88,days:0.85},std:{n:'Standart',cost:1,val:1,days:1},lux:{n:'Lüks',cost:1.35,val:1.26,days:1.2}};
const STAFF=[
 {id:'eng',n:'İnşaat Mühendisi',sal:60000,max:5,d:'Her biri inşaatı %20 hızlandırır.'},
 {id:'agent',n:'Satış Danışmanı',sal:40000,max:5,d:'Her biri satış şansını %15, satış fiyatını %1 artırır.'},
 {id:'arch',n:'Mimar',sal:80000,max:5,d:'Her biri yeni projelerin değerini %3 artırır.'},
 {id:'acct',n:'Muhasebeci',sal:50000,max:4,d:'Her biri kredi faizini %8, tapu harcını 0,5 puan düşürür.'},
];
const VEH=[
 {id:'kamyon',n:'Kamyon',cost:1.5e6,sp:0.05,lvl:1},
 {id:'mikser',n:'Beton Mikseri',cost:2.5e6,sp:0.07,lvl:1},
 {id:'vinc',n:'Mobil Vinç',cost:6e6,sp:0.10,lvl:2},
 {id:'pompa',n:'Beton Pompası',cost:9e6,sp:0.12,lvl:3},
 {id:'kvinc',n:'Kule Vinç',cost:15e6,sp:0.15,lvl:4},
];
const VEH_MAX=3;
const MAT=[{id:'cimento',n:'Çimento',col:'#b9bec4'},{id:'demir',n:'İnşaat Demiri',col:'#8a5a44'},{id:'tugla',n:'Tuğla',col:'#c4573d'}];
const OFFICE=[
 {n:'Garaj ofis',cost:0,art:'ev'},{n:'Küçük büro',cost:2e6,art:'apt'},{n:'Kat ofisi',cost:15e6,art:'rez'},
 {n:'Plaza katı',cost:80e6,art:'ofis'},{n:'Genel merkez kulesi',cost:400e6,art:'kule'}];
const DECO=[
 {id:'agac',n:'Ağaç',cost:2e5,W:26,bon:0.002},
 {id:'fiskiye',n:'Fıskiye',cost:1e6,W:44,bon:0.01},
 {id:'park',n:'Park',cost:2e6,W:76,bon:0.02},
 {id:'heykel',n:'Heykel',cost:5e6,W:38,bon:0.03},
];
const DECOK=Object.fromEntries(DECO.map(d=>[d.id,d]));
const KAMU=[{k:'okul',n:'İlkokul'},{k:'hastane',n:'Devlet Hastanesi'},{k:'kutuphane',n:'Halk Kütüphanesi'},{k:'spor',n:'Spor Salonu'},{k:'kultur',n:'Kültür Merkezi'}];
const WX={sun:{n:'Güneşli',sp:1},cloud:{n:'Bulutlu',sp:1},rain:{n:'Yağmurlu',sp:0.75},snow:{n:'Karlı',sp:0.6},storm:{n:'Fırtına',sp:0.4}};
const SIZES=[250,300,400,500,600,800,1200,1500,1800,2200,2500,3000,3500,4500,5000,6500,8000];
const RIVALS=[['Demirkaya Yapı','#e74c3c'],['Ozan İnşaat','#3fa9f5'],['Kuzey Grup','#4cc38a'],['Atlas Konut','#a58be0'],['Ege Yatırım','#f28c38']];
const LOGO_COLS=['#ff7a52','#e74c3c','#3fa9f5','#4cc38a','#a58be0','#f28c38'];

const COMMS=['tarim','hayvan','enerji','petrol','maden','altin','hizmet'];
const COMMN={tarim:'Tarım ürünleri',hayvan:'Hayvansal ürünler',enerji:'Elektrik',petrol:'Petrol',maden:'Maden',altin:'Altın',hizmet:'Tüketim'};
const BCAT=[['tarim','Tarım','#7bbf5a'],['hayvan','Hayvancılık','#e4a35c'],['enerji','Enerji','#f2d038'],['petrol','Petrol','#555f6b'],['maden','Maden','#9a8f86'],['sanayi','Sanayi','#c4573d'],['hizmet','Hizmet','#6ab0f3']];
// id, kategori, ad, kurulum, günlük gelir, emtia, seviye, bölge bonusu, risk, açıklama
const BIZ=[
 ['bugday','tarim','Buğday tarlası',2e6,17e3,'tarim',1,['konya','eskisehir','ankara'],0,'Hasat her gün satılır. Kuraklıkta düşer.'],
 ['sera','tarim','Sera (sebze)',5e6,42e3,'tarim',1,['antalya','mersin','adana'],0,'Akdeniz ikliminde verim yüksek.'],
 ['findik','tarim','Fındık bahçesi',8e6,68e3,'tarim',2,['trabzon','samsun','sakarya'],0,'Karadeniz\'de 1,5 kat verim.'],
 ['zeytin','tarim','Zeytinlik',10e6,84e3,'tarim',2,['izmir','mugla'],0,'Ege\'de 1,5 kat verim.'],
 ['pamuk','tarim','Pamuk tarlası',12e6,100e3,'tarim',3,['adana','gaziantep','diyarbakir'],0,'Çukurova\'nın beyaz altını.'],
 ['tavuk','hayvan','Tavuk çiftliği',4e6,34e3,'hayvan',1,['bursa','sakarya'],0,'Yumurta ve et satışı.'],
 ['sut','hayvan','Süt çiftliği',15e6,122e3,'hayvan',2,['erzurum','van','kayseri'],0,'Doğu\'da meralar geniş.'],
 ['balik','hayvan','Balık çiftliği',20e6,165e3,'hayvan',3,['mugla','izmir','trabzon'],0,'Kıyı şehirlerinde kurulur.'],
 ['gunes','enerji','Güneş santrali',40e6,310e3,'enerji',3,['konya','antalya','gaziantep'],0,'Bulutlu ve yağmurlu günlerde az üretir.'],
 ['ruzgar','enerji','Rüzgar santrali',70e6,540e3,'enerji',4,['izmir','tekirdag'],0,'Fırtınalı günlerde fazla üretir.'],
 ['hes','enerji','Hidroelektrik santrali',150e6,1.15e6,'enerji',6,['trabzon','erzurum','van'],0,'Yağmurlu günlerde fazla üretir.'],
 ['istasyon','petrol','Akaryakıt istasyonu',6e6,50e3,'petrol',1,[],0,'Her şehirde kurulabilir.'],
 ['kuyu','petrol','Petrol kuyusu',60e6,720e3,'petrol',5,['batman','diyarbakir','baku','dubai'],0.4,'Sondaj 3 gün sürer. %40 ihtimalle kuyu kuru çıkar ve para yanar.'],
 ['rafineri','petrol','Rafineri',600e6,5.2e6,'petrol',9,['kocaeli','izmir','batman'],0,'Dev yatırım, dev gelir.'],
 ['tas','maden','Taş ocağı',8e6,64e3,'maden',2,[],0,'Tuğla ve beton maliyetini de düşürür.'],
 ['mermer','maden','Mermer ocağı',25e6,205e3,'maden',3,['mugla','bursa','eskisehir'],0,'Lüks yapıların vazgeçilmezi.'],
 ['komur','maden','Kömür madeni',50e6,410e3,'maden',4,['erzurum','sakarya'],0,'İstikrarlı gelir.'],
 ['altin','maden','Altın madeni',120e6,1.6e6,'altin',6,['erzurum','izmir','eskisehir'],0.5,'Arama 3 gün sürer. %50 ihtimalle damar çıkmaz.'],
 ['beton','sanayi','Hazır beton tesisi',30e6,195e3,'hizmet',2,[],0,'Çimento maliyetin %15 düşer.'],
 ['tugla','sanayi','Tuğla fabrikası',25e6,170e3,'hizmet',2,[],0,'Tuğla maliyetin %15 düşer.'],
 ['celik','sanayi','Çelik fabrikası',200e6,1.4e6,'hizmet',6,['kocaeli','batman'],0,'Demir maliyetin %15 düşer.'],
 ['tekstil','sanayi','Tekstil fabrikası',60e6,460e3,'hizmet',4,['bursa','gaziantep','tekirdag'],0,'İhracat geliri.'],
 ['kafe','hizmet','Kafe',1.5e6,13e3,'hizmet',1,[],0,'Küçük ama hızlı geri döner.'],
 ['otopark','hizmet','Otopark',3e6,25e3,'hizmet',1,['istanbul','ankara'],0,'Büyük şehirde daha çok araç.'],
 ['restoran','hizmet','Restoran zinciri',10e6,84e3,'hizmet',2,['istanbul','izmir','gaziantep'],0,'Gaziantep mutfağı bonus verir.'],
 ['nakliye','hizmet','Nakliye şirketi',20e6,160e3,'hizmet',3,['kocaeli','mersin'],0,'Liman şehirlerinde bonus.'],
 ['tur','hizmet','Tur şirketi',12e6,100e3,'hizmet',3,['antalya','mugla','istanbul'],0,'Turizm sezonundan etkilenir.'],
 ['market','hizmet','Market zinciri',40e6,320e3,'hizmet',4,['istanbul','ankara','izmir'],0,'Her mahallede bir şube.'],
 ['tv','hizmet','Televizyon kanalı',300e6,2.2e6,'hizmet',9,['istanbul'],0,'Reklam geliri.'],
 ['liman','hizmet','Liman işletmesi',400e6,3e6,'hizmet',8,['mersin','izmir','kocaeli','samsun'],0,'Kıyı şehirlerinde kurulur.'],
 ['futbol','hizmet','Futbol kulübü',1e9,6.5e6,'hizmet',11,['istanbul','ankara','izmir','trabzon'],0,'Şampiyonluk yılında gelir patlar.'],
 ['havayolu','hizmet','Havayolu şirketi',2e9,13e6,'hizmet',12,['istanbul','antalya'],0,'Göklerin patronu ol.'],
].map(([id,cat,n,cost,inc,comm,lvl,reg,risk,d])=>({id,cat,n,cost,inc,comm,lvl,reg,risk,d,coast:['balik','liman'].includes(id)}));
const BIZK=Object.fromEntries(BIZ.map(b=>[b.id,b]));
const GOALS=[
 {id:'plot1',n:'İlk arsa',d:'Bir arsa satın al',r:5e5,p:()=>[S.stats.plots,1]},
 {id:'build1',n:'Temel atıldı',d:'İlk inşaatını bitir',r:1e6,p:()=>[S.stats.built,1]},
 {id:'veh1',n:'Filo kuruldu',d:'Bir iş makinesi al',r:1e6,p:()=>[vehCount(),1]},
 {id:'sold10',n:'Satış ustası',d:'10 birim sat',r:3e6,p:()=>[S.stats.sold,10]},
 {id:'apt',n:'Apartman sahibi',d:'Bir apartman bitir',r:4e6,p:()=>[S.stats.types.apt||0,1]},
 {id:'staff3',n:'Ekip kuruldu',d:'Ekibinde 3 kişi olsun',r:2e6,p:()=>[staffCount(),3]},
 {id:'biz1',n:'Girişimci',d:'İşler sekmesinden bir işletme kur',r:2e6,p:()=>[S.biz.length,1]},
 {id:'kamu1',n:'Devletle iş',d:'Bir kamu projesini teslim et',r:5e6,p:()=>[S.stats.kamu,1]},
 {id:'rent',n:'Kira geliri',d:'Günlük kiran ₺250 B olsun',r:5e6,p:()=>[dailyRent(),250000],money:1},
 {id:'office2',n:'Yeni ofis',d:'Ofisini kat ofisine büyüt',r:6e6,p:()=>[S.office,2]},
 {id:'worth100',n:'Yüz milyonluk',d:'Servetin ₺100 Mn olsun',r:10e6,p:()=>[worth(),100e6],money:1},
 {id:'renew1',n:'Şehri yenile',d:'Bir kentsel dönüşüm projesi bitir',r:8e6,p:()=>[S.stats.renew,1]},
 {id:'auction1',n:'Tokmak vuruldu',d:'Bir arsa ihalesi kazan',r:8e6,p:()=>[S.stats.auctions,1]},
 {id:'otel',n:'Otelci',d:'Bir otel aç',r:20e6,p:()=>[S.stats.types.otel||0,1]},
 {id:'ipo',n:'Gong çaldı',d:'Şirketini halka aç',r:20e6,p:()=>[S.ipo?1:0,1]},
 {id:'sold100',n:'Konut kralı',d:'100 birim sat',r:30e6,p:()=>[S.stats.sold,100]},
 {id:'biz10',n:'Holding',d:'10 işletmen olsun',r:50e6,p:()=>[S.biz.filter(b=>b.state!=='dry').length,10]},
 {id:'oil',n:'Kara altın',d:'Petrol bul',r:40e6,p:()=>[S.biz.filter(b=>b.t==='kuyu'&&b.state==='ok').length,1]},
 {id:'abroad',n:'Sınır ötesi',d:'Yurt dışında ofis aç',r:50e6,p:()=>[Object.keys(S.branches).length,1]},
 {id:'avm',n:'Çarşı patronu',d:'Bir alışveriş merkezi aç',r:60e6,p:()=>[S.stats.types.avm||0,1]},
 {id:'rank1',n:'Sektör lideri',d:'Sıralamada 1. ol',r:80e6,p:()=>[myRank()===1?1:0,1]},
 {id:'kule',n:'Göğe değen',d:'Bir gökdelen dik',r:150e6,p:()=>[S.stats.types.kule||0,1]},
 {id:'worth1b',n:'Milyarder',d:'Servetin ₺1 Mr olsun',r:100e6,p:()=>[worth(),1e9],money:1},
 {id:'stadyum',n:'Taraftar',d:'Bir stadyum yap',r:300e6,p:()=>[S.stats.types.stadyum||0,1]},
 {id:'worth10b',n:'Yapı Baronu',d:'Servetin ₺10 Mr olsun',r:1e9,p:()=>[worth(),10e9],money:1},
];

// ---------- helpers
const $=s=>document.querySelector(s);
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const uid=()=>Math.random().toString(36).slice(2,9);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash(s){let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}
function hex2(c){c=c.replace('#','');return [parseInt(c.slice(0,2),16),parseInt(c.slice(2,4),16),parseInt(c.slice(4,6),16)]}
function mix(a,b,t){const x=hex2(a),y=hex2(b);return 'rgb('+x.map((v,i)=>Math.round(v+(y[i]-v)*t)).join(',')+')'}
function fmt(n){
  const s=n<0?'-':''; n=Math.abs(n);
  if(n>=1e9) return s+'₺'+(n/1e9).toLocaleString('tr-TR',{maximumFractionDigits:2})+' Mr';
  if(n>=1e6) return s+'₺'+(n/1e6).toLocaleString('tr-TR',{maximumFractionDigits:n>=1e8?0:1})+' Mn';
  if(n>=1e3) return s+'₺'+Math.round(n/1e3).toLocaleString('tr-TR')+' B';
  return s+'₺'+Math.round(n);
}
const m2=n=>n.toLocaleString('tr-TR')+' m²';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function today(d=new Date()){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}

// ---------- settings + audio
let SET={music:true,sfx:true,vib:true};
try{Object.assign(SET,JSON.parse(localStorage.getItem(SET_KEY)||'{}'))}catch(e){}
function saveSet(){try{localStorage.setItem(SET_KEY,JSON.stringify(SET))}catch(e){}}
const AU={ctx:null,master:null,sfx:null,mus:null,noise:null,last:{}};
function audioInit(){
  if(AU.ctx){if(AU.ctx.state==='suspended')AU.ctx.resume();return}
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const c=AU.ctx=new C();AU.master=c.createGain();AU.master.gain.value=0.9;AU.master.connect(c.destination);
    AU.sfx=c.createGain();AU.sfx.gain.value=SET.sfx?1:0;AU.sfx.connect(AU.master);
    AU.mus=c.createGain();AU.mus.gain.value=SET.music?0.55:0;AU.mus.connect(AU.master);
    const len=c.sampleRate;const buf=c.createBuffer(1,len,c.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;AU.noise=buf;
    music.next=c.currentTime+0.1;
  }catch(e){AU.ctx=null}
}
function tone(f,dur,type,vol,at=0,slide,dest){
  const c=AU.ctx;if(!c)return;const t=c.currentTime+at;
  const o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);
  if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.008);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g);g.connect(dest||AU.sfx);o.start(t);o.stop(t+dur+0.02);
}
function noise(dur,vol,at=0,freq=3000,ftype='bandpass',dest){
  const c=AU.ctx;if(!c||!AU.noise)return;const t=c.currentTime+at;
  const s=c.createBufferSource();s.buffer=AU.noise;const f=c.createBiquadFilter();f.type=ftype;f.frequency.value=freq;
  const g=c.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  s.connect(f);f.connect(g);g.connect(dest||AU.sfx);s.start(t,Math.random()*0.5);s.stop(t+dur+0.02);
}
const SFX={
  tap:()=>tone(820,0.05,'sine',0.07),
  buy:()=>{tone(523,0.09,'square',0.045);tone(784,0.12,'square',0.045,0.07)},
  cash:()=>{tone(1318,0.08,'square',0.04);tone(1760,0.22,'square',0.04,0.07);noise(0.18,0.08,0.07,7000,'highpass')},
  build:()=>{for(let i=0;i<3;i++){noise(0.07,0.25,i*0.15,900,'lowpass');tone(170,0.06,'square',0.05,i*0.15)}},
  complete:()=>[523,659,784,1046].forEach((f,i)=>tone(f,0.25,'triangle',0.09,i*0.1)),
  level:()=>{[523,659,784,1046,1318].forEach((f,i)=>tone(f,0.2,'triangle',0.08,i*0.09));[523,659,784].forEach(f=>tone(f*2,0.7,'triangle',0.05,0.5))},
  error:()=>tone(240,0.22,'sawtooth',0.05,0,110),
  gavel:()=>{noise(0.09,0.3,0,500,'lowpass');tone(150,0.14,'sine',0.25,0,70)},
  reward:()=>{[784,988,1175,1568,1976].forEach((f,i)=>tone(f,0.16,'sine',0.07,i*0.05));noise(0.4,0.05,0.2,8000,'highpass')},
  coin:()=>{tone(1568,0.06,'triangle',0.05);tone(2093,0.12,'triangle',0.05,0.05)},
  open:()=>tone(600,0.08,'sine',0.06,0,900),
  tick:()=>tone(1400,0.025,'square',0.03),
  alarm:()=>{[0,0.18,0.36].forEach(t=>tone(660,0.12,'square',0.05,t,440))},
  thunder:()=>{noise(1.4,0.35,0,180,'lowpass');noise(0.3,0.2,0,1200,'lowpass')},
  engine:()=>{tone(90,0.5,'sawtooth',0.05,0,140);noise(0.5,0.08,0,400,'lowpass')},
};
function sfx(n){if(!AU.ctx||!SET.sfx)return;const now=performance.now();if(AU.last[n]&&now-AU.last[n]<90)return;AU.last[n]=now;try{SFX[n]&&SFX[n]()}catch(e){}}
function vib(p){if(!SET.vib)return;try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
const music={next:0,step:0};
const mtof=m=>440*Math.pow(2,(m-69)/12);
const CHORDS=[[57,60,64,67],[53,57,60,64],[48,55,60,64],[55,59,62,67]];
const ARP=[0,1,2,3,2,1,2,3];
function musicTick(){
  const c=AU.ctx;if(!c||c.state!=='running')return;
  const spb=60/94/4;
  if(music.next<c.currentTime)music.next=c.currentTime+0.05;
  while(music.next<c.currentTime+0.3){
    const s=music.step,bar=(s>>4)%4,i=s&15,ch=CHORDS[bar],t=music.next-c.currentTime;
    if(SET.music){
      if(i===0)ch.forEach(m=>padNote(mtof(m),t,spb*16));
      if(i===0||i===6||i===8||i===14)tone(mtof(ch[0]-12),0.32,'triangle',0.1,t,null,AU.mus);
      if(i%2===0&&!(i===10&&bar%2))tone(mtof(ch[ARP[(i/2)%8]]+12),0.22,'sine',0.035,t,null,AU.mus);
      if(i%4===2)noise(0.04,0.03,t,8000,'highpass',AU.mus);
      if(i%8===0)tone(110,0.16,'sine',0.13,t,45,AU.mus);
    }
    music.next+=spb;music.step=(s+1)%64;
  }
}
function padNote(f,at,dur){
  const c=AU.ctx,t=c.currentTime+at;const o=c.createOscillator(),g=c.createGain(),fl=c.createBiquadFilter();
  o.type='triangle';o.frequency.value=f;fl.type='lowpass';fl.frequency.value=1100;
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.028,t+0.4);g.gain.setValueAtTime(0.028,t+dur-0.4);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(fl);fl.connect(g);g.connect(AU.mus);o.start(t);o.stop(t+dur+0.05);
}
setInterval(musicTick,80);

function toast(msg,kind){
  const el=document.createElement('div');el.className='toast '+(kind||'');el.textContent=msg;
  const box=$('#toasts');box.appendChild(el);while(box.children.length>3)box.firstChild.remove();setTimeout(()=>el.remove(),2800);
  if(kind==='bad'){sfx('error');vib(60)}
}
function floater(text,neg){
  const r=$('#cash').getBoundingClientRect();const el=document.createElement('div');el.className='floater'+(neg?' neg':'');el.textContent=text;
  el.style.right=(innerWidth-r.right)+'px';el.style.top=(r.bottom+2)+'px';document.body.appendChild(el);setTimeout(()=>el.remove(),1500);
}
function coinBurst(x,y,n=10){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const r=$('#cash').getBoundingClientRect();const tx=r.left+r.width/2,ty=r.top+r.height/2;
  for(let i=0;i<n;i++){
    const c=document.createElement('div');c.className='coin';c.style.left=(x-8)+'px';c.style.top=(y-8)+'px';document.body.appendChild(c);
    const dx=rnd(-60,60),dy=rnd(-80,-20);
    const a=c.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${dx}px,${dy}px) scale(1.1)`,offset:.35},{transform:`translate(${tx-x}px,${ty-y}px) scale(.5)`,opacity:.8}],{duration:700+i*45,easing:'cubic-bezier(.3,.1,.3,1)'});
    a.onfinish=()=>{c.remove();if(i%3===0)sfx('coin')};
  }
}

// ---------- state
let S;
function newGame(company){
  S={v:3,company:company||'Anadolu Yapı',money:10e6,t:0,day:1,xp:0,tut:0,
    idx:Object.fromEntries(CITIES.map(c=>[c.id,1])),prevIdx:Object.fromEntries(CITIES.map(c=>[c.id,1])),
    branches:{},plots:[],bld:[],loans:[],staff:{eng:0,agent:0,arch:0,acct:0},
    renew:{},auction:null,news:[],log:[],seenAuction:true,lastSeen:Date.now(),
    stats:{sold:0,built:0,plots:0,renew:0,auctions:0,kamu:0,types:{}},claimed:{},view:'istanbul'};
  migrate();
  CITIES.forEach(c=>{S.renew[c.id]=[]});
  S.news.unshift({d:1,txt:`${S.company} İstanbul'da kuruldu. Kasada 10 milyon lira var: Esenyurt'tan ucuz bir arsa al, ilk evini yap.`});
}
function migrate(){
  S.company=S.company||'Anadolu Yapı';S.stats=Object.assign({sold:0,built:0,plots:0,renew:0,auctions:0,kamu:0,types:{}},S.stats||{});
  S.claimed=S.claimed||{};if(S.tut==null)S.tut=S.stats.sold>0?99:0;S.view=S.view||'istanbul';S.dist=S.dist||{};S.biz=S.biz||[];S.comm=S.comm||{};COMMS.forEach(k=>{if(S.comm[k]==null)S.comm[k]=1});S.plots.forEach(p=>{if(p.dm==null)p.dm=1});
  S.bld.forEach(b=>{b.q=b.q||'std';if(b.rr==null)b.rr=1;if(b.cond==null)b.cond=100});
  S.veh=S.veh||Object.fromEntries(VEH.map(v=>[v.id,{own:0,rented:0}]));VEH.forEach(v=>{S.veh[v.id]=S.veh[v.id]||{own:0,rented:0}});
  S.mat=S.mat||{idx:Object.fromEntries(MAT.map(m=>[m.id,1])),stock:Object.fromEntries(MAT.map(m=>[m.id,0])),depot:0};
  S.kamu=S.kamu||[];S.landmarks=S.landmarks||[];
  S.rivals=S.rivals||RIVALS.map(([n,col],i)=>({id:'r'+i,n,col,w:[12e6,25e6,40e6,70e6,120e6][i],prev:0}));
  S.shares=S.shares||{};S.ipo=S.ipo||null;S.ins=!!S.ins;
  S.deco=S.deco||[];S.street=S.street||{};
  S.logo=S.logo||{shape:0,col:0};S.office=S.office||0;
  S.wx=S.wx||{k:'sun'};S.daily=S.daily||{last:null,streak:0,spun:null};
  S.strike=S.strike||0;
  CITIES.forEach(c=>{if(S.idx[c.id]==null){S.idx[c.id]=1;S.prevIdx[c.id]=1}if(S.renew&&!S.renew[c.id])S.renew[c.id]=[]});
}
function load(){try{const raw=localStorage.getItem(SAVE_KEY);if(raw){S=JSON.parse(raw);migrate();return true}}catch(e){}return false}
function save(){if(!S)return;S.lastSeen=Date.now();try{localStorage.setItem(SAVE_KEY,JSON.stringify(S))}catch(e){}}

// ---------- derived
function level(){let l=1;while(S.xp>=xpFor(l+1))l++;return l}
function xpFor(l){return l<=1?0:Math.round(20*Math.pow(l-1,1.8))}
function cityOpen(c){return level()>=c.lvl&&(!c.abroad||S.branches[c.id])}
function fairLand(cid,size,dm=1){return size*CITY[cid].land*dm*S.idx[cid]}
function baseCost(tid,cid,q='std'){return TYPE[tid].cost*(CITY[cid].bc||1)*QUAL[q].cost}
function costPlan(tid,cid,q){
  const base=baseCost(tid,cid,q);let cash=base*0.7;const use={};
  MAT.forEach(m=>{const need=base*0.1,u=Math.min(S.mat.stock[m.id],need);use[m.id]=u;cash+=(need-u)*S.mat.idx[m.id]*matDisc(m.id)});
  return {base,cash:Math.round(cash),use};
}
function harcRate(){return Math.max(0.02,0.04-0.005*S.staff.acct)}
function decoBonus(cid){let b=0;S.deco.filter(d=>d.city===cid).forEach(d=>b+=DECOK[d.k].bon);return Math.min(0.25,b)}
function unitValue(b){return b.base*S.idx[b.city]*(1+0.01*S.staff.agent)*(1+decoBonus(b.city)*0.5)}
function unitRent(b){const t=TYPE[b.type];let y=t.yield;if((t.id==='otel')&&CITY[b.city].tour)y*=1.4;
  return b.base*S.idx[b.city]*y*(b.rr||1)*(0.6+0.4*(b.cond??100)/100)*(1+decoBonus(b.city))}
function dailyRent(){let r=0;S.bld.forEach(b=>{if(b.done)b.units.forEach(u=>{if(u==='rented')r+=unitRent(b)})});return r}
function vehIncome(){return VEH.reduce((a,v)=>a+S.veh[v.id].rented*v.cost*0.012,0)}
function vehUpkeep(){return VEH.reduce((a,v)=>a+S.veh[v.id].own*v.cost*0.002,0)}
function vehCount(){return VEH.reduce((a,v)=>a+S.veh[v.id].own,0)}
function vehSpeed(){return Math.min(1,VEH.reduce((a,v)=>a+(S.veh[v.id].own-S.veh[v.id].rented)*v.sp,0))}
function insPremium(){return S.ins?Math.max(20000,assets()*0.0003):0}
function dividends(){return S.ipo?dailyRent()*S.ipo.pct:0}
function bizInvest(b){const d=BIZK[b.t];let c=d.cost;for(let l=2;l<=b.lvl;l++)c+=d.cost*0.8*(l-1);return c}
function bizRegion(b){return BIZK[b.t].reg.includes(b.city)}
function bizIncome(b){
  if(b.state!=='ok')return 0;const d=BIZK[b.t];let wx=1;const k=S.wx.k;
  if(d.cat==='tarim')wx=k==='storm'?0.6:k==='snow'?0.8:1;
  if(d.id==='gunes')wx=k==='sun'?1.2:k==='cloud'?0.8:0.4;
  if(d.id==='ruzgar')wx=k==='storm'?1.6:k==='rain'?1.1:0.9;
  if(d.id==='hes')wx=k==='rain'||k==='storm'?1.4:0.9;
  return d.inc*Math.pow(1.5,b.lvl-1)*S.comm[d.comm]*(bizRegion(b)?1.5:1)*wx;
}
function bizDaily(){return S.biz.reduce((a,b)=>a+bizIncome(b),0)}
function hasBiz(id){return S.biz.some(b=>b.t===id&&b.state==='ok')}
function matDisc(m){return 1-((m==='cimento'&&hasBiz('beton'))||(m==='tugla'&&hasBiz('tugla'))||(m==='demir'&&hasBiz('celik'))?0.15:0)-(hasBiz('tas')&&m!=='demir'?0.05:0)}
function dailySalary(){return STAFF.reduce((a,s)=>a+s.sal*S.staff[s.id],0)}
function dailyNet(){return dailyRent()+bizDaily()+vehIncome()-dailySalary()-vehUpkeep()-insPremium()-dividends()}
function staffCount(){return STAFF.reduce((a,s)=>a+S.staff[s.id],0)}
function staffMax(s){return s.max+Math.floor(S.office/2)}
function debt(){return S.loans.reduce((a,l)=>a+l.amount+l.interest,0)}
function sharePrice(r){return r.w/1e6}
function portfolio(){return S.rivals.reduce((a,r)=>a+(S.shares[r.id]||0)*sharePrice(r),0)}
function assets(){
  let v=0;S.plots.forEach(p=>v+=fairLand(p.city,p.size,p.dm));S.biz.forEach(b=>{if(b.state!=='dry')v+=bizInvest(b)*0.7});
  S.bld.forEach(b=>{if(!b.done){v+=b.invest*0.9;return}if(b.kamu)return;b.units.forEach(u=>{if(u==='empty'||u==='listing'||u==='rented')v+=unitValue(b)})});
  VEH.forEach(x=>v+=S.veh[x.id].own*x.cost*0.6);MAT.forEach(m=>v+=S.mat.stock[m.id]*S.mat.idx[m.id]*0.9);
  v+=portfolio();return v;
}
function worth(){return (S.money+assets()-debt())*(S.ipo?1-S.ipo.pct:1)}
function creditLimit(){return Math.max(8e6,Math.round((assets()+Math.max(0,S.money))*0.6*(1+0.1*S.office)/1e6)*1e6)-debt()}
function speed(cid){
  let wx=WX[S.wx.k].sp;if(S.wx.k==='snow'&&!CITY[cid].cold)wx=WX.rain.sp;
  return (S.strike>0?0:1)*(1+0.2*S.staff.eng+vehSpeed())*wx;
}
function goalState(g){const [c,t]=g.p();if(S.claimed[g.id])return 'done';return c>=t?'ready':'open'}
function readyGoals(){return GOALS.filter(g=>goalState(g)==='ready').length}
function ranking(){const arr=[...S.rivals.map(r=>({n:r.n,w:r.w,col:r.col})),{n:S.company,w:worth(),me:1}];return arr.sort((a,b)=>b.w-a.w)}
function myRank(){return ranking().findIndex(x=>x.me)+1}
function depotCap(){return 20e6*Math.pow(2.2,S.mat.depot)}
function stockTotal(){return MAT.reduce((a,m)=>a+S.mat.stock[m.id],0)}

// ---------- generation
const PSIZES=[250,300,400,500,600,800,1000,1200,1500,1800,2000,2500,3000,3500,4000,5000,6000,8000,1500,2200];
function dkey(cid,di){return cid+'|'+di}
function getDist(cid,di){
  const k=dkey(cid,di);if(S.dist[k])return S.dist[k];
  const sizes=[...PSIZES].sort(()=>Math.random()-0.5);
  return S.dist[k]={p:sizes.map(sz=>({s:Math.max(250,Math.round(sz*rnd(0.95,1.1)/10)*10),f:rnd(0.82,1.15),o:Math.random()<0.22?'r':null}))};
}
function parcelPrice(cid,di,pc){return Math.round(pc.s*CITY[cid].land*CITY[cid].d[di][1]*S.idx[cid]*pc.f/1e4)*1e4}
function freeCount(cid,di){const d=S.dist[dkey(cid,di)];return d?d.p.filter(x=>!x.o).length:20}
function setParcel(key,slot,o){if(key==null||slot==null)return;const d=S.dist[key];if(d&&d.p[slot])d.p[slot].o=o}
function marketTick(){
  Object.values(S.dist).forEach(d=>d.p.forEach(pc=>{
    if(!pc.o&&Math.random()<0.012)pc.o='r';
    else if((pc.o==='r'||pc.o==='b')&&Math.random()<0.03){pc.o=null;pc.f=rnd(0.82,1.15)}
    else if(!pc.o&&Math.random()<0.05)pc.f=clamp(pc.f*rnd(0.95,1.05),0.75,1.25);
  }));
}
function genRenewal(c){
  const size=pick([500,600,800,1200,1500,1800]);const di=Math.floor(Math.random()*c.d.length),dm=c.d[di][1];
  const owners=size<=600?pick([3,4]):size<=1200?pick([4,6]):pick([6,8,10]);
  return {id:uid(),size,owners,di,dm,cost:Math.round(fairLand(c.id,size,dm)*rnd(0.18,0.3)/1e4)*1e4,
    name:pick(['Çınar','Yıldız','Lale','Gül','Deniz','Huzur','Bahar','Menekşe','Papatya','Kardelen','Nergis','Sümbül'])+' Apartmanı',year:Math.floor(rnd(1968,1992))};
}
function genKamu(){
  const open=CITIES.filter(cityOpen);const c=pick(open);const k=pick(KAMU);const L=level();
  const cost=Math.round(rnd(4e6,9e6)*Math.pow(1.6,L-1)/1e5)*1e5;
  return {id:uid(),city:c.id,k:k.k,n:`${c.n} ${k.n}`,cost,days:Math.round(rnd(5,10)),exp:S.day+6};
}

// ---------- actions
function spend(a){if(S.money<a){toast('Kasada yeterli para yok. Banka sekmesinden kredi çekebilirsin.','bad');return false}S.money-=a;return true}
function addStreet(cid,id){(S.street[cid]=S.street[cid]||[]).push(id)}
function buyParcel(cid,di,slot){
  const d=getDist(cid,di),pc=d.p[slot];if(!pc||pc.o)return;const price=parcelPrice(cid,di,pc),total=Math.round(price*(1+harcRate()));
  if(!spend(total))return;pc.o='me';
  const id=uid();S.plots.push({id,city:cid,di,slot,key:dkey(cid,di),dm:CITY[cid].d[di][1],size:pc.s,paid:total});addStreet(cid,id);S.stats.plots++;S.view=cid;
  log(`${CITY[cid].n} ${CITY[cid].d[di][0]}'de ${m2(pc.s)} arsa alındı (${fmt(total)}, harç dahil).`);sfx('buy');vib(20);closeSheet();
  toast('Tapu senin! Şimdi üzerine inşaat başlat.','good');render();
}
function sellPlot(pid){
  const p=S.plots.find(x=>x.id===pid);if(!p)return;const v=Math.round(fairLand(p.city,p.size,p.dm)*0.92);
  S.money+=v;S.plots=S.plots.filter(x=>x!==p);setParcel(p.key,p.slot,'r');log(`${CITY[p.city].n}'daki ${m2(p.size)} arsa ${fmt(v)}'ye satıldı.`);sfx('cash');toast('Arsa satıldı: '+fmt(v));closeSheet();render();
}
function acceptRenewal(cid,rid){
  const r=S.renew[cid].find(x=>x.id===rid);if(!r)return;if(!spend(r.cost))return;
  S.renew[cid]=S.renew[cid].filter(x=>x!==r);const id=uid();S.plots.push({id,city:cid,size:r.size,paid:r.cost,owners:r.owners,renewal:r.name,di:r.di??0,dm:r.dm||1});addStreet(cid,id);S.view=cid;
  log(`${r.name} kentsel dönüşüm anlaşması imzalandı. ${r.owners} hak sahibine daire verilecek.`);sfx('gavel');
  toast('Anlaşma imzalandı. Eski bina yıkıldı, arsa hazır.','good');render();
}
function startBuild(pid,tid,q){
  const p=S.plots.find(x=>x.id===pid),t=TYPE[tid];if(!p||!t)return;const plan=costPlan(tid,p.city,q);
  if(p.owners&&t.units<=p.owners){toast('Bu yapı hak sahiplerine yetecek kadar daire içermiyor.','bad');return}
  if(!spend(plan.cash))return;
  MAT.forEach(m=>S.mat.stock[m.id]-=plan.use[m.id]);
  if(t.coast&&!CITY[p.city].sc.sea){toast('Marina sadece deniz kenarındaki şehirlere yapılır.','bad');S.money+=plan.cash;return}
  const archB=1+0.03*S.staff.arch,land=fairLand(p.city,p.size,p.dm)/S.idx[p.city];
  const base=(land+plan.base)/t.units*t.margin*CITY[p.city].dem*archB*QUAL[q].val*(0.92+Math.min(p.size/t.min,2)*0.08);
  const units=Array(t.units).fill('empty');if(p.owners)for(let i=0;i<p.owners;i++)units[i]='owner';
  S.bld.push({id:p.id,city:p.city,di:p.di,key:p.key,slot:p.slot,dm:p.dm,type:tid,q,size:p.size,base,units,invest:plan.cash+(p.paid||0),prog:0,done:false,rr:1,cond:100,renewal:p.renewal||null,name:p.renewal?p.renewal.replace('Apartmanı','Konakları'):genName(t)});
  S.plots=S.plots.filter(x=>x!==p);S.view=p.city;
  log(`${CITY[p.city].n}: ${t.n} inşaatı başladı (${fmt(plan.cash)}).`);sfx('build');vib([30,60,30]);
  toast(t.n+' inşaatı başladı!','good');closeSheet();go('home');
}
function genName(t){
  const a=pick(['Mavi','Yeşil','Güneş','Ufuk','Park','Vadi','Liman','Koru','Bulut','Zirve','Çamlık','Sahil','Eflatun','Mercan','Pera','Akasya','Defne','Martı']);
  return a+' '+{ev:'Evi',apt:'Apartmanı',villa:'Villaları',rez:'Rezidans',otel:'Otel',avm:'Çarşı',kule:'Kule',fabrika:'Sanayi',ofis:'Plaza',hastane:'Hastanesi',stadyum:'Arena',yurt:'Yurdu',depo:'Lojistik',site:'Evleri',ozelokul:'Koleji',marina:'Marina'}[t.id];
}
function setUnits(bid,from,to){const b=S.bld.find(x=>x.id===bid);if(!b)return 0;let n=0;b.units.forEach((u,i)=>{if(from.includes(u)){b.units[i]=to;n++}});return n}
function payout(tot,n,msg,x,y){S.money+=tot;gainXp(tot/1e6);S.stats.sold+=n;sfx('cash');vib(25);coinBurst(x??innerWidth/2,y??innerHeight/2,Math.min(14,4+n));toast(msg,'good')}
function quickSell(bid,ev){
  const b=S.bld.find(x=>x.id===bid);if(!b)return;let n=0,tot=0;
  b.units.forEach((u,i)=>{if(u==='empty'||u==='listing'){tot+=unitValue(b)*0.85;b.units[i]='sold';n++}});
  if(!n)return;log(`${b.name}: ${n} birim hızlı satışla ${fmt(tot)}.`);payout(tot,n,`${n} birim satıldı: +${fmt(tot)}`,ev?.clientX,ev?.clientY);cleanup();render();
}
function sellRented(bid,ev){
  const b=S.bld.find(x=>x.id===bid);if(!b)return;let n=0,tot=0;
  b.units.forEach((u,i)=>{if(u==='rented'){tot+=unitValue(b)*0.97*(0.8+0.2*b.cond/100);b.units[i]='sold';n++}});
  if(!n)return;log(`${b.name}: kiracılı ${n} birim yatırımcıya ${fmt(tot)}.`);payout(tot,n,`Kiracılı satış: +${fmt(tot)}`,ev?.clientX,ev?.clientY);cleanup();render();
}
function repairCost(b){return Math.round(unitValue(b)*b.units.length*0.03*(100-b.cond)/100/1e4)*1e4}
function repair(bid){const b=S.bld.find(x=>x.id===bid);if(!b)return;const c=repairCost(b);if(c<=0)return;if(!spend(c))return;b.cond=100;sfx('build');toast('Tadilat bitti, bina yepyeni.','good');render()}
function setRR(bid,v){const b=S.bld.find(x=>x.id===bid);if(!b)return;b.rr=v;sfx('tap');render()}
function cleanup(){S.bld=S.bld.filter(b=>{const gone=b.done&&!b.kamu&&b.units.every(u=>u==='sold'||u==='owner');if(gone)setParcel(b.key,b.slot,'b');return !gone})}
function gainXp(x){const before=level();S.xp+=x;const after=level();
  if(after>before){
    const un=[...CITIES.filter(c=>c.lvl===after).map(c=>c.n),...TYPES.filter(t=>t.lvl===after).map(t=>t.n),...VEH.filter(v=>v.lvl===after).map(v=>v.n)];
    setTimeout(()=>{sfx('level');vib([40,40,80])},300);
    showLevelUp(after,un);
    S.news.unshift({d:S.day,txt:`${S.company} büyüdü, seviye ${after} oldu.`+(un.length?' Yeni: '+un.join(', ')+'.':'')});
  }}
function showLevelUp(l,un){
  if(!$('#sheet').hidden)return toast(`Seviye ${l}!`+(un.length?' Açıldı: '+un.join(', '):''),'good');
  openSheet(`<div style="text-align:center;display:flex;flex-direction:column;gap:10px;align-items:center">
    <div class="logo" style="font-size:64px">SV.<span>${l}</span></div><h2>Şirketin büyüyor</h2>
    ${un.length?`<p class="hint">Yeni açılanlar:</p><div class="row" style="justify-content:center">${un.map(u=>`<span class="pill y">${u}</span>`).join('')}</div>`:'<p class="hint">Daha büyük arsalar artık ilanlarda.</p>'}
    <button class="btn primary big" data-act="close">Harika</button></div>`);
}
function takeLoan(amount,days,rate){
  if(amount>creditLimit()){toast('Kredi limitin yetmiyor.','bad');return}
  const interest=Math.round(amount*rate*(1-0.08*S.staff.acct));
  S.loans.push({id:uid(),amount,interest,days,left:days});S.money+=amount;sfx('cash');
  log(`${fmt(amount)} kredi çekildi, ${days} gün vadeli, faiz ${fmt(interest)}.`);toast('Kredi hesabına yattı: '+fmt(amount),'good');render();
}
function repay(lid){
  const l=S.loans.find(x=>x.id===lid);if(!l)return;const due=Math.round(l.amount+l.interest*(1-l.left/l.days*0.5));
  if(!spend(due))return;S.loans=S.loans.filter(x=>x!==l);log(`Kredi erken kapatıldı: ${fmt(due)}.`);sfx('buy');toast('Kredi kapandı.','good');render();
}
function hire(id,d){
  const s=STAFF.find(x=>x.id===id);const n=S.staff[id]+d;if(n<0||n>staffMax(s))return;
  if(d>0&&!spend(s.sal*3))return;S.staff[id]=n;sfx(d>0?'buy':'tap');toast(d>0?`${s.n} işe başladı.`:`${s.n} ile yollar ayrıldı.`);render();
}
function buyVeh(id,d){
  const v=VEH.find(x=>x.id===id),st=S.veh[id];
  if(d>0){if(st.own>=VEH_MAX||level()<v.lvl)return;if(!spend(v.cost))return;st.own++;sfx('engine');vib(40);toast(`${v.n} filoya katıldı.`,'good')}
  else{if(st.own-st.rented<=0)return;st.own--;S.money+=v.cost*0.6;sfx('cash');toast(`${v.n} ikinci ele satıldı: ${fmt(v.cost*0.6)}`)}
  render();
}
function rentVeh(id,d){const st=S.veh[id];const n=st.rented+d;if(n<0||n>st.own)return;st.rented=n;sfx('tap');toast(d>0?'Makine kiraya verildi. Her gün kira getirir.':'Makine şantiyeye geri döndü.');render()}
function buyMat(id,amt){
  if(stockTotal()+amt>depotCap()){toast('Depo dolu. Depoyu büyüt ya da stok kullan.','bad');return}
  const c=Math.round(amt*S.mat.idx[id]);if(!spend(c))return;S.mat.stock[id]+=amt;sfx('buy');toast(`${MAT.find(m=>m.id===id).n} stoğa girdi.`,'good');render();
}
function sellMat(id){const st=S.mat.stock[id];if(st<=0)return;const v=Math.round(st*S.mat.idx[id]*0.9);S.money+=v;S.mat.stock[id]=0;sfx('cash');toast('Stok satıldı: '+fmt(v));render()}
function upDepot(){const c=5e6*Math.pow(S.mat.depot+1,2);if(!spend(c))return;S.mat.depot++;sfx('build');toast('Depo büyüdü.','good');render()}
function bidKamu(id,mult){
  const k=S.kamu.find(x=>x.id===id);if(!k)return;
  if(S.money<k.cost){toast(`Bu iş için kasada ${fmt(k.cost)} olmalı.`,'bad');return}
  const my=Math.round(k.cost*mult/1e5)*1e5,rival=k.cost*rnd(1.08,1.5),rn=pick(S.rivals).n;
  S.kamu=S.kamu.filter(x=>x!==k);sfx('gavel');
  if(my<rival){
    S.money-=k.cost;const id2=uid();
    S.bld.push({id:id2,city:k.city,type:'kamu',kind:k.k,kamu:true,pay:my,q:'std',base:0,units:[],invest:k.cost,prog:0,done:false,name:k.n,days:k.days,rr:1,cond:100});
    addStreet(k.city,id2);S.view=k.city;
    openSheet(`<h2>İhaleyi kazandın</h2><p class="hint">${esc(k.n)} işi senin. Teklifin ${fmt(my)}, en yakın rakip ${esc(rn)} ${fmt(rival)} verdi. İnşaat başladı (${fmt(k.cost)}), bitince devlet ${fmt(my)} ödeyecek.</p><button class="btn primary big" data-act="close">İşe başla</button>`);
    setTimeout(()=>sfx('complete'),200);log(`Kamu ihalesi kazanıldı: ${k.n}.`);
  }else{
    openSheet(`<h2>İhale kaybedildi</h2><p class="hint">${esc(rn)} ${fmt(rival)} teklifle işi aldı. Senin teklifin ${fmt(my)} idi. Daha düşük teklif kazanma şansını artırır ama kârı azaltır.</p><button class="btn primary" data-act="close">Tamam</button>`);
  }
  render();
}
function openBranch(cid){
  const c=CITY[cid];if(level()<c.lvl)return;if(!spend(c.fee))return;
  S.branches[cid]=true;S.view=cid;log(`${c.n} ofisi açıldı.`);sfx('level');
  S.news.unshift({d:S.day,txt:`${c.n} ofisin açıldı. Yurt dışında yeni bir adım!`});toast(c.n+' ofisi açıldı!','good');render();
}
function bid(){
  const a=S.auction;if(!a||a.leader==='me')return;const nb=Math.round(a.cur*1.05/1e4)*1e4;
  if(nb>S.money+creditLimit()){toast('Bu teklifi karşılayacak paran ya da kredi limitin yok.','bad');return}
  a.cur=nb;a.leader='me';a.bids++;sfx('gavel');vib(30);toast('Teklifin: '+fmt(nb));render();
}
function claim(gid,ev){
  const g=GOALS.find(x=>x.id===gid);if(!g||goalState(g)!=='ready')return;
  S.claimed[gid]=true;S.money+=g.r;gainXp(g.r/2e6);sfx('reward');vib([20,30,20]);
  coinBurst(ev?.clientX??innerWidth/2,ev?.clientY??innerHeight/2,14);toast(`${g.n}: +${fmt(g.r)}`,'good');render();
}
function buyShares(rid,amt){const r=S.rivals.find(x=>x.id===rid);if(!spend(amt))return;S.shares[rid]=(S.shares[rid]||0)+amt/sharePrice(r);sfx('buy');toast(`${r.n} hissesi alındı.`,'good');render()}
function sellShares(rid){const r=S.rivals.find(x=>x.id===rid);const n=S.shares[rid]||0;if(!n)return;const v=n*sharePrice(r);S.money+=v;S.shares[rid]=0;sfx('cash');toast('Hisseler satıldı: '+fmt(v),'good');render()}
function doIpo(){
  if(S.ipo||worth()<50e6)return;const cash=Math.round(worth()*0.25*1.1);
  S.ipo={pct:0.25,day:S.day};S.money+=cash;sfx('reward');setTimeout(()=>sfx('gavel'),300);vib([30,30,30]);
  coinBurst(innerWidth/2,innerHeight/2,14);log(`Halka arz: %25 hisse ${fmt(cash)}'ye satıldı.`);
  S.news.unshift({d:S.day,txt:`${S.company} borsada işlem görmeye başladı.`});closeSheet();toast('Gong çaldı! Kasaya '+fmt(cash),'good');render();
}
function buyBack(){
  if(!S.ipo)return;const c=Math.round((S.money+assets()-debt())*S.ipo.pct*1.08);if(!spend(c))return;
  S.ipo=null;sfx('gavel');toast('Hisseleri geri aldın, şirket tamamen senin.','good');render();
}
function upOffice(){const nx=OFFICE[S.office+1];if(!nx)return;if(!spend(nx.cost))return;S.office++;sfx('level');vib([30,30,60]);toast(`Yeni ofis: ${nx.n}`,'good');render()}
function buyDeco(k){
  const d=DECOK[k],cid=S.view;if(!spend(d.cost))return;const id=uid();S.deco.push({id,k,city:cid});addStreet(cid,id);
  sfx('build');toast(`${d.n} ${CITY[cid].n}'a eklendi.`,'good');scene.sel=id;closeSheet();render();
}
function moveItem(dir){
  const cid=S.view,ord=streetOrder(cid);const i=ord.indexOf(scene.sel);if(i<0)return;const j=i+dir;if(j<0||j>=ord.length)return;
  [ord[i],ord[j]]=[ord[j],ord[i]];S.street[cid]=ord;sfx('tap');
}
function removeDeco(){const d=S.deco.find(x=>x.id===scene.sel);if(!d)return;S.deco=S.deco.filter(x=>x!==d);S.money+=DECOK[d.k].cost*0.5;scene.sel=null;sfx('cash');toast('Süs kaldırıldı, yarı parası iade edildi.');render()}
function toggleIns(){S.ins=!S.ins;sfx('tap');toast(S.ins?'Sigorta yaptırıldı. Hasarların %80\'i karşılanacak.':'Sigorta iptal edildi.');render()}

function buyBiz(t,cid){
  const d=BIZK[t];if(level()<d.lvl)return;
  if(d.risk&&!d.reg.includes(cid)){toast(`${d.n} sadece ${d.reg.map(x=>CITY[x].n).join(', ')} bölgesinde açılabilir.`,'bad');return}
  if(d.coast&&!CITY[cid].sc.sea){toast(`${d.n} sadece deniz kenarına kurulur.`,'bad');return}
  if(!spend(d.cost))return;
  const b={id:uid(),t,city:cid,lvl:1,state:d.risk?'drill':'ok',left:d.risk?3:0};S.biz.push(b);
  sfx(d.risk?'engine':'build');vib([30,40,30]);closeSheet();
  log(`${CITY[cid].n}: ${d.n} kuruldu (${fmt(d.cost)}).`);
  toast(d.risk?`${d.n}: sondaj başladı, sonuç 3 gün sonra.`:`${d.n} açıldı! Her gün gelir getirecek.`,'good');render();
}
function upBiz(id){const b=S.biz.find(x=>x.id===id);if(!b||b.lvl>=5||b.state!=='ok')return;const d=BIZK[b.t];const c=d.cost*0.8*b.lvl;if(!spend(c))return;b.lvl++;sfx('level');toast(`${d.n} seviye ${b.lvl} oldu.`,'good');render()}
function sellBiz(id){const b=S.biz.find(x=>x.id===id);if(!b)return;const v=b.state==='dry'?0:Math.round(bizInvest(b)*0.7);S.money+=v;S.biz=S.biz.filter(x=>x!==b);sfx(v?'cash':'tap');toast(v?`${BIZK[b.t].n} satıldı: ${fmt(v)}`:'Kuru kuyu kapatıldı.');closeSheet();render()}

// ---------- simulation
function log(txt){S.log.unshift({d:S.day,txt});S.log=S.log.slice(0,30)}
function tick(dt){
  S.t+=dt;
  S.bld.forEach(b=>{if(b.done)return;const days=b.kamu?b.days:(b.dd||TYPE[b.type].days*QUAL[b.q||'std'].days);
    b.prog+=dt/DAY_MS*speed(b.city)/days;
    if(b.prog>=1)complete(b,true);
  });
  const a=S.auction;
  if(a){
    if(a.leader==='me'&&a.cur*1.05<=a.aiMax&&Math.random()<dt/1000*0.06){
      a.cur=Math.round(a.cur*rnd(1.04,1.09)/1e4)*1e4;a.leader='ai';a.rival=pick(S.rivals).n;
      if(curTab==='auction'){toast(`${a.rival} teklifini geçti!`,'bad')}
    }
    if(S.t>=a.end)finishAuction();
  }
  while(S.t>=S.day*DAY_MS)newDay();
}
function complete(b,live){
  b.prog=1;b.done=true;
  if(b.kamu){
    S.money+=b.pay;S.stats.kamu++;gainXp(b.pay/2e6);
    S.landmarks.push({id:b.id,city:b.city,kind:b.kind,name:b.name});S.bld=S.bld.filter(x=>x!==b);
    if(live){log(`${b.name} teslim edildi, devlet ${fmt(b.pay)} ödedi.`);sfx('reward');coinBurst(innerWidth/2,innerHeight/2,12);toast(`${b.name} teslim edildi: +${fmt(b.pay)}`,'good')}
    return;
  }
  S.stats.built++;S.stats.types[b.type]=(S.stats.types[b.type]||0)+1;if(b.renewal)S.stats.renew++;
  gainXp(TYPE[b.type].cost*(b.k||1)/2e6);S.projAlert=true;
  if(live){log(`${b.name} (${CITY[b.city].n}) tamamlandı.`);sfx('complete');vib([30,30,30]);toast(`${b.name} bitti! Satışa çıkar veya kirala.`,'good')}
}
function finishAuction(){
  const a=S.auction;S.auction=null;
  if(a.leader==='me'){
    if(S.money>=a.cur){S.money-=a.cur;const id=uid();S.plots.push({id,city:a.city,size:a.size,paid:a.cur,di:a.di??0,dm:a.dm||1});addStreet(a.city,id);S.stats.auctions++;S.stats.plots++;
      log(`İhale kazanıldı: ${CITY[a.city].n} ${m2(a.size)} (${fmt(a.cur)}).`);sfx('gavel');setTimeout(()=>sfx('complete'),250);toast('İhaleyi kazandın! Arsa portföyünde.','good');}
    else{const pen=Math.round(a.cur*0.05);S.money-=pen;log(`İhale bedeli ödenemedi, teminat yandı: ${fmt(pen)}.`);toast('Parası ödenemedi, teminat yandı.','bad')}
  }else if(a.bids>0)log(`İhaleyi ${a.rival||'rakip firma'} kazandı.`);
}
function newDay(){
  S.day++;
  // tenants: condition and defaults
  S.bld.forEach(b=>{if(!b.done||b.kamu)return;b.cond=Math.max(0,b.cond-(b.q==='lux'?0.25:b.q==='eco'?0.6:0.4));
    let left=0;b.units.forEach((u,i)=>{if(u==='rented'&&Math.random()<0.004*Math.pow(b.rr,6)*(b.cond<50?2.5:1)){b.units[i]='empty';left++}});
    if(left){log(`${b.name}: ${left} kiracı ${b.rr>1?'yüksek kira yüzünden ':''}${b.cond<50?'bakımsızlıktan ':''}çıktı.`);toast(`${b.name}: ${left} kiracı çıktı`,'bad')}
  });
  S.biz.forEach(b=>{if(b.state!=='drill')return;b.left--;if(b.left<=0){const d=BIZK[b.t];
    if(Math.random()<d.risk){b.state='dry';log(`${d.n} (${CITY[b.city].n}) boş çıktı.`);showEvent(d.id==='kuyu'?'Kuyu kuru çıktı':'Damar bulunamadı',`${CITY[b.city].n}'daki ${d.n.toLowerCase()} için yapılan arama sonuçsuz kaldı. Yatırım yandı.`,true)}
    else{b.state='ok';log(`${d.n} (${CITY[b.city].n}) üretime geçti!`);sfx('reward');showEvent(d.id==='kuyu'?'Petrol fışkırdı!':'Altın damarı bulundu!',`${CITY[b.city].n}'daki ${d.n.toLowerCase()} üretime geçti. Günlük gelir ${fmt(bizIncome(b))}.`,false,true)}}});
  S.money+=dailyNet();
  S.loans.forEach(l=>l.left--);
  S.loans.filter(l=>l.left<=0).forEach(l=>{S.money-=l.amount+l.interest;log(`Kredi vadesi doldu: ${fmt(l.amount+l.interest)} ödendi.`);toast('Kredi ödendi: '+fmt(l.amount+l.interest))});
  S.loans=S.loans.filter(l=>l.left>0);
  if(S.money<0)S.money-=Math.abs(S.money)*0.01;
  if(S.strike>0)S.strike--;
  S.prevIdx={...S.idx};
  CITIES.forEach(c=>{S.idx[c.id]=clamp(S.idx[c.id]*(1+rnd(-0.018,0.022)),0.75,1.45)});
  COMMS.forEach(k=>S.comm[k]=clamp(S.comm[k]*(1+rnd(-0.04,0.045)),0.6,1.6));
  MAT.forEach(m=>S.mat.idx[m.id]=clamp(S.mat.idx[m.id]*(1+rnd(-0.06,0.06)),0.65,1.5));
  S.rivals.forEach(r=>{r.prev=r.w;r.w*=1+rnd(-0.02,0.04)});
  // weather
  const roll=Math.random();S.wx={k:roll<0.45?'sun':roll<0.68?'cloud':roll<0.86?'rain':roll<0.95?'snow':'storm'};
  if(Math.random()<0.12)marketEvent();
  const pBase=0.28*(1+0.15*S.staff.agent)*(1+0.05*S.office);
  S.bld.forEach(b=>{if(!b.done||b.kamu)return;let n=0,tot=0;
    b.units.forEach((u,i)=>{if(u==='listing'&&Math.random()<pBase*CITY[b.city].dem*S.idx[b.city]){tot+=unitValue(b);n++;b.units[i]='sold'}});
    if(n){log(`${b.name}: ${n} birim satıldı, ${fmt(tot)}.`);payout(tot,n,`${b.name}: ${n} satış +${fmt(tot)}`)}
  });
  cleanup();
  marketTick();
  CITIES.forEach(c=>{if(cityOpen(c)&&S.renew[c.id].length<2&&Math.random()<0.08)S.renew[c.id].push(genRenewal(c))});
  S.kamu=S.kamu.filter(k=>k.exp>S.day);
  if(S.kamu.length<2&&Math.random()<0.25){S.kamu.push(genKamu());S.seenAuction=false}
  if(!S.auction&&Math.random()<0.18){
    const c=pick(CITIES.filter(cityOpen)),L=level();
    const size=pick(SIZES.filter(s=>s>=(L>=4?1500:500)&&s<=(L<=1?1200:L<=3?2500:8000)));const di=Math.floor(Math.random()*c.d.length),dm=c.d[di][1];const fair=fairLand(c.id,size,dm);
    S.auction={city:c.id,di,dm,size,fair,cur:Math.round(fair*0.55/1e4)*1e4,aiMax:fair*rnd(0.75,1.05),leader:'ai',bids:0,end:S.t+DAY_MS*3,rival:null};
    S.seenAuction=false;S.news.unshift({d:S.day,txt:`Belediye ${c.n} ${c.d[di][0]}'de ${m2(size)} arsayı ihaleye çıkardı.`});sfx('open');
  }
  if(S.day>5&&Math.random()<0.07)randomEvent();
  if(S.wx.k==='storm'){sfx('thunder');if(curTab==='sehir')scene.flash=1}
  S.news=S.news.slice(0,8);
}
const EVENTS=[
 {txt:'Merkez bankası faiz indirdi, konut talebi canlandı.',all:0.06},
 {txt:'İnşaat malzemesi fiyatları uçtu, piyasa durgun.',all:-0.05,mat:0.15},
 {txt:'Yabancı yatırımcı ilgisi arttı.',city:1,amt:0.09},
 {txt:'Yeni metro hattı açıklandı, bölgede fiyatlar yükseldi.',city:1,amt:0.12},
 {txt:'Deprem yönetmeliği sıkılaştı, eski binalarda dönüşüm başvuruları arttı.',all:-0.03,renew:1},
 {txt:'Turizm sezonu rekor kırdı.',tour:0.08},
 {txt:'Üniversite kampüsü taşınıyor, kira talebi arttı.',city:1,amt:0.07},
 {txt:'Çimento fabrikaları üretimi artırdı, malzeme ucuzladı.',mat:-0.15},
 {txt:'Kuraklık: tarım ürünleri rekoltesi düştü.',comm:'tarim',amt:-0.25},
 {txt:'Bereketli yıl: tarım gelirleri arttı.',comm:'tarim',amt:0.2},
 {txt:'Petrol fiyatları fırladı.',comm:'petrol',amt:0.25},
 {txt:'Petrol fiyatları çakıldı.',comm:'petrol',amt:-0.2},
 {txt:'Altın rekor kırdı.',comm:'altin',amt:0.25},
 {txt:'Elektriğe zam geldi, enerji santralleri kazançta.',comm:'enerji',amt:0.15},
 {txt:'Et ve süt fiyatları yükseldi.',comm:'hayvan',amt:0.15},
 {txt:'Tüketim canlandı, restoran ve marketler doldu.',comm:'hizmet',amt:0.12},
];
function marketEvent(){
  const e=pick(EVENTS),open=CITIES.filter(cityOpen);let txt=e.txt;
  if(e.all)CITIES.forEach(c=>S.idx[c.id]=clamp(S.idx[c.id]*(1+e.all),0.75,1.45));
  if(e.city){const c=pick(open);S.idx[c.id]=clamp(S.idx[c.id]*(1+e.amt),0.75,1.45);txt=c.n+': '+txt}
  if(e.tour)CITIES.filter(c=>c.tour).forEach(c=>S.idx[c.id]=clamp(S.idx[c.id]*(1+e.tour),0.75,1.45));
  if(e.comm)S.comm[e.comm]=clamp(S.comm[e.comm]*(1+e.amt),0.6,1.6);
  if(e.mat)MAT.forEach(m=>S.mat.idx[m.id]=clamp(S.mat.idx[m.id]*(1+e.mat),0.65,1.5));
  if(e.renew)open.forEach(c=>{if(S.renew[c.id].length<3)S.renew[c.id].push(genRenewal(c))});
  S.news.unshift({d:S.day,txt});
}
function hit(amount,title,txt){
  const cover=S.ins?0.8:0,paid=Math.round(amount*(1-cover));S.money-=paid;
  log(`${title}: ${fmt(amount)} hasar${S.ins?`, sigorta ${fmt(amount-paid)} ödedi`:''}.`);
  showEvent(title,txt+` Hasar ${fmt(amount)}.`+(S.ins?` Sigortan ${fmt(amount-paid)} karşıladı, sana ${fmt(paid)} kaldı.`:' Sigortan olmadığı için tamamını sen ödedin.'),true);
}
function randomEvent(){
  const building=S.bld.filter(b=>!b.done),done=S.bld.filter(b=>b.done&&!b.kamu);
  const opts=[];
  if(building.length)opts.push('strike','fire');
  if(done.length)opts.push('flood','inspect');
  if(stockTotal()>0||S.money>5e6)opts.push('theft');
  if(!opts.length)return;
  const k=pick(opts);sfx('alarm');vib([80,40,80]);
  if(k==='strike'){S.strike=2;showEvent('İşçi grevi','Şantiyelerde işçiler greve gitti. İnşaatlar 2 gün duracak. Sigorta grevi karşılamaz.',false)}
  if(k==='fire'){const b=pick(building);b.prog=Math.max(0,b.prog-0.15);hit(b.invest*0.08,'Şantiye yangını',`${b.name} şantiyesinde yangın çıktı, iş %15 geriledi.`)}
  if(k==='flood'){const b=pick(done);b.cond=Math.max(0,b.cond-35);hit(unitValue(b)*Math.max(1,b.units.length)*0.02,'Sel baskını',`${CITY[b.city].n}'da sel ${b.name} binasını vurdu, bodrum su aldı.`)}
  if(k==='theft'){const m=MAT.find(x=>S.mat.stock[x.id]>0);
    if(m){const lost=S.mat.stock[m.id]*0.3;S.mat.stock[m.id]-=lost;hit(lost*S.mat.idx[m.id]*0.0001,'Depo hırsızlığı',`Depodan ${m.n} çalındı, stoğun %30'u gitti.`);if(S.ins){S.money+=lost*S.mat.idx[m.id]*0.8}}
    else hit(Math.min(5e6,S.money*0.02),'Ofis hırsızlığı','Gece ofise hırsız girdi, kasadan para çalındı.')}
  if(k==='inspect'){const eco=done.find(b=>b.q==='eco');
    if(eco){const fine=Math.round(eco.invest*0.05);S.money-=fine;eco.cond=Math.max(0,eco.cond-20);showEvent('Deprem denetimi',`Denetçiler ekonomik kaliteyle yapılan ${eco.name} binasında eksik buldu. ${fmt(fine)} ceza kesildi. Sigorta cezaları karşılamaz.`,false)}
    else{const c=pick(done).city;S.idx[c]=clamp(S.idx[c]*1.04,0.75,1.45);showEvent('Deprem denetimi',`Binaların denetimden tam not aldı. ${CITY[c].n}'da şirketine güven arttı, fiyatlar %4 yükseldi.`,false,true)}}
}
function showEvent(title,txt,bad,good){
  S.news.unshift({d:S.day,txt:title+': '+txt.split('.')[0]+'.'});
  if(!$('#sheet').hidden||!started){toast(title,bad?'bad':good?'good':'');return}
  openSheet(`<span class="pill ${good?'g':'r'}" style="align-self:flex-start">${good?'İyi haber':'Olay'}</span><h2>${title}</h2><p class="hint">${txt}</p>
   ${!S.ins&&bad?'<p class="hint">Banka sekmesinden sigorta yaptırırsan bu tür hasarların %80\'ini sigorta öder.</p>':''}
   <button class="btn primary" data-act="close">Tamam</button>`);
}
function offlineCatchup(){
  const away=Date.now()-(S.lastSeen||Date.now());if(away<90000)return false;
  const days=Math.min(OFFLINE_MAX_DAYS,Math.floor(away/DAY_MS));if(days<1)return false;
  const m0=S.money;
  for(let i=0;i<days;i++)S.money+=dailyRent()*0.5+bizDaily()*0.5+vehIncome()-dailySalary()-vehUpkeep()-insPremium()-dividends()*0.5;
  let finished=0;
  [...S.bld].forEach(b=>{if(b.done)return;const d=b.kamu?b.days:(b.dd||TYPE[b.type].days*QUAL[b.q||'std'].days);b.prog+=days*(1+0.2*S.staff.eng+vehSpeed())*fleetMul()/d;if(b.prog>=1){complete(b,false);finished++}});
  S.lastSeen=Date.now();
  const net=S.money-m0,h=Math.floor(away/3600000),mi=Math.floor(away%3600000/60000);
  openSheet(`<h2>Hoş geldin patron</h2>
   <p class="hint">${h?h+' saat ':''}${mi} dakika yoktun. Şirket bu sürede ${days} gün kendi kendine işledi (en fazla ${OFFLINE_MAX_DAYS} gün sayılır, kira yarı hızda gelir).</p>
   <div class="card"><div class="stat"><span>Gelir − giderler</span><b class="num">${net>=0?'+':''}${fmt(net)}</b></div>
   <div class="stat"><span>Biten inşaat</span><b class="num">${finished}</b></div></div>
   <button class="btn primary big" data-act="collect">Topla</button>`);
  return true;
}
function checkDaily(){
  const t=today(),d=S.daily;if(d.last===t)return false;
  const y=new Date();y.setDate(y.getDate()-1);
  d.streak=d.last===today(y)?d.streak+1:1;d.last=t;
  const day=((d.streak-1)%7)+1,amt=Math.round(5e5*day*(1+(level()-1)*0.6)/1e4)*1e4;d.pending=amt;
  openSheet(`<span class="pill y" style="align-self:flex-start">Günlük ödül</span><h2>${d.streak}. gün üst üste</h2>
   <p class="hint">Her gün gir, ödül büyüsün. 7. günde en büyük ödül seni bekliyor.</p>
   <div class="streak">${[1,2,3,4,5,6,7].map(i=>`<div class="${i<=day?'on':''}">${i}. gün</div>`).join('')}</div>
   <div class="card" style="text-align:center"><div class="meta">Bugünün ödülü</div><div class="num" style="font-size:26px">${fmt(amt)}</div></div>
   <button class="btn primary big" data-act="dailyget">Topla</button>`);
  return true;
}

// ---------- drawing
const PASTEL=['#e8c39e','#d9a38a','#b9c7d6','#e6d7b0','#cfd9c0','#e4b8a8','#d6cbe0'];
const NIGHT='#0a1328';
function shade(c,n){return mix(c,NIGHT,0.55*n)}
function winCol(r,n,litChance=0.55){const lit=r()<litChance;return n>0.35&&lit?'#ffd77a':mix('#a9d3ee','#22314a',n)}
function windows(ctx,x,y,w,h,cols,rows,r,n,ww=0.5,wh=0.5){
  const gw=w/cols,gh=h/rows;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){ctx.fillStyle=winCol(r,n);ctx.fillRect(x+i*gw+gw*(1-ww)/2,y+j*gh+gh*(1-wh)/2,gw*ww,gh*wh)}
}
function spec(b){const s=spec0(b);if(b.fl&&DZ[b.type]&&DZ[b.type].tall)s.h=Math.round(s.h*clamp(Math.pow(b.fl/DZ[b.type].f0,0.6),0.55,1.8));return s}
function spec0(b){
  const r=mulberry(hash(b.id));
  switch(b.type){
    case 'ev':return {W:58,h:52};
    case 'apt':return {W:66,h:(5+Math.floor(r()*3))*16+10};
    case 'villa':return {W:124,h:42};
    case 'rez':return {W:106,h:150+Math.floor(r()*24)};
    case 'otel':return {W:126,h:128};
    case 'avm':return {W:176,h:70};
    case 'kule':return {W:72,h:214+Math.floor(r()*24)};
    case 'fabrika':return {W:150,h:84};
    case 'ofis':return {W:92,h:170+Math.floor(r()*20)};
    case 'hastane':return {W:124,h:112};
    case 'stadyum':return {W:190,h:70};
    case 'kamu':return {W:112,h:b.kind==='hastane'?92:66};
    case 'yurt':return {W:70,h:96};
    case 'depo':return {W:140,h:52};
    case 'site':return {W:170,h:120};
    case 'ozelokul':return {W:112,h:66};
    case 'marina':return {W:160,h:60};
    default:return {W:40,h:30};
  }
}
function palm(ctx,x,n){
  ctx.strokeStyle=shade('#8a6a45',n);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,0);ctx.quadraticCurveTo(x+4,-18,x+2,-34);ctx.stroke();
  ctx.fillStyle=shade('#3f8a4f',n);
  for(let a=0;a<5;a++){ctx.beginPath();ctx.ellipse(x+2,-34,14,4,(a/5)*Math.PI-0.2,0,Math.PI*2);ctx.fill()}
}
function tree(ctx,x,n,s=1,snow){
  ctx.fillStyle=shade('#6b4a33',n);ctx.fillRect(x-1.5,-10*s,3,10*s);
  ctx.fillStyle=shade('#3e8d58',n);ctx.beginPath();ctx.arc(x,-16*s,8*s,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=shade(snow?'#f4f7fa':'#4fa86a',n);ctx.beginPath();ctx.arc(x-3*s,-19*s,4*s,0,Math.PI*2);ctx.fill();
}
function signText(ctx,txt,x,y,size,col){ctx.fillStyle=col;ctx.font=`bold ${size}px "Big Shoulders Display",Impact,sans-serif`;ctx.textAlign='center';ctx.fillText(txt,x,y)}
function drawBody(ctx,b,n,now,city){
  const r=mulberry(hash(b.id));const sp=spec(b);r();r();
  const lux=b.q==='lux';
  switch(b.type){
    case 'ev':{const wall=PASTEL[Math.floor(r()*PASTEL.length)];
      ctx.fillStyle=shade(wall,n);ctx.fillRect(6,-30,44,30);
      ctx.fillStyle=shade('#b5523a',n);ctx.beginPath();ctx.moveTo(1,-29);ctx.lineTo(28,-50);ctx.lineTo(55,-29);ctx.fill();
      ctx.fillStyle=shade('#8f3f2c',n);ctx.fillRect(38,-46,6,10);
      ctx.fillStyle=shade('#6b4a33',n);ctx.fillRect(24,-16,9,16);
      ctx.fillStyle=winCol(r,n,.8);ctx.fillRect(11,-24,9,8);ctx.fillStyle=winCol(r,n,.8);ctx.fillRect(37,-24,9,8);
      ctx.fillStyle=shade('#ffffff',n);ctx.fillRect(10,-25,11,1.5);ctx.fillRect(36,-25,11,1.5);
      if(lux){ctx.fillStyle=shade('#3fb2d9',n);ctx.fillRect(48,-2,10,2)}
      break}
    case 'apt':{const wall=PASTEL[Math.floor(r()*PASTEL.length)];const h=sp.h,fl=Math.round((h-10)/16);
      ctx.fillStyle=shade(wall,n);ctx.fillRect(4,-h,58,h);
      ctx.fillStyle=shade('#6f6457',n);ctx.fillRect(2,-h-4,62,5);
      for(let f=0;f<fl;f++){const y=-h+6+f*16;
        for(let i=0;i<3;i++){ctx.fillStyle=winCol(r,n);ctx.fillRect(10+i*18,y,11,9)}
        if(f<fl-1){ctx.fillStyle=shade('#5d6b78',n);ctx.fillRect(7,y+11,52,2)}}
      ctx.fillStyle=shade('#4a3a2c',n);ctx.fillRect(28,-12,10,12);
      ctx.fillStyle=shade('#8a98a6',n);ctx.fillRect(48,-h-12,8,8);
      break}
    case 'villa':{
      const house=(x,flip)=>{ctx.fillStyle=shade('#eef0ea',n);ctx.fillRect(x,-34,50,34);
        ctx.fillStyle=shade('#4d4038',n);ctx.fillRect(x-4,-39,58,5);
        ctx.fillStyle=shade('#a8754b',n);ctx.fillRect(flip?x:x+36,-34,14,34);
        ctx.fillStyle=winCol(r,n,.75);ctx.fillRect(flip?x+18:x+6,-26,26,16);
        ctx.fillStyle=shade('#eef0ea',n);ctx.fillRect(flip?x+30:x+18,-26,2,16)};
      house(4,false);house(70,true);
      ctx.fillStyle=shade('#3fb2d9',n);ctx.fillRect(54,-3,16,3);ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(56,-3,6,1);
      if(city.tour||city.sc.palm)palm(ctx,62,n);else tree(ctx,62,n);
      break}
    case 'rez':{const glass=lux?'#4f8fb8':'#6fa8c9';const h1=sp.h,h2=Math.round(sp.h*0.78);
      [[6,h1],[58,h2]].forEach(([x,h])=>{ctx.fillStyle=shade(glass,n);ctx.fillRect(x,-h,42,h);
        windows(ctx,x+2,-h+6,38,h-12,4,Math.floor((h-12)/10),r,n,.7,.55);
        ctx.fillStyle=shade('#dfe7ee',n);for(let y=-h+4;y<0;y+=20)ctx.fillRect(x,y,42,1.5);
        ctx.fillStyle=shade('#2e4a63',n);ctx.fillRect(x-2,-h-6,46,6)});
      break}
    case 'otel':{const h=sp.h-18;
      ctx.fillStyle=shade('#e9dcc7',n);ctx.fillRect(4,-h,118,h);
      windows(ctx,8,-h+6,110,h-30,8,9,r,n,.55,.55);
      ctx.fillStyle=shade('#b08d5a',n);ctx.fillRect(4,-h,118,4);
      ctx.fillStyle=shade('#2b2b2b',n);ctx.fillRect(48,-22,30,22);
      ctx.fillStyle=shade('#c0392b',n);ctx.fillRect(40,-26,46,4);
      const glow=n>0.3;ctx.fillStyle=glow?'#ff5a4a':shade('#c0392b',n);
      if(glow){ctx.shadowColor='#ff5a4a';ctx.shadowBlur=12}
      ctx.fillRect(38,-h-18,50,16);ctx.shadowBlur=0;signText(ctx,'OTEL',63,-h-6,11,'#fff');
      for(let i=0;i<3;i++){ctx.strokeStyle=shade('#99aaaa',n);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(16+i*8,-h);ctx.lineTo(16+i*8,-h-14);ctx.stroke();
        ctx.fillStyle=['#e74c3c','#f2b632','#3fa9f5'][i];ctx.fillRect(16+i*8,-h-14,6+Math.sin(now/300+i),4)}
      break}
    case 'avm':{const h=sp.h;
      ctx.fillStyle=shade('#cfd6de',n);ctx.fillRect(4,-h,168,h);
      ctx.fillStyle=n>0.35?'#ffcf4a':shade('#f2b632',n);ctx.fillRect(4,-h,168,12);
      signText(ctx,'ÇARŞI · '+(S?S.company.toUpperCase().slice(0,16):''),88,-h+9.5,10,'#1b1400');
      ctx.fillStyle=n>0.35?'#ffe8a8':mix('#a9d3ee','#22314a',n);ctx.fillRect(10,-h+18,156,26);
      ctx.fillStyle=shade('#8b97a3',n);for(let x=10;x<166;x+=13)ctx.fillRect(x,-h+18,1.5,26);
      ctx.fillStyle=shade('#2e3a46',n);ctx.fillRect(72,-24,32,24);
      ctx.fillStyle=n>0.35?'#fff3c4':mix('#cfe8f8','#22314a',n);ctx.fillRect(75,-21,12,21);ctx.fillRect(89,-21,12,21);
      ['#e74c3c','#3fa9f5','#4cc38a','#f2b632'].forEach((c,i)=>{ctx.fillStyle=shade(c,n);ctx.fillRect(14+i*14,-20,10,10)});
      ['#d98fb7','#a58be0','#6ab0f3'].forEach((c,i)=>{ctx.fillStyle=shade(c,n);ctx.fillRect(116+i*16,-20,12,10)});
      break}
    case 'kule':{const h=sp.h,glass=lux?'#3f7fae':'#5f9cc4';
      ctx.fillStyle=shade(glass,n);ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(12,-h+30);ctx.lineTo(36,-h);ctx.lineTo(60,-h+30);ctx.lineTo(60,0);ctx.fill();
      windows(ctx,14,-h+34,44,h-40,4,Math.floor((h-40)/8),r,n,.7,.5);
      ctx.fillStyle='rgba(255,255,255,'+(0.18*(1-n))+')';ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(12,-h+30);ctx.lineTo(24,-h+15);ctx.lineTo(24,0);ctx.fill();
      ctx.strokeStyle=shade('#c7d2dc',n);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(36,-h);ctx.lineTo(36,-h-26);ctx.stroke();
      if(Math.floor(now/700)%2){ctx.fillStyle='#ff4b3e';ctx.shadowColor='#ff4b3e';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(36,-h-27,2.5,0,7);ctx.fill();ctx.shadowBlur=0}
      ctx.fillStyle=shade('#2e3a46',n);ctx.fillRect(28,-14,16,14);
      break}
    case 'fabrika':{const h=sp.h-26;
      ctx.fillStyle=shade('#a5654a',n);ctx.fillRect(4,-h,130,h);
      ctx.fillStyle=shade('#7e8790',n);ctx.beginPath();ctx.moveTo(4,-h);for(let i=0;i<5;i++){ctx.lineTo(4+i*26,-h-16);ctx.lineTo(4+i*26+26,-h)}ctx.fill();
      ctx.fillStyle=n>0.35?'#ffd77a':mix('#a9d3ee','#22314a',n);for(let i=0;i<5;i++)ctx.fillRect(10+i*26,-h-12,6,10);
      windows(ctx,8,-h+10,122,h-28,8,2,r,n,.6,.55);
      ctx.fillStyle=shade('#5a5f66',n);ctx.fillRect(56,-26,26,26);
      ctx.fillStyle=shade('#8a5040',n);ctx.fillRect(126,-sp.h,12,sp.h);ctx.fillStyle=shade('#e74c3c',n);ctx.fillRect(126,-sp.h+6,12,3);
      for(let i=0;i<4;i++){const t=((now/1600)+i/4)%1;ctx.fillStyle=`rgba(200,205,210,${0.5*(1-t)})`;ctx.beginPath();ctx.arc(132+t*18,-sp.h-6-t*34,4+t*8,0,7);ctx.fill()}
      break}
    case 'ofis':{const h=sp.h;
      ctx.fillStyle=shade(lux?'#2f4f6f':'#3d5f80',n);ctx.fillRect(6,-h,80,h);
      windows(ctx,8,-h+12,76,h-28,6,Math.floor((h-28)/9),r,n,.86,.7);
      ctx.fillStyle=shade('#9fb3c6',n);for(let x=6;x<=86;x+=16)ctx.fillRect(x,-h,1.5,h);
      ctx.fillStyle=shade('#1f2f40',n);ctx.fillRect(4,-h-8,84,8);
      ctx.fillStyle=n>0.35?'#ffd77a':shade('#f2b632',n);ctx.fillRect(30,-h-6,32,4);
      ctx.fillStyle=shade('#1c2833',n);ctx.fillRect(32,-16,28,16);
      break}
    case 'hastane':{const h=sp.h-14;
      ctx.fillStyle=shade('#f1f3f2',n);ctx.fillRect(4,-h,116,h);ctx.fillRect(30,-h-14,64,14);
      windows(ctx,8,-h+6,108,h-30,7,7,r,n,.6,.5);
      ctx.fillStyle=shade('#2e9d6a',n);ctx.fillRect(4,-h,116,3);
      ctx.fillStyle=n>0.35?'#5cf0a8':shade('#2e9d6a',n);if(n>0.35){ctx.shadowColor='#5cf0a8';ctx.shadowBlur=10}
      ctx.fillRect(50,-h-12,24,10);ctx.shadowBlur=0;signText(ctx,'HASTANE',62,-h-4,8,'#fff');
      ctx.fillStyle=shade('#d64545',n);ctx.fillRect(38,-24,48,4);ctx.fillStyle=shade('#2b3a44',n);ctx.fillRect(48,-20,28,20);
      break}
    case 'stadyum':{const h=sp.h;
      ctx.fillStyle=shade('#c9d1d8',n);ctx.beginPath();ctx.moveTo(8,0);ctx.quadraticCurveTo(20,-h,95,-h);ctx.quadraticCurveTo(170,-h,182,0);ctx.fill();
      ctx.fillStyle=shade(['#e74c3c','#3fa9f5','#f2b632','#4cc38a'][Math.floor(r()*4)],n);
      for(let i=0;i<6;i++){ctx.fillRect(22+i*25,-h*0.62,18,h*0.5)}
      ctx.fillStyle=shade('#eef2f5',n);ctx.fillRect(14,-h*0.2,162,4);
      [[14,-h-30],[176,-h-30]].forEach(([x,y])=>{ctx.fillStyle=shade('#7d8892',n);ctx.fillRect(x-1,y,2,30+h*0.4);
        ctx.fillStyle=n>0.35?'#fffbe0':shade('#dfe5ea',n);ctx.fillRect(x-7,y-6,14,6);
        if(n>0.35){const g=ctx.createRadialGradient(x,y,2,x,y,60);g.addColorStop(0,'rgba(255,250,210,.5)');g.addColorStop(1,'rgba(255,250,210,0)');ctx.fillStyle=g;ctx.fillRect(x-60,y-60,120,120)}});
      break}
    case 'yurt':{const h=sp.h;ctx.fillStyle=shade('#c9b79a',n);ctx.fillRect(4,-h,62,h);windows(ctx,6,-h+14,58,h-28,4,6,r,n,.6,.55);
      ctx.fillStyle=shade('#3a6ea5',n);ctx.fillRect(14,-h-12,42,12);signText(ctx,'YURT',35,-h-3,10,'#fff');ctx.fillStyle=shade('#4a3a2c',n);ctx.fillRect(28,-14,14,14);
      ctx.fillStyle=shade('#5fae5f',n);ctx.fillRect(0,-3,70,3);break}
    case 'depo':{const h=sp.h;ctx.fillStyle=shade('#9aa6b0',n);ctx.fillRect(4,-h+10,132,h-10);ctx.fillStyle=shade('#6f7b86',n);ctx.beginPath();ctx.moveTo(0,-h+12);ctx.lineTo(70,-h);ctx.lineTo(140,-h+12);ctx.fill();
      for(let i=0;i<4;i++){ctx.fillStyle=shade('#d8dde2',n);ctx.fillRect(12+i*31,-28,24,28);ctx.fillStyle=shade('#b3bcc4',n);for(let y=-26;y<0;y+=4)ctx.fillRect(12+i*31,y,24,1)}
      signText(ctx,'LOJİSTİK',70,-h+24,11,shade('#1b1400',n));break}
    case 'site':{const wall=PASTEL[Math.floor(r()*PASTEL.length)];[[2,sp.h],[60,sp.h-22],[118,sp.h-8]].forEach(([x,h])=>{ctx.fillStyle=shade(wall,n);ctx.fillRect(x,-h,50,h);
      ctx.fillStyle=shade('#6f6457',n);ctx.fillRect(x-2,-h-4,54,5);windows(ctx,x+3,-h+5,44,h-18,3,Math.floor((h-18)/14),r,n,.6,.55)});
      ctx.fillStyle=shade('#3fb2d9',n);ctx.fillRect(52,-3,10,3);ctx.fillRect(110,-3,10,3);ctx.fillStyle=shade('#5fae5f',n);ctx.fillRect(0,-2,170,2);break}
    case 'ozelokul':{const o={...b,type:'kamu',kind:'okul'};drawBody(ctx,o,n,now,city);ctx.fillStyle=shade('#1f4e8a',n);ctx.fillRect(20,-sp.h+6,72,12);signText(ctx,'KOLEJ',56,-sp.h+15,10,'#fff');break}
    case 'marina':{ctx.fillStyle=shade('#2a6d9e',n);ctx.fillRect(0,-4,160,4);ctx.fillStyle=shade('#b08d5a',n);ctx.fillRect(0,-8,160,3);for(let i=0;i<5;i++)ctx.fillRect(10+i*32,-8,3,8);
      for(let i=0;i<5;i++){const bx=6+i*32,bob=Math.sin(now/700+i)*1.2;ctx.fillStyle=shade('#f4f6f8',n);ctx.beginPath();ctx.moveTo(bx,-10+bob);ctx.lineTo(bx+24,-10+bob);ctx.lineTo(bx+20,-4+bob);ctx.lineTo(bx+4,-4+bob);ctx.fill();
        ctx.strokeStyle=shade('#9aa3ab',n);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(bx+12,-10+bob);ctx.lineTo(bx+12,-46+bob);ctx.stroke();ctx.fillStyle=shade(['#fff','#e74c3c','#3fa9f5'][i%3],n);ctx.beginPath();ctx.moveTo(bx+13,-44+bob);ctx.lineTo(bx+24,-14+bob);ctx.lineTo(bx+13,-14+bob);ctx.fill()}
      ctx.fillStyle=shade('#eef0ea',n);ctx.fillRect(120,-sp.h,36,sp.h-10);windows(ctx,122,-sp.h+4,32,sp.h-20,2,3,r,n);break}
    case 'kamu':{const h=sp.h;const col={okul:'#e6c27a',hastane:'#eef2f0',kutuphane:'#d8cbb2',spor:'#9ec3d6',kultur:'#c7b2d6'}[b.kind]||'#ddd';
      ctx.fillStyle=shade(col,n);ctx.fillRect(4,-h,104,h);
      if(b.kind==='kutuphane'){ctx.fillStyle=shade('#f4efe4',n);for(let i=0;i<6;i++)ctx.fillRect(12+i*16,-h+14,6,h-14);ctx.beginPath();ctx.moveTo(0,-h);ctx.lineTo(56,-h-18);ctx.lineTo(112,-h);ctx.fill()}
      else if(b.kind==='spor'){ctx.fillStyle=shade('#7fa9bf',n);ctx.beginPath();ctx.ellipse(56,-h,50,18,0,Math.PI,0);ctx.fill();windows(ctx,8,-h+10,96,h-24,6,2,r,n)}
      else windows(ctx,8,-h+8,96,h-28,6,Math.floor((h-28)/14),r,n,.55,.55);
      if(b.kind==='okul'){ctx.fillStyle=shade('#fff',n);ctx.beginPath();ctx.arc(56,-h-8,7,0,7);ctx.fill();ctx.strokeStyle='#333';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(56,-h-8);ctx.lineTo(56,-h-12);ctx.moveTo(56,-h-8);ctx.lineTo(59,-h-8);ctx.stroke()}
      ctx.fillStyle=shade('#6b5a4a',n);ctx.fillRect(48,-18,16,18);
      ctx.strokeStyle=shade('#c7d2dc',n);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(100,-h);ctx.lineTo(100,-h-30);ctx.stroke();
      ctx.fillStyle='#d63a3a';const wv=Math.sin(now/250)*1.5;ctx.beginPath();ctx.moveTo(100,-h-30);ctx.lineTo(116,-h-27+wv);ctx.lineTo(100,-h-22);ctx.fill();
      break}
  }
}
function drawBuilding(ctx,b,x,gy,n,now,city){
  const sp=spec(b),prog=b.done?1:clamp(b.prog,0,1);
  ctx.save();ctx.translate(x,gy);
  if(prog<1){
    ctx.globalAlpha=0.14;drawBody(ctx,b,n,now,city);ctx.globalAlpha=1;
    const top=-(sp.h+4)*prog;
    ctx.save();ctx.beginPath();ctx.rect(-4,top,sp.W+8,-top+1);ctx.clip();drawBody(ctx,b,n,now,city);ctx.restore();
    ctx.strokeStyle='rgba(201,141,42,.85)';ctx.lineWidth=1;
    for(let yy=0;yy>top;yy-=10){ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(sp.W,yy);ctx.stroke()}
    for(let xx=0;xx<=sp.W;xx+=sp.W/Math.max(2,Math.round(sp.W/22))){ctx.beginPath();ctx.moveTo(xx,0);ctx.lineTo(xx,top);ctx.stroke()}
    const mx=sp.W-6,mh=sp.h+34,moving=S&&S.strike>0?0:1,sw=Math.sin(now/1600*moving+hash(b.id))*10;
    ctx.strokeStyle='#f2b632';ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(mx-3,0);ctx.lineTo(mx-3,-mh);ctx.moveTo(mx+3,0);ctx.lineTo(mx+3,-mh);ctx.stroke();
    ctx.beginPath();for(let yy=0;yy>-mh;yy-=8){ctx.moveTo(mx-3,yy);ctx.lineTo(mx+3,yy-8)}ctx.stroke();
    ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(mx-70,-mh);ctx.lineTo(mx+22,-mh);ctx.stroke();
    ctx.fillStyle='#f2b632';ctx.fillRect(mx+12,-mh,10,7);ctx.fillStyle='#2b2b2b';ctx.fillRect(mx-4,-mh-8,8,8);
    const hx=mx-40+sw,hy=top-14;ctx.strokeStyle='#cfd6de';ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(hx,-mh);ctx.lineTo(hx,hy);ctx.stroke();
    ctx.fillStyle='#8a5a2b';ctx.fillRect(hx-9,hy,18,4);
    ctx.fillStyle='#ff9a3c';ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(-3,-8);ctx.lineTo(0,0);ctx.fill();
    if(S&&S.strike>0){ctx.fillStyle='#e74c3c';ctx.fillRect(4,-22,40,12);signText(ctx,'GREV',24,-13,10,'#fff')}
  }else drawBody(ctx,b,n,now,city);
  ctx.restore();
}
function drawPlot(ctx,p,x,gy,n){
  ctx.save();ctx.translate(x,gy);const W=64;
  ctx.fillStyle=shade('#8a6a45',n);ctx.fillRect(0,-3,W,3);
  ctx.fillStyle=shade('#a07e55',n);ctx.beginPath();ctx.moveTo(10,-3);ctx.quadraticCurveTo(22,-12,34,-3);ctx.fill();
  ctx.strokeStyle=shade('#d7dde3',n);ctx.lineWidth=1;
  for(let i=0;i<=W;i+=8){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,-12);ctx.stroke()}
  ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(W,-9);ctx.moveTo(0,-4);ctx.lineTo(W,-4);ctx.stroke();
  ctx.fillStyle=shade('#6b4a33',n);ctx.fillRect(46,-30,2,22);
  ctx.fillStyle=shade(p.renewal?'#a58be0':'#f2b632',n);ctx.fillRect(34,-42,28,14);
  ctx.fillStyle='#1b1400';ctx.font='bold 8px "IBM Plex Sans",sans-serif';ctx.textAlign='center';ctx.fillText(p.renewal?'DÖNÜŞÜM':'ARSA',48,-32);
  ctx.restore();return W;
}
function drawDeco(ctx,d,x,gy,n,now,snow){
  ctx.save();ctx.translate(x,gy);const k=d.k;
  if(k==='agac'){tree(ctx,13,n,1.3,snow)}
  if(k==='park'){ctx.fillStyle=shade(snow?'#e8eef2':'#5fae5f',n);ctx.fillRect(0,-4,76,4);tree(ctx,14,n,1.1,snow);tree(ctx,62,n,1.2,snow);
    ctx.fillStyle=shade('#8a5a2b',n);ctx.fillRect(30,-8,18,2);ctx.fillRect(31,-8,2,8);ctx.fillRect(45,-8,2,8);ctx.fillRect(30,-13,18,2);
    ctx.fillStyle=shade('#e74c3c',n);ctx.beginPath();ctx.arc(24,-3,2,0,7);ctx.arc(52,-3,2,0,7);ctx.fill()}
  if(k==='fiskiye'){ctx.fillStyle=shade('#a9b4bd',n);ctx.fillRect(2,-8,40,8);ctx.fillStyle=shade('#3fb2d9',n);ctx.fillRect(5,-7,34,4);
    ctx.fillStyle=shade('#a9b4bd',n);ctx.fillRect(20,-20,4,12);
    ctx.fillStyle=`rgba(170,220,255,${0.8-0.3*n})`;for(let i=0;i<10;i++){const t=((now/700)+i/10)%1,dir=i%2?1:-1;ctx.beginPath();ctx.arc(22+dir*t*14,-22-Math.sin(t*Math.PI)*16+t*10,1.6,0,7);ctx.fill()}}
  if(k==='heykel'){ctx.fillStyle=shade('#9aa3ab',n);ctx.fillRect(6,-14,26,14);ctx.fillStyle=shade('#b08d4a',n);
    ctx.fillRect(16,-34,6,20);ctx.beginPath();ctx.arc(19,-38,4,0,7);ctx.fill();ctx.fillRect(10,-30,18,3)}
  ctx.restore();
}
function drawCar(ctx,c,n){
  ctx.save();ctx.translate(c.x,c.y);if(c.dir<0)ctx.scale(-1,1);
  if(c.truck){ctx.fillStyle=shade('#f2b632',n*0.8);ctx.fillRect(-18,-14,24,14);ctx.fillStyle=shade('#d0d6dc',n*0.8);ctx.fillRect(6,-11,12,11);ctx.fillStyle=mix('#bfe0f5','#22314a',n);ctx.fillRect(9,-10,7,4);
    ctx.fillStyle=shade('#8a8f96',n);ctx.beginPath();ctx.ellipse(-6,-17,10,6,0,0,7);ctx.fill();ctx.fillStyle='#1b1b1b';ctx.beginPath();ctx.arc(-12,0,3.2,0,7);ctx.arc(-2,0,3.2,0,7);ctx.arc(12,0,3.2,0,7);ctx.fill()}
  else{
  ctx.fillStyle=shade(c.col,n*0.8);ctx.beginPath();ctx.roundRect?ctx.roundRect(-14,-7,28,7,2):ctx.rect(-14,-7,28,7);ctx.fill();
  ctx.beginPath();ctx.roundRect?ctx.roundRect(-8,-12,15,6,2):ctx.rect(-8,-12,15,6);ctx.fill();
  ctx.fillStyle=mix('#bfe0f5','#22314a',n);ctx.fillRect(-6,-11,5,4);ctx.fillRect(0,-11,5,4);
  ctx.fillStyle='#1b1b1b';ctx.beginPath();ctx.arc(-8,0,3,0,7);ctx.arc(8,0,3,0,7);ctx.fill();}
  if(n>0.35){const g=ctx.createLinearGradient(14,0,50,0);g.addColorStop(0,'rgba(255,230,150,.55)');g.addColorStop(1,'rgba(255,230,150,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(14,-5);ctx.lineTo(50,-10);ctx.lineTo(50,4);ctx.fill();ctx.fillStyle='#ff4b3e';ctx.fillRect(-15,-6,2,2)}
  ctx.restore();
}
function dayPhase(p){
  const night=p<0.06?1-p/0.06:p<0.62?0:p<0.74?(p-0.62)/0.12:1;
  const dusk=Math.max(0,1-Math.abs(p-0.665)/0.07)+Math.max(0,1-Math.abs(p-0.03)/0.05);
  return {night,dusk:Math.min(1,dusk)};
}
function clockStr(p){const m=Math.floor(((5+p*24)%24)*60);return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')}
function drawSky(ctx,W,H,gy,p,cid,now,wk='sun'){
  const {night:n0,dusk}=dayPhase(p);const city=CITY[cid],sc=city.sc,r=mulberry(hash(cid));
  const overcast=wk==='rain'||wk==='storm'||wk==='snow'?1:wk==='cloud'?0.4:0;
  const n=n0;
  let top=mix(mix('#4fa6e2','#8a99a8',overcast*0.8).replace(/rgb\((\d+),(\d+),(\d+)\)/,(m,a,b,c)=>'#'+[a,b,c].map(v=>(+v).toString(16).padStart(2,'0')).join('')),'#0a1328',n),
      bot=mix(mix('#cfeaf8','#b8c2cc',overcast*0.8).replace(/rgb\((\d+),(\d+),(\d+)\)/,(m,a,b,c)=>'#'+[a,b,c].map(v=>(+v).toString(16).padStart(2,'0')).join('')),'#1b2a4a',n);
  const g=ctx.createLinearGradient(0,0,0,gy);g.addColorStop(0,top);g.addColorStop(1,bot);ctx.fillStyle=g;ctx.fillRect(0,0,W,gy);
  if(dusk>0&&overcast<1){const d=ctx.createLinearGradient(0,gy*0.3,0,gy);d.addColorStop(0,'rgba(233,120,90,0)');d.addColorStop(1,`rgba(255,160,90,${0.55*dusk*(1-overcast*0.7)})`);ctx.fillStyle=d;ctx.fillRect(0,0,W,gy)}
  if(n>0.2&&overcast<1){for(let i=0;i<60;i++){const x=r()*W,y=r()*gy*0.6,s=r()<0.1?1.6:0.9;ctx.globalAlpha=n*(1-overcast)*(0.5+0.5*Math.sin(now/600+i));ctx.fillStyle='#fff';ctx.fillRect(x,y,s,s)}ctx.globalAlpha=1}
  else for(let i=0;i<60;i++){r();r();r()}
  const sunA=clamp((p-0.02)/0.68,0,1),sx=W*0.1+sunA*W*0.8,sy=gy*0.85-Math.sin(sunA*Math.PI)*gy*0.7;
  if(n<0.95&&overcast<1){ctx.globalAlpha=1-overcast*0.8;ctx.fillStyle=dusk>0.3?'#ffb26b':'#fff1b8';ctx.shadowColor='#ffe08a';ctx.shadowBlur=30;ctx.beginPath();ctx.arc(sx,sy,16,0,7);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1}
  if(n>0.3&&overcast<1){const ma=clamp((p-0.7)/0.36,0,1),mx=W*0.15+ma*W*0.7,my=gy*0.7-Math.sin(ma*Math.PI)*gy*0.5;
    ctx.fillStyle='#f4f1e0';ctx.beginPath();ctx.arc(mx,my,11,0,7);ctx.fill();ctx.fillStyle=top;ctx.beginPath();ctx.arc(mx+5,my-3,10,0,7);ctx.fill()}
  const ccount=4+Math.round(overcast*6),cc=overcast>0.5?mix('#9aa6b2','#2a3446',n):`rgba(255,255,255,${0.75-0.55*n})`;
  ctx.fillStyle=cc;
  for(let i=0;i<ccount;i++){const cx=((r()*W+now*0.006*(1+i*0.3)*(wk==='storm'?3:1))%(W+160))-80,cy=14+r()*gy*(overcast>0.5?0.25:0.35),s=overcast>0.5?1.6:1;
    ctx.beginPath();ctx.ellipse(cx,cy,30*s,9*s,0,0,7);ctx.ellipse(cx+18*s,cy-6*s,18*s,9*s,0,0,7);ctx.ellipse(cx-16*s,cy-3*s,14*s,7*s,0,0,7);ctx.fill()}
  if(n<0.4&&overcast<0.5){ctx.strokeStyle='rgba(30,40,50,.6)';ctx.lineWidth=1.2;for(let i=0;i<3;i++){const bx=(now*0.03+i*40+r()*200)%(W+100)-50,by=40+i*9+Math.sin(now/400+i)*3;
    ctx.beginPath();ctx.moveTo(bx-5,by-3);ctx.quadraticCurveTo(bx-2,by-4,bx,by);ctx.quadraticCurveTo(bx+2,by-4,bx+5,by-3);ctx.stroke()}}
  const hb=gy-26;
  ctx.fillStyle=shade(sc.hill2,n);ctx.beginPath();ctx.moveTo(0,hb);
  if(sc.peak){ctx.lineTo(W*0.15,hb-50);ctx.lineTo(W*0.38,hb-120);ctx.lineTo(W*0.55,hb-60);ctx.lineTo(W*0.75,hb-95);ctx.lineTo(W,hb-40)}
  else for(let x=0;x<=W;x+=W/6)ctx.lineTo(x,hb-30-r()*45);
  ctx.lineTo(W,hb);ctx.fill();
  if(sc.snow&&sc.peak){ctx.fillStyle=mix('#ffffff','#5a6a80',n);ctx.beginPath();ctx.moveTo(W*0.31,hb-96);ctx.lineTo(W*0.38,hb-120);ctx.lineTo(W*0.45,hb-96);ctx.lineTo(W*0.41,hb-100);ctx.lineTo(W*0.38,hb-94);ctx.lineTo(W*0.35,hb-100);ctx.fill()}
  ctx.fillStyle=shade(wk==='snow'&&city.cold?'#e4eaee':sc.hill,n);ctx.beginPath();ctx.moveTo(0,hb);for(let x=0;x<=W+40;x+=40)ctx.lineTo(x,hb-12-Math.abs(Math.sin(x*0.013+hash(cid)%7))*24);ctx.lineTo(W,hb);ctx.fill();
  if(sc.sea){const sg=ctx.createLinearGradient(0,hb-6,0,gy);sg.addColorStop(0,mix('#3d8fc4','#0e2442',n));sg.addColorStop(1,mix('#2a6d9e','#0a1a33',n));ctx.fillStyle=sg;ctx.fillRect(0,hb-6,W,gy-hb+6);
    ctx.fillStyle=`rgba(255,255,255,${0.35-0.2*n})`;for(let i=0;i<14;i++){const wx=(r()*W+Math.sin(now/900+i)*6*(wk==='storm'?3:1)),wy=hb-2+r()*(gy-hb);ctx.fillRect(wx,wy,8+r()*10,1)}
    if(sc.bridge){ctx.strokeStyle=shade('#c9d2da',n);ctx.lineWidth=1.5;const bx=W*0.55,bw=W*0.42,by=hb-4;
      ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+bw,by);ctx.stroke();
      [bx+bw*0.2,bx+bw*0.8].forEach(t=>{ctx.beginPath();ctx.moveTo(t,by+4);ctx.lineTo(t,by-38);ctx.stroke()});
      ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(bx,by);ctx.quadraticCurveTo(bx+bw*0.1,by-20,bx+bw*0.2,by-38);ctx.quadraticCurveTo(bx+bw*0.5,by,bx+bw*0.8,by-38);ctx.quadraticCurveTo(bx+bw*0.9,by-20,bx+bw,by);ctx.stroke();
      if(n>0.35){ctx.fillStyle='#ffd77a';for(let i=0;i<12;i++)ctx.fillRect(bx+i*bw/12,by-2,2,2)}}
  }
  const far=sc.far||sc.mega;const cnt=far?22:12;const fc=mix(sc.white?'#e8e8e2':'#8ea7bd','#16233b',n);
  for(let i=0;i<cnt;i++){const bw=10+r()*22,bh=(far?18:10)+r()*(sc.mega?110:far?70:34),bx=r()*W;
    ctx.fillStyle=fc;ctx.fillRect(bx,gy-bh,bw,bh);
    if(n>0.35){ctx.fillStyle='rgba(255,215,122,.8)';for(let k=0;k<bh/7;k++)if(r()<0.35)ctx.fillRect(bx+2+r()*(bw-4),gy-bh+3+k*7,1.6,1.6)}}
  const lm=mix('#9fb2c2','#1a2a44',n);
  if(sc.domes){ctx.fillStyle=lm;[[W*0.18,1],[W*0.72,0.8]].forEach(([dx,s])=>{
    ctx.beginPath();ctx.arc(dx,gy-24*s,18*s,Math.PI,0);ctx.fill();ctx.fillRect(dx-22*s,gy-24*s,44*s,24*s);
    [-28,28].forEach(o=>{ctx.fillRect(dx+o*s-1.5,gy-62*s,3,62*s);ctx.beginPath();ctx.moveTo(dx+o*s-2.5,gy-62*s);ctx.lineTo(dx+o*s,gy-72*s);ctx.lineTo(dx+o*s+2.5,gy-62*s);ctx.fill()})})}
  if(sc.spire){ctx.fillStyle=lm;const tx=W*0.8;ctx.fillRect(tx-2,gy-120,4,120);ctx.beginPath();ctx.arc(tx,gy-92,7,0,7);ctx.fill()}
  if(sc.lattice){ctx.strokeStyle=lm;ctx.lineWidth=1.5;const tx=W*0.7;ctx.beginPath();ctx.moveTo(tx-26,gy);ctx.quadraticCurveTo(tx-6,gy-50,tx,gy-130);ctx.quadraticCurveTo(tx+6,gy-50,tx+26,gy);ctx.moveTo(tx-16,gy-40);ctx.lineTo(tx+16,gy-40);ctx.moveTo(tx-8,gy-80);ctx.lineTo(tx+8,gy-80);ctx.stroke()}
  if(sc.flames){ctx.fillStyle=mix('#7fa6c6','#1a2a44',n);[0,1,2].forEach(i=>{const fx=W*0.62+i*20,fh=80+i%2*14;ctx.beginPath();ctx.moveTo(fx,gy);ctx.quadraticCurveTo(fx-2,gy-fh*0.6,fx+8,gy-fh);ctx.quadraticCurveTo(fx+18,gy-fh*0.5,fx+16,gy);ctx.fill()})}
  return n;
}
function drawWeather(ctx,W,H,wk,now,cold){
  if(wk==='rain'||wk==='storm'){ctx.strokeStyle='rgba(200,220,240,.45)';ctx.lineWidth=1;ctx.beginPath();
    const cnt=wk==='storm'?110:70,sl=wk==='storm'?6:2;
    for(let i=0;i<cnt;i++){const x=((i*53.7+now*0.05*sl)%(W+40))-20,y=((i*97.3+now*0.55)%H);ctx.moveTo(x,y);ctx.lineTo(x-sl,y+10)}ctx.stroke()}
  if(wk==='snow'&&cold){ctx.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<70;i++){const x=((i*61.3+Math.sin(now/900+i)*20)%W+W)%W,y=((i*37.1+now*0.04)%H);ctx.beginPath();ctx.arc(x,y,1.6,0,7);ctx.fill()}}
  else if(wk==='snow'){drawWeather(ctx,W,H,'rain',now)}
  if(scene.flash>0){ctx.fillStyle=`rgba(255,255,255,${scene.flash*0.6})`;ctx.fillRect(0,0,W,H);scene.flash=Math.max(0,scene.flash-0.05)}
  if(wk==='storm'&&Math.random()<0.002){scene.flash=1;sfx('thunder')}
}
function drawGround(ctx,W,H,gy,n,snow){
  ctx.fillStyle=shade(snow?'#e6ecf0':'#9aa3ab',n);ctx.fillRect(0,gy,W,6);
  ctx.fillStyle=shade('#3a4048',n);ctx.fillRect(0,gy+6,W,H-gy-6);
  ctx.fillStyle=shade('#e8e2c8',n);for(let x=0;x<W;x+=26)ctx.fillRect(x,gy+6+(H-gy-6)/2-1,13,2);
  if(n>0.35){for(let x=30;x<W;x+=120){ctx.fillStyle=shade('#5d6b78',n);ctx.fillRect(x,gy-40,2,40);const g=ctx.createRadialGradient(x+1,gy-38,1,x+1,gy-20,40);g.addColorStop(0,'rgba(255,220,140,.35)');g.addColorStop(1,'rgba(255,220,140,0)');ctx.fillStyle=g;ctx.fillRect(x-40,gy-60,82,70)}}
  else for(let x=30;x<W;x+=120){ctx.fillStyle=shade('#5d6b78',n);ctx.fillRect(x,gy-40,2,40);ctx.fillRect(x,gy-40,8,2)}
}

// scene state
const scene={cv:null,ctx:null,scroll:0,maxScroll:0,hits:[],cars:[],lastT:0,drag:null,edit:false,sel:null,flash:0};
function streetOrder(cid){
  const ids=[...S.bld.filter(b=>b.city===cid).map(b=>b.id),...S.plots.filter(p=>p.city===cid).map(p=>p.id),...S.landmarks.filter(l=>l.city===cid).map(l=>l.id),...S.deco.filter(d=>d.city===cid).map(d=>d.id)];
  const cur=(S.street[cid]||[]).filter(id=>ids.includes(id));ids.forEach(id=>{if(!cur.includes(id))cur.push(id)});S.street[cid]=cur;return cur;
}
function sceneItems(cid){
  const map={};
  S.bld.filter(b=>b.city===cid).forEach(b=>map[b.id]={k:'b',o:b,W:spec(b).W});
  S.plots.filter(p=>p.city===cid).forEach(p=>map[p.id]={k:'p',o:p,W:64});
  S.landmarks.filter(l=>l.city===cid).forEach(l=>{const o={id:l.id,type:'kamu',kind:l.kind,done:true,prog:1,name:l.name};map[l.id]={k:'l',o,W:spec(o).W}});
  S.deco.filter(d=>d.city===cid).forEach(d=>map[d.id]={k:'d',o:d,W:DECOK[d.k].W});
  return streetOrder(cid).map(id=>map[id]).filter(Boolean);
}
function ensureScene(){
  if(scene.cv)return scene.cv;
  const cv=document.createElement('canvas');cv.setAttribute('aria-label','Şehir manzarası: binaların');scene.cv=cv;scene.ctx=cv.getContext('2d');
  cv.addEventListener('pointerdown',e=>{scene.drag={x:e.clientX,s:scene.scroll,moved:0}});
  cv.addEventListener('pointermove',e=>{if(!scene.drag)return;const dx=e.clientX-scene.drag.x;scene.drag.moved=Math.max(scene.drag.moved,Math.abs(dx));scene.scroll=clamp(scene.drag.s-dx,0,scene.maxScroll)});
  const end=e=>{if(!scene.drag)return;const d=scene.drag;scene.drag=null;if(d.moved<6)sceneTap(e)};
  cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',()=>scene.drag=null);cv.addEventListener('pointerleave',()=>scene.drag=null);
  return cv;
}
function sceneTap(e){
  const r=scene.cv.getBoundingClientRect(),x=e.clientX-r.left+scene.scroll,y=e.clientY-r.top;
  const h=scene.hits.find(h=>x>=h.x&&x<=h.x+h.w&&y>=h.y);
  if(scene.edit){scene.sel=h?h.o.id:null;sfx('tap');render();return}
  if(!h)return;sfx('tap');
  if(h.k==='p')buildSheet(h.o.id);
  else if(h.k==='b'){go('proj');setTimeout(()=>{const el=document.getElementById('b-'+h.o.id);el&&el.scrollIntoView({behavior:'smooth',block:'center'})},50)}
  else if(h.k==='l')toast(`${h.o.name}: şirketinin yaptığı kamu binası.`);
  else if(h.k==='d')toast(`${DECOK[h.o.k].n}: ${CITY[S.view].n}'daki kiraları %${Math.round(DECOK[h.o.k].bon*100*10)/10} artırıyor.`);
}
function fitCanvas(cv,ctx){
  const dpr=Math.min(2,window.devicePixelRatio||1),w=cv.clientWidth,h=cv.clientHeight;
  if(cv.width!==Math.round(w*dpr)||cv.height!==Math.round(h*dpr)){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr)}
  ctx.setTransform(dpr,0,0,dpr,0,0);return [w,h];
}
function updCars(W,gy,dt,cars,max=5){
  if(cars.length<max&&Math.random()<dt/900){const dir=Math.random()<.5?1:-1;const truck=S&&vehCount()>0&&Math.random()<0.3;
    cars.push({dir,truck,x:dir>0?-30:W+30,y:dir>0?gy+30:gy+18,v:rnd(40,75)*(truck?0.7:1),col:pick(['#e74c3c','#f2f2f2','#3fa9f5','#f2b632','#2c3e50','#4cc38a','#a58be0'])})}
  cars.forEach(c=>c.x+=c.dir*c.v*dt/1000);
  for(let i=cars.length-1;i>=0;i--)if(cars[i].x<-60||cars[i].x>W+60)cars.splice(i,1);
}
function drawScene(now){
  const cv=scene.cv;if(!cv||!cv.isConnected)return;const ctx=scene.ctx;const [W,H]=fitCanvas(cv,ctx);
  const dt=scene.lastT?Math.min(100,now-scene.lastT):16;scene.lastT=now;
  const cid=S.view,city=CITY[cid],gy=H-44,p=scene.night?0.86:(S.t%DAY_MS)/DAY_MS,wk=S.wx.k,snow=wk==='snow'&&city.cold;
  const n=drawSky(ctx,W,H,gy,p,cid,now,wk);
  const items=sceneItems(cid);let total=24;items.forEach(it=>total+=it.W+18);
  scene.maxScroll=Math.max(0,total-W);scene.scroll=clamp(scene.scroll,0,scene.maxScroll);
  let x=(total<W?(W-total)/2:0)+16-scene.scroll;scene.hits=[];
  items.forEach(it=>{
    if(x+it.W>-40&&x<W+40){
      if(it.k==='b'||it.k==='l')drawBuilding(ctx,it.o,x,gy,n,now,city);else if(it.k==='p')drawPlot(ctx,it.o,x,gy,n);else drawDeco(ctx,it.o,x,gy,n,now,snow);
      if(scene.edit&&scene.sel===it.o.id){ctx.strokeStyle='#f2b632';ctx.lineWidth=2;ctx.setLineDash([5,4]);const hh=it.k==='b'||it.k==='l'?spec(it.o).h+10:46;ctx.strokeRect(x-5,gy-hh,it.W+10,hh+4);ctx.setLineDash([])}
    }
    const top=it.k==='b'||it.k==='l'?gy-spec(it.o).h-40:gy-50;
    scene.hits.push({k:it.k,o:it.o,x:x+scene.scroll,w:it.W,y:top});
    x+=it.W+18;
  });
  if(!items.length){ctx.fillStyle='rgba(15,29,46,.75)';const tw=250;ctx.fillRect(W/2-tw/2,gy-70,tw,30);ctx.fillStyle='#fff';ctx.font='600 13px "IBM Plex Sans",sans-serif';ctx.textAlign='center';ctx.fillText(`${city.n}'da henüz yapın yok`,W/2,gy-50)}
  drawGround(ctx,W,H,gy,n,snow);
  updCars(W,gy,dt,scene.cars);scene.cars.forEach(c=>drawCar(ctx,c,n));
  drawWeather(ctx,W,H,wk,now,city.cold);
  const ck=document.getElementById('clock');if(ck)ck.textContent=clockStr(p)+' · '+WX[wk].n;
}
const thumbCache={};
function cityThumb(cid){
  if(thumbCache[cid])return thumbCache[cid];
  const cv=document.createElement('canvas');cv.width=320;cv.height=128;const ctx=cv.getContext('2d');ctx.scale(2,2);
  drawSky(ctx,160,64,58,0.4,cid,0);ctx.fillStyle='#3a4048';ctx.fillRect(0,58,160,6);
  return thumbCache[cid]=cv.toDataURL();
}
function bThumb(tid,prog=1,q='std',size=72,kind){
  const key=tid+'|'+Math.floor(prog*10)+'|'+q+'|'+size+'|'+(kind||'');if(thumbCache[key])return thumbCache[key];
  const cv=document.createElement('canvas');cv.width=size*2;cv.height=size*2;const ctx=cv.getContext('2d');ctx.scale(2,2);
  const g=ctx.createLinearGradient(0,0,0,size);g.addColorStop(0,'#5fb3e8');g.addColorStop(1,'#d6eef9');ctx.fillStyle=g;ctx.fillRect(0,0,size,size);
  ctx.fillStyle='#7fae7a';ctx.fillRect(0,size-10,size,10);
  const fb={id:tid+'thumb',type:tid,kind,q,done:prog>=1,prog};const sp=spec(fb);
  const s=Math.min((size-10)/(sp.W+20),(size-12)/(sp.h+(prog<1?44:30)));
  ctx.save();ctx.translate((size-sp.W*s)/2,size-10);ctx.scale(s,s);drawBuilding(ctx,fb,0,0,0,800,{sc:{},tour:0});ctx.restore();
  return thumbCache[key]=cv.toDataURL();
}
function drawVeh(ctx,id){
  ctx.fillStyle='#1b1b1b';
  const wheel=(x,y,r=6)=>{ctx.fillStyle='#1b1b1b';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.fillStyle='#8a8f96';ctx.beginPath();ctx.arc(x,y,r*0.4,0,7);ctx.fill()};
  if(id==='kamyon'){ctx.fillStyle='#f2b632';ctx.fillRect(8,30,52,22);ctx.fillStyle='#d99a17';ctx.beginPath();ctx.moveTo(8,30);ctx.lineTo(60,30);ctx.lineTo(56,22);ctx.lineTo(12,22);ctx.fill();ctx.fillStyle='#e74c3c';ctx.fillRect(60,34,22,18);ctx.fillStyle='#bfe0f5';ctx.fillRect(66,37,12,7);wheel(20,54);wheel(46,54);wheel(72,54)}
  if(id==='mikser'){ctx.fillStyle='#3fa9f5';ctx.fillRect(10,42,50,8);ctx.fillStyle='#e9edf0';ctx.beginPath();ctx.ellipse(34,32,24,13,-0.25,0,7);ctx.fill();ctx.strokeStyle='#f2b632';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(20,22);ctx.lineTo(28,44);ctx.moveTo(34,20);ctx.lineTo(42,42);ctx.stroke();ctx.fillStyle='#3fa9f5';ctx.fillRect(60,30,22,20);ctx.fillStyle='#bfe0f5';ctx.fillRect(66,33,12,7);wheel(20,54);wheel(44,54);wheel(72,54)}
  if(id==='vinc'){ctx.fillStyle='#f2b632';ctx.fillRect(8,38,70,14);ctx.fillStyle='#2c3e50';ctx.fillRect(56,26,20,12);ctx.strokeStyle='#f2b632';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(30,38);ctx.lineTo(78,6);ctx.stroke();ctx.strokeStyle='#555';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(78,6);ctx.lineTo(78,24);ctx.stroke();wheel(18,54);wheel(36,54);wheel(64,54)}
  if(id==='pompa'){ctx.fillStyle='#e9edf0';ctx.fillRect(8,36,54,16);ctx.fillStyle='#e74c3c';ctx.fillRect(62,30,20,22);ctx.fillStyle='#bfe0f5';ctx.fillRect(67,33,11,7);ctx.strokeStyle='#4a5560';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(18,36);ctx.lineTo(40,10);ctx.lineTo(80,14);ctx.stroke();wheel(18,54);wheel(40,54);wheel(72,54)}
  if(id==='kvinc'){ctx.strokeStyle='#f2b632';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(34,60);ctx.lineTo(34,8);ctx.moveTo(42,60);ctx.lineTo(42,8);for(let y=60;y>8;y-=8){ctx.moveTo(34,y);ctx.lineTo(42,y-8)}ctx.stroke();ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(6,8);ctx.lineTo(86,8);ctx.stroke();ctx.fillStyle='#2c3e50';ctx.fillRect(32,10,12,8);ctx.fillStyle='#8a8f96';ctx.fillRect(8,10,14,8);ctx.strokeStyle='#555';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(72,8);ctx.lineTo(72,34);ctx.stroke();ctx.fillStyle='#8a5a2b';ctx.fillRect(64,34,16,4)}
}
function vThumb(id){
  const key='veh|'+id;if(thumbCache[key])return thumbCache[key];
  const cv=document.createElement('canvas');cv.width=180;cv.height=128;const ctx=cv.getContext('2d');ctx.scale(2,2);
  ctx.fillStyle='#1e3550';ctx.fillRect(0,0,90,64);ctx.fillStyle='#2b4766';ctx.fillRect(0,60,90,4);drawVeh(ctx,id);return thumbCache[key]=cv.toDataURL();
}
function matIcon(m){return `<svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="6" fill="#1b453d"/>${m.id==='cimento'?'<path d="M10 12h20l2 20H8z" fill="#b9bec4"/><rect x="10" y="18" width="20" height="5" fill="#f2b632"/>':m.id==='demir'?'<g stroke="#8a5a44" stroke-width="3"><path d="M8 30L32 12M8 24L28 9M12 33L34 17"/></g>':'<g fill="#c4573d"><rect x="7" y="22" width="12" height="7"/><rect x="21" y="22" width="12" height="7"/><rect x="14" y="13" width="12" height="7"/></g>'}</svg>`}
function logoSvg(sz=34,shape=S.logo.shape,col=S.logo.col){
  const c=LOGO_COLS[col],ini=S.company.split(/\s+/).map(w=>w[0]||'').join('').slice(0,2).toLocaleUpperCase('tr-TR');
  const shapes=[`<circle cx="20" cy="20" r="18" fill="${c}"/>`,`<rect x="2" y="2" width="36" height="36" rx="6" fill="${c}"/>`,`<path d="M20 2l16 9v18l-16 9-16-9V11z" fill="${c}"/>`,
    `<path d="M20 3L38 18v19H2V18z" fill="${c}"/>`,`<path d="M20 2l18 18-18 18L2 20z" fill="${c}"/>`,`<path d="M4 4h32v16c0 9-8 15-16 18C12 35 4 29 4 20z" fill="${c}"/>`];
  return `<svg width="${sz}" height="${sz}" viewBox="0 0 40 40" aria-hidden="true">${shapes[shape]}<text x="20" y="${shape===3?29:26}" text-anchor="middle" font-family="Big Shoulders Display,Impact,sans-serif" font-weight="900" font-size="16" fill="#1b1400">${esc(ini)}</text></svg>`;
}

// ---------- UI
let curTab='home',curCity=null,selQ='std',sub='staff';
function go(tab){curTab=tab;if(tab!=='land'){curCity=null;curDist=null}if(tab!=='sehir'){scene.edit=false;scene.sel=null}if(tab==='proj')S.projAlert=false;if(tab==='auction')S.seenAuction=true;render();$('#main').scrollTop=0}
document.querySelectorAll('nav.tabs button').forEach(b=>b.addEventListener('click',()=>{sfx('tap');go(b.dataset.tab)}));

let shownMoney=null;
function renderHud(){
  const cash=$('#cash');
  if(shownMoney!=null){const d=S.money-shownMoney;if(Math.abs(d)>=1000&&Math.abs(d)>=Math.abs(shownMoney)*0.0005)floater((d>0?'+':'')+fmt(d),d<0)}
  shownMoney=S.money;cash.textContent=fmt(S.money);cash.classList.toggle('neg',S.money<0);
  const bh=esc(S.company)+'<small>İNŞAAT A.Ş. · YAPI BARONU</small>';if($('#brand').innerHTML!==bh)$('#brand').innerHTML=bh;
  const lg=logoSvg(30);if($('#logo').dataset.k!==lg){$('#logo').innerHTML=lg;$('#logo').dataset.k=lg}
  $('#day').textContent=S.day;$('#worth').textContent=fmt(worth());$('#rent').textContent=fmt(dailyRent());
  $('#wx').textContent=WX[S.wx.k].n+(S.strike>0?' · grev':'');
  const L=level();$('#lvl').textContent=L;const a=xpFor(L),b=xpFor(L+1);$('#xpbar').style.width=clamp((S.xp-a)/(b-a)*100,0,100)+'%';
  $('#daybar').style.width=((S.t%DAY_MS)/DAY_MS*100)+'%';
  $('#projdot').hidden=!S.projAlert;$('#aucdot').hidden=!((S.auction||S.kamu.length)&&!S.seenAuction);$('#homedot').hidden=!(readyGoals()||(S.daily.spun!==today()));
  document.querySelectorAll('nav.tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===curTab));
  renderCoach();
}
function trend(cur,prev){const d=cur/prev-1;const p=Math.abs(d*100).toLocaleString('tr-TR',{maximumFractionDigits:1});
  return d>0.0005?`<span class="trend up">▲ %${p}</span>`:d<-0.0005?`<span class="trend down">▼ %${p}</span>`:`<span class="meta">—</span>`}
const ctrend=cid=>trend(S.idx[cid],S.prevIdx[cid]);

function viewHome(){
  const cities=CITIES.filter(c=>cityOpen(c)||S.plots.some(p=>p.city===c.id)||S.bld.some(b=>b.city===c.id));
  if(!cities.find(c=>c.id===S.view))S.view=cities[0].id;
  const building=S.bld.filter(b=>!b.done).length;
  const gs=GOALS.map(g=>({g,s:goalState(g)}));
  const show=[...gs.filter(x=>x.s==='ready'),...gs.filter(x=>x.s==='open').slice(0,4)];
  const doneN=gs.filter(x=>x.s==='done').length;
  const sel=scene.sel&&S.deco.find(d=>d.id===scene.sel);
  return `<div class="scene" id="scenebox"><div class="chips">${cities.map(c=>`<button class="chip" data-act="view" data-id="${c.id}" aria-pressed="${c.id===S.view}">${c.n}</button>`).join('')}</div>
     <span class="tap">${scene.edit?'Düzenleme: bir şeye dokun':'Binaya dokun · kaydır'}</span><span class="clock" id="clock"></span></div>
   <button class="back" data-act="gotab" data-id="home">‹ Ana ekran</button>
   ${scene.edit?`<div class="card"><div class="title">Şehri düzenle · ${CITY[S.view].n}</div>
      <p class="hint">Bir binaya ya da süse dokun, sonra oklarla sırasını değiştir. Süsler bu şehirdeki kiraları artırır (şu an +%${Math.round(decoBonus(S.view)*1000)/10}).</p>
      <div class="editbar"><button class="btn" data-act="mv" data-id="-1" ${scene.sel?'':'disabled'} aria-label="Sola taşı">◀ Sola</button><button class="btn" data-act="mv" data-id="1" ${scene.sel?'':'disabled'} aria-label="Sağa taşı">Sağa ▶</button>
      ${sel?'<button class="btn small" data-act="rmdeco">Süsü kaldır</button>':''}<button class="btn primary" data-act="decosheet">Süs ekle</button><button class="btn good" data-act="edit">Bitti</button></div></div>`
   :`<div class="row"><button class="btn" data-act="edit">Şehri düzenle</button><button class="btn ${S.daily.spun!==today()?'primary':''}" data-act="wheel">${S.daily.spun!==today()?'Şans çarkı hazır':'Şans çarkı · yarın'}</button></div>`}
   ${S.news.length?`<div class="news"><b>Gün ${S.news[0].d}:</b> ${esc(S.news[0].txt)}</div>`:''}
   <div class="row"><h3 class="grow">Görevler</h3><span class="meta">${doneN}/${GOALS.length} tamam</span></div>
   ${show.map(({g,s})=>{const [c,t]=g.p();const pct=clamp(c/t,0,1)*100;
     return `<div class="card goal ${s}"><div class="ic">${s==='ready'?'!':GOALS.indexOf(g)+1}</div>
      <div style="min-width:0"><div class="title">${g.n}</div><div class="meta">${g.d} · ödül ${fmt(g.r)}</div>
      ${s==='open'?`<div class="prog" style="margin-top:6px;height:5px"><i style="width:${pct}%;animation:none"></i></div>`:''}</div>
      ${s==='ready'?`<button class="btn primary small" data-act="claim" data-id="${g.id}">Al</button>`:`<span class="meta num">${g.money?'':Math.min(Math.floor(c),t)+'/'+t}</span>`}</div>`}).join('')}
   <p class="meta">${building} inşaat sürüyor · 1 dakika = 1 oyun günü</p>
   ${S.news.length>1?`<h3>Haberler</h3><div class="log">${S.news.slice(1,5).map(l=>`<div>Gün ${l.d} · ${esc(l.txt)}</div>`).join('')}</div>`:''}`;
}
function viewLand(){
  if(curCity)return viewCity(curCity);
  const card=c=>{
    const open=cityOpen(c);let foot;
    if(level()<c.lvl)foot=`<span class="pill">Seviye ${c.lvl}'de açılır</span>`;
    else if(c.abroad&&!S.branches[c.id])foot=`<span class="pill y">Ofis aç: ${fmt(c.fee)}</span>`;
    else{const k=S.plots.filter(p=>p.city===c.id).length+S.bld.filter(b=>b.city===c.id).length;foot=k?`<span class="pill g">${k} varlık</span>`:`<span class="meta">${c.d.length} ilçe</span>`}
    return `<button class="city ${open?'':'locked'}" data-city="${c.id}" ${level()<c.lvl?'disabled':''}><img src="${cityThumb(c.id)}" alt="" width="160" height="64">
      <span class="ci"><span class="cn">${c.n}</span><span class="meta num">${fmt(c.land*S.idx[c.id]*1000)} / 1000 m²</span>
      <span class="row" style="justify-content:space-between">${ctrend(c.id)}${foot}</span></span></button>`;
  };
  return `<h2>Arsalar</h2>
   <p class="hint">İl seç, ilçeye gir, 20 parselden birini al ve üzerine inşaat yap. Fiyatlar her gün değişir: ▼ düşerken al, ▲ yükselirken sat.</p>
   ${S.plots.length?`<h3>Elindeki arsalar</h3>${S.plots.map(plotCard).join('')}`:''}
   <h3>Türkiye · ${CITIES.filter(c=>!c.abroad).length} il</h3><div class="grid2">${CITIES.filter(c=>!c.abroad).map(card).join('')}</div>
   <h3>Yurt dışı</h3><div class="grid2">${CITIES.filter(c=>c.abroad).map(card).join('')}</div>
   ${S.log.length?`<h3>Son işlemler</h3><div class="log">${S.log.slice(0,6).map(l=>`<div>Gün ${l.d} · ${esc(l.txt)}</div>`).join('')}</div>`:''}`;
}
function plotCard(p){
  return `<div class="card"><div class="row"><div class="grow"><div class="title">${CITY[p.city].n} · ${m2(p.size)}</div>
   <div class="meta">${p.renewal?`Kentsel dönüşüm: ${p.renewal} · ${p.owners} hak sahibi`:'Boş arsa'} · değeri ${fmt(fairLand(p.city,p.size))}</div></div>
   <button class="btn primary" data-act="build" data-id="${p.id}">İnşa et</button>
   <button class="btn small" data-act="sellplot" data-id="${p.id}">Sat</button></div></div>`;
}
let curDist=null;
function viewCity(cid){
  const c=CITY[cid];
  if(c.abroad&&!S.branches[cid])return `<button class="back" data-act="back">‹ İller</button><img src="${cityThumb(cid)}" alt="" style="width:100%;border-radius:6px;max-height:120px;object-fit:cover"><h2>${c.n}</h2>
     <div class="card"><p class="hint">${c.n}'da iş yapmak için önce yerel ofis açman gerekiyor. Talep yüksek, inşaat maliyeti %${Math.round((c.bc-1)*100)} daha pahalı.</p>
     <button class="btn primary" data-act="branch" data-id="${cid}">Ofis aç · ${fmt(c.fee)}</button></div>`;
  if(curDist!=null)return viewDistrict(cid,curDist);
  const mine=S.plots.filter(p=>p.city===cid);
  return `<button class="back" data-act="back">‹ İller</button>
   <img src="${cityThumb(cid)}" alt="" style="width:100%;border-radius:6px;max-height:110px;object-fit:cover">
   <div class="row"><h2 class="grow">${c.n}</h2>${ctrend(cid)}</div>
   <div class="row meta"><span>Endeks <b class="num">${S.idx[cid].toFixed(2)}</b></span><span>Talep <b class="num">${c.dem.toFixed(2)}</b></span>${c.tour?'<span class="pill b">Turizm: otel kirası +%40</span>':''}${decoBonus(cid)?`<span class="pill g">Süs bonusu +%${Math.round(decoBonus(cid)*1000)/10}</span>`:''}</div>
   ${mine.length?`<h3>Arsaların</h3>${mine.map(plotCard).join('')}`:''}
   <h3>İlçeler</h3><p class="hint">Her ilçede 20 parsel var. Merkezi ilçeler pahalı ama daireleri de pahalıya satılır. Tapu harcı %${(harcRate()*100).toLocaleString('tr-TR')}.</p>
   <div class="grid2">${c.d.map(([dn,dm],i)=>{const mine=S.plots.filter(p=>p.city===cid&&p.di===i).length+S.bld.filter(b=>b.city===cid&&b.di===i).length;
     return `<button class="city" data-act="dist" data-id="${i}"><span class="ci"><span class="cn" style="font-size:18px">${dn}</span>
      <span class="meta num">${fmt(c.land*dm*S.idx[cid]*1000)} / 1000 m²</span>
      <span class="row" style="justify-content:space-between"><span class="meta">${freeCount(cid,i)}/20 boş parsel</span>${mine?`<span class="pill g">${mine} sende</span>`:''}</span>
      <span class="prog" style="height:4px"><i style="width:${clamp(dm/2.1,0,1)*100}%;animation:none;background:var(--info)"></i></span></span></button>`}).join('')}</div>
   <h3>Kentsel dönüşüm</h3><p class="hint">Riskli eski binaları anlaşmayla devral. Yeni binada hak sahiplerine daire verirsin, arsa ucuza gelir.</p>
   ${S.renew[cid].length?S.renew[cid].map(r=>`<div class="card"><div class="row"><div class="grow"><div class="title">${r.name} <span class="pill r">${r.year} yapımı</span></div>
     <div class="meta">${c.d[r.di||0][0]} · ${m2(r.size)} · ${r.owners} hak sahibi · arsa değeri ${fmt(fairLand(cid,r.size,r.dm||1))}</div></div>
     <button class="btn primary" data-act="renew" data-city="${cid}" data-id="${r.id}">${fmt(r.cost)}</button></div></div>`).join(''):'<div class="empty">Şu an anlaşmaya hazır bina yok. Ara ara yeni başvurular gelir.</div>'}`;
}
function viewDistrict(cid,di){
  const c=CITY[cid],[dn,dm]=c.d[di],d=getDist(cid,di);
  const tiles=d.p.map((pc,i)=>{
    let cls='',body='';
    const myPlot=S.plots.find(p=>p.key===dkey(cid,di)&&p.slot===i),myB=S.bld.find(b=>b.key===dkey(cid,di)&&b.slot===i);
    if(myB){cls='me';body=`<img src="${bThumb(myB.type,myB.done?1:myB.prog,myB.q,56)}" width="56" height="56" alt=""><span class="meta">${myB.done?'Bitti':'%'+Math.floor(myB.prog*100)}</span>`}
    else if(myPlot){cls='me';body=`<span class="pill g">Senin</span><span class="meta">İnşa et</span>`}
    else if(pc.o){body=`<span class="meta">${pc.o==='b'?'Binası satıldı':'Rakipte'}</span>`;cls='taken'}
    else{const pr=parcelPrice(cid,di,pc);body=`<b class="num">${fmt(pr)}</b>${pc.f<0.9?'<span class="pill g">Fırsat</span>':pc.f>1.08?'<span class="pill r">Pahalı</span>':''}`}
    return `<button class="parcel ${cls}" data-act="parcel" data-id="${i}" ${pc.o&&pc.o!=='me'?'disabled':''}><span class="pn">${i+1}</span><span class="num">${m2(pc.s)}</span>${body}</button>`}).join('');
  return `<button class="back" data-act="backdist">‹ ${c.n} ilçeleri</button>
   <div class="row"><h2 class="grow">${dn}</h2><span class="meta">${c.n} · m² ${fmt(c.land*dm*S.idx[cid])}</span></div>
   <p class="hint">20 parselin ${freeCount(cid,di)} tanesi satılık. Rakipler de parsel topluyor; satılanlar zamanla yeniden piyasaya düşer.</p>
   <div class="parcels">${tiles}</div>`;
}
function parcelSheet(cid,di,slot){
  const c=CITY[cid],pc=getDist(cid,di).p[slot];
  const myPlot=S.plots.find(p=>p.key===dkey(cid,di)&&p.slot===slot),myB=S.bld.find(b=>b.key===dkey(cid,di)&&b.slot===slot);
  if(myPlot)return buildSheet(myPlot.id);
  if(myB){go('proj');setTimeout(()=>{const el=document.getElementById('b-'+myB.id);el&&el.scrollIntoView({block:'center'})},50);return}
  if(pc.o)return;
  const pr=parcelPrice(cid,di,pc),tot=Math.round(pr*(1+harcRate())),fair=fairLand(cid,pc.s,c.d[di][1]);
  const fits=TYPES.filter(t=>t.min<=pc.s);
  openSheet(`<h2>${c.d[di][0]} · Parsel ${slot+1}</h2>
   <div class="card"><div class="stat"><span>Alan</span><b class="num">${m2(pc.s)}</b></div>
   <div class="stat"><span>Satış fiyatı</span><b class="num">${fmt(pr)}</b></div>
   <div class="stat"><span>Piyasa değeri</span><b class="num">${fmt(fair)}</b></div>
   <div class="stat"><span>Tapu harcı dahil</span><b class="num">${fmt(tot)}</b></div></div>
   <p class="meta">Yapılabilecekler</p><div class="row">${fits.map(t=>`<span class="pill ${level()>=t.lvl?'g':''}">${t.n}${level()<t.lvl?' (Sv.'+t.lvl+')':''}</span>`).join('')}</div>
   <div class="row"><button class="btn primary big" data-act="buyparcel" data-id="${slot}">Satın al · ${fmt(tot)}</button><button class="btn" data-act="close">Vazgeç</button></div>`);
}
function viewBiz(){
  const L=level();const cats=BCAT;
  const own=S.biz;
  return `<h2>İşler</h2><p class="hint">İnşaat dışındaki gelir kapıların. İşletmeler her gün gelir getirir, fiyatları piyasaya ve havaya göre değişir. Doğru bölgede kurulursa 1,5 kat kazanır. Seviye 5'e kadar büyütebilirsin.</p>
   <div class="grid3"><div class="tile"><div class="k">İşletme</div><div class="v">${own.length}</div></div><div class="tile"><div class="k">Günlük gelir</div><div class="v">${fmt(bizDaily())}</div></div><div class="tile"><div class="k">Petrol</div><div class="v">${trend(S.comm.petrol,1)}</div></div></div>
   ${own.length?`<h3>İşletmelerin</h3>${own.map(b=>{const d=BIZK[b.t],cat=BCAT.find(x=>x[0]===d.cat);
     return `<div class="card"><div class="row">${bizIcon(d,cat)}<div class="grow"><div class="title">${d.n} <span class="pill">Sv.${b.lvl}</span>${bizRegion(b)?' <span class="pill g">Bölge bonusu</span>':''}</div>
      <div class="meta">${CITY[b.city].n} · ${b.state==='drill'?`<span class="pill y">Sondaj sürüyor · ${b.left} gün</span>`:b.state==='dry'?'<span class="pill r">Boş çıktı</span>':`günlük ${fmt(bizIncome(b))}`}</div></div></div>
      <div class="row">${b.state==='ok'&&b.lvl<5?`<button class="btn primary small" data-act="upbiz" data-id="${b.id}">Büyüt · ${fmt(d.cost*0.8*b.lvl)}</button>`:''}
      <button class="btn small" data-act="sellbiz" data-id="${b.id}">${b.state==='dry'?'Kapat':'Sat · '+fmt(bizInvest(b)*0.7)}</button></div></div>`}).join('')}`:''}
   <h3>Piyasa</h3><div class="row">${COMMS.map(k=>`<span class="pill">${COMMN[k]} ${S.comm[k].toFixed(2)}</span>`).join('')}</div>
   ${cats.map(cat=>`<h3>${cat[1]}</h3><div class="grid2">${BIZ.filter(d=>d.cat===cat[0]).map(d=>`<button class="city" data-act="bizsheet" data-id="${d.id}" ${L<d.lvl?'disabled':''} style="${L<d.lvl?'opacity:.5':''}"><span class="ci">
      <span class="row" style="flex-wrap:nowrap">${bizIcon(d,cat)}<b style="min-width:0">${d.n}</b></span>
      <span class="meta">${L<d.lvl?`Seviye ${d.lvl}'de açılır`:`${fmt(d.cost)} · günde ~${fmt(d.inc*S.comm[d.comm])}`}</span>
      ${d.risk?`<span class="pill r">Riskli · %${Math.round(d.risk*100)} boş</span>`:d.reg.length?`<span class="meta">Bonus: ${d.reg.slice(0,3).map(x=>CITY[x].n).join(', ')}</span>`:''}</span></button>`).join('')}</div>`).join('')}`;
}
function bizIcon(d,cat){
  const col=cat?cat[2]:'#888',g={tarim:'<path d="M20 32V14M20 18c-4-1-6-4-6-7 4 0 6 3 6 7zm0 0c4-1 6-4 6-7-4 0-6 3-6 7zm0 6c-4-1-6-4-6-7 4 0 6 3 6 7zm0 0c4-1 6-4 6-7-4 0-6 3-6 7z"/>',
   hayvan:'<path d="M10 24c0-5 4-9 10-9s10 4 10 9-4 6-10 6-10-1-10-6zM14 16l-2-4M26 16l2-4"/><circle cx="16" cy="22" r="1"/><circle cx="24" cy="22" r="1"/>',
   enerji:'<path d="M22 8L12 22h7l-2 10 10-14h-7z"/>',petrol:'<path d="M20 8c5 7 8 11 8 15a8 8 0 01-16 0c0-4 3-8 8-15z"/>',
   maden:'<path d="M10 30l8-8M14 12c6-2 12 0 16 4M18 22l-4-4 8-8 4 4z"/>',sanayi:'<path d="M8 32V20l7 4v-4l7 4v-4l7 4V10h3v22z"/>',hizmet:'<path d="M10 16h20l-2 14H12zM15 16a5 5 0 0110 0"/>'}[d.cat];
  return `<svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true" style="flex-shrink:0"><rect width="40" height="40" rx="8" fill="${col}"/><g fill="none" stroke="#1b1400" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${g}</g></svg>`;
}
function bizSheet(t){
  const d=BIZK[t],cat=BCAT.find(x=>x[0]===d.cat);
  const opts=CITIES.filter(c=>cityOpen(c)&&(!d.risk||d.reg.includes(c.id))&&(!d.coast||c.sc.sea));
  openSheet(`<div class="row">${bizIcon(d,cat)}<h2 class="grow">${d.n}</h2></div><p class="hint">${d.d} Kurulum ${fmt(d.cost)}, bugünkü fiyatlarla günde yaklaşık ${fmt(d.inc*S.comm[d.comm])} getirir${d.reg.length?`, bonuslu bölgede ${fmt(d.inc*S.comm[d.comm]*1.5)}`:''}.</p>
   <p class="meta">Nereye kuralım?</p>
   ${opts.length?`<div class="grid2">${opts.map(c=>`<button class="btn ${d.reg.includes(c.id)?'primary':''}" data-act="buybiz" data-id="${t}" data-city="${c.id}">${c.n}${d.reg.includes(c.id)?' · bonus':''}</button>`).join('')}</div>`:`<div class="empty">Uygun bölge henüz açık değil: ${d.reg.map(x=>CITY[x].n).join(', ')}.</div>`}
   <button class="btn" data-act="close">Vazgeç</button>`);
}
const RR=[[0.9,'Düşük'],[1,'Normal'],[1.15,'Yüksek'],[1.3,'Çok yüksek']];
function viewProj(){
  const doing=S.bld.filter(b=>!b.done),done=S.bld.filter(b=>b.done);
  if(!S.bld.length)return `<h2>Projeler</h2><div class="empty">Henüz projen yok. Arsalar sekmesinden arsa alıp inşaat başlat.</div>`;
  return `<h2>Projeler</h2>
   ${S.strike>0?`<div class="news" style="border-color:var(--bad)">İşçi grevi sürüyor: inşaatlar ${S.strike} gün duracak.</div>`:''}
   ${doing.length?`<h3>İnşaatta</h3>${doing.map(b=>{const days=b.kamu?b.days:(b.dd||TYPE[b.type].days*QUAL[b.q].days);const sp=speed(b.city);const left=sp>0?Math.ceil((1-b.prog)*days/sp*DAY_MS/1000):0;
     return `<div class="card bld" id="b-${b.id}"><img src="${bThumb(b.type,b.prog,b.q,72,b.kind)}" width="72" height="72" alt="">
     <div style="min-width:0;display:flex;flex-direction:column;gap:6px"><div class="title">${esc(b.name)}</div>
     <div class="meta">${b.kamu?`Kamu projesi · teslimde ${fmt(b.pay)}`:`${TYPE[b.type].n} · ${QUAL[b.q].n} · ${b.units.length} ${TYPE[b.type].uname}`} · ${CITY[b.city].n}</div>
     <div class="prog"><i style="width:${b.prog*100}%"></i></div><div class="meta num">%${Math.floor(b.prog*100)} · ${sp>0?`~${Math.floor(left/60)} dk ${left%60} sn kaldı`:'durdu'}${S.wx.k!=='sun'&&S.wx.k!=='cloud'?` · ${WX[S.wx.k].n.toLowerCase()} hava yavaşlatıyor`:''}</div></div></div>`}).join('')}`:''}
   ${done.length?`<h3>Tamamlanan</h3>${done.map(b=>{const t=TYPE[b.type],cnt=k=>b.units.filter(u=>u===k).length;
     const e=cnt('empty'),l=cnt('listing'),r=cnt('rented'),s=cnt('sold'),o=cnt('owner');const rc=repairCost(b);
     return `<div class="card bld" id="b-${b.id}"><img src="${bThumb(b.type,1,b.q)}" width="72" height="72" alt="">
      <div style="min-width:0;display:flex;flex-direction:column;gap:6px">
      <div class="title">${esc(b.name)}</div><div class="meta">${t.n} · ${QUAL[b.q].n} · ${CITY[b.city].n}${b.renewal?' · dönüşüm':''}</div>
      <div class="units" aria-label="Birimler">${b.units.map(u=>`<span class="u u-${u}"></span>`).join('')}</div>
      <div class="row meta">${e?`<span>${e} boş</span>`:''}${l?`<span class="pill b">${l} satışta</span>`:''}${r?`<span class="pill g">${r} kirada</span>`:''}${s?`<span>${s} satıldı</span>`:''}${o?`<span>${o} hak sahibi</span>`:''}</div>
      <div class="stat"><span>Birim değeri</span><b class="num">${fmt(unitValue(b))}</b></div>
      <div class="stat"><span>Birim kirası</span><b class="num">${fmt(unitRent(b))}/gün</b></div>
      <div class="stat"><span>Bina bakımı</span><b class="num" style="color:${b.cond<50?'var(--bad)':b.cond<80?'var(--accent)':'var(--good)'}">%${Math.round(b.cond)}</b></div>
      <div class="row">
       ${e?`<button class="btn primary small" data-act="list" data-id="${b.id}">Satışa çıkar (${e})</button><button class="btn good small" data-act="rent" data-id="${b.id}">Kirala (${e})</button>`:''}
       ${l?`<button class="btn small" data-act="unlist" data-id="${b.id}">Satıştan çek</button>`:''}
       ${(e+l)?`<button class="btn small" data-act="quick" data-id="${b.id}">Hızlı sat −%15</button>`:''}
       ${r?`<button class="btn small" data-act="sellrented" data-id="${b.id}">Kiracılı sat</button><button class="btn small" data-act="evict" data-id="${b.id}">Tahliye</button>`:''}
       ${rc>0&&b.cond<95?`<button class="btn small" data-act="repair" data-id="${b.id}">Tadilat ${fmt(rc)}</button>`:''}
      </div>
      ${r||e?`<div class="seg" style="grid-template-columns:repeat(4,1fr)" role="group" aria-label="Kira seviyesi">${RR.map(([v,nm])=>`<button data-act="rr" data-id="${b.id}" data-v="${v}" aria-pressed="${b.rr===v}">${nm}</button>`).join('')}</div>
       <p class="meta">Kira yükseldikçe kiracıların ayrılma ihtimali artar. Bakım %50'nin altına düşerse kira azalır, kiracılar kaçar.</p>`:''}
      </div></div>`}).join('')}`:''}
   <p class="hint">Mavi: satışta, yeşil: kirada, mor: hak sahibi. Satıştakiler her gün şehrin talebine göre alıcı bulur.</p>`;
}
function viewAuction(){
  const a=S.auction;let top;
  if(!a)top=`<div class="empty">Şu an açık arsa ihalesi yok. Belediyeler birkaç günde bir arsa ihalesi açar.</div>`;
  else{const left=Math.max(0,Math.ceil((a.end-S.t)/1000));
  top=`<img src="${cityThumb(a.city)}" alt="" style="width:100%;border-radius:6px;max-height:110px;object-fit:cover">
   <div class="card"><div class="title">${CITY[a.city].n} Belediyesi · ${CITY[a.city].d[a.di||0][0]} · ${m2(a.size)} arsa</div>
   <div class="stat"><span>Piyasa değeri</span><b class="num">${fmt(fairLand(a.city,a.size,a.dm||1))}</b></div>
   <div class="stat"><span>Güncel teklif</span><b class="num">${fmt(a.cur)}</b></div>
   <div class="stat"><span>Önde</span><b>${a.leader==='me'?'<span class="pill g">Sen</span>':`<span class="pill r">${a.rival||'Açılış bedeli'}</span>`}</b></div>
   <div class="stat"><span>Kalan süre</span><b class="num">${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}</b></div>
   <button class="btn primary big" data-act="bid" ${a.leader==='me'?'disabled':''}>Teklif ver · ${fmt(Math.round(a.cur*1.05/1e4)*1e4)}</button>
   <p class="hint">Kazanırsan bedel süre bitince kasadan düşer. Kasada para yoksa teklifin %5'i teminat olarak yanar.</p></div>`}
  return `<h2>İhale</h2><h3>Arsa ihalesi</h3>${top}
   <h3>Kamu projeleri</h3><p class="hint">Devlet okul, hastane, kütüphane gibi binalar için ihale açar. En düşük teklif kazanır. İnşaatı sen finanse edersin, teslim edince devlet teklifini öder. Bitmiş bina şehrinde kalır.</p>
   ${S.kamu.length?S.kamu.map(k=>`<div class="card"><div class="row"><img src="${bThumb('kamu',1,'std',56,k.k)}" width="56" height="56" alt="" style="border-radius:4px"><div class="grow"><div class="title">${esc(k.n)}</div>
     <div class="meta">Tahmini maliyet ${fmt(k.cost)} · ${k.days} gün · son başvuru ${k.exp-S.day} gün</div></div></div>
     <div class="seg">${[[1.15,'Düşük teklif'],[1.3,'Orta teklif'],[1.45,'Yüksek teklif']].map(([m,nm])=>`<button data-act="kamu" data-id="${k.id}" data-m="${m}">${nm}<br><span class="meta">${fmt(k.cost*m)}</span></button>`).join('')}</div></div>`).join('')
   :'<div class="empty">Şu an açık kamu ihalesi yok. Birkaç günde bir yenileri gelir.</div>'}`;
}
function viewBank(){
  const lim=creditLimit(),offers=[[12,0.08],[30,0.16],[60,0.27]];
  const amounts=[5e6,10e6,25e6,50e6,100e6,250e6,500e6,1e9,2.5e9].filter(x=>x<=lim);
  return `<h2>Banka</h2>
   <div class="card"><div class="stat"><span>Kullanılabilir limit</span><b class="num">${fmt(Math.max(0,lim))}</b></div>
   <div class="stat"><span>Toplam borç</span><b class="num">${fmt(debt())}</b></div>
   <p class="hint">Limit, varlıklarının ve ofisinin büyüklüğüne göre artar. Vadesi dolan kredi kasadan otomatik düşer. Kasa eksiye düşerse günlük %1 ek faiz işler.</p></div>
   <h3>Kredi çek</h3>
   ${amounts.length?`<div class="card"><label class="meta" for="loanamt">Tutar</label>
     <select id="loanamt" class="btn">${amounts.map(a=>`<option value="${a}">${fmt(a)}</option>`).join('')}</select>
     ${offers.map(([d,r])=>`<div class="row"><div class="grow"><b>${d} gün vade</b> <span class="meta">toplam faiz %${Math.round(r*(1-0.08*S.staff.acct)*100)}</span></div><button class="btn primary small" data-act="loan" data-days="${d}" data-rate="${r}">Çek</button></div>`).join('')}
   </div>`:'<div class="empty">Kredi limitin doldu. Borç kapatınca ya da varlıkların büyüyünce açılır.</div>'}
   <h3>Kredilerin</h3>
   ${S.loans.length?S.loans.map(l=>`<div class="card"><div class="row"><div class="grow"><div class="title num">${fmt(l.amount)}</div>
     <div class="meta">Faiz ${fmt(l.interest)} · ${l.left} gün kaldı</div></div>
     <button class="btn small" data-act="repay" data-id="${l.id}">Erken kapat</button></div></div>`).join(''):'<div class="empty">Kredin yok.</div>'}
   <h3>Sigorta</h3>
   <div class="card"><div class="row"><div class="grow"><div class="title">Şirket sigortası ${S.ins?'<span class="pill g">Aktif</span>':'<span class="pill">Yok</span>'}</div>
    <div class="meta">Yangın, sel ve hırsızlık hasarlarının %80'ini öder. Grev ve cezaları karşılamaz. Günlük prim ${fmt(Math.max(20000,assets()*0.0003))}.</div></div>
    <button class="btn ${S.ins?'':'primary'}" data-act="ins">${S.ins?'İptal et':'Sigorta yaptır'}</button></div></div>`;
}
function viewCorp(){
  const tabs=[['staff','Ekip'],['veh','Araçlar'],['depot','Depo'],['stock','Halka arz'],['lux','Koleksiyon'],['rank','Sıralama'],['office','Ofis']];
  const body={staff:corpStaff,veh:corpVeh,depot:corpDepot,stock:corpStock,rank:corpRank,office:corpOffice,lux:corpLux}[sub]();
  return `<h2>Şirket</h2><div class="subtabs" role="group" aria-label="Şirket bölümleri">${tabs.map(([k,n])=>`<button data-act="sub" data-id="${k}" aria-pressed="${sub===k}">${n}</button>`).join('')}</div>${body}`;
}
const STAFF_ICON={eng:'M',agent:'S',arch:'A',acct:'₺'};
function corpStaff(){
  return `<p class="hint">Personel günlük maaş alır, işe alırken 3 günlük maaş peşin ödenir. Toplam maaş: <b class="num">${fmt(dailySalary())}</b>/gün. Ofisin büyüdükçe kadro sınırı artar.</p>
   ${STAFF.map(s=>`<div class="card goal"><div class="ic">${STAFF_ICON[s.id]}</div><div style="min-width:0"><div class="title">${s.n}</div><div class="meta">${s.d} Maaş ${fmt(s.sal)}/gün.</div></div>
    <div class="row" style="flex-wrap:nowrap;gap:6px"><button class="btn small" data-act="fire" data-id="${s.id}" ${S.staff[s.id]?'':'disabled'} aria-label="Bir kişi çıkar">−</button>
    <b class="num">${S.staff[s.id]}/${staffMax(s)}</b>
    <button class="btn primary small" data-act="hire" data-id="${s.id}" ${S.staff[s.id]>=staffMax(s)?'disabled':''} aria-label="Bir kişi al">+</button></div></div>`).join('')}
   <div class="card"><div class="stat"><span>Tamamlanan proje</span><b class="num">${S.stats.built}</b></div>
    <div class="stat"><span>Satılan birim</span><b class="num">${S.stats.sold}</b></div>
    <div class="stat"><span>Kamu projesi</span><b class="num">${S.stats.kamu}</b></div>
    <div class="stat"><span>Sonraki seviye</span><b class="num">${Math.max(0,Math.ceil(xpFor(level()+1)-S.xp))} puan</b></div></div>`;
}
function corpVeh(){
  return `<p class="hint">İş makineleri inşaatları hızlandırır (şu an +%${Math.round(vehSpeed()*100)}). Kullanmadığını kiraya verirsen her gün kira getirir ama şantiyede çalışmaz. Günlük bakım: ${fmt(vehUpkeep())}.</p>
   ${VEH.map(v=>{const st=S.veh[v.id],lock=level()<v.lvl;return `<div class="card"><div class="row"><img src="${vThumb(v.id)}" width="90" height="64" alt="" style="border-radius:4px"><div class="grow"><div class="title">${v.n}</div>
    <div class="meta">${lock?`Seviye ${v.lvl} gerekir`:`+%${Math.round(v.sp*100)} hız · kira ${fmt(v.cost*0.012)}/gün · ${fmt(v.cost)}`}</div>
    <div class="meta">Filoda ${st.own}/${VEH_MAX}${st.rented?` · ${st.rented} kirada`:''}</div></div></div>
    <div class="row"><button class="btn primary small" data-act="veh" data-id="${v.id}" data-v="1" ${lock||st.own>=VEH_MAX?'disabled':''}>Satın al</button>
    <button class="btn small" data-act="veh" data-id="${v.id}" data-v="-1" ${st.own-st.rented>0?'':'disabled'}>Sat</button>
    <button class="btn small" data-act="vrent" data-id="${v.id}" data-v="1" ${st.rented<st.own?'':'disabled'}>Kiraya ver</button>
    <button class="btn small" data-act="vrent" data-id="${v.id}" data-v="-1" ${st.rented?'':'disabled'}>Geri al</button></div></div>`}).join('')}`;
}
function corpDepot(){
  const cap=depotCap(),tot=stockTotal();
  return `<p class="hint">İnşaat maliyetinin %30'u malzemedir. Fiyatlar her gün değişir; ucuzken stok yaparsan yeni inşaatlarda stoğun kullanılır ve o kısmı tekrar ödemezsin.</p>
   <div class="card"><div class="stat"><span>Depo doluluğu</span><b class="num">${fmt(tot)} / ${fmt(cap)}</b></div><div class="prog"><i style="width:${clamp(tot/cap,0,1)*100}%;animation:none"></i></div>
    <button class="btn small" data-act="depot" style="align-self:flex-start">Depoyu büyüt · ${fmt(5e6*Math.pow(S.mat.depot+1,2))}</button></div>
   ${MAT.map(m=>`<div class="card"><div class="row">${matIcon(m)}<div class="grow"><div class="title">${m.n} ${trend(S.mat.idx[m.id],1)}</div>
    <div class="meta">Fiyat endeksi ${S.mat.idx[m.id].toFixed(2)} · stokta ${fmt(S.mat.stock[m.id])} değerinde</div></div></div>
    <div class="row">${[1e6,5e6,20e6].map(a=>`<button class="btn small primary" data-act="mat" data-id="${m.id}" data-v="${a}">${fmt(a)} al · ${fmt(a*S.mat.idx[m.id])}</button>`).join('')}
    <button class="btn small" data-act="matsell" data-id="${m.id}" ${S.mat.stock[m.id]>0?'':'disabled'}>Stoğu sat</button></div></div>`).join('')}`;
}
function corpStock(){
  const w=S.money+assets()-debt();
  return `<div class="card"><div class="title">${esc(S.company)} borsada ${S.ipo?'<span class="pill g">Halka açık</span>':'<span class="pill">Halka kapalı</span>'}</div>
   ${S.ipo?`<p class="hint">Şirketinin %25'i yatırımcılarda. Kira gelirinin %25'i her gün temettü olarak ödenir. Hisseleri geri alırsan şirket yine tamamen senin olur.</p>
     <button class="btn" data-act="buyback">Hisseleri geri al · ${fmt(w*S.ipo.pct*1.08)}</button>`
   :`<p class="hint">Halka arzda şirketinin %25'ini satarak tek seferde ${fmt(w*0.25*1.1)} nakit alırsın. Karşılığında kira gelirinin %25'i her gün temettü olarak gider. Servetin en az ₺50 Mn olmalı.</p>
     <button class="btn primary" data-act="ipo" ${worth()<50e6?'disabled':''}>Halka arz et</button>`}</div>
   <h3>Rakip hisseleri</h3><p class="hint">Rakiplerin değeri her gün değişir. Hisselerini alıp yükselince satabilirsin. Portföyün: ${fmt(portfolio())}.</p>
   ${S.rivals.map(r=>{const own=(S.shares[r.id]||0)*sharePrice(r);return `<div class="card"><div class="row"><span style="width:12px;height:12px;border-radius:3px;background:${r.col}"></span><div class="grow"><div class="title">${esc(r.n)}</div>
    <div class="meta">Hisse ${sharePrice(r).toLocaleString('tr-TR',{maximumFractionDigits:2})} ₺ ${trend(r.w,r.prev||r.w)} · sende ${fmt(own)}</div></div></div>
    <div class="row">${[1e6,10e6,100e6].map(a=>`<button class="btn small primary" data-act="shbuy" data-id="${r.id}" data-v="${a}">${fmt(a)} al</button>`).join('')}<button class="btn small" data-act="shsell" data-id="${r.id}" ${own?'':'disabled'}>Hepsini sat</button></div></div>`}).join('')}`;
}
function corpRank(){
  const rk=ranking();
  return `<p class="hint">Sektördeki en büyük inşaat şirketleri, servete göre. Rakipler de her gün büyüyor.</p>
   <div class="card">${rk.map((x,i)=>`<div class="rank ${x.me?'me':''}"><span class="pos">${i+1}</span><span class="row" style="gap:8px;flex-wrap:nowrap">${x.me?logoSvg(22):`<span style="width:14px;height:14px;border-radius:3px;background:${x.col};flex-shrink:0"></span>`}<b style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(x.n)}</b></span><b class="num">${fmt(x.w)}</b></div>`).join('')}</div>`;
}
function corpOffice(){
  const cur=OFFICE[S.office],nx=OFFICE[S.office+1];
  return `<div class="card" style="align-items:center;text-align:center"><img src="${bThumb(cur.art,1,'lux',140)}" width="140" height="140" alt="" style="border-radius:8px">
    <div class="title">${cur.n}</div><p class="hint">Her ofis seviyesi kredi limitini %10, satış şansını %5 artırır. İki seviyede bir her pozisyona 1 kişilik kadro açılır.</p>
    ${nx?`<button class="btn primary" data-act="office">${nx.n} · ${fmt(nx.cost)}</button>`:'<span class="pill y">En büyük ofistesin</span>'}</div>
   <h3>Şirket logosu</h3>
   <div class="card"><div class="row">${logoSvg(56)}<div class="grow"><div class="title">${esc(S.company)}</div><div class="meta">Logon üst barda, sıralamada ve alışveriş merkezlerinde görünür.</div></div></div>
    <div class="meta">Şekil</div><div class="swatches">${[0,1,2,3,4,5].map(i=>`<button data-act="lshape" data-id="${i}" aria-pressed="${S.logo.shape===i}" aria-label="Şekil ${i+1}">${logoSvg(28,i,S.logo.col)}</button>`).join('')}</div>
    <div class="meta">Renk</div><div class="swatches">${LOGO_COLS.map((c,i)=>`<button data-act="lcol" data-id="${i}" aria-pressed="${S.logo.col===i}" aria-label="Renk ${i+1}"><span style="width:22px;height:22px;border-radius:50%;background:${c}"></span></button>`).join('')}</div></div>`;
}
function render(){
  renderHud();
  const v={home:viewDash,sehir:viewHome,land:viewLand,proj:viewProj,biz:viewBiz,auction:viewAuction,bank:viewBank,corp:viewCorp,borsa:viewBorsa}[curTab]();
  const m=$('#main'),keep=m.scrollTop,sel=$('#loanamt')?.value;
  m.className=curTab==='sehir'?'home':curTab==='home'?'dashhome':curTab;m.innerHTML=v;m.scrollTop=keep;if(sel&&$('#loanamt'))$('#loanamt').value=sel;
  if(curTab==='sehir')$('#scenebox').prepend(ensureScene());
}
function openSheet(html){const s=$('#sheet');s.innerHTML=`<div class="sheet">${html}</div>`;s.hidden=false;sfx('open')}
function closeSheet(){$('#sheet').hidden=true;$('#sheet').innerHTML='';queueNext()}
$('#sheet').addEventListener('click',e=>{if(e.target.id==='sheet'&&!wheel.spinning)closeSheet()});
let queue=[];function queueNext(){const f=queue.shift();if(f)setTimeout(f,250)}

function buildSheet(pid){
  const p=S.plots.find(x=>x.id===pid);if(!p)return;
  const mats=stockTotal()>0?`<p class="meta">Depodaki malzeme otomatik kullanılır; fiyatlar ona göre düşük görünür.</p>`:'';
  openSheet(`<h2>Ne inşa edelim?</h2><p class="hint">${CITY[p.city].n} · ${m2(p.size)}${p.owners?` · ${p.owners} hak sahibine daire verilecek`:''}. Arsa büyüdükçe birim değeri biraz artar.</p>
   <div class="seg" role="group" aria-label="Malzeme kalitesi">${Object.entries(QUAL).map(([k,q])=>`<button data-act="qual" data-id="${p.id}" data-q="${k}" aria-pressed="${selQ===k}">${q.n}<br><span class="meta">${k==='eco'?'−%20 maliyet':k==='lux'?'+%26 değer':'dengeli'}</span></button>`).join('')}</div>${mats}
   ${TYPES.map(t=>{const cost=costPlan(t.id,p.city,selQ).cash;const ok=level()>=t.lvl&&p.size>=t.min&&(!p.owners||t.units>p.owners);
     const why=level()<t.lvl?`Seviye ${t.lvl} gerekir`:p.size<t.min?`En az ${m2(t.min)} arsa gerekir`:p.owners&&t.units<=p.owners?'Hak sahiplerine yetmez':`${t.units} ${t.uname} · ${Math.round(t.days*QUAL[selQ].days)} gün`;
     return `<button class="opt" data-act="dobuild" data-id="${p.id}" data-type="${t.id}" ${ok?'':'disabled'}><img src="${bThumb(t.id,1,selQ,56)}" width="56" height="56" alt=""><span><b>${t.n}</b> <span class="num" style="float:right">${fmt(cost)}</span><br><span class="meta">${why}</span></span></button>`}).join('')}
   <button class="btn" data-act="close">Vazgeç</button>`);
}
function decoSheet(){
  openSheet(`<h2>Süs ekle</h2><p class="hint">${CITY[S.view].n} sokağına eklenir. Her süs bu şehirdeki kiraları artırır (toplam en fazla %25).</p>
   ${DECO.map(d=>{const cv=document.createElement('canvas');cv.width=112;cv.height=112;const c=cv.getContext('2d');c.scale(2,2);c.fillStyle='#5fb3e8';c.fillRect(0,0,56,56);c.fillStyle='#7fae7a';c.fillRect(0,48,56,8);
     const s=Math.min(1,46/d.W);c.save();c.translate((56-d.W*s)/2,48);c.scale(s,s);drawDeco(c,{k:d.k},0,0,0,600);c.restore();
     return `<button class="opt" data-act="buydeco" data-id="${d.id}"><img src="${cv.toDataURL()}" width="56" height="56" alt=""><span><b>${d.n}</b> <span class="num" style="float:right">${fmt(d.cost)}</span><br><span class="meta">Kiralara +%${Math.round(d.bon*1000)/10}</span></span></button>`}).join('')}
   <button class="btn" data-act="close">Vazgeç</button>`);
}
function settingsSheet(){
  openSheet(`<h2>Ayarlar</h2>
   <button class="toggle" data-act="set" data-id="music" aria-pressed="${SET.music}"><span>Müzik</span><b>${SET.music?'Açık':'Kapalı'}</b></button>
   <button class="toggle" data-act="set" data-id="sfx" aria-pressed="${SET.sfx}"><span>Ses efektleri</span><b>${SET.sfx?'Açık':'Kapalı'}</b></button>
   <button class="toggle" data-act="set" data-id="vib" aria-pressed="${SET.vib}"><span>Titreşim</span><b>${SET.vib?'Açık':'Kapalı'}</b></button>
   <div class="field"><label class="meta" for="cname">Şirket adı</label><input id="cname" maxlength="24" value="${esc(S.company)}"></div>
   <button class="btn" data-act="rename">Adı kaydet</button>
   <button class="btn" data-act="tutorial">Rehberi baştan göster</button>
   <button class="btn" data-act="reset" style="color:var(--bad)">Yeni oyuna başla</button>
   <p class="hint">İlerlemen bu cihazda, bu tarayıcıda otomatik kaydedilir. 1 gerçek dakika 1 oyun günüdür.</p>
   <button class="btn primary" data-act="close">Kapat</button>`);
}
// wheel of fortune
const WHEEL=[{t:'₺1 Mn',v:1e6},{t:'₺250 B',v:2.5e5},{t:'₺5 Mn',v:5e6},{t:'Malzeme',mat:1},{t:'₺2 Mn',v:2e6},{t:'Puan',xp:1},{t:'₺10 Mn',v:10e6},{t:'₺500 B',v:5e5}];
const WCOL=['#f2b632','#3fa9f5','#e74c3c','#4cc38a','#a58be0','#f28c38','#d98fb7','#6ab0f3'];
const wheel={ang:0,spinning:false};
function wheelSheet(){
  const can=S.daily.spun!==today();
  openSheet(`<h2>Şans çarkı</h2><p class="hint">Günde bir kez çevir. Ödüller seviyene göre büyür.</p>
   <div class="wheelbox"><canvas id="wheelcv" width="540" height="540"></canvas>
   <button class="btn primary big" data-act="spin" ${can?'':'disabled'}>${can?'Çevir':'Yarın tekrar gel'}</button></div>
   <button class="btn" data-act="close">Kapat</button>`);
  drawWheel();
}
function drawWheel(){
  const cv=$('#wheelcv');if(!cv)return;const c=cv.getContext('2d');const R=250,cx=270,cy=270,n=WHEEL.length;
  c.clearRect(0,0,540,540);c.save();c.translate(cx,cy);c.rotate(wheel.ang);
  WHEEL.forEach((w,i)=>{const a0=i*2*Math.PI/n-Math.PI/2-Math.PI/n,a1=a0+2*Math.PI/n;c.fillStyle=WCOL[i];c.beginPath();c.moveTo(0,0);c.arc(0,0,R,a0,a1);c.fill();
    c.save();c.rotate((a0+a1)/2);c.fillStyle='#1b1400';c.font='bold 34px "Big Shoulders Display",Impact,sans-serif';c.textAlign='right';c.fillText(w.t,R-20,12);c.restore()});
  c.restore();
  c.fillStyle='#0c1f1c';c.beginPath();c.arc(cx,cy,34,0,7);c.fill();c.strokeStyle='#ff7a52';c.lineWidth=6;c.beginPath();c.arc(cx,cy,R,0,7);c.stroke();
  c.fillStyle='#fff';c.beginPath();c.moveTo(cx-18,6);c.lineTo(cx+18,6);c.lineTo(cx,48);c.fill();
}
function spin(){
  if(wheel.spinning||S.daily.spun===today())return;S.daily.spun=today();wheel.spinning=true;audioInit();
  const n=WHEEL.length,idx=Math.floor(Math.random()*n);const target=-idx*2*Math.PI/n;
  const start=wheel.ang,end=target+Math.PI*2*(6+Math.floor(Math.random()*2))+(start-(start%(Math.PI*2)));
  const t0=performance.now(),dur=3800;let lastSeg=-1;
  const step=now=>{const t=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-t,4);wheel.ang=start+(end-start)*e;drawWheel();
    const seg=Math.floor(wheel.ang/(2*Math.PI/n));if(seg!==lastSeg){lastSeg=seg;sfx('tick')}
    if(t<1)requestAnimationFrame(step);else{wheel.spinning=false;wheel.ang=end%(Math.PI*2);prize(WHEEL[idx])}};
  requestAnimationFrame(step);
}
function prize(w){
  const mult=1+(level()-1)*0.6;let txt;
  if(w.v){const v=Math.round(w.v*mult/1e4)*1e4;S.money+=v;txt=`Kasana ${fmt(v)} eklendi.`;coinBurst(innerWidth/2,innerHeight/2,14)}
  else if(w.mat){const v=Math.round(3e6*mult/1e4)*1e4;MAT.forEach(m=>S.mat.stock[m.id]+=v/3);txt=`Depona ${fmt(v)} değerinde malzeme geldi.`}
  else{const x=Math.max(5,xpFor(level()+1)-xpFor(level()))*0.15;gainXp(x);txt=`${Math.round(x)} seviye puanı kazandın.`}
  sfx('reward');vib([30,30,60]);
  const s=$('#sheet .sheet');if(s)s.insertAdjacentHTML('afterbegin',`<div class="news" style="border-color:var(--good)"><b>${w.t}!</b> ${txt}</div>`);
  const b=$('[data-act="spin"]');if(b){b.disabled=true;b.textContent='Yarın tekrar gel'}
  renderHud();
}

// tutorial
const TUT=[
 {t:'Arsalar sekmesine gir ve İstanbul\'a dokun.',tab:'land',done:()=>curCity==='istanbul'||S.plots.length||S.bld.length},
 {t:'Esenyurt ilçesine gir. En ucuz ilçe orası.',done:()=>curDist!=null||S.plots.length||S.bld.length},
 {t:'Boş bir parsele dokun ve satın al.',done:()=>S.plots.length||S.bld.length},
 {t:'Arsanın yanındaki "İnşa et"e bas ve Müstakil Ev seç.',done:()=>S.bld.length},
 {t:'İnşaat başladı! 1 dakika 1 gün. Ana ekranda ilerlemesini, Şehrim kutusunda vinçleri izleyebilirsin.',done:()=>S.bld.some(b=>b.done)||S.stats.sold},
 {t:'Ev bitti. Projeler sekmesinde "Satışa çıkar" ya da "Kirala"ya bas.',tab:'proj',done:()=>S.stats.sold||S.bld.some(b=>b.units.some(u=>u==='listing'||u==='rented'))},
 {t:'Şirket sekmesinden iş makinesi al, inşaatların hızlansın.',tab:'corp',done:()=>vehCount()>0},
 {t:'İşler sekmesinden bir işletme kur: kafe, tarla, akaryakıt istasyonu...',tab:'biz',done:()=>S.biz.length>0},
 {t:'Harika gidiyorsun! Görevleri tamamla, her gün şans çarkını çevir.',end:1},
];
function renderCoach(){
  const el=$('#coach');document.querySelectorAll('nav.tabs button').forEach(b=>b.classList.remove('pulse'));
  if(!S||S.tut>=TUT.length||!started){el.hidden=true;$('#main').style.paddingBottom='';return}
  while(S.tut<TUT.length&&TUT[S.tut].done&&TUT[S.tut].done()){S.tut++;sfx('coin')}
  if(S.tut>=TUT.length){el.hidden=true;$('#main').style.paddingBottom='';return}
  const st=TUT[S.tut];
  const html=`<span class="n">${S.tut+1}</span><span>${st.t}</span>${st.end?'<button data-act="tutend">Tamam</button>':'<button data-act="tutskip">Geç</button>'}`;
  if(el.dataset.k!==String(S.tut)){el.innerHTML=html;el.dataset.k=S.tut}
  el.hidden=false;$('#main').style.paddingBottom='96px';
  if(st.tab&&curTab!==st.tab){const b=document.querySelector(`nav.tabs button[data-tab="${st.tab}"]`);b&&b.classList.add('pulse')}
}

document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act],[data-city]');if(el&&el.dataset.act==='buybiz'){}if(!el||el.closest('#splash'))return;
  if(el.classList.contains('city')&&!el.dataset.act){sfx('tap');curCity=el.dataset.city;curDist=null;render();$('#main').scrollTop=0;return}
  const id=el.dataset.id;const act=el.dataset.act;const v=el.dataset.v;
  if(!['buyparcel','dobuild','claim','bid','collect','close','spin','dailyget','veh','kamu','ipo','buybiz','upbiz'].includes(act))sfx('tap');
  switch(act){
    case 'back':curCity=null;curDist=null;render();break;
    case 'backdist':curDist=null;render();break;
    case 'dist':curDist=+id;render();$('#main').scrollTop=0;break;
    case 'parcel':parcelSheet(curCity,curDist,+id);break;
    case 'buyparcel':buyParcel(curCity,curDist,+id);break;
    case 'bizsheet':bizSheet(id);break;
    case 'buybiz':buyBiz(id,el.dataset.city);break;
    case 'upbiz':upBiz(id);break;
    case 'sellbiz':{const b=S.biz.find(x=>x.id===id);if(b&&b.state!=='dry')openSheet(`<h2>${BIZK[b.t].n} satılsın mı?</h2><p class="hint">Yatırımının %70'i, ${fmt(bizInvest(b)*0.7)} geri döner.</p><div class="row"><button class="btn primary" data-act="dosellbiz" data-id="${id}">Sat</button><button class="btn" data-act="close">Vazgeç</button></div>`);else sellBiz(id);break}
    case 'dosellbiz':sellBiz(id);break;
    case 'view':S.view=id;scene.scroll=0;scene.cars=[];scene.sel=null;render();break;
    case 'renew':acceptRenewal(el.dataset.city,id);break;
    case 'build':buildSheet(id);break;
    case 'qual':selQ=el.dataset.q;buildSheet(id);break;
    case 'dobuild':startBuild(id,el.dataset.type,selQ);break;
    case 'sellplot':{const p=S.plots.find(x=>x.id===id);openSheet(`<h2>Arsayı sat?</h2><p class="hint">${CITY[p.city].n} · ${m2(p.size)} arsa piyasa değerinin %92'sine, ${fmt(fairLand(p.city,p.size,p.dm)*0.92)}'ye satılacak.</p><div class="row"><button class="btn primary" data-act="dosellplot" data-id="${id}">Sat</button><button class="btn" data-act="close">Vazgeç</button></div>`);break}
    case 'dosellplot':sellPlot(id);break;
    case 'branch':openBranch(id);break;
    case 'list':setUnits(id,['empty'],'listing');sfx('buy');toast('Satışa çıkarıldı. Alıcılar her gün gelir.');render();break;
    case 'unlist':setUnits(id,['listing'],'empty');render();break;
    case 'rent':{const n=setUnits(id,['empty'],'rented');sfx('coin');toast(`${n} birim kiraya verildi.`,'good');render();break}
    case 'evict':setUnits(id,['rented'],'empty');render();break;
    case 'quick':quickSell(id,e);break;
    case 'sellrented':sellRented(id,e);break;
    case 'repair':repair(id);break;
    case 'rr':setRR(id,+v);break;
    case 'bid':bid();break;
    case 'kamu':bidKamu(id,+el.dataset.m);break;
    case 'loan':takeLoan(+$('#loanamt').value,+el.dataset.days,+el.dataset.rate);break;
    case 'repay':repay(id);break;
    case 'ins':toggleIns();break;
    case 'sub':sub=id;render();break;
    case 'hire':hire(id,1);break;
    case 'fire':hire(id,-1);break;
    case 'veh':buyVeh(id,+v);break;
    case 'vrent':rentVeh(id,+v);break;
    case 'mat':buyMat(id,+v);break;
    case 'matsell':sellMat(id);break;
    case 'depot':upDepot();break;
    case 'ipo':openSheet(`<h2>Halka arz</h2><p class="hint">Şirketinin %25'ini yatırımcılara satıyorsun. Kasana ${fmt(worth()*0.25*1.1)} girecek. Bundan sonra kira gelirinin %25'i her gün temettü olarak ödenir.</p><div class="row"><button class="btn primary" data-act="doipo">Gongu çal</button><button class="btn" data-act="close">Vazgeç</button></div>`);break;
    case 'doipo':doIpo();break;
    case 'buyback':buyBack();break;
    case 'shbuy':buyShares(id,+v);break;
    case 'shsell':sellShares(id);break;
    case 'office':upOffice();break;
    case 'lshape':S.logo.shape=+id;render();break;
    case 'lcol':S.logo.col=+id;render();break;
    case 'edit':scene.edit=!scene.edit;scene.sel=null;render();break;
    case 'mv':moveItem(+id);render();break;
    case 'decosheet':decoSheet();break;
    case 'buydeco':buyDeco(id);break;
    case 'rmdeco':removeDeco();break;
    case 'wheel':wheelSheet();break;
    case 'spin':spin();break;
    case 'dailyget':{const a=S.daily.pending||0;S.daily.pending=0;S.money+=a;sfx('reward');vib([20,30,20]);coinBurst(innerWidth/2,innerHeight/2,14);closeSheet();render();break}
    case 'claim':claim(id,e);break;
    case 'collect':closeSheet();sfx('cash');coinBurst(innerWidth/2,innerHeight/2,12);break;
    case 'close':if(!wheel.spinning)closeSheet();break;
    case 'settings':settingsSheet();break;
    case 'set':SET[id]=!SET[id];saveSet();if(AU.ctx){AU.sfx.gain.value=SET.sfx?1:0;AU.mus.gain.value=SET.music?0.55:0}settingsSheet();break;
    case 'rename':{const nv=$('#cname').value.trim();if(nv){S.company=nv.slice(0,24);toast('Şirket adı güncellendi.','good');renderHud()}break}
    case 'tutorial':S.tut=0;closeSheet();go('home');break;
    case 'tutskip':S.tut++;renderCoach();break;
    case 'tutend':S.tut=TUT.length;renderCoach();break;
    case 'reset':openSheet(`<h2>Baştan başla?</h2><p class="hint">Tüm ilerlemen silinir ve 10 milyon lirayla yeniden başlarsın.</p><div class="row"><button class="btn primary" data-act="doreset">Evet, sıfırla</button><button class="btn" data-act="close">Vazgeç</button></div>`);break;
    case 'doreset':newGame(S.company);save();closeSheet();curCity=null;shownMoney=null;go('home');break;
  }
});

// ---------- splash
let started=false;const splash={cars:[],last:0,items:null};
function splashItems(){return ['ev','apt','villa','kule','rez','otel','fabrika','avm'].map((t,i)=>({id:'sp'+i,type:t,done:i!==3,prog:i===3?0.62:1,q:'std'}))}
function drawSplash(now){
  const cv=$('#splashcv');if(!cv||$('#splash').hidden)return;const ctx=cv.getContext('2d');const [W,H]=fitCanvas(cv,ctx);
  const dt=splash.last?Math.min(100,now-splash.last):16;splash.last=now;
  const p=0.655+Math.sin(now/9000)*0.03;const gy=H-40;
  const n=drawSky(ctx,W,H,gy,p,'istanbul',now);
  const items=splash.items||(splash.items=splashItems());
  let total=0;items.forEach(b=>total+=spec(b).W+14);
  const s=Math.min(1.2,Math.max(0.5,W/total*1.15));
  ctx.save();ctx.translate((W-total*s)/2,gy);ctx.scale(s,s);let x=0;items.forEach(b=>{drawBuilding(ctx,b,x,0,n,now,CITY.istanbul);x+=spec(b).W+14});ctx.restore();
  drawGround(ctx,W,H,gy,n);updCars(W,gy,dt,splash.cars,4);splash.cars.forEach(c=>drawCar(ctx,c,n));
}
function renderSplash(){
  const has=load();
  $('#splashin').innerHTML=`<p class="tag">Arsadan gökdelene</p><h1 class="logo">Yapı<br><span>Baronu</span></h1>
   ${has?`<div class="card"><div class="row">${logoSvg(40)}<div class="grow"><div class="title">${esc(S.company)}</div><div class="meta">Gün ${S.day} · Seviye ${level()} · Servet ${fmt(worth())}</div></div></div></div>
      <button class="btn primary big" id="go">Devam et</button>
      <button class="btn" id="fresh">Yeni şirket kur</button>`
    :`<p class="hint">10 milyon lirayla kendi inşaat şirketini kur. İstanbul'da başla, ilçe ilçe arsa topla, ev, villa, AVM ve gökdelen dik. Petrol, tarım, enerji gibi işlere gir, New York'a kadar büyü.</p>
      <div class="field"><label class="meta" for="newname">Şirketinin adı</label><input id="newname" maxlength="24" value="Anadolu Yapı" autocomplete="off"></div>
      <button class="btn primary big" id="go">Oyuna başla</button>`}
   <p class="hint" style="font-size:11px">Sesli oynamak için telefonun sessiz modda olmasın. 1 gerçek dakika = 1 oyun günü.</p>`;
  $('#go').onclick=()=>{
    audioInit();sfx('level');
    if(!has){newGame(($('#newname').value||'').trim().slice(0,24)||'Anadolu Yapı');save()}
    $('#splash').hidden=true;started=true;
    curTab='home';shownMoney=null;render();
    const off=has&&offlineCatchup();
    if(off)queue.push(()=>checkDaily());else if(has)checkDaily();
    else S.daily.last=today(); // first day: no reward popup over tutorial
  };
  const f=$('#fresh');if(f)f.onclick=()=>{try{localStorage.removeItem(SAVE_KEY)}catch(e){}S=null;audioInit();sfx('tap');renderSplash()};
}
document.addEventListener('pointerdown',()=>{if(AU.ctx&&AU.ctx.state==='suspended')AU.ctx.resume()},{passive:true});

// ---------- loops
function frame(now){
  if(!$('#splash').hidden)drawSplash(now);
  else if(started&&curTab==='sehir'&&!document.hidden)drawScene(now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
let last=performance.now(),acc=0;
setInterval(()=>{
  const now=performance.now(),dt=Math.min(now-last,5000);last=now;if(!started||!S)return;
  tick(dt);acc+=dt;
  const live=curTab==='proj'||curTab==='auction'||(curTab==='borsa'&&acc>=3000)||((curTab==='home'||curTab==='sehir')&&acc>=3000)||(curTab==='land'&&acc>=4000);
  if(acc>=4000)acc=0;
  if(live&&$('#sheet').hidden&&!document.activeElement?.matches('input,select')&&!scene.drag)render();else renderHud();
},1000);
setInterval(()=>{if(started)save()},5000);
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){if(started)save();AU.ctx&&AU.ctx.suspend()}
  else{last=performance.now();AU.ctx&&AU.ctx.resume();if(started){if($('#sheet').hidden)offlineCatchup();render()}}
});
window.addEventListener('pagehide',()=>{if(started)save()});
window.__S=()=>S;
// landscape prompt
(function(){const r=$('#rotate');let skip=false;try{skip=sessionStorage.getItem('yb.rot')==='1'}catch(e){}
  const upd=()=>{const narrow=Math.min(innerWidth,innerHeight)<600;r.hidden=skip||!narrow||innerWidth>innerHeight;};
  $('#rotskip').onclick=()=>{skip=true;try{sessionStorage.setItem('yb.rot','1')}catch(e){}upd()};
  addEventListener('resize',upd);upd();
  try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{})}catch(e){}
})();
