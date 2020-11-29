import { useState, useEffect } from 'react';
import TextPart from './TextPart';
import _ from 'lodash';

const App = () => {
  const [postChunks, setPostChunks] = useState();

  useEffect(() => {
    (async () => {
      // TODO: Avoid lodash with a custom function?
      setPostChunks(_.chunk(await (await fetch('/api/posts')).json(), 20));
    })();
  }, []);
  return (
    <div className='App' style={{ textAlign: 'justify' }}>
      <h1>GBAtemp One Word Novel Reader</h1>
      {postChunks &&
        postChunks.map((posts) => (
          <div key={Math.random()} style={{ marginBottom: '1rem' }}>
            {posts.map((post) => (
              <TextPart key={Math.random()} post={post} />
            ))}
          </div>
        ))}
    </div>
  );
};

export default App;
