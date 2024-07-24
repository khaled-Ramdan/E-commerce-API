export const stringToFloat = (mystring, defaultvalue) => {
    let float = parseFloat(mystring)

    if (isNaN(float) || float <= 0) {
        float = defaultvalue
    }
    return float
}


export const paymentMailHTML = (order, payment) => {
    const message = `
                
        <h1>Order name: ${order._id}</h1>
        <h2> Shipping Address : ${order.shippingAddress.street}, ${
            order.shippingAddress.city
        }, ${order.shippingAddress.state}, ${order.shippingAddress.country}</h2>

        <p>
            <h2>Items : </h2> 
                ${order.items
                    .map(
                        (item) =>
                            `<h3>name: ${item.product.name}</h3> <h4>description: ${item.product.description}</h4> <h4>quantity: ${item.quantity}</h4>`
                    )
                    .join("")}

        </p>

        <h3>payment Id: ${payment._id} </h3>
        <h3>amount: ${payment.amount_total} ${payment.currency}</h3>
        <h3>status: ${payment.status} </h3>
        <h3>payment status: ${payment.payment_status} </h3>
        
    `
    return message
}