import { useState } from 'react';
import styled, { css } from 'styled-components';

const TextPart = ({ post }) => {
  const [lastMouseX, setLastMouseX] = useState(0);

  return (
    <Part
      onMouseEnter={(e) => {
        setLastMouseX(e.clientX);
      }}
    >
      {post.text}
      <PartHoverInfo lastMouseX={lastMouseX}>
        Posted by: {post.author}
        <br />
        <br />
        Posted on: {post.date}
      </PartHoverInfo>
    </Part>
  );
};

const Part = styled.div`
  display: inline-block;
  position: relative;
  padding: 0.2rem 0.1rem;
  border-top-left-radius: 0.4rem;
  border-top-right-radius: 0.4rem;
  transition: 0.3s ease-in-out;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
  }
`;

const PartHoverInfo = styled.div`
  position: absolute;
  top: 100%;
  pointer-events: none;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 1rem;
  color: transparent;
  z-index: 99;
  min-width: 200px;
  text-align: left;
  transition: 0.3s ease-in-out;
  transition-property: background-color, color;
  user-select: none;

  ${Part}:hover & {
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
  }

  ${({ lastMouseX }) =>
    lastMouseX &&
    css`
      left: ${lastMouseX < window.innerWidth / 2 ? '0' : ''};
      right: ${lastMouseX > window.innerWidth / 2 ? '0' : ''};
      border-top-left-radius: ${lastMouseX < window.innerWidth / 2
        ? '0'
        : '1rem'};
      border-top-right-radius: ${lastMouseX > window.innerWidth / 2
        ? '0'
        : '1rem'};
    `}
`;

export default TextPart;
