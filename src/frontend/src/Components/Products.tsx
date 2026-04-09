import { useEffect, useState } from "react";
import type products from "../types/product";
import Card from "./Card";

export const Products = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/product/getproducts",
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
