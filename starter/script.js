'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// ⭐️ 255. Handling Rejected Promises
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
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
  countriesContainer.style.opacity = 1;
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
// Since ES6, there's a way of escaping callback hell by using something
// called promises.
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

// const request = new XMLHttpRequest();
// request.open('GET', `https://restcountries.com/v2/name/${country}`);
// request.send();

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
// console.log(request);

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

// 👉 어쨌든 우리가 알아야 할 것은 then() 메서드는 새로운 promise를 리턴하기 때문에,
// then() 상에서 계속해서 원하는 데이터를 끝까지 받아내기 위해 then()를 줄줄이 소시지처럼
// 원하는만큼 쓸 수 있다는 것!!
// 만약 우리가 어떤 나라의 이웃의 이웃의 이웃을 알고 싶다면, 이런식으로 계속해서 모든 Promise들의 chaining을 통해 최종적으로 원하는 데이터를 끄집어 낼 수 있다!
// Instead of callback hell, we have what we call a flat chain of promises. (very easy to understand and read..)
// 콜백헬은 콜백함수 안에 또다른 콜백함수, 그 안에 또 콜백함수...가 계속 반복되는 구조인데,
// 여기서는 그냥 플랫하게! 누구 하나 종속되는 관계가 아닌, then() 메서드가 new Promise를 리턴하는 것을 이용해 계속해서 데이터 값을 뽑아내고 있다.
// Always return Promise and handle it outside by simply continuing the chain like this.

// 🍅 256. Throwing Errors Manually
const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`${errorMsg} (${response.status})`);
    }
    return response.json();
  });
};

const getCountryData = function (country) {
  // ✨Country 1✨
  //   fetch(`https://restcountries.com/v2/name/${country}`)
  //     .then(
  //       response => {
  //         /*
  //         console.log(response); // response.ok = false로 설정되어 나옴. (status: 404이기 때문..) => 이 경우에, 특정 에러메시지가 출력되도록 매뉴얼리하게(직접) 설정해주자!

  //         if (!response.ok) {
  //           throw new Error(`Country not found (${response.status})`);
  //         } // new Error(): create a new error
  //         // throw keyword: immediately terminate the current function (=return)
  //         // 💫 중요한 개념:
  //         // then 메서드 안에 error를 만들어 throw하게 되면, 즉시 promise를 reject한다.
  //         // 그리고 이러한 Rejection은 catch()를 만날 때까지 아래로 쭉 전파되게 되고,
  //         // catch를 만나는 순간, 이 캐치 핸들러가 throw에 의해 리턴된 에러메시지를 캐치하여
  //         // 자신의 ${err.message} 부분에 넣어 함께 출력한다.
  //         // 그래서 여기서 아래와 같은 메시지가 보이는 것!! (*status = 404)
  //         // Something went wrong💥💥 Country not found (404). Try again!

  //         // 💫 또 중요한 개념:
  //         // 이미 배운 개념이긴 한데, 여기서 응용해보자면, catch메서드는 이전에 어느 then()의 결과에서든 에러가 발생하면, 그 에러를 캐치하여 자신의 매개변수에 적용시켜 출력할 수 있다고 배웠다..(🧚‍♀️ 부분 참고) 따라서 여기서 if(!response.ok)~ 절을 지우고 화면을 확인해보면, 더 이상 위와 같은 에러메시지가 아닌, err.message 부분이 flag 에러 관련한 메시지로 바뀌어 나타나게 된다. (중간에 어느 then인지는 모르겠으나 어쨌든 어느 then 메서드로부터 flag 속성을 읽으려다가, undefined인 것을 확인하여 에러가 발생했겠지! 하고 생각할 수 있겠다.)
  //         // Something went wrong💥💥 Cannot read properties of undefined (reading 'flag'). Try again!

  //         return response.json();
  //         */
  //       }
  //       //   err => alert(err) // 🧞‍♂️ fetch될 때 발생하는 에러만 핸들링!
  //     )
  getJSON(`https://restcountries.com/v2/name/${country}`, 'Country not found')
    // 👉 getJSON()함수로, fetch() + error 핸들링을 위한 코드 를 한군데 묶은 함수를 외부에 하나 만들어, 장황하게 작성한 코드를 짧게 줄여줬음!! 별거 없다!!🍞
    .then(data => {
      console.log(data);
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];
      console.log(neighbour);

      // Ex) australia같은 경우, 이웃 나라가 하나도 없다는 것을 활용해,
      // 에러메시지가 유저입장에서 이해가능하도록 출력되는지 체크해보자.
      // 아래 코드로 작성하면 캐치 핸들러에 의해 에러메시지가 캐치되어
      // Something went wrong💥💥 Cannot read properties of undefined (reading 'flag'). Try again!
      // 이렇게 출력된다... 이 에러메시지는 유저 입장에서 봤을 때, 이해하기 어려운 에러미시지!!
      // 우리는 이웃나라가 있는지 없는지 Flag 속성을 읽으면서 판단하여서 이런식으로 나타난 것!(우리 개발자 입장에서만 이해가능.)
      // -> 따라서 유저 친화적인 에러메시지를 매뉴얼리하게 세팅해줄 필요성✅
      // 🍞🧈 이 코드는 지금 아무런 역할 하지 못하는중.
      //   if (!neighbour) return;

      // 👉 에러 메시지를 매뉴얼리하게 뿌려주어 밑에 catch()핸들러가 이 메시지를 캐치하여
      // 출력할 수 있도록 throw키워드를 사용해 에러메시지를 전달해준다.
      // => 유저 입장에서 더 이해가 가는 real 에러메시지.. UX quality ⬆️
      if (!neighbour) throw new Error('No neighbour found!');
      // 👉 Something went wrong💥💥 No neighbour found!. Try again! 로 출력
      // 유저들이 이해하기 쉽다 :)

      // ✨Country 2 (Neighbour country)✨
      //   return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
      return getJSON(
        `https://restcountries.com/v2/alpha/${neighbour}`,
        'Country not found' // 에러가 발생하는 이유를 정확히 설명해주는 메시지를 직접 만들어서 보내줄 필요성이 있다고 판단되어 위에서 throw new Error()을 사용해 만들어준 것.
      );
      // 🍞 getJSON() 함수로 아래 then()메서드 써줄 필요 ❌
      //  return 23;
    })
    // .then(response => {
    //   if (!response.ok)
    //     throw new Error(`Country not found (${response.status})`);
    //   return response.json();
    // }) // 🍞
    // 만약에 위의 Fetch()에서 에러가 났다면? 그 다음에 오는 Then()에 throw new Error() 써줘야된다.. => Bad Pracitce라는 걸 알지만, 일단 써준다.
    // => 우리는 이렇게 반복되는, 매뉴얼리하게 작성해줘야 하는 불편함을 없애기 위해 에러 핸들링만을 위한 함수를 하나 빼서 만들 것이다. (=> getJSON 🍅)
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.log(`💥💥 ${err} 💥💥`);
      renderError(`Something went wrong💥💥 ${err.message}. Try again!`);
    }) // 🧚‍♀️ this catch method will catch any errors that occur in any place in this whole promise chain.
    .finally(() => (countriesContainer.style.opacity = 1)); // promise가 리젝트되든, 풀필되든 간에 항상 실행되는 공통실행코드! (catch() 또한 promise를 리턴했기 때문에 chinable하게 가능)
  // .then(data => alert(data)); // 🥒 23이 리턴됐으므로, data = 23, alert(23)
};

// ✨Test Area✨
// getCountryData('germany');

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

// 2) 🧚‍♀️더 나은 방법이 존재함🧚‍♀️
// then()의 매개변수로 추가하는 것이 아닌, catch()메서드를 사용하는 것!
btn.addEventListener('click', function () {
  getCountryData('germany');
});

getCountryData('australia');
// 🚨 "Cannot read property 'flag' of undefined" => ❌true error❌
// => our API cannot find any country
// 에러가 발생한 이유는, 우리의 API가 다음과 같은 country name을 찾지 못했다는 점에서 발생한건데, 엉뚱하게 다른 원인 때문에 발생했다고 지껄임! => 이러한 이유는 fetch promise가 rejected되지 않고, 그냥 Fulfilled된 상태로 남게되는 동작원리 때문...(왜이렇게 동작하는지 모름, 조나스도 의문)

// 또한, 컨솔창에 GET ~~~~코드에서 404도 위의 에러와 같이 뜨는데, 이 404가 country name을 찾지 못했다는 점을 Reflected하고 있음... 근데 이 404는 fetch promise에서 여전히 Fulfilled된 상태를 뜻하기 때문에 위의 cannot read property 'flag' of undefined로 나온것.
// 🎃 우리는 유저에게 이 이름이 👉정확한 나라이름이 아니라고👈 말해주고 싶기 때문에 이걸 핸들링할 수 있는 개념을 다음 시간에 배울 예정.

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
