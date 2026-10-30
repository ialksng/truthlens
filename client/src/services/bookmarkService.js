export const saveBookmarkLocally = (article) => {
  const existing = JSON.parse(localStorage.getItem("truthlens_bookmarks")) || [];

  const alreadyExists = existing.find((item) => item.link === article.link);

  if (!alreadyExists) {
    existing.push(article);
    localStorage.setItem("truthlens_bookmarks", JSON.stringify(existing));
  }
};

export const getLocalBookmarks = () => {
  return JSON.parse(localStorage.getItem("truthlens_bookmarks")) || [];
};