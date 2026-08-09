'use client';
export function QuantitySelector({value,onChange}:{value:number;onChange:(v:number)=>void}){return <div className="inline-flex items-center rounded border"><button className="px-3 py-1" onClick={()=>onChange(Math.max(1,value-1))}>−</button><span className="px-3">{value}</span><button className="px-3 py-1" onClick={()=>onChange(Math.min(99,value+1))}>+</button></div>}
