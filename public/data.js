document.addEventListener('DOMContentLoaded', () => {
    fetch('/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('data-table-body');
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.firstName}</td>
                    <td>${item.email}</td>
                    <td>${item.password}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
