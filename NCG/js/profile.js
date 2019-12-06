const uid = location.search.split('=')[1];
const userRef = firebase.database().ref('users').child(uid);

const profileName = document.getElementById('profile-name');
const bioInput = document.getElementById('bio');
const colorInput = document.getElementById('color');
const ageInput = document.getElementById('age')
const updateButton = document.getElementById('update-profile');

userRef.on('value', function (snapshot) {
	const userInfo = snapshot.val();
	profileName.value = userInfo.displayName;
	console.log(userInfo);

	if (userInfo.bio) {
		bioInput.value = userInfo.bio;

	}

	if (userInfo.color) {
		colorInput.value = userInfo.color;
	}


	if (userInfo.age) {
		ageInput.value = userInfo.age;
	}

	if (userInfo.imageURL) {
		document.getElementById('edit-profile-image').src = userInfo.imageURL;
		document.getElementById('add-image').style.display = 'inherit';
	}
});

updateButton.onclick = function () {
	userRef.update({
		displayName: profileName.value,
		color: colorInput.value,
		bio: bioInput.value,
		age: ageInput.value,
	});
};

const imageButton = document.getElementById('submit-image');
imageButton.addEventListener('click', function () {
	// get the file
	const file = document.getElementById('image-file').files[0];
	if (file) {
		// upload the file
		const storage = firebase.storage();
		const user = firebase.auth().currentUser;
		const ref = storage.ref('users').child(user.uid).child('edit-profile-image');
		const promise = ref.put(file);

		promise.then(function (image) {
			return image.ref.getDownloadURL();
		}).then(function (url) {
			userRef.update({
				imageURL: url
			});
			document.getElementById('edit-profile-image').src = url;
			document.getElementById('add-image').style.display = 'none';
		});
	}

});
