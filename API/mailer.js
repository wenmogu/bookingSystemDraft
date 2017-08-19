
const passwords = require('../passwords');
var nodemailer = require('nodemailer');

const Token = require('../models/token');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: passwords.user,
    pass: passwords.password
  }
});

var mailOptions = {
  from: passwords.user,
  to: '',
  subject: '',
  text: ''
};

class mailer extends Object {
	static changeSubjectTo(subjectString){
		mailOptions.subject = subjectString; 
		return Promise.resolve(true);
	}
	
	static changeHTMLTo(htmlString){
		mailOptions.html = htmlString;
		return Promise.resolve(true);
	}

	static changeTextTo(textString){
		mailOptions.text = textString;
		mailOptions.html = undefined;
		return Promise.resolve(true);
	}
	
	static changeRecipientTo(recipient){
		mailOptions.to = recipient;
		return Promise.resolve(true);
	}

	static formatEmailArrayFromReqBody(reqbody) {
		var emptyarr = [];
		function helper() {
			console.log("reqbody: ", reqbody);
			for (var key in reqbody) {
				if (reqbody.hasOwnProperty(key) && key != 'subject' && key != "body") {
					emptyarr.push(reqbody[key]);
				}
			}
		}
		
		return Promise.resolve(helper()).then(()=> {
			return Promise.resolve(emptyarr);
		})
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

	static formatMemberInfo(membersInfo) {
		function helper(count, memberInfoFormat) {
			if (count < membersInfo.length) {
				var memberInfoFormatAssignment = memberInfoFormat + '<p> MemberName: ' + membersInfo[count].name + '</p> <p> Member Email: ' + membersInfo[count].email + '</p>';
				return helper(count + 1, memberInfoFormatAssignment);
			} else {
				return memberInfoFormat;
			}
		}
		return helper(0, '');
	}

	static formatHTMLInvitation(userinfo, membersInfo, warning, webaddress, token) {
		return {greeting:'<p>Hello!</p>', invitor:'<p>' + userinfo.name + ' wants you to be in his/her Group. </p>', groupInfo: '<p> Group ID: ' + userinfo.groupid + ' Numbers of warnings the group has received: ' + warning + '</p>', memberInfoHeading: '<p> Members Info: </p>', memberInfo: mailer.formatMemberInfo(membersInfo), confirmLink: '<p> click on this link to join this group: ' + '<a href=' + '" ' + webaddress + '/?invitationToken=' + token + '">' + webaddress + "/?invitationToken=" + token + "</a>"};	
	}

	static sendInvitationTo(htmlInvitation, subject, recipientarr){// mailer.formatHTMLInvitation, title, [asdf@sdfdsf]
		return mailer.changeHTMLTo(htmlInvitation.greeting + htmlInvitation.invitor + htmlInvitation.groupInfo + htmlInvitation.memberInfoHeading + htmlInvitation.memberInfo + htmlInvitation.confirmLink)
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

	static formatHTMLReport(reporter, warningType, detail, offenderGroupId, offenderName, date, start, end) {
		return {reporter: '<p> By: ' + reporter + '</p>', warningType: '<p> Warning Type: ' + warningType + '</p>', detail: '<p> Detail: ' + detail + '</p>', offenderGroupId: '<p> Offender GroupID: ' + offenderGroupId + '</p>', offenderName: '<p> Offender Name: ' + offenderName + '</p>', date: '<p> Date: ' + date + '</p>', start: '<p> Start: ' + start + '</p>', end: '<p> End: ' + end + '</p>'}
	}

	static sendReportTo(htmlReport, recipientarr) {
		return mailer.changeHTMLTo(htmlReport.reporter + htmlReport.warningType + htmlReport.detail + htmlReport.offenderGroupId + htmlReport.offenderName + htmlReport.date + htmlReport.start + htmlReport.end)
		.then(bool=> {
			mailer.changeSubjectTo('Warning Report')
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
							return Promise.resolve(true)
						})
					}
				}
				return helper(0);
			})
		})
	}


}

module.exports = mailer;