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
	$ext = !empty($parts['extension']) ?	strtolower($parts['extension'])	:	'';

	$destFile = $destPath . 'face_' . $parts['filename'] . '.jpg';
	$destNone = $destPath . 'face_' . $parts['filename'] . '.none';

	if(is_file($destFile) || is_file($destNone)) {
		continue;
	}
	if($ext != 'jpg') {
		continue;
	}
	//print_r($parts['filename']);
	//if($key > 10) { break; }
	echo $curFile . NL;
	$result = $face_detect->faceDetect($srcPath . $curFile);
	if($result) {
		$face_detect->toJpeg($destFile);
	} else {
		file_put_contents($destNone, '');
	}
}

?>
