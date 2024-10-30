document.querySelector('.btn-primary').addEventListener('click', () => {
    document.getElementById('status').value = 'Загрузка...';
    loadRandomUsers(3, 'promise', 'cyan').then(() => {
        loadRandomUsers(3, 'fetch', 'lightpink');
    });
});

function loadRandomUsers(cardCount, method, color) {
    const promises = [];

    for (let i = 1; i <= cardCount; i++) {
        const cardId = method === 'promise' ? i : i + 3;
        if (method === 'fetch') {
            promises.push(fetchRandomUser(cardId, color));
        } else {
            promises.push(
                new Promise((resolve, reject) => {
                    fetchRandomUser(cardId, color).then(resolve).catch(reject);
                })
            );
        }
    }

    return Promise.all(promises)
        .then(() => {
            document.getElementById('status').value = 'Успішно завантажено';
        })
        .catch(error => {
            console.error(`Ошибка загрузки через ${method}`, error);
            document.getElementById('status').value = 'Помилка завантаження';
        });
}

function fetchRandomUser(id, color) {
    return fetch('https://randomuser.me/api/')
        .then(response => response.json())
        .then(data => {
            const user = data.results[0];
            updateCard(id, user, color);
        });
}

function updateCard(id, user, color) {
    const cardElement = document.getElementById(`img-${id}`).closest('.card'); // Находим элемент карточки
    if (!cardElement) {
        console.error(`Карточка с id img-${id} не найдена`);
        return;
    }

    const imgElement = document.getElementById(`img-${id}`);
    const infoElement = document.getElementById(`info-${id}`);

    cardElement.style.backgroundColor = color;

    imgElement.src = user.picture.large;

    infoElement.innerHTML = `
           <strong>Країна:</strong> ${user.location.country}<br>
    <strong>Почта:</strong> ${user.email}<br>
    <strong>Телефон:</strong> ${user.phone}<br>
    <strong>Координати:</strong> Широта: ${user.location.coordinates.latitude}, Довгота: ${user.location.coordinates.longitude}<br>
    `;
}
