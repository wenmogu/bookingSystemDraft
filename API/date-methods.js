class newDate extends Date {
	static datesHyphenString(nDays) {
		function helper(emptyarr, n) {
			if (n > -1) {
				return helper(emptyarr.concat([new newDate().addDays(n).toHyphenString()]), n-1);
			} else {
				return emptyarr;
			}
		}
		return helper([], nDays);
	}
}
newDate.prototype.addDays = function(days) {
    var dat = new newDate(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

newDate.prototype.toHyphenString = function() {
	// console.log("whats this: ", JSON.stringify(this));
	var dat = new newDate(this.valueOf());
	var arr = dat.toLocaleDateString().split('/');
	var ar = [];
	ar[0] = arr[2];
	ar[1] = arr[0];
	ar[2] = arr[1];
	var str = ar.join('-');
	return str;
}



module.exports = newDate