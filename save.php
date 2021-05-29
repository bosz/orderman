<?php

    header('Content-Type: application/json');

    $productName = $_POST['productName'];
    $quantityInStock = $_POST['quantityInStock'];
    $pricePerItem = $_POST['pricePerItem'];

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

    $data = [
        'productName' => $productName,
        'quantityInStock' => $quantityInStock,
        'pricePerItem' => $pricePerItem,
        'dateSubmitted' => date('Y-m-d h:i'), 
        'totalValueNumber' => $quantityInStock * $pricePerItem,
    ];

    $fileContent = file_get_contents('./data.json'); 
    $orders = json_decode($fileContent);
    
    $orders[] = $data;

    $fp = fopen('./data.json', 'w');
    fwrite($fp, json_encode($orders));


    echo json_encode($data);
    // print_r($orders);
