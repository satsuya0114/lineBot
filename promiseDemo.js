function taskA (){
  return new Promise(function (resolve, reject) {
      setTimeout(function () {
          resolve('Async Hello world: A');
      }, 16);
  });
}

function taskB (){
  return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('Async Hello world: B');
        }, 8);
    });
}

function taskC (){
  return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('Async Hello world: C');
        }, 4);
    });
}


function documentReady(){
  // taskA().then(function(stringA){
  //   console.log(stringA);
  //   return taskB();
  // }).then(function(stringB){
  //   console.log(stringB);
  // });
  tackA().then(function(result){
    console.log(result);
  })
}

$(document).ready(documentReady);
