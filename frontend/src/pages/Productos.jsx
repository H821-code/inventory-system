import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../api/productApi";
import ConfirmDialog from "../components/ConfirmDialog";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";

function Productos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [serverErrors, setServerErrors] = useState({});
  const [productToDelete, setProductToDelete] = useState(null);

  const loadProducts = async () => {
    try {
      setProducts(await getProducts());
      setErrorMessage("");
    } catch {
      setErrorMessage(
        "No se pudo cargar el inventario. Verifica que el backend esté activo.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateForm = () => {
    setEditingProduct(null);
    setServerErrors({});
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setServerErrors({});
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      closeForm();
      await loadProducts();
    } catch (error) {
      setServerErrors(error.fieldErrors ?? {});
      setErrorMessage(error.message);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
      await loadProducts();
    } catch (error) {
      setErrorMessage(error.message);
      setProductToDelete(null);
    }
  };

  return (
    <section>
      <header className="page-header">
        <h1>Productos</h1>
        <button className="btn btn-primary" onClick={openCreateForm}>
          + Nuevo producto
        </button>
      </header>

      {errorMessage && <div className="alert">{errorMessage}</div>}

      {isFormOpen && (
        <ProductForm
          key={editingProduct?.id ?? "new"}
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          serverErrors={serverErrors}
        />
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ProductTable
          products={products}
          onEdit={openEditForm}
          onDelete={setProductToDelete}
        />
      )}

      {productToDelete && (
        <ConfirmDialog
          message={`¿Seguro que deseas eliminar "${productToDelete.name}"? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setProductToDelete(null)}
        />
      )}
    </section>
  );
}

export default Productos;
