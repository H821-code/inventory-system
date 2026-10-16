import { NavLink } from "react-router-dom";

const MENU_ITEMS = [
  { path: "/inicio", label: "Inicio" },
  { path: "/productos", label: "Productos" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Inventario</div>
      <nav className="sidebar-nav">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
