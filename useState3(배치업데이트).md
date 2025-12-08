##리액트 배치 업데이트란

참고: https://seungyn.tistory.com/34

```js
import { useState } from 'react';


function App() {
  const [num, setNum] = useState(0);

  const onClick = () => {
    setNum(num + 1);
    setNum(num + 1);
    setNum(num + 1);
    setNum(num + 1);
    setNum(num + 1);
  };

  return (
    <div className='App'>
      <h1>{num}</h1>
      <button onClick={onClick}>클릭 하면 1이 증가</button>
    </div>
  );
}

export default App;
```

여기서 여러개의 상태 업데이트가 안되는 이유: 배치 업데이트, 렉시컬 스코프
만약 저때마다 리렌더링이 일어나게 된다면 app은 한번에 5번에 리렌더링이 일어나게 된다
setNum함수가 100개 있으면 100번이 일어나게 된다..

-> 리액트는 이런 불상사를 방지하기 위하여 배치처리를 도입

---

배치 업데이트:
React는 이벤트 핸들러 안에서 여러 번 setState가 호출되더라도
바로 리렌더링하지 않고 업데이트 요청을 큐(queue)에 모아두었다가 한 번에 처리

```js
setNum(num + 1); // num = 0
setNum(num + 1); // num = 0
setNum(num + 1); // num = 0
```
-> 0 + 1로 계산된 값만 큐에 계속 쌓이고
-> 마지막 값(1)로 상태가 업데이트

---

렉시컬 스코프: num은 "클릭 시점의 값"을 기억

-> onClick 함수는 실행될 때 이미 num이 0으로 닫혀 있는상태
-> 그래서 배치가 끝나기 전까지 num은 0에서 변하지 않는다.

---

위에 두가지 이유 때문에 setNum(num + 1)은 매번 0 + 1을 수행하게 되는거다.
그래서 어떻게 5를 나오게 하냐면

업데이트 함수를 사용하면 된다.

```js
setNum((prev) => prev + 1);
setNum((prev) => prev + 1);
setNum((prev) => prev + 1);
setNum((prev) => prev + 1);
setNum((prev) => prev + 1);
```

이 방식은 배치 처리 중일 때도 최신 값 를 받아서 계산하기 때문에
클릭 한방에 5가 된다...

---

그럼 지금 나는 쓰는걸 바로바로 그리고 있는데 여기서 배치 업데이트, 함수형 업데이트가 의미가 있나..?

[ai 자문]
나는 즉시 렌더를 호출해서 지금 코드에서
setState를 큐에 쌓기, 이벤트 종료 후 하나의 render만 실행 이 구조가 있어야 리액트 처럼 동작한다.

[해야 할 것]
- setState()를 호출할 때 즉시 render 호출 금지
- 이벤트 핸들러가 끝나면 몰아서 한 번만 render 실행
- 최신 상태는 queue로 관리
(queue 배열 생성 -> 큐의 마지막까지 계산하는 업데이트 함수구현 -> 계산끝난걸로 arr에넣고 렌더링 한번만하기)
- 후에 함수형 업데이트(prev ⇒ new)도 확장 가능

---

최신 상태는 queue로 관리라는것은 어떻게 하는걸까
지금은 arr에 넣고있잖아
근데 그걸 또 arr에 최신을 넣으라고?

현재
```ts
let arr = [];
let 훅_인덱스 = 0;
```

여기서
```ts
renderBox1(a);
renderBox1(b);
```

라면 큐는..초기값은 필요없어 새값에만 필요해 그것도 연속으로 값이 들어갈때만
그러면 배열이 따로 필요해 같은 배열은 못써

```ts
let 업데이트큐 = [];
```

이 다음
[ai 자문]
setState를 즉시 업데이트에서 큐에 저장 방식으로 변경해야한다.

```ts
const setState = (새값) => {
  업데이트큐.push({
    index: 현재_인덱스,
    value: 새값,
  });

  // render를 바로 호출하지 않고 배치 스케줄링
  scheduleUpdate();
};
```

```ts
//한번만 실행시킬 변수가 필요하다 왜냐면 setState가 여러번 호출되어도 한번만 arr에 마지막 값을 줘야해서
let 배치중 = false;
const scheduleUpdate = () => {
  if (!배치중) {
    배치중 = true;

    //이벤트 핸들러 종료 후 한 번만 실행
    //[ai 자문]
    //현재 실행중이 코드(이벤트 핸들러)가 다 끝난뒤에 실행해줘
    //약속하다/응답을/flushUpdates << 이거에 대한..
    //근데 이건 비동기니까 지금 이벤트 다끝나면 flushUpdates <<이거하겠다.
    Promise.resolve().then(flushUpdates);
  }
};
```
[ai 자문]
왜 Promise.then이 필요한가?
setState가 여러 번 호출됨
-> 업데이트큐에 계속 쌓임
-> 하지만 flush는 한 번만 실행
-> 이벤트 핸들러가 끝나기 전에는 flush하면 안된다.
-> 그래서 microtask(=Promise.then)에 넣어 콜스택이 비는 순간 실행

```ts
const flushUpdates = () => {
  //업데이트 큐 적용
  for (const update of 업데이트큐) {
    arr[update.index] = update.value;
  }

  업데이트큐 = [];
  배치중 = false;

  //상태 모두 적용 후 한번 렌더링
  renderBox1();
};
```

---

근데 나는 애초에 또 그리자마자 렌더링이 되는데 테스트는 어떻게 해야하지?

업데이트큐에 값이 여러 개 들어가도 마지막 값만 반영되는지를 테스트 해보겠다

테스트 완료..!

최종값이 잘 나온다!


