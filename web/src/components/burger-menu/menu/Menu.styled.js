import styled from 'styled-components';

export const TopRightButton = styled.div`
  ${'' /* height: '3rem'; */}
`

export const BottomButton = styled.div`
  bottom: 0;
  position: absolute;
  width: 100%;
`

export const StyledMenu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  background: ${({ theme }) => theme.primaryLight};
  transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(-100%)'};
  height: 100vh;
  text-align: left;
  padding: 0rem 0 2rem 0rem;
  position: absolute;
  top: 0rem;
  z-index: 10;
  left: 0;
  transition: transform 0.3s ease-in-out;
  border-right: 1px solid ${({ theme }) => theme.secondaryLight};

  @media (max-width: ${({ theme }) => theme.mobile}) {
      width: 80%;
    }

  ${TopRightButton} {
    opacity: ${({ open }) => open ? 1 : 0};
    transition: ${({ open }) => open ? 'opacity 0.25s cubic-bezier(1, 0.02, 1, 0.4) 0s' : 'opacity 0.25s ease 0s'}
  }

  h3 {
    display: flex;
    align-items: center;
  }

  a {
    font-size: 2rem;
    text-transform: uppercase;
    padding: 2rem 0;
    font-weight: bold;
    letter-spacing: 0.5rem;
    color: ${({ theme }) => theme.primaryDark};
    text-decoration: none;
    transition: color 0.3s linear;

    @media (max-width: ${({ theme }) => theme.mobile}) {
      font-size: 1.5rem;
      text-align: center;
    }

    &:hover {
      color: ${({ theme }) => theme.primaryHover};
    }
  }
`;
