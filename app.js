// ! исх.реквизиты
// !
const maxCellsAmount = 100;
const cutWith = 0;
const variantsAmount = 1;
const billetsOrder = 'default';
const doubleCut = false;

// ! исх.хлысты
// !
const dataBilletsProfile = [1,1,1,1,2];
const dataBilletsAmount = [1,1,1,10,4];
const dataBilletsLength = [4500,5000,5200,6000,5960];

// ! исх.детали
// !
const dataDetailsId = [1,2,3,4,5,6,7,8];
const dataDetailsProfile = [1,1,1,1,1,1,2,2];
const dataDetailsComplect = ['100','100','101','101','002','003','800','800'];
const dataDetailsAmount = [2,2,2,2,4,4,2,2];
const dataDetailsLength = [1100,800,1200,950,1300,700,1500,1000];

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
const billets = [];
for (let i = 0; i < dataBilletsProfile.length; i++) {
  for (let a = 0; a < dataBilletsAmount[i]; a++) {
    var element = {
      id: i,      
      prof: dataBilletsProfile[i],
      len: dataBilletsLength[i],
      rest: dataBilletsLength[i],
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
for (let d = 0; d < dataDetailsId.length; d++) {
  for (let a = 0; a < dataDetailsAmount[d]; a++) {
    var element = {
      id: dataDetailsId[d],
      prof: dataDetailsProfile[d],
      len: dataDetailsLength[d],
      complect: dataDetailsComplect[d],
      cell: 0,
      cut: 0
    };
    details.push(element);
    if (doubleCut) {a++};
  } 
}
details.sort( (a,b) => (a.profile === b.profile) ? a.complectId - b.complectId: a.prof > b.prof );
//console.log(details);

const cuts = [ {cut:1, prof:details[0].prof} ];
maxCut = 1;
maxCell = 1;
details[0].cut = maxCut;
details[0].cell = maxCell;
for (let d = 1; d < details.length; d++) {    
    if (details[d].prof != details[d-1].prof) {
        maxCell = 1;
        maxCut++;  
        cuts.push({cut:maxCut, prof:details[d].prof}); 
    } else if (details[d].complect != details[d-1].complect) {
      maxCell++;
    };
    if ((maxCellsAmount > 0) && (maxCell > maxCellsAmount)) {
        maxCell = 1;
        maxCut++; 
        cuts.push({cut:curCut, prof:details[d].prof});    
    };         
    details[d].cell = maxCell; 
    details[d].cut = maxCut; 
};
//console.log(cuts);



  

// * создадим (и заполним) массив плана резки

var plans = [];

for (let cut = 0; cut < cuts.length; cut++) {
  
    // * лучший план в резке
    var bestCut = newCut();
    bestCut.billetAmount = 900000;
    bestCut.lastBilletRest = 6000;

     // * получим хлысты резки
    var locBillets = billets.filter(item => item.prof===cuts[cut].prof?true:false);

    // * построим <variantsAmount> планов резки, оставим лучший
    for (let variant = 0; variant < variantsAmount; variant++) {
        
        curCut = newCut(); 

        // * получим детали резки
        //var locDetails = deepCopy(details);
        let locDetails = details.filter(item => item.prof===cuts[cut].prof?true:false);
        shuffle(locDetails);

        // * разложим детали на хлысты
        if (doubleCut) {
            
        } else {
            var cutSucsess = false;
            for (let d = 0; d < locDetails.length; d++) {
                var cutSucsess = false;
                for (let b = 0; b < locBillets.length; b++) {
                    if ((locBillets[b].rest) - cutWith >= locDetails[d].len) {
                        locBillets[b].rest = locBillets[b].rest - cutWith - locDetails[d].len; 
                        locBillets[b].details.push(locDetails[d].id);
                        cutSucsess = true;
                        break;
                    }
                };  
                //if (!cutSucsess) {
                //  
                //    break;   
                //}        
            };
            //console.log(cutSucsess);
            if (cutSucsess) {
                // * сравним текущию раскладку с лучшей
                var billetAmount = 0;
                var lastRest = 0;
                for (let i = 0; i < locBillets.length; i++) {
                    //console.log(locBillets[i].rest,locBillets[i].len);
                    if (locBillets[i].rest != locBillets[i].len) {
                      billetAmount += 1;
                      lastRest = locBillets[i].rest;  
                      //console.log(billetAmount,bestCut.billetAmount,lastRest,bestCut.lastBilletRest);
                    }                  
                };
                changeBestCut = false;
                //console.log(bestCut);
                if (billetAmount < bestCut.billetAmount) {
                    changeBestCut = true;  
                }else if (lastRest < bestCut.lastBilletRest) {
                    changeBestCut = true; 
                };
                //console.log(changeBestCut);
                if (changeBestCut) {
                    bestCut.billetAmount = billetAmount;
                    bestCut.lastBilletRest = lastRest;
                    bestCut.plan = locDetails.slice().sort();
                    console.log(bestCut);
                };
                //// * добавим хлысты, на к-рых разложены детали, в план

            }    
        }
 


        
    };


}

//console.log(bestCut);

  