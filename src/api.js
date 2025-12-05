// const apiURL = "http://localhost:3000"

// export async function getProducts() {
//         const resp = await fetch(`${apiURL}/products`); 
//         if(!resp.ok) {
//             throw new Error("Ошибка получения товаров")
//         }
//         const data = await resp.json();
//         return data;
// } 

// export async function getProductByID(id) {
//     const resp = await fetch(`${apiURL}/products/${id}`)
//     if(!resp.ok) {
//         return null
//     }
//     const data = await resp.json()
//     return data
// }

// export async function getProductFromCartByID(id) {
//     const resp = await fetch(`${apiURL}/cart/${id}`)

//     if(!resp.ok) {
//         return null
//     } else {
//         const data = await resp.json()
//         return data
//     }
// }

// async function addProductToCartFirst(id)  {
//     const resp = await fetch(`${apiURL}/cart`, {
//     method: "POST",
//     "Content-Type": "application/json", 
//     body: JSON.stringify({id, count: 1})
//     })

//     if(!resp.ok) {
//         throw new Error("Ошибка добавления товара")
//     }
//  }

//  async function updateCartProductCount(id, count) {
//     const resp = await fetch (`${apiURL}/cart/${id}`, {
//         method: "PATCH", 
//         "Content-type": "application/json",
//         body: JSON.stringify({count}),
//     })

//     if(!resp.ok) {
//         throw new Error("Ошибка выполнения запроса")
//     }
//  }

//  export async function addProductToCart(id) {
//     const data = await getProductByID(id)   

//     const productInCart = await getProductFromCartByID(id)

//     if(!productInCart) {
//         await addProductToCartFirst(id)
//     } else {
//         const count = productInCart.count
//         await updateCartProductCount(id, count + 1)
//         return {...data, count: count + 1}
//     }
// }

// export async function removeProductFromCart(id) {
//     const product = await getProductFromCartByID(id)
//     if(product.count === 1) {
//         const resp = await fetch(`${apiURL}/cart/${id}`, {
//             method: "DELETE"
//         })

//         if(!resp.ok) {
//             throw new Error("Ошибка удаления товара")
//         }

//     } else if (product.count > 1) {
//         await updateCartProductCount(id, product.count - 1)
//     }
    
// }

const apiUrl = "http://localhost:3000";

export async function getProducts() {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });

  const resp = await fetch(`${apiUrl}/products`);
  if (!resp.ok) {
    throw new Error("Ошибка получения товаров");
  }
  const data = await resp.json();
  return data;
}

export async function getProductById(id) {
  const resp = await fetch(`${apiUrl}/products/${id}`);
  if (!resp.ok) {
    throw new Error("Ошибка добавления товара");
  }
  const data = await resp.json();
  return data;
}

export async function getProductFromCartById(id) {
  const resp = await fetch(`${apiUrl}/cart/${id}`);
  // 200 - {id:1,count:2}
  // 404

  if (!resp.ok) {
    return null;
  } else {
    const data = await resp.json();
    return data;
  }
}

async function addProductToCartFirst(id) {
  const resp = await fetch(`${apiUrl}/cart`, {
    method: "POST",
    "Content-Type": "application/json",
    body: JSON.stringify({ id, count: 1 }),
  });

  if (!resp.ok) {
    throw new Error("Ошибка добавления товара");
  }
}

async function updateCartProductCount(id, count) {
  const resp = await fetch(`${apiUrl}/cart/${id}`, {
    method: "PATCH",
    "Content-Type": "application/json",
    body: JSON.stringify({ count }),
  });

  if (!resp.ok) {
    throw new Error("Ошибка выполнения операции");
  }
}

//REFACTOR
export async function addProductToCart(id) {
  const data = await getProductById(id);

  const productInCart = await getProductFromCartById(id);

  if (!productInCart) {
    await addProductToCartFirst(id);
    return { ...data, count: 1 };
  } else {
    const count = productInCart.count;
    await updateCartProductCount(id, count + 1);
    return { ...data, count: count + 1 };
  }
}

export async function removeProductFromCart(id) {
  const product = await getProductFromCartById(id);
  if (product.count === 1) {
    const resp = await fetch(`${apiUrl}/cart/${id}`, {
      method: "DELETE",
    });

    if (!resp.ok) {
      throw new Error("Ошибка удаления товара");
    }
  } else if (product.count > 1) {
    await updateCartProductCount(id, product.count - 1);
  }
}