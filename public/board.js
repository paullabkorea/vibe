async function fetchPosts() {
  const res = await fetch('/api/posts');
  const posts = await res.json();
  const list = document.getElementById('posts');
  list.innerHTML = '';
  posts.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `[${p.author}] ${p.content}`;
    list.appendChild(li);
  });
}

document.getElementById('postForm').addEventListener('submit', async e => {
  e.preventDefault();
  const author = document.getElementById('author').value.trim();
  const content = document.getElementById('content').value.trim();
  if (!author || !content) return;
  await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, content })
  });
  document.getElementById('author').value = '';
  document.getElementById('content').value = '';
  fetchPosts();
});

fetchPosts();
