import PostVerificationCard from "./PostVerificationCard";
function PostVerificationSection({ posts }) {
  if (posts.length == 0) return <div>No Posts Found!</div>;
  return (
    <ul>
      {posts?.map((q, index) => (
        <PostVerificationCard post={q} key={index} />
      ))}
    </ul>
  );
}

export default PostVerificationSection;
