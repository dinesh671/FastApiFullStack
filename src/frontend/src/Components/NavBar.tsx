import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export const NavBar = () => {
  return (
    <section id="header">
      <div className="container flex justify-between items-center px-8 py-4">
        <div className="logo">logo</div>
        <div className="Nav">
          <ul className="flex gap-4">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/orders">Orders</Link>
            </li>
          </ul>
        </div>
        <Link to='/login'>
          <button className=" bg-black px-4 py-2 rounded text-lg text-white flex gap-2 cursor-pointer font-semibold items-center">
            <p>login</p>
            <span>
              <FaRegUserCircle />
            </span>
          </button>
        </Link>
      </div>
    </section>
  );
};
