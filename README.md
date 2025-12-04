# [**useState 를 구현해봅시다.**]

## useState는 어떤 기능을 할까?

1. **초기값 설정**
    - 값 직접 전달: useState(0)
    - 지연 초기화(lazy initialization): useState(() => expensiveComputation())

```
*지연 초기화

🧑🏻‍🎨 일반 방식 - 매 렌더링마다 expensiveComputation() 실행
const [state, setState] = useState(expensiveComputation());

🧑🏻‍🎨 지연 초기화 - 첫 렌더링 때만 실행
const [state, setState] = useState(() => expensiveComputation());

```

1. **상태 업데이트**
    - 직접 값 설정: `setState(5)`
    - 함수형 업데이트: `setState(prev => prev + 1)`
2. **불변성 비교**
    - React는 내부적으로 [**Object.is**](http://object.is/) 알고리즘으로 이전 값과 비교
    - 값/참조가 동일하면 리렌더링을 스킵함
3. **클로저 활용**
    - 훅 호출마다 고유한 인덱스가 유지됨
    - 렌더링이 반복돼도 상태가 보존됨
4. **배치 업데이트**
    - 하나의 이벤트 안에서 여러 `setState` 호출 시
    - React가 업데이트를 묶어서 한 번에 처리함
