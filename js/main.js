function setupChromosome() {
//$(document).ready(function() {
	//var myAnt = new ant();
	chromosomes['looks'] = new chromosome('looks');
	chromosomes['looks'].addGene('EyesBrownBlue', 'Aa');
	chromosomes['looks'].addGene('HairBrownBlond', 'AA');
	chromosomes['speed'] = new chromosome('speed');
	chromosomes['personality'] = new chromosome('personality');
	console.log(chromosomes);
	chromosomes['looks'].addInputs();
//});
}

function addCreatures() {
	if(false) {
		creaturesRef.update({
			c3: {
				name: "Harry",
				gender: "m",
				alive: 1,
				birthTime: getLinuxTime(),
				temperature: parseInt(Math.nrand(75, 5)),
				chromosomes: {
					looks: {
						EyesBrownBlue: "AA",
						HairBrownBlond: "AA",
					},
					speed: {},
					personality: {}
				}
			},
		});
	} else {
		creaturesRef.push(
			{
				name: "Pam",
				gender: "f",
				alive: 1,
				birthTime: getLinuxTime(),
				temperature: parseInt(Math.nrand(75, 5)),
				chromosomes: {
					looks: {
						EyesBrownBlue: "AA",
						HairBrownBlond: "AA",
					},
					speed: {},
					personality: {}
				}
			}
		);

	}
}
