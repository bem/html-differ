require('colors');

exports.log = function(diff, options) {

    options = options || { showCharacters: 20 };

    var showCharacters = options.showCharacters;

    showCharacters = showCharacters > 0 ? showCharacters : 20;

    var output = '';

    if (diff.length === 1 && !diff[0].added && !diff[0].removed) return output;

    diff.forEach(function(part) {
        var color = part.added ? 'green' :
                part.removed ? 'red' : 'grey',
            indexOfPart = diff.indexOf(part);

        if (color !== 'grey') {

            output += (!indexOfPart ? '\n' : '') +  part.value[color];

            return;
        }

        if (part.value.length < showCharacters * 2) {
            output += (indexOfPart ? '' : '\n') + part.value.grey;
        } else {
            indexOfPart && (output += part.value.substr(0, showCharacters).grey);

            if (indexOfPart < diff.length - 1) {
                output += '\n...\n' + part.value.substr(part.value.length - showCharacters, showCharacters).grey;
            }
        }
    });

    console.log('Differences:' + output);
}
