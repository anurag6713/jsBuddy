/**
 * 
 * @param {*} source 
 * @param {*} input 
    
    Examples:

    $remove: 0       // Removes index 0

    $remove: [0, 1]  // Removes index 0 & 1

    $remove: {       // Removes item with matching object value
        id: '100'
    }

    $remove: {       // Removes Array Item Matching object value
        id: function(value) {   
            retrun value === 100;
        }
    }

    $remove: 'randomId123' // Remove array item object with id / _id as randomId123

 */

function arrayRemove(source, input) {
    let newSource;
    if(typeof input === 'function') {
        newSource = [];
        for(let i = 0; i < source.length; i++) {
            if(!input(source[i])) {
                newSource.push(source[i]);
            }
        }
    } else {
        input = Array.isArray(input) ? input : [input];
        newSource = [...source];
        for(let i = input.length - 1; i >= 0; i--) {
            const key = input[i];
            if(!isNaN(key) && key !== null && newSource[key]) {
                newSource.splice(key, 1);
            } else {
                const tempSource = [];
                for(let i = 0; i < newSource.length; i++) {
                    let include = true;
                    if(newSource[i]) {
                        if(typeof key === 'object') { // support object values
                            include = false;
                            for(let prop in key) {
                                if(typeof key[prop] === 'function') {
                                    if(!key[prop](newSource[i][prop])) {
                                        include = true;
                                        break;
                                    }
                                } else if(key[prop] !== newSource[i][prop]) {
                                    include = true;
                                    break;
                                }
                            }
                        } else if(newSource[i].id === key || newSource[i]._id === key) { // support id
                            include = false;
                        }
                    }
                    include && (tempSource.push(newSource[i]));
                }
                newSource = tempSource;
            }
        }
    }
    return newSource;
}

module.exports = arrayRemove;