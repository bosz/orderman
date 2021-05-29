
(function($) {
    $.ajax({
        type: 'GET', 
        url: 'read.php',
        success: function(results) {
            if (results.length) {
                results.forEach(result => {
                    $('#orders-table tbody').append(`
                        <tr>
                            <td>${result.productName}</td>
                            <td>${result.quantityInStock}</td>
                            <td>${result.pricePerItem}</td>
                            <td>${result.dateSubmitted}</td>
                            <td>${result.totalValueNumber}</td>
                        </tr>
                    `);
                });
            }
        }
    })



    $('#newItemForm').submit(function(e) {
        e.preventDefault();

        $('#form-error, #productNameError, #quantityInStockError, #pricePerItemError').html('');
        
        let productName = $('#productName').val();
        let quantityInStock = $('#quantityInStock').val();
        let pricePerItem = $('#pricePerItem').val();
        
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


        var data = {productName, quantityInStock, pricePerItem}
        $.ajax({
            type: "POST",
            url: "save.php",
            data: data,
            success: function(result) {
                console.log('Result is ',result)
                $('#orders-table tbody').append(`
                    <tr>
                        <td>${result.productName}</td>
                        <td>${result.quantityInStock}</td>
                        <td>${result.pricePerItem}</td>
                        <td>${result.dateSubmitted}</td>
                        <td>${result.totalValueNumber}</td>
                    </tr>
                `);

                $('#productName, #quantityInStock, #pricePerItem').val('');
                alert('data inputed succesfully');
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
})(jQuery);