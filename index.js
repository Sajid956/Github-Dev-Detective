const getByAttribute = (param) => document.querySelector(`[${param}]`);
const root = document.documentElement.style;
const modeInfo = getByAttribute('mode-info');
const modeImage = getByAttribute('mode-image');
const url = 'https://api.github.com/users/';
const inputField = getByAttribute('search-input');
const btn = getByAttribute('search-btn');
const profileSection = document.querySelector('.profile-section');
const loaderImage = getByAttribute('loader-container');
const loader = getByAttribute('loader-image');
const errorBlock = getByAttribute('error-msg');
const errorCode = getByAttribute('error-code');
const errorText = getByAttribute('error-text');

btn.addEventListener('click', () => {
    fetchUserDetails(inputField.value);
});
inputField.addEventListener('keydown', (e) => {
   if(e.keyCode === 13) {
    fetchUserDetails(inputField.value);
   }
})

async function fetchUserDetails(value) {

    if(value !== '') {
        errorBlock.style.display = 'none';
        profileSection.style.display = 'none';
        loaderImage.style.display = 'flex';
        const giturl = url + value;

        try {
            const response = await fetch(giturl);
            const data = await response.json();          
            UpdateUI(data);
        }
        catch(err) {
            loaderImage.style.display = 'none';
            if (err instanceof TypeError && err.message === 'Failed to fetch') {
                // Check for network disconnection error
                if (navigator.onLine === false) {
                    errorCode.textContent = '';
                  errorText.textContent = 'Network Disconnected: Please check your internet connection.';
                } else {
                    errorCode.textContent = '';
                    errorText.textContent = 'Network Error: Failed to fetch data from the server.';
                }
            } else {
                // Handle other general errors
                errorCode.textContent = '404';
                errorText.textContent = 'Not Found';
            }
            errorBlock.style.display = 'flex';
        }
    }
}

const month = ['Jan', 'Feb', 'March', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function isNUll(param1, param2) {
    if(param1 === null || param1 === '') {
        param2.style.opacity = 0.5;
        return true;
    }

    param2.style.opacity = 1;
    return false;
}

function UpdateUI(data) {

    if(data.message !== "Not Found") {
        const userImage = getByAttribute('user-image');
        const userName = getByAttribute('user-name');
        const userProfile = getByAttribute('user-profile');
        const userDate = getByAttribute('user-date');
        const userDesc = getByAttribute('description');
        const userRepo = getByAttribute('user-repo');
        const userFollowers = getByAttribute('user-followers');
        const userFollowing = getByAttribute('user-following');
        const dataLocation = getByAttribute('data-location');
        const dataTwitter = getByAttribute('data-twitter');
        const dataUserId = getByAttribute('data-userId');
        const dataCompany = getByAttribute('data-company');

        userImage.src = `${data?.avatar_url}`;
        userName.textContent = data?.name == null ? data?.login : data?.name;
        userProfile.textContent = `@${data?.login}`;
        userProfile.href = data?.html_url;
        const dateSegment = data?.created_at.split('T').shift().split('-');
        userDate.textContent = `Joined ${dateSegment[2]} ${month[dateSegment[1] - 1]} ${dateSegment[0]}`;

        userDesc.textContent = data?.bio === null ? 'This profile has no bio' : data?.bio;
        userRepo.textContent = data?.public_repos;
        userFollowers.textContent = data?.followers;
        userFollowing.textContent = data?.following;
        dataLocation.textContent = isNUll(data?.location, dataLocation) ? 'Not Available' : data?.location;
        dataTwitter.textContent = isNUll(data?.twitter_username, dataTwitter) ? 'Not Available' : data?.twitter_username;
        
        dataTwitter.href = isNUll(data?.twitter_username, dataTwitter) ? '#' : `https://twitter.com/${data.twitter_username}`;

        dataUserId.textContent = isNUll(data?.blog, dataUserId) ? 'Not Available' : data?.blog;
        
        dataUserId.href = isNUll(data?.blog, dataUserId) ? '#' : data?.blog;

        dataCompany.textContent = isNUll(data?.company, dataCompany) ? 'Not Available' : data?.company;

        profileSection.style.display = 'flex';
        loaderImage.style.display = 'none';
    }
    else {
        throw new Error('Not Found');
    }
    
}

// Initializing the page
let darkmode;

function init() {
    darkmode = false;
    errorBlock.style.display = 'none';
    fetchUserDetails('sajid956');

    if(localStorage.getItem("dark-mode") == 'true') {
        //enable dark mode
        enableDarkMode();
    }
    else {
        //enable light mode
        enableLightMode();
    }
}

init();

function enableDarkMode () {
    root.setProperty("--lm-bg", "#141D2F");
    root.setProperty("--lm-bg-content", "#1E2A47");
    root.setProperty("--lm-text", "white");
    root.setProperty("--lm-text-alt", "white");
    root.setProperty("--lm-shadow-xl", "rgba(70,88,109,0.15)");

    modeInfo.textContent = 'LIGHT';
    modeImage.src = './images/sun-icon.svg'
    loader.src = './images/loaderdark.gif';
    darkmode = true;
    localStorage.setItem("dark-mode", true);
}

function enableLightMode() {
    root.setProperty("--lm-bg", "#F6F8FF");
    root.setProperty("--lm-bg-content", "#FEFEFE");
    root.setProperty("--lm-text", "#4B6A9B");
    root.setProperty("--lm-text-alt", "#2B3442");
    root.setProperty("--lm-shadow-xl", "rgba(70, 88, 109, 0.25)");

    modeInfo.textContent = 'DARK';
    modeImage.src = './images/moon-icon.svg';
    loader.src = './images/loaderlight.gif';
    darkmode = false;
    localStorage.setItem("dark-mode", false);
}

const modeBtn = document.querySelector('.mode');

modeBtn.addEventListener('click', () => {
    if(darkmode == false) {
        //enable dark mode
        enableDarkMode();
    }
    else {
        //enable light mode
        enableLightMode();
    }
})