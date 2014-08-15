function fsm() {
	var activeState = undefined;

	this.setState = function(state) {
		activeState = state;
	};
	this.update = function(state) {
		if(activeState != undefined) {
			activeState();
		}
	};
}

module.exports = fsm;
