import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div>
      Welcome
      <Link to="home">go to home</Link>
    </div>
  );
}

export default Welcome;
