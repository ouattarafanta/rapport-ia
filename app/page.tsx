'use client';


import { useState } from "react";

function Compteur() {
  const [count, setCount] = useState(0);
  
    console.log("Composant exécuté");

  return (
    
    <button onClick={() => setCount(count + 1)} >
      
      {count}
      
    </button>
  );
}





export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     <h1>Bonjour</h1>
    </div>
  );
}
