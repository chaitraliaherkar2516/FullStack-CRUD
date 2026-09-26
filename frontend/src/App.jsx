import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("Other");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api/products/";

  // ================= GET PRODUCTS =================
  const getProducts = () => {
  axios
    .get(API_URL)
    .then((response) => {
      setProducts(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

useEffect(() => {
  getProducts()
}, []);

  // ================= ADD PRODUCT =================
  const addProduct = (e) => {
    e.preventDefault();

    axios
      .post(API_URL, {
        name: name,
        category: category,
        price: price,
        description: description,
      })
      .then(() => {
        alert("Product added successfully!");

        setName("");
        setPrice("");
        setDescription("");
        setCategory("Other");

        getProducts();
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to add product");
      });
  };

  // ================= EDIT PRODUCT =================
  const editProduct = (product) => {
    setEditId(product.id);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditDescription(product.description);
    setEditCategory(product.category || "Other");
  };

  // ================= UPDATE PRODUCT =================
  const updateProduct = (e) => {
    e.preventDefault();

    if (!editId) {
      alert("Please select a product to edit.");
      return;
    }
    const confirmDelete = window.confirm(
  "Are you sure you want to delete this product?"
);

if (!confirmDelete) {
  return;
}

    axios
      .put(`${API_URL}${editId}/`, {
        name: editName,
        category: editCategory,
        price: editPrice,
        description: editDescription,
      })
      .then(() => {
        alert("Product updated successfully!");

        setEditId(null);
        setEditName("");
        setEditPrice("");
        setEditDescription("");
        setEditCategory("Other");

        getProducts();
      })
      .catch((error) => {
        console.log(error.response?.data || error);
        alert("Failed to update product");
      });
  };

  // ================= DELETE PRODUCT =================
  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios
        .delete(`${API_URL}${id}/`)
        .then(() => {
          alert("Product deleted successfully!");
          getProducts();
        })
        .catch((error) => {
          console.log(error);
          alert("Failed to delete product");
        });
    }
  };

  // ================= VIEW PRODUCT =================
  const viewProduct = (product) => {
    setSelectedProduct(product);
  };

  // ================= CLOSE VIEW =================
   const exportCSV = () => {
  const headers = ["Name", "Category", "Price", "Description"];

  const rows = products.map((product) => [
    product.name,
    product.category,
    product.price,
    product.description,
  ]);

  const csvContent = [
    headers,
    ...rows,
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv",
  });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "products.csv";
  a.click();

  window.URL.revokeObjectURL(url);
};
  return (
    <div className="container">
      <h1>Product Management System</h1>

      {/* ================= FORM BOX ================= */}
      <div className="form-box">
        {editId === null ? (
          /* ================= ADD PRODUCT ================= */
          <div>
            <h2>➕ Add Product</h2>

            <form onSubmit={addProduct}>
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                required
              />

              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <label>Category:</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Fan">Fan</option>
                <option value="Mobile">Mobile</option>
                <option value="Laptop">Laptop</option>
                <option value="TV">TV</option>
                <option value="Other">Other</option>
              </select>

              <button type="submit">➕ Add Product</button>
            </form>
          </div>
        ) : (
          /* ================= EDIT PRODUCT ================= */
          <div>
            <h2>✏️ Edit Product</h2>

            <form onSubmit={updateProduct}>
              <input
                type="text"
                placeholder="Product Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                min="0"
                step="0.01"
                required
              />

              <input
                type="text"
                placeholder="Description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
              />

              <label>Category:</label>

              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              >
                <option value="Fan">Fan</option>
                <option value="Mobile">Mobile</option>
                <option value="Laptop">Laptop</option>
                <option value="TV">TV</option>
                <option value="Other">Other</option>
              </select>

              <button type="submit">💾 Update Product</button>

              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setEditName("");
                  setEditPrice("");
                  setEditDescription("");
                  setEditCategory("Other");
                }}
              >
                ❌ Cancel
              </button>
            </form>
          </div>
        )}

        {/* ================= PRODUCT DETAILS ================= */}
        {selectedProduct && (
  <div className="product-details">
    <h2>📦 Product Details</h2>

    <p>
      <strong>Product ID:</strong> {selectedProduct.id}
    </p>

    <p>
      <strong>Name:</strong> {selectedProduct.name}
    </p>

    <p>
      <strong>Price:</strong> ₹{selectedProduct.price}
    </p>

    <p>
      <strong>Category:</strong> {selectedProduct.category}
    </p>

    <p>
      <strong>Description:</strong> {selectedProduct.description}
    </p>

    <button
      type="button"
      onClick={() => setSelectedProduct(null)}
    >
      ❌ Close
    </button>
  </div>
)}
      </div>

      {/* ================= PRODUCT LIST ================= */}
      <h2>📋 Product List</h2>
    <button onClick={exportCSV}>
  📥 Export Products
</button>

      {/* ================= SORT BUTTONS ================= */}
      <div>
        <button onClick={() => setSortOrder("low")}>
          💰 Low → High
        </button>

        <button onClick={() => setSortOrder("high")}>
          💰 High → Low
        </button>

        <button onClick={() => setSortOrder("")}>
          🔄 Reset
        </button>
      </div>

      {/* ================= TOTAL PRODUCTS ================= */}
       <div className="summary">
        <div className="category-summary">
  <h3>📊 Category Summary</h3>

  <p>
    🌀 Fan:{" "}
    {products.filter((product) => product.category === "Fan").length}
  </p>

  <p>
    📱 Mobile:{" "}
    {products.filter((product) => product.category === "Mobile").length}
  </p>

  <p>
    💻 Laptop:{" "}
    {products.filter((product) => product.category === "Laptop").length}
  </p>

  <p>
    📺 TV:{" "}
    {products.filter((product) => product.category === "TV").length}
  </p>

  <p>
    📦 Other:{" "}
    {products.filter((product) => product.category === "Other").length}
  </p>
</div>
  <p>📦 Total Products: {products.length}</p>

  <p>
    💰 Total Value: ₹
    {products
      .reduce((total, product) => total + Number(product.price), 0)
      .toFixed(2)}
  </p>

  <p>
    🛒 Average Price: ₹
    {products.length > 0
      ? (
          products.reduce(
            (total, product) => total + Number(product.price),
            0
          ) / products.length
        ).toFixed(2)
      : "0.00"}
  </p>
</div>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        placeholder="🔍 Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
  type="button"
  onClick={() => {
    setSearch("");
    setSelectedCategory("");
    setSortOrder("");
  }}
>
  🔄 Clear Search & Filter
</button>

      {/* ================= CATEGORY FILTER ================= */}
      <label>Filter by Category:</label>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="Fan">Fan</option>
        <option value="Mobile">Mobile</option>
        <option value="Laptop">Laptop</option>
        <option value="TV">TV</option>
        <option value="Other">Other</option>
      </select>
        {products
  .filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )
  .filter(
    (product) =>
      selectedCategory === "" ||
      product.category === selectedCategory
  ).length === 0 && <p>❌ No products found.</p>}

      {/* ================= PRODUCT DISPLAY ================= */}
      {products
        .filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase())
        )
        .filter(
          (product) =>
            selectedCategory === "" ||
            product.category === selectedCategory
        )
        .sort((a, b) => {
          if (sortOrder === "low") {
            return Number(a.price) - Number(b.price);
          }

          if (sortOrder === "high") {
            return Number(b.price) - Number(a.price);
          }

          return 0;
        })
        .map((product) => (
          <div className="product-card" key={product.id}>
            <h3>{product.name}</h3>

            <p>Price: ₹{product.price}</p>

            <p>
              Category:{" "}
              {product.category?.name || product.category}
            </p>

            <p>Description: {product.description}</p>

            {/* VIEW */}
            <button onClick={() => viewProduct(product)}>
              👁️ View
            </button>

            {/* EDIT */}
            <button onClick={() => editProduct(product)}>
              ✏️ Edit
            </button>

            {/* DELETE */}
            <button onClick={() => deleteProduct(product.id)}>
              🗑️ Delete
            </button>
          </div>
        ))}
    </div>
  );
}

export default App;