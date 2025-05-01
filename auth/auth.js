
const CLIENT_ID = "Ov23liX2kruthgsllHgA";
const REDIRECT_URI = "https://omanaq.github.io/CyberAI.Weep/auth/callback";

const loginUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user`;

function redirectToGitHub() {
    window.location.href = loginUrl;
}
