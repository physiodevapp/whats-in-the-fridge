import styled from 'styled-components';

export const StyledBehind = styled.div`
  background: #97948e63;
  position: absolute;
  top: 0rem;
  right: 0;
  width: 100vw;
  height: 100vh;

  ${'' /* opacity: ${({ open }) => open ? 1 : 0}; */}
  ${'' /* transition: ${({ open }) => !open ? `opacity 0.25s cubic-bezier(1, 0.02, 1, 0.4) 0s` : 'opacity 0.25s ease 0s'}; */}

  transform: ${({ open }) => open ? 'translateX(80%)' : 'translateX(110%)'};
  transition: transform 0.3s ease-in-out;
`