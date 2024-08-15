document.addEventListener("DOMContentLoaded", () => {
  const blogPosts = [
    { title: "My First Blog Post", file: "blog/blog-post-1.md" },
    { title: "Another Interesting Post", file: "blog/blog-post-2.md" },
  ];

  const blogPostsList = document.getElementById("blog-posts");

  blogPosts.forEach((post) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.textContent = post.title;
    link.href = `#${post.file}`;
    link.onclick = (e) => {
      e.preventDefault();
      loadBlogPost(post.file);
    };
    listItem.appendChild(link);
    blogPostsList.appendChild(listItem);
  });
});

function loadBlogPost(file) {
  fetch(file)
    .then((response) => response.text())
    .then((markdown) => {
      const converter = new showdown.Converter();
      const html = converter.makeHtml(markdown);
      document.querySelector("main").innerHTML = `<h2>${file}</h2>${html}`;
    });
}
