# SIZINTI / 3B dijital masa

Three.js ile 20 düğümlü 3B tahta, döndürülebilir kamera ve CSS 3B flip kartları. Standart oyun kuralları SIZINTI.txt üzerinden uygulanmıştır.

## Başlat

Bu klasörde `npm install`, ardından `npm run dev -- --port 5174` çalıştır. Tarayıcıda http://localhost:5174 adresini aç. Hazır bağımlılıklar varsa BASLAT.cmd dosyasına çift tıklayabilirsin.

4–8 kişi aynı ekranı sırayla paylaşır. Kart dağıtımında diğer oyuncular bakmamalı. Soru ve cevaplar yüz yüze verilir. Bu sürümde bot veya çevrimiçi oda yoktur. Standart mod: 1 Sızıntı, 4 tur, 8 dakika. Menüden kısa test süreleri seçilebilir. Tarama oyun boyunca bir kez, alarm her tur bir kez kullanılabilir. Oylamalar sırayla gizlice girilir. Son taramada salt çoğunluk gerekir, eşitlik Sızıntı lehinedir. Sayfa yenilenirse masa sıfırlanır.

`npm test`: dağıtım, puan ve çoğunluk kontrolleri. `npm run build`: dist klasörüne derler. Chrome/Edge gibi WebGL destekli güncel tarayıcı gerekir; WebGL yoksa konum listesiyle oyun devam eder. Fontlar yüklenemezse sistem fontları kullanılır.

Çaylak ve Usta/Glitch modları bu prototipte uygulanmamıştır. Standart mod masa testi için tamamlanmıştır. İlham: Spyfall, Alexandr Ushan (2014).

## Görsel masa revizyonu

- Referans `harita_konsept.png`: Boğaz çevresinde dört bölge, neon yollar ve 20 farklı modellenmiş konum. Gemi, drone, kuantum kubbesi, OMNİ kulesi, metro ve sunucu istasyonları ayrı 3B minyatürlerdir.
- Tur sonucu: gerçek konum açılır, kamera yaklaşır, ışık sütunu ve yayılan halkalar yanar. Ajan galibiyetinde camgöbeği, Sızıntı galibiyetinde pembe. Yeni turda sonuç vurgusu temizlenir; yeni gizli konum açığa çıkmaz.
- Orijinal ajan/Sızıntı çerçeveleri ve kart sırtı doğrudan kullanılır. Seçili konumda orijinal neon konum simgesi gösterilir.
- Referans karakterlerden esinlenen 8 stilize 3B operatif: Netrunner, Drone Kuryesi, Aşçı Android, Siber Sağlıkçı, Ağ Muhafızı, Sokak Satıcısı, Maskeli Operatif, Neon DJ. Bunlar kodla modellenmiş hareketli minyatürlerdir; referans çizimlerin birebir gerçekçi 3B taramaları değildir.
- Oyuncu sırası, kart dağıtımı ve oylamada ilgili oyuncunun figürü belirir. Kart içindeki ve harita yanındaki figür sürüklenerek döndürülebilir. Figür koltuğa bağlıdır, gizli Ajan/Sızıntı rolüne bağlı değildir.
- `Haritayı büyüt` ile sahne büyür; aynı düğme veya Escape ile masaya dönülür. Ana menüde `Işık efektini dene`, seçili konumda sonuç efektini oyun başlatmadan gösterir.
- Görsel doğrulama: sekiz oyuncuya kart dağıtma, karakter değişimi, doğru konum tahmininde pembe vurgu, doğru alarmda camgöbeği vurgu ve yeni turda sıfırlama tarayıcıda denendi.

## Çip kasası ve karakter kadrajı

Karakter alanı genişletildi. Portre kamerası her boyut değişiminde hem dikey hem yatay görüş alanına göre uzaklığı hesaplar; platform ve ekipmanlar için kenar boşluğu bırakır. Aynı kadraj hesabı gizli karttaki model için de geçerlidir.

Oyun başlığında lider/puan özeti ve sıralamaya bağlantı, karakter yanında oyuncunun toplam çipi gösterilir. Haritanın altında sürekli Çip Kasası bulunur: puana göre sıralama, ortak dereceler, görsel çipler, son tur kazançları ve tur geçmişi. Tur raporu kazançları kişi başına ve toplam olarak açıklar. Dördüncü turun sonunda kesin sıralama ve ortak kazananlar gösterilir. Çip simgesi prototip görsellerindeki jeton_veri_cipi.png dosyasından alınır.

Doğrulama: 6 kural/sıralama testi; tarayıcıda 4 turun tamamı, 16 çipin doğru dağıtımı, puanların turlar arasında korunması ve final lideri; telefon genişliğinde taşma kontrolü.

## Drone ve sol kasa paneli

1250 piksel üzerindeki ekranlarda Çip Kasası haritanın solunda, oyun kontrol panelinin karşısında tek sütun olarak gösterilir. İki yan panel ve harita üst-alt kenarlarda hizalıdır; iç kaydırma yoktur. Daha dar ekranlarda kasa alt sıraya geçer. Harita kamerası yeni en-boy oranına göre tüm tahta köşelerini kadraja alır.

Sonuç ışığının tepesinde dönen pervaneleri, koruyucu halkaları ve aşağı bakan projektörü olan bir 3B drone bulunur. Drone ışık sütunuyla birlikte hafifçe süzülür; Ajan sonucunda camgöbeği, Sızıntı sonucunda pembe yanar. Yeni tur başladığında drone ve ışık birlikte gizlenir. Azaltılmış hareket tercihinde pervane/hover animasyonları durur.
