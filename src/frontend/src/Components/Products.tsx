import { useEffect, useState } from "react";
import type products from "../types/product";
import Card from "./Card";
// import type { any } from "zod";

export const Products = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://v9n5l0waei.execute-api.ap-south-1.amazonaws.com/dev/products/",
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        // console.log(result)
        setData(Object.values(result));
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // console.log(data);

  // if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="flex flex-wrap items-center justify-between max-w-7xl gap-4 m-auto">
      {isLoading ? (
        <p>Loading...</p> 
      ) : (
        data.map((items: products) => (
          <Card product={items}/>
        ))
      )}
    </div>
  );
};
