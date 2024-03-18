// JavaScript to Handle the Form Submission and Interact with the API

document.getElementById('createPostForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;
    const author = document.getElementById('author').value;

    fetch('/blogs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, body, author })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            getPosts(); // Function to refresh the list of posts
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

function getPosts() {
    fetch('/blogs')
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.getElementById('posts');
            postsContainer.innerHTML = ''; // Clear current posts
            posts.forEach(post => {
                const postElement = createPostElement(post);
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error:', error));
}

function createPostElement(post) {
    // Use 'createdAt' field provided by Mongoose
    const date = new Date(post.timestamps); // Convert to a readable format
    const formattedDate = date.toDateString() + ' ' + date.toLocaleTimeString();

    // Create post element with title, body, author, and timestamp
    const postElement = document.createElement('div');
    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.body}</p>
      <p>Author: ${post.author}</p>
      <p>Date: ${formattedDate}</p>
    `;
    postElement.classList.add('post');

    // delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function () {
        fetch(`/blogs/${post._id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(() => {
                getPosts(); // Refresh the list of posts after deletion
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    postElement.appendChild(deleteButton);
    return postElement;
}

// Call getPosts on load to display all posts
window.onload = getPosts;