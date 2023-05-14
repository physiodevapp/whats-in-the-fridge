import styled from 'styled-components';


export const HamburgerSpan = styled.span`
  width: 2rem;
  height: 0.25rem;
  border-radius: 10px;
  transition: all 0.3s linear;
  position: relative;
  transform-origin: 1px;
`

export const StyledBurger = styled.button`
  position: relative;
  top: 0%;
  left: 0rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 20;

  &:hover {
    ${HamburgerSpan} {
      background: ${({ theme, open }) => open ? theme.secondaryLight : 'black'}
    }
  }

  ${HamburgerSpan} {

    background: ${({ theme, open }) => open ? theme.secondaryLight : theme.secondaryLight};

    :first-child {
      transform: ${({ open }) => open ? 'rotate(45deg)' : 'rotate(0)'};
    }

    :nth-child(2) {
      opacity: ${({ open }) => open ? '0' : '1'};
      transform: ${({ open }) => open ? 'translateX(20px)' : 'translateX(0)'};
    }

    :nth-child(3) {
      transform: ${({ open }) => open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
  
`;
