import React, { Fragment, useCallback, useEffect, useReducer, useRef, useState } from "react";
// import In from "./In";
// import Out from "./Out";
import './a.css';
import ImageUploader from "./ImageUploader";
import Out from "./Out";
import In from "./In";

// const imgList = [
//   'https://chong-chan.cn/resource/home/img/1.png',
//   'https://chong-chan.cn/resource/home/img/2.png',
//   'https://chong-chan.cn/resource/home/img/1.png',
//   'https://chong-chan.cn/resource/home/img/2.png',
// ]
// const [mini, maxi] = [0, imgList.length - 1];
// function App() {
//   const [index, setIndex] = useState(0)
//   const [isMove, setIsMove] = useState(false)
//   const [isClick, setIsClick] = useState(false)
//   useEffect(() => {
//     if (isClick) {
//       setTimeout(() => {
//         setIsClick(false)
//       }, 3000)
//     }
//   }, [isClick])
//   function handlePrev() {
//     if (isClick || mini > index - 1) return;
//     setIndex(index - 1)
//     setIsClick(true)
//   }
//   function handleNext() {
//     if (isClick || maxi < index + 1) return;
//     setIndex(index + 1)
//     setIsClick(true)
//   }
//   function handleDot(i) {
//     setIndex(i)
//     setIsClick(true)
//   }
//   return (
//     <div className="container">
//       <div className="viewer">
//         <div className="wrapper" style={{ left: isMove ? (-600 * (index + 1)) + 'px' : (-600 * index) + 'px' }}>
//           {
//             imgList.map((item, i) => {
//               return <div className="img-box" key={i}>
//                 <img src={item} alt="" />
//               </div>
//             })
//           }
//         </div>
//       </div>
//       <button className="btn left" onClick={handlePrev}>{"<"}</button>
//       <button className="btn right" onClick={handleNext}>{">"}</button>
//       <div className="dots">
//         {
//           imgList.map((item, i) => {
//             return <span key={i} className={i === index ? 'active' : ''} onClick={() => handleDot(i)}></span>
//           })
//         }
//       </div>
//     </div>
//   )
// }
// export default App;

function App() {
  const [InTextState, setInTextState] = useState({ active: false, text: "" });
  const [index, setIndex] = useState(null);
  const [results, setResults] = useState([]);
  const [list, setList] = useState([]);
  const [flag, setFlag] = useState(null);
  const len = list.length;
  const setIndex_ = (i) => {
    inputs[index] = getInText();
    setIndex(i);
  };
  const handleNext = () => {
    if (len <= index + 1) {
      setIndex_(0);
      return false;
    }
    setIndex_(index + 1);
    return true;
  }
  const handlePrev = () => {
    if (0 >= index - 1) {
      setIndex_(len - 1);
      return false;
    }
    setIndex_(index - 1);
    return true;
  }
  const [inputs, setInputs] = useState([]);
  useEffect(() => {
    document.getElementById("inText").innerText = InTextState.text;
  }, [InTextState])
  const getInText = () => document.getElementById("inText").innerText, setInText = (active, text) => setInTextState({ active, text });
  function InText() {
    return <div suppressContentEditableWarning="true" contentEditable={InTextState.active} className={["in-text", InTextState.active && "active"].filter(e => e).join(' ')} id="inText">
      {InTextState.text}
    </div>
  }
  return (
    <>
      <ImageUploader {...{ index, setIndex: setIndex_, list, setList, inputs, setInputs, flag, setFlag, results, setResults }} />
      <div className="text">
        <Out {...{ setInText, results, index, inputs, list }} />
        <In {...{ index, getInText, InText, inputs, setInputs, handleNext, handlePrev, flag, setFlag,results }} />
      </div>
    </>
  );
};


export default App;
