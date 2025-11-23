const apiURL = "http://localhost:3000"

export async function getProducts() {
    try {
        const resp = await fetch(`${apiURL}/products`); 
        if(!resp.ok) {
            throw new Error("Ошибка получения товаров")
        }
        const data = await resp.json();
        return data;
    }
    catch(error) {
        alert(error.message)
    }
} 

export async function getProductByID(id) {
    const resp = await fetch(`${apiURL}/products/${id}`)
    if(!resp.ok) {
        throw new Error("Ошибка добавления товара")
    }
    const data = await resp.json()
    return data
}

export async function getProductFromCartByID(id) {
    const resp = await fetch(`${apiURL}/cart/${id}`)

    if(!resp.ok) {
        return null
    } else {
        const data = await resp.json()
        return data
    }
}


export async function addProductToCart(id) {
    const data = await getProductByID(id)   

    const productInCart = await getProductFromCartByID(id)

    if(!productInCart) {
        const resp = await fetch(`${apiURL}/cart`, {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify({id, count: 1})
        })
        if(!resp.ok) {
            throw new Error("Ошибка добавления товара")
        }

        return data
    } else {
        const resp = await fetch(`${apiURL}/cart/${id}`, {
            method: "PATCH",
            "Content-Type": "application/json", 
            body: JSON.stringify({count: 3})
        })
        if(!resp.ok) {
            throw new Error("Ошибка добавления товара")
        }
    }
}

