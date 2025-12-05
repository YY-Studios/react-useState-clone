
let arr = [];

//useState만들기
const useState = (초기값) => {

  const state = arr[0] ?? 초기값;

  const setState = (새값) => {
      if(state !== 새값){
      arr[0] = 새값;
      renderBox1();
    }
  }
 
  return [state, setState];
}

//돔에 그리는 함수
const renderBox1 = () => {
  const [state, setState] = useState(""); 

  document.querySelector('.box1 div').textContent = state
  
  document.querySelector('.box1 button').onclick = () => {
    console.log("클릭")
    const inputVal = document.querySelector('.box1 input').value
    console.log(inputVal)
    setState(inputVal)
    
  }
}

//돔에 그리지않는 함수
const renderBox2= () => {
  let value = "";

  document.querySelector('.box2 button').onclick = () => {
    const inputVal = document.querySelector('.box2 input').value
    value = inputVal;
    console.log(inputVal)
  }

  document.querySelector('.box2 div').textContent = value
}

//내가 직접 수동 렌더링
const renderBox3= () => {

   let value = "";
   
    document.querySelector('.box3 button').onclick = () => {
      const inputVal = document.querySelector('.box3 input').value
      value = inputVal;
      console.log(inputVal)
      document.querySelector('.box3 div').textContent = inputVal
    }
}

renderBox1();
renderBox2();
renderBox3();
