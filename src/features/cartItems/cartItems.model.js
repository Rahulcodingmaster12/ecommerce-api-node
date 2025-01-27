
// productID, userID, quantity

export default class CartItemModel{
    constructor(productID, userID, quantity, id){
        this.productID = productID;
        this.userID = userID;
        this.quantity = quantity;
        this.id = id;
    }

    static add(productID, userID, quantity){
        const cartItem = new CartItemModel(
            productID,
            userID,
            quantity
        );
        cartItem.id = cartItems.length + 1;
        cartItems.push(cartItem);
        return cartItem;
    }

    static get(userID){
        return cartItems.filter(u=> u.userID == userID);
    }

    static delete(cartItemID, userID){
        const cartItemIndex = cartItems.findIndex(
            i=> i.id = cartItemID && i.userID == userID
        );

        if(cartItemID<0){
            return 'Item not found';
        }else{
            cartItems.splice(cartItemIndex, 1)
        }
    }
}


var cartItems = [
    new CartItemModel(1, 2, 1, 1),
    new CartItemModel(2, 2, 3, 2),
]