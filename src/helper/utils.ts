export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

interface Post {
  frontmatter: {
    date: string;
    draft?: boolean;
  };
}

interface Options {
  filterOutDrafts?: boolean;
  filterOutFuturePosts?: boolean;
  sortByDate?: boolean;
  limit?: number;
}

export function formatBlogPosts(posts: Post[], {
  // sortByDate = true,
  limit,
}: Options = {}): Post[] {
  const filteredPosts = posts.reduce((acc: Post[], post: Post) => {
    // add post to acc
    acc.push(post);
    return acc;
  }, []);

  // sortByDate or randomize
  // if (sortByDate) {
  //   filteredPosts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
  // } else {
  //   filteredPosts.sort(() => Math.random() - 0.5);
  // }

  // limit if number is passed
  if (typeof limit === "number") {
    return filteredPosts.slice(0, limit);
  }
  return filteredPosts;
}