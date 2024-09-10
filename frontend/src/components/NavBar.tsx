import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="w-60 h-screen bg-white text-gray-500 flex flex-col">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-red-800">DAMISE</h1>
      </div>
      <ul className="flex flex-col p-4 space-y-4">
        <li>
          <Link to="/launches" className="hover:bg-gray-200 p-2 rounded">
            Lansman Listesi
          </Link>
        </li>
        <li>
          <Link to="/gallery" className="hover:bg-gray-200 p-2 rounded">
            Galeri Listesi
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
