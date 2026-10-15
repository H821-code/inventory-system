function ProductTable({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return <p className="empty">No hay productos registrados todavía.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description || "—"}</td>
              <td>{product.category || "—"}</td>
              <td>Q {Number(product.price).toFixed(2)}</td>
              <td>{product.stock}</td>
              <td className="actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => onEdit(product)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(product)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
