<html>
  <head>
  	<title>NQLiving World v1</title>
    <script src="https://aframe.io/releases/0.8.0/aframe.min.js"></script>
    <script src="https://unpkg.com/aframe-environment-component/dist/aframe-environment-component.min.js"></script>

    <script>
    AFRAME.registerComponent('log', {
      schema: {type: 'string'},

      init: function () {
        var stringToLog = this.data;
        console.log(stringToLog);
        var entityEl = document.querySelector('#body');
        var cycle = 1;
        var count = 0;
        setInterval(function() {
            cycle *= -1;
            if(cycle > 0) {
              entityEl.setAttribute('color', 'yellow');
            } else {
              entityEl.setAttribute('color', 'blue');
            }
            count += 1;
            if(count % 5 == 0) {
              var sceneEl = document.querySelector('a-scene');
              var el = document.createElement('a-sphere');
              el.setAttribute('color', 'red');
              el.setAttribute('radius', '0.5');
              el.setAttribute('position', "-1 "+(.25*count)+" -3");

              sceneEl.appendChild(el);
              console.log("Append sphere");
            }
        }, 3000);
      }
    });
    </script>

    <!-- script type="text/javascript" src="js/boidie.js"></script>
    <script type="text/javascript" src="js/utils.js"></script>
    <script type="text/javascript" src="js/finitestatemachine.js"></script>
    <script type="text/javascript" src="js/chirpchirp.js"></script -->
  </head>
  <body>
    <a-scene>

      <a-text value="Welcome to NQ Living" position="-1 3.5 -3"  color="black"></a-text>
      <a-entity  id="robot">
        <a-box id="body" position="-1 1.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
        <a-sphere position="-1 2.5 -3" radius=".5" color="orange"></a-sphere>
      </a-entity>
      <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>

      <!-- Monument in the distance -->
      <a-cylinder position="1 9 -200" radius="50" height="100" color="#F8D093"></a-cylinder>


      <!-- a-plane position="0 0 -4" rotation="-90 0 0" width="140" height="140" color="#FEF1CE"></a-plane -->
      <a-sky  color="blue"></a-sky>
      <a-box log="Hello, Box!"></a-box>

<?php
$es = array(
	"contact", " egypt", " checkerboard", " forest", " goaland", " yavapai", " goldmine", " threetowers", " poison", " arches", " tron", " japan", " dream", " volcano", " starry", " osiris"
);
$environmentNum = rand(0, count($es)-1);
$environment = $es[$environmentNum];


?>
      <!-- a-entity environment="preset: forest; dressingAmount: 500"></a-entity -->
      <a-entity environment="preset: <?php echo $environment; ?>; dressingAmount: 5"></a-entity>
		<!-- a-light type="ambient" color="#445451"></a-light>
		<a-light type="point" intensity="2" position="2 4 4"></a-light -->
		<a-camera  position="0 1 0">
			<a-cursor></a-cursor>
		</a-camera>
    </a-scene>
  </body>
</html>
