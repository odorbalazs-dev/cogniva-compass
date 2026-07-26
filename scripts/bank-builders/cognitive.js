const LANGUAGES=["hu","en","de","it","es","zh","ja","ar","pl","pt","fr"];
const DOMAINS=["patterns","workingMemory","numericalReasoning","flexibleThinking"];

const TEMPLATES={
en:{
nextPattern:"Which value continues the pattern: {sequence}, …?",
reverseSequence:"Reverse this sequence: {sequence}.",
opsAddSub:"Start with {start}. Add {add}, subtract {subtract}, then add {finalAdd}. What is the result?",
secondLargest:"Arrange these values from largest to smallest: {sequence}. Which value is second?",
addThenReverse:"Add {add} to every value, then reverse the order: {sequence}.",
doubleOps:"Start with {start}. Double it, subtract {subtract}, then add {add}. What is the result?",
linearRule:"A rule multiplies the input by {multiply} and then adds {add}. What is the result for {input}?",
equalGroups:"There are {groups} equal groups with {each} tokens in each group. How many tokens are there altogether?",
proportion:"If {baseGroups} equal groups contain {baseTotal} tokens, how many tokens are in {targetGroups} such groups?",
percent:"What is {percent}% of {value}?",
missingFactor:"Which number completes the equation: {factor} × ? = {product}?",
parityRule:"Use this rule: if a number is even, add {add}; if it is odd, subtract {subtract}. What does {input} become?",
thresholdRule:"Use this rule: if a number is greater than {threshold}, double it; otherwise add {add}. What does {input} become?",
customOperation:"The symbol ⊕ means: first number plus twice the second number. What is {left} ⊕ {right}?",
switchRule:"Start with {start}. Add {add} twice, then multiply the result by 2. What is the final value?",
equivalent:"Which expression has the same value as {target}?"
},
hu:{
nextPattern:"Melyik érték folytatja a mintát: {sequence}, …?",
reverseSequence:"Fordítsd meg ezt a sorrendet: {sequence}.",
opsAddSub:"Indulj {start}-ból. Adj hozzá {add}-et, vonj le {subtract}-et, majd adj hozzá {finalAdd}-et. Mi az eredmény?",
secondLargest:"Rendezd csökkenő sorrendbe ezeket az értékeket: {sequence}. Melyik a második?",
addThenReverse:"Adj minden értékhez {add}-et, majd fordítsd meg a sorrendet: {sequence}.",
doubleOps:"Indulj {start}-ból. Duplázd meg, vonj le {subtract}-et, majd adj hozzá {add}-et. Mi az eredmény?",
linearRule:"Egy szabály megszorozza a bemenetet {multiply}-val, majd hozzáad {add}-et. Mi az eredmény {input} esetén?",
equalGroups:"{groups} egyenlő csoport mindegyikében {each} korong van. Hány korong van összesen?",
proportion:"Ha {baseGroups} egyenlő csoportban összesen {baseTotal} korong van, hány korong van {targetGroups} ilyen csoportban?",
percent:"Mennyi {value} {percent}%-a?",
missingFactor:"Melyik szám egészíti ki az egyenletet: {factor} × ? = {product}?",
parityRule:"Alkalmazd a szabályt: páros számhoz adj {add}-et, páratlanból vonj le {subtract}-et. Mi lesz {input}-ból?",
thresholdRule:"Alkalmazd a szabályt: ha a szám nagyobb {threshold}-nál, duplázd meg; egyébként adj hozzá {add}-et. Mi lesz {input}-ból?",
customOperation:"A ⊕ jel jelentése: az első szám plusz a második szám kétszerese. Mennyi {left} ⊕ {right}?",
switchRule:"Indulj {start}-ból. Kétszer egymás után adj hozzá {add}-et, majd szorozd meg az eredményt 2-vel. Mi a végeredmény?",
equivalent:"Melyik kifejezés értéke azonos ezzel: {target}?"
},
de:{
nextPattern:"Welcher Wert setzt das Muster fort: {sequence}, …?",
reverseSequence:"Kehre diese Reihenfolge um: {sequence}.",
opsAddSub:"Beginne mit {start}. Addiere {add}, subtrahiere {subtract} und addiere dann {finalAdd}. Was ist das Ergebnis?",
secondLargest:"Ordne diese Werte absteigend: {sequence}. Welcher Wert ist der zweite?",
addThenReverse:"Addiere {add} zu jedem Wert und kehre dann die Reihenfolge um: {sequence}.",
doubleOps:"Beginne mit {start}. Verdopple, subtrahiere {subtract} und addiere dann {add}. Was ist das Ergebnis?",
linearRule:"Eine Regel multipliziert die Eingabe mit {multiply} und addiert danach {add}. Was ergibt sich für {input}?",
equalGroups:"Es gibt {groups} gleich große Gruppen mit je {each} Marken. Wie viele Marken sind es insgesamt?",
proportion:"Wenn {baseGroups} gleiche Gruppen zusammen {baseTotal} Marken enthalten, wie viele sind es in {targetGroups} Gruppen?",
percent:"Wie viel sind {percent}% von {value}?",
missingFactor:"Welche Zahl ergänzt die Gleichung: {factor} × ? = {product}?",
parityRule:"Regel: Bei geraden Zahlen addiere {add}, bei ungeraden subtrahiere {subtract}. Was wird aus {input}?",
thresholdRule:"Regel: Ist eine Zahl größer als {threshold}, verdopple sie; sonst addiere {add}. Was wird aus {input}?",
customOperation:"Das Zeichen ⊕ bedeutet: erste Zahl plus das Doppelte der zweiten. Was ist {left} ⊕ {right}?",
switchRule:"Beginne mit {start}. Addiere zweimal {add} und multipliziere das Ergebnis dann mit 2. Was ist der Endwert?",
equivalent:"Welcher Ausdruck hat denselben Wert wie {target}?"
},
it:{
nextPattern:"Quale valore continua lo schema: {sequence}, …?",
reverseSequence:"Inverti questa sequenza: {sequence}.",
opsAddSub:"Parti da {start}. Aggiungi {add}, sottrai {subtract}, poi aggiungi {finalAdd}. Qual è il risultato?",
secondLargest:"Ordina questi valori dal maggiore al minore: {sequence}. Qual è il secondo?",
addThenReverse:"Aggiungi {add} a ogni valore, poi inverti l'ordine: {sequence}.",
doubleOps:"Parti da {start}. Raddoppia, sottrai {subtract}, poi aggiungi {add}. Qual è il risultato?",
linearRule:"Una regola moltiplica l'input per {multiply} e poi aggiunge {add}. Qual è il risultato per {input}?",
equalGroups:"Ci sono {groups} gruppi uguali con {each} gettoni ciascuno. Quanti gettoni ci sono in tutto?",
proportion:"Se {baseGroups} gruppi uguali contengono {baseTotal} gettoni, quanti ne contengono {targetGroups} gruppi?",
percent:"Quanto è il {percent}% di {value}?",
missingFactor:"Quale numero completa l'equazione: {factor} × ? = {product}?",
parityRule:"Regola: se il numero è pari aggiungi {add}; se è dispari sottrai {subtract}. Cosa diventa {input}?",
thresholdRule:"Regola: se il numero è maggiore di {threshold}, raddoppialo; altrimenti aggiungi {add}. Cosa diventa {input}?",
customOperation:"Il simbolo ⊕ significa: primo numero più due volte il secondo. Quanto fa {left} ⊕ {right}?",
switchRule:"Parti da {start}. Aggiungi {add} due volte, poi moltiplica il risultato per 2. Qual è il valore finale?",
equivalent:"Quale espressione ha lo stesso valore di {target}?"
},
es:{
nextPattern:"¿Qué valor continúa el patrón: {sequence}, …?",
reverseSequence:"Invierte esta secuencia: {sequence}.",
opsAddSub:"Empieza con {start}. Suma {add}, resta {subtract} y después suma {finalAdd}. ¿Cuál es el resultado?",
secondLargest:"Ordena estos valores de mayor a menor: {sequence}. ¿Cuál queda segundo?",
addThenReverse:"Suma {add} a cada valor y luego invierte el orden: {sequence}.",
doubleOps:"Empieza con {start}. Duplica, resta {subtract} y después suma {add}. ¿Cuál es el resultado?",
linearRule:"Una regla multiplica la entrada por {multiply} y luego suma {add}. ¿Cuál es el resultado para {input}?",
equalGroups:"Hay {groups} grupos iguales con {each} fichas en cada uno. ¿Cuántas fichas hay en total?",
proportion:"Si {baseGroups} grupos iguales contienen {baseTotal} fichas, ¿cuántas contienen {targetGroups} grupos?",
percent:"¿Cuánto es el {percent}% de {value}?",
missingFactor:"¿Qué número completa la ecuación: {factor} × ? = {product}?",
parityRule:"Regla: si el número es par, suma {add}; si es impar, resta {subtract}. ¿En qué se convierte {input}?",
thresholdRule:"Regla: si el número es mayor que {threshold}, duplícalo; si no, suma {add}. ¿En qué se convierte {input}?",
customOperation:"El símbolo ⊕ significa: primer número más dos veces el segundo. ¿Cuánto es {left} ⊕ {right}?",
switchRule:"Empieza con {start}. Suma {add} dos veces y después multiplica el resultado por 2. ¿Cuál es el valor final?",
equivalent:"¿Qué expresión tiene el mismo valor que {target}?"
},
zh:{
nextPattern:"哪个值延续这个规律：{sequence}，……？",
reverseSequence:"请将这个顺序倒过来：{sequence}。",
opsAddSub:"从{start}开始，加{add}，减{subtract}，再加{finalAdd}。结果是多少？",
secondLargest:"将这些数从大到小排列：{sequence}。第二个数是多少？",
addThenReverse:"每个数都加{add}，然后将顺序倒过来：{sequence}。",
doubleOps:"从{start}开始，乘2，减{subtract}，再加{add}。结果是多少？",
linearRule:"规则是把输入乘以{multiply}，再加{add}。输入{input}时结果是多少？",
equalGroups:"有{groups}个相同的小组，每组有{each}个圆片。一共有多少个圆片？",
proportion:"如果{baseGroups}个相同小组共有{baseTotal}个圆片，那么{targetGroups}个小组有多少个？",
percent:"{value}的{percent}%是多少？",
missingFactor:"哪个数能补全等式：{factor} × ? = {product}？",
parityRule:"规则：偶数加{add}，奇数减{subtract}。{input}会变成多少？",
thresholdRule:"规则：大于{threshold}的数乘2，否则加{add}。{input}会变成多少？",
customOperation:"符号⊕表示：第一个数加上第二个数的两倍。{left} ⊕ {right}是多少？",
switchRule:"从{start}开始，连续两次加{add}，然后把结果乘2。最终是多少？",
equivalent:"哪个算式与{target}的值相同？"
},
ja:{
nextPattern:"次の規則を続ける値はどれですか：{sequence}、…？",
reverseSequence:"この順序を逆にしてください：{sequence}。",
opsAddSub:"{start}から始めます。{add}を足し、{subtract}を引き、最後に{finalAdd}を足します。結果はいくつですか？",
secondLargest:"次の値を大きい順に並べます：{sequence}。2番目はどれですか？",
addThenReverse:"各値に{add}を足してから、順序を逆にしてください：{sequence}。",
doubleOps:"{start}から始めます。2倍し、{subtract}を引き、{add}を足します。結果はいくつですか？",
linearRule:"入力を{multiply}倍してから{add}を足す規則です。入力が{input}のとき結果はいくつですか？",
equalGroups:"同じ大きさのグループが{groups}個あり、各グループに印が{each}個あります。全部でいくつですか？",
proportion:"同じグループ{baseGroups}個に印が合計{baseTotal}個あるとき、{targetGroups}個ではいくつですか？",
percent:"{value}の{percent}%はいくつですか？",
missingFactor:"式を完成する数はどれですか：{factor} × ? = {product}？",
parityRule:"規則：偶数には{add}を足し、奇数からは{subtract}を引きます。{input}はいくつになりますか？",
thresholdRule:"規則：{threshold}より大きければ2倍し、それ以外は{add}を足します。{input}はいくつになりますか？",
customOperation:"⊕は「最初の数＋2×2番目の数」を表します。{left} ⊕ {right}はいくつですか？",
switchRule:"{start}から始め、{add}を2回足し、その結果を2倍します。最後の値はいくつですか？",
equivalent:"{target}と同じ値になる式はどれですか？"
},
ar:{
nextPattern:"ما القيمة التي تكمل النمط: {sequence}، …؟",
reverseSequence:"اعكس هذا الترتيب: {sequence}.",
opsAddSub:"ابدأ بـ{start}. أضف {add}، واطرح {subtract}، ثم أضف {finalAdd}. ما النتيجة؟",
secondLargest:"رتب هذه القيم من الأكبر إلى الأصغر: {sequence}. ما القيمة الثانية؟",
addThenReverse:"أضف {add} إلى كل قيمة، ثم اعكس الترتيب: {sequence}.",
doubleOps:"ابدأ بـ{start}. ضاعفه، واطرح {subtract}، ثم أضف {add}. ما النتيجة؟",
linearRule:"تضرب القاعدة المدخل في {multiply} ثم تضيف {add}. ما ناتج المدخل {input}؟",
equalGroups:"هناك {groups} مجموعات متساوية، في كل منها {each} قطع. كم قطعة في المجموع؟",
proportion:"إذا احتوت {baseGroups} مجموعات متساوية على {baseTotal} قطع، فكم قطعة في {targetGroups} مجموعات؟",
percent:"كم يساوي {percent}% من {value}؟",
missingFactor:"أي عدد يكمل المعادلة: {factor} × ? = {product}؟",
parityRule:"القاعدة: أضف {add} إلى العدد الزوجي، واطرح {subtract} من الفردي. ماذا يصبح {input}؟",
thresholdRule:"القاعدة: إذا كان العدد أكبر من {threshold} فضاعفه، وإلا فأضف {add}. ماذا يصبح {input}؟",
customOperation:"يعني الرمز ⊕: العدد الأول زائد ضعفي العدد الثاني. كم يساوي {left} ⊕ {right}؟",
switchRule:"ابدأ بـ{start}. أضف {add} مرتين، ثم اضرب الناتج في 2. ما القيمة النهائية؟",
equivalent:"أي تعبير يساوي في قيمته {target}؟"
},
pl:{
nextPattern:"Która wartość kontynuuje wzorzec: {sequence}, …?",
reverseSequence:"Odwróć tę kolejność: {sequence}.",
opsAddSub:"Zacznij od {start}. Dodaj {add}, odejmij {subtract}, a potem dodaj {finalAdd}. Jaki jest wynik?",
secondLargest:"Ułóż wartości malejąco: {sequence}. Która jest druga?",
addThenReverse:"Dodaj {add} do każdej wartości, a następnie odwróć kolejność: {sequence}.",
doubleOps:"Zacznij od {start}. Podwój, odejmij {subtract}, a potem dodaj {add}. Jaki jest wynik?",
linearRule:"Reguła mnoży wejście przez {multiply}, a następnie dodaje {add}. Jaki jest wynik dla {input}?",
equalGroups:"Jest {groups} równych grup, po {each} żetonów w każdej. Ile żetonów jest razem?",
proportion:"Jeśli {baseGroups} równe grupy zawierają {baseTotal} żetonów, ile jest ich w {targetGroups} grupach?",
percent:"Ile wynosi {percent}% z {value}?",
missingFactor:"Która liczba uzupełnia równanie: {factor} × ? = {product}?",
parityRule:"Reguła: do liczby parzystej dodaj {add}, a od nieparzystej odejmij {subtract}. Co powstanie z {input}?",
thresholdRule:"Reguła: jeśli liczba jest większa niż {threshold}, podwój ją; w przeciwnym razie dodaj {add}. Co powstanie z {input}?",
customOperation:"Symbol ⊕ oznacza: pierwsza liczba plus podwojona druga. Ile wynosi {left} ⊕ {right}?",
switchRule:"Zacznij od {start}. Dwa razy dodaj {add}, a następnie pomnóż wynik przez 2. Jaka jest wartość końcowa?",
equivalent:"Które wyrażenie ma tę samą wartość co {target}?"
},
pt:{
nextPattern:"Que valor continua o padrão: {sequence}, …?",
reverseSequence:"Inverta esta sequência: {sequence}.",
opsAddSub:"Comece com {start}. Some {add}, subtraia {subtract} e depois some {finalAdd}. Qual é o resultado?",
secondLargest:"Ordene estes valores do maior para o menor: {sequence}. Qual fica em segundo?",
addThenReverse:"Some {add} a cada valor e depois inverta a ordem: {sequence}.",
doubleOps:"Comece com {start}. Duplique, subtraia {subtract} e depois some {add}. Qual é o resultado?",
linearRule:"Uma regra multiplica a entrada por {multiply} e depois soma {add}. Qual é o resultado para {input}?",
equalGroups:"Há {groups} grupos iguais com {each} fichas em cada um. Quantas fichas há ao todo?",
proportion:"Se {baseGroups} grupos iguais contêm {baseTotal} fichas, quantas contêm {targetGroups} grupos?",
percent:"Quanto é {percent}% de {value}?",
missingFactor:"Que número completa a equação: {factor} × ? = {product}?",
parityRule:"Regra: se o número for par, some {add}; se for ímpar, subtraia {subtract}. Em que se transforma {input}?",
thresholdRule:"Regra: se o número for maior que {threshold}, duplique-o; caso contrário, some {add}. Em que se transforma {input}?",
customOperation:"O símbolo ⊕ significa: primeiro número mais duas vezes o segundo. Quanto é {left} ⊕ {right}?",
switchRule:"Comece com {start}. Some {add} duas vezes e depois multiplique o resultado por 2. Qual é o valor final?",
equivalent:"Que expressão tem o mesmo valor que {target}?"
},
fr:{
nextPattern:"Quelle valeur poursuit le motif : {sequence}, … ?",
reverseSequence:"Inversez cette suite : {sequence}.",
opsAddSub:"Partez de {start}. Ajoutez {add}, soustrayez {subtract}, puis ajoutez {finalAdd}. Quel est le résultat ?",
secondLargest:"Classez ces valeurs de la plus grande à la plus petite : {sequence}. Quelle est la deuxième ?",
addThenReverse:"Ajoutez {add} à chaque valeur, puis inversez l'ordre : {sequence}.",
doubleOps:"Partez de {start}. Doublez, soustrayez {subtract}, puis ajoutez {add}. Quel est le résultat ?",
linearRule:"Une règle multiplie l'entrée par {multiply}, puis ajoute {add}. Quel est le résultat pour {input} ?",
equalGroups:"Il y a {groups} groupes égaux de {each} jetons chacun. Combien y a-t-il de jetons au total ?",
proportion:"Si {baseGroups} groupes égaux contiennent {baseTotal} jetons, combien y en a-t-il dans {targetGroups} groupes ?",
percent:"Combien font {percent}% de {value} ?",
missingFactor:"Quel nombre complète l'équation : {factor} × ? = {product} ?",
parityRule:"Règle : si le nombre est pair, ajoutez {add} ; s'il est impair, soustrayez {subtract}. Que devient {input} ?",
thresholdRule:"Règle : si le nombre est supérieur à {threshold}, doublez-le ; sinon ajoutez {add}. Que devient {input} ?",
customOperation:"Le symbole ⊕ signifie : premier nombre plus deux fois le second. Combien font {left} ⊕ {right} ?",
switchRule:"Partez de {start}. Ajoutez {add} deux fois, puis multipliez le résultat par 2. Quelle est la valeur finale ?",
equivalent:"Quelle expression a la même valeur que {target} ?"
}
};

function fill(template,values){return template.replace(/\{(\w+)\}/g,(_,key)=>String(values[key]))}
function seq(values){return values.join(" – ")}
function uniqueStrings(values){return [...new Set(values.map(String))]}
function answerSet(correct,distractors,correctIndex){
  const correctText=String(correct);
  const wrong=uniqueStrings(distractors).filter(value=>value!==correctText);
  let offset=1;
  while(wrong.length<3){const candidate=String(Number(correct)+offset++);if(candidate!==correctText&&!wrong.includes(candidate))wrong.push(candidate)}
  const choices=wrong.slice(0,3);
  choices.splice(correctIndex,0,correctText);
  return {choices,correctIndex};
}

function makeProblem(domain,difficulty,seed,correctIndex){
  const family=seed%5;
  let key,values,correct,distractors;
  if(domain==="patterns"){
    key="nextPattern";
    let numbers=[];
    if(family===0){
      const start=3+seed,difference=difficulty+1+(seed%3);
      numbers=Array.from({length:4+difficulty%2},(_,i)=>start+i*difference);
      correct=numbers.at(-1)+difference;
      distractors=[correct-difference,correct+1,correct+difference];
    }else if(family===1){
      const start=4+seed,a=difficulty+1,b=difficulty+3+(seed%2);
      numbers=[start];
      for(let i=0;i<5;i++)numbers.push(numbers.at(-1)+(i%2===0?a:b));
      const nextStep=numbers.length%2===1?a:b;
      correct=numbers.at(-1)+nextStep;
      distractors=[numbers.at(-1)+(nextStep===a?b:a),correct-1,correct+2];
    }else if(family===2){
      const start=2+seed,ratio=difficulty>=4?3:2;
      numbers=Array.from({length:4},(_,i)=>start*(ratio**i));
      correct=numbers.at(-1)*ratio;
      distractors=[numbers.at(-1)+ratio,numbers.at(-1)*(ratio+1),correct-ratio];
    }else if(family===3){
      const first=2+seed,second=11+seed+difficulty,stepA=difficulty+1,stepB=difficulty+2;
      numbers=[first,second,first+stepA,second+stepB,first+2*stepA,second+2*stepB];
      correct=first+3*stepA;
      distractors=[second+3*stepB,correct+stepA,correct-1];
    }else{
      const offset=seed+1,scale=1+(difficulty>=4?1:0);
      numbers=Array.from({length:4},(_,i)=>offset+scale*(i+1)**2);
      correct=offset+scale*25;
      distractors=[numbers.at(-1)+scale*7,numbers.at(-1)+scale*8,correct+scale];
    }
    values={sequence:seq(numbers)};
  }else if(domain==="workingMemory"){
    if(family===0){
      key="reverseSequence";
      const length=4+Math.floor((difficulty-1)/2);
      const numbers=Array.from({length},(_,i)=>seed*2+7+i*(difficulty+2)+(i%2));
      correct=seq([...numbers].reverse());
      distractors=[seq([...numbers].reverse().slice(1).concat(numbers.at(-1))),seq([...numbers].reverse().map((x,i)=>i===0?x+1:x)),seq(numbers)];
      values={sequence:seq(numbers)};
    }else if(family===1){
      key="opsAddSub";
      const start=12+seed,add=difficulty+3,subtract=2+(seed%5),finalAdd=1+difficulty;
      correct=start+add-subtract+finalAdd;
      distractors=[start+add-subtract,correct+subtract,correct-finalAdd];
      values={start,add,subtract,finalAdd};
    }else if(family===2){
      key="secondLargest";
      const numbers=[seed+5,seed+difficulty+18,seed+11,seed+difficulty+25,seed+2];
      const sorted=[...numbers].sort((a,b)=>b-a);
      correct=sorted[1];
      distractors=[sorted[0],sorted[2],sorted.at(-1)];
      values={sequence:seq(numbers)};
    }else if(family===3){
      key="addThenReverse";
      const add=difficulty+2,numbers=Array.from({length:4+difficulty%2},(_,i)=>seed+3+i*(difficulty+1));
      const transformed=numbers.map(x=>x+add);
      correct=seq([...transformed].reverse());
      distractors=[seq(transformed),seq([...numbers].reverse()),seq([...transformed].reverse().map((x,i)=>i===0?x+1:x))];
      values={add,sequence:seq(numbers)};
    }else{
      key="doubleOps";
      const start=8+seed,subtract=3+difficulty,add=2+(seed%4);
      correct=start*2-subtract+add;
      distractors=[(start-subtract+add)*2,start*2-subtract,correct+subtract];
      values={start,subtract,add};
    }
  }else if(domain==="numericalReasoning"){
    if(family===0){
      key="linearRule";
      const multiply=2+(difficulty%3),add=1+(seed%7),input=3+seed;
      correct=input*multiply+add;
      distractors=[input+multiply+add,input*multiply-add,(input+add)*multiply];
      values={multiply,add,input};
    }else if(family===1){
      key="equalGroups";
      const groups=3+difficulty,each=4+seed;
      correct=groups*each;
      distractors=[groups+each,(groups-1)*each,groups*(each+1)];
      values={groups,each};
    }else if(family===2){
      key="proportion";
      const baseGroups=2+(difficulty%3),perGroup=3+seed,baseTotal=baseGroups*perGroup,targetGroups=baseGroups+2+difficulty%2;
      correct=targetGroups*perGroup;
      distractors=[baseTotal+targetGroups,correct-perGroup,correct+baseGroups];
      values={baseGroups,baseTotal,targetGroups};
    }else if(family===3){
      key="percent";
      const percentages=[10,20,25,50],percent=percentages[(seed+difficulty)%percentages.length];
      const base=percent===25?4:10;
      const value=base*(5+difficulty+seed%7);
      correct=value*percent/100;
      distractors=[value*(percent+10)/100,value-percent,percent];
      values={percent,value};
    }else{
      key="missingFactor";
      const factor=2+difficulty,missing=4+(seed%12),product=factor*missing;
      correct=missing;
      distractors=[factor,missing+factor,product-factor];
      values={factor,product};
    }
  }else{
    if(family===0){
      key="parityRule";
      const add=2+difficulty,subtract=1+(seed%4),input=10+seed;
      correct=input%2===0?input+add:input-subtract;
      distractors=[input%2===0?input-subtract:input+add,input+add+subtract,input];
      values={add,subtract,input};
    }else if(family===1){
      key="thresholdRule";
      const threshold=15+seed,add=3+difficulty,input=threshold+(seed%2===0?difficulty:-difficulty);
      correct=input>threshold?input*2:input+add;
      distractors=[input>threshold?input+add:input*2,input+threshold,correct+add];
      values={threshold,add,input};
    }else if(family===2){
      key="customOperation";
      const left=3+seed,right=2+difficulty;
      correct=left+2*right;
      distractors=[(left+right)*2,left*2+right,left+right];
      values={left,right};
    }else if(family===3){
      key="switchRule";
      const start=5+seed,add=2+difficulty;
      correct=(start+add+add)*2;
      distractors=[start+add+add*2,start+add*2,(start+add)*2];
      values={start,add};
    }else{
      key="equivalent";
      const a=4+seed,b=2+difficulty,target=`${a} + ${b} × 2`;
      correct=`${a+b} + ${b}`;
      const correctValue=a+2*b;
      const candidates=[`${correctValue+1}`,`${correctValue-1}`,`${correctValue+2}`];
      const set=answerSet(correct,candidates,correctIndex);
      return {key,values:{target},...set};
    }
  }
  return {key,values,...answerSet(correct,distractors,correctIndex)};
}

function buildLocales(problem){
  return Object.fromEntries(LANGUAGES.map(lang=>[lang,{prompt:fill(TEMPLATES[lang][problem.key],problem.values),choices:[...problem.choices]}]));
}

export function buildCognitiveBank(){
  const items=[];
  const domainSeeds=Object.fromEntries(DOMAINS.map(domain=>[domain,0]));
  for(let index=0;index<250;index++){
    const domain=DOMAINS[index%DOMAINS.length];
    const difficulty=index%5+1;
    const seed=domainSeeds[domain]++;
    const desiredCorrect=((index%4)+Math.floor(index/4))%4;
    const problem=makeProblem(domain,difficulty,seed,desiredCorrect);
    items.push({
      id:`COG-${String(index+1).padStart(3,"0")}`,
      type:"cognitive",
      domain,
      difficulty,
      contentWeight:1,
      scoreWeight:1,
      selectionWeight:1,
      status:"expert_review_required",
      stemKey:`cognitive.${domain}.${String(seed+1).padStart(3,"0")}`,
      correctIndex:problem.correctIndex,
      locales:buildLocales(problem),
      metadata:{
        selectionWeight:1,
        difficultyBasis:"provisional_content_specification",
        responseModel:"four_option_single_key",
        scoringModel:"dichotomous",
        intendedUse:"educational_cognitive_skill_reflection",
        reviewRequired:["construct_alignment","distractor_quality","accessibility","bias_sensitivity","translation_equivalence"]
      }
    });
  }
  return items;
}
