
const maxCellsAmount = 10;
const cutWith = 3;
const variantsAmount = 1000;
const billetsOrder = 'FromShortToLong';
const doubleCut = false;

const dataBilletsProfile = ['000002746','000002751'];
const dataBilletsAmount = [90,90];
const dataBilletsLength = [6000,6000];

const dataDetailsId = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72];
const dataDetailsProfile = ['000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002751','000002751','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746'];
const dataDetailsComplect = ['36','36','35','35','34','34','33','33','32','32','31','31','30','30','29','29','28','28','27','27','26','26','25','25','24','24','23','23','22','22','21','21','20','20','19','19','18','18','17','17','16','16','15','15','14','14','13','13','12','12','11','11','10','10','9','9','8','8','7','7','6','6','5','5','4','4','3','3','2','2','1','1'];
const dataDetailsAmount = [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2];
const dataDetailsLength = [1271,456,1271,456,1271,608,1271,721,1271,721,1271,646,1271,646,1454,637,1454,612,1311,461,1311,591,1311,576,1311,581,851,544,941,539,881,431,1131,441,1221,646,1221,529,1231,556,1921,521,1251,536,1421,651,1421,651,1421,651,1421,651,1291,384,1291,384,1421,651,371,571,1281,424,1281,424,1221,536,1221,536,1096,621,346,571];



function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]];
    }
} 

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
//console.log('billets:',billets);

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
details.sort( (a,b) => (a.prof === b.prof) ? a.complectId - b.complectId: a.prof > b.prof );
//console.log('details:',details);

let maxCut = 1;
let maxCell = 1;
const cuts = [ {cut:maxCut, prof:details[0].prof} ];
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
        cuts.push({cut:maxCut, prof:details[d].prof});    
    };         
    details[d].cell = maxCell; 
    details[d].cut = maxCut; 
}
//console.log('cuts:',cuts);
//console.log('details with cuts:',details);  

// * создадим (и заполним) массив плана резок <plans>
const plans = [];

for (let cut = 0; cut < cuts.length; cut++) {
  
    // * значения критериев лучшего варианта резки
    let bestCut = {}; 

    // * получим хлысты резки
    let locBillets = billets.filter(item => item.prof===cuts[cut].prof?true:false);
    if (billetsOrder === 'FromShortToLong') {
        locBillets.sort( (a,b) => a.len - b.len );
    };

    // * строим <variantsAmount> вариантов резки, помещая лучший из них в <bestCut>
    for (let variant = 0; variant < variantsAmount; variant++) {

        // * получим детали резки
        let locDetails = details.filter(item => item.prof===cuts[cut].prof?true:false);
        shuffle(locDetails);

        // * разложим детали на хлысты в <locBillets>
        let cutSucsess = false;
        if (doubleCut) {
            for (let d = 0; d < locDetails.length; d++) { 
                cutSucsess = false;
                for (let b = 0; b < locBillets.length; b+2) {
                    let rest = (locBillets[b].rest < locBillets[b+1].rest) ? locBillets[b].rest : locBillets[b+1].rest;
                    if (rest - cutWith >= locDetails[d].len) {
                        locBillets[b].rest = locBillets[b].rest - cutWith - locDetails[d].len; 
                        locBillets[b+1].rest = locBillets[b].rest - cutWith - locDetails[d].len; 
                        locBillets[b].details.push(locDetails[d]);
                        locBillets[b+1].details.push(locDetails[d]);
                        cutSucsess = true;
                        break;
                    }
                }    
                if (!cutSucsess) {
                    break; 
                }
            }
        } else {
            for (let d = 0; d < locDetails.length; d++) {
                cutSucsess = false;
                for (let b = 0; b < locBillets.length; b++) {
                    if ((locBillets[b].rest) - cutWith >= locDetails[d].len) {
                        locBillets[b].rest = locBillets[b].rest - cutWith - locDetails[d].len; 
                        locBillets[b].details.push(locDetails[d]);
                        cutSucsess = true;
                        break;
                    }
                }  
                if (!cutSucsess) {
                    break;   
                } 
                //console.log(cutSucsess,locBillets);       
            }
        };
        //console.log(locBillets);
        //console.log(cutSucsess);

        if (cutSucsess) {
            // * сравним текущию раскладку <locBillets> с лучшей <bestCut>
            let locBilletsWithDetails = locBillets.filter(item => item.rest===item.len?false:true);
            let locBilletAmount = locBilletsWithDetails.length;
            //console.log(locBilletsWithDetails);   
            //console.log(locBilletAmount);                         
            if (locBilletAmount > 0) {
                let locLastRest = locBilletsWithDetails[locBilletAmount-1].rest;
                let changeBestCut = false;
                //console.log(bestCut);
                if ('billetAmount' in bestCut) {
                    if (locBilletAmount < bestCut.billetAmount) {
                        changeBestCut = true;  
                    } else if (locLastRest < bestCut.lastBilletRest) {
                        changeBestCut = true; 
                    };
                } else {
                    changeBestCut = true;
                };
                //console.log(changeBestCut);
                if (changeBestCut) {
                    bestCut.billetAmount = locBilletAmount;
                    bestCut.lastBilletRest = locLastRest;
                    bestCut.plan = locBilletsWithDetails;
                    bestCut.prof = cuts[cut].prof;
                    bestCut.doubleCut = doubleCut
                    //console.log(bestCut);
                }
            } 
        }
    };
    // * добавим лучшую расладку <bestCut> в план <plans>
    if ('billetAmount' in bestCut) {
        plans.push(bestCut);
    }
} 

console.log('RESULT (plans):',plans);