import react from "react";
import { FaHandPointDown, FaPen  } from "react-icons/fa";

export default function Playground () {
    return(
        <>
        <main className="h-[90vh] md:h-[85vh] w-full font-[Inter] flex items-center justify-center flex-col bg-pink-50">

        
        <h1 className="flex items-center justify-center gap-2 text-3xl">Draw Digit in Canvas <FaPen /></h1>
        <FaHandPointDown className="text-3xl" />
        Canvas
        </main>
        </>
    );
}