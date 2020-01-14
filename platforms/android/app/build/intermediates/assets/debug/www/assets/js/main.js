$(document).ready(function () {
	$('ul.tabs').tabs();
	$('.datepicker').datepicker();
	$('select').formSelect();
	$('.modal').modal();
	$('.sidenav').sidenav({ draggable: true });
});
document.addEventListener('deviceready', function () {
	codePush.notifyApplicationReady();
	codePush.sync();
});
var config = {
	apiKey: "AIzaSyAZ_FSEHbTDV4ahNTO05aeHa_vZMIHIODs",
	authDomain: "sk-somaiya-app.firebaseapp.com",
	databaseURL: "https://sk-somaiya-app.firebaseio.com",
	projectId: "sk-somaiya-app",
	storageBucket: "sk-somaiya-app.appspot.com",
	messagingSenderId: "726191592775"
};
firebase.initializeApp(config);
function login() {
	load();
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
		.then(function () {
			return firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
				console.log(user.uid);
				window.location.href = "about.html";
			}).catch(function (error) {
				var errorCode = error.code;
				var errorMessage = error.message;
				alert(errorCode + " : " + errorMessage);
			});
		})
		.catch(function (error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(errorCode + " : " + errorMessage);
		});
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
		}
		else {
			unload();
		}
	});
}
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		var uid = user.uid;
		if (window.location.pathname.split("/").pop() == "admin.html") {
			unload();
		} else {
			load();
		}
		if (window.location.pathname.split("/").pop() == "login.html") {
			window.location.href = "about.html";
		}
		$("#profileupdate").show();
		sqlRead(uid);
		fetchuser(uid);
	}
	else {
	}
});

function logout() {
	var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
	var msg;
	db.transaction(function (tx) {
		tx.executeSql('DELETE FROM PROFILE WHERE id is 1');
	});
	firebase.auth().signOut().then(function () {
		window.location.href = "login.html";
	}).catch(function (error) {
	});
}
function forgotpassword() {
	var auth = firebase.auth();
	var email = document.getElementById("email").value;
	if (email != "") {
		auth.sendPasswordResetEmail(email).then(function () {
			alert("Password Reset Link, Successfully Sent To Your Email.");
		}).catch(function (error) {
			alert(errorCode + " : " + errorMessage);
		});
	}
	else {
		alert("Enter A Valid Email Address!");
	}
}

function fetchuser(uid) {
	firebase.database().ref("users/" + uid).once('value').then(function (snapshot) {
		var userName = snapshot.val().userName;
		var userEmail = snapshot.val().userEmail;
		var userImg = snapshot.val().userImg;
		if (userImg == "") {
		}
		else {
			document.getElementById("userImg").src = userImg;
		}
		document.getElementById("userName").innerHTML = userName;
		document.getElementById("userEmail").innerHTML = userEmail;
		document.getElementById("usernamehref").removeAttribute("href");
		sqlUpdate(userName, userEmail, userImg, uid);
	});
}
function register() {
	$("#reg").attr("disabled", "disabled");
	load();
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	var confirmpassword = document.getElementById("confirmpassword").value;
	if (password == confirmpassword) {
		firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
			var userName = document.getElementById("name").value;
			var userImg = "data:image/png;base64,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";
			var collegeId = parseInt(document.getElementById("collegeId").value);
			var phoneNo = parseInt(document.getElementById("phoneNo").value);
			var uid = firebase.auth().currentUser.uid;
			firebase.database().ref("users/" + uid).set({
				userName: userName,
				userEmail: email,
				userImg: userImg,
				collegeId: collegeId,
				phoneNo: phoneNo,
				role: "student"
			}).then(function (data) {
				window.location.href = "profile.html";
			});
		}).catch(function (error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			alert(errorCode + " : " + errorMessage);
			unload();
			$("#reg").removeAttr("disabled");
		});
	}
	else {
		alert("Password Not Matched!");
	}
}
async function profile() {
	var uid = firebase.auth().currentUser.uid;
	var department = document.getElementById("department").value;
	var year = document.getElementById("year").value;
	firebase.database().ref("users/" + uid).update({
		department: department,
		year: year
	});
	window.location.href = "about.html";
}
async function profilePic() {
	var uid = firebase.auth().currentUser.uid;
	await thumbnailGen();
	firebase.database().ref("users/" + uid).update({
		userImg: thumb64
	});
	window.location.href = "about.html";
}
var b64img = "", thumb64 = "";
$('#userImg').on('change', function () {
	if (this.files && this.files[0]) {
		var FR = new FileReader();
		FR.onloadend = function (e) {
			b64img = e.target.result;
			document.getElementById("img").src = b64img;
		}
		FR.readAsDataURL(this.files[0]);
	}
});
async function thumbnailGen() {
	var width = $("#img").width();
	var height = $("#img").height();
	await resizeBase64Img(b64img, (width / height) * 64, (height / height) * 64);
}
async function resizeBase64Img(base64, width, height) {
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	var context = canvas.getContext("2d");
	var deferred = $.Deferred();
	$("#img").attr("src", base64).on('load', function () {
		context.scale(width / this.width, height / this.height);
		context.drawImage(this, 0, 0);
		deferred.resolve($("<img/>").attr("src", canvas.toDataURL()));
		thumb64 = canvas.toDataURL();
	});
	return deferred.promise();
}
function load() {
	$('.preloader-background').delay(1000).fadeIn('slow');
	$('.preloader-wrapper').delay(1000).fadeIn();
}
function unload() {
	$('.preloader-background').delay(1000).fadeOut('slow');
	$('.preloader-wrapper').delay(1000).fadeOut();
}
function noticepost() {
	$('.preloader-background').fadeIn('slow');
	$('.preloader-wrapper').fadeIn();
	var i;
	var date = new Date();
	var now = Date.now();
	var dd = date.getDate();
	var mm = date.getMonth();
	var mmm = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	var yyyy = date.getFullYear();
	var department = document.getElementById("department").value;
	var year = document.getElementById("year").value;
	var title = document.getElementById("title").value;
	var files = [];
	for (i = 0; i < document.getElementById("noticefile").files.length; i++) {
		var file = document.getElementById("noticefile").files[i];
		var ref = "/notice/" + department + "/" + year + "/" + now + "/" + file.name;
		files.push(ref);
		firebase.storage().ref(ref).put(file).then(function () {
			console.log("STORAGE");
			console.log(files);
		});
	}
	firebase.database().ref("/notice/" + department + "/" + year + "/" + now).set({
		department: department,
		year: year,
		title: title,
		noOfFiles: i,
		date: mmm[mm] + " " + dd + ", " + yyyy,
		fileUrl: files
	}).then(function () {
		console.log("DATABASE");
	});
	unload();
}
function calenderpost() {
	$('.preloader-background').fadeIn('slow');
	$('.preloader-wrapper').fadeIn();
	var date = new Date();
	var topic = document.getElementById("calendertopic").value;
	var date = document.getElementById("calenderdate").value;
	firebase.database().ref("calender").push({
		topic: topic,
		date: date
	}).then(function () {
		console.log("DATABASE");
	});
	unload();
}
if (window.location.pathname.split("/").pop() == "noticeboard.html") {
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			updatenotice();
		} else {
			var confirm = window.confirm("To View Notices You Must Login");
			if (confirm) {
				window.location.href = "login.html";
			}
			else {
				window.location.href = "about.html";
			}
		}
	});
}
function isEmpty(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
			return false;
	}
	return true;
}
function updatenotice() {
	var department = "";
	var year = "";
	var title = [];
	var fileUrl = [];
	var date = [];
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			firebase.database().ref("users/" + user.uid).once('value', function (snapshot) {
				department = snapshot.val().department;
				year = snapshot.val().year;
			}).then(function () {
				var noticeboardtitle = "Notice Details : " + year + " " + department;
				document.getElementById("noticeboardtitle").innerHTML = noticeboardtitle;
				firebase.database().ref("/notice/" + department + "/" + year + "/").once('value', function (snapshot) {
					snapshot.forEach(function (child) {
						var fileU = [];
						var val = child.val();
						date.push(val.date);
						title.push(val.title);
						if (isEmpty(val.fileUrl)) {
							val.fileUrl = [];
						}
						fileUrl.push(val.fileUrl);
					});
				}).then(function (data) {
					var noticeurl = "<thead><tr><th style='width:30%;text-align: center'>Title</th><th style='width:40%;text-align: center'>File</th><th style='width:30%;text-align: center'>Date</th></tr></thead><tbody>";
					var i = 0;
					fileUrl.forEach(function (urls) {
						noticeurl = noticeurl + "<tr><td style='width:30%;text-align: center'>" + title[i] + "</td><td style='width:40%;text-align: center'>";
						urls.forEach(function (url) {
							noticeurl = noticeurl + "<a href='javascript:downloadUrl(&quot;" + url + "&quot;)'>" + url.split("/").pop() + "</a><br>";
						});
						noticeurl = noticeurl + "</td><td style='width:30%;text-align: center'>" + date[i] + "</td><tr>";
						i++;
					});
					noticeurl = noticeurl + "</tbody>";
					document.getElementById("noticeboardtable").innerHTML = noticeurl;
					unload();
				});
			});
		}
		else {
		}
	});
}
function downloadUrl(url) {
	$(".modal").modal("open");
	firebase.storage().ref(url).getDownloadURL().then(function (noticeurl) {
		console.log(noticeurl);
		$("#download").attr("href", noticeurl);
		$("#download").attr("target", "_blank");
	});
}
function toggleInput() {
	var x = document.getElementById("password");
	if (x.type === "password") {
		x.type = "text";
	} else {
		x.type = "password";
	}
}
function sqlUpdate(userName, userEmail, userImg, uid) {
	var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
	var msg;
	db.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS PROFILE (id unique, userName, userEmail, userImg, uid)');
		tx.executeSql('INSERT OR REPLACE INTO PROFILE (id, userName, userEmail, userImg, uid) VALUES (?, ?, ?, ?, ?)', [1, userName, userEmail, userImg, uid]);
		msg = 'Log message created and row inserted.';
		console.log(msg);
	})
}
function sqlRead(uid) {
	var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
	var msg;
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM PROFILE WHERE uid is (?)', [uid], function (tx, results) {
			var len = results.rows.length, i;
			msg = "Found rows: " + len;
			console.log(msg);
			for (i = 0; i < len; i++) {
				document.getElementById("userImg").src = results.rows.item(i).userImg;
				document.getElementById("userName").innerHTML = results.rows.item(i).userName;
				document.getElementById("userEmail").innerHTML = results.rows.item(i).userEmail;
			}
		}, null);
	});
}
$(function () {
	if (window.location.href.indexOf("calender") > 0) {
		var date = [];
		var topic = [];
		firebase.database().ref("calender").once('value', function (snapshot) {
			snapshot.forEach(function (data) {
				var val = data.val();
				date.push(val.date);
				topic.push(val.topic);
			});
		}).then(function () {
			var cal = "<tr><th class='td'>Date</th><th class='td'>Description</th></tr>";
			for (i = 0; i < date.length; i++) {
				cal = cal + "<tr><td class='td'>" + date[i] + "</td><td class='td'>" + topic[i] + "</td></tr>";
			}
			document.getElementById("cal").innerHTML = cal;
		});
	}
});


var act = ""
$(function () {
	if (window.location.pathname.split("/").pop() == "activities.html") {
		firebase.database().ref('/activity/').once('value', function (snapshot) {
			snapshot.forEach(function (data) {
				var val = data.val();
				console.log(val.img);
				act = act + `
							<div class="col s12">
									<div class="card">
										<div class="card-image">
											<img src="` + val.img + `">
											<span class="card-title">` + val.name + `</span>
										</div>
										<div class="card-content">
											<p>` + val.info + `</p>
										</div>
									</div>
								</div>
							`;
				document.getElementById('activities').innerHTML = act;
			});
		});
	}
});



async function activitypost() {
	$('.preloader-background').fadeIn('slow');
	$('.preloader-wrapper').fadeIn();
	await activityThumbnailGen();
	var now = Date.now();
	var activityname = document.getElementById('activityname').value;
	var activityinfo = document.getElementById('activityinfo').value;
	firebase.database().ref("activity/" + now).set({
		name: activityname,
		info: activityinfo,
		img: thumb64
	}).then(function () {
		console.log("DATABASE");
	});
	unload();
}
var actb64img = "", actthumb64 = "";
$('#activityimg').on('change', function () {
	if (this.files && this.files[0]) {
		var FR = new FileReader();
		FR.onloadend = function (e) {
			b64img = e.target.result;
			document.getElementById("img").src = b64img;
		}
		FR.readAsDataURL(this.files[0]);
	}
});
async function activityThumbnailGen() {
	var width = $("#img").width();
	var height = $("#img").height();
	await activityResizeBase64Img(b64img, (width / height) * 240, (height / height) * 240);
}
async function activityResizeBase64Img(base64, width, height) {
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	var context = canvas.getContext("2d");
	var deferred = $.Deferred();
	$("#img").attr("src", base64).on('load', function () {
		context.scale(width / this.width, height / this.height);
		context.drawImage(this, 0, 0);
		deferred.resolve($("<img/>").attr("src", canvas.toDataURL()));
		thumb64 = canvas.toDataURL();
	});
	return deferred.promise();
}