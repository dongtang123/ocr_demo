import React, { Fragment, useCallback, useEffect, useReducer, useRef, useState } from "react";



export let updateProcess = () => { }
function Out({ setInText, results, index, inputs, list }) {
  const [state, setState] = useState(null);
  const [_index, increase] = useReducer(e => e++, 1);
  const [getProcess, setProcess] = ((e) => [() => e.current, (value) => e.current = value])(useRef(null));
  const [result, setResult] = useState(null);
  const [timer, setTimer] = ((e) => [() => e.current, (value) => e.current = value])(useRef(null));
  const [lastResult, setLastResult] = useState(null);
  function getOutput() {
    let _reject, getResult;
    // debugger;
    if (results[index]) {
      return {
        reject: _reject, then: (...e) => new Promise((resolve, reject) => {
          resolve([results[index]]);
        }).then(...e)
      }
    }
    getResult = new Promise((resolve, reject) => {
      _reject = reject;

      // function startUpload(file) {
      //   var uploadUrl = "http://127.0.0.1:5000/ocr";

      //   // 手工构造一个 form 对象
      //   let fd = new FormData();
      //   Array.from(list).forEach(e => {
      //     fd.append("image", e);
      //   });

      //   // 手工构造一个请求对象，用这个对象来发送表单数据
      //   // 设置 progress, load, error, abort 4个事件处理器
      //   var request = new XMLHttpRequest();
      //   // request.upload.addEventListener("progress", window.evt_upload_progress, false);
      //   // request.addEventListener("load", window.evt_upload_complete, false);
      //   // request.addEventListener("error", window.evt_upload_failed, false);
      //   // request.addEventListener("abort", window.evt_upload_cancel, false);
      //   request.open("POST", uploadUrl); // 设置服务URL
      //   request.send(fd);  // 发送表单数据
      // }
      // startUpload();

      let fd = new FormData();
      Array.from(list).forEach(e => {
        fd.append("images", e);
      });

      fetch("http://127.0.0.1:5000/ocrs", {
        method: "POST",
        body: fd
      })
        .then(re => re.json())
        .then(({ result_list }) => {
          result_list.forEach((e, i) => {
            results[i] = e
          })
          resolve([results[index]])
        })
      // setTimeout(() => {
      //   // resolve(src)
      //   results[index] = "字符串字符串字符串字符串";
      //   resolve(["字符串字符串字符串字符串"])
      // }, 888 + Math.random() * 2023);
    })
    return { reject: _reject, then: (...e) => getResult.then(...e) };
  }
  function getNewTimer() {
    const a = Date.now();
    return () => Date.now() - a;
  }
  updateProcess = (in_data) => {
    switch (state) {
      case "running":
        setInText(false, null);
        getProcess().reject();
        // setResult(null);
        setState("running");
        setTimer(getNewTimer());
        setProcess(
          getOutput(in_data)
        );
        getProcess()
          .then((arr) => {
            const ocr_result = arr.map(e => e.ocr_result);
            setResult(ocr_result);
            setState("done");
            setTimer(timer()());
            // setMode(null);
            setLastResult({ index: index, result: ocr_result })
            setInText(true, ocr_result);
            increase();
          }).catch(() => { console.log("cut") })
        return;
      case "done":
      case null:
        setInText(false, null);
        setResult("waiting...");
        setState("running");
        setTimer(getNewTimer());
        setProcess(
          getOutput(in_data)
        );
        getProcess()
          .then((arr) => {
            const ocr_result = arr.map(e => e.ocr_result);
            setResult(ocr_result);
            setState("done");
            setTimer(timer()());
            setLastResult({ index: index, result: ocr_result });
            setInText(true, inputs[index] ?? ocr_result);
            increase();
          }).catch(() => { console.log("cut") })
        return;
      default:
        return;
    }
  }
  // useEffect(() => {

  // }, [index, mode])
  return <div className="out">
    <div className="pic">
      {result && result == "waiting..." ? <div className="loading"></div> :
        <div className="back">Result</div>
      }
    </div>
    <div className="result">
      {/* {(state == 'done' ? lastResult.result : result)?.toString()} */}
      {(state == 'done' && lastResult.result?.map((e, i) => {
        return <p key={i}>{e}</p>
        // const arr = e.split(",").map(e => e.trim());
        // let c = "";
        // switch (arr[2]) {
        //   case "positive":
        //     c = "red"
        //     break;
        //   case "neutral":
        //     c = "green"
        //     break;
        //   case "negative":
        //     c = "gray"
        //     break;
        // }
        // return <div className="line">{[arr[0], arr[1]].join(', ')}{", "}<b style={{ color: c }}>{arr[2]}</b></div>
      }))}
    </div>
    {/* <div className="timer">
      {timer() && (typeof timer() === "function" ? "..." : (timer() ?? NaN) + " ms")}
    </div> */}
  </div>
}
export default Out;