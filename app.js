// ! исх.реквизиты
// !
const maxCellsAmount = 100;
const cutWith = 0;
const variantsAmount = 1;
const billetsOrder = 'default';
const doubleCut = false;

// ! исх.хлысты
// !
const billetsDataProfile = [1,1,1,1];
const billetsDataAmount = [1,1,1,10];
const billetsDataLength = [4500,5000,5200,6000];

// ! исх.детали
// !
const detailsDataId = [1,2,3,4,5,6,7,8];
const detailsDataProfile = [1,1,1,1,1,1,2,2];
const detailsDataComplect = ['100','100','101','101','002','003','800','800'];
const detailsDataAmount = [2,2,2,2,4,4,2,2];
const detailsDataLength = [1100,800,1200,950,1300,700,1500,1000];

// !
// ! исх данные (выше) в этом файле генерируются программно


// ! служебные процедуры и функции 
// !

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

function newCut() {
    const result = {
        billetAmount: 0, 
        lastBilletRest: 0, 
        plan: []
    }; 
    return result;
}

// ! основной функционал
// !

// * создадим массив хлыстов
var billets = [];
for (let i = 0; i < billetsDataProfile.length; i++) {
  for (let a = 0; a < billetsDataAmount[i]; a++) {
    const element = {
      id:i,
      profile: billetsDataProfile[i],
      length: billetsDataLength[i],
      rest: billetsDataLength[i],
      details: []
    };
    billets.push(element);
  } 
}
if (doubleCut) {
    billets.sort((a,b) => (a.length > b.length));    
}
//console.log(billets);

// * создадим массив деталей 
var details = [];
for (let i = 0; i < detailsDataId.length; i++) {
  for (let a = 0; a < detailsDataAmount[i]; a++) {
    const element = {
      id: i,
      profile: detailsDataProfile[i],
      length: detailsDataLength[i],
      complectId: detailsDataComplect[i],
      cell: 0,
      cut: 0
    };
    details.push(element);
    if (doubleCut) {a += 1};
  } 
}

details.sort( (a,b) => (a.profile === b.profile) ? a.complectId - b.complectId: a.profile > b.profile );
//console.log(details);

const cuts = [ {cut:1, profile:details[0].profile} ];
maxCut = 1;
maxCell = 1;
details[0].cut = maxCut;
details[0].cell = maxCell;
for (let i = 1; i < details.length; i++) {    
    if (details[i].profile != details[i-1].profile) {
        maxCell = 1;
        maxCut += 1;  
        cuts.push({cut:maxCut, profile:details[i].profile}); 
    } else if (details[i].complectId != details[i-1].complectId) {
      maxCell += 1;
    };
    if ((maxCellsAmount > 0) && (maxCell > maxCellsAmount)) {
        maxCell = 1;
        maxCut += 1; 
        cuts.push({cut:curCut, profile:details[i].profile});    
    };         
    details[i].cell = maxCell; 
    details[i].cut = maxCut; 
};
//console.log(cuts);



  

// * создадим (и заполним) массив плана резки

var plans = [];

for (let cut = 1; cut < maxCut+1; cut++) {

    // * лучший план в резке
    var bestCut = newCut();

     // * получим хлысты резки
    var locBillets = billets.filter((element) => element.profile = cuts[cut].profile);
    
    // * построим <variantsAmount> планов резки, оставим лучший
    for (let variant = 0; variant < variantsAmount; variant++) {
        
        curCut = newCut(); 

        // * получим детали резки
        var locDetails = deepCopy(details);
        shuffle(locDetails);

        // * разложим детали на хлысты
        if (doubleCut) {
            
        } else {
            var cutSucsess = false;
            for (let d = 0; d < locDetails.length; d++) {
                var cutSucsess = false;
                for (let b = 0; b < locBillets.length; b++) {
                    if ((locBillets[b].rest) - cutWith >= locDetails[d].length) {
                        locBillets[b].rest = locBillets[b].rest - cutWith - locDetails[d].length; 
                        //console.log(locBillets[b].details);   
                        locBillets[b].details.push(locDetails[d].id);
                        cutSucsess = true;
                        break;
                    }
                };  
                if (!cutSucsess) {
                  
                    break;   
                }        
            };
            if (cutSucsess) {
                // * сравним текущию раскладку с лучшей
                var billetAmount = 0;
                var lastRest = 0;
                for (let i = 0; i < locBillets.length; i++) {
                    if (locBillets[i].rest != locBillets[i].length) {
                      billetAmount += 1;
                      lastRest = locBillets[i].rest;  
                    }                  
                };
                changeBestCut = false;
                if (billetAmount < bestCut.billetAmount) {
                    changeBestCut = true;  
                }else if (lastRest < bestCut.lastBilletRest) {
                    changeBestCut = true; 
                };
                if (changeBestCut) {
                    bestCut.billetAmount = billetAmount;
                    bestCut.lastBilletRest = lastRest;
                    bestCut.plan = locDetails.slice().sort();
                    //console.log(bestCut);
                };
                //// * добавим хлысты, на к-рых разложены детали, в план

            }    
        }
 


        
    };


}

//console.log(bestCut);

  