(function () {
  "use strict";

  if (window.COGNIVA_COMPASS_APP_LOADED) return;
  window.COGNIVA_COMPASS_APP_LOADED = true;

  var VERSION = "20260731-legal-commerce-v4";
  var appScript = document.currentScript;
  var assetBase = appScript && appScript.src ? new URL(".", appScript.src) : new URL("/", window.location.href);
  var serviceOrigin = assetBase.origin;
  var SUPPORTED_LANGS = ["hu", "en", "de", "it", "es", "zh", "ja", "ar", "pl", "pt", "fr"];
  var DOMAIN_ORDER = {
    cognitive: ["patterns", "workingMemory", "numericalReasoning", "flexibleThinking"],
    emotional: ["selfAwareness", "regulation", "empathy", "relationships"]
  };
  var INTL_LOCALES = { hu: "hu-HU", en: "en-US", de: "de-DE", it: "it-IT", es: "es-ES", zh: "zh-CN", ja: "ja-JP", ar: "ar", pl: "pl-PL", pt: "pt-PT", fr: "fr-FR" };
  var ORDER_SESSION_KEY = "cogniva.order-status.v1";
  var CHECKOUT_RECOVERY_KEY = "cogniva.checkout-recovery.v1";
  var PREASSESSMENT_CONSENT_KEY = "cogniva.preassessment-consent.v1";
  var CHECKOUT_RECOVERY_TTL_MS = 60 * 60 * 1000;
  var LANGUAGE_NAMES = {
    hu: "Magyar",
    en: "English",
    de: "Deutsch",
    it: "Italiano",
    es: "Español",
    zh: "中文",
    ja: "日本語",
    ar: "العربية",
    pl: "Polski",
    pt: "Português",
    fr: "Français"
  };
  var EMAIL_CONFIRM_COPY = {
    en: { label: "Re-enter email address", mismatch: "The two email addresses must match." },
    hu: { label: "Email-cím újra", mismatch: "A két email-címnek egyeznie kell." },
    de: { label: "E-Mail-Adresse wiederholen", mismatch: "Die beiden E-Mail-Adressen müssen übereinstimmen." },
    it: { label: "Ripeti l’indirizzo email", mismatch: "I due indirizzi email devono coincidere." },
    es: { label: "Repite el correo electrónico", mismatch: "Las dos direcciones de correo deben coincidir." },
    zh: { label: "再次输入电子邮箱", mismatch: "两次输入的电子邮箱必须一致。" },
    ja: { label: "メールアドレスを再入力", mismatch: "2つのメールアドレスが一致している必要があります。" },
    ar: { label: "تأكيد البريد الإلكتروني", mismatch: "يجب أن يتطابق عنوانا البريد الإلكتروني." },
    pl: { label: "Powtórz adres e-mail", mismatch: "Oba adresy e-mail muszą być takie same." },
    pt: { label: "Confirme o endereço de email", mismatch: "Os dois endereços de email têm de coincidir." },
    fr: { label: "Confirmez l’adresse email", mismatch: "Les deux adresses email doivent être identiques." }
  };

  var FLOW_COPY = {
    en: {
      legalUnavailable: "The required legal information has not yet been approved and published. The reflection cannot start.",
      legalSubmitError: "Your choices could not be recorded securely. Please try again shortly.",
      legalSaving: "Recording your choices securely…",
      packageLegend: "Choose your report package",
      singleName: "One reflection report",
      singleDescription: "A personalized report for the reflection shown on this page.",
      bundleName: "Cognitive + emotional bundle",
      bundleDescription: "Two personalized reports in one order.",
      bundleLocked: "Complete the other reflection before choosing this package.",
      bundleReady: "Both completed reflections are included.",
      orderAndPay: "Order with obligation to pay",
      consentExpired: "Your assessment consent has expired. Review it again before payment."
    },
    hu: {
      legalUnavailable: "A szükséges jogi tájékoztatás még nincs jóváhagyva és közzétéve, ezért az önreflexió nem indítható el.",
      legalSubmitError: "A választásaidat nem sikerült biztonságosan rögzíteni. Próbáld újra rövidesen.",
      legalSaving: "A választásaid biztonságos rögzítése…",
      packageLegend: "Válaszd ki a riportcsomagot",
      singleName: "Egy önreflexiós riport",
      singleDescription: "Személyre szabott riport az ezen az oldalon látható önreflexióról.",
      bundleName: "Kognitív + érzelmi csomag",
      bundleDescription: "Két személyre szabott riport egyetlen rendelésben.",
      bundleLocked: "A csomag kiválasztásához előbb végezd el a másik önreflexiót is.",
      bundleReady: "Mindkét befejezett önreflexió szerepel a csomagban.",
      orderAndPay: "Fizetési kötelezettséggel járó megrendelés",
      consentExpired: "A kérdőívhez adott hozzájárulásod lejárt. Fizetés előtt tekintsd át újra."
    },
    de: {
      legalUnavailable: "Die erforderlichen rechtlichen Informationen sind noch nicht genehmigt und veröffentlicht. Die Reflexion kann nicht gestartet werden.",
      legalSubmitError: "Deine Auswahl konnte nicht sicher gespeichert werden. Bitte versuche es in Kürze erneut.",
      legalSaving: "Deine Auswahl wird sicher gespeichert…",
      packageLegend: "Berichtspaket auswählen",
      singleName: "Ein Reflexionsbericht",
      singleDescription: "Ein personalisierter Bericht zur auf dieser Seite gezeigten Reflexion.",
      bundleName: "Kognitives + emotionales Paket",
      bundleDescription: "Zwei personalisierte Berichte in einer Bestellung.",
      bundleLocked: "Schließe zuerst die andere Reflexion ab, um dieses Paket zu wählen.",
      bundleReady: "Beide abgeschlossenen Reflexionen sind enthalten.",
      orderAndPay: "Zahlungspflichtig bestellen",
      consentExpired: "Deine Einwilligung zur Reflexion ist abgelaufen. Bitte prüfe sie vor der Zahlung erneut."
    },
    it: {
      legalUnavailable: "Le informazioni legali necessarie non sono ancora state approvate e pubblicate. Non è possibile iniziare la riflessione.",
      legalSubmitError: "Non è stato possibile registrare le tue scelte in modo sicuro. Riprova tra poco.",
      legalSaving: "Registrazione sicura delle tue scelte…",
      packageLegend: "Scegli il pacchetto di report",
      singleName: "Un report di riflessione",
      singleDescription: "Un report personalizzato per la riflessione mostrata in questa pagina.",
      bundleName: "Pacchetto cognitivo + emotivo",
      bundleDescription: "Due report personalizzati in un unico ordine.",
      bundleLocked: "Completa prima l’altra riflessione per scegliere questo pacchetto.",
      bundleReady: "Sono incluse entrambe le riflessioni completate.",
      orderAndPay: "Ordine con obbligo di pagamento",
      consentExpired: "Il consenso alla riflessione è scaduto. Rivedilo prima del pagamento."
    },
    es: {
      legalUnavailable: "La información legal necesaria aún no ha sido aprobada y publicada. No se puede iniciar la reflexión.",
      legalSubmitError: "No se pudieron registrar tus elecciones de forma segura. Inténtalo de nuevo en breve.",
      legalSaving: "Registrando tus elecciones de forma segura…",
      packageLegend: "Elige el paquete de informes",
      singleName: "Un informe de reflexión",
      singleDescription: "Un informe personalizado para la reflexión mostrada en esta página.",
      bundleName: "Paquete cognitivo + emocional",
      bundleDescription: "Dos informes personalizados en un solo pedido.",
      bundleLocked: "Completa primero la otra reflexión para elegir este paquete.",
      bundleReady: "Se incluyen las dos reflexiones completadas.",
      orderAndPay: "Pedido con obligación de pago",
      consentExpired: "Tu consentimiento para la reflexión ha caducado. Revísalo antes del pago."
    },
    zh: {
      legalUnavailable: "所需法律信息尚未获批并发布，因此目前无法开始反思问卷。",
      legalSubmitError: "无法安全记录你的选择，请稍后重试。",
      legalSaving: "正在安全记录你的选择…",
      packageLegend: "选择报告套餐",
      singleName: "单项反思报告",
      singleDescription: "针对本页所示反思结果的个性化报告。",
      bundleName: "认知 + 情绪组合",
      bundleDescription: "一次购买两份个性化报告。",
      bundleLocked: "请先完成另一项反思问卷，再选择此套餐。",
      bundleReady: "套餐包含两项已完成的反思问卷。",
      orderAndPay: "确认下单并承担付款义务",
      consentExpired: "你的问卷同意凭证已过期，请在付款前重新查看并确认。"
    },
    ja: {
      legalUnavailable: "必要な法的情報がまだ承認・公開されていないため、リフレクションを開始できません。",
      legalSubmitError: "選択内容を安全に記録できませんでした。しばらくしてから再度お試しください。",
      legalSaving: "選択内容を安全に記録しています…",
      packageLegend: "レポートパッケージを選択",
      singleName: "リフレクションレポート1件",
      singleDescription: "このページに表示されているリフレクションの個別レポートです。",
      bundleName: "認知 + 感情セット",
      bundleDescription: "2件の個別レポートを一度に注文できます。",
      bundleLocked: "このセットを選ぶには、もう一方のリフレクションも完了してください。",
      bundleReady: "完了した2つのリフレクションが含まれます。",
      orderAndPay: "支払い義務を伴う注文を確定",
      consentExpired: "リフレクションへの同意が期限切れです。支払い前にもう一度確認してください。"
    },
    ar: {
      legalUnavailable: "لم تتم بعد الموافقة على المعلومات القانونية المطلوبة ونشرها، لذلك لا يمكن بدء الاستبيان التأملي.",
      legalSubmitError: "تعذر تسجيل اختياراتك بأمان. يُرجى المحاولة مرة أخرى بعد قليل.",
      legalSaving: "جارٍ تسجيل اختياراتك بأمان…",
      packageLegend: "اختر باقة التقرير",
      singleName: "تقرير تأملي واحد",
      singleDescription: "تقرير مخصص للاستبيان التأملي المعروض في هذه الصفحة.",
      bundleName: "باقة الإدراك + العاطفة",
      bundleDescription: "تقريران مخصصان في طلب واحد.",
      bundleLocked: "أكمل الاستبيان التأملي الآخر أولاً لاختيار هذه الباقة.",
      bundleReady: "تتضمن الباقة الاستبيانين المكتملين.",
      orderAndPay: "طلب مع الالتزام بالدفع",
      consentExpired: "انتهت صلاحية موافقتك على الاستبيان. راجعها مجددًا قبل الدفع."
    },
    pl: {
      legalUnavailable: "Wymagane informacje prawne nie zostały jeszcze zatwierdzone i opublikowane. Nie można rozpocząć autorefleksji.",
      legalSubmitError: "Nie udało się bezpiecznie zapisać Twoich wyborów. Spróbuj ponownie za chwilę.",
      legalSaving: "Bezpieczne zapisywanie Twoich wyborów…",
      packageLegend: "Wybierz pakiet raportu",
      singleName: "Jeden raport z autorefleksji",
      singleDescription: "Spersonalizowany raport dotyczący autorefleksji pokazanej na tej stronie.",
      bundleName: "Pakiet poznawczy + emocjonalny",
      bundleDescription: "Dwa spersonalizowane raporty w jednym zamówieniu.",
      bundleLocked: "Najpierw ukończ drugą autorefleksję, aby wybrać ten pakiet.",
      bundleReady: "Pakiet obejmuje obie ukończone autorefleksje.",
      orderAndPay: "Zamówienie z obowiązkiem zapłaty",
      consentExpired: "Twoja zgoda na autorefleksję wygasła. Przejrzyj ją ponownie przed płatnością."
    },
    pt: {
      legalUnavailable: "A informação jurídica necessária ainda não foi aprovada e publicada. Não é possível iniciar a reflexão.",
      legalSubmitError: "Não foi possível registar as suas escolhas em segurança. Tente novamente dentro de momentos.",
      legalSaving: "A registar as suas escolhas em segurança…",
      packageLegend: "Escolha o pacote de relatório",
      singleName: "Um relatório de reflexão",
      singleDescription: "Um relatório personalizado para a reflexão apresentada nesta página.",
      bundleName: "Pacote cognitivo + emocional",
      bundleDescription: "Dois relatórios personalizados numa única encomenda.",
      bundleLocked: "Conclua primeiro a outra reflexão para escolher este pacote.",
      bundleReady: "As duas reflexões concluídas estão incluídas.",
      orderAndPay: "Encomenda com obrigação de pagamento",
      consentExpired: "O seu consentimento para a reflexão expirou. Reveja-o antes do pagamento."
    },
    fr: {
      legalUnavailable: "Les informations juridiques requises ne sont pas encore approuvées et publiées. La réflexion ne peut pas commencer.",
      legalSubmitError: "Vos choix n’ont pas pu être enregistrés de manière sécurisée. Réessayez dans un instant.",
      legalSaving: "Enregistrement sécurisé de vos choix…",
      packageLegend: "Choisissez votre formule de rapport",
      singleName: "Un rapport de réflexion",
      singleDescription: "Un rapport personnalisé pour la réflexion affichée sur cette page.",
      bundleName: "Formule cognitive + émotionnelle",
      bundleDescription: "Deux rapports personnalisés dans une seule commande.",
      bundleLocked: "Terminez d’abord l’autre réflexion pour choisir cette formule.",
      bundleReady: "Les deux réflexions terminées sont incluses.",
      orderAndPay: "Commande avec obligation de paiement",
      consentExpired: "Votre consentement à la réflexion a expiré. Consultez-le à nouveau avant le paiement."
    }
  };

  var I18N = {
    en: {
      languageLabel: "Language", languageTitle: "Choose your language", languageHelp: "The complete experience is available in 11 languages.", close: "Close", skip: "Skip to content", by: "by NeuroMap",
      eyebrow: "Two perspectives · one thoughtful pause", title: "Notice how you approach tasks and emotions.", lead: "A private cognitive task sample and emotional reflection for adults—designed for insight, not labels.",
      cognitive: "Cognitive task sample", emotional: "Emotional reflection", cognitiveBody: "Explore your approach to patterns, working memory, numerical reasoning and flexible thinking.", emotionalBody: "Reflect on current habits around self-awareness, regulation, empathy and relationships.", startCognitive: "Start cognitive tasks", startEmotional: "Start emotional reflection", duration: "20 or 24 items · about 8–12 minutes", private: "Answers stay here unless you choose a paid report", account: "No account needed for the free reflection",
      howTitle: "A clear, unhurried process", howLead: "Choose one path or complete both. Each result is a snapshot of this moment—not an IQ, EQ or clinical score.", chooseStep: "Choose", chooseStepBody: "Begin with the kind of reflection that feels most useful today.", answerStep: "Respond", answerStepBody: "Work at your own pace, with one item on screen at a time.", reflectStep: "Reflect", reflectStepBody: "See a descriptive pattern and small, practical prompts.", chooseTitle: "Choose your starting point", taskKicker: "20 varied tasks", reflectionKicker: "24 self-report prompts",
      noteTitle: "Important context", disclaimer: "Cogniva Compass is an educational reflection for adults. It is not a standardized IQ test, does not produce a clinical EQ score, does not diagnose, and does not replace a qualified professional assessment.",
      question: "Item", of: "of", next: "Continue", back: "Back", leaveWarning: "Your current answers will be lost. Do you want to leave this reflection?", loading: "Preparing your reflection…", loadError: "The item bank could not be loaded. Please refresh the page and try again.",
      resultTitle: "Your reflection snapshot", snapshot: "Current snapshot", mostVisible: "Most visible in this sample", practiceFocus: "A possible practice focus", balancedLabel: "An even pattern in this sample", balancedBody: "The four areas appeared at a similar level here. Read the individual prompts as starting points, not rankings.", returnHome: "Return to the start",
      reportTitle: "Take the reflection with you", reportLead: "Choose a paid, personalized report to receive a fuller, positive interpretation and practical prompts by email. Your submitted answers are checked and scored again on the server.", email: "Email address", emailHint: "We use this address to deliver this report and essential order messages.", age: "I confirm that I am at least 18 years old.", privacyPre: "I have read the", privacyLink: "privacy notice", termsPre: "I accept the", termsLink: "terms of purchase", immediate: "I expressly request delivery or performance to begin before any applicable withdrawal period ends, and I acknowledge that I have read the consequences described in the approved terms of purchase.", aiConsent: "Optional: I consent to OpenAI-assisted wording of my report. Deterministic scores remain the source of truth.", optional: "optional", checkout: "Continue to secure payment", configLoading: "Checking report availability…", notAvailable: "The paid email report is not available yet. Your on-screen reflection remains free and complete.", pricePrefix: "Personalized email report", paymentNote: "Secure payment is handled by Stripe. No marketing consent is bundled with your order.", checkoutError: "Checkout could not be started. Please check the form or try again shortly.", checkoutCancelled: "Payment was cancelled. Nothing was charged, and your reflection is still available below.", taxAtCheckout: "Any applicable tax is calculated and shown before payment.",
      orderTitle: "Your report order", orderChecking: "Checking the secure payment confirmation…", orderPending: "Payment confirmation is still pending. This page will keep checking.", orderProcessing: "Payment is confirmed. Your report is being prepared and will be emailed to you.", orderSent: "Your report has been sent to the email address used at checkout.", orderFailed: "We could not complete the report delivery. Please use the contact link below so we can help.", orderInvalid: "This secure order link is incomplete or no longer available.", retry: "Check again",
      footer: "Private by design · Educational, non-clinical reflection", privacy: "Privacy", terms: "Terms", contact: "Contact",
      domains: { patterns: "Patterns", workingMemory: "Working memory", numericalReasoning: "Numerical reasoning", flexibleThinking: "Flexible thinking", selfAwareness: "Self-awareness", regulation: "Regulation", empathy: "Empathy", relationships: "Relationships" }
    },
    hu: {
      languageLabel: "Nyelv", languageTitle: "Válassz nyelvet", languageHelp: "A teljes élmény 11 nyelven érhető el.", close: "Bezárás", skip: "Ugrás a tartalomhoz", by: "a NeuroMaptől",
      eyebrow: "Két nézőpont · egy figyelmes megállás", title: "Figyeld meg, hogyan közelítesz a feladatokhoz és az érzelmekhez.", lead: "Privát kognitív feladatminta és érzelmi önreflexió felnőtteknek – felismerésekhez, nem címkékhez.",
      cognitive: "Kognitív feladatminta", emotional: "Érzelmi önreflexió", cognitiveBody: "Fedezd fel, hogyan közelítesz a mintázatokhoz, a munkamemóriához, a numerikus következtetéshez és a rugalmas gondolkodáshoz.", emotionalBody: "Gondold át jelenlegi szokásaidat az önismeret, a szabályozás, az empátia és a kapcsolatok terén.", startCognitive: "Kognitív feladatok indítása", startEmotional: "Érzelmi önreflexió indítása", duration: "20 vagy 24 tétel · körülbelül 8–12 perc", private: "A válaszok itt maradnak, kivéve ha fizetős riportot kérsz", account: "Az ingyenes önreflexióhoz nem kell fiók",
      howTitle: "Átlátható, nyugodt folyamat", howLead: "Válassz egy irányt, vagy végezd el mindkettőt. Az eredmény pillanatfelvétel – nem IQ-, EQ- vagy klinikai pontszám.", chooseStep: "Válassz", chooseStepBody: "Kezdd azzal a reflexióval, amelyik ma hasznosabbnak tűnik.", answerStep: "Válaszolj", answerStepBody: "Haladj a saját tempódban, egyszerre egy tétellel.", reflectStep: "Gondold át", reflectStepBody: "Leíró mintát és apró, gyakorlati ötleteket kapsz.", chooseTitle: "Válaszd ki a kiindulópontot", taskKicker: "20 változatos feladat", reflectionKicker: "24 önjellemző állítás",
      noteTitle: "Fontos háttér", disclaimer: "A Cogniva Compass felnőtteknek szóló oktatási önreflexió. Nem standardizált IQ-teszt, nem ad klinikai EQ-pontszámot, nem állít fel diagnózist, és nem helyettesíti képzett szakember vizsgálatát.",
      question: "Tétel", of: "/", next: "Tovább", back: "Vissza", leaveWarning: "A jelenlegi válaszaid elvesznek. Biztosan kilépsz ebből az önreflexióból?", loading: "Az önreflexió előkészítése…", loadError: "A kérdésbank nem tölthető be. Frissítsd az oldalt, majd próbáld újra.",
      resultTitle: "Az önreflexiós pillanatképed", snapshot: "Jelenlegi pillanatkép", mostVisible: "Ebben a mintában leginkább látható", practiceFocus: "Lehetséges gyakorlási irány", balancedLabel: "Kiegyenlített minta ebben a felvételben", balancedBody: "A négy terület itt hasonló szinten jelent meg. Az egyes ötleteket kiindulópontként, ne rangsorként olvasd.", returnHome: "Vissza a kezdőlapra",
      reportTitle: "Vidd magaddal a felismeréseket", reportLead: "Fizetős, személyre szabott riportban részletesebb, pozitív értelmezést és gyakorlati ötleteket kaphatsz emailben. A beküldött válaszokat a szerver újra ellenőrzi és pontozza.", email: "Email-cím", emailHint: "Ezt a címet a riport és a rendeléshez szükséges üzenetek kézbesítésére használjuk.", age: "Megerősítem, hogy betöltöttem a 18. életévemet.", privacyPre: "Elolvastam az", privacyLink: "adatkezelési tájékoztatót", termsPre: "Elfogadom a", termsLink: "vásárlási feltételeket", immediate: "Kifejezetten kérem, hogy a teljesítés az esetlegesen alkalmazandó elállási idő lejárta előtt megkezdődjön, és tudomásul veszem, hogy elolvastam ennek következményeit a jóváhagyott vásárlási feltételekben.", aiConsent: "Nem kötelező: hozzájárulok, hogy a riport szövegezését az OpenAI segítse. A determinisztikus pontszámítás marad az elsődleges.", optional: "nem kötelező", checkout: "Tovább a biztonságos fizetéshez", configLoading: "A riport elérhetőségének ellenőrzése…", notAvailable: "A fizetős email-riport még nem érhető el. A képernyőn látható önreflexió továbbra is ingyenes és teljes.", pricePrefix: "Személyre szabott email-riport", paymentNote: "A biztonságos fizetést a Stripe kezeli. A rendeléshez nem kapcsolunk marketing-hozzájárulást.", checkoutError: "A fizetés nem indítható el. Ellenőrizd az űrlapot, vagy próbáld újra rövidesen.", checkoutCancelled: "A fizetést megszakítottad. Terhelés nem történt, az önreflexiód pedig lent továbbra is elérhető.", taxAtCheckout: "Az esetleges adót a fizetés előtt számítjuk ki és jelenítjük meg.",
      orderTitle: "A riportmegrendelésed", orderChecking: "A biztonságos fizetési visszaigazolás ellenőrzése…", orderPending: "A fizetés visszaigazolása még folyamatban van. Az oldal tovább ellenőrzi.", orderProcessing: "A fizetés sikeres. A riport készül, és emailben küldjük el.", orderSent: "A riportot elküldtük a fizetésnél megadott email-címre.", orderFailed: "A riport kézbesítését nem sikerült befejezni. Kérj segítséget az alábbi kapcsolatfelvételi linken.", orderInvalid: "Ez a biztonságos rendelési hivatkozás hiányos vagy már nem érhető el.", retry: "Újraellenőrzés",
      footer: "Adatvédelemre tervezve · Oktatási, nem klinikai önreflexió", privacy: "Adatvédelem", terms: "Feltételek", contact: "Kapcsolat",
      domains: { patterns: "Mintázatok", workingMemory: "Munkamemória", numericalReasoning: "Numerikus következtetés", flexibleThinking: "Rugalmas gondolkodás", selfAwareness: "Önismeret", regulation: "Érzelemszabályozás", empathy: "Empátia", relationships: "Kapcsolatok" }
    },
    de: {
      languageLabel: "Sprache", languageTitle: "Sprache wählen", languageHelp: "Das vollständige Erlebnis ist in 11 Sprachen verfügbar.", close: "Schließen", skip: "Zum Inhalt springen", by: "von NeuroMap",
      eyebrow: "Zwei Perspektiven · eine bewusste Pause", title: "Beobachte, wie du Aufgaben und Emotionen begegnest.", lead: "Eine private kognitive Aufgabenstichprobe und emotionale Reflexion für Erwachsene – für Einblicke, nicht für Etiketten.",
      cognitive: "Kognitive Aufgabenstichprobe", emotional: "Emotionale Reflexion", cognitiveBody: "Erkunde deinen Umgang mit Mustern, Arbeitsgedächtnis, Zahlenlogik und flexiblem Denken.", emotionalBody: "Reflektiere aktuelle Gewohnheiten bei Selbstwahrnehmung, Regulation, Empathie und Beziehungen.", startCognitive: "Kognitive Aufgaben starten", startEmotional: "Emotionale Reflexion starten", duration: "20 oder 24 Items · etwa 8–12 Minuten", private: "Antworten bleiben hier, außer du wählst einen Bezahlbericht", account: "Für die kostenlose Reflexion ist kein Konto nötig",
      howTitle: "Ein klarer, ruhiger Ablauf", howLead: "Wähle einen Weg oder bearbeite beide. Jedes Ergebnis ist eine Momentaufnahme – kein IQ-, EQ- oder klinischer Wert.", chooseStep: "Wählen", chooseStepBody: "Beginne mit der Reflexion, die heute am hilfreichsten wirkt.", answerStep: "Antworten", answerStepBody: "Arbeite in deinem Tempo, mit jeweils einem Item.", reflectStep: "Reflektieren", reflectStepBody: "Erhalte ein beschreibendes Muster und kleine praktische Impulse.", chooseTitle: "Wähle deinen Ausgangspunkt", taskKicker: "20 abwechslungsreiche Aufgaben", reflectionKicker: "24 Selbstaussagen",
      noteTitle: "Wichtiger Kontext", disclaimer: "Cogniva Compass ist eine pädagogische Reflexion für Erwachsene. Es ist kein standardisierter IQ-Test, liefert keinen klinischen EQ-Wert, diagnostiziert nicht und ersetzt keine qualifizierte fachliche Beurteilung.",
      question: "Item", of: "von", next: "Weiter", back: "Zurück", leaveWarning: "Deine aktuellen Antworten gehen verloren. Möchtest du diese Reflexion verlassen?", loading: "Deine Reflexion wird vorbereitet…", loadError: "Die Itembank konnte nicht geladen werden. Bitte aktualisiere die Seite und versuche es erneut.",
      resultTitle: "Deine Reflexions-Momentaufnahme", snapshot: "Aktuelle Momentaufnahme", mostVisible: "In dieser Stichprobe am deutlichsten", practiceFocus: "Ein möglicher Übungsfokus", balancedLabel: "Ein ausgeglichenes Muster in dieser Stichprobe", balancedBody: "Die vier Bereiche zeigten sich hier auf ähnlichem Niveau. Nutze die einzelnen Impulse als Ausgangspunkte, nicht als Rangliste.", returnHome: "Zurück zum Start",
      reportTitle: "Nimm die Reflexion mit", reportLead: "Ein kostenpflichtiger personalisierter Bericht liefert dir per E-Mail eine ausführlichere, positive Einordnung und praktische Impulse. Deine übermittelten Antworten werden auf dem Server erneut geprüft und bewertet.", email: "E-Mail-Adresse", emailHint: "Wir verwenden diese Adresse zur Zustellung des Berichts und notwendiger Bestellnachrichten.", age: "Ich bestätige, dass ich mindestens 18 Jahre alt bin.", privacyPre: "Ich habe den", privacyLink: "Datenschutzhinweis", termsPre: "Ich akzeptiere die", termsLink: "Kaufbedingungen", immediate: "Ich verlange ausdrücklich, dass die Lieferung oder Leistung vor Ablauf einer gegebenenfalls geltenden Widerrufsfrist beginnt, und bestätige, die in den genehmigten Kaufbedingungen beschriebenen Folgen gelesen zu haben.", aiConsent: "Optional: Ich stimme einer OpenAI-unterstützten Formulierung meines Berichts zu. Die deterministischen Werte bleiben maßgeblich.", optional: "optional", checkout: "Weiter zur sicheren Zahlung", configLoading: "Berichtsverfügbarkeit wird geprüft…", notAvailable: "Der kostenpflichtige E-Mail-Bericht ist noch nicht verfügbar. Deine Bildschirmreflexion bleibt kostenlos und vollständig.", pricePrefix: "Personalisierter E-Mail-Bericht", paymentNote: "Die sichere Zahlung wird von Stripe abgewickelt. Mit der Bestellung ist keine Werbeeinwilligung verbunden.", checkoutError: "Der Bezahlvorgang konnte nicht gestartet werden. Prüfe das Formular oder versuche es gleich noch einmal.", checkoutCancelled: "Die Zahlung wurde abgebrochen. Es wurde nichts belastet und deine Reflexion bleibt unten verfügbar.", taxAtCheckout: "Anfallende Steuern werden vor der Zahlung berechnet und angezeigt.",
      orderTitle: "Deine Berichtsbestellung", orderChecking: "Die sichere Zahlungsbestätigung wird geprüft…", orderPending: "Die Zahlungsbestätigung steht noch aus. Diese Seite prüft weiter.", orderProcessing: "Die Zahlung ist bestätigt. Dein Bericht wird erstellt und per E-Mail gesendet.", orderSent: "Dein Bericht wurde an die beim Bezahlen angegebene E-Mail-Adresse gesendet.", orderFailed: "Die Berichtszustellung konnte nicht abgeschlossen werden. Nutze bitte den Kontaktlink unten.", orderInvalid: "Dieser sichere Bestelllink ist unvollständig oder nicht mehr verfügbar.", retry: "Erneut prüfen",
      footer: "Datenschutzorientiert · Pädagogische, nicht klinische Reflexion", privacy: "Datenschutz", terms: "Bedingungen", contact: "Kontakt",
      domains: { patterns: "Muster", workingMemory: "Arbeitsgedächtnis", numericalReasoning: "Zahlenlogik", flexibleThinking: "Flexibles Denken", selfAwareness: "Selbstwahrnehmung", regulation: "Regulation", empathy: "Empathie", relationships: "Beziehungen" }
    },
    it: {
      languageLabel: "Lingua", languageTitle: "Scegli la lingua", languageHelp: "L’esperienza completa è disponibile in 11 lingue.", close: "Chiudi", skip: "Vai al contenuto", by: "di NeuroMap",
      eyebrow: "Due prospettive · una pausa consapevole", title: "Osserva come affronti compiti ed emozioni.", lead: "Un campione privato di compiti cognitivi e una riflessione emotiva per adulti, pensati per offrire spunti, non etichette.",
      cognitive: "Campione di compiti cognitivi", emotional: "Riflessione emotiva", cognitiveBody: "Esplora il tuo approccio a schemi, memoria di lavoro, ragionamento numerico e pensiero flessibile.", emotionalBody: "Rifletti sulle abitudini attuali di autoconsapevolezza, regolazione, empatia e relazioni.", startCognitive: "Inizia i compiti cognitivi", startEmotional: "Inizia la riflessione emotiva", duration: "20 o 24 item · circa 8–12 minuti", private: "Le risposte restano qui, salvo la scelta del rapporto a pagamento", account: "Nessun account per la riflessione gratuita",
      howTitle: "Un percorso chiaro e tranquillo", howLead: "Scegli un percorso o completali entrambi. Ogni risultato è un’istantanea, non un punteggio IQ, EQ o clinico.", chooseStep: "Scegli", chooseStepBody: "Inizia dalla riflessione che oggi ti sembra più utile.", answerStep: "Rispondi", answerStepBody: "Procedi al tuo ritmo, un item alla volta.", reflectStep: "Rifletti", reflectStepBody: "Ricevi un quadro descrittivo e piccoli suggerimenti pratici.", chooseTitle: "Scegli il punto di partenza", taskKicker: "20 compiti vari", reflectionKicker: "24 affermazioni personali",
      noteTitle: "Contesto importante", disclaimer: "Cogniva Compass è una riflessione educativa per adulti. Non è un test IQ standardizzato, non produce un punteggio EQ clinico, non formula diagnosi e non sostituisce una valutazione professionale qualificata.",
      question: "Item", of: "di", next: "Continua", back: "Indietro", leaveWarning: "Le risposte attuali andranno perse. Vuoi lasciare questa riflessione?", loading: "Preparazione della riflessione…", loadError: "Non è stato possibile caricare la banca degli item. Aggiorna la pagina e riprova.",
      resultTitle: "La tua istantanea di riflessione", snapshot: "Istantanea attuale", mostVisible: "Più evidente in questo campione", practiceFocus: "Un possibile ambito di pratica", balancedLabel: "Un profilo uniforme in questo campione", balancedBody: "Qui le quattro aree sono apparse a livelli simili. Leggi i singoli suggerimenti come punti di partenza, non come classifica.", returnHome: "Torna all’inizio",
      reportTitle: "Porta con te la riflessione", reportLead: "Scegli un rapporto personalizzato a pagamento per ricevere via email un’interpretazione più ampia e positiva con suggerimenti pratici. Le risposte inviate vengono ricontrollate e ricalcolate sul server.", email: "Indirizzo email", emailHint: "Lo usiamo per consegnare il rapporto e i messaggi essenziali sull’ordine.", age: "Confermo di avere almeno 18 anni.", privacyPre: "Ho letto l’", privacyLink: "informativa sulla privacy", termsPre: "Accetto le", termsLink: "condizioni di acquisto", immediate: "Chiedo espressamente che la fornitura o la prestazione inizi prima della scadenza dell’eventuale periodo di recesso applicabile e confermo di aver letto le conseguenze descritte nelle condizioni di acquisto approvate.", aiConsent: "Facoltativo: acconsento alla formulazione del rapporto assistita da OpenAI. I punteggi deterministici restano la fonte primaria.", optional: "facoltativo", checkout: "Vai al pagamento sicuro", configLoading: "Verifica della disponibilità del rapporto…", notAvailable: "Il rapporto email a pagamento non è ancora disponibile. La riflessione a schermo resta gratuita e completa.", pricePrefix: "Rapporto personalizzato via email", paymentNote: "Il pagamento sicuro è gestito da Stripe. Nessun consenso marketing è associato all’ordine.", checkoutError: "Impossibile avviare il pagamento. Controlla il modulo o riprova tra poco.", checkoutCancelled: "Il pagamento è stato annullato. Non è stato addebitato nulla e la tua riflessione resta disponibile qui sotto.", taxAtCheckout: "Le eventuali imposte vengono calcolate e mostrate prima del pagamento.",
      orderTitle: "Il tuo ordine del rapporto", orderChecking: "Verifica della conferma di pagamento sicura…", orderPending: "La conferma del pagamento è ancora in sospeso. La pagina continuerà a verificare.", orderProcessing: "Pagamento confermato. Il rapporto è in preparazione e verrà inviato via email.", orderSent: "Il rapporto è stato inviato all’indirizzo email usato per il pagamento.", orderFailed: "Non è stato possibile completare la consegna. Usa il contatto qui sotto per ricevere assistenza.", orderInvalid: "Questo link sicuro dell’ordine è incompleto o non è più disponibile.", retry: "Controlla di nuovo",
      footer: "Privacy fin dalla progettazione · Riflessione educativa, non clinica", privacy: "Privacy", terms: "Condizioni", contact: "Contatti",
      domains: { patterns: "Schemi", workingMemory: "Memoria di lavoro", numericalReasoning: "Ragionamento numerico", flexibleThinking: "Pensiero flessibile", selfAwareness: "Autoconsapevolezza", regulation: "Regolazione", empathy: "Empatia", relationships: "Relazioni" }
    },
    es: {
      languageLabel: "Idioma", languageTitle: "Elige tu idioma", languageHelp: "La experiencia completa está disponible en 11 idiomas.", close: "Cerrar", skip: "Ir al contenido", by: "de NeuroMap",
      eyebrow: "Dos perspectivas · una pausa consciente", title: "Observa cómo abordas las tareas y las emociones.", lead: "Una muestra privada de tareas cognitivas y una reflexión emocional para adultos, pensadas para aportar claridad, no etiquetas.",
      cognitive: "Muestra de tareas cognitivas", emotional: "Reflexión emocional", cognitiveBody: "Explora tu manera de abordar patrones, memoria de trabajo, razonamiento numérico y pensamiento flexible.", emotionalBody: "Reflexiona sobre hábitos actuales de autoconciencia, regulación, empatía y relaciones.", startCognitive: "Empezar tareas cognitivas", startEmotional: "Empezar reflexión emocional", duration: "20 o 24 ítems · unos 8–12 minutos", private: "Las respuestas se quedan aquí salvo que elijas el informe de pago", account: "Sin cuenta para la reflexión gratuita",
      howTitle: "Un proceso claro y tranquilo", howLead: "Elige un camino o completa ambos. Cada resultado es una instantánea, no una puntuación de IQ, EQ ni clínica.", chooseStep: "Elige", chooseStepBody: "Empieza por la reflexión que hoy te resulte más útil.", answerStep: "Responde", answerStepBody: "Avanza a tu ritmo, con un ítem cada vez.", reflectStep: "Reflexiona", reflectStepBody: "Recibe un patrón descriptivo y pequeños consejos prácticos.", chooseTitle: "Elige tu punto de partida", taskKicker: "20 tareas variadas", reflectionKicker: "24 afirmaciones personales",
      noteTitle: "Contexto importante", disclaimer: "Cogniva Compass es una reflexión educativa para adultos. No es una prueba de IQ estandarizada, no genera una puntuación clínica de EQ, no diagnostica ni sustituye una evaluación profesional cualificada.",
      question: "Ítem", of: "de", next: "Continuar", back: "Atrás", leaveWarning: "Tus respuestas actuales se perderán. ¿Quieres salir de esta reflexión?", loading: "Preparando tu reflexión…", loadError: "No se pudo cargar el banco de ítems. Actualiza la página y vuelve a intentarlo.",
      resultTitle: "Tu instantánea de reflexión", snapshot: "Instantánea actual", mostVisible: "Más visible en esta muestra", practiceFocus: "Un posible foco de práctica", balancedLabel: "Un patrón uniforme en esta muestra", balancedBody: "Las cuatro áreas aparecieron aquí en niveles similares. Lee cada sugerencia como punto de partida, no como clasificación.", returnHome: "Volver al inicio",
      reportTitle: "Llévate la reflexión contigo", reportLead: "Elige un informe personalizado de pago para recibir por email una interpretación más amplia y positiva con consejos prácticos. Las respuestas enviadas se vuelven a comprobar y puntuar en el servidor.", email: "Correo electrónico", emailHint: "Lo usamos para entregar el informe y los mensajes esenciales del pedido.", age: "Confirmo que tengo al menos 18 años.", privacyPre: "He leído el", privacyLink: "aviso de privacidad", termsPre: "Acepto las", termsLink: "condiciones de compra", immediate: "Solicito expresamente que la entrega o prestación comience antes de que termine cualquier plazo de desistimiento aplicable y confirmo haber leído las consecuencias descritas en las condiciones de compra aprobadas.", aiConsent: "Opcional: consiento que OpenAI ayude a redactar mi informe. Las puntuaciones deterministas siguen siendo la fuente principal.", optional: "opcional", checkout: "Ir al pago seguro", configLoading: "Comprobando la disponibilidad del informe…", notAvailable: "El informe de pago por email aún no está disponible. Tu reflexión en pantalla sigue siendo gratuita y completa.", pricePrefix: "Informe personalizado por email", paymentNote: "Stripe gestiona el pago seguro. El pedido no incluye consentimiento de marketing.", checkoutError: "No se pudo iniciar el pago. Revisa el formulario o vuelve a intentarlo en unos instantes.", checkoutCancelled: "El pago se canceló. No se realizó ningún cargo y tu reflexión sigue disponible abajo.", taxAtCheckout: "Los impuestos aplicables se calculan y muestran antes del pago.",
      orderTitle: "Tu pedido del informe", orderChecking: "Comprobando la confirmación segura del pago…", orderPending: "La confirmación del pago sigue pendiente. Esta página continuará comprobándola.", orderProcessing: "Pago confirmado. Tu informe se está preparando y se enviará por email.", orderSent: "El informe se ha enviado al correo utilizado en el pago.", orderFailed: "No pudimos completar la entrega. Usa el enlace de contacto para que podamos ayudarte.", orderInvalid: "Este enlace seguro del pedido está incompleto o ya no está disponible.", retry: "Comprobar de nuevo",
      footer: "Privacidad desde el diseño · Reflexión educativa, no clínica", privacy: "Privacidad", terms: "Condiciones", contact: "Contacto",
      domains: { patterns: "Patrones", workingMemory: "Memoria de trabajo", numericalReasoning: "Razonamiento numérico", flexibleThinking: "Pensamiento flexible", selfAwareness: "Autoconciencia", regulation: "Regulación", empathy: "Empatía", relationships: "Relaciones" }
    },
    zh: {
      languageLabel: "语言", languageTitle: "选择语言", languageHelp: "完整体验支持 11 种语言。", close: "关闭", skip: "跳到正文", by: "来自 NeuroMap",
      eyebrow: "两个视角 · 一次用心停顿", title: "觉察你如何面对任务与情绪。", lead: "面向成人的私密认知任务样本与情绪反思，帮助理解自己，而不是贴标签。",
      cognitive: "认知任务样本", emotional: "情绪反思", cognitiveBody: "探索你处理模式、工作记忆、数字推理和灵活思考任务的方式。", emotionalBody: "反思你目前在自我觉察、调节、共情和关系方面的习惯。", startCognitive: "开始认知任务", startEmotional: "开始情绪反思", duration: "20 或 24 个项目 · 约 8–12 分钟", private: "除非选择付费报告，否则答案仅保留在此处", account: "免费反思无需账户",
      howTitle: "清晰、从容的过程", howLead: "可选择一项，也可完成两项。结果只是当下快照，并非 IQ、EQ 或临床分数。", chooseStep: "选择", chooseStepBody: "从今天对你更有帮助的反思开始。", answerStep: "作答", answerStepBody: "按自己的节奏，每次只看一个项目。", reflectStep: "反思", reflectStepBody: "查看描述性模式和简短实用提示。", chooseTitle: "选择起点", taskKicker: "20 项多样化任务", reflectionKicker: "24 项自我陈述",
      noteTitle: "重要背景", disclaimer: "Cogniva Compass 是面向成人的教育性反思工具。它不是标准化 IQ 测试，不提供临床 EQ 分数，不作诊断，也不能替代合格专业人员的评估。",
      question: "项目", of: "/", next: "继续", back: "返回", leaveWarning: "当前答案将会丢失。你确定要退出本次反思吗？", loading: "正在准备反思…", loadError: "无法加载项目库。请刷新页面后重试。",
      resultTitle: "你的反思快照", snapshot: "当前快照", mostVisible: "在本次样本中最明显", practiceFocus: "可尝试的练习方向", balancedLabel: "本次样本呈现均衡模式", balancedBody: "四个领域在这里表现得较为接近。请把各项建议视为起点，而不是排名。", returnHome: "返回首页",
      reportTitle: "把反思带在身边", reportLead: "可选择付费个性化报告，通过电子邮件获得更完整、积极的解读和实用提示。提交的答案会在服务器上重新核验和计分。", email: "电子邮箱", emailHint: "我们仅用它发送报告和必要的订单消息。", age: "我确认自己已年满 18 周岁。", privacyPre: "我已阅读", privacyLink: "隐私声明", termsPre: "我接受", termsLink: "购买条款", immediate: "我明确要求在任何适用的撤回期届满前开始交付或履行，并确认已阅读获批购买条款中说明的相关后果。", aiConsent: "可选：我同意使用 OpenAI 协助撰写报告。确定性计分仍是主要依据。", optional: "可选", checkout: "前往安全支付", configLoading: "正在检查报告是否可用…", notAvailable: "付费邮件报告尚未开放。屏幕上的反思仍然免费且完整。", pricePrefix: "个性化邮件报告", paymentNote: "安全支付由 Stripe 处理。订单不会捆绑营销同意。", checkoutError: "无法启动支付。请检查表单或稍后重试。", checkoutCancelled: "支付已取消，未产生扣款。你的反思结果仍显示在下方。", taxAtCheckout: "如有适用税费，将在付款前计算并显示。",
      orderTitle: "你的报告订单", orderChecking: "正在核对安全支付确认…", orderPending: "支付确认仍在处理中，本页将继续检查。", orderProcessing: "付款已确认。报告正在生成，并将通过电子邮件发送。", orderSent: "报告已发送至支付时使用的电子邮箱。", orderFailed: "报告未能完成发送。请使用下方联系链接获取帮助。", orderInvalid: "此安全订单链接不完整或已失效。", retry: "再次检查",
      footer: "以隐私为设计原则 · 教育性、非临床反思", privacy: "隐私", terms: "条款", contact: "联系",
      domains: { patterns: "模式", workingMemory: "工作记忆", numericalReasoning: "数字推理", flexibleThinking: "灵活思考", selfAwareness: "自我觉察", regulation: "情绪调节", empathy: "共情", relationships: "关系" }
    },
    ja: {
      languageLabel: "言語", languageTitle: "言語を選択", languageHelp: "すべての体験を11言語で利用できます。", close: "閉じる", skip: "本文へ移動", by: "NeuroMap より",
      eyebrow: "二つの視点 · 丁寧なひと休み", title: "課題や感情への向き合い方に気づく。", lead: "成人向けの非公開の認知課題サンプルと感情の振り返り。ラベルではなく、気づきのために設計されています。",
      cognitive: "認知課題サンプル", emotional: "感情の振り返り", cognitiveBody: "パターン、ワーキングメモリ、数的推論、柔軟な思考への取り組み方を見ます。", emotionalBody: "自己認識、調整、共感、関係性に関する現在の習慣を振り返ります。", startCognitive: "認知課題を始める", startEmotional: "感情の振り返りを始める", duration: "20項目または24項目 · 約8〜12分", private: "有料レポートを選ばない限り、回答はここに留まります", account: "無料の振り返りにアカウントは不要",
      howTitle: "明快で落ち着いた流れ", howLead: "どちらか一方、または両方を選べます。結果は今のスナップショットであり、IQ、EQ、臨床スコアではありません。", chooseStep: "選ぶ", chooseStepBody: "今日役立ちそうな振り返りから始めます。", answerStep: "答える", answerStepBody: "一度に一項目ずつ、自分のペースで進めます。", reflectStep: "振り返る", reflectStepBody: "記述的な傾向と、小さな実践のヒントを確認します。", chooseTitle: "出発点を選ぶ", taskKicker: "多様な20課題", reflectionKicker: "24の自己報告項目",
      noteTitle: "大切な前提", disclaimer: "Cogniva Compassは成人向けの教育的な振り返りです。標準化IQテストではなく、臨床的EQスコアを算出せず、診断を行わず、資格を持つ専門家の評価に代わるものではありません。",
      question: "項目", of: "/", next: "続ける", back: "戻る", leaveWarning: "現在の回答は失われます。この振り返りを終了しますか？", loading: "振り返りを準備しています…", loadError: "項目バンクを読み込めませんでした。ページを更新してもう一度お試しください。",
      resultTitle: "あなたの振り返りスナップショット", snapshot: "現在のスナップショット", mostVisible: "今回のサンプルで最も表れた領域", practiceFocus: "考えられる練習の焦点", balancedLabel: "今回のサンプルでは均衡した傾向", balancedBody: "四つの領域はここでは近い水準でした。各ヒントを順位ではなく出発点として読んでください。", returnHome: "最初に戻る",
      reportTitle: "振り返りを手元に残す", reportLead: "有料の個別レポートでは、より詳しく前向きな解釈と実践のヒントをメールで受け取れます。送信された回答はサーバーで再確認・再採点されます。", email: "メールアドレス", emailHint: "レポートと注文に必要な連絡の配信に使用します。", age: "私は18歳以上であることを確認します。", privacyPre: "私は", privacyLink: "プライバシー通知", termsPre: "私は", termsLink: "購入条件", immediate: "適用される撤回期間が終了する前に提供または履行を開始することを明示的に求め、承認済みの購入条件に記載された結果を読んだことを確認します。", aiConsent: "任意：OpenAIによるレポート文章作成の支援に同意します。決定論的な採点が引き続き基準です。", optional: "任意", checkout: "安全な支払いへ進む", configLoading: "レポートの利用可否を確認中…", notAvailable: "有料メールレポートはまだ利用できません。画面上の振り返りは無料で完全なままです。", pricePrefix: "個別メールレポート", paymentNote: "安全な支払いはStripeが処理します。注文にマーケティング同意は含まれません。", checkoutError: "支払いを開始できませんでした。フォームを確認するか、少し後でもう一度お試しください。", checkoutCancelled: "支払いはキャンセルされました。請求はなく、振り返り結果は下に引き続き表示されます。", taxAtCheckout: "該当する税額は支払い前に計算・表示されます。",
      orderTitle: "レポートのご注文", orderChecking: "安全な支払い確認を照合しています…", orderPending: "支払い確認がまだ保留中です。このページで確認を続けます。", orderProcessing: "支払いを確認しました。レポートを作成し、メールでお送りします。", orderSent: "支払い時に使用したメールアドレスへレポートを送信しました。", orderFailed: "レポートの配信を完了できませんでした。下の連絡先からお問い合わせください。", orderInvalid: "この安全な注文リンクは不完全か、利用できなくなっています。", retry: "もう一度確認",
      footer: "プライバシーを重視した設計 · 教育的・非臨床的な振り返り", privacy: "プライバシー", terms: "条件", contact: "お問い合わせ",
      domains: { patterns: "パターン", workingMemory: "ワーキングメモリ", numericalReasoning: "数的推論", flexibleThinking: "柔軟な思考", selfAwareness: "自己認識", regulation: "感情調整", empathy: "共感", relationships: "関係性" }
    },
    ar: {
      languageLabel: "اللغة", languageTitle: "اختر لغتك", languageHelp: "التجربة الكاملة متاحة بإحدى عشرة لغة.", close: "إغلاق", skip: "الانتقال إلى المحتوى", by: "من NeuroMap",
      eyebrow: "منظوران · وقفة واعية", title: "لاحظ كيف تتعامل مع المهام والمشاعر.", lead: "عينة خاصة من المهام المعرفية وتأمل عاطفي للبالغين، صُمما للفهم لا لإطلاق التصنيفات.",
      cognitive: "عينة مهام معرفية", emotional: "تأمل عاطفي", cognitiveBody: "استكشف أسلوبك في الأنماط والذاكرة العاملة والاستدلال العددي والتفكير المرن.", emotionalBody: "تأمل عاداتك الحالية في الوعي بالذات والتنظيم والتعاطف والعلاقات.", startCognitive: "ابدأ المهام المعرفية", startEmotional: "ابدأ التأمل العاطفي", duration: "20 أو 24 بندًا · نحو 8–12 دقيقة", private: "تبقى الإجابات هنا ما لم تختر التقرير المدفوع", account: "لا يلزم حساب للتأمل المجاني",
      howTitle: "مسار واضح وهادئ", howLead: "اختر مسارًا واحدًا أو أكمل الاثنين. كل نتيجة لقطة للحظة الحالية وليست درجة ذكاء أو ذكاء عاطفي أو درجة سريرية.", chooseStep: "اختر", chooseStepBody: "ابدأ بالتأمل الذي يبدو أكثر فائدة لك اليوم.", answerStep: "أجب", answerStepBody: "تقدم بوتيرتك مع بند واحد في كل مرة.", reflectStep: "تأمل", reflectStepBody: "اطّلع على نمط وصفي وخطوات عملية صغيرة.", chooseTitle: "اختر نقطة البداية", taskKicker: "20 مهمة متنوعة", reflectionKicker: "24 عبارة للتقرير الذاتي",
      noteTitle: "سياق مهم", disclaimer: "Cogniva Compass أداة تأمل تعليمية للبالغين. ليست اختبار ذكاء معياريًا، ولا تعطي درجة سريرية للذكاء العاطفي، ولا تشخّص، ولا تحل محل تقييم متخصص مؤهل.",
      question: "البند", of: "من", next: "متابعة", back: "رجوع", leaveWarning: "ستفقد إجاباتك الحالية. هل تريد مغادرة هذا التأمل؟", loading: "يجري إعداد التأمل…", loadError: "تعذر تحميل بنك البنود. حدّث الصفحة وحاول مرة أخرى.",
      resultTitle: "لقطة تأملك", snapshot: "اللقطة الحالية", mostVisible: "الأوضح في هذه العينة", practiceFocus: "محور محتمل للتدريب", balancedLabel: "نمط متوازن في هذه العينة", balancedBody: "ظهرت المجالات الأربعة هنا بمستويات متقاربة. اقرأ الإرشادات كنقاط بداية لا كترتيب.", returnHome: "العودة إلى البداية",
      reportTitle: "احتفظ بنتيجة التأمل", reportLead: "اختر تقريرًا شخصيًا مدفوعًا لتصلك عبر البريد قراءة أوسع وإيجابية وإرشادات عملية. تُراجع الإجابات المرسلة وتُحسب من جديد على الخادم.", email: "البريد الإلكتروني", emailHint: "نستخدمه لإرسال التقرير ورسائل الطلب الضرورية.", age: "أؤكد أن عمري 18 عامًا على الأقل.", privacyPre: "قرأت", privacyLink: "إشعار الخصوصية", termsPre: "أوافق على", termsLink: "شروط الشراء", immediate: "أطلب صراحة أن يبدأ التسليم أو الأداء قبل انتهاء أي مدة انسحاب مطبقة، وأقر بأنني قرأت الآثار الموضحة في شروط الشراء المعتمدة.", aiConsent: "اختياري: أوافق على مساعدة OpenAI في صياغة تقريري. تبقى الدرجات الحتمية هي المرجع الأساسي.", optional: "اختياري", checkout: "المتابعة إلى الدفع الآمن", configLoading: "جارٍ التحقق من توفر التقرير…", notAvailable: "التقرير المدفوع عبر البريد غير متاح بعد. يظل التأمل الظاهر مجانيًا وكاملًا.", pricePrefix: "تقرير شخصي عبر البريد", paymentNote: "تتولى Stripe الدفع الآمن. لا تُربط موافقة تسويقية بالطلب.", checkoutError: "تعذر بدء الدفع. تحقق من النموذج أو حاول بعد قليل.", checkoutCancelled: "أُلغيت عملية الدفع ولم يُخصم أي مبلغ. ما زالت نتيجة تأملك متاحة أدناه.", taxAtCheckout: "تُحسب أي ضريبة مطبقة وتُعرض قبل الدفع.",
      orderTitle: "طلب تقريرك", orderChecking: "جارٍ التحقق من تأكيد الدفع الآمن…", orderPending: "ما زال تأكيد الدفع معلقًا. ستواصل الصفحة التحقق.", orderProcessing: "تم تأكيد الدفع. يجري إعداد التقرير وسيُرسل بالبريد الإلكتروني.", orderSent: "أُرسل التقرير إلى البريد المستخدم عند الدفع.", orderFailed: "تعذر إكمال تسليم التقرير. استخدم رابط التواصل أدناه للمساعدة.", orderInvalid: "رابط الطلب الآمن غير مكتمل أو لم يعد متاحًا.", retry: "التحقق مرة أخرى",
      footer: "خصوصية مدمجة في التصميم · تأمل تعليمي غير سريري", privacy: "الخصوصية", terms: "الشروط", contact: "تواصل",
      domains: { patterns: "الأنماط", workingMemory: "الذاكرة العاملة", numericalReasoning: "الاستدلال العددي", flexibleThinking: "التفكير المرن", selfAwareness: "الوعي بالذات", regulation: "التنظيم", empathy: "التعاطف", relationships: "العلاقات" }
    },
    pl: {
      languageLabel: "Język", languageTitle: "Wybierz język", languageHelp: "Pełne doświadczenie jest dostępne w 11 językach.", close: "Zamknij", skip: "Przejdź do treści", by: "od NeuroMap",
      eyebrow: "Dwie perspektywy · uważna chwila", title: "Zauważ, jak podchodzisz do zadań i emocji.", lead: "Prywatna próbka zadań poznawczych i refleksja emocjonalna dla dorosłych — dla wglądu, nie etykiet.",
      cognitive: "Próbka zadań poznawczych", emotional: "Refleksja emocjonalna", cognitiveBody: "Poznaj swoje podejście do wzorców, pamięci roboczej, rozumowania liczbowego i elastycznego myślenia.", emotionalBody: "Przyjrzyj się obecnym nawykom dotyczącym samoświadomości, regulacji, empatii i relacji.", startCognitive: "Rozpocznij zadania poznawcze", startEmotional: "Rozpocznij refleksję emocjonalną", duration: "20 lub 24 pozycje · około 8–12 minut", private: "Odpowiedzi zostają tutaj, chyba że wybierzesz płatny raport", account: "Do bezpłatnej refleksji nie trzeba konta",
      howTitle: "Jasny, spokojny proces", howLead: "Wybierz jedną ścieżkę lub przejdź obie. Wynik jest chwilowym obrazem, nie wynikiem IQ, EQ ani klinicznym.", chooseStep: "Wybierz", chooseStepBody: "Zacznij od refleksji, która dziś wydaje się najbardziej pomocna.", answerStep: "Odpowiedz", answerStepBody: "Pracuj we własnym tempie, po jednej pozycji.", reflectStep: "Zastanów się", reflectStepBody: "Zobacz opisowy wzorzec i małe praktyczne wskazówki.", chooseTitle: "Wybierz punkt wyjścia", taskKicker: "20 zróżnicowanych zadań", reflectionKicker: "24 stwierdzenia samoopisowe",
      noteTitle: "Ważny kontekst", disclaimer: "Cogniva Compass jest edukacyjną refleksją dla dorosłych. Nie jest standaryzowanym testem IQ, nie podaje klinicznego wyniku EQ, nie diagnozuje i nie zastępuje oceny wykwalifikowanego specjalisty.",
      question: "Pozycja", of: "z", next: "Dalej", back: "Wstecz", leaveWarning: "Obecne odpowiedzi zostaną utracone. Czy chcesz opuścić tę refleksję?", loading: "Przygotowujemy refleksję…", loadError: "Nie udało się wczytać banku pozycji. Odśwież stronę i spróbuj ponownie.",
      resultTitle: "Twój obraz refleksji", snapshot: "Obecny obraz", mostVisible: "Najbardziej widoczne w tej próbce", practiceFocus: "Możliwy kierunek ćwiczeń", balancedLabel: "Wyrównany wzorzec w tej próbce", balancedBody: "Cztery obszary pojawiły się tu na podobnym poziomie. Potraktuj wskazówki jako punkty wyjścia, nie ranking.", returnHome: "Wróć na początek",
      reportTitle: "Zachowaj refleksję", reportLead: "Wybierz płatny, spersonalizowany raport, aby otrzymać mailem szerszą, pozytywną interpretację i praktyczne wskazówki. Przesłane odpowiedzi są ponownie sprawdzane i punktowane na serwerze.", email: "Adres e-mail", emailHint: "Używamy go do dostarczenia raportu i niezbędnych wiadomości o zamówieniu.", age: "Potwierdzam, że mam co najmniej 18 lat.", privacyPre: "Zapoznałem(-am) się z", privacyLink: "informacją o prywatności", termsPre: "Akceptuję", termsLink: "warunki zakupu", immediate: "Wyraźnie żądam rozpoczęcia dostawy lub świadczenia przed upływem ewentualnego okresu odstąpienia i potwierdzam zapoznanie się z konsekwencjami opisanymi w zatwierdzonych warunkach zakupu.", aiConsent: "Opcjonalnie: zgadzam się na wsparcie OpenAI przy redagowaniu raportu. Podstawą pozostają deterministyczne wyniki.", optional: "opcjonalne", checkout: "Przejdź do bezpiecznej płatności", configLoading: "Sprawdzamy dostępność raportu…", notAvailable: "Płatny raport e-mail nie jest jeszcze dostępny. Refleksja na ekranie pozostaje bezpłatna i pełna.", pricePrefix: "Spersonalizowany raport e-mail", paymentNote: "Bezpieczną płatność obsługuje Stripe. Zamówienie nie zawiera zgody marketingowej.", checkoutError: "Nie udało się rozpocząć płatności. Sprawdź formularz lub spróbuj ponownie za chwilę.", checkoutCancelled: "Płatność została anulowana. Nie pobrano środków, a Twoja refleksja jest nadal dostępna poniżej.", taxAtCheckout: "Ewentualny podatek zostanie obliczony i pokazany przed płatnością.",
      orderTitle: "Twoje zamówienie raportu", orderChecking: "Sprawdzamy bezpieczne potwierdzenie płatności…", orderPending: "Potwierdzenie płatności jest nadal oczekujące. Strona będzie sprawdzać dalej.", orderProcessing: "Płatność potwierdzona. Raport jest przygotowywany i zostanie wysłany e-mailem.", orderSent: "Raport wysłano na adres e-mail użyty przy płatności.", orderFailed: "Nie udało się ukończyć dostawy raportu. Skorzystaj z linku kontaktowego poniżej.", orderInvalid: "Ten bezpieczny link zamówienia jest niepełny lub już niedostępny.", retry: "Sprawdź ponownie",
      footer: "Prywatność wbudowana w projekt · Refleksja edukacyjna, niekliniczna", privacy: "Prywatność", terms: "Warunki", contact: "Kontakt",
      domains: { patterns: "Wzorce", workingMemory: "Pamięć robocza", numericalReasoning: "Rozumowanie liczbowe", flexibleThinking: "Elastyczne myślenie", selfAwareness: "Samoświadomość", regulation: "Regulacja", empathy: "Empatia", relationships: "Relacje" }
    },
    pt: {
      languageLabel: "Idioma", languageTitle: "Escolha o idioma", languageHelp: "A experiência completa está disponível em 11 idiomas.", close: "Fechar", skip: "Ir para o conteúdo", by: "da NeuroMap",
      eyebrow: "Duas perspetivas · uma pausa consciente", title: "Repare em como aborda tarefas e emoções.", lead: "Uma amostra privada de tarefas cognitivas e uma reflexão emocional para adultos, criadas para gerar compreensão, não rótulos.",
      cognitive: "Amostra de tarefas cognitivas", emotional: "Reflexão emocional", cognitiveBody: "Explore a sua abordagem a padrões, memória de trabalho, raciocínio numérico e pensamento flexível.", emotionalBody: "Reflita sobre hábitos atuais de autoconsciência, regulação, empatia e relações.", startCognitive: "Iniciar tarefas cognitivas", startEmotional: "Iniciar reflexão emocional", duration: "20 ou 24 itens · cerca de 8–12 minutos", private: "As respostas ficam aqui, salvo se escolher o relatório pago", account: "Sem conta para a reflexão gratuita",
      howTitle: "Um processo claro e tranquilo", howLead: "Escolha um percurso ou complete ambos. Cada resultado é um retrato do momento, não uma pontuação de QI, QE ou clínica.", chooseStep: "Escolha", chooseStepBody: "Comece pela reflexão que hoje lhe parece mais útil.", answerStep: "Responda", answerStepBody: "Avance ao seu ritmo, com um item de cada vez.", reflectStep: "Reflita", reflectStepBody: "Veja um padrão descritivo e pequenas sugestões práticas.", chooseTitle: "Escolha o ponto de partida", taskKicker: "20 tarefas variadas", reflectionKicker: "24 afirmações pessoais",
      noteTitle: "Contexto importante", disclaimer: "Cogniva Compass é uma reflexão educativa para adultos. Não é um teste de QI padronizado, não produz uma pontuação clínica de QE, não diagnostica e não substitui uma avaliação profissional qualificada.",
      question: "Item", of: "de", next: "Continuar", back: "Voltar", leaveWarning: "As respostas atuais serão perdidas. Quer sair desta reflexão?", loading: "A preparar a reflexão…", loadError: "Não foi possível carregar o banco de itens. Atualize a página e tente novamente.",
      resultTitle: "O seu retrato de reflexão", snapshot: "Retrato atual", mostVisible: "Mais visível nesta amostra", practiceFocus: "Um possível foco de prática", balancedLabel: "Um padrão equilibrado nesta amostra", balancedBody: "As quatro áreas surgiram aqui em níveis semelhantes. Leia cada sugestão como ponto de partida, não como classificação.", returnHome: "Voltar ao início",
      reportTitle: "Leve a reflexão consigo", reportLead: "Escolha um relatório personalizado pago para receber por email uma interpretação mais ampla e positiva com sugestões práticas. As respostas enviadas são verificadas e pontuadas novamente no servidor.", email: "Endereço de email", emailHint: "Usamo-lo para entregar o relatório e mensagens essenciais da encomenda.", age: "Confirmo que tenho pelo menos 18 anos.", privacyPre: "Li o", privacyLink: "aviso de privacidade", termsPre: "Aceito os", termsLink: "termos de compra", immediate: "Solicito expressamente que a entrega ou prestação comece antes do fim de qualquer prazo de livre resolução aplicável e confirmo que li as consequências descritas nos termos de compra aprovados.", aiConsent: "Opcional: consinto a assistência da OpenAI na redação do relatório. As pontuações determinísticas continuam a ser a fonte principal.", optional: "opcional", checkout: "Continuar para pagamento seguro", configLoading: "A verificar a disponibilidade do relatório…", notAvailable: "O relatório pago por email ainda não está disponível. A reflexão no ecrã continua gratuita e completa.", pricePrefix: "Relatório personalizado por email", paymentNote: "O pagamento seguro é processado pela Stripe. A encomenda não inclui consentimento de marketing.", checkoutError: "Não foi possível iniciar o pagamento. Verifique o formulário ou tente novamente em breve.", checkoutCancelled: "O pagamento foi cancelado. Não houve cobrança e a sua reflexão continua disponível abaixo.", taxAtCheckout: "Qualquer imposto aplicável é calculado e apresentado antes do pagamento.",
      orderTitle: "A sua encomenda do relatório", orderChecking: "A verificar a confirmação segura do pagamento…", orderPending: "A confirmação do pagamento continua pendente. Esta página continuará a verificar.", orderProcessing: "Pagamento confirmado. O relatório está a ser preparado e será enviado por email.", orderSent: "O relatório foi enviado para o email usado no pagamento.", orderFailed: "Não foi possível concluir a entrega. Use o contacto abaixo para obter ajuda.", orderInvalid: "Esta ligação segura da encomenda está incompleta ou já não está disponível.", retry: "Verificar novamente",
      footer: "Privacidade desde a conceção · Reflexão educativa, não clínica", privacy: "Privacidade", terms: "Termos", contact: "Contacto",
      domains: { patterns: "Padrões", workingMemory: "Memória de trabalho", numericalReasoning: "Raciocínio numérico", flexibleThinking: "Pensamento flexível", selfAwareness: "Autoconsciência", regulation: "Regulação", empathy: "Empatia", relationships: "Relações" }
    },
    fr: {
      languageLabel: "Langue", languageTitle: "Choisissez votre langue", languageHelp: "L’expérience complète est disponible en 11 langues.", close: "Fermer", skip: "Aller au contenu", by: "par NeuroMap",
      eyebrow: "Deux perspectives · une pause attentive", title: "Observez votre manière d’aborder tâches et émotions.", lead: "Un échantillon privé de tâches cognitives et une réflexion émotionnelle pour adultes, conçus pour éclairer, pas étiqueter.",
      cognitive: "Échantillon de tâches cognitives", emotional: "Réflexion émotionnelle", cognitiveBody: "Explorez votre approche des motifs, de la mémoire de travail, du raisonnement numérique et de la flexibilité mentale.", emotionalBody: "Réfléchissez à vos habitudes actuelles de conscience de soi, de régulation, d’empathie et de relations.", startCognitive: "Commencer les tâches cognitives", startEmotional: "Commencer la réflexion émotionnelle", duration: "20 ou 24 items · environ 8–12 minutes", private: "Les réponses restent ici sauf si vous choisissez le rapport payant", account: "Aucun compte pour la réflexion gratuite",
      howTitle: "Un parcours clair et serein", howLead: "Choisissez un parcours ou complétez les deux. Chaque résultat est un instantané, pas un score de QI, de QE ou clinique.", chooseStep: "Choisir", chooseStepBody: "Commencez par la réflexion qui vous semble la plus utile aujourd’hui.", answerStep: "Répondre", answerStepBody: "Avancez à votre rythme, un item à la fois.", reflectStep: "Réfléchir", reflectStepBody: "Découvrez une tendance descriptive et de petites pistes pratiques.", chooseTitle: "Choisissez votre point de départ", taskKicker: "20 tâches variées", reflectionKicker: "24 affirmations personnelles",
      noteTitle: "Contexte important", disclaimer: "Cogniva Compass est une réflexion éducative pour adultes. Ce n’est pas un test de QI standardisé, il ne produit pas de score clinique de QE, ne pose pas de diagnostic et ne remplace pas l’évaluation d’un professionnel qualifié.",
      question: "Item", of: "sur", next: "Continuer", back: "Retour", leaveWarning: "Vos réponses actuelles seront perdues. Voulez-vous quitter cette réflexion ?", loading: "Préparation de votre réflexion…", loadError: "La banque d’items n’a pas pu être chargée. Actualisez la page puis réessayez.",
      resultTitle: "Votre instantané de réflexion", snapshot: "Instantané actuel", mostVisible: "Le plus visible dans cet échantillon", practiceFocus: "Une piste d’entraînement possible", balancedLabel: "Une tendance équilibrée dans cet échantillon", balancedBody: "Les quatre domaines sont apparus ici à des niveaux proches. Lisez chaque piste comme un point de départ, pas comme un classement.", returnHome: "Retour à l’accueil",
      reportTitle: "Gardez votre réflexion avec vous", reportLead: "Choisissez un rapport personnalisé payant pour recevoir par email une interprétation plus complète et positive avec des pistes pratiques. Les réponses transmises sont revérifiées et recalculées sur le serveur.", email: "Adresse email", emailHint: "Nous l’utilisons pour livrer le rapport et les messages indispensables liés à la commande.", age: "Je confirme avoir au moins 18 ans.", privacyPre: "J’ai lu la", privacyLink: "notice de confidentialité", termsPre: "J’accepte les", termsLink: "conditions d’achat", immediate: "Je demande expressément que la livraison ou la prestation commence avant la fin de tout délai de rétractation applicable et reconnais avoir lu les conséquences décrites dans les conditions d’achat approuvées.", aiConsent: "Facultatif : j’accepte que l’OpenAI aide à formuler mon rapport. Les scores déterministes restent la référence.", optional: "facultatif", checkout: "Continuer vers le paiement sécurisé", configLoading: "Vérification de la disponibilité du rapport…", notAvailable: "Le rapport payant par email n’est pas encore disponible. Votre réflexion à l’écran reste gratuite et complète.", pricePrefix: "Rapport personnalisé par email", paymentNote: "Le paiement sécurisé est traité par Stripe. Aucun consentement marketing n’est associé à la commande.", checkoutError: "Le paiement n’a pas pu démarrer. Vérifiez le formulaire ou réessayez dans un instant.", checkoutCancelled: "Le paiement a été annulé. Aucun débit n’a eu lieu et votre réflexion reste disponible ci-dessous.", taxAtCheckout: "Toute taxe applicable est calculée et affichée avant le paiement.",
      orderTitle: "Votre commande de rapport", orderChecking: "Vérification de la confirmation sécurisée du paiement…", orderPending: "La confirmation du paiement est encore en attente. Cette page continue la vérification.", orderProcessing: "Paiement confirmé. Votre rapport est en préparation et sera envoyé par email.", orderSent: "Votre rapport a été envoyé à l’adresse utilisée lors du paiement.", orderFailed: "La livraison du rapport n’a pas pu être terminée. Utilisez le lien de contact ci-dessous pour obtenir de l’aide.", orderInvalid: "Ce lien de commande sécurisé est incomplet ou n’est plus disponible.", retry: "Vérifier à nouveau",
      footer: "Confidentialité intégrée · Réflexion éducative, non clinique", privacy: "Confidentialité", terms: "Conditions", contact: "Contact",
      domains: { patterns: "Motifs", workingMemory: "Mémoire de travail", numericalReasoning: "Raisonnement numérique", flexibleThinking: "Flexibilité mentale", selfAwareness: "Conscience de soi", regulation: "Régulation", empathy: "Empathie", relationships: "Relations" }
    }
  };

  function safeStorageGet(key) {
    try { return window.localStorage.getItem(key); } catch (error) { return null; }
  }

  function safeStorageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (error) {}
  }

  function safeSessionGet(key) {
    try { return window.sessionStorage.getItem(key); } catch (error) { return null; }
  }

  function safeSessionSet(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function safeSessionRemove(key) {
    try { window.sessionStorage.removeItem(key); } catch (error) {}
  }

  var FLOW_COPY_KEYS = Object.keys(FLOW_COPY.en).sort().join("|");
  SUPPORTED_LANGS.forEach(function (locale) {
    if (!I18N[locale] || !FLOW_COPY[locale] || Object.keys(FLOW_COPY[locale]).sort().join("|") !== FLOW_COPY_KEYS) {
      throw new Error("Missing or incomplete Cogniva localization: " + locale);
    }
  });

  function saveCheckoutRecovery(completion, packageCode) {
    safeSessionSet(CHECKOUT_RECOVERY_KEY, JSON.stringify({
      version: VERSION,
      createdAt: Date.now(),
      language: language,
      completion: completion,
      packageCode: packageCode,
      completions: {
        cognitive: completedAssessments.cognitive,
        emotional: completedAssessments.emotional
      }
    }));
  }

  function consumeCheckoutRecovery() {
    var raw = safeSessionGet(CHECKOUT_RECOVERY_KEY);
    safeSessionRemove(CHECKOUT_RECOVERY_KEY);
    if (!raw) return null;
    try {
      var recovery = JSON.parse(raw);
      if (!recovery || recovery.version !== VERSION || !Number.isFinite(recovery.createdAt)) return null;
      if (Date.now() - recovery.createdAt > CHECKOUT_RECOVERY_TTL_MS || recovery.createdAt > Date.now() + 60000) return null;
      if (!validLanguage(recovery.language) || !recovery.completion || ["cognitive", "emotional"].indexOf(recovery.completion.track) === -1) return null;
      if (recovery.packageCode && ["single_v1", "bundle_v1"].indexOf(recovery.packageCode) === -1) return null;
      return recovery;
    } catch (error) {
      return null;
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function safePublicUrl(value) {
    try {
      var url = new URL(String(value || ""));
      return url.protocol === "https:" || url.hostname === "localhost" ? url.href : "";
    } catch (error) {
      return "";
    }
  }

  function assetUrl(path) {
    return new URL(String(path).replace(/^\//, ""), assetBase).href;
  }

  function apiUrl(path) {
    return new URL(path, serviceOrigin).href;
  }

  function validLanguage(value) {
    var normalized = String(value || "").toLowerCase().split("-")[0];
    return SUPPORTED_LANGS.indexOf(normalized) === -1 ? null : normalized;
  }

  var pageUrl = new URL(window.location.href);
  var queryLanguage = validLanguage(pageUrl.searchParams.get("lang"));
  var savedLanguage = validLanguage(safeStorageGet("cc_lang"));
  var browserLanguage = validLanguage(window.navigator.language);
  var language = queryLanguage || savedLanguage || browserLanguage || "en";
  var shouldAutoOpenLanguage = !queryLanguage && !savedLanguage;
  var root = document.getElementById("cognivaCompassRoot");
  if (!root) return;

  var app;
  var footer;
  var modal;
  var legalModal;
  var languageTrigger;
  var view = "home";
  var mode = null;
  var questionIndex = 0;
  var answers = [];
  var currentItems = [];
  var currentFormId = null;
  var lastCompletion = null;
  var completedAssessments = { cognitive: null, emotional: null };
  var runtimePromise = null;
  var configPromise = null;
  var publicConfig = null;
  var modalReturnFocus = null;
  var legalReturnFocus = null;
  var previousBodyOverflow = "";
  var orderPollGeneration = 0;
  var navigationGeneration = 0;
  var activeOrder = null;
  var legalGateResolve = null;
  var legalGatePromise = null;
  var legalGateStep = 1;

  function copy() {
    return I18N[language];
  }

  function flowCopy() {
    return FLOW_COPY[language];
  }

  function buildShell() {
    root.innerHTML = [
      '<a class="cc-skip-link" href="#ccApp"></a>',
      '<header class="cc-header">',
        '<button class="cc-brand" type="button" data-home>',
          '<span class="cc-mark" aria-hidden="true">C</span>',
          '<span class="cc-wordmark"><span>Cogniva Compass</span><small></small></span>',
        '</button>',
        '<button class="cc-language-trigger" type="button" aria-haspopup="dialog" aria-controls="ccLanguageModal" aria-expanded="false">',
          '<span class="cc-language-code"></span><span class="cc-language-name"></span><span class="cc-chevron" aria-hidden="true"></span>',
        '</button>',
      '</header>',
      '<main class="cc-main" id="ccApp" tabindex="-1"></main>',
      '<footer class="cc-footer"></footer>',
      '<div class="cc-language-modal" id="ccLanguageModal" role="dialog" aria-modal="true" aria-labelledby="ccLanguageTitle" hidden>',
        '<div class="cc-language-panel">',
          '<div class="cc-language-head"><div><h2 id="ccLanguageTitle"></h2><p class="cc-language-help"></p></div><button class="cc-close" type="button"><span aria-hidden="true">×</span></button></div>',
          '<div class="cc-language-grid"></div>',
        '</div>',
      '</div>',
      '<div class="cc-legal-modal" id="ccLegalModal" role="dialog" aria-modal="true" aria-labelledby="ccLegalTitle" hidden>',
        '<div class="cc-legal-panel"></div>',
      '</div>'
    ].join("");

    app = root.querySelector("#ccApp");
    footer = root.querySelector(".cc-footer");
    modal = root.querySelector("#ccLanguageModal");
    legalModal = root.querySelector("#ccLegalModal");
    languageTrigger = root.querySelector(".cc-language-trigger");
    root.querySelector("[data-home]").addEventListener("click", requestHome);
    languageTrigger.addEventListener("click", function () { openLanguageModal(false); });
    modal.querySelector(".cc-close").addEventListener("click", closeLanguageModal);
    modal.addEventListener("click", function (event) { if (event.target === modal) closeLanguageModal(); });
    modal.addEventListener("keydown", handleModalKeydown);
    legalModal.addEventListener("keydown", handleLegalModalKeydown);
  }

  function applyLanguage() {
    var c = copy();
    root.lang = language;
    root.dir = language === "ar" ? "rtl" : "ltr";
    root.querySelector(".cc-skip-link").textContent = c.skip;
    root.querySelector(".cc-wordmark small").textContent = c.by;
    root.querySelector(".cc-brand").setAttribute("aria-label", "Cogniva Compass · " + c.returnHome);
    root.querySelector(".cc-language-code").textContent = language.toUpperCase();
    root.querySelector(".cc-language-name").textContent = LANGUAGE_NAMES[language];
    languageTrigger.setAttribute("aria-label", c.languageLabel + ": " + LANGUAGE_NAMES[language]);
    modal.querySelector("#ccLanguageTitle").textContent = c.languageTitle;
    modal.querySelector(".cc-language-help").textContent = c.languageHelp;
    modal.querySelector(".cc-close").setAttribute("aria-label", c.close);
    modal.querySelector(".cc-language-grid").innerHTML = SUPPORTED_LANGS.map(function (locale) {
      return '<button class="cc-language-option" type="button" data-language="' + locale + '" lang="' + locale + '" dir="' + (locale === "ar" ? "rtl" : "ltr") + '" aria-current="' + (locale === language ? "true" : "false") + '"><span>' + escapeHtml(LANGUAGE_NAMES[locale]) + '</span><small>' + locale.toUpperCase() + '</small></button>';
    }).join("");
    modal.querySelectorAll("[data-language]").forEach(function (button) {
      button.addEventListener("click", function () { selectLanguage(button.dataset.language); });
    });
    renderFooter(publicConfig);
  }

  function updateLanguageUrl() {
    var url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    window.history.replaceState({}, "", url.href);
  }

  function setModalBackgroundDisabled(disabled, languageDialogOpen) {
    [root.querySelector(".cc-skip-link"), root.querySelector(".cc-header"), app, footer].forEach(function (element) {
      if (!element) return;
      if (disabled) {
        element.setAttribute("inert", "");
        element.setAttribute("aria-hidden", "true");
      } else {
        element.removeAttribute("inert");
        element.removeAttribute("aria-hidden");
      }
    });
    languageTrigger.setAttribute("aria-expanded", languageDialogOpen ? "true" : "false");
  }

  function openLanguageModal(isAutomatic) {
    if (!modal.hidden || (legalModal && !legalModal.hidden)) return;
    modalReturnFocus = isAutomatic ? null : document.activeElement;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setModalBackgroundDisabled(true, true);
    modal.hidden = false;
    window.requestAnimationFrame(function () {
      var selected = modal.querySelector('[data-language="' + language + '"]');
      (selected || modal.querySelector("button")).focus();
    });
  }

  function closeLanguageModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = previousBodyOverflow;
    setModalBackgroundDisabled(false, false);
    if (modalReturnFocus && document.contains(modalReturnFocus)) modalReturnFocus.focus();
    else languageTrigger.focus();
  }

  function handleModalKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeLanguageModal();
      return;
    }
    if (event.key !== "Tab") return;
    var focusable = Array.from(modal.querySelectorAll('button:not([disabled]),a[href],input:not([disabled])'));
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleLegalModalKeydown(event) {
    if (event.key === "Escape") {
      if (legalModal.getAttribute("aria-busy") === "true") return;
      event.preventDefault();
      closeLegalGate(null);
      return;
    }
    if (event.key !== "Tab") return;
    var focusable = Array.from(legalModal.querySelectorAll('button:not([disabled]),a[href],input:not([disabled])'));
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function legalBundle() {
    return window.COGNIVA_LEGAL_CONTENT_V1 || null;
  }

  function legalLocaleContent() {
    var bundle = legalBundle();
    if (!bundle || typeof bundle.get !== "function") return null;
    return bundle.get(language);
  }

  function decodeConsentTokenRecord(token) {
    try {
      var body = String(token || "").split(".");
      if (body.length !== 3 || body[0] !== "v1") return null;
      var encoded = body[1].replace(/-/g, "+").replace(/_/g, "/");
      while (encoded.length % 4) encoded += "=";
      return JSON.parse(window.atob(encoded));
    } catch (error) {
      return null;
    }
  }

  function legalDocumentsMatch(documents, config) {
    return Boolean(documents && config &&
      documents.policyVersion === config.policyVersion &&
      documents.privacyVersion === config.privacyVersion &&
      documents.privacySha256 === config.privacyDocumentSha256 &&
      documents.termsVersion === config.termsVersion &&
      documents.termsSha256 === config.termsDocumentSha256 &&
      config.policyVersion && config.privacyVersion && config.privacyDocumentSha256 &&
      config.termsVersion && config.termsDocumentSha256);
  }

  function validStoredConsent(config) {
    var raw = safeSessionGet(PREASSESSMENT_CONSENT_KEY);
    if (!raw) return null;
    try {
      var receipt = JSON.parse(raw);
      var record = decodeConsentTokenRecord(receipt && receipt.token);
      var bundle = legalBundle();
      var expiresAt = Date.parse(receipt.expiresAt || (record && record.expiresAt) || "");
      var valid = receipt && typeof receipt.token === "string" && receipt.token.length <= 12000 &&
        receipt.locale === language && record && record.locale === language &&
        Number.isFinite(expiresAt) && expiresAt > Date.now() &&
        bundle && bundle.isProductionReady === true && legalLocaleContent() &&
        receipt.contentVersion === bundle.version && record.contentVersion === bundle.version &&
        config.legalContentVersion === bundle.version &&
        config && config.legalReady === true && receipt.policyVersion === config.policyVersion &&
        legalDocumentsMatch(record.documents, config) && legalDocumentsMatch(receipt.documents, config);
      if (!valid) {
        safeSessionRemove(PREASSESSMENT_CONSENT_KEY);
        return null;
      }
      return { token: receipt.token, locale: language, expiresAt: new Date(expiresAt).toISOString() };
    } catch (error) {
      safeSessionRemove(PREASSESSMENT_CONSENT_KEY);
      return null;
    }
  }

  function storeConsentReceipt(data, config) {
    var token = typeof data.token === "string" ? data.token : "";
    var record = data.record && typeof data.record === "object" ? data.record : decodeConsentTokenRecord(token);
    var expiresAt = String(data.expiresAt || (record && record.expiresAt) || "");
    var bundle = legalBundle();
    if (!token || !record || !bundle || record.locale !== language || record.contentVersion !== bundle.version || config.legalContentVersion !== bundle.version || !Number.isFinite(Date.parse(expiresAt)) || Date.parse(expiresAt) <= Date.now() || !legalDocumentsMatch(record.documents, config)) return null;
    var stored = {
      token: token,
      locale: language,
      acceptedAt: String(data.acceptedAt || record.acceptedAt || ""),
      expiresAt: expiresAt,
      contentVersion: bundle.version,
      policyVersion: config.policyVersion,
      documents: {
        policyVersion: record.documents.policyVersion,
        privacyVersion: record.documents.privacyVersion,
        privacySha256: record.documents.privacySha256,
        termsVersion: record.documents.termsVersion,
        termsSha256: record.documents.termsSha256
      }
    };
    if (!safeSessionSet(PREASSESSMENT_CONSENT_KEY, JSON.stringify(stored))) return null;
    return { token: token, locale: language, expiresAt: expiresAt };
  }

  function legalSectionsHtml(sections) {
    return '<div class="cc-legal-sections">' + sections.map(function (section) {
      return '<article><h3>' + escapeHtml(section[0]) + '</h3><p>' + escapeHtml(section[1]) + '</p></article>';
    }).join("") + '</div>';
  }

  function legalCheckHtml(name, label, required, legal) {
    return '<label class="cc-legal-check"><input type="checkbox" name="' + name + '"' + (required ? ' data-legal-required' : '') + '><span><strong>' + escapeHtml(required ? legal.ui.required : legal.ui.optional) + '</strong>' + escapeHtml(label) + '</span></label>';
  }

  function legalStatusHtml(legal) {
    var bundle = legalBundle();
    return bundle && bundle.isProductionReady !== true ? '<p class="cc-legal-draft">' + escapeHtml(legal.ui.draft) + '</p>' : "";
  }

  function showLegalDialog() {
    legalReturnFocus = document.activeElement;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setModalBackgroundDisabled(true, false);
    legalModal.hidden = false;
    window.requestAnimationFrame(function () {
      var first = legalModal.querySelector('input:not([disabled]),button:not([disabled]),a[href]');
      if (first) first.focus();
    });
  }

  function closeLegalGate(receipt) {
    if (legalModal && !legalModal.hidden) {
      legalModal.hidden = true;
      legalModal.querySelector(".cc-legal-panel").innerHTML = "";
      document.body.style.overflow = previousBodyOverflow;
      setModalBackgroundDisabled(false, false);
      legalModal.removeAttribute("aria-busy");
      if (legalReturnFocus && document.contains(legalReturnFocus)) legalReturnFocus.focus();
      legalReturnFocus = null;
    }
    var resolve = legalGateResolve;
    legalGateResolve = null;
    legalGatePromise = null;
    if (resolve) resolve(receipt || null);
  }

  function setLegalValidation(form, message) {
    var status = form.querySelector(".cc-legal-error");
    var missing = Array.from(form.querySelectorAll("[data-legal-required]")).filter(function (input) { return !input.checked; });
    form.querySelectorAll("[data-legal-required]").forEach(function (input) { input.removeAttribute("aria-invalid"); });
    if (!missing.length) {
      status.hidden = true;
      status.textContent = "";
      return true;
    }
    missing.forEach(function (input) { input.setAttribute("aria-invalid", "true"); });
    status.textContent = message;
    status.hidden = false;
    missing[0].focus();
    return false;
  }

  function clearLegalValidation(form) {
    form.querySelectorAll("[data-legal-required]").forEach(function (input) { input.removeAttribute("aria-invalid"); });
    var status = form.querySelector(".cc-legal-error");
    status.hidden = true;
    status.textContent = "";
  }

  function renderLegalUnavailable(legal) {
    var panel = legalModal.querySelector(".cc-legal-panel");
    legalModal.lang = language;
    legalModal.dir = legal ? legal.direction : (language === "ar" ? "rtl" : "ltr");
    panel.innerHTML = [
      legal ? legalStatusHtml(legal) : "",
      '<h2 id="ccLegalTitle">Cogniva Compass</h2>',
      '<p class="cc-legal-lead">' + escapeHtml(flowCopy().legalUnavailable) + '</p>',
      '<div class="cc-legal-actions"><button class="cc-button cc-secondary" type="button" data-legal-cancel>' + escapeHtml(legal ? legal.ui.cancel : copy().close) + '</button></div>'
    ].join("");
    panel.querySelector("[data-legal-cancel]").addEventListener("click", function () { closeLegalGate(null); });
  }

  function renderLegalTerms(legal, config) {
    legalGateStep = 1;
    var termsUrl = safePublicUrl(config.termsUrl);
    var panel = legalModal.querySelector(".cc-legal-panel");
    legalModal.lang = language;
    legalModal.dir = legal.direction;
    panel.innerHTML = [
      legalStatusHtml(legal),
      '<p class="cc-legal-step">' + escapeHtml(legal.ui.stepTerms) + '</p>',
      '<h2 id="ccLegalTitle">' + escapeHtml(legal.ui.termsTitle) + '</h2>',
      '<p class="cc-legal-lead">' + escapeHtml(legal.terms.lead) + '</p>',
      legalSectionsHtml(legal.terms.sections),
      '<form class="cc-legal-form" novalidate><p class="cc-legal-help">' + escapeHtml(legal.ui.readBeforeContinuing) + '</p>',
        legalCheckHtml("adultConfirmed", legal.terms.checks.adultConfirmed, true, legal),
        legalCheckHtml("ownResponsesConfirmed", legal.terms.checks.ownResponsesConfirmed, true, legal),
        legalCheckHtml("nonDiagnosticAccepted", legal.terms.checks.nonDiagnosticAcknowledged, true, legal),
        legalCheckHtml("termsAccepted", legal.terms.checks.termsAccepted, true, legal),
        (termsUrl ? '<a class="cc-legal-document-link" href="' + escapeHtml(termsUrl) + '" target="_blank" rel="noopener">' + escapeHtml(legal.ui.openTerms) + '</a>' : ""),
        '<p class="cc-legal-error" role="alert" tabindex="-1" hidden></p>',
        '<div class="cc-legal-actions"><button class="cc-button cc-secondary" type="button" data-legal-cancel>' + escapeHtml(legal.ui.cancel) + '</button><button class="cc-button" type="submit">' + escapeHtml(legal.ui.continue) + '</button></div>',
      '</form>'
    ].join("");
    var form = panel.querySelector("form");
    panel.querySelector("[data-legal-cancel]").addEventListener("click", function () { closeLegalGate(null); });
    form.addEventListener("change", function () { clearLegalValidation(form); });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!setLegalValidation(form, legal.ui.validationMessage)) return;
      renderLegalPrivacy(legal, config, {
        adultConfirmed: true,
        ownResponsesConfirmed: true,
        nonDiagnosticAccepted: true,
        termsAccepted: true
      });
    });
  }

  function renderLegalPrivacy(legal, config, acceptedTerms) {
    legalGateStep = 2;
    var privacyUrl = safePublicUrl(config.privacyUrl);
    var panel = legalModal.querySelector(".cc-legal-panel");
    panel.innerHTML = [
      legalStatusHtml(legal),
      '<p class="cc-legal-step">' + escapeHtml(legal.ui.stepPrivacy) + '</p>',
      '<h2 id="ccLegalTitle">' + escapeHtml(legal.ui.privacyTitle) + '</h2>',
      '<p class="cc-legal-lead">' + escapeHtml(legal.privacy.lead) + '</p>',
      legalSectionsHtml(legal.privacy.sections),
      '<form class="cc-legal-form" novalidate><p class="cc-legal-help">' + escapeHtml(legal.ui.readBeforeContinuing) + '</p>',
        legalCheckHtml("privacyAcknowledged", legal.privacy.checks.privacyNoticeAcknowledged, true, legal),
        legalCheckHtml("specialCategoryConsent", legal.privacy.checks.specialCategoryExplicitConsent, true, legal),
        legalCheckHtml("analyticsConsent", legal.privacy.optional.analyticsConsent, false, legal),
        '<div class="cc-legal-note"><p>' + escapeHtml(legal.privacy.withdrawal) + '</p><p>' + escapeHtml(legal.privacy.checkoutSeparate) + '</p></div>',
        (privacyUrl ? '<a class="cc-legal-document-link" href="' + escapeHtml(privacyUrl) + '" target="_blank" rel="noopener">' + escapeHtml(legal.ui.openPrivacy) + '</a>' : ""),
        '<p class="cc-legal-error" role="alert" tabindex="-1" hidden></p>',
        '<div class="cc-legal-actions"><button class="cc-button cc-secondary" type="button" data-legal-back>' + escapeHtml(legal.ui.back) + '</button><button class="cc-button cc-orange" type="submit">' + escapeHtml(legal.ui.acceptAndStart) + '</button></div>',
      '</form>'
    ].join("");
    var form = panel.querySelector("form");
    panel.querySelector("[data-legal-back]").addEventListener("click", function () { renderLegalTerms(legal, config); });
    form.addEventListener("change", function () { clearLegalValidation(form); });
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (!setLegalValidation(form, legal.ui.validationMessage)) return;
      var submit = form.querySelector('[type="submit"]');
      var back = form.querySelector("[data-legal-back]");
      var errorBox = form.querySelector(".cc-legal-error");
      submit.disabled = true;
      back.disabled = true;
      legalModal.setAttribute("aria-busy", "true");
      submit.textContent = flowCopy().legalSaving;
      errorBox.hidden = true;
      try {
        var response = await fetch(apiUrl("/api/legal/consent"), {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          credentials: "omit",
          body: JSON.stringify({
            locale: language,
            contentVersion: legalBundle().version,
            adultConfirmed: acceptedTerms.adultConfirmed,
            ownResponsesConfirmed: acceptedTerms.ownResponsesConfirmed,
            termsAccepted: acceptedTerms.termsAccepted,
            nonDiagnosticAccepted: acceptedTerms.nonDiagnosticAccepted,
            privacyAcknowledged: true,
            specialCategoryConsent: true,
            analyticsConsent: form.elements.analyticsConsent.checked
          })
        });
        var data = await response.json().catch(function () { return {}; });
        var receipt = response.ok && data.ok === true ? storeConsentReceipt(data, config) : null;
        if (!receipt) throw new Error("Consent receipt was not issued");
        legalModal.removeAttribute("aria-busy");
        closeLegalGate(receipt);
      } catch (error) {
        console.error("Cogniva consent could not be recorded", error);
        errorBox.textContent = flowCopy().legalSubmitError;
        errorBox.hidden = false;
        submit.disabled = false;
        back.disabled = false;
        legalModal.removeAttribute("aria-busy");
        submit.textContent = legal.ui.acceptAndStart;
        errorBox.focus();
      }
    });
  }

  function openLegalGate(config) {
    if (legalGatePromise) return legalGatePromise;
    var legal = legalLocaleContent();
    legalGatePromise = new Promise(function (resolve) { legalGateResolve = resolve; });
    var ready = config && config.legalReady === true && legal && legalBundle() && legalBundle().isProductionReady === true;
    if (ready) renderLegalTerms(legal, config);
    else renderLegalUnavailable(legal);
    showLegalDialog();
    return legalGatePromise;
  }

  async function ensurePreassessmentConsent() {
    var config = await loadPublicConfig();
    var stored = validStoredConsent(config);
    if (stored) return stored;
    return openLegalGate(config);
  }

  function hasProgress() {
    return view === "quiz" && answers.some(function (answer) { return Number.isInteger(answer); });
  }

  function abandonCurrent() {
    if (mode && window.COGNIVA_SELECTION_V1) {
      try { window.COGNIVA_SELECTION_V1.clearActiveForm(mode); } catch (error) {}
    }
    mode = null;
    questionIndex = 0;
    answers = [];
    currentItems = [];
    currentFormId = null;
  }

  function requestHome() {
    if (hasProgress() && !window.confirm(copy().leaveWarning)) return;
    navigationGeneration += 1;
    abandonCurrent();
    lastCompletion = null;
    completedAssessments = { cognitive: null, emotional: null };
    activeOrder = null;
    safeSessionRemove(ORDER_SESSION_KEY);
    safeSessionRemove(CHECKOUT_RECOVERY_KEY);
    cleanCheckoutUrl();
    home();
  }

  function selectLanguage(nextLanguage) {
    var normalized = validLanguage(nextLanguage);
    if (!normalized || normalized === language) {
      closeLanguageModal();
      return;
    }
    if (hasProgress() && !window.confirm(copy().leaveWarning)) return;
    if (view === "quiz") abandonCurrent();
    language = normalized;
    safeSessionRemove(PREASSESSMENT_CONSENT_KEY);
    safeStorageSet("cc_lang", language);
    updateLanguageUrl();
    closeLanguageModal();
    applyLanguage();
    if (view === "result" && lastCompletion) renderResult(lastCompletion);
    else if (view === "order" && activeOrder) renderOrderPage(activeOrder);
    else home();
  }

  function renderFooter(config) {
    var c = copy();
    var links = [];
    if (config && safePublicUrl(config.privacyUrl)) links.push('<a href="' + escapeHtml(safePublicUrl(config.privacyUrl)) + '" target="_blank" rel="noopener">' + c.privacy + '</a>');
    if (config && safePublicUrl(config.termsUrl)) links.push('<a href="' + escapeHtml(safePublicUrl(config.termsUrl)) + '" target="_blank" rel="noopener">' + c.terms + '</a>');
    if (config && safePublicUrl(config.contactUrl)) links.push('<a href="' + escapeHtml(safePublicUrl(config.contactUrl)) + '" target="_blank" rel="noopener">' + c.contact + '</a>');
    footer.innerHTML = '<span>© ' + new Date().getFullYear() + ' Cogniva Compass · ' + c.footer + '</span>' + (links.length ? '<nav class="cc-footer-links" aria-label="' + escapeHtml(c.noteTitle) + '">' + links.join("") + '</nav>' : "");
  }

  function home() {
    navigationGeneration += 1;
    orderPollGeneration += 1;
    view = "home";
    var c = copy();
    app.innerHTML = [
      '<section class="cc-hero">',
        '<div class="cc-hero-copy"><p class="cc-eyebrow">' + c.eyebrow + '</p><h1>' + c.title + '</h1><p class="cc-lead">' + c.lead + '</p>',
          '<div class="cc-actions"><button class="cc-button" type="button" data-start="cognitive">' + c.startCognitive + '</button><button class="cc-button cc-secondary" type="button" data-start="emotional">' + c.startEmotional + '</button></div>',
          '<ul class="cc-trust-row"><li><span class="cc-trust-dot"></span>' + c.duration + '</li><li><span class="cc-trust-dot"></span>' + c.private + '</li><li><span class="cc-trust-dot"></span>' + c.account + '</li></ul>',
        '</div>',
        '<div class="cc-hero-visual" aria-hidden="true"><div class="cc-visual-frame"><span class="cc-visual-line cc-one"></span><span class="cc-visual-line cc-two"></span><div class="cc-visual-node cc-a"><span><strong>20</strong>' + c.cognitive + '</span></div><div class="cc-visual-node cc-b"><span><strong>24</strong>' + c.emotional + '</span></div><div class="cc-visual-node cc-c"><span><strong>4+4</strong>' + c.reflectStep + '</span></div></div></div>',
      '</section>',
      '<section class="cc-section cc-tint"><div class="cc-section-head"><p class="cc-eyebrow">Cogniva Compass</p><h2>' + c.howTitle + '</h2><p class="cc-lead">' + c.howLead + '</p></div>',
        '<div class="cc-process-grid"><article class="cc-process-card"><span class="cc-step-number">01</span><h3>' + c.chooseStep + '</h3><p>' + c.chooseStepBody + '</p></article><article class="cc-process-card"><span class="cc-step-number">02</span><h3>' + c.answerStep + '</h3><p>' + c.answerStepBody + '</p></article><article class="cc-process-card"><span class="cc-step-number">03</span><h3>' + c.reflectStep + '</h3><p>' + c.reflectStepBody + '</p></article></div>',
      '</section>',
      '<section class="cc-section"><div class="cc-section-head"><h2>' + c.chooseTitle + '</h2></div><div class="cc-track-grid">',
        '<article class="cc-track-card"><p class="cc-track-kicker">' + c.taskKicker + '</p><h3>' + c.cognitive + '</h3><p>' + c.cognitiveBody + '</p><button class="cc-button" type="button" data-start="cognitive">' + c.startCognitive + '</button></article>',
        '<article class="cc-track-card cc-emotional"><p class="cc-track-kicker">' + c.reflectionKicker + '</p><h3>' + c.emotional + '</h3><p>' + c.emotionalBody + '</p><button class="cc-button cc-orange" type="button" data-start="emotional">' + c.startEmotional + '</button></article>',
      '</div></section>',
      '<section class="cc-section cc-tint"><div class="cc-disclaimer"><span class="cc-info-mark" aria-hidden="true">i</span><div><h3>' + c.noteTitle + '</h3><p>' + c.disclaimer + '</p></div></div></section>'
    ].join("");
    app.querySelectorAll("[data-start]").forEach(function (button) {
      button.addEventListener("click", function () { start(button.dataset.start); });
    });
    loadPublicConfig().then(function () { renderFooter(publicConfig); });
  }

  function loadScript(path, id) {
    return new Promise(function (resolve, reject) {
      var existing = document.getElementById(id);
      if (existing) {
        if (existing.dataset.loaded === "true") resolve();
        else {
          existing.addEventListener("load", resolve, { once: true });
          existing.addEventListener("error", reject, { once: true });
        }
        return;
      }
      var script = document.createElement("script");
      script.id = id;
      script.src = assetUrl(path) + "?v=" + VERSION;
      script.async = false;
      script.addEventListener("load", function () { script.dataset.loaded = "true"; resolve(); }, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.body.appendChild(script);
    });
  }

  function loadRuntime() {
    if (!runtimePromise) {
      runtimePromise = loadScript("banks/cogniva-banks.v1.js", "cc-banks")
        .then(function () { return loadScript("selection-engine.js", "cc-selection"); })
        .then(function () { return loadScript("result-model.js", "cc-result-model"); })
        .then(function () { return loadScript("result-insights.js", "cc-result-insights"); });
    }
    return runtimePromise;
  }

  function showLoading() {
    view = "loading";
    app.innerHTML = '<section class="cc-quiz-shell"><p class="cc-status-message" role="status">' + copy().loading + '</p></section>';
    app.focus();
  }

  function showLoadError() {
    view = "error";
    app.innerHTML = '<section class="cc-quiz-shell"><p class="cc-status-message" role="alert">' + copy().loadError + '</p><div class="cc-actions"><button class="cc-button" type="button" data-restart>' + copy().returnHome + '</button></div></section>';
    app.querySelector("[data-restart]").addEventListener("click", requestHome);
    app.focus();
  }

  async function start(track) {
    var requestGeneration = ++navigationGeneration;
    try {
      var consentReceipt = await ensurePreassessmentConsent();
      if (!consentReceipt || requestGeneration !== navigationGeneration) return;
      showLoading();
      await loadRuntime();
      if (requestGeneration !== navigationGeneration || view !== "loading") return;
      var selector = window.COGNIVA_SELECTION_V1;
      var model = window.COGNIVA_RESULT_MODEL_V1;
      var insights = window.COGNIVA_RESULT_INSIGHTS_V1 && window.COGNIVA_RESULT_INSIGHTS_V1.languages && window.COGNIVA_RESULT_INSIGHTS_V1.languages[language];
      if (!selector || !model || !insights) throw new Error("Assessment runtime is incomplete");
      var form = selector.getOrCreateForm(track);
      currentItems = selector.getItems(track, language);
      var expected = track === "cognitive" ? 20 : 24;
      if (!form || !form.formId || currentItems.length !== expected) throw new Error("Invalid form assembly");
      mode = track;
      currentFormId = form.formId;
      questionIndex = 0;
      answers = [];
      safeSessionRemove(CHECKOUT_RECOVERY_KEY);
      renderQuestion();
    } catch (error) {
      if (requestGeneration !== navigationGeneration) return;
      console.error("Cogniva reflection could not start", error);
      showLoadError();
    }
  }

  function trackTitle(track) {
    return track === "cognitive" ? copy().cognitive : copy().emotional;
  }

  function domainLabel(domain) {
    return copy().domains[domain];
  }

  function renderQuestion() {
    view = "quiz";
    var c = copy();
    var item = currentItems[questionIndex];
    var options = mode === "cognitive" ? item.choices : item.responseOptions;
    var selected = answers[questionIndex];
    var progress = Math.round(((questionIndex + 1) / currentItems.length) * 100);
    app.innerHTML = [
      '<section class="cc-quiz-shell" aria-labelledby="ccQuestionTitle">',
        '<div class="cc-quiz-nav"><button class="cc-back-button" type="button" data-back><span class="cc-back-arrow" aria-hidden="true">←</span><span>' + c.back + '</span></button><span class="cc-quiz-count">' + c.question + ' ' + (questionIndex + 1) + ' ' + c.of + ' ' + currentItems.length + '</span></div>',
        '<div class="cc-progress" role="progressbar" aria-label="' + escapeHtml(trackTitle(mode)) + '" aria-valuemin="1" aria-valuemax="' + currentItems.length + '" aria-valuenow="' + (questionIndex + 1) + '" aria-valuetext="' + escapeHtml(c.question + ' ' + (questionIndex + 1) + ' ' + c.of + ' ' + currentItems.length) + '"><span class="cc-progress-bar" style="width:' + progress + '%"></span></div>',
        '<p class="cc-eyebrow">' + escapeHtml(domainLabel(item.domain)) + '</p><h1 class="cc-question-title" id="ccQuestionTitle" tabindex="-1">' + escapeHtml(item.prompt) + '</h1>',
        '<form><fieldset class="cc-answers" aria-labelledby="ccQuestionTitle"><legend class="cc-visually-hidden">' + escapeHtml(item.prompt) + '</legend>' + options.map(function (option, optionIndex) {
          return '<label class="cc-answer"><input required type="radio" name="answer" value="' + optionIndex + '"' + (selected === optionIndex ? " checked" : "") + '><span>' + escapeHtml(option) + '</span></label>';
        }).join("") + '</fieldset><div class="cc-answer-actions"><button class="cc-button" type="submit"' + (Number.isInteger(selected) ? "" : " disabled") + '>' + c.next + '</button></div></form>',
      '</section>'
    ].join("");

    var form = app.querySelector("form");
    var nextButton = form.querySelector('[type="submit"]');
    form.addEventListener("change", function (event) {
      if (event.target.name !== "answer") return;
      answers[questionIndex] = Number(event.target.value);
      nextButton.disabled = false;
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var answer = Number(new FormData(form).get("answer"));
      if (!Number.isInteger(answer)) return;
      answers[questionIndex] = answer;
      questionIndex += 1;
      if (questionIndex < currentItems.length) renderQuestion();
      else finishAssessment();
    });
    app.querySelector("[data-back]").addEventListener("click", function () {
      if (questionIndex > 0) {
        questionIndex -= 1;
        renderQuestion();
      } else {
        requestHome();
      }
    });
    app.querySelector("#ccQuestionTitle").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function finishAssessment() {
    try {
      var resultData = window.COGNIVA_RESULT_MODEL_V1.calculate(mode, currentItems, answers);
      var completion = {
        track: mode,
        formId: currentFormId,
        responses: currentItems.map(function (item, itemIndex) { return { id: item.id, answer: answers[itemIndex] }; }),
        resultData: resultData
      };
      lastCompletion = completion;
      completedAssessments[completion.track] = completion;
      try { window.COGNIVA_SELECTION_V1.completeForm(mode); } catch (error) {}
      mode = null;
      questionIndex = 0;
      answers = [];
      currentItems = [];
      currentFormId = null;
      renderResult(completion);
    } catch (error) {
      console.error("Cogniva result calculation failed", error);
      showLoadError();
    }
  }

  function renderResult(completion) {
    view = "result";
    var c = copy();
    var insights = window.COGNIVA_RESULT_INSIGHTS_V1.languages[language];
    var scores = completion.resultData.scores;
    var ranked = DOMAIN_ORDER[completion.track].map(function (domain) {
      return [domain, Number(scores[domain])];
    }).sort(function (left, right) { return right[1] - left[1]; });
    var highest = ranked[0][1];
    var lowest = ranked[ranked.length - 1][1];
    var highDomains = ranked.filter(function (entry) { return entry[1] === highest; }).map(function (entry) { return entry[0]; });
    var lowDomains = ranked.filter(function (entry) { return entry[1] === lowest; }).map(function (entry) { return entry[0]; });
    var highlights;
    if (highest === lowest) {
      highlights = '<div class="cc-result-highlights cc-balanced"><article class="cc-result-highlight"><span>' + c.snapshot + '</span><strong>' + c.balancedLabel + '</strong><p>' + c.balancedBody + '</p></article></div>';
    } else {
      highlights = '<div class="cc-result-highlights"><article class="cc-result-highlight"><span>' + c.mostVisible + '</span><strong>' + escapeHtml(highDomains.map(domainLabel).join(" · ")) + '</strong><p>' + escapeHtml(insights.domainDescriptions[highDomains[0]]) + '</p></article><article class="cc-result-highlight"><span>' + c.practiceFocus + '</span><strong>' + escapeHtml(lowDomains.map(domainLabel).join(" · ")) + '</strong><p>' + escapeHtml(insights.domainTips[lowDomains[0]]) + '</p></article></div>';
    }
    var domainCards = DOMAIN_ORDER[completion.track].map(function (domain) {
      return '<article class="cc-domain-result"><div class="cc-domain-head"><h3>' + escapeHtml(domainLabel(domain)) + '</h3></div><p>' + escapeHtml(insights.domainDescriptions[domain]) + '</p><div class="cc-next-step"><strong>' + escapeHtml(insights.nextStepLabel) + '</strong><span>' + escapeHtml(insights.domainTips[domain]) + '</span></div></article>';
    }).join("");
    var howPoints = insights.howPoints[completion.track];
    var otherTrack = completion.track === "cognitive" ? "emotional" : "cognitive";
    app.innerHTML = [
      '<section class="cc-result" aria-labelledby="ccResultTitle"><p class="cc-eyebrow">' + trackTitle(completion.track) + '</p><h1 id="ccResultTitle" tabindex="-1">' + c.resultTitle + '</h1>',
        '<div class="cc-result-overview"><div class="cc-snapshot-marker"><span>' + c.snapshot + '</span><strong>' + escapeHtml(trackTitle(completion.track)) + '</strong></div><div class="cc-result-summary"><h2>' + escapeHtml(insights.interpretationTitle) + '</h2><p class="cc-result-lead">' + escapeHtml(insights.interpretationLead[completion.track]) + '</p></div></div>',
        highlights,
        '<section class="cc-how-to" aria-labelledby="ccHowResultTitle"><h2 id="ccHowResultTitle">' + escapeHtml(insights.howTitle) + '</h2><ul>' + howPoints.map(function (point) { return '<li><span class="cc-check-mark" aria-hidden="true">✓</span><span>' + escapeHtml(point) + '</span></li>'; }).join("") + '</ul></section>',
        '<section class="cc-domain-analysis" aria-labelledby="ccDomainTitle"><h2 id="ccDomainTitle">' + escapeHtml(insights.domainAnalysisTitle) + '</h2><div class="cc-domain-results">' + domainCards + '</div></section>',
        '<aside class="cc-result-note"><h2>' + c.noteTitle + '</h2><p>' + c.disclaimer + '</p></aside>',
        '<section class="cc-report-offer" id="ccReportOffer" aria-live="polite"><h2>' + c.reportTitle + '</h2><p>' + c.reportLead + '</p><p class="cc-report-unavailable" role="status">' + c.configLoading + '</p></section>',
        '<div class="cc-actions"><button class="cc-button" type="button" data-other>' + (otherTrack === "cognitive" ? c.startCognitive : c.startEmotional) + '</button><button class="cc-button cc-secondary" type="button" data-restart>' + c.returnHome + '</button></div>',
      '</section>'
    ].join("");
    app.querySelector("[data-other]").addEventListener("click", function () { start(otherTrack); });
    app.querySelector("[data-restart]").addEventListener("click", requestHome);
    app.querySelector("#ccResultTitle").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "auto" });
    loadPublicConfig().then(function () {
      if (view === "result" && lastCompletion === completion) renderReportOffer(completion);
    });
  }

  function normalizeConfig(data) {
    var source = data && typeof data === "object" ? data : {};
    var products = Array.isArray(source.products) ? source.products.map(function (product) {
      var code = String(product && product.code || "");
      var currency = String(product && product.currency || "");
      var requiredTracks = Array.isArray(product && product.requiredTracks) ? product.requiredTracks.filter(function (track) { return ["cognitive", "emotional"].indexOf(track) !== -1; }) : [];
      if (["single_v1", "bundle_v1"].indexOf(code) === -1 || !Number.isInteger(product.amount) || product.amount < 1 || !/^[A-Z]{3}$/.test(currency)) return null;
      return {
        code: code,
        priceLabel: typeof product.priceLabel === "string" ? product.priceLabel.trim() : "",
        amount: product.amount,
        currency: currency,
        taxBehavior: ["inclusive", "exclusive", "unspecified"].indexOf(String(product.taxBehavior || "")) === -1 ? "unspecified" : String(product.taxBehavior),
        assessmentCount: Number(product.assessmentCount),
        requiredTracks: requiredTracks
      };
    }).filter(Boolean) : [];
    return {
      commerceReady: source.commerceReady === true,
      legalReady: source.legalReady === true,
      products: products,
      aiReportAvailable: source.aiReportAvailable === true,
      legalContentVersion: typeof source.legalContentVersion === "string" ? source.legalContentVersion : "",
      policyVersion: typeof source.policyVersion === "string" ? source.policyVersion : "",
      privacyVersion: typeof source.privacyVersion === "string" ? source.privacyVersion : "",
      termsVersion: typeof source.termsVersion === "string" ? source.termsVersion : "",
      privacyDocumentSha256: typeof source.privacyDocumentSha256 === "string" ? source.privacyDocumentSha256 : "",
      termsDocumentSha256: typeof source.termsDocumentSha256 === "string" ? source.termsDocumentSha256 : "",
      privacyUrl: safePublicUrl(source.privacyUrl),
      termsUrl: safePublicUrl(source.termsUrl),
      contactUrl: safePublicUrl(source.contactUrl)
    };
  }

  function productByCode(config, code) {
    return config.products.find(function (product) { return product.code === code; }) || null;
  }

  function formattedProductPrice(product) {
    if (product && product.amount && product.currency) {
      try {
        return new Intl.NumberFormat(INTL_LOCALES[language] || "en-US", {
          style: "currency",
          currency: product.currency
        }).format(product.amount / 100);
      } catch (error) {}
    }
    return product ? product.priceLabel : "";
  }

  function loadPublicConfig() {
    if (!configPromise) {
      var requestOptions = { method: "GET", headers: { Accept: "application/json" }, credentials: "omit", cache: "no-store" };
      configPromise = Promise.all([
        fetch(apiUrl("/api/config"), requestOptions),
        fetch(apiUrl("/api/legal/config"), requestOptions)
      ])
        .then(async function (responses) {
          var commerceData = await responses[0].json().catch(function () { return {}; });
          var legalData = await responses[1].json().catch(function () { return {}; });
          publicConfig = normalizeConfig(Object.assign({}, commerceData, legalData));
          if (!responses[0].ok) publicConfig.commerceReady = false;
          if (!responses[1].ok) publicConfig.legalReady = false;
          return publicConfig;
        })
        .catch(function () {
          publicConfig = normalizeConfig({});
          return publicConfig;
        });
    }
    return configPromise;
  }

  function renderReportOffer(completion) {
    var offer = app.querySelector("#ccReportOffer");
    if (!offer) return;
    var c = copy();
    var flow = flowCopy();
    var emailCopy = EMAIL_CONFIRM_COPY[language];
    var config = publicConfig || normalizeConfig({});
    renderFooter(config);
    var singleProduct = productByCode(config, "single_v1");
    var bundleProduct = productByCode(config, "bundle_v1");
    var singlePrice = formattedProductPrice(singleProduct);
    var bundlePrice = formattedProductPrice(bundleProduct);
    var bundleComplete = Boolean(completedAssessments.cognitive && completedAssessments.emotional);
    if (!config.commerceReady || !config.legalReady || !singleProduct || !bundleProduct || !singlePrice || !bundlePrice || !config.privacyUrl || !config.termsUrl || !config.policyVersion) {
      offer.innerHTML = '<h2>' + c.reportTitle + '</h2><p>' + c.reportLead + '</p><p class="cc-report-unavailable" role="status">' + c.notAvailable + '</p>';
      return;
    }
    offer.innerHTML = [
      '<h2>' + c.reportTitle + '</h2><p>' + c.reportLead + '</p>',
      '<form class="cc-checkout-form"><fieldset class="cc-package-picker"><legend>' + escapeHtml(flow.packageLegend) + '</legend><div class="cc-package-grid">',
        '<label class="cc-package-card"><input type="radio" name="packageCode" value="single_v1"' + (bundleComplete ? '' : ' checked') + '><span class="cc-package-card-body"><span class="cc-package-heading"><strong>' + escapeHtml(flow.singleName) + '</strong><b>' + escapeHtml(singlePrice) + '</b></span><span>' + escapeHtml(flow.singleDescription) + '</span><small>' + escapeHtml(trackTitle(completion.track)) + '</small></span></label>',
        '<label class="cc-package-card' + (bundleComplete ? '' : ' cc-package-disabled') + '"><input type="radio" name="packageCode" value="bundle_v1"' + (bundleComplete ? ' checked' : ' disabled') + '><span class="cc-package-card-body"><span class="cc-package-heading"><strong>' + escapeHtml(flow.bundleName) + '</strong><b>' + escapeHtml(bundlePrice) + '</b></span><span>' + escapeHtml(flow.bundleDescription) + '</span><small>' + escapeHtml(bundleComplete ? flow.bundleReady : flow.bundleLocked) + '</small></span></label>',
      '</div>' + (bundleComplete ? '' : '<button class="cc-package-complete" type="button" data-complete-bundle>' + escapeHtml(completion.track === "cognitive" ? c.startEmotional : c.startCognitive) + '</button>') + '</fieldset>',
        ((singleProduct.taxBehavior === "inclusive" && bundleProduct.taxBehavior === "inclusive") ? "" : '<p class="cc-tax-note">' + c.taxAtCheckout + '</p>'),
        '<label class="cc-field"><span>' + c.email + '</span><input type="email" name="email" autocomplete="email" inputmode="email" required maxlength="254"><small>' + c.emailHint + '</small></label>',
        '<label class="cc-field"><span>' + emailCopy.label + '</span><input type="email" name="confirmEmail" autocomplete="email" inputmode="email" required maxlength="254"></label>',
        '<label class="cc-consent"><input type="checkbox" name="purchaseTermsAccepted" required><span>' + c.termsPre + ' <a href="' + escapeHtml(config.termsUrl) + '" target="_blank" rel="noopener">' + c.termsLink + '</a>.</span></label>',
        '<label class="cc-consent"><input type="checkbox" name="immediatePerformanceAccepted" required><span>' + c.immediate + '</span></label>',
        (config.aiReportAvailable ? '<label class="cc-consent cc-optional"><input type="checkbox" name="aiConsent"><span>' + c.aiConsent + ' (' + c.optional + ')</span></label>' : ""),
        '<p class="cc-payment-note">' + c.paymentNote + ' <a href="' + escapeHtml(config.privacyUrl) + '" target="_blank" rel="noopener">' + c.privacyLink + '</a>.</p><p class="cc-checkout-error" role="alert" tabindex="-1" hidden></p><button class="cc-button cc-orange cc-payment-obligation" type="submit"></button>',
      '</form>'
    ].join("");
    var checkoutForm = offer.querySelector("form");
    function updatePackageChoice() {
      var selected = checkoutForm.querySelector('[name="packageCode"]:checked');
      checkoutForm.querySelectorAll(".cc-package-card").forEach(function (card) {
        var input = card.querySelector('[name="packageCode"]');
        card.classList.toggle("cc-package-selected", Boolean(input && input.checked));
      });
      var product = selected ? productByCode(config, selected.value) : null;
      checkoutForm.querySelector(".cc-payment-obligation").textContent = flow.orderAndPay + (product ? " · " + formattedProductPrice(product) : "");
    }
    updatePackageChoice();
    checkoutForm.addEventListener("input", function (event) {
      if (event.target.name === "email" || event.target.name === "confirmEmail") checkoutForm.elements.confirmEmail.setCustomValidity("");
      if (event.target.name === "packageCode") updatePackageChoice();
    });
    var completeBundle = checkoutForm.querySelector("[data-complete-bundle]");
    if (completeBundle) completeBundle.addEventListener("click", function () { start(completion.track === "cognitive" ? "emotional" : "cognitive"); });
    checkoutForm.addEventListener("submit", function (event) { beginCheckout(event, completion, config); });
  }

  function checkoutAssessment(completion) {
    return {
      track: completion.track,
      formId: completion.formId,
      responses: completion.responses.map(function (response) { return { id: response.id, answer: response.answer }; })
    };
  }

  function assessmentsForPackage(packageCode, completion) {
    if (packageCode === "single_v1") return [checkoutAssessment(completion)];
    if (packageCode === "bundle_v1" && completedAssessments.cognitive && completedAssessments.emotional) {
      return [checkoutAssessment(completedAssessments.cognitive), checkoutAssessment(completedAssessments.emotional)];
    }
    return null;
  }

  async function beginCheckout(event, completion, config) {
    event.preventDefault();
    var form = event.currentTarget;
    var submit = form.querySelector('[type="submit"]');
    var errorBox = form.querySelector(".cc-checkout-error");
    var email = String(form.elements.email.value || "").trim();
    var confirmEmail = String(form.elements.confirmEmail.value || "").trim();
    form.elements.confirmEmail.setCustomValidity(email.toLowerCase() === confirmEmail.toLowerCase() ? "" : EMAIL_CONFIRM_COPY[language].mismatch);
    if (!form.reportValidity()) return;
    submit.disabled = true;
    errorBox.hidden = true;
    var formData = new FormData(form);
    try {
      var packageCode = String(formData.get("packageCode") || "");
      var assessments = assessmentsForPackage(packageCode, completion);
      if (!assessments) throw new Error("The selected package is incomplete");
      var consentReceipt = validStoredConsent(config) || await ensurePreassessmentConsent();
      if (!consentReceipt) {
        errorBox.textContent = flowCopy().consentExpired;
        errorBox.hidden = false;
        submit.disabled = false;
        errorBox.focus();
        return;
      }
      var payload = {
        email: email,
        purchaseTermsAccepted: formData.get("purchaseTermsAccepted") === "on",
        immediatePerformanceAccepted: formData.get("immediatePerformanceAccepted") === "on",
        aiConsent: formData.get("aiConsent") === "on",
        locale: language,
        packageCode: packageCode,
        assessments: assessments,
        preassessmentConsentToken: consentReceipt.token,
        policyVersion: config.policyVersion
      };
      var response = await fetch(apiUrl("/api/checkout"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "omit",
        body: JSON.stringify(payload)
      });
      var data = await response.json().catch(function () { return {}; });
      var checkoutUrl = safePublicUrl(data.checkoutUrl);
      if (!response.ok || data.ok !== true || !data.orderId || !checkoutUrl) throw new Error("Checkout response was invalid");
      saveCheckoutRecovery(completion, packageCode);
      window.location.assign(checkoutUrl);
    } catch (error) {
      console.error("Cogniva checkout could not start", error);
      errorBox.textContent = copy().checkoutError;
      errorBox.hidden = false;
      submit.disabled = false;
      errorBox.focus && errorBox.focus();
    }
  }

  function checkoutOrderFromUrl() {
    var url = new URL(window.location.href);
    if (url.searchParams.get("checkout") === "success") {
      var hash = new URLSearchParams(url.hash.replace(/^#/, ""));
      var orderId = String(hash.get("order") || "").trim();
      var access = String(hash.get("access") || "").trim();
      var order = /^[a-zA-Z0-9_-]{8,100}$/.test(orderId) && /^[a-zA-Z0-9._~-]{16,300}$/.test(access)
        ? { orderId: orderId, access: access, invalid: false }
        : { invalid: true };
      if (!order.invalid) safeSessionSet(ORDER_SESSION_KEY, JSON.stringify(order));
      safeSessionRemove(CHECKOUT_RECOVERY_KEY);
      cleanCheckoutUrl(false);
      return order;
    }
    try {
      var stored = JSON.parse(safeSessionGet(ORDER_SESSION_KEY) || "null");
      if (stored && /^[a-zA-Z0-9_-]{8,100}$/.test(stored.orderId) && /^[a-zA-Z0-9._~-]{16,300}$/.test(stored.access)) {
        return { orderId: stored.orderId, access: stored.access, invalid: false };
      }
    } catch (error) {}
    return null;
  }

  function cancelledCheckoutFromUrl() {
    var url = new URL(window.location.href);
    if (url.searchParams.get("checkout") !== "cancelled") return null;
    var recovery = consumeCheckoutRecovery();
    cleanCheckoutUrl(true);
    return recovery || { invalid: true };
  }

  function showCheckoutCancelledNotice() {
    var target = app.querySelector(".cc-result") || app.firstElementChild;
    if (!target) return;
    target.insertAdjacentHTML("afterbegin", '<p class="cc-checkout-notice" role="status">' + copy().checkoutCancelled + '</p>');
  }

  async function restoreCancelledCheckout(recovery) {
    if (!recovery || recovery.invalid || !recovery.completion) {
      home();
      return;
    }
    language = validLanguage(recovery.language) || language;
    safeStorageSet("cc_lang", language);
    applyLanguage();
    showLoading();
    try {
      var consentReceipt = await ensurePreassessmentConsent();
      if (!consentReceipt) {
        home();
        return;
      }
      await loadRuntime();
      if (recovery.completions && typeof recovery.completions === "object") {
        ["cognitive", "emotional"].forEach(function (track) {
          var completion = recovery.completions[track];
          if (completion && completion.track === track) completedAssessments[track] = completion;
        });
      }
      lastCompletion = recovery.completion;
      completedAssessments[lastCompletion.track] = lastCompletion;
      renderResult(lastCompletion);
      showCheckoutCancelledNotice();
    } catch (error) {
      console.error("Cogniva checkout recovery failed", error);
      showLoadError();
    }
  }

  function cleanCheckoutUrl(clearStoredOrder) {
    var url = new URL(window.location.href);
    url.searchParams.delete("checkout");
    url.searchParams.delete("session_id");
    url.hash = "";
    window.history.replaceState({}, "", url.href);
    if (clearStoredOrder !== false) safeSessionRemove(ORDER_SESSION_KEY);
  }

  function renderOrderPage(order) {
    activeOrder = order;
    view = "order";
    orderPollGeneration += 1;
    var generation = orderPollGeneration;
    var c = copy();
    app.innerHTML = '<section class="cc-order-page"><div class="cc-order-card" aria-labelledby="ccOrderTitle"><div class="cc-status-indicator" id="ccOrderIndicator" aria-hidden="true">·</div><p class="cc-eyebrow">Cogniva Compass</p><h1 id="ccOrderTitle">' + c.orderTitle + '</h1><p class="cc-order-copy" id="ccOrderCopy" role="status">' + (order.invalid ? c.orderInvalid : c.orderChecking) + '</p><div class="cc-actions"><button class="cc-button cc-secondary" type="button" data-order-home>' + c.returnHome + '</button><button class="cc-button" type="button" data-order-retry hidden>' + c.retry + '</button></div></div></section>';
    app.querySelector("[data-order-home]").addEventListener("click", requestHome);
    app.querySelector("[data-order-retry]").addEventListener("click", function () { renderOrderPage(order); });
    if (!order.invalid) pollOrder(order, generation, 0);
    else setOrderVisual("invalid");
    loadPublicConfig().then(function () { renderFooter(publicConfig); });
  }

  function setOrderVisual(state) {
    var indicator = app.querySelector("#ccOrderIndicator");
    if (!indicator) return;
    indicator.className = "cc-status-indicator" + (state === "sent" ? " cc-success" : state === "failed" || state === "invalid" ? " cc-error" : "");
    indicator.textContent = state === "sent" ? "✓" : state === "failed" || state === "invalid" ? "!" : "·";
  }

  function orderState(data) {
    var status = String(data.status || "").toLowerCase();
    var email = String(data.emailDeliveryStatus || "").toLowerCase();
    var report = String(data.reportStatus || "").toLowerCase();
    if (["failed", "cancelled", "canceled", "refunded", "disputed"].indexOf(status) !== -1 || report === "failed" || ["failed", "bounced", "complained", "suppressed"].indexOf(email) !== -1) return "failed";
    if (["sent", "delivered"].indexOf(email) !== -1 || status === "fulfilled" || status === "completed") return "sent";
    if (["paid", "processing", "succeeded"].indexOf(status) !== -1 || ["queued", "processing", "ready", "completed"].indexOf(report) !== -1) return "processing";
    return "pending";
  }

  async function pollOrder(order, generation, attempt) {
    if (generation !== orderPollGeneration || view !== "order") return;
    var c = copy();
    var copyNode = app.querySelector("#ccOrderCopy");
    var retry = app.querySelector("[data-order-retry]");
    try {
      var response = await fetch(apiUrl("/api/orders/" + encodeURIComponent(order.orderId)), {
        method: "GET",
        headers: { Accept: "application/json", "X-Order-Token": order.access },
        credentials: "omit",
        cache: "no-store"
      });
      var data = await response.json().catch(function () { return {}; });
      if (!response.ok || data.ok !== true) throw new Error("Order status unavailable");
      var state = orderState(data);
      setOrderVisual(state);
      copyNode.textContent = state === "sent" ? c.orderSent : state === "failed" ? c.orderFailed : state === "processing" ? c.orderProcessing : c.orderPending;
      if (state === "sent" || state === "failed") {
        retry.hidden = state === "sent";
        return;
      }
      if (attempt >= 24) {
        retry.hidden = false;
        return;
      }
    } catch (error) {
      if (attempt >= 6) {
        copyNode.textContent = c.orderPending;
        retry.hidden = false;
        return;
      }
    }
    window.setTimeout(function () { pollOrder(order, generation, attempt + 1); }, 2500);
  }

  window.addEventListener("beforeunload", function (event) {
    if (!hasProgress()) return;
    event.preventDefault();
    event.returnValue = "";
  });

  buildShell();
  applyLanguage();
  if (queryLanguage) safeStorageSet("cc_lang", language);
  var checkoutCancellation = cancelledCheckoutFromUrl();
  var checkoutOrder = checkoutCancellation ? null : checkoutOrderFromUrl();
  if (checkoutCancellation) restoreCancelledCheckout(checkoutCancellation);
  else if (checkoutOrder) renderOrderPage(checkoutOrder);
  else home();
  if (shouldAutoOpenLanguage && !checkoutOrder && !checkoutCancellation) window.setTimeout(function () { openLanguageModal(true); }, 120);
})();
