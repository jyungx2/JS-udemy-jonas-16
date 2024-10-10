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
// 예외적으로 fetch API의 경우엔, 이 자체가 promise를 리턴하기 때문에 굳이 build할 필요 없이 promise를 Consume 가능! => In this case, we don't have to build the promise ourselves in order to consume it.
// 하지만 대부분의 경우에 이렇게 fetch API처럼 promise를 직접 생성할 필요 없다!!
// 그냥 promise를 굳이 만들지 않고, 소비가 가능한 경우가 훨씬 많다... easier and more useful part.

// ⭐️ 253. Consuming promises
// fetch function에 의해 리턴된 프로미스를 consume하는 법을 배울 것이다.
// const request = fetch('https://restcountries.com/v2/name/canada');
// console.log(request); // Promise 리턴 [PromiseState]: 'fulfilled'

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
// getCountryData2('korea'); // [{...}, {...}] => [{북한}, {남한}]

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
// console.log(getCountryData3('korea'));

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
// => 우리가 다뤄야 할 에러 사항은 이것뿐!

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
