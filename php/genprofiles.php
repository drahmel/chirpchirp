<?php

define('ROOT', '/Users/Dan.Rahmel/Sites/chirpchirp/');
define('NL', "\n");
require_once(ROOT . "vendor/facedetector/FaceDetector.php");
$srcPath = ROOT . "etc/INTLFACE/";
$destPath = ROOT . 'scratch/';

$face_detect = new FaceDetector(ROOT . "vendor/facedetector/detection.dat");

$files = scandir($srcPath);
foreach($files as $key => $curFile) {
	$parts = pathinfo($curFile);
	$ext = !empty($parts['extension']) ?	strtolower($parts['extension']	:	'';
	print_r($parts);
	if($key > 10) {
		break;
	}
	echo $curFile . NL;
}
//$face_detect->faceDetect('sample-image1.jpg');
//$face_detect->toJpeg('face1.jpg');

?>
