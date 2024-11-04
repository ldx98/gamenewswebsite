function tologin(){
    window.location.href='Login.html';

}
function toregister()
{window.location.href='Register.html'}
function verifyPassword(){
    let Password=document.getElementById('password').value;
    let confirmPassword=document.getElementById('Cpassword').value;
    return Password===confirmPassword;
}
function retriveAccount(){
    let name=document.getElementById('name').value;
    let password=document.getElementById('password').value;
    let arr=[name,password];
    return arr;

}
function register(){
    let dataEntered=retriveAccount();
    if(verifyPassword()){
        localStorage.setItem("registerdname",dataEntered[0]);
            localStorage.setItem("registerdpassword",dataEntered[1]);
            alert("Registration successful. Please login.");
            window.location.href = 'Login.html';
    }
    else{
        alert("Please filled all information,or Check if password and ConfirmPassword match")
    }

    }

function login(){
    let name=document.getElementById("name").value;
    let password=document.getElementById("password").value;
    let reigsterdname=localStorage.getItem("registerdname");
    let registerdpassword=localStorage.getItem("registerdpassword");
    if(name === reigsterdname && password === registerdpassword){
        localStorage.setItem("logedIn","true");
        alert("You have loged In !");
        window.location.href='Home.html'
    }
    else{
        alert("Information not match!");
    }
}
function logout(){
    localStorage.removeItem("logedIn");
    window.location.href='Login.html';


}
function checkLogin() {
    if (localStorage.getItem("logedIn") !== "true") {
        window.location.href = 'Login.html';
    }
}

let games = {
    1: { name: "Elden Ring: Shadow of the Erdtree", scores: [], averagescore: 0 },
    2: { name: "Destiny 2: The Final Shape", scores: [], averagescore: 0 },
    3: { name: "Dragon's Dogma 2", scores: [], averagescore: 0 },
    4: { name: "Helldivers 2", scores: [], averagescore: 0 },
    5: { name: "Final Fantasy 7 Rebirth", scores: [], averagescore: 0 }
};

function submitScore(gameId) {
    let select = document.getElementById(`scoreForm${gameId}`);
    let score = parseInt(select.value);
    
    if (isNaN(score)) {
        alert("Please select a score before submitting.");
        return;
    }
    let storedGames = JSON.parse(localStorage.getItem('games')) || games;
    
    if (!storedGames[gameId]) {
        storedGames[gameId] = { ...games[gameId], scores: [] };
    }
    
    if (storedGames[gameId].scores.length >= 3) {
        alert("You have reached the maximum submission chance for this game.");
        return;
    }
    
    storedGames[gameId].scores.push(score);
    storedGames[gameId].averagescore = calculateAverageScore(storedGames[gameId].scores);
    
    localStorage.setItem('games', JSON.stringify(storedGames));
    updateRank();
    
    select.selectedIndex = 0;
    
    alert(` submitted!`);
}
   
function calculateAverageScore(score) {
    if (!score || score.length === 0) return 0;
    let sum = score.reduce((a, b) => a + b, 0);
    return sum / score.length;
}

function updateRank() {
    let Ranking = document.getElementById('Ranking');
    if (!Ranking) return;
    Ranking.innerHTML = '';

    let storedGames = JSON.parse(localStorage.getItem('games')) || games;
    let gamesArray = Object.values(storedGames);
    gamesArray.sort((a, b) => (b.averagescore || 0) - (a.averagescore || 0));
    
    for (let i = 0; i < Math.min(5, gamesArray.length); i++) {
        let game = gamesArray[i];
        let rankItem = document.createElement('li');
        rankItem.textContent = `#${i + 1}: ${game.name}  Average Score: ${game.averagescore.toFixed(2)} (${game.scores.length}/3 submissions)`;
        Ranking.appendChild(rankItem);
    }
}
function resetScores() {
    games = {
        1: { name: "Elden Ring: Shadow of the Erdtree", scores: [], averagescore: 0 },
        2: { name: "Destiny 2: The Final Shape", scores: [], averagescore: 0 },
        3: { name: "Dragon's Dogma 2", scores: [], averagescore: 0 },
        4: { name: "Helldivers 2", scores: [], averagescore: 0 },
        5: { name: "Final Fantasy 7 Rebirth", scores: [], averagescore: 0 }
    };
    localStorage.setItem('games', JSON.stringify(games));
    updateRank();
    alert("All scores have been reset.");
}
    
document.addEventListener('DOMContentLoaded',updateRank )
  
  


function updatecommentRank(){localStorage.setItem.JSON}




function uploadComments() {
    let commentsEntered = retrieveComments();
    if (commentsEntered === false) {
        alert("Please enter all required data!");
    } else {
        insertComments(commentsEntered);
        alert("Comment uploaded successfully!");
        document.getElementById("commentform").reset();
        loadComments();
    }
}

function retrieveComments() {
    let title = document.getElementById("title").value.trim();
    let comment = document.getElementById("Comment").value.trim();
    let imageUrl = document.getElementById("image").value.trim();
    
    if (title === "" || comment === "") {
        return false;
    } else {
        return {title, comment, imageUrl};
    }
}


function insertComments(commentsEntered) {
    let existingComments = JSON.parse(localStorage.getItem("comments")) || [];
    
    let newComment = {
        title: commentsEntered.title,
        comment: commentsEntered.comment,
        imageUrl: commentsEntered.imageUrl,
        likes: 0
    };
    
    existingComments.push(newComment);
    localStorage.setItem("comments", JSON.stringify(existingComments));
    loadComments();
}
function deleteComment(index) {
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.splice(index, 1);
    localStorage.setItem("comments", JSON.stringify(comments));
    loadComments();
}


function loadComments() {
    let CommentsContainer = document.getElementById("CommentsContainer");
    if (!CommentsContainer) return;
    
    CommentsContainer.innerHTML = "";
    
    let existingComments = JSON.parse(localStorage.getItem("comments")) || [];
    existingComments.forEach((data, index) => {
        let entryDiv = document.createElement("div");
        entryDiv.className = "entry";
        
        let imageElement = data.imageUrl ? `<img src="${data.imageUrl}" alt="User uploaded image" style="max-width: 400px;">` : '';
        
        entryDiv.innerHTML = `
            <h3>${data.title}</h3>
            <p>${data.comment }</p>
            ${imageElement}
            <p>Likes: <span id="likes-${index}">${data.likes || 0}</span></p>
            <button onclick="likeComment(${index})"><i class="fa fa-thumbs-up"></i> Like</button>
            <button onclick="deleteComment(${index})"><i class="fa fa-trash"></i> Delete</button>
        `;
        
        CommentsContainer.appendChild(entryDiv);
    });
    updateLikeDisplay();
}
let like=0;
let comments = JSON.parse(localStorage.getItem("comments")) || [];
let likelimit=10;
function likeComment(index) {
   
    if (likelimit > 0) {
        comments[index].like++;
        likelimit--;
        localStorage.setItem("comments", JSON.stringify(comments));
        localStorage.setItem("likeLimit", likelimit);
        document.getElementById(`likes-${index}`).textContent = comments[index].like;
        updateLikeDisplay();
        updateTop();
    } else {
        alert("You have reached the maximum of likes.");
    }
}


   
   
   function updateLikeDisplay(){
    let remainingSpan = document.getElementById('remaininglikes');
    if (remainingSpan) {
        remainingSpan.textContent = likelimit;
    }
}
   function  updateTop(){
    let topcommentsContainer = document.querySelector('.topcomments');
    if (!topcommentsContainer) return;

    let sortedComments = [...comments].sort((a, b) => b.like - a.like);
    let topThree = sortedComments.slice(0, 3);

    topcommentsContainer.innerHTML = "<h2>Top 3 Comments</h2>";
    topThree.forEach((comment, index) => {
        let commentElement = document.createElement('div');
        commentElement.innerHTML = `
            <h3>#${index + 1}: ${comment.title}</h3>
            <p>${comment.comment}</p>
            <p>Likes: ${comment.like}</p>`;
        topcommentsContainer.appendChild(commentElement);
    });
}
   


function initializeComments() {
    comments = JSON.parse(localStorage.getItem("comments")) || [];
    likelimit = parseInt(localStorage.getItem("likelimit")) || 10;
    loadComments();
    updateTop();
    updateLikeDisplay();
}

function uploadMods() {
    let ModsEntered = retrieveMods();
    if (ModsEntered === false) {
        alert("Please enter all required data!");
    } else {
        insertMods(ModsEntered);
        alert("Upload successful!");
        document.getElementById("Modsform").reset();
        loadMods();
    }
}

function retrieveMods() {
    let title = document.getElementById("title").value.trim();
    let description = document.getElementById("description").value.trim();
    let fileInput = document.getElementById("file");
    let file = fileInput.files[0];
    
    if (title === "" || description === "" || !file) {
        return false;
    } else {
        return {title, description, file};
    }
}

function insertMods(ModsEntered) {
    let existingMods = JSON.parse(localStorage.getItem("Mods")) || [];
    
    let newMod = {
        title: ModsEntered.title,
        description: ModsEntered.description,
        likes: 0,
        fileName: ModsEntered.file.name,
        fileType: ModsEntered.file.type
    };
    
    let reader = new FileReader();
    reader.onload = function(event) {
        newMod.fileData = event.target.result;
        existingMods.push(newMod);
        localStorage.setItem("Mods", JSON.stringify(existingMods));
        loadMods();
    };
    reader.readAsDataURL(ModsEntered.file);
}

function deleteMods(index) {
    let Mods = JSON.parse(localStorage.getItem("Mods")) || [];
    Mods.splice(index, 1);
    localStorage.setItem("Mods", JSON.stringify(Mods));
    loadMods();
}

function loadMods() {
    let Filecontainer = document.getElementById("Filecontainer");
    if (!Filecontainer) return;
    
    Filecontainer.innerHTML = "";
    
    let existingMods = JSON.parse(localStorage.getItem("Mods")) || [];
    existingMods.forEach((data, index) => {
        let entryDiv = document.createElement("div");
        entryDiv.className = "entry";
        
        let fileElement = '';
        if (data.fileData && data.fileType) {
            if (data.fileType.startsWith('image/')) {
                fileElement = `<img src="${data.fileData}" alt="Uploaded Image" style="max-width: 400px;">`;
            } else if (data.fileType === 'text/plain') {
                fileElement = `<a href="${data.fileData}" download="${data.fileName}">Download ${data.fileName}</a>`;
            } else{
                fileElement = `<a href="${data.fileData}" download="${data.fileName}">Download ${data.fileName}</a>`
            }
        }
        
        entryDiv.innerHTML = `
            <h3>${data.title || 'No Title'}</h3>
            <p>${data.description || 'No Description'}</p>
            ${fileElement}
            <button onclick="deleteMods(${index})"><i class="fa fa-trash"></i> Delete</button>
        `;
        
        Filecontainer.appendChild(entryDiv);
    });
}

document.addEventListener('DOMContentLoaded', loadMods);


document.addEventListener('DOMContentLoaded', loadComments,initializeComments);

    

