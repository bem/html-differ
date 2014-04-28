require('colors');

exports.log = function(diff, interval) {
    interval.len = interval.len >= 10 ? interval : 10;

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

        if (part.value.length < interval.len) {
            output += (indexOfPart > 0 ? '' : '\n') + part.value.grey;
        } else {
            indexOfPart > 0 && (output += part.value.substr(0, interval.len / 2).grey);

            if (indexOfPart < diff.length - 1) {
                output += '\n...\n' + part.value.substr(part.value.length - Math.ceil(interval.len / 2), Math.ceil(interval.len / 2)).grey;
            }
        }
    });

    console.log('Differences:' + output);
}
