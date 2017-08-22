/*
> d.toString();
'Sat Aug 05 2017 16:57:06 GMT+0800 (Malay Peninsula Standard Time)'
> d.toLocaleDateString();
'8/5/2017'
> d.toLocaleString();
'8/5/2017, 4:57:06 PM'
> d.toDateString();
'Sat Aug 05 2017'
> d.toTimeString();
'16:57:06 GMT+0800 (Malay Peninsula Standard Time)'
*/
class newDate extends Date {
	static datesHyphenString(nDays) {
		const arr = [];
		for (let i = 0; i <= nDays; i++) {
			arr.push(new newDate().addDays(i).toHyphenString());
		}
		return arr;
		//n = 4
		//[ '2017-8-13', '2017-8-12', '2017-8-11', '2017-8-10', '2017-8-9' ]
	}

	static pastDatesHyphenString(nDays) {
		function helper(emptyarr, n) {
			if (n <= nDays) {
				return helper(emptyarr.concat([new newDate().addDays(-n).toHyphenString()]), n+1);
			} else {
				return emptyarr;
			}
		}
		return helper([], 0);
		//n = 4
		//[ '2017-8-13', '2017-8-12', '2017-8-11', '2017-8-10', '2017-8-9' ]
	}

	static createTimeString(hr, min, sec) {
		var dat = new newDate();
		dat.setHours(hr);
		dat.setMinutes(min);
		dat.setSeconds(sec);
		return dat.toTimeString().split(' ')[0];
	}

	static timeStringArray(inithr, initmin, initsec, nslots) {
		function helper(inihr, inimin, inisec, emptyarr, start, n) {
			if (start < n) {
				return helper(inihr + 2, inimin, inisec, emptyarr.concat([newDate.createTimeString(inihr + 2, inimin, inisec)]), start + 1, n);
			} else {
				return emptyarr;
			}
		}
		return helper(inithr, initmin, initsec, [], 0, nslots);
		//input: 6, 0, 0, 8
		// [ '08:00:00',
		//   '10:00:00',
		//   '12:00:00',
		//   '14:00:00',
		//   '16:00:00',
		//   '18:00:00',
		//   '20:00:00',
		//   '22:00:00' ]
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

newDate.prototype.toDateAndTimeString = function() {
	var dat = new newDate(this.valueOf());
	return {dateString:dat.toHyphenString(), timeString:dat.toTimeString().split(' ')[0]};
}







module.exports = newDate