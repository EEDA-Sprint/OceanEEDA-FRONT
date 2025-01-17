'use client';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  

  return (
    <div>
      <button onClick={() => console.log(process.env.NEXT_PUBLIC_GRAPHQL_URI)}>TEST</button>
    </div>
  );
}

export default Home;

