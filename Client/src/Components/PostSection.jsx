import PostCard from "./PostCard";
function PostSection({ posts }) {
  if (posts.length == 0) return <div>No Posts Found!</div>
  return (
    <ul>
      {posts?.map((q, index) => (
        <PostCard post={q} key={index} />
      ))}
    </ul>
  );
}

export default PostSection;
