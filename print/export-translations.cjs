const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const stub = { addEventListener(){}, classList:{remove(){},toggle(){}}, setAttribute(){} };
const sandbox = {
  console,
  document:{ querySelector(){return stub;}, querySelectorAll(){return [];}, documentElement:{} },
  fetch(){return new Promise(()=>{});},
  globalThis:null
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
const source = fs.readFileSync(path.join(root,'app.js'),'utf8') + ';globalThis.__english=english;globalThis.__useful=usefulNameTranslation;';
vm.runInContext(source,sandbox);
const menu = JSON.parse(fs.readFileSync(path.join(root,'menu.json'),'utf8'));
const translations = {};
for (const category of menu.categories) {
  for (const item of category.items) {
    const name = sandbox.__english(item.name);
    translations[`${category.id}|||${item.name}|||${item.description || ''}`] = {
      name: sandbox.__useful(item.name,name) || '',
      description: item.description ? sandbox.__english(item.description) : ''
    };
  }
}
fs.writeFileSync(path.join(__dirname,'translations.json'),JSON.stringify(translations,null,2)+'\n');
