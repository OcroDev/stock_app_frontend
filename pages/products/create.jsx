import { useState } from "react";
import axios from "axios";

const CreateProducts = () => {
  const initialState = {
    name: "",
    price: 0,
  };

  const [product, setProduct] = useState(initialState);

  const handleChange = (e) => {
    const target = e.target;
    const value = e.target.value;
    const name = e.target.name;

    setProduct({ ...product, [name]: value });
  };

  const addProduct = (e) => {
    e.preventDefault();

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProduct(initialState);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container df aic">
      <div className={"df fdc"}>
        <form onSubmit={addProduct} className="formControl">
          <h2>Add a new product</h2>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={product.name}
          />
          <input
            type="number"
            name="price"
            onChange={handleChange}
            value={product.price}
          />
          <button>Add product</button>
        </form>
      </div>
      <div></div>
    </div>
  );
};

export default CreateProducts;
