/**
 * @param {*} source 
 * @param {*} spliceInput 
 * 
    Example 1:
    $splice: [0, 10]  // Removes 10 items from 0
 
    Example 2: 
    $splice: [
        // Removes 1 item and adds 1 item
        [0, 1, {_id: 'NEWID1', name: 'NEW KID 1'}], 
        // Removes nothing but adds 2 items
        [1, 0, {_id: 'NEWID2', name: 'NEW KID 2'}, {_id: 'NEWID3', name: 'NEW KID 3'}] 
    ]
 */

function arraySplice(source, spliceInput) {
    if(!Array.isArray(spliceInput[0])) {
        spliceInput = [spliceInput];
    }
    let newSource = [...source];
    for(let i = spliceInput.length - 1; i >= 0; i--) {
        const [index = 0, howMany = 0, ...inserts] = spliceInput[i];
        const endIndex = index + howMany,
            remainingSource = [];
        let started = false;
        for(let j = 0; j < newSource.length; j++) {
            if(j === index) {
                started = true;
                for(let k = 0; k < inserts.length; k++) {
                    remainingSource.push(inserts[k]);
                }
            }
            if(j === endIndex) {
                started = false;
            }
            if(!started) {
                remainingSource.push(newSource[j]);
            }
        }
        newSource = remainingSource;
    }
    return newSource;
}

module.exports = arraySplice;