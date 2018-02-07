var { connectionPool } = require('./connectionPool');

function ProductManagement() {
    
    var getQuantity = function(id, quantity, orderSuccess, insufficientStock, checkQuantityAndPlaceOrder) {
        connectionPool.getConnection(function(err, connection) {
            connection.query("SELECT stock_quantity, price FROM products WHERE item_id = ?",
                [ id ],
                function(error, result) {
                    var stock = 0;
                    var price = 0;
                    
                    if (result && result.length) {               
                        stock = result[0].stock_quantity;
                        price = result[0].price;                        
                    }

                    checkQuantityAndPlaceOrder(id, quantity, stock, price, orderSuccess, insufficientStock);
                    connection.release();                    
                });
        });
    };

    var checkQuantityAndPlaceOrder = function(id, quantity, stock, price, orderSuccess, insufficientStock) {
        if (quantity > stock) {
            insufficientStock();
            return;
        }

        updateInventory(id, stock, quantity, price, orderSuccess);
    };
    
    var updateInventory = function(id, stock, quantity, price, orderSuccess) {
        connectionPool.getConnection(function(err, connection) {        
            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",
                [ stock - quantity, id ],
                function(error, result) {
                    if(error) {
                        orderSuccess(false);
                    }

                    if (result && result.changedRows === 1) {
                        var total =  quantity * price;             
                        orderSuccess(true, quantity, total);
                    } else {
                        orderSuccess(false);
                    }

                    connection.release();            
                });
            });
    };

    this.getAll = function(success, fail) {
        connectionPool.getConnection(function(err, connection) {
            connection.query("SELECT item_id, product_name, department_name, price FROM products",
            function(error, result) {
                if(error) {
                    fail();
                }
    
                if (result && result.length) {               
                    success(result);
                } else {
                    fail();
                }
                connection.release();
            });
        });
    };

    this.placeOrder = function(id, quantity, orderSuccess, insufficientStock) {        
        getQuantity(id, quantity, orderSuccess, insufficientStock, checkQuantityAndPlaceOrder);
    };
}

module.exports = {
    ProductManagement
};