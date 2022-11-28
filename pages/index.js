import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const initialState = {
    name: "",
    price: 0,
  };
  const [product, setProduct] = useState(initialState);

  const [products, setProducts] = useState([]);

  const getAllProducts = () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URI}/products/`,
    };

    axios
      .request(options)
      .then((response) => {
        const { data } = response.data;
        console.log(data);
        setProducts(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setProduct({ ...product, [name]: value });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );
      const data = await res.json();
      console.log({ data });
      setProduct(initialState);
      getAllProducts();
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Link href={"./products/create"}>Create products</Link>
        <h1 className={styles.title}>Welcome to the storage</h1>

        <div className="container df aic">
          <div className={"df fdc"}>
            <form onSubmit={addProduct} className="formControl">
              <h2>Search products</h2>
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

          <div
            style={{
              color: "black",
              maxHeight: "300px",
              padding: "10px",
            }}
          >
            <h3>Product List</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                overflowY: "scroll",
                maxHeight: "250px",
                justifyContent: "space-between",
              }}
            >
              {products.map((product, index) => {
                return (
                  <div key={index}>
                    <p>
                      <b>Name:</b> {product.name}
                    </p>
                    <p>
                      <b>Price:</b> ${product.price}
                    </p>
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
