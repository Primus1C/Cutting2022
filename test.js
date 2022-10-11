
const maxCellsAmount = 11;
const firstCellsAmount = 3;
const cutWith = 3;
const variantsAmount = 1;
const billetsOrder = 'FromShortToLong';
const doubleCut = false;

const dataBilletsProfile = ['000002746','000002746','000002751'];
const dataBilletsAmount = [2,90,90];
const dataBilletsLength = [2000,6000,6000];

const dataDetailsId = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72];
const dataDetailsProfile = ['000002746','000002746','000002751','000002751','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002751','000002751','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002746','000002751','000002751','000002751','000002751','000002751','000002751'];
const dataDetailsComplect = ['36','36','35','35','34','34','33','33','32','32','31','31','30','30','29','29','28','28','27','27','26','26','25','25','24','24','23','23','22','22','21','21','20','20','19','19','18','18','17','17','16','16','15','15','14','14','13','13','12','12','11','11','10','10','9','9','8','8','7','7','6','6','5','5','4','4','3','3','2','2','1','1'];
const dataDetailsAmount = [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2];
const dataDetailsLength = [1271,456,1271,456,1271,608,1271,721,1271,721,1271,646,1271,646,1454,637,1454,612,1311,461,1311,591,1311,576,1311,581,851,544,941,539,881,431,1131,441,1221,646,1221,529,1231,556,1921,521,1251,536,1421,651,1421,651,1421,651,1421,651,1291,384,1291,384,1421,651,371,571,1281,424,1281,424,1221,536,1221,536,1096,621,346,571];



function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]];
    }
} 


function shuffleDetailsByComplects_(arrDetails) {
    let result = [];
    let arrComplects = [];
    arrDetails.forEach((item) => {
        if (arrComplects.includes(item.complect) === false) {
            arrComplects.push(item.complect)                
        }   
    });
    shuffle(arrComplects);
    //console.log('arrComplects',arrComplects);

    let order = 0;
    arrComplects.forEach((itemComplect,indComplect) => {
        if (indComplect % maxCellsAmount === 0) {
            order++;    
        };
        arrFinded = arrDetails.filter(item => item.complect===itemComplect?true:false);
        arrFinded.forEach((item) => {
            item.order = order;
            result.push(item);
        }); 
        
    });
    //result.sort((a,b) => a.order-b.order);
    //console.log('shuffleDetailsByComplects_',result);
    return result;
}        

function shuffledDetailsOfComplect(arrDetails, arrComplects, subCut) {
    const filterSet = new Set(arrComplects);
    const res = arrDetails.filter(item => filterSet.has(item.complect));
    shuffle(res);
    res.forEach(item=>{item.subcut = subCut})
    console.log('arrComplects',subCut,arrComplects);
    console.log('res',subCut,res);
    return res;
}


function subcuts(amountForCut, maxAmount, firstAmount=0) {
    let s = [];
    let secondAmount = maxAmount===0 ? amountForCut-firstAmount: maxAmount-firstAmount;
    let rest = amountForCut;
    let l = 0;
    if (firstAmount > 0) {
        if (maxAmount===0) {
            l = Math.min(firstAmount,rest);
        } else {
            l = Math.min(firstAmount,maxAmount,rest);
        };
        //console.log('l1=',rest,l);
        s.push(l);
        rest -= l;
    };
    l = Math.min(secondAmount,rest);
    s.push(l);
    rest -= l;
    while (rest > 0) {
        if (maxAmount===0) {
            l = rest;
        } else {
            l = Math.min(rest,maxAmount);
        };
        //console.log('l=',rest,l);
        s.push(l);
        rest -= l;
    };
    //console.log('s',s);
    return s;
}


// * создадим массив профилей
const profs = [];
dataDetailsComplect.forEach((item,ind) => {
    if (profs.find((v,i,a)=>(v.prof===dataDetailsProfile[ind] && v.complect===item)) == undefined) {
        profs.push({
            prof: dataDetailsProfile[ind], 
            complect: item
        }) 
    }       
});
profs.sort((a,b) => a.prof > b.prof);    
//console.log('profs',profs);


//* создадим массив схем
const chem = Array.from(new Set(dataDetailsProfile), (item,ind) => {
    let complects = profs.filter(it => it.prof===item);  
    return {
        prof: item,
        complects: complects.map((v,i)=>{return v.complect}),
        subcuts: []
    }
});
chem.forEach((item,ind) => {
    if (ind===0) {
        item.subcuts = subcuts(item.complects.length, maxCellsAmount, firstCellsAmount);
    } else {
        item.subcuts = subcuts(item.complects.length, maxCellsAmount, maxCellsAmount - chem[ind-1].subcuts.slice(-1));
    }
});
console.log('chem',chem);


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
};
if (doubleCut) {
    billets.sort((a,b) => a.len > b.len);    
};
billets.map((item,ind)=>{item.id=ind});
//console.log('billets:',billets);


// * создадим массив деталей
let details = [];
//let chem_ = [];
for (let d = 0; d < dataDetailsId.length; d++) {
    for (let a = 0; a < dataDetailsAmount[d]; a++) {
        let element = {
            id: dataDetailsId[d],
            prof: dataDetailsProfile[d],
            len: dataDetailsLength[d],
            complect: dataDetailsComplect[d],
            cell: parseInt(0),
            cut: parseInt(0),
            subcut: parseInt(0)
        };
        details.push(element);
        if (doubleCut) {a++};
    } 
}
details.sort( (a,b) => (a.prof === b.prof) ? a.complectId - b.complectId: a.prof > b.prof );
//console.log('details:',details);

// * создадим соответствие коплект-ячейка
const complectsCells = new Map();

const plans = [];

function Main_() {

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
            let locDetails = new Array();
                if (maxCellsAmount === 0) {
                    locDetails = details.filter(item => item.prof===cuts[cut].prof?true:false);
                    shuffle(locDetails);
                }
                else {
                    let tmpDetails = details.filter(item => item.prof===cuts[cut].prof?true:false);
                    shuffle(tmpDetails);
                    locDetails = shuffleDetailsByComplects_(tmpDetails); 
                };
            //console.log('locDetails:',locDetails);
    
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
            //console.log('locBillets',locBillets);
            //console.log(cutSucsess);
    
            if (cutSucsess) {
                // * сравним текущию раскладку <locBillets> с лучшей <bestCut>
                let locBilletsWithDetails = locBillets.filter(item => item.rest===item.len?false:true);
                let locBilletAmount = locBilletsWithDetails.length;
                //console.log('locBilletsWithDetails',locBilletsWithDetails);   
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
    }
    

function Main() {
    
    // * разбивка по профилям
    chem.forEach((itemChem,indChem) => {
        console.log('ПРОФИЛЬ ===========================================',itemChem.prof,':');
  
        // * значения критериев лучшего варианта резки
        let bestCut = {}; 

        // * получим хлысты резки
        let locBillets = billets.filter(item => item.prof===itemChem.prof);
        if (billetsOrder === 'FromShortToLong') {
            locBillets.sort( (a,b) => a.len - b.len );
        };
        //console.log('locBillets',locBillets)

        // * строим <variantsAmount> вариантов резки, помещая лучший из них в <bestCut>
        let lastCell = 1;
        for (let variant = 0; variant < variantsAmount; variant++) {

            // * получим комплекты и детали резки - <locChem>
            let locComplects = itemChem.complects.slice();
            shuffle(locComplects); 
            console.log('locComplects',locComplects);

            // * уст.соответствие комплект->ячейка
            let pairComplectCell = new Map();
            locComplects.forEach((item,ind) => {
                let cell = ind + lastCell;
                while (cell > maxCellsAmount) {cell -= maxCellsAmount};
                pairComplectCell.set(item,cell);
                console.log('set:',item,cell);
            });  
            console.log('pairComplectCell',pairComplectCell);
            details.forEach(item => {
                console.log('get:',item.complect,pairComplectCell.get(item.complect));
                item.cell = pairComplectCell.get(item.complect)            
            });

            locChem =[];
            locDetails = [];
            let num = 0;
            //let cell = 1;
            itemChem.subcuts.forEach((subcut,subcutInd) => {
                let arrC = [];
                for (let ind = 0; ind < subcut; ind++) {
                    arrC.push(locComplects[num]);
                    num += 1;                    
                    };
                arrD = shuffledDetailsOfComplect(details,arrC,subcutInd); 
                locChem.push({
                    complects: arrC,
                    subcut: subcutInd,
                    details: arrD
                });   
                locDetails = locDetails.concat(arrD);                 
            });     
            console.log('locChem '+itemChem.prof,locChem);
            console.log('locDetails',locDetails);

             // * разложим детали <locDetails> на хлыстах <locBillets>    
            let cutSucsess = false;
            if (doubleCut) {
                 /* for (let d = 0; d < locDetails.length; d++) { 
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
                 } */
            } else {
                let lastBilletOfSubcut = new Map();
                lastBilletOfSubcut.set(0,0);
                for (let d = 0; d < locDetails.length; d++) {
                    cutSucsess = false;
                    for (let b = 0; b < locBillets.length; b++) {
                        if ((locBillets[b].rest) - cutWith >= locDetails[d].len) {
                            const subcut = locDetails[d].subcut;
                            if (subcut===0  || lastBilletOfSubcut.get(subcut-1) <= b) {
                                locBillets[b].rest = locBillets[b].rest - cutWith - locDetails[d].len; 
                                locBillets[b].details.push(locDetails[d]);
                                cutSucsess = true;
                                lastBilletOfSubcut.set(subcut, b);
                                //console.log('detail subcat:',subcut,', billet:',b,', last billet:',lastBilletOfSubcut.get(subcut));
                                break;
                            };
                        }
                    }
                    //console.log('lastBilletOfSubcut',lastBilletOfSubcut)  
                    if (!cutSucsess) {break} 
                }
            };
            console.log('cut ok',cutSucsess,locBillets);             

            if (cutSucsess) {
                // * сравним текущию раскладку <locBillets> с лучшей <bestCut>
                let locBilletsWithDetails = locBillets.filter(item => item.rest===item.len?false:true);
                let locBilletAmount = locBilletsWithDetails.length;
                console.log('locBilletsWithDetails',locBilletsWithDetails);   
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
                        bestCut.prof = itemChem.prof;
                        bestCut.doubleCut = doubleCut
                        //console.log('bestCut',bestCut.prof,'added:',bestCut);
                    }
                } 
            }

        } 

        // * добавим лучшую расладку <bestCut> в план <plans>
        if ('billetAmount' in bestCut) {plans.push(bestCut)};

    });
    



console.log('RESULT (plans):',plans);

//return plans;




// * визуализация результата

let it ='';
plans.forEach((itemCut,indCut) => {
    
    it += `<h2>Резка ${indCut+1}: проф.${itemCut.prof}, остаток ${itemCut.lastBilletRest}</h2>`;
    
    //console.log('plan:',itemCut.plan);
    let lastSubCut = 0;
    itemCut.plan.forEach((itemP,indP) => {
        it += `<table class='page' border='1'><tr><td>№ ${indP+1}, S=${itemP.len}</td>`;
        //console.log('billet:',itemP); 
        //let lastSubCut = 0;
        itemP.details.forEach((itemD,indD) =>{
            if (lastSubCut!==itemD.subcut) {
                it += `<td bgcolor=pink frame=Vsides>${itemD.subcut+1}></td>`;
                lastSubCut = itemD.subcut;    
            };
            it += `<td><p1>${itemD.complect}->${itemD.cell}</p1>, <p2>id${itemD.id}</p2>, s=${itemD.len}, sub=${itemD.subcut}</td>`;
        });
        it += `<td bgcolor=silver>s=${itemP.rest}</td></tr></table>`;
    });
    document.querySelector(".page").innerHTML = it; 
});

}


Main();