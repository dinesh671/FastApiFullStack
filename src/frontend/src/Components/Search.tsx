import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function Search() {
  const [query, setQuery] = useState("");
  const [rawQuery, setRawQuery] = useState("");

  const [productData, setProductData] = useState([]);
  let [visible,setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(rawQuery);
    }, 500); // 500ms delay

     return () => {
      clearTimeout(timer);
    };
  }, [rawQuery]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProductData(
          data.products,
        );
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        return [];
      });
  }, [query]);

  return (
    <div className="h-screen bg-linear-to-br from-[#0d1b2a] via-[#1b263b] via-[#3a0ca3] to-[#4cc9f0] flex flex-col pt-20">
      {/* Wrapper to align Search Bar and Suggestion Box */}
      <div className="w-full max-w-2xl mx-auto relative group">
        {/* Gemini-style Glassmorphism Search Bar */}
        <div className="flex justify-between items-center shadow-2xl rounded-2xl h-14 bg-white/10 backdrop-blur-xl border border-white/10 px-4 focus-within:border-[#4cc9f0]/50 transition-all duration-300">
          {/* Input Field */}
          <input
            type="text"
            name="searchBar"
            id="search"
            placeholder="Ask or search anything..."
            className="outline-none h-full w-5/6 bg-transparent text-white placeholder-slate-400 text-lg border-none focus:ring-0"
            onChange={(e) => setRawQuery(e.target.value)}
            onClick={() => setVisible(true)}
          />

          {/* Search Action Button */}
          <button className="bg-gradient-to-r from-[#4361ee] to-[#4cc9f0] hover:opacity-90 h-10 w-12 rounded-xl flex justify-center items-center transition-all duration-200 shadow-md shadow-[#4361ee]/20">
            <FaSearch className="text-white text-base" />
          </button>
        </div>
        {visible &&
          productData.length > 0 &&
          (
            <div className="absolute left-0 right-0 mt-3 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 transition-all duration-200">
              <ul className="py-2">
                {productData.map((product:any)=>{
                  return (
                    <li>
                      <button className="w-full text-left px-5 py-3 text-white/90 text-base hover:bg-white/10 flex items-center gap-3 transition-colors duration-150">
                        <span>{product.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
         )}
        {/* Suggestion Box Popover */}
        {/* {query.length > 0 && filteredSuggestions.length > 0 && (
         
        )} */}
      </div>
    </div>
  );
}
