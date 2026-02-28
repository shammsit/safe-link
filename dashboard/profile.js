let generatedCaptcha = "";
let editingMode = false;

document.addEventListener("DOMContentLoaded", function () {

    if (typeof firebase === "undefined" || !firebase.apps.length) {
        console.error("Firebase not initialized");
        return;
    }

    const auth = firebase.auth();

    auth.onAuthStateChanged(function (user) {

    if (!user) {
        window.location.href = "../login.html";
        return;
    }

    document.getElementById("email").value = user.email;

    // ✅ LOAD DATA FROM SHEET
    loadProfileFromSheet(user.uid);
});

    generateCaptcha();
    lockForm();

    document.getElementById("editBtn").addEventListener("click", enableEdit);
    document.getElementById("saveBtn").addEventListener("click", saveProfile);

    document.querySelectorAll("#profileForm input, #profileForm textarea, #profileForm select")
        .forEach(el => {
            el.addEventListener("input", calculateCompletion);
        });

    document.getElementById("profilePhoto").addEventListener("change", uploadProfilePhoto);
});


// ================= LOCK / EDIT =================

function lockForm() {
    document.querySelectorAll("#profileForm input, #profileForm textarea, #profileForm select")
        .forEach(el => {
            if (el.id !== "email") el.setAttribute("disabled", true);
        });

    editingMode = false;
    document.getElementById("saveBtn").disabled = true;
}

function enableEdit() {
    document.querySelectorAll("#profileForm input, #profileForm textarea, #profileForm select")
        .forEach(el => {
            if (el.id !== "email") el.removeAttribute("disabled");
        });

    editingMode = true;
    document.getElementById("saveBtn").disabled = false;


    document.getElementById("idFront").style.display = "block";
document.getElementById("idBack").style.display = "block";

document.getElementById("idFrontDisplay").style.display = "none";
document.getElementById("idBackDisplay").style.display = "none";
}


// ================= CAPTCHA =================

function generateCaptcha() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    generatedCaptcha = "";

    for (let i = 0; i < 6; i++) {
        generatedCaptcha += chars[Math.floor(Math.random() * chars.length)];
    }

    document.getElementById("profileCaptcha").innerText = generatedCaptcha;
}


// ================= SAVE PROFILE (Google Sheet) =================

async function saveProfile() {

    if (document.getElementById("captchaInput").value !== generatedCaptcha) {
        showToast("Invalid Captcha ❌");
        generateCaptcha();
        return;
    }

    const user = firebase.auth().currentUser;
    if (!user) {
        showToast("User not logged in ❌");
        return;
    }

    const overlay = document.getElementById("savingOverlay");
    const savingBar = document.getElementById("savingBar");
    const banner = document.getElementById("successBanner");

    overlay.classList.remove("hidden");
    savingBar.style.width = "30%";

    // Convert file to base64
    async function fileToBase64(fileInputId) {
        const file = document.getElementById(fileInputId).files[0];
        if (!file) return "";

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    }

    const profilePhotoBase64 = await fileToBase64("profilePhoto");
    const idFrontBase64 = await fileToBase64("idFront");
    const idBackBase64 = await fileToBase64("idBack");

    savingBar.style.width = "60%";

    const data = {
    uid: user.uid,
    email: user.email,

    name: document.getElementById("name").value || "",
    dob: document.getElementById("dob").value || "",
    gender: document.getElementById("gender").value || "",
    mobile: document.getElementById("mobile").value || "",
    altMobile: document.getElementById("altMobile").value || "",
    address: document.getElementById("address").value || "",
    pincode: document.getElementById("pincode").value || "",
    occupation: document.getElementById("occupation").value || "",
    qualification: document.getElementById("qualification").value || "",

    guardianName: document.getElementById("guardianName").value || "",
    guardianRelation: document.getElementById("guardianRelation").value || "",
    guardianContact: document.getElementById("guardianContact").value || "",
    guardianAddress: document.getElementById("guardianAddress").value || "",

    fatherName: document.getElementById("fatherName").value || "",
    fatherContact: document.getElementById("fatherContact").value || "",
    fatherAddress: document.getElementById("fatherAddress").value || "",

    motherName: document.getElementById("motherName").value || "",
    motherContact: document.getElementById("motherContact").value || "",
    motherAddress: document.getElementById("motherAddress").value || "",

    idType: document.getElementById("idType").value || "",
    idNumber: document.getElementById("idNumber").value || "",
    issueDate: document.getElementById("issueDate").value || "",
    expiryDate: document.getElementById("expiryDate").value || "",

    profilePhoto: profilePhotoBase64,
    idFront: idFrontBase64,
    idBack: idBackBase64
};

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwBq93OgWpBFz5WWLP98ZEukm2eKAaqS6_6cigmQIxZzfQ-NDkGV5J4U4ZphuDLMVlm/exec";

    try {
        const formData = new FormData();
        for (let key in data) {
            formData.append(key, data[key]);
        }
        await fetch(SCRIPT_URL, {
            method: "POST",
            body: new URLSearchParams(data)
        });

        savingBar.style.width = "100%";
        overlay.classList.add("hidden");

        banner.classList.remove("hidden");
        setTimeout(() => banner.classList.add("hidden"), 3000);

        showToast("Profile & Documents Saved ✅");

        lockForm();
        calculateCompletion();

    } catch (error) {

        overlay.classList.add("hidden");
        showToast("Upload failed ❌");
        console.error(error);
    }
}
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 3000);
}

// ================= COMPLETION CALCULATION =================

function calculateCompletion() {

    const requiredFields = [
        "name", "dob", "gender", "mobile",
        "address", "guardianName", "guardianContact",
        "idType", "idNumber"
    ];

    let filled = 0;

    requiredFields.forEach(id => {
        const field = document.getElementById(id);
        if (field && field.value.trim() !== "") {
            filled++;
        }
    });

    const percent = Math.floor((filled / requiredFields.length) * 100);

    if (document.getElementById("progressFill"))
        document.getElementById("progressFill").style.width = percent + "%";

    if (document.getElementById("completionPercent"))
        document.getElementById("completionPercent").innerText = percent + "%";
}


// ================= PHOTO PREVIEW (Local Only) =================

function uploadProfilePhoto(e) {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
        document.getElementById("profilePreview").src = event.target.result;
    };

    reader.readAsDataURL(file);
}

function loadProfileFromSheet(uid) {

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwBq93OgWpBFz5WWLP98ZEukm2eKAaqS6_6cigmQIxZzfQ-NDkGV5J4U4ZphuDLMVlm/exec";

    fetch(SCRIPT_URL + "?uid=" + uid)
        .then(res => res.json())
        .then(data => {

            if (!data || !data.uid) return;

            // 🔥 Fill Form Fields
            Object.keys(data).forEach(key => {

                const el = document.getElementById(key);
                if (!el) return;

                // ❌ Skip file inputs
                if (el.type === "file") return;

                let value = data[key] || "";

                // ✅ Fix Date Format
                if (el.type === "date" && value) {
                    const d = new Date(value);
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    value = `${year}-${month}-${day}`;
                }

                el.value = value;
            });

            // 🔥 Convert Google Drive Link to Direct Image
            function convertDriveLink(url) {
    if (!url) return "";

    const match = url.match(/\/d\/(.*?)\//);

    if (match && match[1]) {
        return "https://drive.google.com/thumbnail?id=" + match[1];
    }

    return url;
}

            // ✅ PROFILE PHOTO PREVIEW
            if (data.profilePhoto) {
    const profileImg = document.getElementById("profilePreview");
    if (profileImg) {
        profileImg.src = convertDriveLink(data.profilePhoto);
    }


    //console.log(data);
}

 // ===== SHOW UPLOADED ID FRONT =====
if (data.idFront) {
    const frontInput = document.getElementById("idFront");
    const frontDisplay = document.getElementById("idFrontDisplay");

    if (frontInput && frontDisplay) {

        // Hide file input
        frontInput.style.display = "none";

        // Show clickable text
        frontDisplay.innerText = "Uploaded ID Front (Click to View)";
        frontDisplay.style.display = "inline-block";

        frontDisplay.onclick = function () {
            window.open(data.idFront, "_blank");
        };
    }
}

// ===== SHOW UPLOADED ID BACK =====
if (data.idBack) {
    const backInput = document.getElementById("idBack");
    const backDisplay = document.getElementById("idBackDisplay");

    if (backInput && backDisplay) {

        backInput.style.display = "none";

        backDisplay.innerText = "Uploaded ID Back (Click to View)";
        backDisplay.style.display = "inline-block";

        backDisplay.onclick = function () {
            window.open(data.idBack, "_blank");
        };
    }
}


            calculateCompletion();
        })
        .catch(err => console.log("Load error:", err));


        updateVerificationTag();
}

function updateVerificationTag() {

    const tag = document.getElementById("verificationTag");
    const percentText = document.getElementById("completionPercent").innerText;

    if (!tag) return;

    if (percentText === "100%") {

        // For now: 100% = Under Processing
        tag.className = "verification-tag processing";
        tag.innerText = "Verification Under Processing";

    } else {

        tag.className = "verification-tag unverified";
        tag.innerText = "Unverified";

    }

}