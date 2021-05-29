<?php
    header('Content-Type: application/json');
    $fileContent = file_get_contents('./data.json'); 
    echo $fileContent;

