const nav = document.querySelector('#category-nav');
const content = document.querySelector('#menu-content');
const search = document.querySelector('#search');
const empty = document.querySelector('#empty-state');
const dialog = document.querySelector('#allergen-dialog');
let menuData;

const copy = {
  it: {
    claim:'Bar · Cicchetteria · Aperitivi', discover:'Scopri il menù', ourMenu:'Il nostro menù', whatWould:'Cosa ti va', today:'oggi?',
    choose:'Scegli una categoria o cerca il tuo piatto preferito.', search:'Cerca hamburger, spritz, pizza…', empty:'Nessun risultato. Prova con un altro nome o ingrediente.',
    goodToKnow:'Buono a sapersi', notice:'Non si paga il coperto. Per l’asporto è prevista una maggiorazione di 0,50 €. I piatti sono soggetti alla disponibilità degli ingredienti.',
    allergenInfo:'Informazioni sugli allergeni', footer:'Il gusto, dalla colazione all’ultimo drink.', important:'Informazione importante', allergies:'Allergie e intolleranze',
    allergyIntro:'Comunica sempre al personale eventuali allergie o intolleranze prima di ordinare. I prodotti possono contenere o essere entrati in contatto con:',
    frozen:'Alcuni prodotti possono essere congelati, surgelati o decongelati. Chiedi al personale per informazioni puntuali.', unavailable:'Il menù non è disponibile in questo momento.', close:'Chiudi'
  },
  en: {
    claim:'Bar · Cicchetti · Aperitifs', discover:'Explore the menu', ourMenu:'Our menu', whatWould:'What are you', today:'craving?',
    choose:'Choose a category or search for your favourite dish.', search:'Search burgers, spritz, pizza…', empty:'No results. Try another name or ingredient.',
    goodToKnow:'Good to know', notice:'No cover charge. A €0.50 surcharge applies to takeaway food. Dishes are subject to ingredient availability.',
    allergenInfo:'Allergen information', footer:'Great taste, from breakfast to the last drink.', important:'Important information', allergies:'Allergies and intolerances',
    allergyIntro:'Always tell our staff about any allergy or intolerance before ordering. Products may contain or have come into contact with:',
    frozen:'Some products may be frozen, deep-frozen or defrosted. Please ask our staff for detailed information.', unavailable:'The menu is currently unavailable.', close:'Close'
  }
};

const categoryNames = {
  caffetteria:'Coffee', brioche:'Brioche - Croissants', succhi:'Fruit juices', bibite:'Soft drinks', 'aperitivi-analcolici':'Non-alcoholic aperitifs', 'aperitivi-alcolici':'Alcoholic aperitifs',
  'la-cantina':'Wines from our cellar', 'liquori-amari':'Liqueurs & digestifs', cocktails:'Cocktails',
  'birre-bottiglia':'Bottled beers', 'birre-spina':'Draft beers', toast:'Toast', piadine:'Piadine', panini:'Sandwiches', 'panini-speciali':'Special sandwiches',
  bruschette:'Bruschetta', pizze:'Pizza', antipasti:'Starters', cicchetti:'Cicchetti', 'piatti-freddi':'Cold dishes', insalatone:'Salads', 'insalatone-speciali':'Special salads',
  primi:'First courses', secondi:'Main courses', dolci:'Desserts'
};

// Keep the website navigation and sections aligned with the final printed menu.
const categoryOrder = [
  'caffetteria', 'brioche', 'succhi', 'bibite',
  'aperitivi-analcolici', 'aperitivi-alcolici', 'liquori-amari',
  'la-cantina', 'cocktails', 'birre-bottiglia', 'birre-spina',
  'toast', 'piadine', 'panini', 'panini-speciali', 'bruschette',
  'pizze', 'antipasti', 'cicchetti', 'piatti-freddi', 'insalatone',
  'insalatone-speciali', 'primi', 'secondi', 'dolci'
];

function orderCategories(categories) {
  const position = new Map(categoryOrder.map((id, index) => [id, index]));
  return [...categories].sort((a, b) =>
    (position.get(a.id) ?? categoryOrder.length) -
    (position.get(b.id) ?? categoryOrder.length)
  );
}

const allergensEn = ['Cereals containing gluten','Crustaceans','Eggs','Fish','Peanuts','Soybeans','Milk and dairy products','Tree nuts','Celery','Mustard','Sesame seeds','Sulphur dioxide and sulphites','Lupin','Molluscs'];

const translations = [
  ['caffè speciale cioccolato o pistacchio e panna','special coffee with chocolate or pistachio cream and whipped cream'],
  ['tè / camomilla / tisane con biscotti','tea / chamomile / herbal tea with biscuits'], ['tè / camomilla / tisane','tea / chamomile / herbal tea'],
  ['croissant alla crema','custard croissant'], ['croissant all’albicocca','apricot croissant'], ['croissant al cioccolato','chocolate croissant'], ['croissant vuoto','plain croissant'],
  ['succo alla pesca','peach juice'], ['succo all’ace','ACE juice'], ['succo alla mela','apple juice'], ['succo alla pera','pear juice'], ['succo all’albicocca','apricot juice'], ['succo al mirtillo','blueberry juice'], ['succo all’ananas','pineapple juice'],
  ['san bitter pompelmo / zenzero','San Bitter grapefruit / ginger'], ['acqua brillante','sparkling soda'], ['cedrata tassoni','Tassoni citron soda'], ['tè alla pesca','peach iced tea'], ['tè al limone','lemon iced tea'],
  ['aperitivo della casa (analcolico)','house non-alcoholic aperitif'], ['aperitivo della casa (alcolico)','house alcoholic aperitif'],
  ['moretti bionda piccola','small Moretti Bionda'], ['moretti bionda media','medium Moretti Bionda'],
  ['prosciutto cotto e fontina','ham and Fontina'], ['prosciutto crudo e fontina','raw ham and Fontina'], ['prosciutto crudo e mozzarella','raw ham and mozzarella'],
  ['crudo, stracchino e rucola','raw ham, stracchino and rocket'], ['cotto, fontina, pomodoro, salsa rosa','ham, Fontina, tomato and cocktail sauce'], ['porchetta, fontina, sale, pepe','roast pork, Fontina, salt and pepper'],
  ['toastone peperoni','large toast with peppers'], ['toastone funghi','large toast with mushrooms'], ['toastone carciofi','large toast with artichokes'], ['toastone','large toast'],
  ['tagliere di affettati piccolo','small charcuterie board'], ['tagliere di affettati grande','large charcuterie board'], ['patatine fritte piccole','small French fries'], ['patatine fritte grandi','large French fries'],
  ['polpettina di carne','meatball'], ['polpettina di verdure','vegetable ball'], ['crostino con mazzancolle in saor','crostino with Venetian-style sweet-and-sour prawns'], ['crostino con sarde in saor','crostino with Venetian-style sweet-and-sour sardines'],
  ['insalata mista, tonno, mozzarella, olive, noci, cipolla, crostini di pane, pomodoro a fette','mixed salad, tuna, mozzarella, olives, walnuts, onion, croutons and sliced tomato'],
  ['insalata mista, tonno, mozzarella, olive, noci, cipolla','mixed salad, tuna, mozzarella, olives, walnuts and onion'],
  ['insalata mista, tacchino, crostini di pane mignon, glassa di aceto balsamico, salsa caesar, grana','mixed salad, turkey, mini croutons, balsamic glaze, Caesar dressing and Grana Padano'],
  ['grappa semplice','grappa'], ['vodka liscia','straight vodka'], ['vino frizzante','sparkling wine'], ['bottiglia','bottle'], ['calice','glass'], ['mezzo litro','half litre'], ['un litro','one litre'],
  ['mozzarella in carrozza al nero di seppia e salmone','squid-ink fried mozzarella sandwich with salmon'],
  ['crostino stracchino, acciughe e prezzemolo','crostino with stracchino cheese, anchovies and parsley'],
  ['tris di baccalà con polenta','three preparations of cod with polenta'],
  ['baccalà alla vicentina con polenta','Vicenza-style cod with polenta'],
  ['baccalà mantecato con polenta','creamed cod with polenta'],
  ['mazzancolle in saor con polenta','Venetian-style sweet-and-sour prawns with polenta'],
  ['sarde in saor con polenta','Venetian-style sweet-and-sour sardines with polenta'],
  ['crostino con mazzancolle in saor / sarde in saor','crostino with Venetian-style prawns / sardines'],
  ['crostino con baccalà alla vicentina','crostino with Vicenza-style cod'],
  ['crostino di baccalà mantecato','crostino with creamed cod'],
  ['crostino gorgonzola, noci e miele','crostino with Gorgonzola, walnuts and honey'],
  ['crostino crudo, stracchino e noci','crostino with raw ham, stracchino and walnuts'],
  ['crostino tonno e gorgonzola','crostino with tuna and Gorgonzola'],
  ['tagliere di affettati piccolo / grande','small / large charcuterie board'],
  ['toastone peperoni / funghi / carciofi','large toast with peppers / mushrooms / artichokes'],
  ['croissant vuoto / crema / albicocca / cioccolato','plain / custard / apricot / chocolate croissant'],
  ['chinotto / cedrata tassoni / acqua brillante 33 cl','Chinotto / Tassoni citron soda / sparkling soda 33 cl'],
  ['san bitter passion fruit o pompelmo e zenzero','San Bitter passion fruit or grapefruit and ginger'],
  ['gin tonic / gin lemon','Gin & Tonic / Gin Lemon'], ['vodka red bull / lemon / tonic','Vodka Red Bull / Lemon / Tonic'],
  ['pizza crudo / quattro formaggi / quattro stagioni / patatosa / adriatico','pizza with raw ham / four cheeses / four seasons / fries / seafood'],
  ['pizza cotto / funghi / carciofi / acciughe','pizza with ham / mushrooms / artichokes / anchovies'],
  ['bruschetta funghi / carciofi / cotto','bruschetta with mushrooms / artichokes / ham'],
  ['bruschetta crudo / porchetta e peperoni','bruschetta with raw ham / roast pork and peppers'],
  ['liquori e amari selezionati','selection of liqueurs and digestifs'],
  ['vecchia romagna / jägermeister / amaro del capo','Vecchia Romagna / Jägermeister / Amaro del Capo'],
  ['spaghetti pomodoro e basilico','spaghetti with tomato and basil'], ['spaghetti all’arrabbiata','spaghetti arrabbiata'],
  ['spaghetti alla carbonara','spaghetti carbonara'], ['tortellini panna e prosciutto','tortellini with cream and ham'],
  ['spaghetti al ragù','spaghetti with meat sauce'], ['mezze penne al salmone','mezze penne with salmon'],
  ['spaghetti ai frutti di mare','seafood spaghetti'], ['spaghetti alle vongole','spaghetti with clams'], ['risotto alla pescatora','seafood risotto'],
  ['cestino di pane e grissini','bread and breadstick basket'], ['cotoletta con patatine fritte','fried cutlet with French fries'],
  ['tiramisù con panna','tiramisù with whipped cream'], ['piadina con cioccolato','piadina with chocolate spread'], ['tartufo affogato','tartufo with coffee'],
  ['tartufo bianco / nero','white / dark chocolate tartufo'], ['insalatona imperiale','Imperiale salad'], ['insalatona sugar','Sugar salad'],
  ['caesar salad','Caesar salad'], ['insalata tonno','tuna salad'], ['insalata mista','mixed salad'], ['crudo e mozzarella','raw ham and mozzarella'],
  ['piadina cotto, fontina, pomodoro e salsa rosa','piadina with ham, Fontina, tomato and cocktail sauce'],
  ['piadina crudo, stracchino e rucola','piadina with raw ham, stracchino and rocket'], ['piadina porchetta e fontina','piadina with roast pork and Fontina'],
  ['piadina porchetta, fontina, sale e pepe','piadina with roast pork, Fontina, salt and pepper'],
  ['piadina vegetariana','vegetarian piadina'], ['piadina magra','light piadina'], ['piadina cotto e fontina','piadina with ham and Fontina'], ['piadina crudo e fontina','piadina with raw ham and Fontina'],
  ['panino crudo e mozzarella','raw ham and mozzarella sandwich'], ['panino cotto e fontina','ham and Fontina sandwich'], ['panino salame e fontina','salami and Fontina sandwich'], ['panino mortadella','mortadella sandwich'],
  ['panino cotoletta','fried cutlet sandwich'], ['hamburger sugar','Sugar burger'], ['spritz analcolico','non-alcoholic spritz'],
  ['aperitivo della casa analcolico','house non-alcoholic aperitif'], ['aperitivo della casa alcolico','house alcoholic aperitif'],
  ['caffè espresso / macchiato','espresso / espresso macchiato'], ['caffè d’orzo tazza grande','large barley coffee'], ['caffè ginseng tazza grande','large ginseng coffee'],
  ['caffè decaffeinato','decaffeinated coffee'], ['caffè shakerato','shaken iced coffee'], ['caffè americano','Americano coffee'],
  ['macchiatone decaffeinato','large decaf macchiato'], ['macchiatone d’orzo','large barley macchiato'], ['cappuccino decaffeinato','decaf cappuccino'],
  ['cappuccino d’orzo','barley cappuccino'], ['cappuccino al ginseng','ginseng cappuccino'], ['caffè marocchino','marocchino coffee'], ['caffè mocaccino','mocha coffee'],
  ['cioccolata calda con panna e biscotti','hot chocolate with whipped cream and biscuits'], ['cioccolata calda','hot chocolate'],
  ['zabaione caldo con panna e biscotti','hot eggnog with whipped cream and biscuits'], ['zabaione caldo','hot eggnog'],
  ['tè / camomilla / tisane con biscotti','tea / chamomile / herbal tea with biscuits'], ['tè / camomilla / tisane','tea / chamomile / herbal tea'],
  ['bicchiere d’acqua piccolo','small glass of water'], ['latte macchiato','latte macchiato'], ['latte caldo','hot milk'], ['caffè corretto','espresso with liqueur'],
  ['caffè speciale','special coffee'], ['caffè d’orzo','barley coffee'], ['caffè ginseng','ginseng coffee'], ['croissant al pistacchio','pistachio croissant'],
  ['succhi di frutta','fruit juices'], ['spremuta d’arancia','fresh orange juice'], ['acqua e menta','water with mint syrup'], ['acqua 50 cl','water 50 cl'],
  ['tè pesca / tè limone','peach / lemon iced tea'], ['patatine fritte piccole / grandi','small / large French fries'], ['nuggets con patatine','chicken nuggets with French fries'],
  ['polpettina di carne / verdure','meat / vegetable meatball'], ['polpetta di baccalà','codfish ball'], ['mozzarella in carrozza','fried mozzarella sandwich'],
  ['bruschetta margherita','Margherita bruschetta'], ['bruschetta salamino piccante','spicy salami bruschetta'], ['bruschetta sugar','Sugar bruschetta'],
  ['pizza margherita','Margherita pizza'], ['pizza diavola / tonno e cipolla','spicy salami / tuna and onion pizza'], ['pizza capricciosa / primavera','Capricciosa / Primavera pizza'], ['pizza sugar','Sugar pizza'],
  ['hot dog','hot dog'], ['hamburger','burger'], ['aggiunte','extras'], ['caffè','coffee'], ['affogato','with coffee'],
  ['bottiglia / calice','bottle / glass'], ['mezzo litro / un litro','half litre / one litre'], ['bottiglia','bottle'],
  ['prosciutto cotto','ham'], ['prosciutto crudo','raw ham'], ['salame caldo','hot salami'], ['salame piccante','spicy salami'], ['affettati','cold cuts'], ['crudo','raw ham'],
  ['formaggi misti','mixed cheeses'], ['mozzarella di bufala','buffalo mozzarella'], ['mozzarella','mozzarella'], ['fontina','Fontina'], ['stracchino','stracchino'], ['gorgonzola','Gorgonzola'], ['grana','Grana Padano'],
  ['patate fritte','French fries'], ['pomodori freschi','fresh tomatoes'], ['pomodoro a fette','sliced tomato'], ['pomodorini','cherry tomatoes'], ['pomodoro','tomato'],
  ['insalata mista','mixed salad'], ['insalata','salad'], ['carote','carrots'], ['tacchino','turkey'], ['porchetta','roast pork'], ['cotoletta','fried cutlet'], ['wurstel','frankfurter'],
  ['tonno','tuna'], ['acciughe','anchovies'], ['salmone','salmon'], ['frutti di mare','seafood'], ['vongole','clams'], ['baccalà','cod'], ['mazzancolle','prawns'], ['sarde','sardines'],
  ['funghi','mushrooms'], ['carciofi','artichokes'], ['peperoni','peppers'], ['cipolla','onion'], ['olive','olives'], ['noci','walnuts'], ['rucola','rocket'], ['prezzemolo','parsley'], ['sale','salt'], ['pepe','pepper'],
  ['crostini','croutons'], ['glassa balsamica','balsamic glaze'], ['salsa caesar','Caesar dressing'], ['salsa rosa','cocktail sauce'], ['maionese','mayonnaise'], ['miele','honey'],
  ['succo di mela','apple juice'], ['succo d’arancia','orange juice'], ['succo di mirtillo','blueberry juice'], ['fiori di sambuco','elderflower syrup'], ['spremuta d’arancia','fresh orange juice'],
  ['zucchero di canna','brown sugar'], ['rum bianco','white rum'], ['acqua tonica','tonic water'], ['lemon soda','lemon soda'], ['red bull','Red Bull'],
  ['sciroppo al cocco','coconut syrup'], ['succo d’ananas','pineapple juice'], ['succo di lime','lime juice'], ['gum nero','black gum syrup'],
  ['cioccolato','chocolate'], ['pistacchio','pistachio'], ['panna','cream'], ['biscotti','biscuits'], ['crema','custard'], ['albicocca','apricot'],
  ['farina','flour'], ['pane','bread'], ['uova','eggs'], ['carne','meat'], ['verdure','vegetables'], ['polenta','polenta'], ['cocco','coconut syrup'], ['zucchero','sugar'],
  ['liquore alla fragola','strawberry liqueur'], ['liquirizia','liquorice liqueur'], ['prosecco','Prosecco'], ['seltz','soda water'], ['limone','lemon'], ['lime','lime'], ['menta','mint'], ['arancia','orange'],
  ['ricetta segreta','secret recipe'], ['ingrediente a scelta','your choice of ingredient'], ['spina','draft'], ['piccola','small'], ['grande','large'],
  [' con ',' with '], [' e ',' and '], [' o ',' or ']
].sort((a,b) => b[0].length - a[0].length);

function english(value = '') {
  let result = value.toLowerCase();
  for (const [from, to] of translations) result = result.replace(new RegExp(`(?<![a-zà-ÿ])${from.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(?![a-zà-ÿ])`,'giu'), to);
  return result.charAt(0).toUpperCase() + result.slice(1);
}

const normalize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const label = category => categoryNames[category.id];
const itemText = item => ({name:item.nameEn || english(item.name), description:item.descriptionEn || english(item.description)});

const categoryAliases = {
  caffetteria:'caffe coffee cappuccino colazione breakfast', brioche:'brioche brioches croissant cornetto cornetti', succhi:'succo succhi juice juices spremuta spremute', bibite:'bibita bibite bevanda bevande drink drinks analcolico analcolici',
  'aperitivi-analcolici':'aperitivo aperitivi spritz analcolico analcolici', 'aperitivi-alcolici':'aperitivo aperitivi spritz alcolico alcolici', 'la-cantina':'cantina vino vini wine wines cellar',
  'liquori-amari':'liquore liquori amaro amari digestivo digestivi', cocktails:'cocktail cocktails drink drinks',
  'birre-bottiglia':'birra birre beer beers bottiglia bottiglie', 'birre-spina':'birra birre beer beers spina', toast:'toast toasts', piadine:'piadina piadine', panini:'panino panini sandwich sandwiches',
  'panini-speciali':'panino panini sandwich sandwiches hamburger burger hot dog', bruschette:'bruschetta bruschette', pizze:'pizza pizze pizza pizzas', antipasti:'antipasto antipasti starter starters',
  cicchetti:'cicchetto cicchetti snack snacks', 'piatti-freddi':'piatto piatti freddo freddi cold dish dishes', insalatone:'insalata insalate insalatona insalatone salad salads',
  'insalatone-speciali':'insalata insalate insalatona insalatone salad salads', primi:'primo primi pasta first course courses', secondi:'secondo secondi main course courses', dolci:'dolce dolci dessert desserts'
};

function distance(a, b) {
  const row = Array.from({length:b.length + 1}, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0]; row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const previous = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = previous;
    }
  }
  return row[b.length];
}

function wordMatches(queryWord, candidateWord) {
  if (candidateWord === queryWord) return true;
  if (queryWord.length < 4 || candidateWord.length < 4) return false;
  if (candidateWord.includes(queryWord) || queryWord.includes(candidateWord)) return true;
  if (queryWord.length >= 4 && candidateWord.length >= 4 && queryWord.slice(0,-1) === candidateWord.slice(0,-1)) return true;
  const tolerance = Math.max(queryWord.length, candidateWord.length) >= 7 ? 2 : 1;
  return Math.abs(queryWord.length - candidateWord.length) <= tolerance && distance(queryWord, candidateWord) <= tolerance;
}

function matches(query, text) {
  const cleanQuery = normalize(query.trim());
  const cleanText = normalize(text);
  if (!cleanQuery) return true;
  if ((cleanQuery.includes(' ') || cleanQuery.length >= 4) && cleanText.includes(cleanQuery)) return true;
  const queryWords = cleanQuery.split(/[^a-z0-9]+/).filter(Boolean);
  const candidateWords = cleanText.split(/[^a-z0-9]+/).filter(Boolean);
  return queryWords.every(queryWord => candidateWords.some(candidateWord => wordMatches(queryWord, candidateWord)));
}

function priceValue(item) {
  if (normalize(item.name) === 'aggiunte') return Number.POSITIVE_INFINITY;
  const value = item.price.match(/\d+(?:[,.]\d+)?/);
  return value ? Number.parseFloat(value[0].replace(',','.')) : Number.POSITIVE_INFINITY;
}

function byPrice(items) {
  const sort = values => values.map((item,index) => ({item,index})).sort((a,b) => priceValue(a.item) - priceValue(b.item) || a.index - b.index).map(entry => entry.item);
  if (!items.some(item => item.subsection)) return sort(items);
  const groups = new Map();
  items.forEach(item => { const key=item.subsection || ''; if(!groups.has(key))groups.set(key,[]); groups.get(key).push(item); });
  return [...groups.values()].flatMap(sort);
}

function formatName(value) {
  return value.replace(/\b(\d+(?:[,.]\d+)?)\s*(cl|ml|l)\b/gi, '<span class="quantity">$1 $2</span>');
}

function nameSignature(value) {
  return normalize(value).split(/[^a-z0-9]+/).filter(Boolean).sort().join(' ');
}

function usefulNameTranslation(italian, translated) {
  return nameSignature(italian) === nameSignature(translated) ? '' : translated;
}

function renderCard(item) {
  const translated = itemText(item);
  const translatedName = usefulNameTranslation(item.name, translated.name);
  return `<article class="menu-item"><h3>${formatName(item.name)}${translatedName ? `<small lang="en">${formatName(translatedName)}</small>` : ''}</h3><span class="price">${item.price}</span>${item.description ? `<p>${item.description}<small lang="en">${translated.description}</small></p>` : ''}</article>`;
}

function renderItems(items) {
  if (!items.some(item => item.subsection)) return `<div class="items">${items.map(renderCard).join('')}</div>`;
  const groups = new Map();
  items.forEach(item => { if(!groups.has(item.subsection))groups.set(item.subsection,{en:item.subsectionEn,items:[]}); groups.get(item.subsection).items.push(item); });
  return [...groups.entries()].map(([name,group]) => `<div class="menu-subsection"><h3>${name}<small lang="en">${group.en}</small></h3><div class="items">${group.items.map(renderCard).join('')}</div></div>`).join('');
}

function render(data, query = '') {
  const needle = normalize(query.trim());
  const sections = data.categories.map(category => {
    const categoryText = `${category.name} ${label(category)} ${categoryAliases[category.id] || ''}`;
    const categoryMatch = matches(needle, categoryText);
    return {...category, items:byPrice(category.items.filter(item => item.available !== false).filter(item => {
    const en = itemText(item);
    return categoryMatch || matches(needle, `${item.subsection || ''} ${item.subsectionEn || ''} ${item.name} ${item.description || ''} ${en.name} ${en.description || ''}`);
  }))}; }).filter(category => category.items.length);
  content.innerHTML = sections.map(category => `
    <section class="menu-section" id="${category.id}">
      <div class="section-heading"><h2>${category.name}<small>${label(category)}</small></h2></div>
      ${renderItems(category.items)}
    </section>`).join('');
  empty.innerHTML = 'Nessun risultato. Prova con un altro nome o ingrediente.<small class="en-copy" lang="en">No results. Try another name or ingredient.</small>';
  empty.hidden = sections.length > 0;
}

function buildMenu() {
  if (!menuData) return;
  const visibleCategories = menuData.categories.filter(category => category.items.some(item => item.available !== false));
  nav.innerHTML = visibleCategories.map((category, i) => `<button type="button" data-id="${category.id}" class="${i === 0 ? 'active' : ''}">${category.name}<small>${label(category)}</small></button>`).join('');
  document.querySelector('#allergen-list').innerHTML = menuData.allergens.map((value,i) => `<li>${value}<small class="en-copy" lang="en">${allergensEn[i]}</small></li>`).join('');
  render(menuData, search.value);
}

fetch('menu.json').then(response => response.ok ? response.json() : Promise.reject()).then(data => {
  data.categories = orderCategories(data.categories);
  menuData = data;
  buildMenu();
  search.addEventListener('input', event => {
    document.querySelectorAll('.category-nav button').forEach(item => item.classList.remove('active'));
    render(data, event.target.value);
    if (event.target.value.trim()) content.scrollIntoView({behavior:'smooth', block:'start'});
  });
})
  .catch(() => { content.innerHTML = '<p class="empty-state">Il menù non è disponibile in questo momento.<small class="en-copy" lang="en">The menu is currently unavailable.</small></p>'; });

nav.addEventListener('click', event => { const button=event.target.closest('button'); if(!button)return; document.querySelectorAll('.category-nav button').forEach(item=>item.classList.toggle('active',item===button)); document.getElementById(button.dataset.id)?.scrollIntoView({behavior:'smooth'}); });
document.querySelector('#allergen-button').addEventListener('click', () => dialog.showModal());
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if(event.target===dialog) dialog.close(); });
