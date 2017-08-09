var Promise = require('promise');

function toss() {
  var n = Math.floor(Math.random() * 6) + 1;
  return new Promise.resolve(n); // [1]
}

function threeDice() {
  var tosses = [];
  
  function add(x, y) {
    return x + y;
  }
  
  for (var i=0; i<3; i++) { tosses.push(toss()); }
  
  return Promise.all(tosses).then(function(results) { // [2]
    return results.reduce(add); // [3]
  });
}

function logResults(result) {
  console.log("Rolled " + result + " with three dice.");
}

function logErrorMessage(error) {
  console.log("Oops: " + error.message);
}

threeDice()
  .then(null, logErrorMessage)
  .then(logErrorMessage, logErrorMessage)
  .then(null, logErrorMessage);

  function ifHasGroup(someone) {
    someone.getTheGroup().then((grp)=> {
      if grp != "" return new Promise.resolve(grp);
      else return new Promise.resolve(null);
    })
  }

  function