const arrayRemove = require('./arrayRemove');
const arraySplice = require('./arraySplice');

const {isCommand} = require('./utils');

function traverse(source, model, variables = {}) {
    let newSource;
    if(Array.isArray(source)) {
        newSource = [...source];
        const operations = {};
        for(let modelKey in model) {
            if(isCommand(modelKey)) {
                // Get function return value except for $remove because $remove must act like map with each item sent to it.
                const input = (typeof model[modelKey] === 'function' && modelKey !== '$remove' ? model[modelKey](newSource) : model[modelKey]);
                if(modelKey === '$set') {
                    newSource = input;
                } else if(modelKey === '$push') {
                    newSource = [
                        ...newSource,
                        ...(Array.isArray(input) ? input : [input])
                    ];
                } else if(modelKey === '$unshift') {
                    newSource = [
                        ...(Array.isArray(input) ? input : [input]),
                        ...newSource
                    ];
                } else if(modelKey === '$remove') {
                    newSource = arrayRemove(newSource, input);
                } else if(modelKey === '$splice') {
                    newSource = arraySplice(newSource, input);
                }
            } else {
                operations[modelKey] = model[modelKey]; // save non-command operations/keys
            }
        }
        for(let modelKey in operations) {
            let tempSource = [];
            if(modelKey === '*') {
                for(let i = 0; i < newSource.length; i++) {
                    tempSource.push(
                        traverse(newSource[i], operations[modelKey], variables)
                    );
                }
            } else {
                for(let i = 0; i < newSource.length; i++) {
                    if(
                        i == modelKey || 
                        (modelKey[0] === '$' && typeof variables[modelKey] === 'function' && variables[modelKey](newSource[i], i)) || 
                        (newSource[i] && (newSource[i].id === modelKey || newSource[i]._id === modelKey))
                    ) {
                        tempSource.push(
                            traverse(
                                newSource[i],
                                typeof operations[modelKey] === 'function' ? operations[modelKey](newSource[i], i) : operations[modelKey],
                                variables
                            )
                        );
                    } else {
                        tempSource.push(newSource[i]);
                    }
                }
            }
            newSource = tempSource;
        }
    } else if(typeof source === 'object' && source !== null) {
        newSource = Object.assign({}, source);
        const operations = {};
        for(let modelKey in model) {
            if(isCommand(modelKey)) {
                const input = (typeof model[modelKey] === 'function' && modelKey !== '$unset' ? model[modelKey](newSource) : model[modelKey]);
                if(modelKey === '$set') {
                    newSource = input;
                } else if(modelKey === '$unset') {
                    const $unset = Array.isArray(model.$unset) ? model.$unset : [model.$unset];
                    for(let i = 0; i < $unset.length; i++) {
                        if(typeof $unset[i] === 'function') {
                            for(let j in newSource) {
                                if($unset[i](j, newSource[j])) {
                                    delete newSource[j];
                                }
                            }
                        } else {
                            delete newSource[$unset[i]];
                        }
                    }
                } else if(modelKey === '$merge') {
                    newSource = {
                        ...newSource,
                        ...input
                    };
                }
            } else {
                operations[modelKey] = model[modelKey];
            }
        }
        for(let modelKey in operations) {
            const tempSource = {};
            if(modelKey === '*') {
                for(let i in newSource) {
                    if(typeof newSource[i] === 'object' && !Array.isArray(newSource[i]) && newSource[i] !== null) {
                        tempSource[i] = traverse(newSource[i], model['*'], variables);
                    } else {
                        tempSource[i] = newSource[i];
                    }
                }
            } else {
                for(let i in newSource) {
                    if(
                        i == modelKey || 
                        (modelKey[0] === '$' && typeof variables[modelKey] === 'function' && variables[modelKey](newSource[i], i)) || 
                        (newSource[i] && (newSource[i].id === modelKey || newSource[i]._id === modelKey))
                    ) {
                        tempSource[i] = traverse(
                            newSource[i],
                            typeof model[modelKey] === 'function' ? model[modelKey](newSource[modelKey]) : model[modelKey],
                            variables
                        );
                    } else {
                        tempSource[i] = newSource[i];
                    }
                }
            }
            newSource = tempSource;
        }
    } else {
        newSource = model && model.$set ? model.$set : model;
    }
    return newSource;
}

module.exports = traverse;