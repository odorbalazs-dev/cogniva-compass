(function (global) {
  "use strict";

  var VERSION = "2026-07-31-draft-v1";
  var SUPPORTED_LANGUAGES = Object.freeze(["hu", "en", "de", "it", "es", "zh", "ja", "ar", "pl", "pt", "fr"]);

  /*
   * DRAFT CONTENT ONLY.
   *
   * This bundle is deliberately not marked production-ready. It must be reviewed
   * by the controller's qualified EU/Hungarian counsel and independent legal
   * translators before `status` or `isProductionReady` is changed. Checkout
   * terms, prices, immediate performance and withdrawal acknowledgements do not
   * belong to this pre-assessment flow and are intentionally excluded.
   */
  var languages = {
    hu: {
      languageName: "Magyar",
      direction: "ltr",
      ui: {
        draft: "JOGI SABLON · JÓVÁHAGYÁSRA VÁR",
        stepTerms: "1 / 2 · Feltételek",
        stepPrivacy: "2 / 2 · Adatvédelem",
        termsTitle: "Mielőtt elkezded",
        privacyTitle: "Hogyan kezeljük a válaszaidat?",
        continue: "Tovább az adatvédelemhez",
        back: "Vissza",
        acceptAndStart: "Hozzájárulok és kezdem",
        cancel: "Mégsem",
        required: "Kötelező",
        optional: "Nem kötelező",
        openTerms: "Teljes használati feltételek",
        openPrivacy: "Teljes adatkezelési tájékoztató",
        readBeforeContinuing: "Olvasd el az összefoglalót, majd jelöld be külön a kötelező pontokat.",
        validationMessage: "A folytatáshoz minden kötelező pontot külön el kell fogadnod."
      },
      terms: {
        lead: "A Cogniva Compass felnőtteknek szóló, oktatási célú önreflexiós eszköz. Rövid pillanatképet ad a mostani feladatmegoldási és önjellemzési mintákról.",
        sections: [
          ["Önreflexió, nem tesztcímke", "Nem standardizált IQ- vagy EQ-teszt, nem ad normatív, klinikai vagy alkalmassági pontszámot."],
          ["Nem diagnosztika", "Nem állít fel diagnózist, nem szűr betegséget, és nem helyettesít orvosi, pszichológiai vagy más szakértői vizsgálatot."],
          ["Felnőttek saját válaszai", "Csak 18 éven felüli személy töltheti ki saját magáról. Ne adj meg más személyre vonatkozó adatot."],
          ["Felelős használat", "Az eredmény nem használható önmagában egészségügyi, munkáltatási, oktatási, biztosítási, hitel- vagy más jelentős döntéshez."]
        ],
        checks: {
          adultConfirmed: "Megerősítem, hogy betöltöttem a 18. életévemet.",
          ownResponsesConfirmed: "A saját tapasztalataim alapján válaszolok, és nem adok meg más személyre vonatkozó adatot.",
          nonDiagnosticAcknowledged: "Értem, hogy ez oktatási önreflexió, nem IQ-/EQ-teszt, diagnózis, szűrés vagy szakvélemény.",
          termsAccepted: "Elolvastam és elfogadom a használati feltételeket."
        }
      },
      privacy: {
        lead: "A válaszok érzékeny személyes információt tükrözhetnek. Te döntöd el, hogy csak a készülékeden készül pillanatkép, vagy később fizetős riportot is kérsz.",
        sections: [
          ["Ingyenes, helyi feldolgozás", "Kitöltés közben a válaszok a böngésző memóriájában maradnak. A nyelv és a korábban látott tételazonosítók helyben tárolhatók az ismétlődés csökkentéséhez."],
          ["Csak külön választással kerül szerverre", "A nyers válaszokat csak akkor küldjük a Cogniva szerverére, ha a kitöltés után külön fizetős riportot választasz. A szerver újrapontoz, majd a nyers válaszokat nem tárolja."],
          ["Érzékeny profil", "A kognitív és érzelmi válaszok, valamint a belőlük képzett leíró profil mentális vagy egészségi állapotra utaló különleges adatnak minősülhet."],
          ["Jogok és visszavonás", "A közzétett adatkezelési tájékoztató ismerteti a megőrzést, címzetteket, adattovábbításokat és a hozzáférés, törlés, korlátozás, tiltakozás, hordozhatóság és visszavonás módját."]
        ],
        checks: {
          privacyNoticeAcknowledged: "Elolvastam és tudomásul vettem az adatkezelési tájékoztatót.",
          specialCategoryExplicitConsent: "Kifejezetten hozzájárulok a válaszaim és a belőlük képzett kognitív/érzelmi önreflexiós profil fent leírt célú feldolgozásához, ideértve azt is, ha ezek különleges személyes adatnak minősülnek."
        },
        optional: {
          analyticsConsent: "Hozzájárulok az alapvető használati analitikához. Ebbe nem kerülhet kérdőívválasz, kiválasztott terület, eredmény, email vagy fizetési adat; az elutasítás nem korlátozza a használatot."
        },
        withdrawal: "A hozzájárulás a jövőre nézve bármikor visszavonható a közzétett adatvédelmi kapcsolaton. A visszavonás előtt végzett adatkezelés jogszerűségét ez nem érinti.",
        checkoutSeparate: "A csomag, ár, fizetés, azonnali digitális teljesítés és elállás feltételeit csak a későbbi, külön checkout-lépés mutatja és fogadtatja el."
      }
    },
    en: {
      languageName: "English",
      direction: "ltr",
      ui: {
        draft: "LEGAL TEMPLATE · PENDING APPROVAL",
        stepTerms: "1 / 2 · Terms",
        stepPrivacy: "2 / 2 · Privacy",
        termsTitle: "Before you begin",
        privacyTitle: "How are your responses handled?",
        continue: "Continue to privacy",
        back: "Back",
        acceptAndStart: "I expressly agree and start",
        cancel: "Not now",
        required: "Required",
        optional: "Optional",
        openTerms: "Full terms of use",
        openPrivacy: "Full privacy notice",
        readBeforeContinuing: "Read the summary, then select each required acknowledgement separately.",
        validationMessage: "You must select every required acknowledgement before continuing."
      },
      terms: {
        lead: "Cogniva Compass is an educational self-reflection tool for adults. It provides a brief snapshot of current task-approach and self-reported patterns.",
        sections: [
          ["Reflection, not a test label", "It is not a standardized IQ or EQ test and does not provide a normative, clinical or suitability score."],
          ["Not diagnostic", "It does not diagnose or screen for a condition and does not replace medical, psychological or other qualified professional assessment."],
          ["Adults answering for themselves", "Only a person aged 18 or over may complete it about themselves. Do not enter information about another person."],
          ["Responsible use", "The result must not be used on its own for healthcare, employment, education, insurance, credit or another significant decision."]
        ],
        checks: {
          adultConfirmed: "I confirm that I am at least 18 years old.",
          ownResponsesConfirmed: "I am answering from my own experience and will not provide information about another person.",
          nonDiagnosticAcknowledged: "I understand that this is educational self-reflection, not an IQ/EQ test, diagnosis, screening or professional opinion.",
          termsAccepted: "I have read and accept the terms of use."
        }
      },
      privacy: {
        lead: "Your responses may reflect sensitive personal information. You choose whether to create only an on-device snapshot or later request a paid report.",
        sections: [
          ["Free on-device processing", "While you answer, responses remain in browser memory. Language and previously seen item identifiers may be stored locally to reduce repetition."],
          ["Sent to the server only after a separate choice", "Raw responses are sent to the Cogniva server only if you later choose a paid report. The server re-scores them and does not retain the raw responses."],
          ["Sensitive profile", "Cognitive and emotional responses and the descriptive profile derived from them may qualify as special-category data revealing mental or health information."],
          ["Rights and withdrawal", "The published privacy notice explains retention, recipients, transfers and how to exercise access, erasure, restriction, objection, portability and withdrawal rights."]
        ],
        checks: {
          privacyNoticeAcknowledged: "I have read and understood the privacy notice.",
          specialCategoryExplicitConsent: "I expressly consent to processing my responses and the resulting cognitive/emotional reflection profile for the purposes described above, including where they qualify as special-category personal data."
        },
        optional: {
          analyticsConsent: "I consent to basic usage analytics. Questionnaire responses, selected area, results, email and payment data must not be included; refusing does not restrict the service."
        },
        withdrawal: "Consent may be withdrawn for the future at any time through the published privacy contact. Withdrawal does not affect the lawfulness of earlier processing.",
        checkoutSeparate: "Package, price, payment, immediate digital performance and withdrawal terms are presented and accepted only in the later, separate checkout step."
      }
    },
    de: {
      languageName: "Deutsch",
      direction: "ltr",
      ui: {
        draft: "RECHTLICHE VORLAGE · GENEHMIGUNG AUSSTEHEND",
        stepTerms: "1 / 2 · Bedingungen",
        stepPrivacy: "2 / 2 · Datenschutz",
        termsTitle: "Bevor du beginnst",
        privacyTitle: "Wie werden deine Antworten verarbeitet?",
        continue: "Weiter zum Datenschutz",
        back: "Zurück",
        acceptAndStart: "Ausdrücklich zustimmen und starten",
        cancel: "Jetzt nicht",
        required: "Erforderlich",
        optional: "Optional",
        openTerms: "Vollständige Nutzungsbedingungen",
        openPrivacy: "Vollständiger Datenschutzhinweis",
        readBeforeContinuing: "Lies die Zusammenfassung und bestätige danach jeden erforderlichen Punkt einzeln.",
        validationMessage: "Vor dem Fortfahren müssen alle erforderlichen Punkte bestätigt werden."
      },
      terms: {
        lead: "Cogniva Compass ist ein pädagogisches Selbstreflexionswerkzeug für Erwachsene. Es zeigt eine kurze Momentaufnahme aktueller Aufgaben- und Selbsteinschätzungsmuster.",
        sections: [
          ["Reflexion statt Testetikett", "Es ist kein standardisierter IQ- oder EQ-Test und liefert keinen normativen, klinischen oder Eignungswert."],
          ["Keine Diagnostik", "Es diagnostiziert oder screent keine Erkrankung und ersetzt keine medizinische, psychologische oder sonstige qualifizierte Beurteilung."],
          ["Erwachsene antworten für sich selbst", "Nur Personen ab 18 Jahren dürfen den Fragebogen über sich selbst ausfüllen. Gib keine Daten über andere Personen an."],
          ["Verantwortungsvolle Nutzung", "Das Ergebnis darf nicht allein für Gesundheits-, Arbeits-, Bildungs-, Versicherungs-, Kredit- oder andere bedeutsame Entscheidungen verwendet werden."]
        ],
        checks: {
          adultConfirmed: "Ich bestätige, dass ich mindestens 18 Jahre alt bin.",
          ownResponsesConfirmed: "Ich antworte aus eigener Erfahrung und mache keine Angaben über eine andere Person.",
          nonDiagnosticAcknowledged: "Ich verstehe, dass dies pädagogische Selbstreflexion und kein IQ-/EQ-Test, keine Diagnose, kein Screening und kein Fachgutachten ist.",
          termsAccepted: "Ich habe die Nutzungsbedingungen gelesen und akzeptiere sie."
        }
      },
      privacy: {
        lead: "Deine Antworten können sensible persönliche Informationen widerspiegeln. Du entscheidest, ob nur eine Momentaufnahme auf deinem Gerät entsteht oder später ein kostenpflichtiger Bericht angefordert wird.",
        sections: [
          ["Kostenlose Verarbeitung auf dem Gerät", "Beim Ausfüllen bleiben Antworten im Browserspeicher. Sprache und Kennungen bereits gesehener Items können lokal gespeichert werden, um Wiederholungen zu verringern."],
          ["Nur nach gesonderter Wahl an den Server", "Rohantworten werden nur an den Cogniva-Server gesendet, wenn du später einen kostenpflichtigen Bericht wählst. Der Server bewertet neu und speichert die Rohantworten nicht."],
          ["Sensibles Profil", "Kognitive und emotionale Antworten sowie das daraus abgeleitete beschreibende Profil können besondere Daten sein, die mentale oder gesundheitliche Informationen offenbaren."],
          ["Rechte und Widerruf", "Der veröffentlichte Datenschutzhinweis erläutert Speicherung, Empfänger, Übermittlungen sowie Auskunft, Löschung, Einschränkung, Widerspruch, Übertragbarkeit und Widerruf."]
        ],
        checks: {
          privacyNoticeAcknowledged: "Ich habe den Datenschutzhinweis gelesen und verstanden.",
          specialCategoryExplicitConsent: "Ich willige ausdrücklich in die Verarbeitung meiner Antworten und des daraus entstehenden kognitiven/emotionalen Reflexionsprofils zu den oben beschriebenen Zwecken ein, auch soweit es sich um besondere Kategorien personenbezogener Daten handelt."
        },
        optional: {
          analyticsConsent: "Ich stimme einer grundlegenden Nutzungsanalyse zu. Fragebogenantworten, gewählter Bereich, Ergebnisse, E-Mail- und Zahlungsdaten dürfen nicht enthalten sein; eine Ablehnung schränkt den Dienst nicht ein."
        },
        withdrawal: "Die Einwilligung kann jederzeit mit Wirkung für die Zukunft über den veröffentlichten Datenschutzkontakt widerrufen werden. Die Rechtmäßigkeit früherer Verarbeitung bleibt unberührt.",
        checkoutSeparate: "Paket, Preis, Zahlung, sofortige digitale Leistung und Widerrufsbedingungen werden erst im späteren, getrennten Checkout angezeigt und bestätigt."
      }
    },
    it: {
      languageName: "Italiano",
      direction: "ltr",
      ui: {
        draft: "MODELLO LEGALE · IN ATTESA DI APPROVAZIONE",
        stepTerms: "1 / 2 · Condizioni",
        stepPrivacy: "2 / 2 · Privacy",
        termsTitle: "Prima di iniziare",
        privacyTitle: "Come vengono trattate le tue risposte?",
        continue: "Continua alla privacy",
        back: "Indietro",
        acceptAndStart: "Acconsento espressamente e inizio",
        cancel: "Non ora",
        required: "Obbligatorio",
        optional: "Facoltativo",
        openTerms: "Condizioni d’uso complete",
        openPrivacy: "Informativa privacy completa",
        readBeforeContinuing: "Leggi il riepilogo, poi seleziona separatamente ogni conferma obbligatoria.",
        validationMessage: "Per continuare devi selezionare tutte le conferme obbligatorie."
      },
      terms: {
        lead: "Cogniva Compass è uno strumento educativo di autoriflessione per adulti. Offre una breve istantanea dell’approccio attuale ai compiti e dei modelli auto-riferiti.",
        sections: [
          ["Riflessione, non etichetta di test", "Non è un test IQ o EQ standardizzato e non fornisce punteggi normativi, clinici o di idoneità."],
          ["Non diagnostico", "Non diagnostica né effettua screening di condizioni e non sostituisce una valutazione medica, psicologica o di altro professionista qualificato."],
          ["Adulti che rispondono per sé", "Può compilarlo solo una persona di almeno 18 anni per sé stessa. Non inserire dati di altre persone."],
          ["Uso responsabile", "Il risultato non deve essere usato da solo per decisioni sanitarie, lavorative, educative, assicurative, creditizie o altre decisioni importanti."]
        ],
        checks: {
          adultConfirmed: "Confermo di avere almeno 18 anni.",
          ownResponsesConfirmed: "Rispondo in base alla mia esperienza e non fornirò dati relativi a un’altra persona.",
          nonDiagnosticAcknowledged: "Comprendo che si tratta di autoriflessione educativa, non di un test IQ/EQ, diagnosi, screening o parere professionale.",
          termsAccepted: "Ho letto e accetto le condizioni d’uso."
        }
      },
      privacy: {
        lead: "Le risposte possono riflettere informazioni personali sensibili. Scegli tu se creare solo un’istantanea sul dispositivo o richiedere in seguito un rapporto a pagamento.",
        sections: [
          ["Elaborazione gratuita sul dispositivo", "Durante la compilazione le risposte restano nella memoria del browser. Lingua e identificativi degli item già visti possono essere salvati localmente per ridurre le ripetizioni."],
          ["Invio al server solo dopo una scelta separata", "Le risposte grezze sono inviate al server Cogniva solo se in seguito scegli un rapporto a pagamento. Il server ricalcola i risultati e non conserva le risposte grezze."],
          ["Profilo sensibile", "Le risposte cognitive ed emotive e il profilo descrittivo derivato possono costituire categorie particolari di dati che rivelano informazioni mentali o sanitarie."],
          ["Diritti e revoca", "L’informativa pubblicata spiega conservazione, destinatari, trasferimenti e come esercitare accesso, cancellazione, limitazione, opposizione, portabilità e revoca."]
        ],
        checks: {
          privacyNoticeAcknowledged: "Ho letto e compreso l’informativa sulla privacy.",
          specialCategoryExplicitConsent: "Acconsento espressamente al trattamento delle mie risposte e del profilo di riflessione cognitivo/emotivo risultante per le finalità sopra descritte, anche quando costituiscano categorie particolari di dati personali."
        },
        optional: {
          analyticsConsent: "Acconsento ad analisi di utilizzo di base. Non devono includere risposte, area scelta, risultati, email o dati di pagamento; il rifiuto non limita il servizio."
        },
        withdrawal: "Il consenso può essere revocato in qualsiasi momento per il futuro tramite il contatto privacy pubblicato. La revoca non incide sulla liceità del trattamento precedente.",
        checkoutSeparate: "Pacchetto, prezzo, pagamento, esecuzione digitale immediata e condizioni di recesso sono mostrati e accettati solo nel successivo checkout separato."
      }
    },
    es: {
      languageName: "Español",
      direction: "ltr",
      ui: {
        draft: "PLANTILLA LEGAL · PENDIENTE DE APROBACIÓN",
        stepTerms: "1 / 2 · Condiciones",
        stepPrivacy: "2 / 2 · Privacidad",
        termsTitle: "Antes de empezar",
        privacyTitle: "¿Cómo se tratan tus respuestas?",
        continue: "Continuar a privacidad",
        back: "Atrás",
        acceptAndStart: "Doy mi consentimiento expreso y empiezo",
        cancel: "Ahora no",
        required: "Obligatorio",
        optional: "Opcional",
        openTerms: "Condiciones de uso completas",
        openPrivacy: "Aviso de privacidad completo",
        readBeforeContinuing: "Lee el resumen y marca por separado cada confirmación obligatoria.",
        validationMessage: "Debes marcar todas las confirmaciones obligatorias para continuar."
      },
      terms: {
        lead: "Cogniva Compass es una herramienta educativa de autorreflexión para adultos. Ofrece una breve instantánea del enfoque actual ante tareas y de patrones autodeclarados.",
        sections: [
          ["Reflexión, no etiqueta de prueba", "No es una prueba de IQ o EQ estandarizada ni ofrece una puntuación normativa, clínica o de aptitud."],
          ["No es diagnóstico", "No diagnostica ni detecta trastornos y no sustituye una evaluación médica, psicológica o de otro profesional cualificado."],
          ["Adultos respondiendo sobre sí mismos", "Solo puede completarlo una persona de 18 años o más acerca de sí misma. No introduzcas datos de otra persona."],
          ["Uso responsable", "El resultado no debe utilizarse por sí solo para decisiones sanitarias, laborales, educativas, de seguros, crédito u otras decisiones importantes."]
        ],
        checks: {
          adultConfirmed: "Confirmo que tengo al menos 18 años.",
          ownResponsesConfirmed: "Respondo desde mi propia experiencia y no proporcionaré información sobre otra persona.",
          nonDiagnosticAcknowledged: "Entiendo que es autorreflexión educativa, no una prueba de IQ/EQ, diagnóstico, cribado ni opinión profesional.",
          termsAccepted: "He leído y acepto las condiciones de uso."
        }
      },
      privacy: {
        lead: "Tus respuestas pueden reflejar información personal sensible. Tú eliges entre crear solo una instantánea en el dispositivo o solicitar después un informe de pago.",
        sections: [
          ["Tratamiento gratuito en el dispositivo", "Mientras respondes, las respuestas permanecen en la memoria del navegador. El idioma y los identificadores de ítems ya vistos pueden guardarse localmente para reducir repeticiones."],
          ["Envío al servidor solo tras una elección separada", "Las respuestas brutas solo se envían al servidor de Cogniva si después eliges un informe de pago. El servidor vuelve a puntuar y no conserva las respuestas brutas."],
          ["Perfil sensible", "Las respuestas cognitivas y emocionales y el perfil descriptivo derivado pueden ser categorías especiales de datos que revelen información mental o de salud."],
          ["Derechos y retirada", "El aviso publicado explica conservación, destinatarios, transferencias y cómo ejercer acceso, supresión, limitación, oposición, portabilidad y retirada."]
        ],
        checks: {
          privacyNoticeAcknowledged: "He leído y comprendido el aviso de privacidad.",
          specialCategoryExplicitConsent: "Consiento expresamente el tratamiento de mis respuestas y del perfil de reflexión cognitivo/emocional resultante para los fines descritos, incluso cuando constituyan categorías especiales de datos personales."
        },
        optional: {
          analyticsConsent: "Consiento analítica básica de uso. No debe incluir respuestas, área elegida, resultados, email ni datos de pago; rechazarla no limita el servicio."
        },
        withdrawal: "El consentimiento puede retirarse en cualquier momento para el futuro mediante el contacto de privacidad publicado. La retirada no afecta al tratamiento anterior lícito.",
        checkoutSeparate: "El paquete, precio, pago, ejecución digital inmediata y condiciones de desistimiento se muestran y aceptan únicamente en el checkout posterior y separado."
      }
    },
    zh: {
      languageName: "中文",
      direction: "ltr",
      ui: {
        draft: "法律文本模板 · 尚待审核",
        stepTerms: "1 / 2 · 使用条件",
        stepPrivacy: "2 / 2 · 隐私",
        termsTitle: "开始之前",
        privacyTitle: "我们如何处理你的回答？",
        continue: "继续查看隐私说明",
        back: "返回",
        acceptAndStart: "我明确同意并开始",
        cancel: "暂不开始",
        required: "必选",
        optional: "可选",
        openTerms: "完整使用条件",
        openPrivacy: "完整隐私声明",
        readBeforeContinuing: "请阅读摘要，然后分别勾选每一项必选确认。",
        validationMessage: "继续前必须勾选所有必选确认。"
      },
      terms: {
        lead: "Cogniva Compass 是面向成年人的教育性自我反思工具，提供当前任务处理方式和自我报告模式的简短快照。",
        sections: [
          ["反思，而非测试标签", "它不是标准化 IQ 或 EQ 测试，也不提供常模、临床或适任性分数。"],
          ["不用于诊断", "它不诊断或筛查任何疾病，也不能替代医疗、心理或其他合格专业评估。"],
          ["成年人回答自己的情况", "仅限年满 18 岁的人为自己填写。请勿输入他人的信息。"],
          ["负责任地使用", "结果不得单独用于医疗、就业、教育、保险、信贷或其他重大决定。"]
        ],
        checks: {
          adultConfirmed: "我确认自己已年满 18 岁。",
          ownResponsesConfirmed: "我根据自己的经历回答，不会提供他人的信息。",
          nonDiagnosticAcknowledged: "我理解这是教育性自我反思，不是 IQ/EQ 测试、诊断、筛查或专业意见。",
          termsAccepted: "我已阅读并接受使用条件。"
        }
      },
      privacy: {
        lead: "你的回答可能反映敏感的个人信息。你可以选择只在设备上生成快照，或稍后另行购买报告。",
        sections: [
          ["设备上的免费处理", "答题期间，回答保留在浏览器内存中。语言和已见题目标识符可在本地保存，以减少重复。"],
          ["仅在另行选择后发送至服务器", "只有当你稍后选择付费报告时，原始回答才会发送至 Cogniva 服务器。服务器会重新评分，但不保留原始回答。"],
          ["敏感画像", "认知和情绪回答及由此形成的描述性画像，可能属于揭示心理或健康信息的特殊类别个人数据。"],
          ["权利与撤回", "已发布的隐私声明说明保存期限、接收方、跨境传输，以及访问、删除、限制、反对、可携带和撤回权利的行使方式。"]
        ],
        checks: {
          privacyNoticeAcknowledged: "我已阅读并理解隐私声明。",
          specialCategoryExplicitConsent: "我明确同意为上述目的处理我的回答及由此形成的认知／情绪反思画像，包括其构成特殊类别个人数据的情况。"
        },
        optional: {
          analyticsConsent: "我同意基本使用分析。其中不得包含问卷回答、所选领域、结果、电子邮箱或支付数据；拒绝不会限制服务。"
        },
        withdrawal: "你可以随时通过已公布的隐私联系方式撤回对未来处理的同意。撤回不影响此前处理的合法性。",
        checkoutSeparate: "套餐、价格、支付、即时数字履行和撤回条件只会在之后独立的结账步骤中展示并确认。"
      }
    },
    ja: {
      languageName: "日本語",
      direction: "ltr",
      ui: {
        draft: "法的文書テンプレート · 承認待ち",
        stepTerms: "1 / 2 · 利用条件",
        stepPrivacy: "2 / 2 · プライバシー",
        termsTitle: "始める前に",
        privacyTitle: "回答はどのように扱われますか？",
        continue: "プライバシー説明へ進む",
        back: "戻る",
        acceptAndStart: "明示的に同意して開始",
        cancel: "今は開始しない",
        required: "必須",
        optional: "任意",
        openTerms: "利用条件の全文",
        openPrivacy: "プライバシー通知の全文",
        readBeforeContinuing: "要約を読み、必須の確認項目を一つずつ選択してください。",
        validationMessage: "続行するには、すべての必須確認項目を選択してください。"
      },
      terms: {
        lead: "Cogniva Compass は成人向けの教育的な自己振り返りツールです。現在の課題への取り組み方と自己申告パターンの短いスナップショットを示します。",
        sections: [
          ["テストのラベルではなく振り返り", "標準化された IQ・EQ テストではなく、規準、臨床、適性の得点を提供しません。"],
          ["診断ではありません", "疾患の診断やスクリーニングを行わず、医療・心理その他の有資格専門家による評価に代わるものではありません。"],
          ["成人が自分について回答", "18 歳以上の本人のみが自分について回答できます。他者の情報を入力しないでください。"],
          ["責任ある利用", "結果だけを医療、雇用、教育、保険、信用、その他の重大な判断に使用してはなりません。"]
        ],
        checks: {
          adultConfirmed: "私は 18 歳以上であることを確認します。",
          ownResponsesConfirmed: "自分の経験に基づいて回答し、他者の情報を提供しません。",
          nonDiagnosticAcknowledged: "これは教育的な自己振り返りであり、IQ・EQ テスト、診断、スクリーニング、専門家の意見ではないと理解しています。",
          termsAccepted: "利用条件を読み、同意します。"
        }
      },
      privacy: {
        lead: "回答には機微な個人情報が反映される場合があります。端末上のスナップショットだけを作るか、後で有料レポートを希望するかは本人が選びます。",
        sections: [
          ["端末上での無料処理", "回答中、内容はブラウザーのメモリに残ります。繰り返しを減らすため、言語と既出項目の識別子が端末内に保存される場合があります。"],
          ["別途選択した場合のみサーバーへ送信", "生の回答は、後で有料レポートを選んだ場合にのみ Cogniva サーバーへ送られます。サーバーは再採点し、生の回答を保存しません。"],
          ["機微なプロフィール", "認知・感情の回答と、それから作られる記述的プロフィールは、精神・健康情報を明らかにする特別カテゴリーのデータに該当する場合があります。"],
          ["権利と撤回", "公開プライバシー通知には、保存期間、受領者、移転、アクセス、消去、制限、異議、データポータビリティ、撤回の方法が記載されています。"]
        ],
        checks: {
          privacyNoticeAcknowledged: "プライバシー通知を読み、理解しました。",
          specialCategoryExplicitConsent: "上記目的のため、私の回答とそこから得られる認知・感情の振り返りプロフィールを処理することに明示的に同意します。特別カテゴリーの個人データに該当する場合も含みます。"
        },
        optional: {
          analyticsConsent: "基本的な利用分析に同意します。質問への回答、選択分野、結果、メール、支払情報を含めてはならず、拒否してもサービスは制限されません。"
        },
        withdrawal: "同意は、公開されたプライバシー連絡先を通じて将来に向けいつでも撤回できます。撤回前の処理の適法性には影響しません。",
        checkoutSeparate: "パッケージ、価格、支払い、即時のデジタル履行、撤回条件は、後の独立したチェックアウトでのみ表示・確認されます。"
      }
    },
    ar: {
      languageName: "العربية",
      direction: "rtl",
      ui: {
        draft: "نموذج قانوني · بانتظار الاعتماد",
        stepTerms: "1 / 2 · الشروط",
        stepPrivacy: "2 / 2 · الخصوصية",
        termsTitle: "قبل أن تبدأ",
        privacyTitle: "كيف تُعالَج إجاباتك؟",
        continue: "المتابعة إلى الخصوصية",
        back: "رجوع",
        acceptAndStart: "أوافق صراحةً وأبدأ",
        cancel: "ليس الآن",
        required: "إلزامي",
        optional: "اختياري",
        openTerms: "شروط الاستخدام الكاملة",
        openPrivacy: "إشعار الخصوصية الكامل",
        readBeforeContinuing: "اقرأ الملخص ثم حدّد كل إقرار إلزامي على حدة.",
        validationMessage: "يجب تحديد جميع الإقرارات الإلزامية قبل المتابعة."
      },
      terms: {
        lead: "Cogniva Compass أداة تعليمية للتأمل الذاتي مخصّصة للبالغين. وهي تقدّم لمحة قصيرة عن أسلوب التعامل الحالي مع المهام والأنماط المبلّغ عنها ذاتياً.",
        sections: [
          ["تأمل لا تصنيف اختباري", "ليست اختبار ذكاء IQ أو ذكاء عاطفي EQ مقنناً، ولا تقدّم درجة معيارية أو سريرية أو درجة صلاحية."],
          ["ليست أداة تشخيص", "لا تشخّص حالة ولا تجري فحصاً مرضياً، ولا تحل محل تقييم طبي أو نفسي أو مهني مؤهل."],
          ["البالغ يجيب عن نفسه", "لا يجوز إكمالها إلا لشخص يبلغ 18 عاماً أو أكثر وعن نفسه. لا تُدخل معلومات عن شخص آخر."],
          ["استخدام مسؤول", "لا يجوز استخدام النتيجة وحدها لاتخاذ قرار صحي أو وظيفي أو تعليمي أو تأميني أو ائتماني أو أي قرار مهم آخر."]
        ],
        checks: {
          adultConfirmed: "أؤكد أن عمري 18 عاماً على الأقل.",
          ownResponsesConfirmed: "أجيب بناءً على تجربتي الشخصية ولن أقدّم معلومات عن شخص آخر.",
          nonDiagnosticAcknowledged: "أفهم أن هذا تأمل ذاتي تعليمي وليس اختبار IQ/EQ أو تشخيصاً أو فحصاً أو رأياً مهنياً.",
          termsAccepted: "قرأت شروط الاستخدام وأوافق عليها."
        }
      },
      privacy: {
        lead: "قد تعكس إجاباتك معلومات شخصية حساسة. أنت تختار بين إنشاء لمحة على جهازك فقط أو طلب تقرير مدفوع لاحقاً.",
        sections: [
          ["معالجة مجانية على الجهاز", "أثناء الإجابة تبقى الردود في ذاكرة المتصفح. وقد تُحفظ اللغة ومعرّفات البنود التي ظهرت سابقاً محلياً لتقليل التكرار."],
          ["الإرسال إلى الخادم بعد اختيار منفصل فقط", "لا تُرسل الإجابات الخام إلى خادم Cogniva إلا إذا اخترت لاحقاً تقريراً مدفوعاً. يعيد الخادم احتساب النتيجة ولا يحتفظ بالإجابات الخام."],
          ["ملف حساس", "قد تُعد الإجابات المعرفية والعاطفية والملف الوصفي الناتج عنها بيانات من فئات خاصة تكشف معلومات ذهنية أو صحية."],
          ["الحقوق وسحب الموافقة", "يوضح إشعار الخصوصية المنشور مدة الاحتفاظ والمستلمين وعمليات النقل وكيفية ممارسة حقوق الوصول والمحو والتقييد والاعتراض والنقل وسحب الموافقة."]
        ],
        checks: {
          privacyNoticeAcknowledged: "قرأت إشعار الخصوصية وفهمته.",
          specialCategoryExplicitConsent: "أوافق صراحةً على معالجة إجاباتي وملف التأمل المعرفي والعاطفي الناتج عنها للأغراض الموضحة أعلاه، بما في ذلك عندما تُعد من الفئات الخاصة للبيانات الشخصية."
        },
        optional: {
          analyticsConsent: "أوافق على تحليلات الاستخدام الأساسية. يجب ألا تتضمن إجابات الاستبيان أو المجال المختار أو النتائج أو البريد الإلكتروني أو بيانات الدفع؛ والرفض لا يقيّد الخدمة."
        },
        withdrawal: "يمكن سحب الموافقة للمستقبل في أي وقت عبر جهة اتصال الخصوصية المنشورة. ولا يؤثر السحب في مشروعية المعالجة السابقة.",
        checkoutSeparate: "لا تُعرض الحزمة والسعر والدفع والتنفيذ الرقمي الفوري وشروط الانسحاب ولا تُقبل إلا في خطوة دفع لاحقة ومنفصلة."
      }
    },
    pl: {
      languageName: "Polski",
      direction: "ltr",
      ui: {
        draft: "SZABLON PRAWNY · OCZEKUJE NA ZATWIERDZENIE",
        stepTerms: "1 / 2 · Warunki",
        stepPrivacy: "2 / 2 · Prywatność",
        termsTitle: "Zanim zaczniesz",
        privacyTitle: "Jak przetwarzamy Twoje odpowiedzi?",
        continue: "Przejdź do prywatności",
        back: "Wstecz",
        acceptAndStart: "Wyrażam wyraźną zgodę i zaczynam",
        cancel: "Nie teraz",
        required: "Wymagane",
        optional: "Opcjonalne",
        openTerms: "Pełne warunki korzystania",
        openPrivacy: "Pełna informacja o prywatności",
        readBeforeContinuing: "Przeczytaj podsumowanie, a następnie zaznacz osobno każde wymagane potwierdzenie.",
        validationMessage: "Przed kontynuowaniem musisz zaznaczyć wszystkie wymagane potwierdzenia."
      },
      terms: {
        lead: "Cogniva Compass to edukacyjne narzędzie autorefleksji dla dorosłych. Pokazuje krótką migawkę obecnego podejścia do zadań i deklarowanych wzorców.",
        sections: [
          ["Refleksja, nie etykieta testowa", "Nie jest standaryzowanym testem IQ ani EQ i nie podaje wyniku normatywnego, klinicznego ani oceny przydatności."],
          ["Bez diagnozy", "Nie diagnozuje ani nie bada przesiewowo zaburzeń i nie zastępuje oceny lekarskiej, psychologicznej ani innego wykwalifikowanego specjalisty."],
          ["Dorośli odpowiadają o sobie", "Może ją wypełnić tylko osoba w wieku co najmniej 18 lat o sobie. Nie podawaj danych innej osoby."],
          ["Odpowiedzialne użycie", "Wyniku nie wolno używać samodzielnie do decyzji zdrowotnych, zawodowych, edukacyjnych, ubezpieczeniowych, kredytowych ani innych ważnych decyzji."]
        ],
        checks: {
          adultConfirmed: "Potwierdzam, że mam co najmniej 18 lat.",
          ownResponsesConfirmed: "Odpowiadam na podstawie własnych doświadczeń i nie podam informacji o innej osobie.",
          nonDiagnosticAcknowledged: "Rozumiem, że jest to edukacyjna autorefleksja, a nie test IQ/EQ, diagnoza, badanie przesiewowe ani opinia specjalisty.",
          termsAccepted: "Przeczytałem(-am) i akceptuję warunki korzystania."
        }
      },
      privacy: {
        lead: "Twoje odpowiedzi mogą odzwierciedlać wrażliwe informacje osobiste. To Ty wybierasz, czy utworzyć tylko migawkę na urządzeniu, czy później zamówić płatny raport.",
        sections: [
          ["Bezpłatne przetwarzanie na urządzeniu", "Podczas odpowiadania dane pozostają w pamięci przeglądarki. Język i identyfikatory wcześniej widzianych pozycji mogą być zapisane lokalnie, aby ograniczyć powtórzenia."],
          ["Wysłanie na serwer tylko po osobnym wyborze", "Surowe odpowiedzi są wysyłane na serwer Cogniva tylko po późniejszym wyborze płatnego raportu. Serwer ponownie oblicza wynik i nie przechowuje surowych odpowiedzi."],
          ["Wrażliwy profil", "Odpowiedzi poznawcze i emocjonalne oraz utworzony z nich profil opisowy mogą stanowić szczególne kategorie danych ujawniające informacje o stanie psychicznym lub zdrowiu."],
          ["Prawa i wycofanie", "Opublikowana informacja wyjaśnia okresy przechowywania, odbiorców, transfery oraz sposób korzystania z prawa dostępu, usunięcia, ograniczenia, sprzeciwu, przenoszenia i wycofania zgody."]
        ],
        checks: {
          privacyNoticeAcknowledged: "Przeczytałem(-am) i rozumiem informację o prywatności.",
          specialCategoryExplicitConsent: "Wyraźnie zgadzam się na przetwarzanie moich odpowiedzi i powstałego profilu refleksji poznawczej/emocjonalnej w opisanych celach, także gdy stanowią one szczególne kategorie danych osobowych."
        },
        optional: {
          analyticsConsent: "Zgadzam się na podstawową analitykę użycia. Nie może ona obejmować odpowiedzi, wybranego obszaru, wyników, emaila ani danych płatniczych; odmowa nie ogranicza usługi."
        },
        withdrawal: "Zgodę można w każdej chwili wycofać na przyszłość przez opublikowany kontakt ds. prywatności. Nie wpływa to na zgodność wcześniejszego przetwarzania z prawem.",
        checkoutSeparate: "Pakiet, cena, płatność, natychmiastowe świadczenie cyfrowe i warunki odstąpienia są przedstawiane i akceptowane dopiero w późniejszym, osobnym checkout."
      }
    },
    pt: {
      languageName: "Português",
      direction: "ltr",
      ui: {
        draft: "MODELO JURÍDICO · AGUARDA APROVAÇÃO",
        stepTerms: "1 / 2 · Termos",
        stepPrivacy: "2 / 2 · Privacidade",
        termsTitle: "Antes de começar",
        privacyTitle: "Como são tratadas as suas respostas?",
        continue: "Continuar para privacidade",
        back: "Voltar",
        acceptAndStart: "Dou consentimento expresso e começo",
        cancel: "Agora não",
        required: "Obrigatório",
        optional: "Opcional",
        openTerms: "Termos de utilização completos",
        openPrivacy: "Aviso de privacidade completo",
        readBeforeContinuing: "Leia o resumo e selecione separadamente cada confirmação obrigatória.",
        validationMessage: "Tem de selecionar todas as confirmações obrigatórias antes de continuar."
      },
      terms: {
        lead: "O Cogniva Compass é uma ferramenta educativa de autorreflexão para adultos. Apresenta um breve retrato da abordagem atual às tarefas e dos padrões autorrelatados.",
        sections: [
          ["Reflexão, não rótulo de teste", "Não é um teste de IQ ou EQ padronizado e não fornece pontuação normativa, clínica ou de aptidão."],
          ["Não é diagnóstico", "Não diagnostica nem rastreia condições e não substitui avaliação médica, psicológica ou de outro profissional qualificado."],
          ["Adultos respondem sobre si", "Só pode ser preenchido por uma pessoa com 18 anos ou mais sobre si própria. Não introduza dados de outra pessoa."],
          ["Utilização responsável", "O resultado não pode ser usado isoladamente em decisões de saúde, emprego, educação, seguros, crédito ou outras decisões importantes."]
        ],
        checks: {
          adultConfirmed: "Confirmo que tenho pelo menos 18 anos.",
          ownResponsesConfirmed: "Respondo com base na minha própria experiência e não fornecerei dados de outra pessoa.",
          nonDiagnosticAcknowledged: "Compreendo que isto é autorreflexão educativa, não um teste de IQ/EQ, diagnóstico, rastreio ou opinião profissional.",
          termsAccepted: "Li e aceito os termos de utilização."
        }
      },
      privacy: {
        lead: "As suas respostas podem refletir informações pessoais sensíveis. Decide se cria apenas um retrato no dispositivo ou se mais tarde pede um relatório pago.",
        sections: [
          ["Tratamento gratuito no dispositivo", "Enquanto responde, as respostas permanecem na memória do navegador. O idioma e identificadores de itens já vistos podem ser guardados localmente para reduzir repetições."],
          ["Envio ao servidor apenas após escolha separada", "As respostas brutas só são enviadas ao servidor Cogniva se mais tarde escolher um relatório pago. O servidor recalcula e não conserva as respostas brutas."],
          ["Perfil sensível", "As respostas cognitivas e emocionais e o perfil descritivo resultante podem constituir categorias especiais de dados que revelem informações mentais ou de saúde."],
          ["Direitos e retirada", "O aviso publicado explica conservação, destinatários, transferências e como exercer acesso, apagamento, limitação, oposição, portabilidade e retirada."
          ]
        ],
        checks: {
          privacyNoticeAcknowledged: "Li e compreendi o aviso de privacidade.",
          specialCategoryExplicitConsent: "Consinto expressamente no tratamento das minhas respostas e do perfil de reflexão cognitiva/emocional resultante para os fins acima descritos, incluindo quando constituam categorias especiais de dados pessoais."
        },
        optional: {
          analyticsConsent: "Consinto em analítica básica de utilização. Não pode incluir respostas, área escolhida, resultados, email ou dados de pagamento; a recusa não limita o serviço."
        },
        withdrawal: "O consentimento pode ser retirado a qualquer momento para o futuro através do contacto de privacidade publicado. A retirada não afeta a licitude do tratamento anterior.",
        checkoutSeparate: "Pacote, preço, pagamento, execução digital imediata e condições de livre resolução são apresentados e aceites apenas no checkout posterior e separado."
      }
    },
    fr: {
      languageName: "Français",
      direction: "ltr",
      ui: {
        draft: "MODÈLE JURIDIQUE · EN ATTENTE D’APPROBATION",
        stepTerms: "1 / 2 · Conditions",
        stepPrivacy: "2 / 2 · Confidentialité",
        termsTitle: "Avant de commencer",
        privacyTitle: "Comment vos réponses sont-elles traitées ?",
        continue: "Continuer vers la confidentialité",
        back: "Retour",
        acceptAndStart: "Je consens expressément et je commence",
        cancel: "Pas maintenant",
        required: "Obligatoire",
        optional: "Facultatif",
        openTerms: "Conditions d’utilisation complètes",
        openPrivacy: "Notice de confidentialité complète",
        readBeforeContinuing: "Lisez le résumé, puis cochez séparément chaque confirmation obligatoire.",
        validationMessage: "Vous devez cocher toutes les confirmations obligatoires avant de continuer."
      },
      terms: {
        lead: "Cogniva Compass est un outil éducatif d’autoréflexion pour adultes. Il fournit un bref instantané de l’approche actuelle des tâches et des tendances autodéclarées.",
        sections: [
          ["Réflexion, pas étiquette de test", "Ce n’est pas un test de QI ou de QE standardisé et il ne fournit aucun score normatif, clinique ou d’aptitude."],
          ["Non diagnostique", "Il ne diagnostique ni ne dépiste un trouble et ne remplace pas une évaluation médicale, psychologique ou d’un autre professionnel qualifié."],
          ["Des adultes répondant pour eux-mêmes", "Seule une personne âgée d’au moins 18 ans peut le remplir à son propre sujet. Ne saisissez pas de données sur une autre personne."],
          ["Utilisation responsable", "Le résultat ne doit pas être utilisé seul pour une décision de santé, d’emploi, d’éducation, d’assurance, de crédit ou toute autre décision importante."]
        ],
        checks: {
          adultConfirmed: "Je confirme avoir au moins 18 ans.",
          ownResponsesConfirmed: "Je réponds d’après ma propre expérience et ne fournirai pas d’informations sur une autre personne.",
          nonDiagnosticAcknowledged: "Je comprends qu’il s’agit d’autoréflexion éducative, et non d’un test de QI/QE, d’un diagnostic, d’un dépistage ou d’un avis professionnel.",
          termsAccepted: "J’ai lu et j’accepte les conditions d’utilisation."
        }
      },
      privacy: {
        lead: "Vos réponses peuvent refléter des informations personnelles sensibles. Vous choisissez de créer seulement un instantané sur l’appareil ou de demander ensuite un rapport payant.",
        sections: [
          ["Traitement gratuit sur l’appareil", "Pendant vos réponses, celles-ci restent dans la mémoire du navigateur. La langue et les identifiants des items déjà vus peuvent être conservés localement pour réduire les répétitions."],
          ["Envoi au serveur uniquement après un choix distinct", "Les réponses brutes ne sont envoyées au serveur Cogniva que si vous choisissez ensuite un rapport payant. Le serveur recalcule les résultats et ne conserve pas les réponses brutes."],
          ["Profil sensible", "Les réponses cognitives et émotionnelles et le profil descriptif dérivé peuvent constituer des catégories particulières de données révélant des informations mentales ou de santé."],
          ["Droits et retrait", "La notice publiée explique la conservation, les destinataires, les transferts et l’exercice des droits d’accès, d’effacement, de limitation, d’opposition, de portabilité et de retrait."
          ]
        ],
        checks: {
          privacyNoticeAcknowledged: "J’ai lu et compris la notice de confidentialité.",
          specialCategoryExplicitConsent: "Je consens expressément au traitement de mes réponses et du profil d’autoréflexion cognitive/émotionnelle qui en résulte aux fins décrites ci-dessus, y compris lorsqu’ils constituent des catégories particulières de données personnelles."
        },
        optional: {
          analyticsConsent: "Je consens à une analyse d’utilisation de base. Elle ne doit inclure ni réponses, ni domaine choisi, ni résultats, ni email, ni données de paiement ; le refus ne limite pas le service."
        },
        withdrawal: "Le consentement peut être retiré à tout moment pour l’avenir via le contact de confidentialité publié. Le retrait n’affecte pas la licéité du traitement antérieur.",
        checkoutSeparate: "Le forfait, le prix, le paiement, l’exécution numérique immédiate et les conditions de rétractation sont présentés et acceptés uniquement lors de l’étape de paiement ultérieure et distincte."
      }
    }
  };

  function assertSameShape(reference, candidate, path) {
    if (typeof reference === "string") {
      if (typeof candidate !== "string" || candidate.trim().length === 0) {
        throw new Error("Missing legal localization: " + path);
      }
      return;
    }
    if (Array.isArray(reference)) {
      if (!Array.isArray(candidate) || candidate.length !== reference.length) {
        throw new Error("Invalid legal localization list: " + path);
      }
      reference.forEach(function (value, index) {
        assertSameShape(value, candidate[index], path + "[" + index + "]");
      });
      return;
    }
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      throw new Error("Invalid legal localization object: " + path);
    }
    var referenceKeys = Object.keys(reference).sort();
    var candidateKeys = Object.keys(candidate).sort();
    if (referenceKeys.join("|") !== candidateKeys.join("|")) {
      throw new Error("Mismatched legal localization keys: " + path);
    }
    referenceKeys.forEach(function (key) {
      assertSameShape(reference[key], candidate[key], path + "." + key);
    });
  }

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }

  SUPPORTED_LANGUAGES.forEach(function (language) {
    if (!Object.prototype.hasOwnProperty.call(languages, language)) {
      throw new Error("Missing legal language: " + language);
    }
    assertSameShape(languages.en, languages[language], language);
  });

  deepFreeze(languages);

  global.COGNIVA_LEGAL_CONTENT_V1 = Object.freeze({
    version: VERSION,
    status: "draft",
    isProductionReady: false,
    supportedLanguages: SUPPORTED_LANGUAGES,
    languages: languages,
    get: function (language) {
      var normalized = String(language || "").trim().toLowerCase().split("-")[0];
      return Object.prototype.hasOwnProperty.call(languages, normalized) ? languages[normalized] : null;
    }
  });
})(window);
