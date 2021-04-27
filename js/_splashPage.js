function SplashCoverImage(path, author, link) {
    this.path = path;
    this.author = author;
    this.link = link;
}

let images = [
    new SplashCoverImage('Rayquaza', 'Unsettled', 'https://twitter.com/_unsettled_'),
    new SplashCoverImage('Mountains', 'Skeddles', 'https://twitter.com/skeddles'),
    new SplashCoverImage('Sweetie', 'GrafxKid', 'https://grafxkid.tumblr.com/'),
    new SplashCoverImage('Glacier', 'WindfallApples', 'https://twitter.com/windfallapples'),
    new SplashCoverImage('Polyphorge1', 'Polyphorge', 'https://lospec.com/poly-phorge'),
    new SplashCoverImage('Fusionnist', 'Fusionnist', 'https://twitter.com/fusionnist')
];


let coverImage = document.getElementById('editor-logo');
let authorLink = coverImage.getElementsByTagName('a')[0];
let chosenImage = images[Math.round(Math.random() * (images.length - 1))];

console.log ("Path: " + '/pixel-editor/' + chosenImage.path + '.png');

coverImage.style.backgroundImage = 'url("/pixel-editor/' + chosenImage.path + '.png")';
authorLink.setAttribute('href', chosenImage.link);
authorLink.innerHTML = 'Art by ' + chosenImage.author;