// ! исх.реквизиты
// !
const maxCellsAmount = 100;
const cutWith = 0;
const variantsAmount = 1000;
const billetsOrder = 'default';
const doubleCut = true;

// ! исх.хлысты
// !
const billetsDataProfile = [1,1,1,1];
const billetsDataAmount = [1,1,1,10];
const billetsDataLenghth = [4500,5000,5200,6000];

// ! исх.детали
// !
const detailsDataId = [1,2,3,4,5,6,7,8];
const detailsDataProfile = [1,1,1,1,1,1,2,2];
const detailsDataComplect = ['100','100','101','101','002','003','800','800'];
const detailsDataAmount = [2,2,2,2,4,4,2,2];
const detailsDataLenghth = [1100,800,1200,950,1300,700,1500,1000];

// создадим массив хлыстов
var billets = [];
for (let i = 0; i < billetsDataProfile.length; i++) {
    const element = {
        id:i,
        profile: billetsDataProfile[i],
        amount: billetsDataAmount[i],
        lenghth: billetsDataLenghth[i]
     };
     billets.push(element);
}

// создадим массив деталей 
var details = [];
for (let i = 0; i < detailsDataId.length; i++) {
    const element = {
        profile: detailsDataProfile[i],
        amount: detailsDataProfile[i],
        lenghth: detailsDataLenghth[i],
        complectId: detailsDataComplect[i],
        cell: 0,
        cut: 0
    };
    details.push(element);
}

details.sort( (a,b) => (a.profile === b.profile) ? a.complectId - b.complectId: a.profile > b.profile );

curCut = 1;
curCell = 1;
details[0].cut = curCut;
details[0].cell = curCell;
for (let i = 1; i < details.length; i++) {    
    if (details[i].profile != details[i-1].profile) {
        curCell = 1;
        curCut += 1;   
    } else if (details[i].complectId != details[i-1].complectId) {
        curCell += 1;
    };
    if ((maxCellsAmount > 0) && (curCell > maxCellsAmount)) {
        curCell = 1;
        curCut += 1;    
    };         
    details[i].cell = curCell; 
    details[i].cut = curCut; 
};
//console.log(details);

// ! создадим массив плана резки
// !
var plan = [];
for (let cut = 1; cut < curCut; cut++) {
    const element = elementOfPlan(cut);
    
}

function deepCopy (obj) {

    if ('object' === typeof obj) {
      if (obj instanceof Array) {
        let length = obj.length
        let newObj = new Array(length)
        for (let i = 0; i < length; i++) {
          newObj[i] = (deepCopy(obj[i]))
        }
        return newObj
      } else {
        let newObj = {}
        if (obj.prototype) {
          newObj.prototype = obj.prototype
        }
        for (let key in obj) {
          newObj[key] = deepCopy(obj[key])
        }
        return newObj
      }
    }
    return obj
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]];
    }
  } 
  
function elementOfPlan(locCut) {
    // * получим хлысты резки
    const locBillets = deepCopy(Billets);
    shuffle(locBillets);
    for (let i = 0; i < locBillets.length; i++) {
        const element = locBillets[i];
        
    }


    // получим детали резки
 
 
 //тзПланРезки[КодХлыста,ДлинаХлыста,ДеталиХлыста,Остаток]
 //тзДеталиХлыста[Код,КодВРезке,Длина,Ячейка]
    const element = {
        billetId:0,
        billetLength:0,
        billetDetails:[],
        rest:0,    
    };  
    

    return element;
}