import { useState, useEffect } from 'react';
import TextPart from './TextPart';

const App = () => {
  const [posts, setPosts] = useState();

  useEffect(() => {
    (async () => {
      setPosts(await (await fetch('/api/posts')).json());
    })();
  }, []);

  return (
    <div className='App' style={{ textAlign: 'justify' }}>
      <h1>GBAtemp One Word Novel Reader</h1>
      {posts &&
        posts.map((post, index) => {
          const buf = [];

          if (index && index % 20 === 0) {
            buf.push(
              <>
                <br />
                <br />
              </>
            );
          }
          buf.push(<TextPart post={post} />, ' ');
          return buf;
        })}
    </div>
  );
};

export default App;
