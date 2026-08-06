# Cogniva Compass adatvédelmi hatásvizsgálat (DPIA) — DRAFT

> **DRAFT — NEM JOGI JÓVÁHAGYÁS ÉS NEM ÉLESÍTÉSI ENGEDÉLY.**
>
> A „DIPA” helyett a GDPR-ban használt helyes rövidítés: **DPIA** (Data Protection Impact Assessment, adatvédelmi hatásvizsgálat). Ez a dokumentum előzetes technikai hatásvizsgálat. Az adatkezelő, a tényleges szolgáltatói szerződések, a célországok, az adatvédelmi tisztviselő — ha van — és szakjogász bevonásával kell lezárni. A `{{...}}` helyőrzők kitöltéséig a dokumentum nem tekinthető befejezettnek.

## 1. Dokumentumvezérlés

| Mező | Érték |
| --- | --- |
| DPIA azonosító | `{{DPIA_ID — KÖTELEZŐ}}` |
| Verzió | `2026-07-31-draft-v1` |
| Állapot | `DRAFT / OPEN` |
| Adatkezelő | `{{CONTROLLER_LEGAL_NAME — KÖTELEZŐ}}` |
| Felelős üzleti tulajdonos | `{{BUSINESS_OWNER — KÖTELEZŐ}}` |
| Technikai tulajdonos | `{{TECHNICAL_OWNER — KÖTELEZŐ}}` |
| Adatvédelmi felelős / DPO | `{{PRIVACY_OWNER_OR_DPO — KÖTELEZŐ}}` |
| Jogi felülvizsgáló | `{{LEGAL_REVIEWER — KÖTELEZŐ}}` |
| Biztonsági felülvizsgáló | `{{SECURITY_REVIEWER — KÖTELEZŐ}}` |
| Első értékelés dátuma | `{{ASSESSMENT_DATE — KÖTELEZŐ}}` |
| Következő kötelező felülvizsgálat | `{{NEXT_REVIEW_DATE — KÖTELEZŐ}}` |
| Kapcsolódó privacy notice | `{{PRIVACY_POLICY_VERSION_AND_SHA256 — KÖTELEZŐ}}` |
| Kapcsolódó terms | `{{TERMS_VERSION_AND_SHA256 — KÖTELEZŐ}}` |
| ROPA / LIA hivatkozás | `{{ROPA_AND_LIA_REFERENCES — KÖTELEZŐ}}` |

### Jóváhagyások

| Szerep | Név | Döntés | Dátum | Aláírás/bizonyíték |
| --- | --- | --- | --- | --- |
| Adatkezelő képviselője | `{{NAME}}` | `{{APPROVED / REJECTED / CONDITIONAL}}` | `{{DATE}}` | `{{REFERENCE}}` |
| DPO/adatvédelmi felelős | `{{NAME}}` | `{{OPINION}}` | `{{DATE}}` | `{{REFERENCE}}` |
| Jogi felülvizsgáló | `{{NAME}}` | `{{OPINION}}` | `{{DATE}}` | `{{REFERENCE}}` |
| Biztonsági felülvizsgáló | `{{NAME}}` | `{{OPINION}}` | `{{DATE}}` | `{{REFERENCE}}` |

## 2. Kell-e DPIA?

### Előzetes döntés

**A projekt teljes DPIA-t végez az éles adatkezelés előtt.** Ez óvatossági és accountability-döntés; önmagában nem jelenti ki, hogy a GDPR 35. cikke alapján minden tervezett volumen mellett kötelező. A kötelező jelleg végleges megállapítása az adatkezelő, a tényleges volumen, célország és használati mód alapján szakjogászi/DPO-döntést igényel.

### Magas kockázatra utaló tényezők

- felnőttek kognitív feladatmegoldási és érzelmi önjellemzési mintáinak automatizált értékelése;
- mentális vagy egészségi állapotra utaló következtetés lehetősége, így különleges adatok érintettsége;
- profilalkotás, még ha az eredmény nem is jár joghatással vagy hasonlóan jelentős hatással;
- 11 nyelv és kultúra, eltérő jelentés- és fordítási kockázatokkal;
- új technológiák és opcionális generatív AI alkalmazása;
- több külső szolgáltató és lehetséges EGT-n kívüli adattovábbítás;
- online fizetés és email-kézbesítés, amelyek összekapcsolhatják az identitást a profillal;
- a pszichometriai validáltság hiánya miatti félreértelmezési és hátrányos döntési kockázat;
- jövőbeni nagy lépték vagy rendszeres megfigyelés lehetősége.

### NAIH-lista szempontjai

A NAIH kötelező DPIA-listája többek között nevesíti:

- tanulók felkészültségének, teljesítményének, alkalmasságának vagy mentális állapotának nem jogszabályon alapuló értékelését;
- a személyes jellemzők nagy léptékű és rendszeres profilozását;
- jelentős mennyiségű különleges adat kezelését;
- sérülékeny érintettek és új technológiák egyes felhasználásait.

A Cogniva jelenlegi rendeltetése kizárólag 18 éven felüli személy saját, alacsony tétű önreflexiója. **Tiltani kell** a gyermek, tanuló, munkavállaló, álláskereső, biztosított vagy hiteligénylő más személy általi értékelését. Ha ez a rendeltetés, az érintetti kör vagy a volumen változik, a DPIA-t az adatkezelés előtt újra kell nyitni.

Végleges kötelező DPIA-döntés: `{{DPIA_MANDATORY_DECISION_AND_REASONING — KÖTELEZŐ}}`

## 3. A tervezett adatkezelés leírása

### 3.1. Rendeltetés

A Cogniva Compass felnőtteknek szóló oktatási önreflexiós szolgáltatás. Két külön út érhető el:

- 20 tételes kognitív feladatminta;
- 24 tételes érzelmi önreflexió.

Az eredmény leíró, pozitív és bizonytalanságtudatos pillanatkép. Nem standardizált IQ- vagy EQ-teszt, nem diagnosztikai vagy klinikai szűrőeszköz, nem készít percentilist vagy alkalmassági döntést.

### 3.2. Termékek

| Termék | Tartalom | Tervezett ár | Státusz |
| --- | --- | --- | --- |
| `single_v1` | egy választott kognitív vagy érzelmi email-riport | USD 7.99 | `{{PRICE_TAX_AND_LEGAL_APPROVAL — KÖTELEZŐ}}` |
| `bundle_v1` | egy kognitív és egy érzelmi kitöltésből egy kombinált email-riport | USD 12.99 | `{{PRICE_TAX_AND_LEGAL_APPROVAL — KÖTELEZŐ}}` |

Az ár, adótartalom, termékbesorolás és célországok a DPIA mellett fogyasztóvédelmi, adó- és számlázási jóváhagyást igényelnek.

### 3.3. Érintettek

- 18 éven felüli, saját magukról válaszoló látogatók és vásárlók;
- sikertelen vagy megszakított checkoutot kezdeményező felnőttek;
- adatvédelmi kérelmet vagy panaszt benyújtó személyek.

Kizárt érintetti kör és használat:

- gyermekek és 18 év alatti személyek;
- más személyről történő kitöltés;
- munkáltatói, oktatási, biztosítási, hitelezési, egészségügyi vagy hatósági alkalmasságértékelés;
- krízis-, diagnosztikai, terápiás vagy gyógyszerelési döntés.

### 3.4. Adatfolyam

```text
NeuroMap hivatkozás / Webflow host shell
  -> Railway statikus loader, CSS, alkalmazás és verziózott kérdésbank
  -> nyelvválasztás
  -> kétlépcsős pre-assessment feltételek és privacy/explicit consent
  -> pseudonymous consent receipt + hash-elt hozzáférési token
  -> kliensoldali kérdésválasztás, válaszadás és ingyenes pillanatkép
  -> opcionális fizetős csomagválasztás
       -> email kétszeri bevitele
       -> külön checkout terms + azonnali teljesítés/elállás
       -> POST /api/checkout: raw válaszok csak memóriában
       -> szerveres form-ellenőrzés és újrapontozás
       -> PostgreSQL: rendelés, consent, négy domain-összegzés trackenként
       -> Stripe hosted Checkout
       -> aláírt, idempotens webhook indítja a teljesítést
       -> determinisztikus riport vagy külön opt-in OpenAI-szövegezés
       -> Resend tranzakciós email, aláírt delivery webhook
       -> tokennel védett rendelési státusz
       -> célhoz kötött retention és törlés/pseudonimizálás
```

### 3.5. Adatkategóriák

- online azonosítók és alap HTTP-biztonsági adatok;
- nyelv, csomag, kérdőívtípus és verzióazonosítók;
- kérdésazonosító–válasz párok tranzitban;
- kognitív/érzelmi területi összegzések és leíró riport;
- email-cím;
- consent- és terms-bizonylatok;
- rendelési, összeg-, deviza-, fizetési, refund- és dispute-adatok;
- Stripe- és Resend-opaque azonosítók és státuszok;
- rendszer- és biztonsági események személyes payload nélkül.

Nem gyűjtendő:

- név, teljes születési dátum, cím, nem, munkáltató vagy iskola a Cogniva kérdőívben;
- szabad szöveges egészségügyi információ;
- teljes kártyaadat;
- nyers válasz tartós adatbázisban;
- kérdés, válasz, score, domain, email vagy rendelésazonosító analytics/ad payloadban;
- eszközfingerprint vagy pontos helyadat.

### 3.6. Adatvolumen és gyakoriság

| Mérőszám | Induló becslés | DPIA újranyitási küszöb |
| --- | --- | --- |
| havi egyedi kitöltők | `{{MONTHLY_USERS_ESTIMATE}}` | `{{MONTHLY_USERS_REVIEW_THRESHOLD}}` |
| havi fizetett rendelések | `{{MONTHLY_ORDERS_ESTIMATE}}` | `{{MONTHLY_ORDERS_REVIEW_THRESHOLD}}` |
| tárolt aktív riportok maximuma | `{{ACTIVE_REPORTS_ESTIMATE}}` | `{{ACTIVE_REPORTS_REVIEW_THRESHOLD}}` |
| célországok | `{{TARGET_COUNTRIES — KÖTELEZŐ}}` | új ország automatikusan review trigger |
| értékesítési nyelvek | hu, en, de, it, es, zh, ja, ar, pl, pt, fr | új nyelv automatikusan review trigger |

## 4. Szükségesség és arányosság

### 4.1. Célhoz kötöttség

Minden adatmezőnek egy dokumentált célhoz kell kapcsolódnia. Az eredmények nem használhatók másodlagos marketing-, kutatási, modelltréning-, alkalmassági vagy adatértékesítési célra új kompatibilitási/jogalap-vizsgálat és megfelelő tájékoztatás nélkül.

### 4.2. Adatminimalizálás

Tervezett kontrollok:

- az ingyenes válaszadás és eredmény alapvetően helyben történik;
- nincs fiók és nincs névbekérés;
- fizetős teljesítéshez csak email szükséges;
- a szerver a raw válaszokat csak validálásra és újrapontozásra használja, majd eldobja;
- PostgreSQL csak trackenként négy összegzést, riportot és műveleti adatot tárol;
- Stripe metadata csak opaque order ID-t, csomagkódot és integrációverziót kap;
- Resend tag csak opaque order ID-t és integrációverziót kap;
- OpenAI csak külön opt-in esetén nyelvet, tracket, négy összegzést és verziókat kap;
- analytics mező-allowlist tilt minden kérdőív- és rendelésadatot.

### 4.3. Pontosság

- szerveroldali kanonikus újrapontozás;
- verziózott bank, form, scoring és report;
- módosított/hiányos/duplikált kérdések elutasítása;
- email kétszeri bevitele;
- pozitív, de nem túlzott bizonyosságú nyelvezet;
- felhasználói panasz- és helyesbítési út.

Korlát: a kétszeri emailbevitel nem igazolja a postafiók tulajdonjogát. Email-verifikáció vagy magic-link szükségessége: `{{EMAIL_OWNERSHIP_CONTROL_DECISION — KÖTELEZŐ}}`.

### 4.4. Átláthatóság és választás

- 11 teljes lokalizáció és arab RTL;
- nincs angol fallback;
- kérdőív előtti kétlépcsős tájékoztatás;
- külön terms-elfogadás, privacy acknowledgment és special-category explicit consent;
- analytics és AI külön, opcionális, alapból kikapcsolt;
- checkout terms és elállás külön, a termék és ár megismerése után;
- consent visszavonási és érintetti joggyakorlási út;
- automatizált logika és mérési korlátok közérthető leírása.

### 4.5. Megőrzési korlát

A mezőszintű és szolgáltatónkénti megőrzési ütemterv hivatkozása: `{{RETENTION_SCHEDULE_REFERENCE — KÖTELEZŐ}}`.

A jelenlegi 30 napos report-retention csak technikai alapérték. A consent proof, tranzakciós, számviteli, jogi igény-, provider- és backupadatok külön idejét dokumentálni kell. A pszeudonimizált rekord nem nevezhető anonimnak.

## 5. Érintetti konzultáció és elvárások

Tervezett konzultáció:

- 11 nyelv független nyelvi és kulturális kognitív interjúi;
- adatvédelmi/consent UX-teszt legalább `{{UX_TEST_SAMPLE}}` felnőttel;
- pszichometriai szakértői felülvizsgálat;
- fogyasztóvédelmi és adatvédelmi szakjogászi review;
- hozzáférhetőségi teszt képernyőolvasóval és billentyűzettel;
- külön teszt annak megértésére, hogy az eredmény nem IQ/EQ és nem diagnózis.

Eredmények és változtatások: `{{CONSULTATION_RECORD_REFERENCE — KÖTELEZŐ}}`.

Ha közvetlen érintetti konzultációt nem végeznek, annak indoka: `{{CONSULTATION_OMISSION_REASON — KÖTELEZŐ}}`.

## 6. Szolgáltatók, szerepek és adattovábbítások

| Szolgáltató | Funkció | Tervezett adat | Szerep és szerződés | Régió/transfer | Státusz |
| --- | --- | --- | --- | --- | --- |
| Webflow | host shell | HTTP-meta, nyelv; nincs válasz | `{{ROLE_AND_DPA}}` | `{{REGION_SCC_TIA}}` | `OPEN` |
| Railway/PostgreSQL | app és adatbázis | consent, rendelés, összegzés, riport | `{{ROLE_AND_DPA}}` | `{{REGION_SCC_TIA}}` | `OPEN` |
| Stripe | checkout/fizetés | összeg, deviza, email a config szerint, opaque order | `{{ROLE_AND_DPA}}` | `{{REGION_SCC_TIA}}` | `OPEN` |
| Resend | email | email, riport, opaque tag | `{{ROLE_AND_DPA}}` | `{{REGION_SCC_TIA}}` | `OPEN` |
| OpenAI | opcionális szövegezés | minimalizált domain-összegzés | `{{ROLE_DPA_MODEL}}` | `{{REGION_SCC_TIA}}` | `OFF / OPEN` |
| `{{INVOICE_PROVIDER}}` | számla | `{{DATA}}` | `{{ROLE_AND_DPA}}` | `{{REGION_SCC_TIA}}` | `OPEN` |
| `{{MONITORING_PROVIDER}}` | security/uptime | `{{DATA}}` | `{{ROLE_AND_DPA}}` | `{{REGION_SCC_TIA}}` | `OPEN` |

Kötelező bizonyítékok:

- [ ] Art. 28 szerinti DPA-k és szerepkör-döntések.
- [ ] Aktuális alfeldolgozói listák.
- [ ] Adatrezidencia és backuphelyek.
- [ ] Megfelelőségi határozat vagy SCC/egyéb garancia.
- [ ] Transfer impact assessment szolgáltatónként.
- [ ] Kiegészítő technikai/szervezési kontrollok.
- [ ] Incidensértesítési és törlési SLA-k.
- [ ] OpenAI konkrét model, `store:false`, retention/ZDR döntés és 11 nyelvű eval.

## 7. Kockázatértékelési módszer

Valószínűség (`L`) és hatás (`I`) 1–4 skálán:

- 1: alacsony;
- 2: mérsékelt;
- 3: jelentős;
- 4: súlyos.

Pontszám: `L × I`.

- 1–3: alacsony;
- 4–7: közepes;
- 8–11: magas;
- 12–16: kritikus.

Az értékelés az érintett jogaira és szabadságaira vonatkozik, nem csak az üzleti veszteségre. A residual score kizárólag bevezetett és bizonyított kontroll után csökkenthető.

## 8. Kockázati nyilvántartás

| ID | Kockázat az érintettre | Kezdeti L×I | Kötelező kontrollok | Maradék L×I | Tulajdonos | Bizonyíték/státusz |
| --- | --- | --- | --- | --- | --- | --- |
| R-01 | A nem validált eredményt IQ/EQ-, diagnosztikai vagy stabil képességcímkeként értelmezik; stigma, szorongás vagy hamis megnyugvás keletkezik | 3×4=12 | következetes „önreflexiós pillanatkép”; nincs számérték/percentilis/diagnózis; pozitív bizonytalanság; szakértői item- és riportreview; tiltott felhasználások; panaszút | `{{RESIDUAL}}` | Product/Psychometrics | `OPEN` |
| R-02 | Munkáltató, iskola, biztosító vagy más harmadik személy alkalmassági döntéshez használja | 3×4=12 | kizárólag 18+ saját kitöltés; terms-tilalom; nincs megosztható „tanúsítvány”; nincs employer API; monitoring és jogérvényesítés | `{{RESIDUAL}}` | Legal/Product | `OPEN` |
| R-03 | Más személy tölti ki az érintett nevében vagy a címzett emailt elgépelik, így profil kerül illetéktelenhez | 3×4=12 | own-responses confirmation; email kétszeri bevitel; magic-link/ownership döntés; tokenes státusz; support-runbook | `{{RESIDUAL}}` | Product/Security | `OPEN` |
| R-04 | Raw válasz, score, email vagy riport naplóba, analyticsbe, URL-be vagy provider metadata-ba szivárog | 3×4=12 | mező-allowlist; payload-redaction; no-query-token; opaque metadata; automatizált log/analytics tesztek; CSP; code review | `{{RESIDUAL}}` | Engineering/Security | `OPEN` |
| R-05 | Rendelési vagy consent-token megszerzése illetéktelen státusz-/joggyakorlást tesz lehetővé | 2×4=8 | 256 bites token; csak hash at rest; URL fragment/sessionStorage; rövid élettartam; rate limit; rotáció/revokáció; sensitive response tiltás | `{{RESIDUAL}}` | Security | `OPEN` |
| R-06 | Admin dashboard kompromittálása összekapcsolja az emailt az érzékeny profillal | 3×4=12 | Cogniva külön namespace/scope; least privilege RBAC; MFA; rövid session; CSRF; auditlog; exporttilalom; secret rotation; IP/device policy döntés | `{{RESIDUAL}}` | Security/Admin | `OPEN` |
| R-07 | Hibás, hiányos vagy kevert nyelv megváltoztatja egy kérdés, hozzájárulás vagy eredmény jelentését | 3×4=12 | strukturális locale-parity; nincs fallback; független szakfordítás; cognitive interview; RTL QA; version/hash; release gate | `{{RESIDUAL}}` | Localization/Legal | `OPEN` |
| R-08 | AI hallucinál, diagnózist vagy túlzó állítást ad, illetve adatot továbbít az EGT-n kívül | 3×4=12 | alapból OFF; külön opt-in; minimalizált bemenet; determinisztikus score/fallback; strict schema; tiltott állítások; store:false; eval 11 nyelven; DPA/SCC/TIA/ZDR döntés | `{{RESIDUAL}}` | AI/Privacy | `OPEN` |
| R-09 | Harmadik fél trackingje consent előtt indul vagy érzékeny funnel-eseményt profiloz | 3×4=12 | analytics default denied minden tag előtt; tag csak opt-in után; ad storage mindig denied; event allowlist; hálózati teszt; CMP napló | `{{RESIDUAL}}` | Marketing/Privacy | `OPEN` |
| R-10 | Törlés/megőrzés hibája miatt email, profil vagy riport túl sokáig marad DB-ben, backupban vagy szolgáltatónál | 3×4=12 | célonkénti schedule; automata purge; terminal-state guard; backup/provider deletion; monitoring; negyedéves teszt; DSR runbook | `{{RESIDUAL}}` | Privacy/Operations | `OPEN` |
| R-11 | Webhook replay, sorrendhiba vagy hamis callback duplikált emailt vagy téves fizetési állapotot okoz | 2×3=6 | raw-body signature; event-id idempotency; amount/currency/price/package ellenőrzés; terminal precedence; replay/out-of-order tesztek | `{{RESIDUAL}}` | Payments/Engineering | `OPEN` |
| R-12 | Böngészőben maradó checkout recovery vagy local history más helyi felhasználó számára látható | 2×3=6 | sessionStorage; 1 órás TTL; siker/lejárat/home törlés; nincs válasz localStorage-ban; privacy tájékoztatás; shared-device warning döntés | `{{RESIDUAL}}` | Frontend/Privacy | `OPEN` |
| R-13 | Itembank, pontozás vagy ismétlődés tudományosan gyenge, mégis túl pontos következtetésként jelenik meg | 4×3=12 | „expert_review_required” gate; nincs normatív score; 100k repetition audit; item redevelopment; pilot; reliability/validity/DIF/invariance program | `{{RESIDUAL}}` | Psychometrics | `OPEN` |
| R-14 | CORS/XSS/supply-chain hiba miatt idegen origin adatot küld vagy kódot futtat | 2×4=8 | pontos origin allowlist; CSP/SRI döntés; escaping; dependency pin/audit; external loader versioning; no inline secrets; penetration test | `{{RESIDUAL}}` | Security/Frontend | `OPEN` |
| R-15 | Consent érvénytelen a bundling, prechecked box, pontatlan fordítás vagy megváltozott dokumentum miatt | 3×4=12 | külön required/optional mezők; nincs precheck; terms ≠ privacy consent; server timestamp; immutable document hash; version bump invalidation; withdrawal; locale-bound receipt | `{{RESIDUAL}}` | Legal/Engineering | `OPEN` |
| R-16 | Szolgáltató kiesése vagy queue-hiba fizetés után megakadályozza a riportot, panaszt és anyagi hátrányt okoz | 3×3=9 | durable DB queue; retry/backoff; idempotent email; failure alert; refund/remedy runbook; monitored support; provider outage test | `{{RESIDUAL}}` | Operations/Support | `OPEN` |
| R-17 | Érintetti kérelem téves személyhez kapcsolódik, túlzott adatot kér, vagy aktív teljesítést hibásan töröl | 2×4=8 | tokenes session; arányos identity verification; request state machine; restriction/erasure guards; four-eyes admin action; auditlog | `{{RESIDUAL}}` | Privacy/Support | `OPEN` |
| R-18 | Incidens későn észlelhető, vagy nem történik megfelelő hatósági/érintetti értesítés | 2×4=8 | incident plan; owner/on-call; audit és alert; breach triage; processor SLA; 72 órás döntési workflow; tabletop exercise | `{{RESIDUAL}}` | Security/DPO | `OPEN` |

## 9. Kötelező technikai és szervezési intézkedések

### Consent és jogi tartalom

- [ ] A kétlépcsős flow az első kérdés és a question-bank runtime betöltése előtt fut.
- [ ] A választott nyelvhez pontosan illeszkedő, teljes szöveg jelenik meg; unsupported nyelv fail-closed.
- [ ] Minden required és optional checkbox alapból üres.
- [ ] A privacy notice tudomásulvétele és a kifejezett különlegesadat-hozzájárulás külön mező.
- [ ] Az analytics és AI elutasítása nem korlátozza a determinisztikus szolgáltatást.
- [ ] A checkout elállási és azonnali teljesítési nyilatkozata nem a pre-assessment flow része.
- [ ] A receipt szerveroldali időpontot, locale-t, scope-ot, a pontos lokalizált consent-bundle verzióját és dokumentumhash-t tartalmaz.
- [ ] A receipt-token magas entrópiájú és csak hash-elve tárolt.
- [ ] Dokumentumváltozás invalidálja a régi receiptet.
- [ ] Visszavonás és privacy request működik és tesztelt.

### Alkalmazás- és adatbiztonság

- [ ] TLS, HSTS, CSP és biztonsági header baseline.
- [ ] CORS csak jóváhagyott Webflow/custom domainekre.
- [ ] Stripe és Resend aláírt raw-body webhook.
- [ ] Checkout-, webhook- és email-idempotencia.
- [ ] PostgreSQL titkosított kapcsolat és least-privilege user.
- [ ] Production secret csak Railway Variables-ben; nincs repo/log/admin exportban.
- [ ] Dashboard RBAC, MFA, CSRF, session timeout, auditlog és külön Cogniva permission.
- [ ] Backup titkosítás, restore test és igazolt purge.
- [ ] Dependency audit, SAST/secret scan és éves penetrációs teszt.
- [ ] No-sensitive-logging és analytics allowlist automatikus teszt.

### Szervezeti intézkedések

- [ ] Adatkezelési nyilvántartás (ROPA).
- [ ] Jogosérdek-mérlegelés security/fraud/claims célokra.
- [ ] Vendor DPA, SCC/TIA és subprocessor review.
- [ ] Hozzáférési review legalább negyedévente.
- [ ] Incidens-, DSR-, refund-, dispute-, email-failure- és provider-outage runbook.
- [ ] Személyzet adatvédelmi és biztonsági oktatása.
- [ ] Pszichometriai és 11 nyelvű szakértői review.
- [ ] Retention/purge és joggyakorlás rendszeres próbája.

## 10. OpenAI külön döntési kapu

OpenAI csak akkor kapcsolható be, ha minden pont teljesült:

- [ ] A determinisztikus riport mind a 11 nyelven tartalmilag jóváhagyott.
- [ ] A külön opt-in érthetőségi tesztje sikeres.
- [ ] A konkrét modell és prompt verziózott és jóváhagyott.
- [ ] `store:false` és a jóváhagyott retention/ZDR/MAM konfiguráció igazolt.
- [ ] DPA, alfeldolgozók, SCC/TIA és régió dokumentálva.
- [ ] Nincs email, név, payment, raw response vagy question text a requestben.
- [ ] 11 nyelvű eval lefedi a diagnózist, normatív állítást, stabil képességcímkét, kulturális sztereotípiát, félelemkeltést, hamis megnyugvást, számbeli ellentmondást és nyelvi fallbacket.
- [ ] Refusal, timeout, invalid schema és unsafe output determinisztikus fallbacket ad.
- [ ] OpenAI-kiesés nem blokkol fizetést vagy teljesítést.

Jóváhagyott OpenAI-konfiguráció: `{{OPENAI_APPROVAL_RECORD — KÖTELEZŐ, HA ENABLED}}`.

## 11. Érintetti jogok és működési folyamat

| Jog/folyamat | Beviteli csatorna | Azonosítás | Automatizálás | Emberi felelős | Teszt dátuma |
| --- | --- | --- | --- | --- | --- |
| hozzáférés | `{{CHANNEL}}` | `{{METHOD}}` | `{{STATUS}}` | `{{OWNER}}` | `{{DATE}}` |
| helyesbítés | `{{CHANNEL}}` | `{{METHOD}}` | `{{STATUS}}` | `{{OWNER}}` | `{{DATE}}` |
| törlés | `{{CHANNEL}}` | `{{METHOD}}` | `{{STATUS}}` | `{{OWNER}}` | `{{DATE}}` |
| korlátozás | `{{CHANNEL}}` | `{{METHOD}}` | `{{STATUS}}` | `{{OWNER}}` | `{{DATE}}` |
| tiltakozás | `{{CHANNEL}}` | `{{METHOD}}` | `{{STATUS}}` | `{{OWNER}}` | `{{DATE}}` |
| hordozhatóság | `{{CHANNEL}}` | `{{METHOD}}` | `{{STATUS}}` | `{{OWNER}}` | `{{DATE}}` |
| consent-visszavonás | `{{CHANNEL}}` | `{{METHOD}}` | `{{STATUS}}` | `{{OWNER}}` | `{{DATE}}` |
| panasz/emberi felülvizsgálat | `{{CHANNEL}}` | `{{METHOD}}` | `{{STATUS}}` | `{{OWNER}}` | `{{DATE}}` |

Az aktív fizetési és report-jobok törlése/korlátozása konzisztens state machine-t igényel. A kérelem nem okozhat kettős teljesítést, elveszett refundot vagy olyan számviteli adat törlését, amelyet jogszabály kötelezően megőriz.

## 12. Maradék kockázat és előzetes konzultáció

Legmagasabb maradék kockázatok: `{{HIGHEST_RESIDUAL_RISKS — KÖTELEZŐ}}`.

Elfogadhatósági indoklás: `{{RESIDUAL_RISK_ACCEPTANCE_REASONING — KÖTELEZŐ}}`.

Ha a kontrollok után magas kockázat marad, a GDPR 36. cikke szerinti előzetes hatósági konzultáció szükségességét a feldolgozás megkezdése előtt kell eldönteni.

- Előzetes konzultáció szükséges? `{{YES / NO / PENDING}}`
- DPO/jogi indoklás: `{{REASONING}}`
- Hatóság és ügyazonosító: `{{AUTHORITY_AND_REFERENCE_IF_APPLICABLE}}`

**Élesítési döntés:** `BLOCKED`, amíg bármely kritikus/magas kockázat kontrollja `OPEN`, a kötelező helyőrző kitöltetlen, vagy az adatkezelő/DPO/jogi/biztonsági jóváhagyás hiányzik.

## 13. Felülvizsgálati triggerek

A DPIA-t soron kívül újra kell nyitni, ha:

- új kérdőív, domain, item-bank, scoring, normatív sáv vagy eredményállítás készül;
- a szolgáltatás IQ/EQ-, diagnosztikai, klinikai vagy alkalmassági irányba változna;
- gyermek, tanuló, munkavállaló vagy más sérülékeny érintett kerülne a célcsoportba;
- új ország, nyelv vagy érdemben eltérő nemzeti jog jelenik meg;
- új adatmező, cél, analytics/ad platform, admin-export vagy API-integráció indul;
- új AI-modell, provider, régió vagy retention-konfiguráció lép életbe;
- a havi felhasználó-/rendelésszám átlépi a 3.6 pont küszöbét;
- biztonsági incidens, jelentős panasz, hatósági megkeresés vagy unfair-outcome jelzés érkezik;
- DPA, SCC, megfelelőségi határozat, alfeldolgozó vagy szolgáltatói feltétel változik;
- a retention-, backup-, DSR- vagy dashboard-kontroll nem működik a teszten;
- legalább évente, akkor is, ha más trigger nem történt.

## 14. Bizonyítékjegyzék

- `public/legal-content.js` — 11 nyelvű pre-assessment DRAFT content és locale-shape assertion.
- `docs/PRIVACY_NOTICE_TEMPLATE.md` — adatkezelési tájékoztató DRAFT.
- `docs/TERMS_AND_CONSUMER_INFORMATION_TEMPLATE.md` — használati/vásárlási DRAFT.
- `docs/DEEP_AUDIT_2026-07-26.md` — termék-, pszichometriai, UX- és jogi audit.
- `docs/COMMERCE_AND_DEPLOYMENT.md` — provider- és release-runbook.
- `docs/ASSESSMENT_BANK_STANDARD.md` — megengedett mérési állítások.
- `scripts/audit-form-repetition.js` — determinisztikus ismétlődés-audit.
- `tests/` — bank-, payload-, commerce-, webhook-, retention- és frontend smoke tesztek.
- `{{PENETRATION_TEST_REPORT}}`.
- `{{VENDOR_DPA_SCC_TIA_PACK}}`.
- `{{TRANSLATION_REVIEW_RECORD}}`.
- `{{PSYCHOMETRIC_REVIEW_RECORD}}`.
- `{{DSR_AND_INCIDENT_EXERCISE_RECORD}}`.

## Hivatalos hivatkozások

- [GDPR 35–36. cikk — EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng)
- [EDPB — megfelelés és DPIA](https://www.edpb.europa.eu/sme-data-protection-guide/be-compliant_en)
- [NAIH — GDPR 35. cikk (4) kötelező DPIA-lista](https://www.naih.hu/data-protection/gdpr-35-4-mandatory-dpia-list)
- [Európai Bizottság — adatvédelmi alapelvek](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en)
