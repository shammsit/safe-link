async function getUser(){
    const { data: { user } } = await supabaseClient.auth.getUser();

    if(!user){
        window.location.href = "../login.html";
        return null;
    }
    return user;
}

/* ================= PREVIEW ================= */

function previewPhoto(event){
    const file = event.target.files[0];
    if(file){
        const url = URL.createObjectURL(file);
        const img = document.getElementById("photoPreview");
        img.src = url;
        img.style.display = "block";
    }
}

function previewID(event){
    const file = event.target.files[0];
    if(file){
        const url = URL.createObjectURL(file);
        const img = document.getElementById("idPreview");
        img.src = url;
        img.style.display = "block";
    }
}

/* ================= LOAD PROFILE ================= */

async function loadProfile(){

    const user = await getUser();
    if(!user) return;

    const { data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if(data){
        document.getElementById("name").value = data.name || "";
        document.getElementById("phone").value = data.phone || "";
        document.getElementById("blood").value = data.blood_group || "";
        document.getElementById("address").value = data.address || "";
        document.getElementById("ec1").value = data.emergency_contact1 || "";
        document.getElementById("ec2").value = data.emergency_contact2 || "";
        document.getElementById("idnum").value = data.id_proof_number || "";
        document.getElementById("dob").value = data.date_of_birth || "";
        document.getElementById("gender").value = data.gender || "";

        // ✅ SHOW SAVED IMAGES
        if(data.photo_url){
            const img = document.getElementById("photoPreview");
            img.src = data.photo_url;
            img.style.display = "block";
        }

        if(data.id_proof_url){
            const img = document.getElementById("idPreview");
            img.src = data.id_proof_url;
            img.style.display = "block";
        }
    }
}

/* ================= SAVE PROFILE ================= */

async function saveProfile(){

    const msg = document.getElementById("msg");
    const user = await getUser();
    if(!user) return;

    let photoUrl = null;
    let idUrl = null;

    const photoFile = document.getElementById("photo").files[0];
    const idFile = document.getElementById("idphoto").files[0];

    // 🔒 FILE SIZE CHECK (200KB)
    if(photoFile && photoFile.size > 200000){
        msg.innerText = "❌ Profile photo must be under 200KB";
        return;
    }

    if(idFile && idFile.size > 200000){
        msg.innerText = "❌ ID photo must be under 200KB";
        return;
    }

    // Upload profile photo
    if(photoFile){
        const { error } = await supabaseClient.storage
            .from("profile-photos")
            .upload(user.id + ".jpg", photoFile, { upsert: true });

        if(!error){
            photoUrl = supabaseClient.storage
                .from("profile-photos")
                .getPublicUrl(user.id + ".jpg").data.publicUrl;
        }
    }

    // Upload ID photo
    if(idFile){
        const { error } = await supabaseClient.storage
            .from("profile-photos")
            .upload("id_" + user.id + ".jpg", idFile, { upsert: true });

        if(!error){
            idUrl = supabaseClient.storage
                .from("profile-photos")
                .getPublicUrl("id_" + user.id + ".jpg").data.publicUrl;
        }
    }

    // ✅ IMPORTANT FIX: KEEP OLD IMAGES
    const { data: existing } = await supabaseClient
        .from("profiles")
        .select("photo_url, id_proof_url")
        .eq("id", user.id)
        .single();

    const finalPhoto = photoUrl || existing?.photo_url || null;
    const finalID = idUrl || existing?.id_proof_url || null;

    const { error } = await supabaseClient
        .from("profiles")
        .upsert({
            id: user.id,
            email: user.email,
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            blood_group: document.getElementById("blood").value,
            address: document.getElementById("address").value,
            emergency_contact1: document.getElementById("ec1").value,
            emergency_contact2: document.getElementById("ec2").value,
            id_proof_number: document.getElementById("idnum").value,
            date_of_birth: document.getElementById("dob").value,
            gender: document.getElementById("gender").value,
            photo_url: finalPhoto,
            id_proof_url: finalID
        });

    if(error){
        msg.innerText = "❌ Error saving profile";
    }else{
        msg.innerText = "✅ Profile saved successfully";
    }
}

/* ================= INIT ================= */

loadProfile();