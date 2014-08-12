function identityBank(bar) {
	this.bar = bar;
	this.baz = 'baz'; // default value
}

identityBank.prototype.name = function() {

};

module.exports = identityBank;
