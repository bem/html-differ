require('colors');

exports.log = function(diff, options) {

    options || (options = { showCharacters: 40 });

    var showCharacters = options.showCharacters;

    showCharacters = showCharacters >= 20 ? showCharacters : 40;

    var output = '';

    if (diff.length === 1 && !diff[0].added && !diff[0].removed) return output;

    diff.forEach(function(part) {
        var color = part.added ? 'green' :
                part.removed ? 'red' : 'grey',
            indexOfPart = diff.indexOf(part);

        if (color === 'red' || color === 'green') {

            output += (!indexOfPart ? '\n' : '') +  part.value[color];

            return;
        }

        if (part.value.length < showCharacters) {
            output += (indexOfPart > 0 ? '' : '\n') + part.value.grey;
        } else {
            indexOfPart > 0 && (output += part.value.substr(0, showCharacters / 2).grey);

            if (indexOfPart < diff.length - 1) {
                output += '\n...\n' + part.value.substr(part.value.length - Math.ceil(showCharacters / 2), Math.ceil(showCharacters / 2)).grey;
            }
        }
    });

    console.log('Differences:' + output);
}
