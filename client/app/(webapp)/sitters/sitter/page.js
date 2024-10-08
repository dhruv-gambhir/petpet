"use client";
import catBg from "../../../../public/cat_bg.png";
import { useRouter } from "next/navigation";

export default function SitterPage() {

  const router = useRouter(); 

  return (
    <div>
      <section className="relative w-screen h-28 bg-left flex flex-row items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${catBg.src})`,
            backgroundSize: "100% 150%",
            backgroundPosition: "bottom",
            opacity: "0.4",
          }}
        ></div>
        <div className="relative flex flex-row justify-between items-center w-full z-10">
          <div className="mx-10">
            <p className="text-xl text-black font-bold">
              Find the purrfect match for all your pet needs
            </p>
          </div>
          <div>
            <button
              className="h-14 w-36 border border-black rounded-full mx-10 justify-end"
              onClick={() => {
                router.push("./owner");
              }}
            >
              Owners
            </button>
            <button
              className="h-14 w-36 bg-white border border-black rounded-full mx-10 justify-end"
              onClick={() => {
                router.push("./sitter");
              }}
            >
              Sitters
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}