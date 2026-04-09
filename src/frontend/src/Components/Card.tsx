import type products from "../types/product";
import { FcRating } from "react-icons/fc";

export default function Card({ product }: products) {
  return (
    <div className="card w-87.5 flex flex-col items-center gap-6">
      <div className="card_upper w-2/3 h-1/2">
        <img src={product.image} alt="img" className=" w-full h-full" />
      </div>
      <div className="card_content h-1/2">
        <div className=" font-bold text-lg">{product.title}</div>
        <div className="rating_container flex gap-2">
          <div className=" flex items-center gap-1 ">
            <FcRating />
            <p>{product.rating.rate}</p>
          </div>
          <div className="count">({product.rating.count})</div>
        </div>
        <div className="flex gap-4 my-4 w-full">
          <button className=" cursor-pointer w-4/5 text-white py-2 px-3 font-medium rounded hover:drop-shadow-amber-300 bg-blue-500">
            Add to Cart
          </button>
          <button className="cursor-pointer w-4/5 text-lg py-2 px-3 font-medium rounded hover:drop-shadow-amber-300 bg-emerald-600 text-white">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
