<?php

define('ROOT', '/Users/Dan.Rahmel/Sites/chirpchirp/');
require_once(ROOT . "vendor/facedetector/FaceDetector.php");

$face_detect = new FaceDetector(ROOT . "vendor/facedetector/detection.dat");
$face_detect->faceDetect('sample-image1.jpg');
$face_detect->toJpeg('face1.jpg');

?>
