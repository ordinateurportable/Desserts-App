const apiUrl = "http://localhost:3000";

export async function getProducts(uri = "products") {
  const resp = await fetch(`${apiUrl}/${uri}`);
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
    const [product, { price }] = await Promise.all([
    getProductFromCartById(id),
    getProductById(id),
  ]).then((data) => data);

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

  return {
    count: product.count - 1,
    price,
  };

}

export async function makeOrder() {
  const cartResp = await fetch(`${apiUrl}/cart`);
  if (!cartResp.ok) {
    throw new Error("Ошибка оформления заказа");
  }

  const cart = await cartResp.json();

  // Получаем текущий orderId
  const getOrderIdResp = await fetch(`${apiUrl}/orderId`);
  if (!getOrderIdResp.ok) {
    throw new Error("Ошибка оформления заказа");
  }

  const orderIdArr = await getOrderIdResp.json();
  const newOrderId = orderIdArr[0].orderId + 1;
  console.log(newOrderId);

  for (const product of cart) {
    const ordersResp = await fetch(`${apiUrl}/orders`, {
      method: "POST",
      "Content-Type": "application/json",
      body: JSON.stringify({ ...product, orderId: newOrderId }),
    });

    if (!ordersResp.ok) {
      throw new Error("Ошибка оформления заказа2");
    }
  }

  for (const product of cart) {
    const deleteResp = await fetch(`${apiUrl}/cart/${product.id}`, {
      method: "DELETE",
    });
    if (!deleteResp.ok) {
      throw new Error("Ошибка оформления заказа");
    }
  }

  //Обновление orderID
  const orderUpdateResp = await fetch(`${apiUrl}/orderId/1`, {
    method: "PUT",
    "Content-Type": "application/json",
    body: JSON.stringify({ orderId: newOrderId }),
  });

  if (!orderUpdateResp.ok) {
    throw new Error("Ошибка оформления заказа");
  }
}