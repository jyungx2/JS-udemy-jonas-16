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
