import { useState } from 'react';

const TextPart = ({ post }) => {
  const [hoverVisible, setHoverVisible] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);

  return (
    <div
      className='text-part'
      style={{
        display: 'inline',
        position: 'relative',
        padding: '0.2rem 0.1rem',
        borderTopLeftRadius: '0.4rem',
        borderTopRightRadius: '0.4rem',
        backgroundColor: hoverVisible ? 'rgba(0,0,0,0.80)' : '',
        color: hoverVisible ? 'white' : '',
      }}
      onMouseEnter={(e) => {
        setLastMouseX(e.clientX);
        setHoverVisible(true);
      }}
      onMouseOut={() => setHoverVisible(false)}
    >
      {post.text}
      <div
        className='text-part__hover-info'
        style={{
          position: 'absolute',
          top: '100%',
          left: lastMouseX && lastMouseX < window.innerWidth / 2 ? '0' : '',
          right: lastMouseX && lastMouseX > window.innerWidth / 2 ? '0' : '',
          pointerEvents: 'none',
          padding: '1rem',
          backgroundColor: 'rgba(0,0,0,0.80)',
          borderRadius: '1rem',
          borderTopLeftRadius:
            lastMouseX && lastMouseX < window.innerWidth / 2 ? '0' : '1rem',
          borderTopRightRadius:
            lastMouseX && lastMouseX > window.innerWidth / 2 ? '0' : '1rem',
          color: 'white',
          zIndex: '99',
          minWidth: '200px',
          display: hoverVisible ? 'block' : 'none',
        }}
      >
        Posted by: {post.author}
        <br />
        <br />
        Posted on: {post.date}
      </div>
    </div>
  );
};

export default TextPart;
