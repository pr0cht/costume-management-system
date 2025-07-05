document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', function() {
        const page = this.getAttribute('data-page');
        if (page) {
            fetch(page)
                .then(response => response.text())
                .then(html => {
                    document.querySelector('.content-container').innerHTML = html;
                })
                .catch(error => console.error('Error loading page:', error));
        }
    });
});