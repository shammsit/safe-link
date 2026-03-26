document.addEventListener("DOMContentLoaded", loadNotices);

async function loadNotices(){

    const container = document.getElementById("noticeContainer");

    const userId = localStorage.getItem("userId"); // 👈 IMPORTANT
    const isLoggedIn = !!userId;

    try{

        const { data, error } = await supabaseClient
            .from("notices")
            .select("*")
            .order("post_date", { ascending:false });

        if(error){
            console.error(error);
            container.innerHTML = "❌ Error loading notices";
            return;
        }

        if(!data || data.length === 0){
            container.innerHTML = "No notices available";
            return;
        }

        let filtered = [];

        data.forEach(n => {

            // 🔴 NOT LOGGED IN → ONLY EVERYONE
            if(!isLoggedIn){
                if(n.target === "everyone"){
                    filtered.push(n);
                }
            }

            // 🟢 LOGGED IN
            else{

                // everyone
                if(n.target === "everyone"){
                    filtered.push(n);
                }

                // registered
                else if(n.target === "registered"){
                    filtered.push(n);
                }

                // specific users
                else if(n.target === "specific"){

                    if(n.user_ids && n.user_ids.includes(userId)){
                        filtered.push(n);
                    }
                }
            }

        });

        if(filtered.length === 0){
            container.innerHTML = "No notices for you";
            return;
        }

        // 🔥 RENDER
        let html = "";

        filtered.forEach(n => {

            html += `
                <div class="notice-card">

                    <h3>${n.subject}</h3>

                    <p>${n.content}</p>

                    <small>
                        📅 ${n.post_date || "N/A"}
                        ${n.urgent ? `<span class="urgent">🔥 Urgent</span>` : ""}
                    </small>

                    <br>

                    ${
                        n.attachment_url
                        ? `<a href="${n.attachment_url}" target="_blank">📎 View Attachment</a>`
                        : ""
                    }

                </div>
            `;
        });

        container.innerHTML = html;

    }catch(err){
        console.error(err);
        container.innerHTML = "❌ Unexpected error";
    }
}