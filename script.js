let arr = [];
let 훅_인덱스 = 0;
let 업데이트큐 = [];
let 배치중 = false;

//useState만들기
const useState = (초기값) => {
  let 현재_인덱스 = 훅_인덱스
  const state = arr[현재_인덱스] ?? 초기값;

  const setState = (새값) => {
    업데이트큐.push({ index: 현재_인덱스, value: 새값 });
    scheduleUpdate();
  };

  arr[현재_인덱스] = state
  훅_인덱스 ++;

  return [state, setState];
};


const scheduleUpdate = () => {
  if (!배치중) {
    배치중 = true;

    //이벤트 핸들러 종료 후 한 번만 실행
    Promise.resolve().then(flushUpdates);
  }
};

const flushUpdates = () => {
   // 같은 인덱스의 마지막 값만 적용 (중복 제거)
  const 최종업데이트 = new Map();

  // 업데이트 큐 적용
   for (const update of 업데이트큐) {
    최종업데이트.set(update.index, update.value);
  }

   // 실제로 값이 변경된 경우만 체크
  let 변경있음 = false;
  for (const [index, value] of 최종업데이트) {
    if (arr[index] !== value) {
      arr[index] = value;
      변경있음 = true;
    }
  }

  업데이트큐 = [];
  배치중 = false;

 // 실제 변경이 있을 때만 렌더링
  if (변경있음) {
    renderBox1();
  }
};

let 초기화패턴 = false;

//⭐ 렌더 횟수 확인 테스트용 로그 추가
let renderCount = 0;

//돔에 그리는 함수
const renderBox1 = () => {
  console.log("⭐ renderBox1 실행");
  renderCount++; // 렌더 횟수 증가⭐
  
  훅_인덱스 = 0;

  const [name, setName] = useState("Roberto");
  const [age, setAge] = useState(30);
  const [hobby, setHobby] = useState("");

  // 렌더링: 상태만 업데이트
  document.querySelector(".nameBox").textContent = name;
  document.querySelector(".ageBox").textContent = age;
  document.querySelector(".hobbyBox").textContent = hobby;

  if (!초기화패턴) {
    초기화패턴 = true;

    document.querySelector(".box1 button").onclick = () => {
      console.log("⭐ setState 여러 번 호출 테스트 시작"); // ⭐

      //const nameInputVal = document.querySelector("#name").value;
      //setName(nameInputVal);
      const ageInputVal = document.querySelector("#age").value;
      setAge(ageInputVal);
      const hobbyInputVal = document.querySelector("#hobby").value;
      setHobby(hobbyInputVal);

        // ⭐ 같은 상태를 여러 번 업데이트
      setName("업데이트1");
      setName("업데이트2");
      setName("업데이트3");
      setName("업데이트4");
      setName("최종값"); 

      // ⭐ flush 이후 어떤 값이 저장됐는지 테스트
      setTimeout(() => {
        console.log("⭐ 테스트 - 최종 name:", arr[0]);
        console.log("⭐ 테스트 - 렌더 횟수:", renderCount);
        console.log("⭐ 기대값: name='최종값', 렌더 횟수=2 (초기1 + flush1)");
      }, 0);
    };
  }
};


//돔에 그리지않는 함수
const renderBox2 = () => {
  let value = "";

  document.querySelector(".box2 button").onclick = () => {
    const inputVal = document.querySelector(".box2 input").value;
    value = inputVal;
    console.log(inputVal);
  };

  document.querySelector(".box2 div").textContent = value;
};

//내가 직접 수동 렌더링
const renderBox3 = () => {
  let value = "";

  document.querySelector(".box3 button").onclick = () => {
    const inputVal = document.querySelector(".box3 input").value;
    value = inputVal;
    console.log(inputVal);
    document.querySelector(".box3 div").textContent = inputVal;
  };
};

renderBox1();
renderBox2();
renderBox3();
