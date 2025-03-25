import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-[16rem] border-r-2 border-[#ffffff] bg-[#000000] text-white hidden md:block">
      <aside>
        <ul className="py-6">
          {[
            { path: "/admin/movies/dashboard", label: "Dashboard" },
            { path: "/admin/movies/create", label: "Create Movie" },
            { path: "/admin/movies/genre", label: "Create Genre" },
            { path: "/admin/movies-list", label: "Update Movie" },
            { path: "/admin/movies/comments", label: "Comments" },
          ].map(({ path, label }) => (
            <li
              key={path}
              className="text-lg hover:bg-linear-to-b hover:transform hover:scale-105 transition-transform duration-500 from-green-500 to-lime-400 rounded-full mb-6"
            >
              <Link to={path} className="block py-2 px-6">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
