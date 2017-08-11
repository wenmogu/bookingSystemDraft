
const passwords = require('../passwords');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: passwords.user,
    pass: passwords.password
  }
});

var mailOptions = {
  from: passwords.user,
  to: "to be updated",
  subject: "to be updated",
  text: 'to be updated'
};

class mailer extends Object {
	static changeSubjectTo(subjectString){
		mailOptions.subject = subjectString; 
		return Promise.resolve(true);
	}
	
	static changeTextTo(textString){
		mailOptions.text = textString;
		return Promise.resolve(true);
	}
	
	static changeRecipientTo(recipient){
		mailOptions.to = recipient;
		return Promise.resolve(true);
	}
	
	static sendMailTo(recipient){
		return mailer.changeRecipientTo(recipient)
		.then(bool=> {
			return transporter.sendMail(mailOptions, function(err, info) {
				if (err) {
					console.error(err);
					return Promise.resolve(false);
				} else {
					return Promise.resolve(true);
				}
			})
		})
	}

	static sendEmailTo(text, subject, recipientarr){
		return mailer.changeTextTo(text)
		.then(bool=> {
			mailer.changeSubjectTo(subject)
			.then(bool=> {
				function helper(count) {
					if (count < recipientarr.length - 1) {
						return mailer.sendMailTo(recipientarr[count])
						.then(bool=> {
							console.log("mail sent to: " + recipientarr[count]);
							return helper(count + 1);
						})
					} else {
						return mailer.sendMailTo(recipientarr[count])
						.then(()=> {
							console.log("mail sent to: " + recipientarr[count]);
						})
					}
				}
				return helper(0);		
			})
		})
	}
}

module.exports = mailer;