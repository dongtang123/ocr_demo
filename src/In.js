import React, { Fragment, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { updateProcess } from "./Out";
function In({ index, getInText, InText, inputs, handleNext, handlePrev, results }) {
    // const [nowIn, setNowIn] = useState(null);
    // useEffect(() => {
    //     if (index === null) {
    //         nowIn && setNowIn(null);
    //     }
    //     else {
    //         setNowIn("Loading");
    //         const img = new Image();
    //         img.onload = () => {
    //             setNowIn({
    //                 src: imgSrc[index],
    //                 img: <img src={imgSrc[index]} />,
    //                 info: `${img.src.slice(img.src.lastIndexOf('/') + 1)} ${img.width}×${img.height}`
    //             })
    //         }
    //         img.src = imgSrc[index];
    //     }
    // }, [index])
    return <div className="in">
        <div className="pic">
            <div className="back">Modify</div>
        </div>
        <div className="in-display">
            <InText></InText>
            {inputs.length !== 0 && <div className="btns">
                <div className="btn" onClick={() => {
                    handlePrev();
                }
                }>上一个({(index - 1) >= 0 ? index - 1 : inputs.length - 1})</div>
                <div className="btn" onClick={() => {
                    handleNext();
                }
                }>下一个({(index + 1) < inputs.length ? index + 1 : 0})</div>
                <div className="btn submit" onClick={() => {
                    const intext = inputs[index] = getInText();
                    if (intext.length) {
                        // updateProcess(document.getElementById("inText").innerText);
                        // const options = {
                        //     method: 'POST',
                        //     headers: {'content-type': 'application/json'},
                        //     body: '{"text":"This is a sentence"}'
                        //   };
                        Promise.allSettled(results.map((e, i) => ({ query_id: e.query_id, text: inputs[i] ?? e.ocr_result }))
                            .map(({ query_id, text }) =>
                                fetch("http://127.0.0.1:5000/cor/" + query_id, {
                                    method: "POST",
                                    headers: { 'content-type': 'application/json' },
                                    body: JSON.stringify({ text })
                                }))).then(()=>alert(inputs.length+"modifications have been submitted"))
                        // alert("提交修改：" + inputs);
                    }
                    else alert("请输入内容后再进行提交操作。")

                }
                }>提交</div>
            </div>}
            {/* {(() => {
                if (nowIn === null) {
                    return <>
                        <div className="pic">
                        </div>
                        <div className="info">
                            {"选择一张图片输入"}
                        </div>
                    </>
                }
                if (nowIn === "Loading") {
                    return <>
                        <div className="pic">
                        </div>
                        <div className="info">
                            {"loading..."}
                        </div>
                    </>
                }
                return <>
                    <div className="pic">
                        {nowIn.img}
                    </div>
                    <div className="info">
                        {nowIn.info}
                    </div>
                </>
            })()} */}
            {/* <div className="mode">
                {Object.keys(modeMap).map(e =>
                    <button key={e} disabled={index===null} onClick={() => setMode(e)} className={mode == e ? "active" : ""}>{modeMap[e].ch}</button>
                )}
            </div> */}
        </div>
        {/* <div className="in-select">
            {imgSrc.map((src, i) => <div key={i} className={"in-select-option" + ((i == index) ? " " + "selected" : "")} >
                <img src={src} onClick={() => setIndex(i)} />
            </div>)}
        </div> */}
    </div>
}
export default In;