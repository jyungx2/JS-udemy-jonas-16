'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// ⭐️ 255. Handling Rejected Promises
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  //   countriesContainer.style.opacity = 1;
};
///////////////////////////////////////////////

// 💀 251. Welcome to the callback hell.
const renderCountry = function (data, className = '') {
  const html = `<article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)}</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  //   countriesContainer.style.opacity = 1;
};

/*
const getCountryDataAndNeighbour = function (country) {
  // 1) using the XMLHttpRequest way of doing AJAX calls.
  // old school way of doing AJAX in Javascript!
  // -> 나중에 필요할 수도 있으니까 배우는 것.
  // -> how AJAX calls used to be handled with events and callback functions을 보여주기 위해.
  // => 이 두가지만 알고서는 Promise로 넘어갈 것.

  // AJAX call country 1
  const request = new XMLHttpRequest();

  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  request.send(); // we send off the request to the url above. => 비동기적으로 처리되는 업무 부분!! (being done in the background, while the rest of the code keeps running => Asynchrnous, Non-blocking behavior.)
  // 👉 여기서 우린 설정한 url 정보를 가져오고 싶다는 요청을 보냈고,
  // 밑에서 request에 대한 응답이 load 됐을 때, 이벤트리스너를 사용해 받아온 데이터를 변수로 저장해서 사용하겠다는 뜻!
  // 💫강의) basically we send off the request, and that request then fetches the data in the background. A nd then once that is done, it will emit the load event. so using thie event listeners, as soon as the data arrives, this callback function will be called.

  // 💥responseText: data가 도착했을 때만 사용가능한 속성이라, 여기서 불러오면 아무 것도 뜨지 않는다!!
  // console.log(request.responseText); // blank space..

  // data를 받아 사용하려면.. request 객체 상에 'load' 이벤트리스너를 사용해야함
  // 받은 문자열을 JS객체로 변환할 필요성✅

  request.addEventListener('load', function () {
    // 💥responseText: data가 서버로부터 도착했을 때만 사용가능한 속성
    // console.log(this.responseText);
    // => This is the result of our very first Ajax call!

    // ✨위의 this.responseText는 단지 JSON(=just a big string of text = 일반 문자열)이므로 이를 JS에서 이용하기 위해선 객체로 변환해주는 JSON.parse()함수를 이용해 객체로 바꿔야 한다.✨

    const [data] = JSON.parse(this.responseText);
    // console.log(data);

    // Render country 1
    renderCountry(data);

    // Get neighbour country (2)
    // const neighbour = data.borders
    // const neighbour = data.borders?.[0];
    const [neighbour] = data.borders;

    // Guard Clause
    if (!neighbour) return;

    // AJAX call country 2 (one callback inside of another callback)
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
    request2.send();

    // 💀 Inside of a callback function from request variable(object),
    // we're adding a new EventListener for the new request.
    request2.addEventListener('load', function () {
      const data2 = JSON.parse(this.responseText);
      console.log(data2);

      renderCountry(data2, 'neighbour'); // 두번째 매개변수 (className) 추가
      // 💀 만약, 계속해서 꼬리를 물면서 Neighbour country를 찾고 싶다면??
      // => callback hell로 빠지는 길이다..
    });
  });

  // CORS: Cross Origin Resources Sharing
  // 모든 공공 free API는 CORS = yes or unknown으로 가지는데,
  // 이 CORS 없이는, 3자의 API에 접근할 수 없다. (=origin이 다름에도 불구하고 접근할 수 있도록 yes로 설정해준 것 같다..)
};
*/

// we have 2 AJAX calls happening at the same time. (in paraelle)
// 이 함수는 새로고침할 때마다, 순서가 바뀌는 것을 볼 수 있는데(might appear in different order), 그 이유는 요청한 각각의 데이터가 우리가 페이지를 새롭게 로드할 때마다 다르게 도착하기 때문이다. (어쩔땐 Usa가 빠르게, 어쩔땐 portugal이 빠르게..)
// This realy shows the non-blocking behavior in action.
// 즉, getCountrData함수를 이용해 portugal에 대한 요청을 보낸 직후에 바로 usa에 대한 함수를 실행(=> 비동기 처리)한다. portugal에 대한 결과 데이터를 받지 않아도, 그 다음 함수를 ajax call로 불러온다.
// 따라서 코드 순서와 상관없이, "둘 중 어느 결과 데이터가 먼저 받아와지냐"에 따라 그 데이터가 먼저 Load 이벤트리스너에 의해 html상에 출력된다.

// ✨Test Area✨ (=> callback 안에 또 다른 콜백함수를 불러오는 작업 = callback hell을 구현하기 위해 getCountryDataAndNeighbour이라는 함수로 바꾸면서 없앰. 밑에서 fetch API 소개하면서 다시 나옴.)
// getCountryData('portugal');
// getCountryData('usa');

// ✨Test Area✨
// getCountryDataAndNeighbour('portugal');
// getCountryDataAndNeighbour('usa');

// 💀callback hell💀
// Since ES6, there's a way of escaping callback hell by using something called "promises".
/*
setTimeout(() => {
  console.log('1 second passed');
  setTimeout(() => {
    console.log('2 second passed');
    setTimeout(() => {
      console.log('3 second passed');
      setTimeout(() => {
        console.log('4 second passed');
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);
*/

// ⭐️ 252. Promises and the Fetch API
// const request = fetch('https://restcountries.com/v2/name/canada');
// console.log(request);

// Since promises work with asynchronous operations,
// they're time senstive (= they change over time.)
// so promises can be in different states and this is what
// we call the cycle of a promise.

// 💡 In the very beginning, we say that a promise is pending.
// 📌 <<PENDING>>
// : this is before any value resulting from the asynchrnous
// task is available. during this time, async task is still
// doing its work in the background.

// 💡 When the task finally finishes, we say that the promise is settled and there're two different types of settled promises and that's ✅fulfilled promises✅ and 💥rejected promises.💥
// 📌 <<SETTLED>>
// 📌 <fulfilled> : ex) when we use the promise to fetch data from an API,
// a fulfilled promise successfully gets that data, and it's now available to being used.
// 📌 <rejected> : there has been an error during the asynchronous task.
// ex) when the user is offline and can't connect to the API server.

// IMPORTANT 2 THINGS
// 1. when we use promises in our code, we'll be able to
// handle these different states(Fulfilled / Rejected) in order to do something as a result of either a successful promise or a rejected one.

// 2. Promise is only settled once. Therefore, the state will remain unchanged forever. So the promise was either fulfilled or rejected, but it's ❌impossible to change❌ that state.

// 3. Those different states(fulfilled&rejected) are relevant and useful when we use a promise to get a result, which is called, to consume a promise.
// promise를 consume하려면, 일단 promise를 build 해야겠지!!
// ✨예외적으로 fetch API의 경우엔, 이 자체가 promise를 리턴하기 때문에 굳이 build할 필요 없이 promise를 Consume 가능! => In this case, we don't have to build the promise ourselves in order to consume it.
// 하지만 대부분의 경우에도 이렇게 fetch API처럼 promise를 직접 생성할 필요 없다!!
// 그냥 promise를 굳이 만들지 않고, 소비가 가능한 경우가 훨씬 많다... easier and more useful part.

// ⭐️ 253. Consuming promises
// fetch function에 의해 리턴된 프로미스를 consume하는 법을 배울 것이다.
// const request = fetch('https://restcountries.com/v2/name/canada');
// console.log(request); // Promise 리턴 [PromiseState]: 'fulfilled'

/*
// 🍀 10/9 복습
const getCountryData2 = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(
      response => {
        console.log(response);
        return response.json();
      }
      // Resoponse {...} body:ReadableStream ... body부분에 있는 실질적인 결과데이터를 가져오기 위해선 json()메서드를 사용해야 한다. json()는 fetch()로부터 발생한 모든 객체, 즉 resolved data(=response)상에서 사용가능한 메서드이며, 이것 또한 asynchrnous 함수로서, 새로운 promise를 리턴한다. (조나스가 이해할 수 없는 부분.. 그냥 받아들이자)
      // 새로운 Promise를 핸들링하기 위해 또다른 then()를 불러올 수 있다.
    )
    .then(function (data) {
      console.log(data);
      renderCountry(data[1]); // data = response.json() >>> body 부분의 데이터를 받음. [{...}] => array안에 하나의 데이터만 있으므로, [0]을 붙여준다.
      //
    });
};
getCountryData2('korea'); // [{...}, {...}] => [{북한}, {남한}]
*/

// 1. fetch: return a new Promise
// 2. then: to handle a Promise from Fetch API
// 3. json(): to read actual data from body of the resolved data & also return a new Promise

// ✅ Detailed version
/*
const getCountryData = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(function (response) {
      console.log(response);
      // 👉 컨솔 상에서 확인해보면, 실질적으로 데이터가 저장되어 있는 body 속성이 ReadableStream이라고만 나와있고, 데이터는 볼 수 없다.
      // 여기서 우리는 json 메서드(fetch 함수의 모든 response(=resolved value)상에서 사용가능)를 사용하여 가져올 수 있다.
      // 🚨 여기서 문제는, json() 메서드 또한 asynchronous 함수라는 것이다.
      // 이말인 즉슨, json() 또한 새로운 promise를 리턴한다는 뜻이다.
      return response.json(); // this will be a new Promise. so we need to handle this promise as well (=then() 메서드 사용하기)
    })
    .then(function (data) {
      console.log(data); // json()메서드로 인해 리턴된 새로운 promise로부터 결과 데이터값을 받기 위해 또 then() 메서드 사용
      renderCountry(data[0]);
    });
};
*/

// 📌 fetch function will immediately return a promise.
// 모든 promise상에서 우리는 데이터를 가져오는 then 메서드를 쓸 수 있으므로, fetch함수 뒤에 바로 chainable하게 then 메서드 사용 가능!
// then 메서드 안에는 콜백함수를 써넣어야 하는데, 이는 Promise가 fulfilled되자마자
// 실행되는 함수이다. (As soon as it's available, the callback f is executed.)
// 이때, 콜백함수의 매개변수는 결과 데이터(=response)로서, AJAX call의 response이다.

/*
// ✅ Highly-simplified version => cleaner and nicer than using XMLHttpRequest() method and detailed version which doesn't use an arrow function.
const getCountryData = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`) // 1️⃣ fetches something
    .then(response => response.json()) // 2️⃣ we get a response which will be transformed to json.
    .then(data => renderCountry(data[0])); // 3️⃣ take that data and render the country to the DOM.
};
*/
// => But we're still using callbacks here,
// Promise는 callback hell을 피할순 있지만, 콜백함수 자체는 써야 한다!!

// ⭐️ 254. Chaining promises
// 사실, 위에서 fetch function과 json()메서드 모두 새로운 Promise를 리턴한다고 했는데,
// then 메서드 또한 새로운 프라미스를 리턴한다! (이때, 실제로 리턴할지 말지는 상관 ❌)
// 만약 값을 리턴하면, 그 밸류는 리턴되는 프라미스의 Fulfillment value가 될 것 => 🥒

// 👉 어쨌든 우리가 알아야 할 것은 then() 메서드는 새로운 promise를 리턴하기 때문에, then() 상에서 계속해서 원하는 데이터를 끝까지 받아내기 위해 then()를 줄줄이 소시지처럼 원하는만큼 쓸 수 있다는 것!!
// 만약 우리가 어떤 나라의 이웃의 이웃의 이웃을 알고 싶다면, 이런식으로 계속해서 모든 Promise들의 chaining을 통해 최종적으로 원하는 데이터를 끄집어 낼 수 있다!
// Instead of callback hell, we have what we call a flat chain of promises. (very easy to understand and read..)
// 콜백헬은 콜백함수 안에 또다른 콜백함수, 그 안에 또 콜백함수...가 계속 반복되는 구조인데,
// 여기서는 그냥 플랫하게! 누구 하나 종속되는 관계가 아닌, ✨then() 메서드가 new Promise를 리턴하는 것✨을 이용해 계속해서 데이터 값을 뽑아내고 있다.
// Always return Promise and handle it outside by simply continuing the chain like this.

// 어떤 컨트리를 뽑아냄과 동시에 그의 negihbour 컨트리를 같이 뽑아내고 싶을 때...
// => callback function 사용 해야 함!!
// 더 나아가 만약에 이웃의 이웃의 이웃까지 뽑아내고 싶다면, 계속해서 Then()를 사용해 뻗어나가면 됨!
// 🍀 10/9 복습
/*
const getCountryData3 = function (country) {
  // Country 1
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(response => response.json())
    .then(data => {
      renderCountry(data[1]);

      // Country 2
      const neighbour = data[0].borders[0];
      if (!neighbour) return;
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then(response => response.json())
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => alert(err)) // then()에서 에러를 다루는 것보다 프로미스 체인 어디서 발생한 에러이든 전역적으로 캐치할 수 있는 catch()하나 써주는게 이득!! & catch() also returns a new Promise.
    .finally(() => {
      countriesContainer.style.opacity = 1;
    }); // so we can use finally() after catch() on which return a new Promise.
};
console.log(getCountryData3('korea'));
*/

/*
// 🍅 256. Throwing Errors Manually
// 아래처럼 catch()와 특정 에러 메시지를 throw 키워드를 사용해 설정하는 것은 매우 좋지만, 함수를 만들 때마다 이러한 긴 코드를 작성하는 것은 bad practice!
// 이럴땐 맨날 하던듯이 또다른 함수로 빼서 그 함수를 불러오도록 하자...
// getCountryDataCopy 함수 주목!
const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`${errorMsg} (${response.status})`);
    }
    return response.json();
  });
};

// 🍀 getCountryData와 동일한데, 위의 getJSON함수 이용한 version.
const getCountryDataCopy = function (country) {
  // Country 1
  // example 1) getCountryData('dsdflsfjaslj');
  // => 유저에게 Country not found라는 오류 메시지를 보이도록...
  getJSON(`https://restcountries.com/v2/name/${country}`, 'Country Not Found')
    .then(data => {
      renderCountry(data[1]);

      const neighbour = data[0].borders[0];
      // example 2) getCountryData('australia');
      // => 호주같이 주변 이웃국가가 없는 경우(neighbour = undefined), 이 경우에도 역시 cannot read property 'flag' of undefined라고 뜨는데, 이것보단 유저에게 직관적으로 에러를 알릴 수 있는 다음과 같은 에러메시지("No neighbour found!")를 제공하는 것이 훨씬 좋다.
      if (!neighbour) throw new Error('No neighbour found!');

      // Country 2
      return getJSON(
        `https://restcountries.com/v2/alpha/${neighbour}`,
        'Country Not Found'
      );
      // cannot read property 'flag' of undefined
    })
    .then(response => response.json())
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.log(`${err} 💥💥💥`);
      renderError(`Something went wrong💥💥 ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
*/

// 🍀 10/9 복습
// Always use catch! (if necessary, use finally())
// : 에러메시지는 유저들한테 별로 중요하지도 않아 보이는데, 이렇게까지 해야하나??
// 1. 이렇게 에러를 핸들링하는 것은 유저에게 적절한 에러메시지를 보여주는 유일한 방법이다. (유저들은 어떤 부분에서 오류가 났는지 알아야한다!!)
// 2. rejected promises들에 대해 아무런 조치를 취하지 않고, 내비두는 것은 매우 좋지 않은 프랙티스다.
/*
const getCountryData = function (country) {
  // Country 1
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(response => {
      console.log(response);
      if (!response.ok) throw new Error(`Country not found ${response.status}`);
      // 👉 throw : immediatley terminate the current function and will propagate down to the catch method.. => 현재 함수는 즉시 종결되고, ${err.message} 부분에 삽입되어 출력됨. => 우리가 원하는 에러메시지 매뉴얼리하게 출력 가능!!
      return response.json();
    })
    .then(data => {
      renderCountry(data[1]);

      const neighbour = data[0].borders[0];
      if (!neighbour) return;

      // Country 2
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then(response => response.json())
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.log(`${err} 💥💥💥`);
      renderError(`Something went wrong💥💥 ${err.message}. Try again!`);
    }) // then()에서 에러를 다루는 것보다 프로미스 체인 어디서 발생한 에러이든 전역적으로 캐치할 수 있는 catch()하나 써주는게 이득!! & catch() also returns a new Promise.
    .finally(() => {
      countriesContainer.style.opacity = 1;
    }); // so we can use finally() after catch() on which return a new Promise.
};
*/

// 🍀 ex1) 에러메시지가 잘 작동하는지 테스트해보기 (유저친화적인 에러메시지를 매뉴얼리하게 설정할 수 있는 방법 배움.)
// getCountryData('dsdflsfjaslj');
// (🚨) Something went wrong💥💥 "Cannot read property 'flag' of undefined" Try again!
// 이건 ❌true error❌가 아니다!! (this happens our API cannot find any country)
// => 에러가 발생한 이유는, 우리의 API가 다음과 같은 country name('dsdflsfjaslj')을 찾지 못했다는 점에서 발생한건데, 엉뚱하게 다른 원인 때문에 발생했다고 지껄임! => 이러한 이유는 fetch promise가 rejected되지 않고, 그냥 Fulfilled된 상태로 남게되는 동작원리 때문...(왜이렇게 동작하는지 모름, 조나스도 의문)

// 참고로, 컨솔창에 GET ~~~~코드에서 404도 위의 에러와 같이 뜨는데, 이 404가 country name을 찾지 못했다는 점을 Reflected하고 있음... 근데 이 404는 fetch promise에서 여전히 Fulfilled된 상태를 뜻하기 때문에 위의 cannot read property 'flag' of undefined로 나온것.
// 🎃 우리는 유저에게 이 이름이 👉정확한 나라이름이 아니라는👈 에러메시지를 전달하고 싶기 때문에 이걸 핸들링할 수 있는 개념을 배울 예정.

// ⭐️ 255. Handling Rejected Promises (= how to handle error, pretty common scenario when we work with Promsie and especially with AJAX calls)

// 사실 Fetch Promise로부터 값이 못받아지는 경우는, user가 인터넷 연결을 하지 못했을 때 뿐이다.
// 👉 우리가 다뤄야 할 에러 사항은 이것뿐!
// 💥💥💥 264. Error handling with try...catch 💥💥💥 에서 중요하게 짚고 넘어가야 되는, 내가 놓쳤던 개념...
// 이걸 돌려서 말하면, fetch 함수로 HTTP요청을 보냈을 때, 네트워크 요청 자체가 성공하면 promise는 무조건 fulfilled상태로 간주된다. 즉, 서버에서 404, 500등의 에러상태 코드가 반환되어도, 네트워크 요청 자체는 성공적으로 처리되었기 때문에, promise는 여전히 성공상태로 반환된다. 이때문에 fetch()에서 에러를 직접 던져주지 않으면, catch 블록에서 에러를 감지하지 못하게 되는 것......
// => fetch는 내가 서버로부터 데이터를 fetch해왔냐 안해왔냐 이 여부만 판단하지, 그 데이터가 실제로 존재하냐, 진짜 유효한 데이터를 가져왔냐 이것까지 판단해서 promise를 reject시키지 않는다..
// 인터넷 연결이 끊겨서 fetch해오지 못했을 때!!만 비로소 Promis가 rejected된 상태로 되고, catch 블록에서 에러가 처리된다.

// 🚨offline으로 돌렸다가 click 하게 되면 에러 발생🚨
// 에러내용: Uncaught (in promise) TypeError: Failed to fetch
// >>> 해결방법 <<<
// 1) 🧞‍♂️then()의 두번째 매개변수로서, 다음과 같이 에러가 발생하게 되면(when the Promise is rejected) 실행될 콜백함수 지정 => alert(err)라고만 써줘도, 브라우저 창 자체가 Offlin으로 변하지 않고, alert창이 띄워지면서 에러를 핸들링(catching)할 수 있게 된다.🧞‍♂️
// * error를 핸들링하는 것을 Catch한다고도 표현함. 컨솔창에 뜨는 에러를 잡아서 없애버리기 때문 ㅎㅎ
// .then(
//     response => response.json(),
//     err => alert(err)
//   )
// ✅ 깡쌤한테 배운 것
function myFun3(num) {
  // retrun new Promise(깡쌤) = fetch API (조나스)
  return new Promise((resolve, reject) => {
    if (num > 0) resolve(num * num);
    else reject('0보다 큰수를 지정하세요..');
  }).then(
    value => console.log(`result : ${value}`), // will be only executed when the promise was fulfilled, so for successful promise.
    error => console.log(error) // => will be executed when the promise was rejected.
  );
}
myFun3(10); // ⬆️ result : 100
myFun3(-1); // ⬆️ 0보다 큰수를 지정하세요..

// 2) 🧚‍♀️더 나은 방법이 존재함🧚‍♀️
// 위의 then()에서 에러를 캐치하는 것은, 한 함수 내에서 글로벌리하게 에러를 캐치할 수 가 없으므로, 마지막에 catch() 하나만을 이용해 전역적으로 에러메시지를 핸들링할 수 있는 것이 코드 가독성면에서도 굿.
// then()의 매개변수로 추가하는 것이 아닌, catch()메서드를 사용하는 것!
// btn.addEventListener('click', function () {
//   getCountryData('germany');
// });

// getCountryData('australia');

// <10/8 깡쌤 오버뷰>
// ✅ 세션스토리지 - '창' 단위로 저장, 영속적이지 않아 창이 닫히면 데이터도 같이 사라진다.
// 로컬스토리지 - '오리진' 단위로 같이 이용할 수 있고, 영속적이다. 브라우저가 종료됐다 하더라도 사라지지 않음.
// <a>는 해당 안되고, window.open()을 이용해 여는 차일드 창에 한해서만, 복제가 가능.

// ✅ storage event listener는 어떤 데이터를 변경하는 것을 감지할 수 있다.
// 세션 스토리지는 창이 다르면 데이터도 다르기 때문에, 의미가 없지만 <iform>은 예외.

// 🎃 256. Throwing Errors Manually
// request 404 error를 고치는 방법을 알아보자.
// 이 에러는 API가 이 매개변수와 매치되는 나라 이름을 찾지 못했기 때문에 발생한 것이다.
// 근데 fetch 함수는 이 경우에도 reject되지 않고, 오히려 fulfilled된 상태이다!
// 상식대로라면 fetch()함수의 결과를 얻지 못하면 바로 리젝되야 하는게 맞다고 생각되지만,
// 현실은 그렇지 않다..ㅎ => 💥우리가 매뉴얼리하게 핸들링해줘야 하는 부분!!!💥

///////////////////////////////////////////////////
// Coding challenge #1
// * My api key: 428256506246586962931x104466
/*
// ⭐️ Use the fetch API and promises to get the data.
const whereAmI = function (lat, lng) {
  fetch(
    `https://geocode.xyz/${lat},${lng}?geoit=json&auth=428256506246586962931x104466;`
  )
    .then(response => {
      if (!response.ok)
        throw new Error(
          `You're loading too fast! (${response.status}) Too many requests, Try again later.`
        );
      return response.json();
    })
    .then(data => {
      const city = `${data.city[0]}${data.city.slice(1).toLowerCase()}`;
      console.log(`You are in ${city}, ${data.country}`);
    })
    .catch(error => console.log(error));
};
// Response {body : ReadableStream, headers: Headers, ok: true, status: 200 ...}

// ⭐️ Test Data
whereAmI(52.508, 13.381);
// You are in Mumbai, India
whereAmI(19.037, 72.873);
// You are in Berlin, Germany
whereAmI(-33.933, 18.474);
// You are in Cape town, South Africa
*/

// 259. Event Practice
console.log('Test start');
setTimeout(() => console.log('0 sec timer'), 0); // 👉 callback queue..
// .resolve() allows us to build a promise, so to create a promise that is immediately resolved(one that has a successful value). => fuilfilled, success value is gonna be '매개변수' of resolve() method.
Promise.resolve('Resolved promise 1').then(res => console.log(res));
// 👉 microtasks queue.. -> should be executed first than the callback in just regular callback queue.

// 오랜 시간 걸리는 micro-task(Promise)를 만들어놓으면, timer가 아무리 0초 후에 실행되어야 하는 코드라도, 딜레이 되기 마련! => 무조건 Micro-task가 끝난 다음에 실행된다.
// Promise.resolve('Resolved promise 2').then(res => {
//   for (let i = 0; i < 10000; i++) {
//     console.log(res);
//   }
// });
console.log('Test end');

// Code outside of any callbacks will run first!
// <실행 결과>
// Test start
// Test end
// Resolved promise 1 => microtask는 일반 콜백 함수보다 먼저 실행되는게 원칙 ㅎㅎ
// 0 sec timer => No guarantee..

/*
// 260. Building a Simple Promise
// promise constructor이 실행되자마자, 두 개의 매개변수를 받는 executor function을 실행시킨다.
// 이 executor function은 프로미스로 처리할 비동기적인 업무를 포함한다. => 값을 리턴한다.
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log(`Lottery draw is happening 🔮`);

  // 📌 Promisifying the setTimeout function (1)
  // Timer: we did actually encapsulate some asynchronous behavior into this Promise. This is how we encapsulate any asynchronous behavior into a promise!
  // we usually only build promises to wrap old callback based functions into promises. => This is a process that we call promisifying.
  // 💫 Promisifying: convert "callback based" asynchronous behavior to "promise based".
  // 콜백 베이스의 비동기 동작을 Promise로 변환하면 좀 더 직관적이고 코드 흐름을 관리하기 쉬워집니다. 이를 Promisify 한다고 하며, 주로 콜백 헬(callback hell)을 방지하고, 코드를 더 가독성 있게 만들기 위해 사용됩니다.
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      // To set the promise as fulfilled, we use resolve function.
      // resolve에 들어가는 변수는 무조건 promise의 결과값이 될 것. 이는 then()으로 핸들 가능.
      resolve('You WIN 💰');
    } else {
      reject('You lost your money 💩');
    }
  }, 2000);
});

// we created an executor function which is gonna be called by this promise constructor as soon as it runs.
// The promise calls this executor function and passes in the resolve and reject functions so that we can then use them to mark the promise as either resolved so as fulfilled or as to rejected.
// The promise is gonna move to either fulfilled state or rejected state.

// 👉 Consuming the promise
lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));
// resolve() => 매개변수에 해당하는 부분이 then의 매개변수로.. (=res)
// reject() => 매개변수에 해당하는 부분이 catch의 매개변수로.. (=err)
// Promisifying의 장점:
// 콜백 헬 방지: 여러 개의 비동기 작업을 중첩된 콜백으로 처리하다 보면 코드가 지저분해지고 유지보수가 어려워집니다. 이를 Promise로 변환하면 .then() 체인을 사용하여 코드를 더 깔끔하게 유지할 수 있습니다.
// 에러 처리 개선: 콜백 함수에서는 에러 처리가 어렵지만, Promise를 사용하면 .catch()를 통해 쉽게 에러를 처리할 수 있습니다.

// 📌 Promisifying the setTimeout function (2)
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000); // resolve = callback function을 Promise의 매개변수(=resolve)로 활용한 것.
  });
};

wait(2)
  .then(() => {
    console.log('I waited for 2 seconds');
    return wait(1);
  })
  .then(() => console.log('I waited for 1 second'));
*/

// 위의 then()를 사용하면 아래처럼 콜백헬에 빠지지 않고, 가독성 떨어지는 나쁜 코드 작성을 피할 수 있다. + nice sequence of asynchronous behavior를 가지는 코드를 짤 수 있다!!
/*
setTimeout(() => {
  console.log('1 second passed');
  setTimeout(() => {
    console.log('2 second passed');
    setTimeout(() => {
      console.log('3 second passed');
      setTimeout(() => {
        console.log('4 second passed');
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);
*/

Promise.resolve('abc').then(x => console.log(x));
// Promise.reject('abc').catch(x => console.error(x));
// This is how we built our own promises and how we promisify
// a very simple callback based asynchronous behavior function such as setTimeout.

/*
// 261. Promisifying the Geolocation API
// This is very clearly a callback(we have to pass in these 2 different callbacks like position, err) based API.
// => 이것을 promise를 이용해 callback based -> promise based API로 promisify해보자!!
navigator.geolocation.getCurrentPosition(
  position => console.log(position),
  err => console.error(err)
);
console.log('Getting position');
// 👉 geolocation API는 브라우저의 web APIs environment으로 offloaded되어 실행되기 때문에, 'Getting position'이 먼저 출력된다.

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position), // 함수의 목적이 getPosition이므로, 결과값을 받는데 성공했다면, 유저의 position 밸류를 얻었다는 뜻이므로, resolve()로 successful value를 리턴.
      err => reject(err)
    );
  });
};

// ✨ Upgrade version ✨
const getPosition2 = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
// callback hell을 피하기 위해 promise를 사용할 것이고, 결과 데이터를 마치 콜백함수를 쓴 것처럼, 쓴것과 동일한 효과를 내지만, 코드의 가독성과 유지보수성을 높이는 방향으로 작성할 수 있도록 하기 위해 then 메서드를 활용할 것이다.
// 이때 Promise의 콜백함수의 매개변수로서 쓰이는 또 다른 콜백함수인 resolve나 reject를 분명히 명시해줘야 한다. 만약 명시를 안해준다면, 해당 프라미스는 영원히 펜딩상태로 남아 어떠한 결과 값도 반환할 수 없게 된다. 이말은, 이 프라미스를 내포한 함수상에서 then(), catch(), finally() 아무 메서드도 사용할 수 없게 된다.(성공적인 값, 실패한 값 모두 반환하지 않기 떄문)
// 왜냐면 일단 프라미스의 상태가 fulfilled or rejected됐냐에 따라 then(), catch()로 전달되는 값이 정해지기 때문에, 무조건 이 둘은 명시해줘야 하고, then()이 fulfilled promise, 성공적인 데이터를 바로 받아오는 역할, catch()가 단순히 이러한 resolve, reject라는 콜백함수가 있다 정도만 명시해준 것!
// 따라서 우리는 resolve, reject를 프라미스 내부에서 무조건 명시해줄 필요가 있고, 프라미스가 rejected된 상태가 되어 결과값을 제대로 반환하지 못했을 때는 에러사항을 전역적으로 캐치할 수 있는 catch 메서드를 사용하면 reject에 의해 전달된 에러사항이 catch()로 전해지면서 콜백함수가 정상적으로 실행되게 되고, 반대로 fulfilled된 상태가 되어 결과값을 성공적으로 받았을 때는 Catch()가 아닌, then()에 명시된 콜백함수가 실행되게 된다.

getPosition2().then(pos => console.log(pos));

const whereAmI = function () {
  getPosition2()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      return fetch(
        `https://geocode.xyz/${lat},${lng}?geoit=json&auth=428256506246586962931x104466;`
      );
    })
    .then(response => {
      console.log(response); 
      if (!response.ok)
        throw new Error(`Problem with geocoding (${response.status})`);
      return response.json();
    })
    .then(data => {
      console.log(data);
      const city = `${data.city[0]}${data.city.slice(1).toLowerCase()}`;
      console.log(`You are in ${city}, ${data.country}`);

      // 새로운 API 활용
      return fetch(`https://restcountries.com/v2/name/${data.country}`); // 🚨
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found! (${res.status})`);
      return res.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => console.error(`${err.message} 💥`));
};

btn.addEventListener('click', whereAmI);
// 위의 함수를 오직 콜백함수들로만 작성했다고 생각해봐라.. 머리 터진다!!!!🤯🤯🤯

whereAmI(52.508, 13.381);
// You are in Mumbai, India
// whereAmI(19.037, 72.873);
// You are in Berlin, Germany
// whereAmI(-33.933, 18.474);
// You are in Cape town, South Africa
*/

////////////////////////////////////////////////////////////////////
// 262. Coding Challenge #2
/*
const imageContainer = document.querySelector('.images');

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const image = document.createElement('img');
    image.setAttribute('src', imgPath);

    image.addEventListener('load', function () {
      imageContainer.append(image);
      resolve(image);
    });

    image.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

let currentImg;
createImage('./img/img-1.jpg')
  .then(img => {
    currentImg = img;
    console.log('Image 1 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-2.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log('Image 2 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
  })
  .catch(err => console.error(err));
*/

// 263. Consuming promises with Async/Await
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// 🤯 선생님과 다르게 브라우저 상에 카드가 안뜬다 ㅠㅠㅠ
const whereAmI = async function () {
  // Geolocation
  const pos = await getPosition();
  const { latitude: lat, longitude: lng } = pos.coords;

  // Reverse geocoding
  const resGeo = await fetch(
    `https://geocode.xyz/${lat},${lng}?geoit=json&auth=428256506246586962931x104466`
  );
  const dataGeo = await resGeo.json();
  console.log(dataGeo);

  // Country data
  const res = await fetch(
    `https://restcountries.com/v2/name/${dataGeo.country}`
  );
  //   console.log(res);
  // => LOOKS LIKE an any "synchronous" code!!
  // ... We had to mess with callback function (Callback hell)
  // ... or consume promises with then method.
  // => But now, with async and await, it's become EASIER TO READ AND UNDERSTAND!!

  // 위의 코드 두 줄은 아래 코드 세 줄과 동일. 훨씬 간단하지??
  //   fetch(`https://restcountries.com/v2/name/${country}`).then(res =>
  //     console.log(res)
  //   );

  const data = await res.json();
  console.log(data);
  renderCountry(data[0]);
};
// await: use this keyword to wait for the result of the "promise". >> await will stop the code execution at this point of the function until the promise is fulfilled.
// ❓Isn't it stopping the code or blocking the execution?
// => Not at all! This function is running asynchronously in the background..(So the ✨console.log('FIRST')✨ is not blocked by whereAmI. code will move onto the next line without blcoking of main thread.) So it's not blocking the call stack or main thread of execution. => 겉으로는 일반 함수처럼 보이지만, 사실은 비동기적으로 처리되는 함수이다.. async-await이 매우 특별한 이유..
whereAmI();
console.log('FIRST'); // ✨

// 264. Error handling with try and catch
// we can't use catch method because we can't really attach it anywhere.
// Instead, we use something called a try-catch statement. (이건 async/await과는 아무 관련이 없지만, 에러를 잡기 위해서 쓰일 수 있는 방법이다.)
// Never ignore handling errors especially when it comes to asynchronous code..

// ✅ fetch()함수를 사용해 서버와 HTTP통신을 할 때, 비동기적인 업무를 처리하는 Promise를 다루는 방법이 2가지 존재한다. (⭐️⭐️⭐️⭐️⭐️)
// 1. 성공적인 데이터를 처리할 때 사용하는 then()과 에러가 발생할 때 사용되는 catch()를 사용 (Promise 체인을 통해 비동기 작업을 처리하는 방식, 여러 then()을 연결하여 여러 단계를 처리가능)
// 2. 1번 방법보다 더 직관적이고 이해하기 쉬운 async/await & try-catch block 사용 (🍀동기적인 코드 흐름처럼 비동기코드를 작성할 수 있게🍀 해주기 때문에 가독성이 좋다.)

// ** Stupid Example **
// try {
//   let y = 1;
//   const x = 2;
//   y = 4;
// } catch (err) {
//   alert(err.message);
// }

// 위의 whereAmI 함수를 try-catch 구문으로 묶어보자!
const whereAmI2 = async function () {
  try {
    // Geolocation: 사용자의 위치 정보를 가져오고, 실패하면 자동으로 에러 처리.
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;
    // 이 경우엔, 에러를 매뉴얼리하게 throw할 필요가 없다!
    // 💫 geolocation()의 경우, 이미 우리가 reject라는 콜백함수를 자동적으로 불러오게끔 promise를 설정해놨기 때문. 하지만, fetch로부터 리턴되는 promise의 경우에는 데이터를 성공적으로 받지 않아도, 404를 리턴하지 않고, fulfilled되므로 우리가 매뉴얼리하게 에러를 던져줘서 Catch block에 잡히도록 설정해주어야 한다.

    // 🤖 ChatGPT says...
    // geolocation.getCurrentPosition()은 성공 시 success 콜백 함수(resolve, 첫번째 매개변수)가 호출되고, 실패 시 error 콜백 함수(reject, 두번째 매개변수)가 호출되도록 "이미 설계"되어 있습니다. 그래서 실패할 경우 자동으로 reject 처리가 됩니다.
    // 반면, 💥fetch()는 HTTP 응답이 성공적인지(200~299 상태 코드)와는 별개로💥, "네트워크 요청이 성공"하면 >>무조건 fulfilled 상태의 Promise를 반환<<합니다. 따라서 요청이 실패하여 404나 500 같은 에러가 발생하더라도 Promise 자체는 여전히 성공적으로 해결된 것으로 간주됩니다. 이 때문에 응답의 상태 코드를 직접 확인하고, 오류가 있으면 throw로 에러를 발생시켜 catch 블록에서 처리해줘야 합니다.

    // Reverse geocoding: 위도와 경도를 바탕으로 역 지오코딩을 통해 위치 데이터를 가져옴. 실패 시 수동으로 에러를 던짐. (throw new Error)
    const resGeo = await fetch(
      `https://geocode.xyz/${lat},${lng}?geoit=json&auth=428256506246586962931x104466`
    );
    // ✨Solution✨
    // This code handles any error 'resGeo fetch' above.
    if (!resGeo.ok) throw new Error(`Problem getting location data`);

    const dataGeo = await resGeo.json();
    console.log(dataGeo);

    // Country data: 국가 데이터를 받아오며, HTTP 응답 실패 시 수동으로 에러 처리(throw new Error)
    const res = await fetch(
      `https://restcountries.com/v2/name/${dataGeo.country}`
    );
    // ✨Solution✨
    // This code handles any error 'res fetch' above.
    if (!res.ok) throw new Error(`Problem getting country`);

    console.log(res);
    // => 🍀LOOKS LIKE an any "synchronous" code!!🍀
    // ... We had to mess with callback function (Callback hell)
    // ... or consume promises with then method.
    // => But now, with async and await, it's become EASIER TO READ AND UNDERSTAND!!

    // 위의 코드 두 줄은 아래 코드 세 줄과 동일. 훨씬 간단하지??
    //   fetch(`https://restcountries.com/v2/name/${country}`).then(res =>
    //     console.log(res)
    //   );

    const data = await res.json();
    console.log(data);
    renderCountry(data[0]);

    // 265. Returning Values from Async Functions
    // 이 함수로부터 어떤 값을 리턴받고 싶다고 가정해보자..
    return `You are in ${dataGeo.city}, ${dataGeo.country}`;
  } catch (err) {
    console.error(`${err} 💥`);
    renderError(`💥 ${err.message}`);
    // 💥 fetch promise doesn't reject on a 404 error, or on a 403 error,
    // which was actually the original error, which caused everything collapsed in try block. (fetch의 경우, 유저의 internet connection이 안 좋을 때만 reject한다.
    // 🍀 참고 -> 🤖위의 챗지피티 설명 & 🖍️ 255. Handling Rejected Promises🖍️)
    // ✨Solution to that is just manually create an error. so that error will then be caught here in the catch block.✨

    // 265. Returning Values from Async Functions
    // 💧 Let's think about errors when using then() and catch()!
    // ex) 만약에, res의 url에 오타가 발생하여 에러가 발생한다면, 🌺 코드에서 데이터를 불러오지 못하므로, 에러가 발생하는게 정상인데, undefined가 출력됐다! -> 이 말은, then()함수의 콜백함수가 실행이 됐다는 것이고, 이말은, then() 메서드가 불러졌다는 뜻과 동일하며, 결국 이 말은 whereAmI()함수에 의해 리턴되는 Promise가 reject되지 않고, fulfilled 됐다는 뜻이다. (🌼 코드에서 catch()메서드를 이용해 에러를 잡았을 때, 이 코드는 출력되지 않는다는 점에서 async promise가 fulfilled됐다는 사실을 한번더 확인할 수 있음..)
    // 즉, async function 안에서 에러가 발생했다 할지라도, async function이 리턴하는 프로미스는 여전히 fulfilled된 상태로 리턴된다는 불편한 진실을 마주한것이다...
    // 따라서 만약 🌼코드에서 에러를 확인하고 싶게 하고 싶으면, 에러를 한번 더 던져줘야(rethrowing) 할 필요성 있음!

    // 🤖 ChatGPT says...
    // 비동기 함수에서 fetch()와 같은 API를 사용하여 데이터를 가져오는 경우, HTTP 요청이 실패해도 해당 요청은 💥fulfilled 상태로 처리💥됩니다. 따라서 실제로 에러가 발생했을 때는 catch 블록이 실행되지 않고, then 블록에서 undefined나 원치 않는 값을 얻을 수 있습니다.

    // 이런 경우에 에러를 다시 던지는(throw) 것이 중요합니다. 이를 통해:
    // (1) 에러를 명시적으로 처리할 수 있습니다: whereAmI() 함수에서 발생한 오류를 다시 던짐으로써 호출하는 곳에서 catch를 통해 에러를 처리할 수 있습니다.
    // (2) 정확한 에러 메시지를 제공할 수 있습니다: 원래의 에러 메시지를 유지하면서 추가적인 정보를 덧붙이거나 새로운 에러를 생성할 수 있습니다.

    // 📌 Reject promise returned from async function
    // Rethrowing errors : throw the error again so that we can then propagate it down.. -> promise를 manually reject할 수 있도록 하기 위함
    throw err;
  }
};

// Test code
whereAmI2();
whereAmI2();

// 265. Returning Values from Async Functions (💧(using old way - then() & catch()) - (🌺+🌼: handling error) + (🌳: setting sequence using promise chain)  -> 💖(using the latest philosophy - async/await) -> ✅ IIFEs)
console.log(`1: Will get location`); // -> 1

// const city = whereAmI(); // -> 3
// console.log(city); // Promise {<pending>}
// return 되는 스트링(`You are in ${dataGeo.city}, ${dataGeo.country}`) 대신에,
// 아직 settled되지 않은 pending상태의 promise를 얻은 이유는
// 이 시점에서는 자바스크립트가 어떤 값을 리턴하고 싶은지 모르기 때문이다!
// 컨솔과 리턴의 차이점 다시 한번 명확하게 하자.. 컨솔로그로 처리했다고 리턴값이 컨솔에 나오는게 아니다!!

////////////////////////////////////////////////////////////////
// > console.log()는 ✨단지 값을 출력하는 것이고, 리턴값과는 무관✨합니다.
// > async 함수는 항상 Promise를 반환하므로, ✨반환된 값을 실제로 사용하려면✨ await 또는 then()을 사용해야 합니다.
// 🛟 이유: whereAmI() 함수는 비동기 함수입니다. 즉, async 함수는 기본적으로 Promise를 반환합니다. await를 통해 비동기 작업을 기다리긴 하지만, 함수가 끝날 때까지 기다리지 않고 바로 Promise 객체를 반환합니다.
// 🛟 해결 방법: 비동기 함수에서 리턴되는 값을 사용하려면 await를 사용하거나, then()을 이용해 결과를 처리해야 합니다.
//////////////////////////////////////////////////////////////////
// 1) 💧then() 사용 - city we wrote here is the result value of the promise.
// whereAmI()
//   .then(city => console.log(`2: ${city}`)) // 🌺
//   .catch(err => console.error(`2:  ${err.message} 💥`)) // 🌼
//   .finally(() => console.log('3: Finished getting location')) // 🌳 밑에 있는 '3: Finished getting location'보다 '2: ${err.message}'가 더 먼저 실행되게 하고 싶다면, global scope에 존재하는 밑의 코드는 지우고(글로벌스콥에 위치한 코드는 무조건 먼저 실행될테므로..), Finally() 메서드로 promise chain활용하여 sequence를 생성하자!
// console.log(`3: Finished getting location`);
// => kind of mixing the old and new way of working with promises.
// => kind of mixes this philosophy of async/await with handling promises using then and catch.. 👉 💖

// 2. 💖 async/await 사용 - whereAmI()자체는 promise를 리턴하므로, 당연히 await으로 비동기적인 데이터를 받아 변수로 저장할 수 있다. 하지만 await은 async함수 안에서만 사용될 수 있고, 우리는 완전히 새로운 함수를 만들고 싶지는 않으므로,,, IIFEs(immediately invoked function expression)을 사용할 것이다!
// => ⭐️Jonas가 선호하는 방식!! 오직 최신기법 async/await으로만 비동기통신 하는 법⭐️

// ✅ IIFE (going back to and reminding of 10-Functions....)
// Sometimes we need a function that is only executed once, and never again.
// This might not appear to make much sense right now, but we actually need this
// technique later, with something called async/await. -> How could we do that?
// we could simply create a function. and then only execute it once.

// 다음 함수는 함수를 새롭게 정의한 게 아니라, 딱 한번만 불러오고 싶은 함수로서, 비동기통신 업무를 담당하는 함수, Promise를 리턴하는 함수(await whereAmI())를 포함하고 있다.
// whereAmI()를 then(), catch()같은 옛날 방법을 이용해서 비동기통신을 이용하는게 아닌,
// 여기서 한번 더 최신 신택스인 async/await으로만 통신하고 싶다면!!! 근데 나는 새로운 함수를 정의하는게 아니라, 그냥 통신 한번 하자는 뜻으로 하는 거니까.. IIFE를 쓰는게 적절하므로 async을 try-catch block을 포함하는 함수로 감싸고, 이걸 ()으로 묶어줘서 IIFE로 만든 것!
(async function () {
  try {
    const city = await whereAmI();
    console.log(`2: ${city}`);
  } catch (err) {
    console.error(`2: ${err.message} 💥`);
  }
  console.log('3: Finished getting location');
})(); // 세미콜론 필요

console.log(`3: Finished getting location`); // -> 2

// 266. Running Promises in Parellel
const get3Countries = async function (c1, c2, c3) {
  // Always use try-catch block when you're using async function to work with HTTP communication.
  // ✅ async 함수 내부에서 발생한 모든 에러를 캐치할 수 있도록...
  // ✅ then(), catch() 체인 대신 async/await과 try-catch를 사용하면 코드가 더 직관적이고 읽기 쉬워지므로...

  // 💥 다만, 모든 상황에서 반드시 사용해야 하는 것은 아니며, 일반적으로 권장되며, 필요에 따라 적절하게 사용하는 것이 좋다.
  // 👉 간단한 HTTP 통신에서는 굳이 try-catch를 사용하지 않고, then()과 catch() 체인을 사용할 수 있습니다.
  // 👉 에러를 특별히 처리하지 않아도 되는 경우는 에러 처리를 생략할 수도 있습니다
  try {
    // This doesn't make so much sense!!
    // 여기서 우리는 ajax call들을 서로가 서로에게 영향을 받지 않음에도 불구하고,
    // 하나가 끝나면 하나를 부르고, 또 하나가 끝나면 하나를 차례대로 부르고 있다.
    // => 이 얼마나 비효율적인 방식인가? 유저입장에서 데이터를 충분히 한번에 받을 수 있음에도 불구하고,
    // 그냥 하나하나씩 천천히 차례대로 받고 있는 셈이다. (데이터 통신에서 1초는 매우 긴 시간이다..)
    // -> Why should the second Ajax call wait for the first one?!
    // 🖍️Inspect - Network - Waterfall 부분을 보면, 데이터들이 차례대로 받아와지는 것을 확인할 수 있음.

    // Instead of running these promises in sequence, we can actually run them in parellel!
    // so all at the same time, so then we can save valuable loading time, making these 3 basically load at the same time.
    ////////////////////////////////////////////////////////////////////////////
    // const [data1] = await getJSON(`https://restcountries.com/v2/name/${c1}`);
    // const [data2] = await getJSON(`https://restcountries.com/v2/name/${c2}`);
    // const [data3] = await getJSON(`https://restcountries.com/v2/name/${c3}`);

    // console.log([data1.capital, data2.capital, data3.capital]);
    ////////////////////////////////////////////////////////////////////////////

    // Promise.all(): combination function (all: helper function on Promise constructor)
    // this function takes in an array of promises, and it will return a new promise.
    // 🤖 Chat GPT says...
    // 여러 개의 프로미스를 배열로 받아들이고, 모든 프로미스가 fulfilled 상태가 될 때까지 기다립니다. 그리고 모든 프로미스가 성공적으로 완료되면, 결과를 배열로 반환하는 새로운 프로미스를 생성합니다. 만약 배열 내의 어떤 프로미스라도 rejected 상태가 되면, Promise.all()은 즉시 rejected 상태로 전환되고, 그 이유가 되는 에러를 반환합니다.
    // => 배열 안에 있는 모든 프로미스들을 한꺼번에 실행시키고, 모든 프로미스가 실행이 끝날 때까지 (pending -> settled 상태가 될 때까지) 기다렸다가, 결과를 배열로 반환하거나, 단 하나의 프로미스에서라도 에러가 발생하면 즉시 rejected된 상태로 전환된다.
    Promise.all([
      `https://restcountries.com/v2/name/${c1}`,
      `https://restcountries.com/v2/name/${c2}`,
      `https://restcountries.com/v2/name/${c3}`,
    ]);
    console.log(data); // [[{...}], [{...}], [{...}]] => element 자체가 또 하나의 배열로 감싸짐!
    // These 3 now loaded exactly at the same time. (running in parallel, no longer in sequence now...)
    console.log(data.map(d => d[0].capital)); // ["Lisbon", "Ottawa", "Dodoma"]
  } catch (err) {
    console.error(err);
  }
};

get3Countries('portugal', 'canada', 'tanzania'); // ["Lisbon", "Ottawa", "Dodoma"]
