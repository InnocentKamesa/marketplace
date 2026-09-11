function generateTxRef(orderNumber){
    if(!orderNumber){
        throw new Error("Failed to generate tx ref: Unknown order number")
    }
    const random = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

    return `TX-${orderNumber}-${random}`
}

export default generateTxRef;

