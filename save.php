<?php

    header('Content-Type: application/json');

    $productName = $_POST['productName'];
    $quantityInStock = $_POST['quantityInStock'];
    $pricePerItem = $_POST['pricePerItem'];
    $orderId = !empty($_POST['orderId']) ? $_POST['orderId'] : md5(date('Y-m-d h:i'));

    $errorBag = [];
    if (!$productName) {
        $errorBag['productName'] = 'Invalid product name';
    }
    
    if (!$quantityInStock) {
        $errorBag['quantityInStock'] = 'Invalid product name';
    }
    
    if (!$pricePerItem) {
        $errorBag['pricePerItem'] = 'Invalid product name';
    }
    
    if (sizeof($errorBag)) {
        http_response_code(422);
        echo json_encode($errorBag);
        return true;
    }

    $newOrder = [
        'orderId' => $orderId,
        'productName' => $productName,
        'quantityInStock' => $quantityInStock,
        'pricePerItem' => $pricePerItem,
        'dateSubmitted' => date('Y-m-d h:i'), 
        'totalValueNumber' => $quantityInStock * $pricePerItem,
    ];

    $fileContent = file_get_contents('./data.json'); 
    $orders = (array)json_decode($fileContent);
    
    if (!empty($_POST['orderId']) ) { // Updating order

        $updatedOrders = []; 
        foreach($orders as $order) {
            $updatedOrders[] = $order->orderId == $newOrder['orderId'] ? $newOrder : $order;
        }
        $orders = $updatedOrders;
        // array_walk($orders, function(&$order) use ($newOrder) { 
        //     if ($order->orderId == $newOrder['orderId']) {
        //         $order = $newOrder;
        //     }
        // });
        $newOrder['updated'] = true;
    }else { // New order
        $orders[] = $newOrder;
        $newOrder['updated'] = false;
    }
    
    $fp = fopen('./data.json', 'w');
    fwrite($fp, json_encode($orders));

    echo json_encode($newOrder);
