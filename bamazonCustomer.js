var inquirer = require('inquirer');
var { ProductManagement } = require('./ProductManagement');
var productManagementObj = new ProductManagement();
var productIds = [];

function success(result) {
    result.forEach(product => {
        productIds.push({value: product.item_id});
        console.log(`Item ID: ${product.item_id}`);
        console.log(`Product name: ${product.product_name}`);
        console.log(`Department Name: ${product.department_name}`);
        console.log(`Price: ${product.price}`);
        console.log('================================================');                
    });

    inquirer.prompt([{
        type: 'list',
        name: 'id',
        message: 'Select the ID of the product they would like to buy.',
        choices: productIds
    },
    {
        type: 'input',
        name: 'quantity',
        message: 'How many units of the product they would like to buy?',
    }]).then(function(data){
        var quantity = parseInt(data.quantity);
        var id = parseInt(data.id);
        
        if(!quantity || !id || isNaN(quantity) || isNaN(id)) {
            console.log('Input is not acceptable!! Try again');
            return false;
        }
        productManagementObj.placeOrder(id, quantity, orderSuccess, insufficientStock);
    });
}

function fail() {
    console.log('Internal Server Error!!');
}

function insufficientStock() {
    console.log('Insufficient quantity!');
}

function orderSuccess(success, quantity, total) {
    if (success) {
        console.log(`An order has been placed for ${quantity} unit(s). ${total}$ USD is deducted from your account.`);
    } else {
        console.log('Order is not completed!! Please call UCB');
    }
}

productManagementObj.getAll(success, fail);