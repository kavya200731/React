import { useState } from "react";
function Master()
{
    const [sample , setName]=useState("Travel");
    return (
       <> <h1>{sample}</h1>
        <button style={{width:"fit-content"}}
        onDoubleClick={()=>setName("Journey")}
        >Change</button>
        </>
    );
}
function Classic()
{
    const [count, setCount]=useState(0);
    return (
        <>
        <h1> Count:{count}</h1>
        <button
        style={{width:"fit-content"}}
        onClick={()=>setCount(count + 1)}
        >Count+</button>
        <button
        style={{width:"fit-content"}}
        onClick={()=>setCount(count - 1)}
        >Count-</button>
        <Master></Master>
        </>
    );
}
export default Classic;