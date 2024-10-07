"use client";
import catBg from "../../../../public/cat_bg.png";
import { useRouter } from "next/navigation";
import PopupForm from "./NewSittingRequest";


export default function OwnerPage() {
  
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
              className="h-14 w-36 bg-white border border-black rounded-full mx-10 justify-end"
              onClick={() => {
                router.push("./owner");
              }}
            >
              Owners
            </button>
            <button
              className="h-14 w-36 border border-black rounded-full mx-10 justify-end"
              onClick={() => {
                router.push("./sitter");
              }}
            >
              Sitters
            </button>
          </div>
        </div>
      </section>
      <PopupForm />

      {/* <div class="max-w-sm rounded overflow-hidden shadow-lg">
          <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
            <p class="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
            </p>
          </div>
          <div class="px-6 pt-4 pb-2">
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
          </div>
          </div> */}
    </div>
  );
}
