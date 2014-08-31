function chromosome(type) {
	this.type = type;
	this.genes = {};
	this.addGene = function(name, gene) {
		this.genes[name] = gene;
	};
	this.getGenes = function() {
		return this.genes;
	}
	this.addInputs = function() {
		for(var i in this.genes) {
			$("<div>"+i +"<input name='"+i+"' value='"+this.genes[i]+"' /></div>").appendTo("#txtMessage");
		}
	}
}

