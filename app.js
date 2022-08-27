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

function newCut(billetAmount=0, lastBilletRest=0) {
    return {
        billetAmount: parseInt(billetAmount), 
        lastBilletRest: parseInt(lastBilletRest), 
        plan: []
    }; 
}

// ! основной функционал
// !

// * создадим массив хлыстов
const billets = [];
for (let i = 0; i < dataBilletsProfile.length; i++) {
    for (let a = 0; a < dataBilletsAmount[i]; a++) {
        let element = {
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
let details = [];
for (let d = 0; d < dataDetailsId.length; d++) {
    for (let a = 0; a < dataDetailsAmount[d]; a++) {
        let element = {
          id: dataDetailsId[d],
        prof: dataDetailsProfile[d],
        len: dataDetailsLength[d],
        complect: dataDetailsComplect[d],
        cell: parseInt(0),
        cut: parseInt(0)
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



  

// * создадим (и заполним) массив плана резок <plans>
const plans = [];

for (let cut = 0; cut < cuts.length; cut++) {
  
    // * лучший вариант в резке
    let bestCut = newCut(999999,6000);

    // * получим хлысты резки
    let locBillets = billets.filter(item => item.prof===cuts[cut].prof?true:false);

    // * строим <variantsAmount> вариантов резки, помещая лучший из них в <bestCut>
    for (let variant = 0; variant < variantsAmount; variant++) {
        
        curCut = newCut(); 

        // * получим детали резки
        //let locDetails = deepCopy(details);
        let locDetails = details.filter(item => item.prof===cuts[cut].prof?true:false);
        shuffle(locDetails);

        if (doubleCut) {
            
        } else {
            
            // * разложим детали на хлысты в <locBillets>
            let cutSucsess = false;
            for (let d = 0; d < locDetails.length; d++) {
                cutSucsess = false;
                for (let b = 0; b < locBillets.length; b++) {
                    if ((locBillets[b].rest) - cutWith >= locDetails[d].len) {
                        locBillets[b].rest = locBillets[b].rest - cutWith - locDetails[d].len; 
                        //locBillets[b].details.push(locDetails[d].id);
                        locBillets[b].details.push(locDetails[d]);
                        cutSucsess = true;
                        break;
                    }
                }  
                if (!cutSucsess) {
                    break;   
                }        
            };
            //console.log(locBillets);
            //console.log(cutSucsess);
            if (cutSucsess) {
                // * сравним текущию раскладку <locBillets> с лучшей <bestCut>
                let locBilletsWithDetails = locBillets.filter(item => item.rest===item.len?false:true);
                let locBilletAmount = locBilletsWithDetails.length;
                //console.log(locBilletsWithDetails);                            
                if (locBilletAmount > 0) {
                    let locLastRest = locBilletsWithDetails[locBilletAmount-1].rest;
                    let changeBestCut = false;
                    //console.log(bestCut);
                    if (locBilletAmount < bestCut.billetAmount) {
                        changeBestCut = true;  
                    } else if (locLastRest < bestCut.lastBilletRest) {
                        changeBestCut = true; 
                    };
                    if (changeBestCut) {
                        bestCut.billetAmount = locBilletAmount;
                        bestCut.lastBilletRest = locLastRest;
                        bestCut.plan = locBilletsWithDetails;
                        bestCut.prof = cuts[cut].prof;
                        //console.log(bestCut);
                    }
                    // * добавим хлысты <locBilletsWithDetails> на к-рых разложены детали, в план <plans>
                    plans.push(bestCut);
                } 
            }    
        }
    }
}

console.log(plans);


  