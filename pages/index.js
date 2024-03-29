import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const baseURI = process.env.NEXT_PUBLIC_BACKEND_URI;

  const initialProductState = {
    name: "",
    price: 0,
  };
  const initialMovementState = {
    type: "Compra",
    quantity: 0,
  };
  const [SelectedProductId, setSelectedProductId] = useState();
  const [product, setProduct] = useState(initialProductState);
  const [movement, setMovement] = useState(initialMovementState);

  const [products, setProducts] = useState([]);

  const getAllProducts = () => {
    const options = {
      method: "GET",
      url: `${baseURI}/products/`,
    };

    axios
      .request(options)
      .then((response) => {
        const { products } = response.data;

        setProducts(products);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllProducts();
  }, []);
  console.log(products);

  const handleProductChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setProduct({ ...product, [name]: value });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const options = {
        method: "POST",
        url: `${baseURI}/products`,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(product),
      };

      const res = await axios.request(options);
      const data = await res.data;
      const newProducts = [data.product, ...products];
      setProducts(newProducts);
      setProduct(initialProductState);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = (id) => {
    console.log(id);
    axios(`${baseURI}/products/${id}`, {
      method: "DELETE",
    }).then((response) => {
      console.log(response.data);
      alert(response.data.message);
      getAllProducts();
    });
  };

  const addMovement = async (e) => {
    e.preventDefault();
    try {
      const options = {
        method: "POST",
        url: `${baseURI}/products/movement/${SelectedProductId}`,
        headers: { "Content-type": "application/json" },
        data: JSON.stringify(movement),
      };
      const res = await axios.request(options);
      const data = await res.data;
      console.log(data);
      setMovement(initialMovementState);
      setSelectedProductId(null);
      getAllProducts();
    } catch (error) {
      console.log(error);
    }
  };
  const handleMovementChange = (e) => {
    const inputValue = e.target.value;
    setMovement({ ...movement, quantity: +inputValue });
  };
  const handleSelectType = (type) => {
    setMovement({ ...movement, type });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Store app</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Link href={"./products/create"}>Create products</Link>
        <h1 className={styles.title}>Welcome to the storage</h1>

        <div className="container df aic">
          <div className={"df fdc"}>
            <form onSubmit={addProduct} className="formControl">
              <h2>Create products</h2>
              <input
                type="text"
                name="name"
                onChange={handleProductChange}
                value={product.name}
              />
              <input
                type="number"
                name="price"
                onChange={handleProductChange}
                value={product.price}
              />
              <button>Add product</button>
            </form>
            <span
              style={{
                maxWidth: "50vw",
                padding: ".5px",
                backgroundColor: "gray",
                margin: "1rem",
              }}
            ></span>
            <form onSubmit={addMovement} className="formControl">
              <h2>Create Stock Movement</h2>
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                {["Compra", "Venta"].map((type) => {
                  return (
                    <div
                      key={type}
                      onClick={() => handleSelectType(type)}
                      style={{
                        marginRight: ".5rem",
                        boxShadow: "2px 2px 6px rgba( 0,0,0,0.3 )",
                        padding: ".5rem",
                        marginBottom: ".5rem",
                        cursor: "pointer",
                        backgroundColor:
                          movement.type === type ? "lightblue" : "white",
                      }}
                    >
                      <span style={{ color: "#000" }}>{type}</span>
                    </div>
                  );
                })}
              </div>

              <input
                type="number"
                name="quantity"
                onChange={handleMovementChange}
                value={movement.quantity}
              />
              <button onClick={addMovement}>Add Movement</button>
            </form>
          </div>

          <div
            style={{
              color: "black",
              maxHeight: "300px",
              padding: "10px",
              width: "100%",
            }}
          >
            <div
              className="df "
              style={{ justifyContent: "space-between", textAlign: "center" }}
            >
              <h3 style={{ margin: "0" }}>Product List</h3>
              <span>
                <b>Store:</b> {products.length}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                overflowY: "scroll",
                maxHeight: "240px",
                justifyContent: "space-between",
              }}
            >
              {products.map((product) => {
                return (
                  <div
                    key={product._id}
                    onClick={() => setSelectedProductId(product._id)}
                    style={{
                      backgroundColor:
                        SelectedProductId === product._id ? "lightblue" : "",
                    }}
                  >
                    <p>
                      <b>Name:</b> {product.name}
                    </p>
                    <p>
                      <b>Price:</b> ${product.price}
                    </p>
                    <p>
                      <b>Stock:</b> {product.stock}
                    </p>
                    <span>{product.deletedAt}</span>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      style={{
                        cursor: "pointer",

                        border: "none",
                      }}
                    >
                      🗑️
                    </button>
                    <hr></hr>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// export async function getServerSideProps() {

//   const options = {
//     method: "GET",
//     url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/products/`,
//   };

//   const products = await axios
//     .request(options)
//     .then(function (response) {
//       return response.data.data;
//     })
//     .catch(function (error) {});

//   return { props: { products } };
// }
