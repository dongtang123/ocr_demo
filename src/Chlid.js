import React, { useState, useEffect } from 'react'

// class App extends React.Component {
//   render() {
//     return(
//       <div>
//         <h1>Hello World</h1>
//       </div>
//     )
//   }
// }
function Chlid(props) {
  const [val, setVal] = useState(0);
  useEffect(()=>{
    // console.log(props)
    setTimeout(
      props.f1, 500);
    // console.log("change");
  })
  return (<div>
    <div >{props.p1}</div>
  </div>)
}

export default Chlid