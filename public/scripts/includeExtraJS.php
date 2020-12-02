<?php $out = array();
foreach (glob('scripts/*.js') as $filename) {
    $p = pathinfo($filename);
    $out[] = $p['filename'];
}
echo json_encode($out); ?>