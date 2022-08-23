// ! исх.реквизиты
// !
const maxCellsAmount = 100;
const cutWith = 0;
const variantsAmount = 1000;
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

// * создадим массив хлыстов
var billets = [];
for (let i = 0; i < billetsDataProfile.length; i++) {
    const element = {
        id:i,
        profile: billetsDataProfile[i],
        amount: billetsDataAmount[i],
        length: billetsDataLength[i],
        rest: 0
     };
     billets.push(element);
}
if (doubleCut) {
    billets.sort((a,b) => (a.length > b.length));    
}
console.log(billets);

// * создадим массив деталей 
var details = [];
for (let i = 0; i < detailsDataId.length; i++) {
    const element = {
        profile: detailsDataProfile[i],
        amount: detailsDataProfile[i],
        length: detailsDataLength[i],
        complectId: detailsDataComplect[i],
        cell: 0,
        cut: 0
    };
    details.push(element);
}

details.sort( (a,b) => (a.profile === b.profile) ? a.complectId - b.complectId: a.profile > b.profile );

cuts = [ {cut:1, profile:details[0].profile} ];
curCut = 1;
curCell = 1;
details[0].cut = curCut;
details[0].cell = curCell;
for (let i = 1; i < details.length; i++) {    
    if (details[i].profile != details[i-1].profile) {
        curCell = 1;
        curCut += 1;  
        cuts.push({cut:curCut, profile:details[i].profile}); 
    } else if (details[i].complectId != details[i-1].complectId) {
        curCell += 1;
    };
    if ((maxCellsAmount > 0) && (curCell > maxCellsAmount)) {
        curCell = 1;
        curCut += 1; 
        cuts.push({cut:curCut, profile:details[i].profile});    
    };         
    details[i].cell = curCell; 
    details[i].cut = curCut; 
};
//console.log(details);
//console.log(cuts);


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
  

// ! создадим (и заполним) массив плана резки
// !
var plan = [];

for (let cut = 1; cut < curCut; cut++) {

    // * лучший план в резке
    var bestCut = [ {billetAmount: 0, billetRest: 0, plan: []} ] ; 

     // * получим хлысты резки
    var locBillets = billets.filter((element) => element.profile = cuts[cut].profile);
    locBillets.forEach(element => {
        element.rest = element.length;   
    });

    // * построим много планов резки, оставим лучший
    for (let variant = 1; variant < variantsAmount; variant++) {
        
        // * получим детали резки
        var locDetails = deepCopy(details);
        shuffle(locDetails);

        // * разложим 
        if (doubleCut) {
            
        } else {
            for (let d = 0; d < locDetails.length; d++) {
                var detailSucsess = false;
                for (let b = 0; b < locBillets.length; b++) {
                    if ((locBillets[b].rest) - cutWith >= locDetails[d].length) {
                        

                    } else {
                        
                    }
                    
                }
        
            };          
        }
 


        
    };


}


  

    


 
 //тзПланРезки[КодХлыста,ДлинаХлыста,ДеталиХлыста,Остаток]
 //тзДеталиХлыста[Код,КодВРезке,Длина,Ячейка]
    var billetPlan = {
        cut:0,
        billet:{
        billetId:0,
        billetLength:0,
        billetDetails:[],
        rest:0    
        }  
    }

  