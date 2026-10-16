import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productApi";

const LOW_STOCK_LIMIT = 5;

function Inicio() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0);
  const inventoryValue = products.reduce(
    (sum, product) => sum + Number(product.price) * product.stock,
    0,
  );
  const totalCategories = new Set(
    products.map((product) => product.category).filter(Boolean),
  ).size;
  const lowStockProducts = products.filter(
    (product) => product.stock <= LOW_STOCK_LIMIT,
  );

  return (
    <section>
      <header className="page-header">
        <h1>Inicio</h1>
      </header>

      <p className="welcome">Resumen general de tu inventario.</p>

      <div className="stats">
        <div className="stat-card">
          <span className="stat-label">Productos</span>
          <span className="stat-value">{products.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Categorías</span>
          <span className="stat-value">{totalCategories}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Unidades en stock</span>
          <span className="stat-value">{totalUnits}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Valor del inventario</span>
          <span className="stat-value">Q {inventoryValue.toFixed(2)}</span>
        </div>
      </div>

      <div className="panel">
        <h2>Stock bajo (hasta {LOW_STOCK_LIMIT} unidades)</h2>
        {lowStockProducts.length === 0 ? (
          <p className="panel-ok">
            Todo en orden: no hay productos por reponer.
          </p>
        ) : (
          <ul className="low-stock-list">
            {lowStockProducts.map((product) => (
              <li key={product.id} className="low-stock-item">
                <span>{product.name}</span>
                <span className="badge-warning">{product.stock} en stock</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link to="/productos" className="btn btn-primary">
        Ir a productos
      </Link>
    </section>
  );
}

export default Inicio;
