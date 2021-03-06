function SplashCoverImage(path, author, link) {
    this.path = path;
    this.author = author;
    this.link = link;
}

let images = [
    new SplashCoverImage('Rayquaza', 'Unsettled', 'https://lospec.com/unsettled'),
    new SplashCoverImage('Mountains', 'Skeddles', 'https://lospec.com/skeddles'),
    new SplashCoverImage('Sweetie', 'GrafxKid', 'https://twitter.com/GrafxKid'),
    new SplashCoverImage('Glacier', 'WindfallApples', 'https://lospec.com/windfallapples'),
    new SplashCoverImage('Polyphorge1', 'Polyphorge', 'https://lospec.com/poly-phorge'),
    new SplashCoverImage('Fusionnist', 'Fusionnist', 'https://lospec.com/fusionnist')
];


let coverImage = document.getElementById('editor-logo');
let authorLink = coverImage.getElementsByTagName('a')[0];
let chosenImage = images[Math.round(Math.random() * (images.length - 1))];

coverImage.style.backgroundImage = 'url("' + chosenImage.path + '.png")';
authorLink.setAttribute('href', chosenImage.link);
authorLink.innerHTML = 'Art by ' + chosenImage.author;