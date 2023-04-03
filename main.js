// Функції для запитів до JSONPlaceholder API
function getPostById(id) {
  return new Promise((resolve, reject) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          reject(new Error(`Не вдалося знайти пост з ID ${id}`));
        }
      })
      .then((post) => resolve(post))
      .catch((error) => reject(error));
  });
}

function getCommentsByPostId(id) {
  return new Promise((resolve, reject) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
      .then((response) => response.json())
      .then((comments) => resolve(comments))
      .catch((error) => reject(error));
  });
}

// Обробник подій для кнопки пошуку
document.getElementById("searchBtn").addEventListener("click", () => {
  const postId = document.getElementById("postId").value;

  if (postId < 1 || postId > 100) {
    alert("Будь ласка, введіть ID від 1 до 100.");
    return;
  }

  getPostById(postId)
    .then((post) => {
      const postContainer = document.getElementById("postContainer");
      postContainer.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.body}</p>
          <button id="loadCommentsBtn">Завантажити коментарі</button>
          <div id="commentsContainer"></div>
        `;

      document
        .getElementById("loadCommentsBtn")
        .addEventListener("click", () => {
          getCommentsByPostId(postId)
            .then((comments) => {
              const commentsContainer =
                document.getElementById("commentsContainer");
              commentsContainer.innerHTML = `
                <h3>Коментарі:</h3>
                <ul>
                  ${comments
                    .map(
                      (comment) =>
                        `<li><strong>${comment.name}</strong> (${comment.email}): ${comment.body}</li>`
                    )
                    .join("")}
                </ul>
              `;
            })
            .catch((error) => {
              console.error(error);
              alert("Виникла помилка при завантаженні коментарів.");
            });
        });
    })
    .catch((error) => {
      console.error(error);
      alert("Виникла помилка при завантаженні поста.");
    });
});
