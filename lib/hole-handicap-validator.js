// usage: validateHoleHandicaps(handicaps)
//
// returns an array of errors
module.exports = function validateHoleHandicaps(handicaps) {
  var prev, parity, errors = [];

  for (var i = 0, il = handicaps.length; i < il; i++) {
    var handicapVal = handicaps[i];

    // nulls and empty strings are always valid
    // if (handicapVal == null || handicapVal === '') { continue; }

    // convert handicap to an integer
    handicap = +handicapVal;

    // ensure it's an integer
    if (handicap % 1 !== 0) {
      errors[i] = "Invalid number: " + handicapVal;
      continue;
    }

    // ensure it's within the right range
    if (handicap < 1 || handicap > 18) {
      errors[i] = "Handicap out of range";
      continue;
    }

    // ensure all handicaps have the same parity on a given side
    if (i % 9 === 0) { parity = null; }
    if (parity == null) { parity = handicap % 2; }
    if (handicap % 2 !== parity) {
      errors[i] = "Expecting handicap to be " + (parity ? "odd" : "even");
      continue;
    }

    // ensure handicaps are not repeated
    if (i % 9 === 0) { prev = []; }
    for (var j = 0, jl = prev.length; j < jl; j++) {
      if (handicap === prev[j]) {
        errors[i] = "Handicap already used at hole " + (j+1);
        break;
      }
    }
    prev.push(handicap);
  }

  return errors;
};
