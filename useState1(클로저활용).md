내가 생각하기엔 useState란건 버튼을 눌렀을때 값이 바뀌면 다시 렌더링해서 그리면 되는건가?
-> [ai 자문] 페이지 전체를 새로 렌더링해서 이아니라 바뀐 그 부분만 다시 렌더링 하는게 중요하다.

---

내가 생각했을때 useState함수를 만드려면 그 상태를 배열로 가지고 있어야함 왜냐면 옛날꺼를 다시 갱신시켜야하니까 
초기값은 비워져있는상태로

---

렌더링과 새로고침은 뭐지? 정확하게 부분 렌더링은 어떻게 일어나는거지?
새로고침이 아닌 저장을할때 렌더링이 되어야한다 그럴려면 [ai 자문] 렌더링 트리거가있어야해..!

---

아 랜더링 트리거는 이전꺼랑 들어온값이랑 바뀌었을때
돔을 바꿔줘야하니까 그걸 전부 합쳐야하나?

const box1 = () => {
  a랑 b랑 비교했는데 바뀜 -> 돔에 추가하는 함수
}

여기서 box1이 트리거?라고 생각했는데

[ai 자문] 저건 그냥 함수 자체래 
렌더링의 행동이였던거야 저걸 호출하는게 필요해..흠..

---

setter가 트리거..?
새터가 그리게하는걸 불러들이는건가
그리게 하는게 렌더링이면 단순비교와 렌더링은 함수를 다르게 가져가야하는건가

그러면 그 비교하는함수와 렌더링의 함수를 합친게 useState?
-> [ai 자문] 맞대

---

useState는 그냥 자판기라 생각하면 되는건가
useState("")를 호출하면 [state, setState] 배열이 반환

```js
const [state, setState] = useState(""); 
```

근데 이건 ""이게 초기값으로 고정이여서 내가 이거 사용하면
뭘넣던 유즈스테이트 함수를 만들어서 넣으면 초기값은 "" 이거 아닌가..?
아나 배열에 저장하기로 했지
배열하나 띄우자 배열 비워져있으면 ""하면댐

---

```js
let arr = [];

const useState = (초기값) => {

  const state = arr[0] ?? 초기값;
  const setState = (새값) => {
    // 값 업데이트
  }

  return [state, setState];
}

//돔에 그리는 함수
const renderBox1 = () => {
  
}

//렌더링
renderBox1();

```

---

근데 난 버튼을 클릭하면 모든게 진행이 된다
그러면 돔에 그리는 함수에 유즈스테이트 자체를 넣어?
아니면 호출?

---

클릭했을때만 비교..
근데 클릭했을때 box1이 아니라 box2가 변경될수도 있는거잖아
그러면 클릭했을때 전체 페이지를 다 한번 훑어야해?

클릭했을때 내가 클릭한 부분만 렌더링이 되어야한다는 생각자체가 잘못된거같아
클릭했을때 만약 다른 페이지의 변화도 일어나게 되고 그게 내 페이지에 대해 영향을 끼친다면 그건 뭐지? << 일단 다른영역 다른페이지는 일단 다음에 생각하자

----

```js
document.querySelector('.box1 button').onclick = () => {
  const inputVal = document.querySelector('.box input').value
  setState(inputVal)
}

```
버튼 클릭했어요 
⬇️
input의 값들고와요 클릭했을때 그때 값이 와야하는거 아닌가요? (current ref)
⬇️
맨처음은 state = "", 클릭을했을때 현재값을 확인하고 = 이벤트(클릭=1을추가)가 일어나고 그러고 나면 1이 됩니당
⬇️
그러면 "" 와 이벤트 다음의 1과 차이가 일어나요
⬇️
그러면 값이 1이 ""로 들어가게 되는거
⬇️
이게 내가 생각한 유즈스테이트다..

해서 저기서 onclick할때 ++ 해서 숫자 올라가는걸 상상했는데
애초에 배열로 잡아서 숫자로 변환도 해야하고 아니면 let count = 0, 그것보다는 input이니까 쓰는거를 보여주는게 더 좋을꺼같다

----

```js
let arr = [];

//useState만들기
const useState = (초기값) => {

  const state = arr[0] ?? 초기값;
  if(state !== 새값){
    const setState = (새값) => {
      arr[0] = 새값;
      renderBox1();
    }
  }
 
  return [state, setState];
}
```

일단 이렇게 함수 완성..?

----

그러면 renderBox1에서 사용해보면

```js

const renderBox1 = () => {
    const [state, setState] = useState(""); 

    document.querySelector('.box1 div').textContent = state

    document.querySelector('.box1 button').onclick = () => {
    console.log("클릭")
    const inputVal = document.querySelector('.box1 input').value
    setState(inputVal)
  }
}
```

라고 생각하는데 작동을 안하네..
----

문제점 1: 스크립트 위치가 너무 위 -> 이거 defer 넣어줌
문제점 2: if문 위치 틀림

----

```js

 const state = arr[0] ?? 초기값;
  const setState = (새값) => {
      if(state !== 새값){
      arr[0] = 새값;
      renderBox1();
    }
  }

```

if문 새값이 없는데 새값이랑 비교했네..
이거 하니까 콘솔도 아래 클릭 콘솔도 나온다

---

일단 작동이 되네용 
저는 클로저 활용정도 한거같고 (setState는: arr 변수를 기억하고 있음, renderBox1 함수를 기억하고 있음, 버튼 클릭할 때 호출되어도 이것들에 접근 가능!)

1. 지연 초기화
2. 함수형 업데이트
3. 여러 useState
4. 배치 업데이트

는 추후 계속 수정, 추가 해보겠습니다!




