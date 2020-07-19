const COMMANDS_LIST = ['$push', '$unshift', '$set', '$unset', '$splice', '$remove', '$merge'];
function isCommand(str) {
    return str && str[0] === '$' && COMMANDS_LIST.indexOf(str) > -1;
}

module.exports = {
    isCommand
};