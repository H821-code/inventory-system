import { useState } from "react";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
};

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "El nombre es obligatorio";
  }

  const price = Number(values.price);
  if (values.price === "" || Number.isNaN(price) || price <= 0) {
    errors.price = "El precio debe ser un número mayor a 0";
  }

  const stock = Number(values.stock);
  if (values.stock === "" || !Number.isInteger(stock) || stock < 0) {
    errors.stock = "El stock debe ser un entero mayor o igual a 0";
  }

  return errors;
}

function ProductForm({ product, onSubmit, onCancel, serverErrors = {} }) {
  const [values, setValues] = useState(
    product
      ? {
          name: product.name,
          description: product.description ?? "",
          price: String(product.price),
          stock: String(product.stock),
          category: product.category ?? "",
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      name: values.name.trim(),
      description: values.description.trim() || null,
      price: Number(values.price),
      stock: Number(values.stock),
      category: values.category.trim() || null,
    });
  };

  const fieldError = (field) => errors[field] ?? serverErrors[field];

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2>{product ? "Editar producto" : "Nuevo producto"}</h2>

      <label>
        Nombre *
        <input name="name" value={values.name} onChange={handleChange} />
        {fieldError("name") && (
          <span className="error">{fieldError("name")}</span>
        )}
      </label>

      <label>
        Descripción
        <textarea
          name="description"
          rows="3"
          value={values.description}
          onChange={handleChange}
        />
        {fieldError("description") && (
          <span className="error">{fieldError("description")}</span>
        )}
      </label>

      <div className="form-row">
        <label>
          Precio *
          <input
            name="price"
            type="number"
            step="0.01"
            value={values.price}
            onChange={handleChange}
          />
          {fieldError("price") && (
            <span className="error">{fieldError("price")}</span>
          )}
        </label>

        <label>
          Stock *
          <input
            name="stock"
            type="number"
            step="1"
            value={values.stock}
            onChange={handleChange}
          />
          {fieldError("stock") && (
            <span className="error">{fieldError("stock")}</span>
          )}
        </label>
      </div>

      <label>
        Categoría
        <input
          name="category"
          placeholder="Ej. Electrónica, Ropa, Alimentos"
          value={values.category}
          onChange={handleChange}
        />
        {fieldError("category") && (
          <span className="error">{fieldError("category")}</span>
        )}
      </label>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          {product ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
