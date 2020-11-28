import { useState } from 'react';

const TextPart = ({ post }) => {
  const [hoverVisible, setHoverVisible] = useState(false);

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
      onMouseEnter={() => setHoverVisible(true)}
      onMouseOut={() => setHoverVisible(false)}
    >
      {post.text}
      <div
        className='text-part__hover-info'
        style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          pointerEvents: 'none',
          padding: '1rem',
          backgroundColor: 'rgba(0,0,0,0.80)',
          borderRadius: '1rem',
          borderTopLeftRadius: '0',
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
