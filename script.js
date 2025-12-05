let arr = [];
let 훅_인덱스 = 0;

//useState만들기
const useState = (초기값) => {
  let 현재_인덱스 = 훅_인덱스
  const state = arr[현재_인덱스] ?? 초기값;

  const setState = (새값) => {
    if (arr[현재_인덱스] !== 새값) {
      arr[현재_인덱스] = 새값;
      renderBox1();
    }
  };

  arr[현재_인덱스] = state
  훅_인덱스 ++;
  return [state, setState];
};

let 초기화패턴 = false;

//돔에 그리는 함수
const renderBox1 = () => {
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
      const nameInputVal = document.querySelector("#name").value;
      setName(nameInputVal);
      const ageInputVal = document.querySelector("#age").value;
      setAge(ageInputVal);
      const hobbyInputVal = document.querySelector("#hobby").value;
      setHobby(hobbyInputVal);
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
