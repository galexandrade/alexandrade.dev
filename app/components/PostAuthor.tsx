import { Link } from "remix";

export default function PostAuthor() {
  return (
    <div className="post-author">
      <div className="post-author__image">
        <img src="/assets/7shifts-office.jpeg" alt="Alex P. Andrade" />
      </div>
      <div className="post-author__info">
        <h2>Written by Alex P. Andrade</h2>
        <span>
          Alex Andrade is a senior frontend software engineer and father of two
          girls. He's is passionated about the frontend eco-system: Javascript,
          React, CSS, Jest, Cypress. His mission is to make the world a beter
          place to live through high quality code.
        </span>
        <Link to="/about">Lean more about me</Link>
      </div>
    </div>
  );
}
