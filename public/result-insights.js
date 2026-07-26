(function (global) {
  "use strict";

  var locales = {
    hu: {
      interpretationTitle: "Hogyan értelmezd az eredményt?",
      interpretationLead: {
        cognitive: "A profil azt mutatja meg, hogyan álltak össze a mai válaszaid négy kognitív készségterületen. Tekints rá pillanatfelvételként a feladatmegoldásodról, ne a képességeid állandó mércéjeként.",
        emotional: "A profil négy érzelmi készségterületen foglalja össze az általad jelzett mintákat. Önismereti kiindulópont, nem diagnózis és nem a személyiséged minősítése."
      },
      howTitle: "Mit érdemes figyelembe venni?",
      howPoints: {
        cognitive: [
          "A területeket egymáshoz viszonyítsd; az összpontszám nem IQ-érték.",
          "A kisebb eltéréseket befolyásolhatja a kérdések összetétele, a figyelem, a rutin vagy a tempó.",
          "Az erősebb területekre támaszkodhatsz, a többi pedig hasznos gyakorlási irányt mutat."
        ],
        emotional: [
          "A pontszámok jelenlegi, önmagadról jelzett szokásokat tükröznek, nem állandó tulajdonságokat.",
          "A helyzet, az energiaszint és a közelmúlt élményei is alakíthatják a válaszokat.",
          "Vedd észre, mi működik már jól, majd válassz egy apró viselkedést, amelyet szívesen gyakorolnál."
        ]
      },
      domainAnalysisTitle: "A területeid részletesebben",
      nextStepLabel: "Következő kis lépés",
      overallBands: {
        emerging: { label: "Jó kiindulópont", summary: "A válaszaid több jól használható kapaszkodót és néhány ígéretes gyakorlási irányt rajzolnak ki. Már egy kis, rendszeres figyelem is látható változást hozhat." },
        developing: { label: "Erősödő minta", summary: "Sok helyzetben már hozzáférsz ezekhez a készségekhez. A tudatos ismétlés segíthet abban, hogy még következetesebben tudd használni őket." },
        established: { label: "Stabil erőforrás", summary: "A válaszaid több biztosan mozgósítható erősséget jeleznek. Érdemes megfigyelni, hogyan viheted át ezeket új vagy összetettebb helyzetekbe." }
      },
      domainBands: {
        cognitive: {
          emerging: "Ez a terület jó lehetőséget kínál új stratégiák kipróbálására; a pontszám nem szab határt a fejlődésednek.",
          developing: "A készség már sok feladatban megjelenik, és célzott gyakorlással egyre megbízhatóbban mozgósítható.",
          established: "Ez a terület jelenleg könnyen elérhető erőforrásod lehet, különösen hasonló feladathelyzetekben."
        },
        emotional: {
          emerging: "Ez a minta hasznos önismereti jelzés: kis, hétköznapi kísérletekkel új válaszlehetőségeket építhetsz.",
          developing: "A készség több helyzetben már rendelkezésedre áll; a tudatos használat tovább erősítheti.",
          established: "Ez a minta jelenleg stabil érzelmi erőforrásnak látszik, amelyre kapcsolataidban is támaszkodhatsz."
        }
      },
      domainDescriptions: {
        patterns: "A mintázatfelismerés azt jelzi, mennyire könnyen veszed észre a szabályokat, kapcsolatokat és ismétlődéseket.",
        workingMemory: "A munkamemória segít rövid ideig fejben tartani és közben átrendezni az információkat.",
        numericalReasoning: "A numerikus következtetés a mennyiségek, arányok és számszerű összefüggések átlátását támogatja.",
        flexibleThinking: "A rugalmas gondolkodás abban segít, hogy nézőpontot vagy stratégiát válts, amikor a helyzet változik.",
        selfAwareness: "Az önismeret az érzések, szükségletek és belső reakciók korai felismerését jelenti.",
        regulation: "Az érzelemszabályozás azt mutatja, hogyan teremtesz teret az érzés és a megfontolt reakció között.",
        empathy: "Az empátia mások érzéseinek és nézőpontjának kíváncsi, árnyalt megértését támogatja.",
        relationships: "A kapcsolati készségek a világos kommunikációt, a határokat és az együttműködő megoldásokat fogják össze."
      },
      domainTips: {
        patterns: "Keress naponta egy ismétlődő szabályt egy folyamatban, szövegben vagy vizuális helyzetben.",
        workingMemory: "Bonts egy feladatot három lépésre, mondd vissza őket, majd hajtsd végre sorban.",
        numericalReasoning: "Becslés után számold ki a pontos eredményt, és hasonlítsd össze a két gondolatmenetet.",
        flexibleThinking: "Egy kisebb problémára fogalmazz meg két eltérő, egyaránt működő megoldást.",
        selfAwareness: "Naponta egyszer nevezd meg röviden: mit érzek, mire van most szükségem?",
        regulation: "Feszültebb pillanatban iktass be három lassú légzést, mielőtt válaszolsz.",
        empathy: "Beszélgetésben foglald össze egy mondatban, mit hallottál, mielőtt a saját nézőpontodat elmondod.",
        relationships: "Egy kérésnél mondd ki röviden a helyzetet, a szükségletedet és a konkrét következő lépést."
      }
    },

    en: {
      interpretationTitle: "How to read your result",
      interpretationLead: {
        cognitive: "This profile shows how your answers came together across four cognitive skill areas today. Treat it as a snapshot of your approach to these tasks, not a fixed measure of ability.",
        emotional: "This profile summarizes the patterns you reported across four emotional skill areas. It is a starting point for reflection, not a diagnosis or a judgment of your personality."
      },
      howTitle: "What to keep in mind",
      howPoints: {
        cognitive: [
          "Compare the areas with one another; the overall score is not an IQ value.",
          "Small differences may reflect the item mix, attention, familiarity or pace.",
          "Use stronger areas as resources and the others as useful directions for practice."
        ],
        emotional: [
          "Scores reflect current self-reported habits, not permanent traits.",
          "Context, energy and recent experiences can influence your responses.",
          "Notice what already works, then choose one small behavior you would like to practise."
        ]
      },
      domainAnalysisTitle: "A closer look at your areas",
      nextStepLabel: "One small next step",
      overallBands: {
        emerging: { label: "A positive starting point", summary: "Your answers reveal useful foundations and several promising directions for practice. Small, regular attention can make a noticeable difference." },
        developing: { label: "Building momentum", summary: "These skills are already available to you in many situations. Deliberate repetition can help you use them even more consistently." },
        established: { label: "A well-established resource", summary: "Your answers suggest several strengths you can draw on with confidence. Consider how to carry them into new or more complex situations." }
      },
      domainBands: {
        cognitive: {
          emerging: "This area offers useful room to try new strategies; the score does not set a limit on your growth.",
          developing: "This skill already appears in many tasks and can become more dependable with focused practice.",
          established: "This area may currently be an accessible resource, especially in similar task settings."
        },
        emotional: {
          emerging: "This pattern is useful self-knowledge: small everyday experiments can widen your response options.",
          developing: "This skill is already available in several situations; using it deliberately can strengthen it further.",
          established: "This pattern currently looks like a steady emotional resource you can also draw on in relationships."
        }
      },
      domainDescriptions: {
        patterns: "Pattern recognition reflects how readily you notice rules, relationships and repetition.",
        workingMemory: "Working memory helps you hold information briefly while rearranging or using it.",
        numericalReasoning: "Numerical reasoning supports your understanding of quantities, proportions and number relationships.",
        flexibleThinking: "Flexible thinking helps you change perspective or strategy when circumstances shift.",
        selfAwareness: "Self-awareness is the early recognition of feelings, needs and inner reactions.",
        regulation: "Emotion regulation reflects how you create space between a feeling and a considered response.",
        empathy: "Empathy supports a curious, nuanced understanding of another person's feelings and perspective.",
        relationships: "Relationship skills bring together clear communication, boundaries and collaborative solutions."
      },
      domainTips: {
        patterns: "Each day, look for one repeating rule in a process, text or visual scene.",
        workingMemory: "Break a task into three steps, repeat them to yourself, then complete them in order.",
        numericalReasoning: "Estimate first, calculate the exact answer, then compare the two lines of thought.",
        flexibleThinking: "For one small problem, name two different solutions that could both work.",
        selfAwareness: "Once a day, pause to name: what am I feeling, and what do I need right now?",
        regulation: "In a tense moment, take three slow breaths before responding.",
        empathy: "In conversation, summarize what you heard in one sentence before sharing your view.",
        relationships: "When making a request, state the situation, your need and one concrete next step."
      }
    },

    de: {
      interpretationTitle: "So kannst du dein Ergebnis lesen",
      interpretationLead: {
        cognitive: "Dieses Profil zeigt, wie sich deine heutigen Antworten in vier kognitiven Kompetenzbereichen zusammensetzen. Verstehe es als Momentaufnahme deiner Herangehensweise, nicht als feste Messung deiner Fähigkeiten.",
        emotional: "Dieses Profil fasst die von dir beschriebenen Muster in vier emotionalen Kompetenzbereichen zusammen. Es ist ein Ausgangspunkt zur Reflexion, keine Diagnose und keine Bewertung deiner Persönlichkeit."
      },
      howTitle: "Was du dabei beachten solltest",
      howPoints: {
        cognitive: [
          "Vergleiche die Bereiche miteinander; der Gesamtwert ist kein IQ-Wert.",
          "Kleine Unterschiede können durch Aufgabenmix, Aufmerksamkeit, Vertrautheit oder Tempo entstehen.",
          "Nutze stärkere Bereiche als Ressourcen und die anderen als hilfreiche Übungsrichtungen."
        ],
        emotional: [
          "Die Werte spiegeln aktuell selbst berichtete Gewohnheiten wider, keine unveränderlichen Eigenschaften.",
          "Situation, Energie und jüngste Erfahrungen können deine Antworten beeinflussen.",
          "Achte darauf, was bereits gut funktioniert, und wähle dann ein kleines Verhalten zum Üben."
        ]
      },
      domainAnalysisTitle: "Deine Bereiche im Detail",
      nextStepLabel: "Ein kleiner nächster Schritt",
      overallBands: {
        emerging: { label: "Eine gute Ausgangsbasis", summary: "Deine Antworten zeigen hilfreiche Grundlagen und vielversprechende Übungsrichtungen. Schon kleine, regelmäßige Aufmerksamkeit kann spürbar etwas bewegen." },
        developing: { label: "Wachsende Sicherheit", summary: "Diese Fähigkeiten stehen dir in vielen Situationen bereits zur Verfügung. Bewusste Wiederholung kann ihre verlässliche Nutzung weiter stärken." },
        established: { label: "Eine gut verankerte Ressource", summary: "Deine Antworten deuten auf mehrere gut nutzbare Stärken hin. Beobachte, wie du sie auf neue oder komplexere Situationen übertragen kannst." }
      },
      domainBands: {
        cognitive: {
          emerging: "Dieser Bereich bietet gute Möglichkeiten, neue Strategien zu erproben; der Wert setzt deinem Wachstum keine Grenze.",
          developing: "Die Fähigkeit zeigt sich bereits in vielen Aufgaben und kann durch gezieltes Üben verlässlicher werden.",
          established: "Dieser Bereich kann dir derzeit besonders in ähnlichen Aufgaben als gut zugängliche Ressource dienen."
        },
        emotional: {
          emerging: "Dieses Muster liefert wertvolle Selbsterkenntnis: Kleine Alltagsexperimente können deine Reaktionsmöglichkeiten erweitern.",
          developing: "Diese Fähigkeit steht dir in mehreren Situationen bereits zur Verfügung und lässt sich bewusst weiter festigen.",
          established: "Dieses Muster wirkt derzeit wie eine stabile emotionale Ressource, die auch Beziehungen unterstützen kann."
        }
      },
      domainDescriptions: {
        patterns: "Mustererkennung beschreibt, wie leicht du Regeln, Zusammenhänge und Wiederholungen bemerkst.",
        workingMemory: "Das Arbeitsgedächtnis hilft, Informationen kurz zu behalten und gleichzeitig zu ordnen oder zu nutzen.",
        numericalReasoning: "Numerisches Denken unterstützt das Verständnis von Mengen, Verhältnissen und Zahlenbeziehungen.",
        flexibleThinking: "Flexibles Denken hilft, Perspektive oder Strategie zu wechseln, wenn sich eine Situation verändert.",
        selfAwareness: "Selbstwahrnehmung bedeutet, Gefühle, Bedürfnisse und innere Reaktionen früh zu erkennen.",
        regulation: "Emotionsregulation beschreibt, wie du zwischen einem Gefühl und einer überlegten Reaktion Raum schaffst.",
        empathy: "Empathie unterstützt ein neugieriges und differenziertes Verständnis für Gefühle und Sichtweisen anderer.",
        relationships: "Beziehungskompetenz verbindet klare Kommunikation, Grenzen und kooperative Lösungen."
      },
      domainTips: {
        patterns: "Suche täglich nach einer wiederkehrenden Regel in einem Ablauf, Text oder Bild.",
        workingMemory: "Teile eine Aufgabe in drei Schritte, wiederhole sie und führe sie dann der Reihe nach aus.",
        numericalReasoning: "Schätze zuerst, rechne dann genau und vergleiche beide Denkwege.",
        flexibleThinking: "Formuliere für ein kleines Problem zwei unterschiedliche Lösungen, die beide funktionieren könnten.",
        selfAwareness: "Halte einmal täglich inne: Was fühle ich, und was brauche ich gerade?",
        regulation: "Atme in einem angespannten Moment dreimal langsam, bevor du antwortest.",
        empathy: "Fasse im Gespräch zuerst in einem Satz zusammen, was du gehört hast, bevor du deine Sicht teilst.",
        relationships: "Benenne bei einer Bitte die Situation, dein Bedürfnis und einen konkreten nächsten Schritt."
      }
    },

    it: {
      interpretationTitle: "Come leggere il tuo risultato",
      interpretationLead: {
        cognitive: "Questo profilo mostra come si sono combinate oggi le tue risposte in quattro aree cognitive. Consideralo un'istantanea del tuo approccio ai compiti, non una misura fissa delle tue capacità.",
        emotional: "Questo profilo riassume gli schemi che hai indicato in quattro aree emotive. È un punto di partenza per riflettere, non una diagnosi né un giudizio sulla tua personalità."
      },
      howTitle: "Cosa tenere a mente",
      howPoints: {
        cognitive: [
          "Confronta le aree tra loro; il risultato complessivo non è un valore di QI.",
          "Piccole differenze possono dipendere dal mix di domande, dall'attenzione, dalla familiarità o dal ritmo.",
          "Usa le aree più forti come risorse e le altre come direzioni utili per esercitarti."
        ],
        emotional: [
          "I risultati riflettono abitudini attuali riferite da te, non tratti permanenti.",
          "Il contesto, l'energia e le esperienze recenti possono influenzare le risposte.",
          "Nota ciò che funziona già e scegli un piccolo comportamento che desideri allenare."
        ]
      },
      domainAnalysisTitle: "Le tue aree più da vicino",
      nextStepLabel: "Un piccolo passo successivo",
      overallBands: {
        emerging: { label: "Un buon punto di partenza", summary: "Le tue risposte mostrano basi utili e diverse direzioni promettenti per esercitarti. Una piccola attenzione regolare può produrre cambiamenti visibili." },
        developing: { label: "Slancio in crescita", summary: "Queste abilità sono già disponibili in molte situazioni. La pratica consapevole può aiutarti a usarle con ancora più continuità." },
        established: { label: "Una risorsa consolidata", summary: "Le tue risposte indicano diverse forze su cui puoi contare. Osserva come trasferirle in situazioni nuove o più complesse." }
      },
      domainBands: {
        cognitive: {
          emerging: "Quest'area offre spazio utile per provare nuove strategie; il risultato non pone limiti alla tua crescita.",
          developing: "L'abilità compare già in molti compiti e può diventare più affidabile con una pratica mirata.",
          established: "Quest'area può essere una risorsa facilmente accessibile, soprattutto in compiti simili."
        },
        emotional: {
          emerging: "Questo schema offre una conoscenza utile di te: piccoli esperimenti quotidiani possono ampliare le tue risposte.",
          developing: "Questa abilità è già presente in diverse situazioni; usarla consapevolmente può rafforzarla.",
          established: "Questo schema appare come una risorsa emotiva stabile, utile anche nelle relazioni."
        }
      },
      domainDescriptions: {
        patterns: "Il riconoscimento di schemi riguarda la facilità con cui noti regole, relazioni e ripetizioni.",
        workingMemory: "La memoria di lavoro aiuta a trattenere brevemente le informazioni mentre le organizzi o le utilizzi.",
        numericalReasoning: "Il ragionamento numerico sostiene la comprensione di quantità, proporzioni e relazioni tra numeri.",
        flexibleThinking: "Il pensiero flessibile aiuta a cambiare prospettiva o strategia quando la situazione cambia.",
        selfAwareness: "L'autoconsapevolezza è il riconoscimento tempestivo di emozioni, bisogni e reazioni interiori.",
        regulation: "La regolazione emotiva riguarda lo spazio che crei tra un'emozione e una risposta ponderata.",
        empathy: "L'empatia sostiene una comprensione curiosa e sfumata dei sentimenti e del punto di vista altrui.",
        relationships: "Le abilità relazionali uniscono comunicazione chiara, confini e soluzioni collaborative."
      },
      domainTips: {
        patterns: "Ogni giorno cerca una regola ricorrente in un processo, un testo o una scena visiva.",
        workingMemory: "Dividi un compito in tre passaggi, ripetili e poi svolgili nell'ordine.",
        numericalReasoning: "Prima fai una stima, poi calcola il risultato esatto e confronta i due percorsi.",
        flexibleThinking: "Per un piccolo problema, formula due soluzioni diverse che potrebbero funzionare.",
        selfAwareness: "Una volta al giorno fermati e chiediti: cosa provo e di cosa ho bisogno ora?",
        regulation: "In un momento di tensione, fai tre respiri lenti prima di rispondere.",
        empathy: "In una conversazione, riassumi in una frase ciò che hai ascoltato prima di dire la tua.",
        relationships: "Quando fai una richiesta, esprimi la situazione, il tuo bisogno e un passo concreto."
      }
    },

    es: {
      interpretationTitle: "Cómo interpretar tu resultado",
      interpretationLead: {
        cognitive: "Este perfil muestra cómo se combinaron hoy tus respuestas en cuatro áreas cognitivas. Tómalo como una instantánea de tu forma de abordar estas tareas, no como una medida fija de tu capacidad.",
        emotional: "Este perfil resume los patrones que señalaste en cuatro áreas emocionales. Es un punto de partida para reflexionar, no un diagnóstico ni un juicio sobre tu personalidad."
      },
      howTitle: "Qué conviene tener en cuenta",
      howPoints: {
        cognitive: [
          "Compara las áreas entre sí; el resultado global no es un valor de CI.",
          "Las pequeñas diferencias pueden reflejar la combinación de preguntas, la atención, la familiaridad o el ritmo.",
          "Apóyate en las áreas más fuertes y usa las demás como orientaciones útiles para practicar."
        ],
        emotional: [
          "Los resultados reflejan hábitos actuales descritos por ti, no rasgos permanentes.",
          "El contexto, la energía y las experiencias recientes pueden influir en tus respuestas.",
          "Observa lo que ya funciona y elige una pequeña conducta que quieras practicar."
        ]
      },
      domainAnalysisTitle: "Tus áreas en detalle",
      nextStepLabel: "Un pequeño paso siguiente",
      overallBands: {
        emerging: { label: "Un buen punto de partida", summary: "Tus respuestas muestran bases útiles y varias direcciones prometedoras para practicar. Una atención pequeña y constante puede generar cambios visibles." },
        developing: { label: "Impulso en crecimiento", summary: "Estas habilidades ya están disponibles en muchas situaciones. La práctica consciente puede ayudarte a usarlas con mayor constancia." },
        established: { label: "Un recurso consolidado", summary: "Tus respuestas sugieren varias fortalezas en las que puedes apoyarte. Observa cómo llevarlas a situaciones nuevas o más complejas." }
      },
      domainBands: {
        cognitive: {
          emerging: "Esta área ofrece un espacio útil para probar nuevas estrategias; el resultado no limita tu crecimiento.",
          developing: "La habilidad ya aparece en muchas tareas y puede ganar consistencia con una práctica enfocada.",
          established: "Esta área puede ser actualmente un recurso accesible, especialmente en tareas similares."
        },
        emotional: {
          emerging: "Este patrón aporta autoconocimiento útil: pequeños experimentos cotidianos pueden ampliar tus opciones de respuesta.",
          developing: "Esta habilidad ya está disponible en varias situaciones; usarla de forma consciente puede fortalecerla.",
          established: "Este patrón parece ahora un recurso emocional estable que también puede apoyar tus relaciones."
        }
      },
      domainDescriptions: {
        patterns: "El reconocimiento de patrones refleja la facilidad con la que detectas reglas, relaciones y repeticiones.",
        workingMemory: "La memoria de trabajo ayuda a mantener información brevemente mientras la reorganizas o utilizas.",
        numericalReasoning: "El razonamiento numérico apoya la comprensión de cantidades, proporciones y relaciones entre números.",
        flexibleThinking: "El pensamiento flexible ayuda a cambiar de perspectiva o estrategia cuando cambian las circunstancias.",
        selfAwareness: "La autoconciencia es reconocer pronto las emociones, necesidades y reacciones internas.",
        regulation: "La regulación emocional refleja cómo creas espacio entre una emoción y una respuesta meditada.",
        empathy: "La empatía favorece una comprensión curiosa y matizada de los sentimientos y perspectivas ajenas.",
        relationships: "Las habilidades relacionales reúnen comunicación clara, límites y soluciones colaborativas."
      },
      domainTips: {
        patterns: "Cada día, busca una regla que se repita en un proceso, un texto o una escena visual.",
        workingMemory: "Divide una tarea en tres pasos, repítelos y después complétalos en orden.",
        numericalReasoning: "Estima primero, calcula después el resultado exacto y compara ambos razonamientos.",
        flexibleThinking: "Para un problema pequeño, plantea dos soluciones distintas que puedan funcionar.",
        selfAwareness: "Una vez al día, detente y nombra: ¿qué siento y qué necesito ahora?",
        regulation: "En un momento tenso, respira lentamente tres veces antes de responder.",
        empathy: "En una conversación, resume en una frase lo que escuchaste antes de compartir tu opinión.",
        relationships: "Al hacer una petición, expresa la situación, tu necesidad y un siguiente paso concreto."
      }
    },

    zh: {
      interpretationTitle: "如何理解你的结果",
      interpretationLead: {
        cognitive: "这份概况呈现了你今天在四个认知技能领域的答题组合。请把它视为处理这些任务方式的一个即时画面，而不是能力的固定衡量。",
        emotional: "这份概况总结了你在四个情绪技能领域自述的模式。它是自我反思的起点，并非诊断，也不是对性格的评判。"
      },
      howTitle: "阅读时可以留意什么",
      howPoints: {
        cognitive: [
          "把各领域相互比较；总分不是智商数值。",
          "小幅差异可能来自题目组合、注意力、熟悉程度或作答节奏。",
          "把较强领域当作资源，把其他领域当作有价值的练习方向。"
        ],
        emotional: [
          "分数反映的是你目前自述的习惯，而不是永久特质。",
          "情境、精力和近期经历都可能影响你的回答。",
          "先看见已经有效的做法，再选择一个愿意练习的小行动。"
        ]
      },
      domainAnalysisTitle: "进一步了解你的各个领域",
      nextStepLabel: "一个小小的下一步",
      overallBands: {
        emerging: { label: "积极的起点", summary: "你的回答展现了可用的基础，也指出了几个值得尝试的练习方向。少量而持续的关注就可能带来明显变化。" },
        developing: { label: "正在形成动力", summary: "这些技能已经能在许多情境中为你所用。有意识地重复练习，会让运用变得更稳定。" },
        established: { label: "较稳定的资源", summary: "你的回答显示出多项可以放心调用的优势。可以继续观察如何把它们带入新情境或更复杂的任务。" }
      },
      domainBands: {
        cognitive: {
          emerging: "这个领域很适合尝试新策略；当前分数并不会限制你的成长空间。",
          developing: "这项技能已经出现在许多任务中，针对性练习能让它更加稳定。",
          established: "这个领域目前可能是你容易调用的资源，尤其在相似任务中。"
        },
        emotional: {
          emerging: "这个模式提供了有价值的自我认识；日常的小实验能扩展你的回应选择。",
          developing: "这项技能已能在多种情境中使用；有意识地运用会让它继续增强。",
          established: "这个模式目前像是一项稳定的情绪资源，也能支持你的关系。"
        }
      },
      domainDescriptions: {
        patterns: "模式识别反映你发现规则、联系和重复之处的容易程度。",
        workingMemory: "工作记忆帮助你短暂保留信息，同时对其进行整理或使用。",
        numericalReasoning: "数字推理帮助理解数量、比例以及数字之间的关系。",
        flexibleThinking: "灵活思维帮助你在情况变化时调整视角或策略。",
        selfAwareness: "自我觉察是较早识别自己的情绪、需要和内在反应。",
        regulation: "情绪调节体现你如何在感受与经过思考的回应之间留出空间。",
        empathy: "共情帮助你以好奇而细致的方式理解他人的感受和视角。",
        relationships: "关系技能包括清晰沟通、边界意识以及合作寻找解决方案。"
      },
      domainTips: {
        patterns: "每天在一个流程、文本或画面中找出一条重复的规律。",
        workingMemory: "把一项任务分成三步，复述一遍，再按顺序完成。",
        numericalReasoning: "先估算，再算出精确结果，然后比较两种思路。",
        flexibleThinking: "针对一个小问题，提出两种不同且都可能有效的解决办法。",
        selfAwareness: "每天暂停一次并说出：我正在感受什么，现在需要什么？",
        regulation: "感到紧张时，在回应前缓慢呼吸三次。",
        empathy: "交谈时，先用一句话概括你听到的内容，再表达自己的看法。",
        relationships: "提出请求时，清楚说明情境、你的需要和一个具体的下一步。"
      }
    },

    ja: {
      interpretationTitle: "結果の読み取り方",
      interpretationLead: {
        cognitive: "このプロフィールは、今日の回答が4つの認知スキル領域でどのようにまとまったかを示します。能力を固定的に測るものではなく、今回の課題への取り組み方を映す一場面としてご覧ください。",
        emotional: "このプロフィールは、4つの感情スキル領域について自己報告した傾向をまとめたものです。自己理解の出発点であり、診断や性格の評価ではありません。"
      },
      howTitle: "読み取る際のポイント",
      howPoints: {
        cognitive: [
          "領域どうしを比較して見てください。総合点はIQの数値ではありません。",
          "小さな差は、問題の組み合わせ、注意、慣れ、回答ペースでも変わります。",
          "高めの領域を資源として生かし、ほかの領域を役立つ練習の方向として捉えましょう。"
        ],
        emotional: [
          "得点は現在の自己報告による習慣を表し、変わらない性質ではありません。",
          "状況、心身のエネルギー、最近の経験も回答に影響します。",
          "すでにうまくいっていることを確認し、練習したい小さな行動を一つ選びましょう。"
        ]
      },
      domainAnalysisTitle: "各領域を詳しく見る",
      nextStepLabel: "次の小さな一歩",
      overallBands: {
        emerging: { label: "前向きな出発点", summary: "回答から、活用できる土台と有望な練習の方向が見えています。小さく継続的に意識するだけでも、変化につながります。" },
        developing: { label: "力が育っている段階", summary: "これらのスキルは、すでに多くの場面で使えています。意識して繰り返すことで、さらに安定して活用できます。" },
        established: { label: "安定した資源", summary: "回答から、安心して頼れる強みが複数うかがえます。新しい場面やより複雑な状況にもどう生かせるか観察してみましょう。" }
      },
      domainBands: {
        cognitive: {
          emerging: "新しい方略を試すよい余地がある領域です。今回の得点が成長の限界を決めることはありません。",
          developing: "多くの課題ですでに表れているスキルで、焦点を絞った練習により安定性を高められます。",
          established: "特に似た課題では、現在使いやすい資源になっている可能性があります。"
        },
        emotional: {
          emerging: "役立つ自己理解につながる傾向です。日常の小さな試みで、反応の選択肢を広げられます。",
          developing: "複数の場面ですでに使えているスキルです。意識的な活用でさらに強められます。",
          established: "現在は安定した感情面の資源であり、人間関係でも生かせる傾向です。"
        }
      },
      domainDescriptions: {
        patterns: "パターン認識は、規則、関係性、繰り返しにどれだけ気づきやすいかを表します。",
        workingMemory: "ワーキングメモリは、情報を短時間保ちながら並べ替えたり使ったりする力を支えます。",
        numericalReasoning: "数的推論は、量、比率、数の関係を理解する力を支えます。",
        flexibleThinking: "柔軟な思考は、状況の変化に応じて視点や方略を切り替える助けになります。",
        selfAwareness: "自己認識は、自分の感情、ニーズ、内面の反応に早めに気づくことです。",
        regulation: "感情調整は、感情とよく考えた反応との間に余白をつくる力を表します。",
        empathy: "共感は、相手の感情や視点を好奇心をもって丁寧に理解することを支えます。",
        relationships: "対人スキルは、明確な対話、境界線、協力的な解決をまとめたものです。"
      },
      domainTips: {
        patterns: "毎日、手順、文章、視覚的な場面の中から一つの繰り返す規則を探しましょう。",
        workingMemory: "課題を三つの手順に分け、復唱してから順番に実行してみましょう。",
        numericalReasoning: "まず見積もり、次に正確に計算し、二つの考え方を比べましょう。",
        flexibleThinking: "小さな問題に対して、どちらも使えそうな異なる解決策を二つ考えましょう。",
        selfAwareness: "一日一度立ち止まり、今何を感じ、何を必要としているか言葉にしましょう。",
        regulation: "緊張する場面では、返答する前にゆっくり三回呼吸しましょう。",
        empathy: "会話では、自分の考えを伝える前に、聞いた内容を一文で要約しましょう。",
        relationships: "依頼するときは、状況、自分の必要、具体的な次の一歩を伝えましょう。"
      }
    },

    ar: {
      interpretationTitle: "كيف تقرأ نتيجتك",
      interpretationLead: {
        cognitive: "يوضح هذا الملف كيف اجتمعت إجاباتك اليوم عبر أربعة مجالات للمهارات المعرفية. تعامل معه كلقطة لطريقتك في أداء هذه المهام، لا كمقياس ثابت لقدراتك.",
        emotional: "يلخص هذا الملف الأنماط التي وصفتها في أربعة مجالات للمهارات العاطفية. وهو بداية للتأمل، وليس تشخيصًا أو حكمًا على شخصيتك."
      },
      howTitle: "ما الذي يجدر تذكره",
      howPoints: {
        cognitive: [
          "قارن المجالات ببعضها؛ فالنتيجة الإجمالية ليست درجة ذكاء.",
          "قد تعكس الفروق الصغيرة مزيج الأسئلة أو الانتباه أو الألفة أو سرعة الإجابة.",
          "استخدم المجالات الأقوى كموارد، وانظر إلى غيرها كاتجاهات مفيدة للتدريب."
        ],
        emotional: [
          "تعكس الدرجات عاداتك الحالية كما وصفتها، وليست صفات دائمة.",
          "قد يؤثر السياق والطاقة والتجارب الحديثة في إجاباتك.",
          "لاحظ ما ينجح بالفعل، ثم اختر سلوكًا صغيرًا ترغب في ممارسته."
        ]
      },
      domainAnalysisTitle: "نظرة أقرب إلى مجالاتك",
      nextStepLabel: "خطوة صغيرة تالية",
      overallBands: {
        emerging: { label: "نقطة بداية إيجابية", summary: "تكشف إجاباتك عن أسس مفيدة واتجاهات واعدة للتدريب. ويمكن لاهتمام بسيط ومنتظم أن يصنع فرقًا ملحوظًا." },
        developing: { label: "زخم متنامٍ", summary: "هذه المهارات متاحة لك بالفعل في مواقف كثيرة. ويساعد التكرار الواعي على استخدامها بثبات أكبر." },
        established: { label: "مورد راسخ", summary: "تشير إجاباتك إلى نقاط قوة متعددة يمكنك الاعتماد عليها. لاحظ كيف تنقلها إلى مواقف جديدة أو أكثر تعقيدًا." }
      },
      domainBands: {
        cognitive: {
          emerging: "يتيح هذا المجال فرصة مفيدة لتجربة استراتيجيات جديدة؛ فالنتيجة لا تضع حدًا لنموك.",
          developing: "تظهر هذه المهارة بالفعل في مهام متعددة، ويمكن أن تصبح أكثر ثباتًا بالتدريب الموجّه.",
          established: "قد يكون هذا المجال حاليًا موردًا سهل الاستخدام، خاصة في المهام المشابهة."
        },
        emotional: {
          emerging: "يمنحك هذا النمط معرفة مفيدة بذاتك؛ ويمكن لتجارب يومية صغيرة أن توسع خيارات استجابتك.",
          developing: "هذه المهارة متاحة بالفعل في مواقف عدة، ويمكن للاستخدام الواعي أن يعززها.",
          established: "يبدو هذا النمط حاليًا موردًا عاطفيًا ثابتًا يمكنك الاستفادة منه في علاقاتك أيضًا."
        }
      },
      domainDescriptions: {
        patterns: "يعكس اكتشاف الأنماط مدى سهولة ملاحظتك للقواعد والعلاقات والتكرار.",
        workingMemory: "تساعد الذاكرة العاملة على الاحتفاظ بالمعلومات لفترة قصيرة أثناء ترتيبها أو استخدامها.",
        numericalReasoning: "يدعم الاستدلال العددي فهم الكميات والنسب والعلاقات بين الأرقام.",
        flexibleThinking: "يساعد التفكير المرن على تغيير المنظور أو الاستراتيجية عندما تتغير الظروف.",
        selfAwareness: "الوعي بالذات هو التعرف المبكر إلى المشاعر والاحتياجات وردود الفعل الداخلية.",
        regulation: "يعكس تنظيم المشاعر كيفية صنع مساحة بين الشعور والاستجابة المدروسة.",
        empathy: "يدعم التعاطف فهم مشاعر الآخرين ووجهات نظرهم بفضول ودقة.",
        relationships: "تجمع مهارات العلاقات بين التواصل الواضح والحدود والحلول التعاونية."
      },
      domainTips: {
        patterns: "ابحث كل يوم عن قاعدة متكررة في عملية أو نص أو مشهد بصري.",
        workingMemory: "قسّم مهمة إلى ثلاث خطوات، ورددها، ثم نفذها بالترتيب.",
        numericalReasoning: "قدّر أولًا، ثم احسب النتيجة الدقيقة، وقارن بين طريقتي التفكير.",
        flexibleThinking: "ضع لمشكلة صغيرة حلين مختلفين يمكن أن ينجح كلاهما.",
        selfAwareness: "توقف مرة يوميًا لتسأل: ماذا أشعر، وما الذي أحتاج إليه الآن؟",
        regulation: "في لحظة توتر، خذ ثلاثة أنفاس بطيئة قبل أن تستجيب.",
        empathy: "في الحوار، لخّص ما سمعته في جملة قبل أن تشارك وجهة نظرك.",
        relationships: "عند تقديم طلب، وضّح الموقف واحتياجك وخطوة تالية محددة."
      }
    },

    pl: {
      interpretationTitle: "Jak odczytać swój wynik",
      interpretationLead: {
        cognitive: "Ten profil pokazuje, jak dzisiejsze odpowiedzi ułożyły się w czterech obszarach umiejętności poznawczych. Traktuj go jako obraz podejścia do tych zadań, a nie stałą miarę swoich możliwości.",
        emotional: "Ten profil podsumowuje opisane przez Ciebie wzorce w czterech obszarach umiejętności emocjonalnych. To punkt wyjścia do refleksji, nie diagnoza ani ocena osobowości."
      },
      howTitle: "O czym warto pamiętać",
      howPoints: {
        cognitive: [
          "Porównuj obszary ze sobą; wynik ogólny nie jest wartością IQ.",
          "Niewielkie różnice mogą wynikać z zestawu pytań, uwagi, znajomości zadań lub tempa.",
          "Korzystaj z mocniejszych obszarów jak z zasobów, a pozostałe traktuj jako pomocne kierunki ćwiczeń."
        ],
        emotional: [
          "Wyniki odzwierciedlają obecne, samodzielnie opisane nawyki, a nie trwałe cechy.",
          "Kontekst, poziom energii i niedawne doświadczenia mogą wpływać na odpowiedzi.",
          "Zauważ, co już działa, a następnie wybierz jedno małe zachowanie do ćwiczenia."
        ]
      },
      domainAnalysisTitle: "Bliższe spojrzenie na Twoje obszary",
      nextStepLabel: "Jeden mały kolejny krok",
      overallBands: {
        emerging: { label: "Dobry punkt wyjścia", summary: "Twoje odpowiedzi pokazują użyteczne podstawy i kilka obiecujących kierunków ćwiczeń. Mała, regularna uwaga może przynieść zauważalną zmianę." },
        developing: { label: "Rosnąca swoboda", summary: "Te umiejętności są już dostępne w wielu sytuacjach. Świadome powtarzanie pomoże korzystać z nich jeszcze bardziej konsekwentnie." },
        established: { label: "Dobrze ugruntowany zasób", summary: "Odpowiedzi wskazują na kilka mocnych stron, na których możesz polegać. Sprawdź, jak przenosić je do nowych lub bardziej złożonych sytuacji." }
      },
      domainBands: {
        cognitive: {
          emerging: "Ten obszar daje dobrą przestrzeń do próbowania nowych strategii; wynik nie wyznacza granic rozwoju.",
          developing: "Ta umiejętność pojawia się już w wielu zadaniach i może stać się bardziej pewna dzięki ukierunkowanym ćwiczeniom.",
          established: "Ten obszar może być obecnie łatwo dostępnym zasobem, zwłaszcza w podobnych zadaniach."
        },
        emotional: {
          emerging: "Ten wzorzec daje cenną samowiedzę; małe codzienne próby mogą poszerzać wybór reakcji.",
          developing: "Ta umiejętność jest już dostępna w różnych sytuacjach, a świadome używanie może ją wzmacniać.",
          established: "Ten wzorzec wygląda obecnie na stabilny zasób emocjonalny, pomocny również w relacjach."
        }
      },
      domainDescriptions: {
        patterns: "Rozpoznawanie wzorców pokazuje, jak łatwo dostrzegasz reguły, zależności i powtórzenia.",
        workingMemory: "Pamięć robocza pomaga krótko utrzymywać informacje podczas ich porządkowania lub wykorzystywania.",
        numericalReasoning: "Rozumowanie liczbowe wspiera rozumienie ilości, proporcji i zależności między liczbami.",
        flexibleThinking: "Elastyczne myślenie pomaga zmieniać perspektywę lub strategię, gdy zmienia się sytuacja.",
        selfAwareness: "Samoświadomość to wczesne rozpoznawanie uczuć, potrzeb i reakcji wewnętrznych.",
        regulation: "Regulacja emocji opisuje tworzenie przestrzeni między uczuciem a przemyślaną reakcją.",
        empathy: "Empatia wspiera ciekawe i uważne rozumienie uczuć oraz perspektywy innych osób.",
        relationships: "Umiejętności relacyjne łączą jasną komunikację, granice i wspólne szukanie rozwiązań."
      },
      domainTips: {
        patterns: "Codziennie znajdź jedną powtarzającą się regułę w procesie, tekście lub obrazie.",
        workingMemory: "Podziel zadanie na trzy kroki, powtórz je, a następnie wykonaj po kolei.",
        numericalReasoning: "Najpierw oszacuj, potem dokładnie oblicz wynik i porównaj oba sposoby myślenia.",
        flexibleThinking: "Dla małego problemu wymyśl dwa różne rozwiązania, które mogą zadziałać.",
        selfAwareness: "Raz dziennie zatrzymaj się i nazwij: co czuję i czego teraz potrzebuję?",
        regulation: "W napiętym momencie weź trzy spokojne oddechy przed odpowiedzią.",
        empathy: "W rozmowie streść jednym zdaniem to, co słyszysz, zanim przedstawisz swój punkt widzenia.",
        relationships: "Formułując prośbę, nazwij sytuację, swoją potrzebę i jeden konkretny kolejny krok."
      }
    },

    pt: {
      interpretationTitle: "Como interpretar o seu resultado",
      interpretationLead: {
        cognitive: "Este perfil mostra como as suas respostas se combinaram hoje em quatro áreas cognitivas. Veja-o como um retrato da sua abordagem a estas tarefas, e não como uma medida fixa da sua capacidade.",
        emotional: "Este perfil resume os padrões que descreveu em quatro áreas emocionais. É um ponto de partida para reflexão, não um diagnóstico nem uma avaliação da sua personalidade."
      },
      howTitle: "O que deve ter em conta",
      howPoints: {
        cognitive: [
          "Compare as áreas entre si; o resultado global não é um valor de QI.",
          "Pequenas diferenças podem refletir o conjunto de perguntas, a atenção, a familiaridade ou o ritmo.",
          "Use as áreas mais fortes como recursos e as restantes como direções úteis para praticar."
        ],
        emotional: [
          "Os resultados refletem hábitos atuais descritos por si, não traços permanentes.",
          "O contexto, a energia e as experiências recentes podem influenciar as respostas.",
          "Repare no que já funciona e escolha um pequeno comportamento que gostaria de praticar."
        ]
      },
      domainAnalysisTitle: "Uma visão mais próxima das suas áreas",
      nextStepLabel: "Um pequeno próximo passo",
      overallBands: {
        emerging: { label: "Um bom ponto de partida", summary: "As suas respostas revelam bases úteis e várias direções promissoras para praticar. Uma atenção pequena e regular pode fazer uma diferença visível." },
        developing: { label: "Confiança em crescimento", summary: "Estas competências já estão disponíveis em muitas situações. A repetição consciente pode ajudá-lo a utilizá-las com maior consistência." },
        established: { label: "Um recurso bem estabelecido", summary: "As suas respostas indicam várias forças nas quais pode confiar. Observe como pode levá-las para situações novas ou mais complexas." }
      },
      domainBands: {
        cognitive: {
          emerging: "Esta área oferece espaço útil para experimentar novas estratégias; o resultado não limita o seu crescimento.",
          developing: "A competência já surge em muitas tarefas e pode tornar-se mais consistente com prática focada.",
          established: "Esta área pode ser atualmente um recurso acessível, sobretudo em tarefas semelhantes."
        },
        emotional: {
          emerging: "Este padrão oferece autoconhecimento útil; pequenas experiências diárias podem ampliar as suas opções de resposta.",
          developing: "Esta competência já está disponível em várias situações; utilizá-la conscientemente pode fortalecê-la.",
          established: "Este padrão parece agora um recurso emocional estável, que também pode apoiar as suas relações."
        }
      },
      domainDescriptions: {
        patterns: "O reconhecimento de padrões reflete a facilidade com que nota regras, relações e repetições.",
        workingMemory: "A memória de trabalho ajuda a manter informação por instantes enquanto a organiza ou utiliza.",
        numericalReasoning: "O raciocínio numérico apoia a compreensão de quantidades, proporções e relações entre números.",
        flexibleThinking: "O pensamento flexível ajuda a mudar de perspetiva ou estratégia quando a situação muda.",
        selfAwareness: "A autoconsciência é o reconhecimento atempado das emoções, necessidades e reações internas.",
        regulation: "A regulação emocional mostra como cria espaço entre uma emoção e uma resposta ponderada.",
        empathy: "A empatia apoia uma compreensão curiosa e cuidada dos sentimentos e perspetivas de outras pessoas.",
        relationships: "As competências relacionais reúnem comunicação clara, limites e soluções colaborativas."
      },
      domainTips: {
        patterns: "Todos os dias, procure uma regra repetida num processo, texto ou cena visual.",
        workingMemory: "Divida uma tarefa em três passos, repita-os e depois execute-os pela ordem certa.",
        numericalReasoning: "Faça primeiro uma estimativa, calcule depois o resultado exato e compare os dois raciocínios.",
        flexibleThinking: "Para um pequeno problema, formule duas soluções diferentes que possam funcionar.",
        selfAwareness: "Uma vez por dia, pare e nomeie: o que sinto e do que preciso agora?",
        regulation: "Num momento de tensão, faça três respirações lentas antes de responder.",
        empathy: "Numa conversa, resuma numa frase o que ouviu antes de partilhar a sua perspetiva.",
        relationships: "Ao fazer um pedido, indique a situação, a sua necessidade e um próximo passo concreto."
      }
    },

    fr: {
      interpretationTitle: "Comment interpréter votre résultat",
      interpretationLead: {
        cognitive: "Ce profil montre comment vos réponses se sont organisées aujourd'hui dans quatre domaines cognitifs. Voyez-le comme un instantané de votre approche de ces tâches, et non comme une mesure fixe de vos capacités.",
        emotional: "Ce profil résume les tendances que vous avez décrites dans quatre domaines émotionnels. C'est un point de départ pour réfléchir, pas un diagnostic ni un jugement sur votre personnalité."
      },
      howTitle: "Ce qu'il faut garder à l'esprit",
      howPoints: {
        cognitive: [
          "Comparez les domaines entre eux ; le résultat global n'est pas une valeur de QI.",
          "De petits écarts peuvent refléter le choix des questions, l'attention, la familiarité ou le rythme.",
          "Appuyez-vous sur les domaines plus forts et voyez les autres comme des pistes d'entraînement utiles."
        ],
        emotional: [
          "Les résultats reflètent des habitudes actuelles que vous avez décrites, pas des traits permanents.",
          "Le contexte, l'énergie et les expériences récentes peuvent influencer vos réponses.",
          "Repérez ce qui fonctionne déjà, puis choisissez un petit comportement à exercer."
        ]
      },
      domainAnalysisTitle: "Vos domaines plus en détail",
      nextStepLabel: "Un petit pas suivant",
      overallBands: {
        emerging: { label: "Un bon point de départ", summary: "Vos réponses révèlent des bases utiles et plusieurs pistes d'entraînement prometteuses. Une attention modeste et régulière peut produire un changement perceptible." },
        developing: { label: "Un élan qui se développe", summary: "Ces compétences sont déjà accessibles dans de nombreuses situations. Une répétition consciente peut vous aider à les mobiliser avec plus de régularité." },
        established: { label: "Une ressource bien établie", summary: "Vos réponses suggèrent plusieurs forces sur lesquelles vous pouvez compter. Observez comment les transposer dans des situations nouvelles ou plus complexes." }
      },
      domainBands: {
        cognitive: {
          emerging: "Ce domaine offre un espace utile pour essayer de nouvelles stratégies ; le résultat ne limite pas votre progression.",
          developing: "Cette compétence apparaît déjà dans de nombreuses tâches et peut gagner en stabilité avec une pratique ciblée.",
          established: "Ce domaine peut actuellement constituer une ressource facile à mobiliser, surtout dans des tâches similaires."
        },
        emotional: {
          emerging: "Cette tendance apporte une connaissance de soi utile ; de petites expériences quotidiennes peuvent élargir vos réponses possibles.",
          developing: "Cette compétence est déjà disponible dans plusieurs situations ; l'utiliser consciemment peut encore la renforcer.",
          established: "Cette tendance semble actuellement être une ressource émotionnelle stable, utile aussi dans vos relations."
        }
      },
      domainDescriptions: {
        patterns: "La reconnaissance des schémas reflète votre facilité à remarquer les règles, les liens et les répétitions.",
        workingMemory: "La mémoire de travail aide à conserver brièvement une information tout en l'organisant ou en l'utilisant.",
        numericalReasoning: "Le raisonnement numérique soutient la compréhension des quantités, proportions et relations entre nombres.",
        flexibleThinking: "La pensée flexible aide à changer de perspective ou de stratégie lorsque la situation évolue.",
        selfAwareness: "La conscience de soi consiste à repérer assez tôt ses émotions, ses besoins et ses réactions intérieures.",
        regulation: "La régulation émotionnelle reflète la manière de créer un espace entre une émotion et une réponse réfléchie.",
        empathy: "L'empathie soutient une compréhension curieuse et nuancée des émotions et du point de vue d'autrui.",
        relationships: "Les compétences relationnelles réunissent communication claire, limites et solutions collaboratives."
      },
      domainTips: {
        patterns: "Chaque jour, cherchez une règle récurrente dans un processus, un texte ou une scène visuelle.",
        workingMemory: "Divisez une tâche en trois étapes, répétez-les, puis réalisez-les dans l'ordre.",
        numericalReasoning: "Estimez d'abord, calculez ensuite le résultat exact, puis comparez les deux raisonnements.",
        flexibleThinking: "Pour un petit problème, imaginez deux solutions différentes qui pourraient fonctionner.",
        selfAwareness: "Une fois par jour, faites une pause : que ressens-je et de quoi ai-je besoin maintenant ?",
        regulation: "Dans un moment tendu, prenez trois respirations lentes avant de répondre.",
        empathy: "Dans une conversation, résumez en une phrase ce que vous avez entendu avant de donner votre point de vue.",
        relationships: "Pour formuler une demande, nommez la situation, votre besoin et une prochaine étape concrète."
      }
    }
  };

  global.COGNIVA_RESULT_INSIGHTS_V1 = Object.freeze({
    version: "v1",
    languages: Object.freeze(locales)
  });
})(window);
