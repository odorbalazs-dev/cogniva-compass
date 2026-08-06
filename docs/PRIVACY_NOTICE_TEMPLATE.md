# Cogniva Compass adatkezelési tájékoztató — DRAFT SABLON

> **DRAFT — NEM PUBLIKÁLHATÓ, NEM JOGI JÓVÁHAGYÁS.**
>
> Ez a dokumentum technikai és tartalmi munkasablon. Az adatkezelőnek a tényleges működés, szerződések, célországok és nemzeti szabályok alapján adatvédelmi szakjogásszal kell véglegesítenie. A `{{...}}` helyőrzők kitöltéséig, a dokumentum verziójának rögzítéséig és mind a 11 nyelv független jogi szakfordításáig az éles adatgyűjtés és fizetés nem engedélyezhető.

Dokumentumállapot: `DRAFT`<br>
Sablonverzió: `2026-07-31-draft-v1`<br>
Tervezett hatálybalépés: `{{POLICY_EFFECTIVE_DATE — KÖTELEZŐ}}`<br>
Adatkezelési tájékoztató verziója: `{{PRIVACY_POLICY_VERSION — KÖTELEZŐ}}`<br>
Jóváhagyó neve/szerepe: `{{APPROVER_NAME_AND_ROLE — KÖTELEZŐ}}`<br>
Jóváhagyás dátuma: `{{APPROVAL_DATE — KÖTELEZŐ}}`
Publikált, változtathatatlan dokumentum SHA-256: `{{PRIVACY_DOCUMENT_SHA256 — KÖTELEZŐ}}`

## 1. Az adatkezelő és elérhetőségei

| Adat | Kitöltendő érték |
| --- | --- |
| Adatkezelő teljes jogi neve | `{{CONTROLLER_LEGAL_NAME — KÖTELEZŐ}}` |
| Bejegyzett székhely | `{{CONTROLLER_REGISTERED_ADDRESS — KÖTELEZŐ}}` |
| Levelezési cím, ha eltér | `{{CONTROLLER_POSTAL_ADDRESS — KÖTELEZŐ VAGY „AZONOS”}}` |
| Bejegyzés országa | `{{CONTROLLER_COUNTRY — KÖTELEZŐ}}` |
| Cégjegyzék-/nyilvántartási szám | `{{CONTROLLER_REGISTRATION_NUMBER — KÖTELEZŐ, HA ALKALMAZANDÓ}}` |
| Adószám / közösségi adószám | `{{CONTROLLER_TAX_AND_VAT_NUMBER — KÖTELEZŐ, HA ALKALMAZANDÓ}}` |
| Általános kapcsolattartás | `{{SUPPORT_EMAIL — KÖTELEZŐ}}` |
| Adatvédelmi kérelmek | `{{PRIVACY_EMAIL — KÖTELEZŐ}}` |
| Adatvédelmi tisztviselő | `{{DPO_NAME_AND_EMAIL — TÖLTENDŐ VAGY INDOKOLT „NEM KÖTELEZŐ” DÖNTÉS}}` |
| EGT-képviselő | `{{EEA_REPRESENTATIVE — TÖLTENDŐ, HA ALKALMAZANDÓ}}` |

Az adatkezelő határozza meg a Cogniva Compass működéséhez kapcsolódó személyesadat-kezelés céljait és lényeges eszközeit. A szolgáltatás felnőtteknek szóló oktatási önreflexió. Nem egészségügyi szolgáltatás, nem standardizált IQ- vagy EQ-teszt, nem diagnosztikai vagy szűrőeszköz.

## 2. A szolgáltatás és az adatkezelés rövid áttekintése

1. A látogató kiválasztja a nyelvet és a kognitív feladatmintát vagy az érzelmi önreflexiót.
2. A kérdőív megkezdése előtt kétlépcsős, a kiválasztott nyelven megjelenő tájékoztatást kap:
   - használati feltételek, felnőttkor és nem diagnosztikai korlátok;
   - adatkezelési tájékoztatás és — ahol szükséges — a különleges adatokra adott kifejezett hozzájárulás.
3. Az ingyenes kitöltés és az azonnali pillanatkép alapvetően a böngészőben történik.
4. A válaszok csak akkor kerülnek a Cogniva szerverére, ha a kitöltő a végén külön fizetős riportot választ és a checkout-feltételeket elfogadja.
5. A szerver a verziózott kérdésbankból újraellenőrzi és újrapontozza a választ. A nyers tételválaszokat nem menti el az adatbázisba.
6. A fizetést a Stripe kezeli. A riportot a rendszer determinisztikus sablonból, vagy külön opcionális hozzájárulás esetén adatminimalizált OpenAI-szövegezéssel készíti el. Az emailt a Resend kézbesíti.

## 3. Milyen adatokat kezelünk?

### 3.1. A landing oldal és az ingyenes önreflexió

- nyelvválasztás;
- a kiválasztott kérdőívtípus;
- a korábban megjelenített tételazonosítók az ismétlődés csökkentéséhez;
- az aktív kérdőív azonosítója és tételazonosítói;
- a kitöltés közben, a böngésző memóriájában lévő válaszok;
- a böngésző által a Webflow- és Railway-kiszolgálóknak automatikusan átadott alapvető hálózati és biztonsági adatok, például IP-cím, időpont, kért erőforrás és technikai fejléc — a tényleges naplózási beállítást és időtartamot a szolgáltatóknál ellenőrizni kell;
- a kérdőív előtti jogi választás bizonylata: véletlen azonosító, nyelv, hatókör, a lokalizált consent-szöveg verziója, elfogadott dokumentumverziók és -hash-ek, választások, szerveroldali időpont és visszavonási állapot.

Az ingyenes kitöltéshez nem kérünk nevet, születési dátumot, lakcímet, nemet, munkahelyet, oktatási intézményt vagy szabad szöveges egészségügyi leírást.

### 3.2. Helyi böngészőtárolás

| Tárolás | Tartalom | Tervezett időtartam | Megjegyzés |
| --- | --- | --- | --- |
| `localStorage` | választott nyelv | `{{LANGUAGE_STORAGE_RETENTION — KÖTELEZŐ}}` | A felhasználó böngészőjében |
| `localStorage` | korábban látott tételazonosítók | `{{ITEM_HISTORY_RETENTION — KÖTELEZŐ}}` | Nem tartalmaz választ vagy eredményt |
| `sessionStorage` | aktív form azonosító és tételazonosítók | böngészőlap/munkamenet végéig | Nem tartalmaz választ |
| JavaScript-memória | folyamatban lévő válaszok és képernyőeredmény | lap bezárásáig vagy újrakezdésig | Szerverre csak fizetős riport választásakor kerül |
| `sessionStorage` | checkout-visszaállítási másolat, benne a kitöltés | legfeljebb 1 óra | Csak közvetlenül Stripe-átirányítás előtt; siker, felhasználás vagy lejárat után törlendő |

Az eszközön történő tárolás elektronikus hírközlési jogi besorolását és a „feltétlenül szükséges” kivétel alkalmazhatóságát célországonként ellenőrizni kell. Az opcionális analitika nem kezelhető feltétlenül szükségesként.

### 3.3. Fizetős riport választásakor

- email-cím és annak megerősítő második bevitele;
- választott nyelv és csomag (`single_v1` vagy `bundle_v1`);
- kiválasztott kérdőívtípus vagy kérdőívtípusok;
- form-, kérdésbank-, pontozási és riportverzió;
- a kérdésazonosító és válasz párok a kérés feldolgozásának idejére;
- a szerver által újraszámolt négy területi összegzés kérdőívenként;
- a generált riport tartalma és forrása (`template` vagy külön hozzájárulás esetén `openai`);
- rendelési, hozzáférési és idempotencia-azonosítók;
- termékkód, összeg, deviza, adózási jelölés és fizetési állapot;
- Stripe checkout-, payment-intent- és charge-azonosítók;
- email-kézbesítési azonosító és kézbesítési/bounce/panasz állapot;
- jogi elfogadási bizonylat és az elfogadott dokumentumok verziója/hash-e;
- létrehozási, fizetési, riport-, kézbesítési, visszatérítési, vitatási, lejárati és törlési időpontok;
- biztonsági és hibakategória-adatok, személyes válaszok és email naplózása nélkül.

A Cogniva nem kapja meg és nem tárolja a teljes bankkártyaszámot vagy CVC-kódot. A Stripe által kért számlázási adatok körét a checkout tényleges beállítása és a Stripe saját tájékoztatója alapján kell feltüntetni.

## 4. Célok és javasolt jogalapok

> **JOGI DÖNTÉS SZÜKSÉGES.** Az alábbi mátrix tervezett modell, nem végleges jogalap-jóváhagyás. A 6. és 9. cikk szerinti jogalapokat célonként, az adatkezelés megkezdése előtt kell dokumentálni.

| Cél | Adatok | Tervezett GDPR-jogalap | Kötelező előfeltétel |
| --- | --- | --- | --- |
| Ingyenes önreflexiós pillanatkép | böngészőben kezelt válaszok és profil | 6. cikk (1) a) hozzájárulás; ha különleges adat: 9. cikk (2) a) kifejezett hozzájárulás | külön, nem előre bejelölt választás és visszavonhatóság |
| Hozzájárulás bizonyítása | consent receipt, verziók, hash-ek, időpont | `{{LEGAL_BASIS_FOR_CONSENT_EVIDENCE — JOGÁSZ ÁLTAL RÖGZÍTENDŐ}}` | adatminimalizálás és külön megőrzési idő |
| Rendelés, szerveres pontozás, riport és kézbesítés | email, csomag, szerveres összegzések, riport, státuszok | 6. cikk (1) b) szerződés | csak a szolgáltatáshoz szükséges adatok |
| Érzékeny kognitív/érzelmi profil fizetős feldolgozása | válaszok, területi összegzések, riport | 9. cikk (2) a) kifejezett hozzájárulás, a 6. cikk szerinti külön alappal együtt | megtagadáskor nincs szerveres riport; az ingyenes helyi eredmény elérhető marad |
| Fizetés, számlázás, adó és kötelező nyilvántartás | rendelési és tranzakciós adatok | 6. cikk (1) b), illetve 6. cikk (1) c) | pontos nemzeti/EU-kötelezettség és időtartam kitöltendő |
| Csalásmegelőzés, rendszerbiztonság, jogi igény | korlátozott technikai és tranzakciós adatok | 6. cikk (1) f) jogos érdek | dokumentált érdekmérlegelési teszt (`{{LIA_VERSION}}`) |
| Opcionális használati analitika | kizárólag jóváhagyott események | 6. cikk (1) a) és alkalmazandó ePrivacy-hozzájárulás | alapból kikapcsolva; nincs válasz, track, score, email, order vagy fizetési adat |
| Opcionális OpenAI-szövegezés | nyelv, track, négy szerveres összegzés és verziók | `{{OPENAI_ARTICLE_6_BASIS — RÖGZÍTENDŐ}}`; különleges adatnál 9. cikk (2) a) | külön, opcionális, alapból kikapcsolt hozzájárulás; determinisztikus alternatíva |

Az adatkezelő nem támaszkodhat általános, összecsomagolt „adatvédelmi szabályzat elfogadására” minden cél jogalapjaként. A szerződéshez, jogi kötelezettséghez vagy jogos érdekhez szükséges adatkezelést nem szabad hozzájárulásként feltüntetni.

## 5. Különleges személyes adatok

A kognitív és érzelmi válaszok, illetve a belőlük képzett leíró mintázatok közvetlenül vagy közvetve utalhatnak a kitöltő mentális állapotára. Az adatkezelő ezért a végleges jogi minősítésig konzervatívan különleges adatként kezeli őket.

A kifejezett hozzájárulásnak:

- önkéntesnek, konkrétnak, megfelelő tájékoztatáson alapulónak és egyértelműnek kell lennie;
- külön, pozitív nyilatkozattal kell megtörténnie;
- nem lehet előre bejelölve vagy az opcionális analitikával/AI-jal összecsomagolva;
- meg kell neveznie a célt, az adatkört és a visszavonás módját;
- verziózott, szerveroldali időponttal ellátott bizonyítékot kell képeznie;
- visszavonásakor meg kell állítani a hozzájáruláson alapuló jövőbeni feldolgozást, miközben a kötelezően megőrzendő tranzakciós adatokat elkülönítve és korlátozva kell kezelni.

## 6. Automatizált feldolgozás és profilalkotás

A kérdések kiválasztása, pontozása és a leíró profil összeállítása automatizált. A jelenlegi módszer:

- egy 250 tételes, verziózott bankból szabályok szerint 20 kognitív vagy 24 érzelmi tételt választ;
- a kognitív feladatoknál helyes válaszok, az érzelmi önreflexiónál irányhelyesbített válaszok alapján négy területi összegzést képez;
- nem használ népességi normát, percentilist, IQ-/EQ-értéket, diagnosztikai küszöböt vagy klinikai kategóriát;
- az eredményt bizonytalan, kontextusfüggő pillanatképként mutatja be;
- nem hoz joghatással vagy hasonlóan jelentős hatással járó döntést.

Az eredmény nem használható munkáltatási, oktatási felvételi, biztosítási, hitelezési, egészségügyi vagy más jelentős döntés automatizált vagy kizárólagos alapjaként. Ha a tényleges termékhasználat vagy üzleti modell ettől eltér, új DPIA, új jogalap- és GDPR 22. cikk szerinti vizsgálat szükséges.

## 7. Opcionális OpenAI-szövegezés

Az OpenAI nem pontoz és nem módosítja a szerver által számított értékeket. Csak külön, alapból kikapcsolt választás esetén kaphatja meg:

- a kiválasztott nyelvet;
- a kérdőívtípust;
- kérdőívenként a négy területi összegzést;
- a bank-, pontozási és riportverziót;
- egy véletlenből képzett, nem visszafejthető safety identifier értéket.

Nem kaphat nevet, emailt, fizetési adatot, nyers választ vagy kérdésszöveget. A konkrét OpenAI-entitást, modellt, régiót, megőrzési beállítást, DPA-t, alfeldolgozókat, adattovábbítási mechanizmust és transfer impact assessmentet a publikálás előtt ki kell tölteni:

- OpenAI szerződő fél: `{{OPENAI_CONTRACTING_ENTITY — KÖTELEZŐ, HA ENGEDÉLYEZETT}}`
- jóváhagyott modell: `{{OPENAI_MODEL_ID — KÖTELEZŐ, HA ENGEDÉLYEZETT}}`
- adatmegőrzési beállítás: `{{OPENAI_RETENTION_CONFIGURATION — KÖTELEZŐ}}`
- DPA verzió/dátum: `{{OPENAI_DPA_REFERENCE — KÖTELEZŐ}}`
- adattovábbítási alap és TIA: `{{OPENAI_TRANSFER_MECHANISM_AND_TIA — KÖTELEZŐ}}`

Az AI elutasítása nem akadályozhatja a vásárlást: ilyenkor a jóváhagyott determinisztikus lokalizált riportot kell biztosítani.

## 8. Címzettek és szolgáltatók

> A szerepkörök nem feltételezhetők pusztán a szolgáltató neve alapján. A tényleges szerződés és adatfolyam szerint kell rögzíteni, hogy az adott fél adatfeldolgozó, önálló vagy közös adatkezelő-e.

| Szolgáltató | Tervezett feladat | Átadott adatok | Szerep/DPA/régió — kitöltendő |
| --- | --- | --- | --- |
| Webflow | landing és host shell | alap HTTP-adatok; kérdőívválasz nem kerülhet Webflow formba | `{{WEBFLOW_ROLE_DPA_REGION}}` |
| Railway | alkalmazás, PostgreSQL és futtatás | rendelés, consent, összegzés, riport és műveleti állapot | `{{RAILWAY_ROLE_DPA_REGION}}` |
| Stripe | checkout és fizetés | email a Stripe-konfiguráció szerint, összeg/deviza, opaque order ID; nincs válasz vagy score metadata | `{{STRIPE_ROLE_DPA_REGION}}` |
| Resend | tranzakciós email | email, lokalizált riport és opaque order tag | `{{RESEND_ROLE_DPA_REGION}}` |
| OpenAI | opcionális szövegezés | kizárólag a 7. pontban leírt minimalizált adatok | `{{OPENAI_ROLE_DPA_REGION}}` |
| `{{INVOICE_PROVIDER}}` | számlázás | `{{INVOICE_DATA_CATEGORIES}}` | `{{INVOICE_PROVIDER_ROLE_DPA_REGION}}` |
| `{{MONITORING_PROVIDER}}` | rendelkezésre állás/biztonság | `{{MONITORING_DATA_CATEGORIES}}` | `{{MONITORING_ROLE_DPA_REGION}}` |

Személyes adat csak jogszabály, hatósági/bírósági kötelezés vagy jogi igény alapján adható át hatóságnak, bíróságnak, jogi képviselőnek vagy auditor számára, a szükséges mértékben.

## 9. EGT-n kívüli adattovábbítás

Az élesítés előtt szolgáltatónként dokumentálni kell:

- a tényleges adatkezelési és tárolási országokat;
- az esetleges megfelelőségi határozatot;
- ennek hiányában az általános szerződési feltételeket vagy más GDPR 46. cikk szerinti garanciát;
- a transfer impact assessmentet;
- a kiegészítő technikai és szervezési intézkedéseket;
- az alfeldolgozók listáját és változásközlési mechanizmusát.

Adattovábbítási nyilvántartás verziója: `{{TRANSFER_REGISTER_VERSION — KÖTELEZŐ}}`
Legutóbbi felülvizsgálat: `{{TRANSFER_REVIEW_DATE — KÖTELEZŐ}}`

## 10. Megőrzési idők

> Az alábbi részben a jelenlegi technikai alapértékek és kitöltendő jogi döntések egyaránt szerepelnek. A publikált tájékoztató csak a ténylegesen beállított és tesztelt időket tartalmazhatja.

| Adatkör | Tervezett megőrzés | Döntés/jogcím |
| --- | --- | --- |
| Folyamatban lévő válaszok böngészőmemóriában | lap bezárásáig, kilépésig vagy eredményképzésig | technikai szükségesség |
| Checkout-visszaállítás sessionStorage-ban | legfeljebb 1 óra | felhasználó által kért visszaállítás |
| Sikertelen/nem fizetett rendelés | jelenlegi technikai terv: legfeljebb 2 nap | `{{APPROVE_OR_REPLACE}}` |
| Email, domain-összegzés és riport | jelenlegi alapérték: 30 nap | `{{REPORT_RETENTION_APPROVAL — KÖTELEZŐ}}` |
| Provider webhook eseményazonosítók | jelenlegi technikai terv: 90 nap | idempotencia és hibavizsgálat; `{{APPROVE_OR_REPLACE}}` |
| Consent proof és dokumentumhash | `{{CONSENT_EVIDENCE_RETENTION — KÖTELEZŐ}}` | megfelelőség/jogi igény; az eredményadatoktól külön |
| Számviteli és számlaadatok | `{{ACCOUNTING_RETENTION_PERIOD_AND_LAW — KÖTELEZŐ}}` | jogi kötelezettség |
| Visszatérítés/vita/jogi igény adatai | `{{CLAIMS_RETENTION_PERIOD — KÖTELEZŐ}}` | jogi igény és kötelezettség |
| Biztonsági naplók | `{{SECURITY_LOG_RETENTION — KÖTELEZŐ}}` | érdekmérlegeléssel |
| Biztonsági mentések | `{{BACKUP_RETENTION_AND_PURGE — KÖTELEZŐ}}` | helyreállítás, elkülönített hozzáférés |

A jelenlegi lejárati folyamat az emailt szintetikus címre cseréli, a pontszámokat és riportot törli, de egyes rendelési, consent- és szolgáltatói azonosítókat megtart. Ez **pszeudonimizálás és szelektív törlés, nem anonimizálás**. Minden megmaradó mezőhöz külön célt és végső törlési időt kell rendelni.

## 11. Biztonság

A tervezett intézkedések:

- TLS az adatátvitel során;
- adatminimalizált requestek és provider metadata;
- nyers válaszok adatbázisba mentésének tiltása;
- magas entrópiájú rendelési és consent-tokenek, csak hash-elt szerveroldali tárolással;
- aláírt Stripe- és Resend-webhookok és idempotens feldolgozás;
- adatbázis-queue lease, retry és backoff;
- környezeti változóban tárolt titkok, kulcsrotációs eljárás;
- szerepköralapú dashboard-hozzáférés, MFA, munkamenet-védelem és auditnapló — `{{ADMIN_CONTROL_STATUS — KÖTELEZŐ}}`;
- válasz, score, email és riport kizárása alkalmazás-, analytics- és hibakeresési naplókból;
- sebezhetőségvizsgálat, függőségaudit, mentés-visszaállítási és incidensgyakorlat;
- dokumentált adatvédelmi incidenskezelés és szükség szerinti hatósági/érintetti értesítés.

Abszolút biztonság nem garantálható. Biztonsági kapcsolat: `{{SECURITY_CONTACT — KÖTELEZŐ}}`.

## 12. Az érintett jogai

Az alkalmazandó feltételek és kivételek mellett kérhető:

- tájékoztatás és hozzáférés;
- helyesbítés;
- törlés;
- az adatkezelés korlátozása;
- adathordozhatóság, ha annak feltételei fennállnak;
- tiltakozás a jogos érdeken alapuló adatkezelés ellen;
- a hozzájárulás visszavonása a jövőre nézve;
- emberi kapcsolatfelvétel, magyarázat és panaszkezelés az automatizált profil kapcsán.

Kérelem benyújtása: `{{PRIVACY_REQUEST_URL_OR_EMAIL — KÖTELEZŐ}}`<br>
Azonosítás módja: `{{DATA_SUBJECT_VERIFICATION_METHOD — KÖTELEZŐ; NE KÉRJEN TÚLZOTT ADATOT}}`
Válaszadási folyamat és felelős: `{{DSR_OWNER_AND_RUNBOOK — KÖTELEZŐ}}`

A hozzájárulás visszavonása nem érinti a visszavonás előtti adatkezelés jogszerűségét. Nem eredményezi automatikusan azoknak az adatoknak a törlését, amelyeket az adatkezelő jogi kötelezettség vagy jogi igény miatt köteles elkülönítve megőrizni.

## 13. Kötelező és opcionális adatok

- A landing megtekintéséhez és az ingyenes helyi önreflexióhoz nem szükséges email vagy fizetési adat.
- A felnőttkor, a saját válaszadás, a nem diagnosztikai korlátok és a feltételek elfogadása a kérdőív megkezdésének feltétele.
- Ha a profil különleges adatnak minősül, a kifejezett hozzájárulás nélkül a profil nem dolgozható fel.
- A fizetős riporthoz szükséges az email, a kiválasztott csomaghoz tartozó kitöltés, a szerződéses adatkezelés és a checkout jogi nyilatkozatai.
- Az analitika és az OpenAI-szövegezés opcionális; elutasításuk nem csökkentheti a megvásárolható determinisztikus riport tartalmát.
- Marketing-hozzájárulás nem része a rendelésnek. Ha később marketing indul, külön, célhoz kötött, visszavonható opt-in és külön nyilvántartás szükséges.

## 14. Panasz és jogorvoslat

Elsőként kérjük, vedd fel velünk a kapcsolatot: `{{PRIVACY_EMAIL — KÖTELEZŐ}}`.

Jogosult vagy panaszt tenni különösen a szokásos tartózkodási helyed, munkahelyed vagy a feltételezett jogsértés helye szerinti EGT-felügyeleti hatóságnál, továbbá bírósági jogorvoslatot igénybe venni.

| Adat | Kitöltendő érték |
| --- | --- |
| Elsődlegesen feltüntetett felügyeleti hatóság | `{{SUPERVISORY_AUTHORITY_NAME — KÖTELEZŐ}}` |
| Cím | `{{SUPERVISORY_AUTHORITY_ADDRESS — KÖTELEZŐ}}` |
| Honlap/panaszoldal | `{{SUPERVISORY_AUTHORITY_URL — KÖTELEZŐ}}` |
| Email/telefon | `{{SUPERVISORY_AUTHORITY_CONTACT — KÖTELEZŐ}}` |

## 15. Gyermekek és más személyek adatai

A Cogniva Compass kizárólag 18 éven felüli személy saját önreflexiójára szolgál. Nem kérünk és nem engedünk más személyre, gyermekre, munkavállalóra, tanulóra vagy pályázóra vonatkozó kitöltést. Ha tudomásunkra jut, hogy ilyen adat került a rendszerbe, a dokumentált incidens- és törlési eljárás szerint járunk el: `{{MISDIRECTED_DATA_RUNBOOK — KÖTELEZŐ}}`.

## 16. Analitika és külső követés

Az opcionális analitika alapértelmezetten kikapcsolt. A nem szükséges tag vagy SDK nem tölthető be, és nem írhat/olvashat eszköztárolót az érvényes hozzájárulás előtt. A consent-default beállításnak minden analytics/tag manager script előtt kell lefutnia.

Az engedélyezett analytics eseményséma: `{{ANALYTICS_SCHEMA_VERSION — KÖTELEZŐ}}`<br>
Engedélyezett mezők: `{{ANALYTICS_ALLOWLIST — KÖTELEZŐ}}`
Tiltott adatok: kérdés- vagy válaszazonosító, válasz, track, form, score, domain, riport, email, rendelés-/fizetésazonosító, consent-token és szabad szöveg.

Hirdetési profilalkotás, remarketing és hasonmás közönség építése kérdőív- vagy eredményadatból tilos.

## 17. A tájékoztató módosítása

Lényeges cél-, jogalap-, adatkör-, címzett-, továbbítási, AI-, megőrzési vagy automatizálási változás előtt:

1. frissíteni kell a DPIA-t és a feldolgozási nyilvántartást;
2. új dokumentumverziót és SHA-256 hash-t kell létrehozni;
3. el kell végezni a 11 nyelv független jogi szakfordítását és ellenőrzését;
4. ahol szükséges, új hozzájárulást kell kérni;
5. a korábbi consent-bizonylatot nem szabad utólag az új szöveghez rendelni.

## 18. Publikálás előtti kötelező ellenőrzőlista

- [ ] Minden `{{...}}` helyőrző kitöltve vagy dokumentáltan nem alkalmazandó.
- [ ] Az adatkezelő és kereskedő jogi személye egyezik a checkoutban és számlán.
- [ ] A tényleges adatfolyam, logok, provider metadata és browser storage ellenőrizve.
- [ ] A jogalap- és különlegesadat-döntést szakjogász jóváhagyta.
- [ ] A DPIA, LIA, ROPA, DPA/SCC/TIA és alfeldolgozói nyilvántartás lezárva.
- [ ] Megőrzés és törlés adatbázison, backupban és minden szolgáltatónál tesztelve.
- [ ] Érintetti kérelem és incidensfolyamat próbája sikeres.
- [ ] Analytics consent-before-tags és tiltott mezők automatizált tesztje sikeres.
- [ ] Mind a 11 nyelv teljes, jogilag szaklektorált; arab RTL; nincs angol fallback.
- [ ] A közzétett fájl hash-e egyezik a consent receiptben tárolt hash-sel.
- [ ] A dokumentum már nem viseli a `DRAFT` jelölést, és a jóváhagyás bizonyítéka archiválva van.

## Hivatalos jogi támpontok

- [GDPR — EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng)
- [Európai Bizottság — az érintettek tájékoztatása és jogai](https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en)
- [Európai Bizottság — adatkezelési jogalapok](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/legal-grounds-processing-data_en)
- [EDPB — megfelelés és DPIA](https://www.edpb.europa.eu/sme-data-protection-guide/be-compliant_en)
- [NAIH — GDPR 35. cikk (4) szerinti kötelező DPIA-lista](https://www.naih.hu/data-protection/gdpr-35-4-mandatory-dpia-list)
