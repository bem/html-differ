exports.logDiff = function(diff) {
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

        if (part.value.length < 40) {
            output += (indexOfPart > 0 ? '' : '\n') + part.value.grey;
        } else {
            indexOfPart > 0 && (output += part.value.substr(0, 20).grey);

            if (indexOfPart < diff.length - 1) {
                output += '\n...\n' + part.value.substr(part.value.length - 20, 20).grey;
            }
        }
    });

    console.log('Differences:' + output);
}
