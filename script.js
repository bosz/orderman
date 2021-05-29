
(function($) {

    // COMPUTE TOTALS AND DISPLAY IN APPROPRIATE FIELDS
    function calculateTotals(){

        let totalStock = 0;
        let totalValue = 0;

        // STOCKS
        
        $('.quantity-in-stock').each(function(i, obj) {
            totalStock += parseInt($(this).html());
            $('#total-quantity-in-stock').html(totalStock);
        });

        // TOTAL QTY
        $('.total-value-number').each(function(i, obj) {
            totalValue += parseInt($(this).html());
            $('#total-total-value-number').html(totalValue);
        });

    }

    // GENERATE ROW ON TABLE
    function generateRow(result) {
        return `<tr data-order-id=${result.orderId} id="order-row-${result.orderId}">
                    <td class="product-name">${result.productName}</td>
                    <td class="quantity-in-stock">${result.quantityInStock}</td>
                    <td class="price-per-item">${result.pricePerItem}</td>
                    <td class="date-submitted">${result.dateSubmitted}</td>
                    <td class="total-value-number">${result.totalValueNumber}</td>
                    <td><button class="btn btn-info edit-order" data-order-id=${result.orderId}>Edit</button></td>
                </tr>
            `
    }


    // LOAD ALL DATA WHEN PAGE LOADS
    $.ajax({
        type: 'GET', 
        url: 'read.php',
        success: function(results) {
            if (results.length) {
                results.forEach(result => {
                    $('#orders-table tbody').append(generateRow(result));
                });

                calculateTotals()
            }
        }
    })

    // HANDLE SUBMISSION OF NEW DATA
    $('#newItemForm').submit(function(e) {
        e.preventDefault();

        $('#form-error, #productNameError, #quantityInStockError, #pricePerItemError').html('');
        
        let productName = $('#productName').val();
        let quantityInStock = $('#quantityInStock').val();
        let pricePerItem = $('#pricePerItem').val();
        let orderId = $('#orderId').val();
        
        let hasError = false;
        if (productName.length == 0) {
            $('#productNameError').html('Enter a valid product name');
            hasError = true;
        }

        if (!quantityInStock) {
            $('#quantityInStockError').html('Enter a valid quantity in stock');
            hasError = true;
        }

        if (!pricePerItem) {
            $('#pricePerItemError').html('Enter a valid price per item');
            hasError = true;
        }

        if (hasError) {
            $('#form-error').html('Some fields are invalid. Please fill them and resubmit your form.')
            return false; 
        }


        var data = {productName, quantityInStock, pricePerItem, orderId}
        $.ajax({
            type: "POST",
            url: "save.php",
            data: data,
            success: function(result) {
                
                if(!result.updated) { // Created
                    $('#orders-table tbody').append(generateRow(result));
                }else { // Updated
                    let row = $('#order-row-' + result.orderId);
                    row.find('.product-name').html(result.productName)
                    row.find('.quantity-in-stock').html(result.quantityInStock)
                    row.find('.price-per-item').html(result.pricePerItem)
                    row.find('.date-submitted').html(result.dateSubmitted)
                    row.find('.total-value-number').html(result.totalValueNumber)
                }
                // alert('Data inputed succesfully');

                $('#orderId, #productName, #quantityInStock, #pricePerItem').val('');
                calculateTotals();
            },
            error: function(error) {
                console.error('Error raised', error)
                
                if (error.status === 422) {
                    let responseJSON = error.responseJSON;
                    for(index in responseJSON) {
                        $('#' + index + 'Error').html(responseJSON[index]);
                        console.log(index, responseJSON[index]);
                    }

                    return false;
                }

                alert('Something unexpected happened. Contact the system admin if this persists.');

            }
        })

        // console.log(productName, quantityInStock, pricePerItem);
    })


    // PREPARE FORM FOR EDITING WHEN EDIT BUTTON CLICKED
    $('#orders-table').on("click", '.edit-order', function(event) { 
        let orderId = $(this).data('order-id');
        let _parent = $(this).closest('tr');
        let productName = _parent.find('.product-name').html();
        let quantityInStock = _parent.find('.quantity-in-stock').html();
        let pricePerItem = _parent.find('.price-per-item').html();


        $('#productName').val(productName);
        $('#quantityInStock').val(quantityInStock);
        $('#pricePerItem').val(pricePerItem);
        $('#orderId').val(orderId);
        $('#cancel-editing').removeClass('d-none');
    })

    // CANCEL EDITING
    $('#cancel-editing').click(function(e) {
        $('#orderId, #productName, #quantityInStock, #pricePerItem').val('');
        $('#cancel-editing').addClass('d-none');
    })
})(jQuery);