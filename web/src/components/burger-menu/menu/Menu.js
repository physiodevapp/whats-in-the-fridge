import React, { useContext } from 'react';
import { bool } from 'prop-types';
import { StyledMenu, TopRightButton, BottomButton } from './Menu.styled';
import { theme } from '../themes/Themes';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthStore'

function Menu({ open, setOpen, ...props }) {
  const isHidden = open ? true : false;

  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const pantryId = useLocation().pathname.split('/')[2]

  const { getUserFormLocalStorage, logout } = useContext(AuthContext)

  const handleClick = (pantryId) => {
    // console.log(`/pantry/${pantryId}/products`)
    setOpen(false)
    if (getUserFormLocalStorage()) {
      navigate(`/pantries/${pantryId}/products`)
    } else {
      navigate('/login')
    }
  }

  const handleClick2 = () => {
    // console.log(`/pantry/${pantryId}/products`)
    setOpen(false)
    if (getUserFormLocalStorage()) {
      navigate(`/pantries/new`)
    } else {
      navigate('/login')
    }
  }

  const handleClickLogout = () => {
    setOpen(false)
    logout()
  }


  return (
    <StyledMenu open={open} aria-hidden={!isHidden} {...props}>
      <div>
        <TopRightButton>
          <div className='navbar d-flex justify-content-end p-2'>
            <button className='btn btn-dark me-3 d-flex align-items-center' onClick={handleClick2}>Add new pantry</button>
          </div>
        </TopRightButton>

        <div className="accordion accordion-flush" id="accordionMenu">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button" style={{ fontStyle: "italic", backgroundColor: theme.primaryLightTransparency }} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                <h3><i className="fa fa-sitemap fa-fw pe-3" aria-hidden="true"></i><span className='ms-2'>My pantries</span></h3>
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionMenu">
              <div className="accordion-body p-0">
                <div className="list-group list-group-flush ps-1 pe-1">
                  {user?.pantries && user?.pantries.map(pantry => (
                    <button key={pantry.id} type="button" className={`list-group-item list-group-item-action ${pantry.id === pantryId ? 'active' : ''} position-relative`} onClick={() => handleClick(pantry.id)}>
                      <i className={`${pantry.id === pantryId ? 'fa fa-folder-open' : 'fa fa-folder-o'} fa-fw`} aria-hidden="true"></i> {pantry?.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button" style={{ fontStyle: "italic", backgroundColor: theme.primaryLightTransparency }} type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                <h3><i className="fa fa-info fa-fw pe-3" aria-hidden="true"></i><span className='ms-2'>What's in my fridge</span></h3>
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionMenu">
              <div className="accordion-body" style={{lineHeight: '2.5rem', fontSize: '1.2rem'}}>
                <strong>Our mission </strong> is to promote the consumption of local food and prevent food from expiring in our fridge. <span style={{ fontSize: '1.4rem' }}>🥗</span>.
              </div>
            </div>
          </div>
        </div>

        <BottomButton>
          <div className="navbar d-flex justify-content-end p-2 pe-4 ps-4"><button className="btn btn-outline-dark" style={{ width: '100%', border: '2px solid' }} onClick={handleClickLogout}>Log Out</button></div>
        </BottomButton>

      </div>
    </StyledMenu>
  )
}

Menu.propTypes = {
  open: bool.isRequired,
  // pantry: {}
}

export default Menu