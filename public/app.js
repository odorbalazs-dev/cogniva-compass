const LANGS={hu:"Magyar",en:"English",de:"Deutsch",it:"Italiano",es:"Español",zh:"中文",ja:"日本語",ar:"العربية",pl:"Polski",pt:"Português",fr:"Français"};
const COPY={
en:{language:"Language",eyebrow:"Two perspectives. One clearer picture.",title:"Explore how you think and how you navigate emotions.",lead:"Two short, private reflections reveal cognitive strengths and emotional habits—without labels, diagnosis or inflated promises.",iq:"Cognitive skills",eq:"Emotional skills",startIq:"Start cognitive reflection",startEq:"Start emotional reflection",time:"About 6 minutes each",private:"Answers stay in this browser",free:"No account needed",how:"A calmer way to understand your strengths",howLead:"Choose either reflection or complete both. Results are descriptive, not a standardized IQ or clinical EQ score.",s1:"Choose",s1b:"Start with cognitive or emotional skills.",s2:"Respond",s2b:"Work at your own pace; there is no public profile.",s3:"Reflect",s3b:"Receive a simple strengths map and practical prompts.",choose:"Choose a reflection",iqBody:"Patterns, working memory, numerical reasoning and flexible problem solving.",eqBody:"Self-awareness, regulation, empathy and relationship choices.",question:"Question",of:"of",next:"Next",result:"Your reflection",restart:"Return to start",disclaimer:"Cogniva Compass is an educational self-reflection tool for adults. It does not measure clinical intelligence, provide a diagnosis, or replace professional assessment.",score:"Overall pattern",strong:"Current strength",grow:"Area to explore",footer:"Private by design · Educational, non-clinical reflection"},
hu:{language:"Nyelv",eyebrow:"Két nézőpont. Egy tisztább kép.",title:"Fedezd fel, hogyan gondolkodsz és hogyan igazodsz el az érzelmek között.",lead:"Két rövid, privát önreflexió mutat rá a kognitív erősségekre és érzelmi szokásokra – címkék, diagnózis és túlzó ígéretek nélkül.",iq:"Kognitív készségek",eq:"Érzelmi készségek",startIq:"Kognitív felmérés indítása",startEq:"Érzelmi felmérés indítása",time:"Egyenként körülbelül 6 perc",private:"A válaszok a böngészőben maradnak",free:"Nem kell fiók",how:"Nyugodtabb út az erősségeid megértéséhez",howLead:"Válaszd bármelyik felmérést, vagy töltsd ki mindkettőt. Az eredmény leíró jellegű, nem standardizált IQ- vagy klinikai EQ-pontszám.",s1:"Válassz",s1b:"Kezdd a kognitív vagy az érzelmi készségekkel.",s2:"Válaszolj",s2b:"Haladj a saját tempódban; nem készül nyilvános profil.",s3:"Gondold át",s3b:"Egyszerű erősségtérképet és gyakorlati kérdéseket kapsz.",choose:"Válassz felmérést",iqBody:"Mintázatok, munkamemória, numerikus következtetés és rugalmas problémamegoldás.",eqBody:"Önismeret, érzelemszabályozás, empátia és kapcsolati döntések.",question:"Kérdés",of:"/",next:"Tovább",result:"A reflexiós eredményed",restart:"Vissza a kezdőlapra",disclaimer:"A Cogniva Compass felnőtteknek szóló oktatási önreflexiós eszköz. Nem mér klinikai intelligenciát, nem állít fel diagnózist és nem helyettesít szakmai vizsgálatot.",score:"Összesített mintázat",strong:"Jelenlegi erősség",grow:"Fejleszthető terület",footer:"Adatminimalista · Oktatási, nem klinikai önreflexió"},
de:{language:"Sprache",eyebrow:"Zwei Perspektiven. Ein klareres Bild.",title:"Entdecke, wie du denkst und mit Emotionen umgehst.",lead:"Zwei kurze, private Reflexionen zeigen kognitive Stärken und emotionale Gewohnheiten – ohne Etiketten, Diagnose oder überzogene Versprechen.",iq:"Kognitive Fähigkeiten",eq:"Emotionale Fähigkeiten",startIq:"Kognitive Reflexion starten",startEq:"Emotionale Reflexion starten",time:"Jeweils etwa 6 Minuten",private:"Antworten bleiben im Browser",free:"Kein Konto nötig",how:"Ein ruhigerer Weg, Stärken zu verstehen",howLead:"Wähle eine oder beide Reflexionen. Das Ergebnis ist beschreibend und kein standardisierter IQ- oder klinischer EQ-Wert.",s1:"Wählen",s1b:"Beginne mit kognitiven oder emotionalen Fähigkeiten.",s2:"Antworten",s2b:"Arbeite in deinem Tempo; es entsteht kein öffentliches Profil.",s3:"Reflektieren",s3b:"Erhalte eine einfache Stärkenkarte und praktische Impulse.",choose:"Reflexion wählen",iqBody:"Muster, Arbeitsgedächtnis, Zahlenlogik und flexible Problemlösung.",eqBody:"Selbstwahrnehmung, Regulation, Empathie und Beziehungsentscheidungen.",question:"Frage",of:"von",next:"Weiter",result:"Deine Reflexion",restart:"Zurück zum Start",disclaimer:"Cogniva Compass ist ein pädagogisches Reflexionswerkzeug für Erwachsene. Es misst keine klinische Intelligenz, diagnostiziert nicht und ersetzt keine fachliche Beurteilung.",score:"Gesamtmuster",strong:"Aktuelle Stärke",grow:"Bereich zur Entwicklung",footer:"Datensparsam · Pädagogisch, nicht klinisch"},
it:{language:"Lingua",eyebrow:"Due prospettive. Un quadro più chiaro.",title:"Esplora come pensi e come affronti le emozioni.",lead:"Due brevi riflessioni private mostrano punti di forza cognitivi e abitudini emotive, senza etichette o diagnosi.",iq:"Abilità cognitive",eq:"Abilità emotive",startIq:"Inizia la riflessione cognitiva",startEq:"Inizia la riflessione emotiva",time:"Circa 6 minuti ciascuna",private:"Le risposte restano nel browser",free:"Nessun account",how:"Un modo più sereno per capire i tuoi punti di forza",howLead:"Scegli una riflessione o entrambe. Il risultato è descrittivo, non un punteggio IQ standardizzato o EQ clinico.",s1:"Scegli",s1b:"Inizia dalle abilità cognitive o emotive.",s2:"Rispondi",s2b:"Procedi al tuo ritmo; nessun profilo pubblico.",s3:"Rifletti",s3b:"Ricevi una semplice mappa dei punti di forza.",choose:"Scegli una riflessione",iqBody:"Schemi, memoria di lavoro, ragionamento numerico e soluzione flessibile dei problemi.",eqBody:"Consapevolezza di sé, regolazione, empatia e scelte relazionali.",question:"Domanda",of:"di",next:"Avanti",result:"La tua riflessione",restart:"Torna all'inizio",disclaimer:"Cogniva Compass è uno strumento educativo di autoriflessione per adulti. Non misura l'intelligenza clinica, non diagnostica e non sostituisce una valutazione professionale.",score:"Profilo generale",strong:"Punto di forza",grow:"Area da esplorare",footer:"Privacy integrata · Riflessione educativa, non clinica"},
es:{language:"Idioma",eyebrow:"Dos perspectivas. Una imagen más clara.",title:"Explora cómo piensas y cómo manejas las emociones.",lead:"Dos reflexiones breves y privadas muestran fortalezas cognitivas y hábitos emocionales, sin etiquetas ni diagnósticos.",iq:"Habilidades cognitivas",eq:"Habilidades emocionales",startIq:"Iniciar reflexión cognitiva",startEq:"Iniciar reflexión emocional",time:"Unos 6 minutos cada una",private:"Las respuestas quedan en el navegador",free:"Sin cuenta",how:"Una forma tranquila de comprender tus fortalezas",howLead:"Elige una reflexión o ambas. El resultado es descriptivo, no un coeficiente intelectual estandarizado ni una puntuación clínica de EQ.",s1:"Elige",s1b:"Empieza con habilidades cognitivas o emocionales.",s2:"Responde",s2b:"Avanza a tu ritmo; no se crea un perfil público.",s3:"Reflexiona",s3b:"Recibe un mapa sencillo de fortalezas.",choose:"Elige una reflexión",iqBody:"Patrones, memoria de trabajo, razonamiento numérico y resolución flexible.",eqBody:"Autoconciencia, regulación, empatía y decisiones relacionales.",question:"Pregunta",of:"de",next:"Siguiente",result:"Tu reflexión",restart:"Volver al inicio",disclaimer:"Cogniva Compass es una herramienta educativa de autorreflexión para adultos. No mide inteligencia clínica, no diagnostica ni sustituye una evaluación profesional.",score:"Patrón general",strong:"Fortaleza actual",grow:"Área para explorar",footer:"Privacidad desde el diseño · Reflexión educativa, no clínica"},
zh:{language:"语言",eyebrow:"两个视角，更清晰地认识自己。",title:"探索你的思考方式与情绪应对方式。",lead:"两项简短、私密的反思帮助你了解认知优势与情绪习惯，不贴标签、不作诊断。",iq:"认知技能",eq:"情绪技能",startIq:"开始认知反思",startEq:"开始情绪反思",time:"每项约6分钟",private:"答案仅保留在浏览器中",free:"无需账户",how:"以平静的方式了解自己的优势",howLead:"可选择一项或两项。结果仅供描述与反思，并非标准化IQ或临床EQ分数。",s1:"选择",s1b:"从认知或情绪技能开始。",s2:"作答",s2b:"按自己的节奏进行，不会创建公开档案。",s3:"反思",s3b:"获得简明的优势图谱和实用提示。",choose:"选择反思",iqBody:"模式识别、工作记忆、数字推理和灵活解决问题。",eqBody:"自我觉察、情绪调节、同理心和关系选择。",question:"问题",of:"/",next:"下一步",result:"你的反思结果",restart:"返回首页",disclaimer:"Cogniva Compass是面向成人的教育性自我反思工具，不测量临床智力，不作诊断，也不能替代专业评估。",score:"整体模式",strong:"当前优势",grow:"可探索领域",footer:"隐私优先 · 教育性、非临床反思"},
ja:{language:"言語",eyebrow:"二つの視点で、より明確に。",title:"考え方と感情との向き合い方を見つめましょう。",lead:"短く非公開の二つの振り返りから、認知的な強みと感情の習慣を確認します。診断やレッテル付けは行いません。",iq:"認知スキル",eq:"感情スキル",startIq:"認知の振り返りを始める",startEq:"感情の振り返りを始める",time:"各約6分",private:"回答はブラウザ内にのみ保持",free:"アカウント不要",how:"強みを穏やかに理解する方法",howLead:"どちらか一方、または両方を選べます。結果は記述的で、標準化IQや臨床的EQスコアではありません。",s1:"選ぶ",s1b:"認知または感情スキルから始めます。",s2:"答える",s2b:"自分のペースで進め、公開プロフィールは作られません。",s3:"振り返る",s3b:"シンプルな強みマップを受け取ります。",choose:"振り返りを選ぶ",iqBody:"パターン、ワーキングメモリ、数的推論、柔軟な問題解決。",eqBody:"自己認識、感情調整、共感、関係における選択。",question:"質問",of:"/",next:"次へ",result:"振り返り結果",restart:"最初に戻る",disclaimer:"Cogniva Compassは成人向けの教育的自己振り返りツールです。臨床的知能を測定せず、診断を行わず、専門家の評価に代わるものではありません。",score:"全体傾向",strong:"現在の強み",grow:"探求できる領域",footer:"プライバシー重視 · 教育的・非臨床的な振り返り"},
ar:{language:"اللغة",eyebrow:"منظوران. صورة أوضح.",title:"استكشف طريقة تفكيرك وكيف تتعامل مع المشاعر.",lead:"تأملان قصيران وخاصان يوضحان نقاط القوة المعرفية والعادات العاطفية من دون تشخيص أو تصنيفات.",iq:"المهارات المعرفية",eq:"المهارات العاطفية",startIq:"ابدأ التأمل المعرفي",startEq:"ابدأ التأمل العاطفي",time:"نحو 6 دقائق لكل منهما",private:"تبقى الإجابات في المتصفح",free:"لا حاجة إلى حساب",how:"طريقة هادئة لفهم نقاط قوتك",howLead:"اختر أحد التأملين أو كليهما. النتيجة وصفية وليست درجة ذكاء معيارية أو تقييما سريريا للذكاء العاطفي.",s1:"اختر",s1b:"ابدأ بالمهارات المعرفية أو العاطفية.",s2:"أجب",s2b:"تقدم بالوتيرة المناسبة لك ولا يتم إنشاء ملف عام.",s3:"تأمل",s3b:"احصل على خريطة بسيطة لنقاط القوة.",choose:"اختر تأملا",iqBody:"الأنماط والذاكرة العاملة والاستدلال العددي وحل المشكلات بمرونة.",eqBody:"الوعي بالذات والتنظيم والتعاطف والاختيارات في العلاقات.",question:"السؤال",of:"من",next:"التالي",result:"نتيجة تأملك",restart:"العودة إلى البداية",disclaimer:"Cogniva Compass أداة تعليمية للتأمل الذاتي للبالغين. لا تقيس الذكاء سريريا ولا تقدم تشخيصا ولا تحل محل التقييم المهني.",score:"النمط العام",strong:"نقطة قوة حالية",grow:"مجال للاستكشاف",footer:"الخصوصية أولا · تأمل تعليمي غير سريري"},
pl:{language:"Język",eyebrow:"Dwie perspektywy. Jaśniejszy obraz.",title:"Poznaj swój sposób myślenia i reagowania na emocje.",lead:"Dwie krótkie, prywatne refleksje pokazują mocne strony poznawcze i nawyki emocjonalne — bez etykiet i diagnozy.",iq:"Umiejętności poznawcze",eq:"Umiejętności emocjonalne",startIq:"Rozpocznij refleksję poznawczą",startEq:"Rozpocznij refleksję emocjonalną",time:"Około 6 minut każda",private:"Odpowiedzi zostają w przeglądarce",free:"Bez konta",how:"Spokojniejszy sposób rozumienia swoich mocnych stron",howLead:"Wybierz jedną lub obie refleksje. Wynik jest opisowy, a nie standaryzowanym IQ ani klinicznym EQ.",s1:"Wybierz",s1b:"Zacznij od umiejętności poznawczych lub emocjonalnych.",s2:"Odpowiedz",s2b:"Pracuj we własnym tempie; nie tworzymy publicznego profilu.",s3:"Zastanów się",s3b:"Otrzymaj prostą mapę mocnych stron.",choose:"Wybierz refleksję",iqBody:"Wzorce, pamięć robocza, rozumowanie liczbowe i elastyczne rozwiązywanie problemów.",eqBody:"Samoświadomość, regulacja, empatia i wybory w relacjach.",question:"Pytanie",of:"z",next:"Dalej",result:"Twoja refleksja",restart:"Wróć na początek",disclaimer:"Cogniva Compass to edukacyjne narzędzie autorefleksji dla dorosłych. Nie mierzy inteligencji klinicznej, nie diagnozuje i nie zastępuje profesjonalnej oceny.",score:"Ogólny wzorzec",strong:"Obecna mocna strona",grow:"Obszar do poznania",footer:"Prywatność od początku · Refleksja edukacyjna, niekliniczna"},
pt:{language:"Idioma",eyebrow:"Duas perspetivas. Uma imagem mais clara.",title:"Explore como pensa e como lida com as emoções.",lead:"Duas reflexões breves e privadas revelam forças cognitivas e hábitos emocionais, sem rótulos nem diagnóstico.",iq:"Competências cognitivas",eq:"Competências emocionais",startIq:"Iniciar reflexão cognitiva",startEq:"Iniciar reflexão emocional",time:"Cerca de 6 minutos cada",private:"As respostas ficam no navegador",free:"Sem conta",how:"Uma forma tranquila de compreender as suas forças",howLead:"Escolha uma reflexão ou ambas. O resultado é descritivo, não um QI padronizado nem uma pontuação clínica de QE.",s1:"Escolha",s1b:"Comece pelas competências cognitivas ou emocionais.",s2:"Responda",s2b:"Avance ao seu ritmo; não é criado perfil público.",s3:"Reflita",s3b:"Receba um mapa simples de forças.",choose:"Escolha uma reflexão",iqBody:"Padrões, memória de trabalho, raciocínio numérico e resolução flexível.",eqBody:"Autoconsciência, regulação, empatia e escolhas relacionais.",question:"Pergunta",of:"de",next:"Seguinte",result:"A sua reflexão",restart:"Voltar ao início",disclaimer:"Cogniva Compass é uma ferramenta educativa de autorreflexão para adultos. Não mede inteligência clínica, não diagnostica e não substitui avaliação profissional.",score:"Padrão geral",strong:"Força atual",grow:"Área a explorar",footer:"Privacidade desde a conceção · Reflexão educativa, não clínica"},
fr:{language:"Langue",eyebrow:"Deux perspectives. Une vision plus claire.",title:"Explorez votre façon de penser et de vivre les émotions.",lead:"Deux réflexions courtes et privées révèlent des forces cognitives et des habitudes émotionnelles, sans étiquette ni diagnostic.",iq:"Compétences cognitives",eq:"Compétences émotionnelles",startIq:"Commencer la réflexion cognitive",startEq:"Commencer la réflexion émotionnelle",time:"Environ 6 minutes chacune",private:"Les réponses restent dans le navigateur",free:"Sans compte",how:"Une manière sereine de comprendre vos forces",howLead:"Choisissez une réflexion ou les deux. Le résultat est descriptif, pas un QI standardisé ni un score clinique de QE.",s1:"Choisir",s1b:"Commencez par les compétences cognitives ou émotionnelles.",s2:"Répondre",s2b:"Avancez à votre rythme; aucun profil public n'est créé.",s3:"Réfléchir",s3b:"Recevez une carte simple de vos forces.",choose:"Choisissez une réflexion",iqBody:"Logique, mémoire de travail, raisonnement numérique et résolution flexible.",eqBody:"Conscience de soi, régulation, empathie et choix relationnels.",question:"Question",of:"sur",next:"Suivant",result:"Votre réflexion",restart:"Retour à l'accueil",disclaimer:"Cogniva Compass est un outil éducatif d'autoréflexion pour adultes. Il ne mesure pas l'intelligence clinique, ne pose pas de diagnostic et ne remplace pas une évaluation professionnelle.",score:"Tendance globale",strong:"Force actuelle",grow:"Axe à explorer",footer:"Confidentialité intégrée · Réflexion éducative, non clinique"}
};
const DOMAIN_LABELS={
en:{patterns:"Patterns",workingMemory:"Working memory",numericalReasoning:"Numerical reasoning",flexibleThinking:"Flexible thinking",selfAwareness:"Self-awareness",regulation:"Regulation",empathy:"Empathy",relationships:"Relationships"},
hu:{patterns:"Mintázatok",workingMemory:"Munkamemória",numericalReasoning:"Numerikus következtetés",flexibleThinking:"Rugalmas gondolkodás",selfAwareness:"Önismeret",regulation:"Érzelemszabályozás",empathy:"Empátia",relationships:"Kapcsolatok"},
de:{patterns:"Muster",workingMemory:"Arbeitsgedächtnis",numericalReasoning:"Zahlenlogik",flexibleThinking:"Flexibles Denken",selfAwareness:"Selbstwahrnehmung",regulation:"Regulation",empathy:"Empathie",relationships:"Beziehungen"},
it:{patterns:"Schemi",workingMemory:"Memoria di lavoro",numericalReasoning:"Ragionamento numerico",flexibleThinking:"Pensiero flessibile",selfAwareness:"Consapevolezza di sé",regulation:"Regolazione",empathy:"Empatia",relationships:"Relazioni"},
es:{patterns:"Patrones",workingMemory:"Memoria de trabajo",numericalReasoning:"Razonamiento numérico",flexibleThinking:"Pensamiento flexible",selfAwareness:"Autoconciencia",regulation:"Regulación",empathy:"Empatía",relationships:"Relaciones"},
zh:{patterns:"模式",workingMemory:"工作记忆",numericalReasoning:"数字推理",flexibleThinking:"灵活思考",selfAwareness:"自我觉察",regulation:"情绪调节",empathy:"同理心",relationships:"关系"},
ja:{patterns:"パターン",workingMemory:"ワーキングメモリ",numericalReasoning:"数的推論",flexibleThinking:"柔軟な思考",selfAwareness:"自己認識",regulation:"感情調整",empathy:"共感",relationships:"関係"},
ar:{patterns:"الأنماط",workingMemory:"الذاكرة العاملة",numericalReasoning:"الاستدلال العددي",flexibleThinking:"التفكير المرن",selfAwareness:"الوعي بالذات",regulation:"التنظيم",empathy:"التعاطف",relationships:"العلاقات"},
pl:{patterns:"Wzorce",workingMemory:"Pamięć robocza",numericalReasoning:"Rozumowanie liczbowe",flexibleThinking:"Elastyczne myślenie",selfAwareness:"Samoświadomość",regulation:"Regulacja",empathy:"Empatia",relationships:"Relacje"},
pt:{patterns:"Padrões",workingMemory:"Memória de trabalho",numericalReasoning:"Raciocínio numérico",flexibleThinking:"Pensamento flexível",selfAwareness:"Autoconsciência",regulation:"Regulação",empathy:"Empatia",relationships:"Relações"},
fr:{patterns:"Logique",workingMemory:"Mémoire de travail",numericalReasoning:"Raisonnement numérique",flexibleThinking:"Pensée flexible",selfAwareness:"Conscience de soi",regulation:"Régulation",empathy:"Empathie",relationships:"Relations"}
};
const DURATION={
en:"20 cognitive or 24 emotional items · about 8–12 minutes",
hu:"20 kognitív vagy 24 érzelmi tétel · körülbelül 8–12 perc",
de:"20 kognitive oder 24 emotionale Aufgaben · etwa 8–12 Minuten",
it:"20 item cognitivi o 24 emotivi · circa 8–12 minuti",
es:"20 ítems cognitivos o 24 emocionales · unos 8–12 minutos",
zh:"20道认知题或24道情绪题 · 约8–12分钟",
ja:"認知20問または感情24項目 · 約8～12分",
ar:"20 بندًا معرفيًا أو 24 بندًا عاطفيًا · نحو 8–12 دقيقة",
pl:"20 pozycji poznawczych lub 24 emocjonalne · około 8–12 minut",
pt:"20 itens cognitivos ou 24 emocionais · cerca de 8–12 minutos",
fr:"20 items cognitifs ou 24 émotionnels · environ 8–12 minutes"
};
const NOTE_LABEL={en:"Important note",hu:"Fontos megjegyzés",de:"Wichtiger Hinweis",it:"Nota importante",es:"Nota importante",zh:"重要说明",ja:"重要な注意",ar:"ملاحظة مهمة",pl:"Ważna informacja",pt:"Nota importante",fr:"Note importante"};
const LOAD_ERROR={
en:"The assessment bank could not be loaded. Please refresh the page.",
hu:"A kérdésbank nem tölthető be. Kérjük, frissítsd az oldalt.",
de:"Die Aufgabenbank konnte nicht geladen werden. Bitte lade die Seite neu.",
it:"Impossibile caricare la banca degli item. Aggiorna la pagina.",
es:"No se pudo cargar el banco de ítems. Actualiza la página.",
zh:"题库无法加载，请刷新页面。",
ja:"項目バンクを読み込めませんでした。ページを再読み込みしてください。",
ar:"تعذر تحميل بنك البنود. يرجى تحديث الصفحة.",
pl:"Nie udało się wczytać banku pozycji. Odśwież stronę.",
pt:"Não foi possível carregar o banco de itens. Atualize a página.",
fr:"La banque d’items n’a pas pu être chargée. Actualisez la page."
};

function safeStorageGet(key){try{return localStorage.getItem(key)}catch{return null}}
function safeStorageSet(key,value){try{localStorage.setItem(key,value)}catch{}}
let lang=(safeStorageGet("cc_lang")||(navigator.language||"en").slice(0,2)||"en").toLowerCase();if(!LANGS[lang])lang="en";
let mode=null,index=0,answers=[],currentItems=[];
const app=document.querySelector("#app"),select=document.querySelector("#languageSelect"),footer=document.querySelector("#footer");
Object.entries(LANGS).forEach(([value,label])=>select.add(new Option(label,value)));select.value=lang;

function t(){return COPY[lang]}
function esc(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}
function domainLabel(domain){return DOMAIN_LABELS[lang][domain]}
function modeTitle(track){return track==="cognitive"?t().iq:t().eq}
function insightCopy(){return window.COGNIVA_RESULT_INSIGHTS_V1?.languages?.[lang]||null}
function resultModel(){return window.COGNIVA_RESULT_MODEL_V1||null}
function scoreBand(value){return resultModel().scoreBand(value)}

function applyLang(){
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  document.querySelector("#languageLabel").textContent=t().language;
  select.setAttribute("aria-label",t().language);
  footer.textContent=`© ${new Date().getFullYear()} Cogniva Compass · ${t().footer}`;
}

function home(){
  mode=null;index=0;answers=[];currentItems=[];
  const c=t();
  app.innerHTML=`<section class="hero"><div><p class="eyebrow">${c.eyebrow}</p><h1>${c.title}</h1><p class="lead">${c.lead}</p><div class="actions"><button class="button" data-start="cognitive">${c.startIq}</button><button class="button secondary" data-start="emotional">${c.startEq}</button></div><div class="trust"><span>◷ ${DURATION[lang]}</span><span>◉ ${c.private}</span><span>✓ ${c.free}</span></div></div><div class="hero-art" aria-hidden="true"><div class="tile"><strong>20</strong><small>${c.iq}</small><p>${c.iqBody}</p></div><div class="tile"><strong>24</strong><small>${c.eq}</small><p>${c.eqBody}</p></div></div></section><section class="section tint"><div class="section-head"><p class="eyebrow">Cogniva Compass</p><h2>${c.how}</h2><p class="lead">${c.howLead}</p></div><div class="cards"><article class="card"><span class="number">01</span><h3>${c.s1}</h3><p>${c.s1b}</p></article><article class="card"><span class="number">02</span><h3>${c.s2}</h3><p>${c.s2b}</p></article><article class="card"><span class="number">03</span><h3>${c.s3}</h3><p>${c.s3b}</p></article></div></section><section class="section"><div class="section-head"><h2>${c.choose}</h2></div><div class="choice-grid"><article class="choice iq"><h3>${c.iq}</h3><p>${c.iqBody}</p><button class="button" data-start="cognitive">${c.startIq}</button></article><article class="choice eq"><h3>${c.eq}</h3><p>${c.eqBody}</p><button class="button" data-start="emotional">${c.startEq}</button></article></div></section><section class="section tint"><p>${c.disclaimer}</p></section>`;
  app.querySelectorAll("[data-start]").forEach(button=>button.onclick=()=>start(button.dataset.start));
  app.focus();
}

function showLoadError(){
  app.innerHTML=`<section class="quiz-shell"><p role="alert">${esc(LOAD_ERROR[lang])}</p><button class="button" id="restart">${t().restart}</button></section>`;
  document.querySelector("#restart").onclick=home;
  app.focus();
}

function start(track){
  const selector=window.COGNIVA_SELECTION_V1;
  const model=resultModel();
  if(!selector||typeof selector.getItems!=="function"||!model||typeof model.calculate!=="function"||!insightCopy()){showLoadError();return}
  try{
    currentItems=selector.getItems(track,lang);
  }catch(error){
    console.error("Cogniva form assembly failed",error);
    showLoadError();
    return;
  }
  const expected=track==="cognitive"?20:24;
  if(!Array.isArray(currentItems)||currentItems.length!==expected){showLoadError();return}
  mode=track;index=0;answers=[];renderQuestion();
}

function renderQuestion(){
  const c=t(),item=currentItems[index];
  const options=mode==="cognitive"?item.choices:item.responseOptions;
  app.innerHTML=`<section class="quiz-shell"><div class="quiz-meta"><span>${modeTitle(mode)}</span><span>${c.question} ${index+1} ${c.of} ${currentItems.length}</span></div><div class="progress" aria-hidden="true"><span style="width:${((index+1)/currentItems.length)*100}%"></span></div><p class="eyebrow">${esc(domainLabel(item.domain))}</p><h1 class="question">${esc(item.prompt)}</h1><form class="answers">${options.map((option,optionIndex)=>`<label class="answer"><input required type="radio" name="answer" value="${optionIndex}"><span>${esc(option)}</span></label>`).join("")}<button class="button" type="submit">${c.next}</button></form></section>`;
  app.querySelector("form").onsubmit=event=>{
    event.preventDefault();
    answers.push(Number(new FormData(event.currentTarget).get("answer")));
    index++;
    index<currentItems.length?renderQuestion():result();
  };
  app.focus();
}

function result(){
  const c=t(),completedMode=mode,otherMode=mode==="cognitive"?"emotional":"cognitive",insights=insightCopy(),model=resultModel();
  if(!insights||!model){showLoadError();return}
  let resultData;
  try{
    resultData=model.calculate(completedMode,currentItems,answers);
  }catch(error){
    console.error("Cogniva result calculation failed",error);
    showLoadError();
    return;
  }
  const {scores,overall}=resultData;
  const ranked=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  const overallBand=insights.overallBands[scoreBand(overall)];
  const highestScore=ranked[0][1],lowestScore=ranked[ranked.length-1][1];
  const strongestDomains=ranked.filter(([,value])=>value===highestScore).map(([domain])=>domain);
  const exploreDomains=ranked.filter(([,value])=>value===lowestScore).map(([domain])=>domain);
  const strongestLabel=strongestDomains.map(domain=>domainLabel(domain)).join(" · ");
  const exploreLabel=exploreDomains.map(domain=>domainLabel(domain)).join(" · ");
  const highlights=highestScore===lowestScore
    ?`<div class="result-highlights balanced"><article><span>${c.score}</span><strong>${esc(overallBand.label)}</strong><p>${esc(overallBand.summary)}</p></article></div>`
    :`<div class="result-highlights"><article><span>${c.strong}</span><strong>${esc(strongestLabel)}</strong><p>${esc(insights.domainDescriptions[strongestDomains[0]])}</p></article><article><span>${c.grow}</span><strong>${esc(exploreLabel)}</strong><p>${esc(insights.domainTips[exploreDomains[0]])}</p></article></div>`;
  const howPoints=insights.howPoints[completedMode];
  const domainCards=Object.entries(scores).map(([domain,value])=>{
    const band=scoreBand(value),bandCopy=insights.domainBands[completedMode][band];
    const bandLabel=insights.overallBands[band].label;
    return `<article class="domain-result"><div class="domain-result-head"><h3>${esc(domainLabel(domain))}</h3><strong aria-label="${esc(domainLabel(domain))}: ${value}/100">${value}<small>/100</small></strong></div><div class="bar domain-bar" role="progressbar" aria-label="${esc(domainLabel(domain))}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}" aria-valuetext="${esc(bandLabel)}"><i style="width:${value}%"></i></div><p class="domain-band">${esc(bandLabel)}</p><p>${esc(insights.domainDescriptions[domain])}</p><p>${esc(bandCopy)}</p><div class="next-step"><strong>${esc(insights.nextStepLabel)}</strong><span>${esc(insights.domainTips[domain])}</span></div></article>`;
  }).join("");

  try{window.COGNIVA_SELECTION_V1.completeForm(completedMode)}catch(error){console.warn("Could not clear active Cogniva form",error)}
  answers=[];currentItems=[];

  app.innerHTML=`<section class="result" aria-labelledby="resultTitle"><p class="eyebrow">${modeTitle(completedMode)}</p><h1 id="resultTitle" tabindex="-1">${c.result}</h1><div class="result-overview"><div class="score-wrap"><div class="score" aria-label="${c.score}: ${overall}">${overall}</div><span>${c.score}</span></div><div class="result-summary"><p class="result-band">${esc(overallBand.label)}</p><h2>${esc(insights.interpretationTitle)}</h2><p class="result-lead">${esc(insights.interpretationLead[completedMode])}</p><p>${esc(overallBand.summary)}</p></div></div>${highlights}<section class="how-to" aria-labelledby="howTitle"><h2 id="howTitle">${esc(insights.howTitle)}</h2><ul>${howPoints.map(point=>`<li><span aria-hidden="true">✓</span><span>${esc(point)}</span></li>`).join("")}</ul></section><section class="domain-analysis" aria-labelledby="domainAnalysisTitle"><h2 id="domainAnalysisTitle">${esc(insights.domainAnalysisTitle)}</h2><div class="domain-results">${domainCards}</div></section><aside class="result-note"><h2>${NOTE_LABEL[lang]}</h2><p>${c.disclaimer}</p></aside><div class="actions"><button class="button" id="otherAssessment">${otherMode==="cognitive"?c.startIq:c.startEq}</button><button class="button secondary" id="restart">${c.restart}</button></div></section>`;
  app.querySelector("#otherAssessment").onclick=()=>start(otherMode);
  app.querySelector("#restart").onclick=home;
  app.querySelector("#resultTitle").focus({preventScroll:true});
  window.scrollTo({top:0,behavior:"auto"});
}

select.onchange=()=>{
  lang=select.value;
  safeStorageSet("cc_lang",lang);
  applyLang();
  home();
};
const brand=document.querySelector(".brand");
if(brand)brand.onclick=event=>{event.preventDefault();home()};
applyLang();
home();
