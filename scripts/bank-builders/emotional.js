const LANGUAGES=["hu","en","de","it","es","zh","ja","ar","pl","pt","fr"];
const DOMAINS=["selfAwareness","regulation","empathy","relationships"];

const CONTENT={
en:{
contexts:["When plans change unexpectedly","During a demanding conversation","After receiving critical feedback","When time pressure builds","When someone disagrees with me","After I make a mistake","When another person seems upset","When a decision affects other people"],
responses:["Almost never","Sometimes","Often","Almost always"],
behaviors:{
selfAwareness:{
positive:["I identify the specific emotion before I act.","I notice the signals in my body that accompany my reaction.","I separate what I know from my first interpretation.","I can connect my reaction with a need or value that matters to me."],
reverse:["I act before checking what I am feeling.","I overlook physical signs until my reaction is already intense.","I treat my first interpretation as fact without checking it.","I struggle to name the need or value involved in my reaction."]
},
regulation:{
positive:["I create a pause and choose how I want to respond.","I use a practical step to lower the intensity before responding.","I adjust my plan when my first approach is not helping.","I return to the issue once I can address it more calmly."],
reverse:["I respond immediately even when a pause would help.","I let the tension determine my tone or actions.","I repeat the same response even when it is not working.","I avoid returning to the issue after the first difficult moment."]
},
empathy:{
positive:["I ask how the other person sees the situation.","I pay attention to both words and emotional cues.","I distinguish understanding a viewpoint from agreeing with it.","I check whether my interpretation of the other person is accurate."],
reverse:["I assume I know the other person's perspective without asking.","I focus only on the words and miss emotional cues.","I treat disagreement as evidence that the other person does not understand.","I decide what the other person feels before checking with them."]
},
relationships:{
positive:["I state my concern clearly without blaming the other person.","I suggest a shared next step that both people can consider.","I acknowledge my part in what happened.","I clarify expectations and limits respectfully."],
reverse:["I hint at my concern instead of saying it clearly.","I focus on winning the exchange rather than finding a next step.","I focus only on the other person's part in what happened.","I leave expectations or limits unspoken and hope they are understood."]
}
}
},
hu:{
contexts:["Amikor váratlanul megváltoznak a tervek","Egy megterhelő beszélgetés során","Miután kritikus visszajelzést kapok","Amikor nő az időnyomás","Amikor valaki nem ért egyet velem","Miután hibát követek el","Amikor valaki láthatóan zaklatott","Amikor egy döntés másokra is hatással van"],
responses:["Szinte soha","Néha","Gyakran","Szinte mindig"],
behaviors:{
selfAwareness:{positive:["megnevezem a pontos érzelmet, mielőtt cselekszem.","észreveszem a reakciómat kísérő testi jelzéseket.","elkülönítem azt, amit biztosan tudok, az első értelmezésemtől.","össze tudom kapcsolni a reakciómat egy számomra fontos igénnyel vagy értékkel."],reverse:["cselekszem, mielőtt ellenőrizném, mit érzek.","figyelmen kívül hagyom a testi jeleket, amíg a reakcióm már erőssé nem válik.","ellenőrzés nélkül tényként kezelem az első értelmezésemet.","nehezen nevezem meg a reakcióm mögötti igényt vagy értéket."]},
regulation:{positive:["szünetet tartok, és megválasztom, hogyan szeretnék reagálni.","gyakorlati lépéssel csökkentem a feszültséget, mielőtt válaszolok.","módosítom a tervemet, ha az első megközelítés nem segít.","visszatérek a helyzethez, amikor már nyugodtabban tudok foglalkozni vele."],reverse:["azonnal reagálok akkor is, amikor egy szünet segítene.","hagyom, hogy a feszültség határozza meg a hangnememet vagy a tetteimet.","ugyanazt a reakciót ismétlem akkor is, ha nem működik.","az első nehéz pillanat után kerülöm, hogy visszatérjek a helyzethez."]},
empathy:{positive:["megkérdezem, hogyan látja a helyzetet a másik ember.","a szavakra és az érzelmi jelzésekre is figyelek.","különválasztom egy nézőpont megértését az azzal való egyetértéstől.","ellenőrzöm, hogy pontos-e a másik emberről alkotott értelmezésem."],reverse:["kérdezés nélkül feltételezem, hogy ismerem a másik nézőpontját.","csak a szavakra figyelek, és elsiklom az érzelmi jelzések felett.","a nézeteltérést annak jelének veszem, hogy a másik nem érti a helyzetet.","ellenőrzés előtt eldöntöm, mit érez a másik ember."]},
relationships:{positive:["világosan, hibáztatás nélkül mondom el az aggodalmamat.","olyan közös következő lépést javaslok, amelyet mindketten megfontolhatunk.","elismerem a saját részemet a történtekben.","tisztelettel tisztázom az elvárásokat és a határokat."],reverse:["csak célzok az aggodalmamra ahelyett, hogy világosan kimondanám.","a közös következő lépés helyett a vita megnyerésére összpontosítok.","csak a másik ember részére figyelek a történtekben.","kimondatlanul hagyom az elvárásokat vagy a határokat, és remélem, hogy megértik őket."]}
}
},
de:{
contexts:["Wenn sich Pläne unerwartet ändern","Während eines anspruchsvollen Gesprächs","Nach kritischem Feedback","Wenn der Zeitdruck steigt","Wenn jemand anderer Meinung ist als ich","Nachdem ich einen Fehler gemacht habe","Wenn eine andere Person aufgewühlt wirkt","Wenn eine Entscheidung andere Menschen betrifft"],
responses:["Fast nie","Manchmal","Oft","Fast immer"],
behaviors:{
selfAwareness:{positive:["benenne ich die genaue Emotion, bevor ich handle.","bemerke ich die körperlichen Signale, die meine Reaktion begleiten.","trenne ich das, was ich weiß, von meiner ersten Deutung.","kann ich meine Reaktion mit einem wichtigen Bedürfnis oder Wert verbinden."],reverse:["handle ich, bevor ich prüfe, was ich fühle.","übersehe ich körperliche Signale, bis meine Reaktion bereits stark ist.","behandle ich meine erste Deutung ungeprüft als Tatsache.","fällt es mir schwer, das Bedürfnis oder den Wert hinter meiner Reaktion zu benennen."]},
regulation:{positive:["schaffe ich eine Pause und wähle meine Reaktion bewusst.","nutze ich einen praktischen Schritt, um die Intensität vor meiner Antwort zu senken.","passe ich meinen Plan an, wenn der erste Ansatz nicht hilft.","kehre ich zum Thema zurück, sobald ich ruhiger damit umgehen kann."],reverse:["reagiere ich sofort, auch wenn eine Pause helfen würde.","lasse ich die Anspannung meinen Ton oder mein Handeln bestimmen.","wiederhole ich dieselbe Reaktion, auch wenn sie nicht funktioniert.","vermeide ich es, nach dem ersten schwierigen Moment zum Thema zurückzukehren."]},
empathy:{positive:["frage ich, wie die andere Person die Situation sieht.","achte ich sowohl auf Worte als auch auf emotionale Signale.","unterscheide ich zwischen dem Verstehen einer Sichtweise und Zustimmung.","prüfe ich, ob meine Deutung der anderen Person zutrifft."],reverse:["nehme ich ohne Nachfrage an, die Sichtweise der anderen Person zu kennen.","konzentriere ich mich nur auf Worte und übersehe emotionale Signale.","werte ich Widerspruch als Zeichen dafür, dass die andere Person nicht versteht.","entscheide ich vor einer Rückfrage, was die andere Person fühlt."]},
relationships:{positive:["spreche ich mein Anliegen klar und ohne Schuldzuweisung an.","schlage ich einen gemeinsamen nächsten Schritt vor.","erkenne ich meinen eigenen Anteil am Geschehen an.","kläre ich Erwartungen und Grenzen respektvoll."],reverse:["deute ich mein Anliegen nur an, statt es klar auszusprechen.","konzentriere ich mich darauf zu gewinnen, statt einen nächsten Schritt zu finden.","sehe ich nur den Anteil der anderen Person am Geschehen.","lasse ich Erwartungen oder Grenzen unausgesprochen und hoffe, dass sie verstanden werden."]}
}
},
it:{
contexts:["Quando i piani cambiano inaspettatamente","Durante una conversazione impegnativa","Dopo aver ricevuto un feedback critico","Quando aumenta la pressione del tempo","Quando qualcuno non è d'accordo con me","Dopo aver commesso un errore","Quando un'altra persona sembra turbata","Quando una decisione riguarda altre persone"],
responses:["Quasi mai","A volte","Spesso","Quasi sempre"],
behaviors:{
selfAwareness:{positive:["identifico l'emozione precisa prima di agire.","noto i segnali del corpo che accompagnano la mia reazione.","separo ciò che so dalla mia prima interpretazione.","collego la mia reazione a un bisogno o valore importante per me."],reverse:["agisco prima di verificare ciò che provo.","ignoro i segnali fisici finché la mia reazione non è già intensa.","considero la prima interpretazione un fatto senza verificarla.","fatico a nominare il bisogno o il valore coinvolto nella mia reazione."]},
regulation:{positive:["creo una pausa e scelgo come rispondere.","uso un passo pratico per ridurre l'intensità prima di rispondere.","adatto il piano quando il primo approccio non aiuta.","torno sulla questione quando posso affrontarla con più calma."],reverse:["rispondo subito anche quando una pausa sarebbe utile.","lascio che la tensione determini il mio tono o le mie azioni.","ripeto la stessa risposta anche quando non funziona.","evito di tornare sulla questione dopo il primo momento difficile."]},
empathy:{positive:["chiedo come l'altra persona vede la situazione.","presto attenzione sia alle parole sia ai segnali emotivi.","distinguo il comprendere un punto di vista dall'essere d'accordo.","verifico che la mia interpretazione dell'altra persona sia accurata."],reverse:["presumo di conoscere il punto di vista altrui senza chiedere.","mi concentro solo sulle parole e perdo i segnali emotivi.","considero il disaccordo una prova che l'altra persona non capisce.","decido cosa prova l'altra persona prima di verificarlo con lei."]},
relationships:{positive:["espongo la mia preoccupazione chiaramente senza accusare.","propongo un prossimo passo condiviso che entrambi possiamo valutare.","riconosco la mia parte in ciò che è accaduto.","chiarisco aspettative e limiti con rispetto."],reverse:["alludo alla mia preoccupazione invece di esprimerla chiaramente.","cerco di vincere lo scambio invece di trovare un prossimo passo.","mi concentro solo sulla parte dell'altra persona.","lascio aspettative o limiti impliciti sperando che siano compresi."]}
}
},
es:{
contexts:["Cuando los planes cambian de forma inesperada","Durante una conversación exigente","Después de recibir una crítica","Cuando aumenta la presión de tiempo","Cuando alguien no está de acuerdo conmigo","Después de cometer un error","Cuando otra persona parece alterada","Cuando una decisión afecta a otras personas"],
responses:["Casi nunca","A veces","A menudo","Casi siempre"],
behaviors:{
selfAwareness:{positive:["identifico la emoción concreta antes de actuar.","noto las señales corporales que acompañan mi reacción.","separo lo que sé de mi primera interpretación.","relaciono mi reacción con una necesidad o un valor importante para mí."],reverse:["actúo antes de comprobar qué estoy sintiendo.","paso por alto las señales físicas hasta que mi reacción ya es intensa.","trato mi primera interpretación como un hecho sin comprobarla.","me cuesta nombrar la necesidad o el valor implicado en mi reacción."]},
regulation:{positive:["hago una pausa y elijo cómo quiero responder.","uso un paso práctico para bajar la intensidad antes de responder.","ajusto mi plan cuando el primer enfoque no ayuda.","retomo el asunto cuando puedo abordarlo con más calma."],reverse:["respondo de inmediato aunque una pausa ayudaría.","dejo que la tensión determine mi tono o mis acciones.","repito la misma respuesta aunque no funcione.","evito retomar el asunto después del primer momento difícil."]},
empathy:{positive:["pregunto cómo ve la situación la otra persona.","presto atención tanto a las palabras como a las señales emocionales.","distingo comprender un punto de vista de estar de acuerdo.","compruebo si mi interpretación de la otra persona es correcta."],reverse:["supongo que conozco la perspectiva de la otra persona sin preguntar.","me centro solo en las palabras y pierdo señales emocionales.","trato el desacuerdo como prueba de que la otra persona no entiende.","decido qué siente la otra persona antes de comprobarlo con ella."]},
relationships:{positive:["expreso mi preocupación con claridad y sin culpar.","propongo un siguiente paso compartido que ambos podemos considerar.","reconozco mi parte en lo ocurrido.","aclaro expectativas y límites con respeto."],reverse:["insinúo mi preocupación en vez de expresarla con claridad.","me centro en ganar el intercambio en vez de encontrar un siguiente paso.","me centro solo en la parte de la otra persona.","dejo expectativas o límites sin expresar y espero que se entiendan."]}
}
},
zh:{
contexts:["当计划意外改变时","在一场有压力的谈话中","收到批评性反馈后","当时间压力增加时","当有人不同意我的看法时","在我犯错之后","当另一个人看起来很难受时","当一个决定会影响他人时"],
responses:["几乎从不","有时","经常","几乎总是"],
behaviors:{
selfAwareness:{positive:["我会在行动前辨认具体的情绪。","我会注意伴随反应出现的身体信号。","我会区分已知事实和自己的第一种解释。","我能把自己的反应与重要的需要或价值联系起来。"],reverse:["我会在确认自己的感受前就采取行动。","我会忽略身体信号，直到反应已经很强烈。","我会在未核实前把第一种解释当作事实。","我很难说出反应背后的需要或价值。"]},
regulation:{positive:["我会先停一下，再选择回应方式。","我会先采取实际步骤降低情绪强度，再作回应。","当第一种方法没有帮助时，我会调整计划。","当我能更平静地处理时，我会回到这个问题。"],reverse:["即使暂停会有帮助，我也会立刻回应。","我会让紧张感决定自己的语气或行动。","即使没有效果，我也会重复同一种反应。","第一次困难之后，我会回避再次处理这个问题。"]},
empathy:{positive:["我会询问对方如何看待这一情况。","我会同时留意言语和情绪信号。","我会区分理解一种观点和赞同这种观点。","我会核实自己对对方的理解是否准确。"],reverse:["我会不经询问就认定自己知道对方的看法。","我只关注言语而忽略情绪信号。","我会把意见不同视为对方不理解的证据。","我会在核实前就断定对方的感受。"]},
relationships:{positive:["我会清楚表达担忧，而不责怪对方。","我会提出双方都可以考虑的共同下一步。","我会承认自己在事情中的责任。","我会尊重地澄清期望和界限。"],reverse:["我只暗示自己的担忧，而不清楚说出来。","我会专注于赢得争论，而不是寻找下一步。","我只关注对方在事情中的责任。","我会不说出期望或界限，只希望对方能明白。"]}
}
},
ja:{
contexts:["予定が予想外に変わったとき","難しい会話の最中","批判的な意見を受けた後","時間の余裕がなくなったとき","誰かが私に反対したとき","自分が間違えた後","相手が動揺しているように見えるとき","ある決定がほかの人にも影響するとき"],
responses:["ほとんどない","ときどき","よくある","ほぼいつも"],
behaviors:{
selfAwareness:{positive:["行動する前に具体的な感情を捉えます。","反応に伴う身体のサインに気づきます。","分かっている事実と最初の解釈を分けます。","反応を自分にとって大切なニーズや価値と結びつけます。"],reverse:["自分の感情を確かめる前に行動します。","反応が強くなるまで身体のサインを見落とします。","最初の解釈を確かめず事実として扱います。","反応に関わるニーズや価値を言葉にするのが難しいです。"]},
regulation:{positive:["いったん間を取り、どう応じるかを選びます。","応じる前に強さを下げる具体的な方法を使います。","最初の方法が役立たないときは計画を調整します。","より落ち着いて扱えるようになったら問題に戻ります。"],reverse:["間を取るとよい場面でもすぐに反応します。","緊張に任せて口調や行動を決めます。","うまくいかなくても同じ反応を繰り返します。","最初の難しい瞬間の後、その問題に戻ることを避けます。"]},
empathy:{positive:["相手が状況をどう見ているか尋ねます。","言葉と感情のサインの両方に注意します。","視点を理解することと同意することを分けます。","相手についての自分の解釈が正しいか確かめます。"],reverse:["尋ねずに相手の視点を分かったつもりになります。","言葉だけに注目して感情のサインを見落とします。","意見の違いを相手が理解していない証拠と捉えます。","確かめる前に相手の感情を決めつけます。"]},
relationships:{positive:["相手を責めずに懸念を明確に伝えます。","二人が検討できる共通の次の一歩を提案します。","起きたことについて自分の責任を認めます。","期待と境界を敬意をもって明確にします。"],reverse:["懸念を明確に言わず、ほのめかすだけにします。","次の一歩より、やり取りに勝つことを優先します。","起きたことの相手側の責任だけに注目します。","期待や境界を言葉にせず、伝わることを期待します。"]}
}
},
ar:{
contexts:["عندما تتغير الخطط بشكل غير متوقع","أثناء محادثة تتطلب جهدًا","بعد تلقي ملاحظة نقدية","عندما يزداد ضغط الوقت","عندما يختلف معي شخص ما","بعد أن أرتكب خطأ","عندما يبدو شخص آخر منزعجًا","عندما يؤثر قرار في أشخاص آخرين"],
responses:["نادرًا جدًا","أحيانًا","غالبًا","دائمًا تقريبًا"],
behaviors:{
selfAwareness:{positive:["أحدد الشعور الدقيق قبل أن أتصرف.","ألاحظ الإشارات الجسدية المصاحبة لرد فعلي.","أفصل بين ما أعرفه وتفسيري الأول.","أربط رد فعلي بحاجة أو قيمة مهمة بالنسبة لي."],reverse:["أتصرف قبل أن أتحقق مما أشعر به.","أتجاهل الإشارات الجسدية حتى يصبح رد فعلي شديدًا.","أتعامل مع تفسيري الأول كأنه حقيقة من دون التحقق منه.","أجد صعوبة في تسمية الحاجة أو القيمة المرتبطة برد فعلي."]},
regulation:{positive:["أتوقف لحظة وأختار كيف أريد أن أستجيب.","أستخدم خطوة عملية لخفض الشدة قبل الاستجابة.","أعدل خطتي عندما لا يساعد الأسلوب الأول.","أعود إلى المسألة عندما أستطيع تناولها بهدوء أكبر."],reverse:["أستجيب فورًا حتى عندما يكون التوقف مفيدًا.","أدع التوتر يحدد نبرة صوتي أو أفعالي.","أكرر الاستجابة نفسها حتى عندما لا تنجح.","أتجنب العودة إلى المسألة بعد أول لحظة صعبة."]},
empathy:{positive:["أسأل كيف يرى الشخص الآخر الموقف.","أنتبه إلى الكلمات والإشارات العاطفية معًا.","أميز بين فهم وجهة نظر والموافقة عليها.","أتحقق من دقة تفسيري للشخص الآخر."],reverse:["أفترض أنني أعرف منظور الشخص الآخر من دون أن أسأل.","أركز على الكلمات وحدها وأفوت الإشارات العاطفية.","أعد الاختلاف دليلًا على أن الشخص الآخر لا يفهم.","أقرر ما يشعر به الشخص الآخر قبل التحقق معه."]},
relationships:{positive:["أوضح ما يقلقني من دون إلقاء اللوم.","أقترح خطوة تالية مشتركة يمكن للطرفين النظر فيها.","أعترف بدوري فيما حدث.","أوضح التوقعات والحدود باحترام."],reverse:["ألمح إلى ما يقلقني بدلًا من قوله بوضوح.","أركز على الفوز بالنقاش بدلًا من إيجاد خطوة تالية.","أركز فقط على دور الشخص الآخر فيما حدث.","أترك التوقعات أو الحدود من دون توضيح وآمل أن تُفهم."]}
}
},
pl:{
contexts:["Gdy plany zmieniają się niespodziewanie","Podczas wymagającej rozmowy","Po otrzymaniu krytycznej informacji zwrotnej","Gdy rośnie presja czasu","Gdy ktoś się ze mną nie zgadza","Po popełnieniu błędu","Gdy druga osoba wydaje się zdenerwowana","Gdy decyzja wpływa na inne osoby"],
responses:["Prawie nigdy","Czasami","Często","Prawie zawsze"],
behaviors:{
selfAwareness:{positive:["rozpoznaję konkretną emocję, zanim zacznę działać.","zauważam sygnały z ciała towarzyszące mojej reakcji.","oddzielam to, co wiem, od pierwszej interpretacji.","łączę swoją reakcję z ważną dla mnie potrzebą lub wartością."],reverse:["działam, zanim sprawdzę, co czuję.","pomijam sygnały z ciała, aż moja reakcja staje się silna.","traktuję pierwszą interpretację jak fakt bez jej sprawdzenia.","trudno mi nazwać potrzebę lub wartość związaną z moją reakcją."]},
regulation:{positive:["robię przerwę i wybieram sposób odpowiedzi.","stosuję praktyczny krok, aby zmniejszyć napięcie przed odpowiedzią.","zmieniam plan, gdy pierwsze podejście nie pomaga.","wracam do sprawy, gdy mogę zająć się nią spokojniej."],reverse:["reaguję natychmiast, nawet gdy przerwa byłaby pomocna.","pozwalam, by napięcie określało mój ton lub działania.","powtarzam tę samą reakcję, nawet gdy nie działa.","unikam powrotu do sprawy po pierwszym trudnym momencie."]},
empathy:{positive:["pytam, jak druga osoba widzi sytuację.","zwracam uwagę zarówno na słowa, jak i sygnały emocjonalne.","odróżniam rozumienie punktu widzenia od zgody z nim.","sprawdzam, czy moja interpretacja drugiej osoby jest trafna."],reverse:["zakładam, że znam perspektywę drugiej osoby, nie pytając.","skupiam się tylko na słowach i pomijam sygnały emocjonalne.","traktuję różnicę zdań jako dowód, że druga osoba nie rozumie.","decyduję, co czuje druga osoba, zanim to z nią sprawdzę."]},
relationships:{positive:["jasno mówię o swojej obawie, nie obwiniając drugiej osoby.","proponuję wspólny następny krok do rozważenia przez obie strony.","uznaję swój udział w tym, co się wydarzyło.","z szacunkiem wyjaśniam oczekiwania i granice."],reverse:["sugeruję swoją obawę zamiast powiedzieć o niej jasno.","skupiam się na wygraniu rozmowy zamiast na następnym kroku.","skupiam się wyłącznie na udziale drugiej osoby.","nie wypowiadam oczekiwań lub granic i liczę, że zostaną zrozumiane."]}
}
},
pt:{
contexts:["Quando os planos mudam inesperadamente","Durante uma conversa exigente","Depois de receber uma crítica","Quando aumenta a pressão de tempo","Quando alguém discorda de mim","Depois de eu cometer um erro","Quando outra pessoa parece perturbada","Quando uma decisão afeta outras pessoas"],
responses:["Quase nunca","Às vezes","Frequentemente","Quase sempre"],
behaviors:{
selfAwareness:{positive:["identifico a emoção específica antes de agir.","noto os sinais no corpo que acompanham a minha reação.","separo o que sei da minha primeira interpretação.","relaciono a minha reação com uma necessidade ou valor importante para mim."],reverse:["ajo antes de verificar o que estou a sentir.","ignoro sinais físicos até a minha reação já ser intensa.","trato a primeira interpretação como facto sem a verificar.","tenho dificuldade em nomear a necessidade ou o valor ligado à minha reação."]},
regulation:{positive:["faço uma pausa e escolho como quero responder.","uso um passo prático para reduzir a intensidade antes de responder.","ajusto o plano quando a primeira abordagem não ajuda.","retomo o assunto quando consigo tratá-lo com mais calma."],reverse:["respondo de imediato mesmo quando uma pausa ajudaria.","deixo que a tensão determine o meu tom ou as minhas ações.","repito a mesma resposta mesmo quando não funciona.","evito retomar o assunto depois do primeiro momento difícil."]},
empathy:{positive:["pergunto como a outra pessoa vê a situação.","presto atenção às palavras e aos sinais emocionais.","distingo compreender um ponto de vista de concordar com ele.","confirmo se a minha interpretação da outra pessoa é correta."],reverse:["presumo conhecer a perspetiva da outra pessoa sem perguntar.","concentro-me apenas nas palavras e perco sinais emocionais.","trato a discordância como prova de que a outra pessoa não compreende.","decido o que a outra pessoa sente antes de confirmar com ela."]},
relationships:{positive:["expresso a minha preocupação claramente sem culpar.","sugiro um próximo passo comum que ambos podem considerar.","reconheço a minha parte no que aconteceu.","clarifico expectativas e limites com respeito."],reverse:["insinuo a minha preocupação em vez de a dizer claramente.","concentro-me em ganhar a discussão em vez de encontrar um próximo passo.","concentro-me apenas na parte da outra pessoa.","deixo expectativas ou limites por dizer e espero que sejam compreendidos."]}
}
},
fr:{
contexts:["Lorsque les plans changent de façon inattendue","Pendant une conversation exigeante","Après avoir reçu une remarque critique","Lorsque la pression du temps augmente","Lorsque quelqu'un n'est pas d'accord avec moi","Après avoir commis une erreur","Lorsqu'une autre personne semble contrariée","Lorsqu'une décision concerne d'autres personnes"],
responses:["Presque jamais","Parfois","Souvent","Presque toujours"],
behaviors:{
selfAwareness:{positive:["j'identifie l'émotion précise avant d'agir.","je remarque les signaux corporels qui accompagnent ma réaction.","je distingue ce que je sais de ma première interprétation.","je relie ma réaction à un besoin ou une valeur importante pour moi."],reverse:["j'agis avant de vérifier ce que je ressens.","j'ignore les signaux physiques jusqu'à ce que ma réaction soit déjà intense.","je traite ma première interprétation comme un fait sans la vérifier.","j'ai du mal à nommer le besoin ou la valeur lié à ma réaction."]},
regulation:{positive:["je crée une pause et je choisis comment répondre.","j'utilise une étape concrète pour réduire l'intensité avant de répondre.","j'adapte mon plan lorsque la première approche n'aide pas.","je reviens au sujet quand je peux l'aborder plus calmement."],reverse:["je réponds immédiatement même lorsqu'une pause aiderait.","je laisse la tension déterminer mon ton ou mes actions.","je répète la même réponse même lorsqu'elle ne fonctionne pas.","j'évite de revenir au sujet après le premier moment difficile."]},
empathy:{positive:["je demande comment l'autre personne voit la situation.","je prête attention aux mots et aux signaux émotionnels.","je distingue comprendre un point de vue et être d'accord avec lui.","je vérifie si mon interprétation de l'autre personne est exacte."],reverse:["je suppose connaître le point de vue de l'autre sans demander.","je me concentre uniquement sur les mots et manque les signaux émotionnels.","je considère le désaccord comme une preuve que l'autre ne comprend pas.","je décide de ce que l'autre ressent avant de vérifier avec lui."]},
relationships:{positive:["j'exprime clairement ma préoccupation sans accuser l'autre.","je propose une prochaine étape commune que chacun peut envisager.","je reconnais ma part dans ce qui s'est passé.","je clarifie les attentes et les limites avec respect."],reverse:["je fais allusion à ma préoccupation au lieu de la dire clairement.","je cherche à gagner l'échange plutôt qu'à trouver une prochaine étape.","je me concentre uniquement sur la part de l'autre personne.","je laisse attentes ou limites implicites en espérant qu'elles soient comprises."]}
}
}
};

function localePrompt(language,domain,direction,contextIndex,actionIndex){
  const source=CONTENT[language];
  const separator={zh:"，",ja:"、",ar:"، "}[language]||", ";
  return `${source.contexts[contextIndex]}${separator}${source.behaviors[domain][direction][actionIndex]}`;
}

export function buildEmotionalBank(){
  const items=[];
  const domainSeeds=Object.fromEntries(DOMAINS.map(domain=>[domain,0]));
  const directionCounts=Object.fromEntries(DOMAINS.map(domain=>[domain,{positive:0,reverse:0}]));
  for(let index=0;index<250;index++){
    const domainIndex=index%DOMAINS.length;
    const domain=DOMAINS[domainIndex];
    const seed=domainSeeds[domain]++;
    const direction=(seed+domainIndex)%2===0?"positive":"reverse";
    const ordinal=directionCounts[domain][direction]++;
    const contextIndex=ordinal%8;
    const actionIndex=Math.floor(ordinal/8)%4;
    const locales=Object.fromEntries(LANGUAGES.map(language=>[language,{
      prompt:localePrompt(language,domain,direction,contextIndex,actionIndex),
      responseOptions:[...CONTENT[language].responses]
    }]));
    items.push({
      id:`EMO-${String(index+1).padStart(3,"0")}`,
      type:"emotional",
      domain,
      difficulty:index%5+1,
      direction,
      contentWeight:1,
      scoreWeight:1,
      selectionWeight:1,
      status:"expert_review_required",
      stemKey:`emotional.${domain}.${direction}.c${String(contextIndex+1).padStart(2,"0")}.a${String(actionIndex+1).padStart(2,"0")}`,
      locales,
      metadata:{
        selectionWeight:1,
        difficultyBasis:"provisional_context_complexity",
        responseModel:"four_point_frequency_no_midpoint",
        scoringModel:direction==="reverse"?"reverse_keyed_0_to_3":"direct_keyed_0_to_3",
        intendedUse:"educational_emotional_skill_reflection",
        reviewRequired:["construct_alignment","response_process","accessibility","bias_sensitivity","translation_equivalence"]
      }
    });
  }
  return items;
}
