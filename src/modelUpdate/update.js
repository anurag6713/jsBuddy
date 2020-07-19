const traverse = require('./traverse');

function update(source, model, variables = {}) {
    return traverse(source, model, variables);
}

module.exports = update;