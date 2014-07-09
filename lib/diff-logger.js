require('colors');

exports.log = function(diff, options) {

    var charsAroundDiff = options && options.charsAroundDiff || 20;

    if (diff.length === 1 && !diff[0].added && !diff[0].removed) return '';

    var output = '';

    diff.forEach(function(part) {
        var color = part.added ? 'green' :
                part.removed ? 'red' : 'grey',
            indexOfPart = diff.indexOf(part);

        if (color !== 'grey' || part.value.length < charsAroundDiff * 2) {

            output += (!indexOfPart ? '\n' : '') +  part.value[color];

            return;
        }

        indexOfPart && (output += part.value.substr(0, charsAroundDiff).grey);

        if (indexOfPart < diff.length - 1) {
            output += '\n...\n' + part.value.substr(part.value.length - charsAroundDiff, charsAroundDiff).grey;
        }
    });

    console.log('Differences:' + output);
}
