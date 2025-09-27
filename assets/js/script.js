//replace the nav placeholder with the content of nav.html
fetch('navigation/nav.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('nav-placeholder').innerHTML = data;
    });

//replace footer placeholder with the content of footer.html
fetch('navigation/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    });


//404.html iframe if not logged in
fetch('navigation/404.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('not-logged-in').innerHTML = data;
    });

if (localStorage.getItem('french_logged_in') === 'true') {
    document.getElementById('not-logged-in').style.display = 'none';
}
else {
    document.getElementById('logged-in').style.display = 'none';
}