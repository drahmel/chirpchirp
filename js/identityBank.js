function identityBank(bar) {
	this.bar = bar;
	this.blank = {
		firstName: '',
		lastName: '',
		category: '',
		bio: '',
		interestes: '',
	};
}

identityBank.prototype.name = function() {

};

module.exports = identityBank;
