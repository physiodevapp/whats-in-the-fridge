import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AuthStore from "./contexts/AuthStore";
import PrivateRoute from "./guards/PrivateRoute";

import LoginPage from "./pages/LoginPage";

import PantryPage from "./pages/PantryPage"

import ProductNewPage from "./pages/ProductNewPage";
import PantryNewPage from "./pages/PantryNewPage";

import { ThemeProvider } from 'styled-components';
import { useOnClickOutside } from './components/burger-menu/hooks/Hooks';
import { Burger, Menu, Behind } from './components/burger-menu';
import { theme } from './components/burger-menu/themes/Themes';
import { useRef, useState } from "react";
import Navbar from "./components/navbar/Navbar";
import PageLayoutMain from "./components/layout/layout-main/PageLayoutMain";
import Button from "./components/button/Button";

import PantryGrocersNearPage from "./pages/PantryGrocersNearPage";

import PantryInvitationNewPage from "./pages/PantryNewInvitationPage";
import PantryJoinPage from "./pages/PantryJoinPage";
import NoMatch from "./guards/NoMatch";

function App() {

  /************************** */
  const [open, setOpen] = useState(false);
  const node = useRef();
  const menuId = "main-menu";

  useOnClickOutside(node, () => setOpen(false));
  /**************************** */

  const location = useLocation()
  const navigate = useNavigate()

  const handleRightBtn = () => {
    navigate(`/pantries/${location.pathname.split('/')[2]}/near`)
  }

  return (
    <>
      <AuthStore>
        <PageLayoutMain
          navbarElement={
            <Navbar
              leftBtn={
                <ThemeProvider theme={theme}>
                  <div ref={node}>
                    <Burger open={open} setOpen={setOpen} aria-controls={menuId} />
                    <Menu open={open} setOpen={setOpen} id={menuId} />
                  </div>
                  <Behind open={open} setOpen={setOpen}></Behind>
                </ThemeProvider>
              }

              rightBnt={
                (location.pathname.endsWith('/products') &&
                  <Button faClass={'fa fa-map'} show={true} position={'right'}
                    onClick={handleRightBtn}
                  />)
              }

            />
          }
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/pantries/new" element={<PrivateRoute><PantryNewPage /></PrivateRoute>} />
            <Route path="/pantries/:pantryId/join" element={<PrivateRoute><PantryJoinPage /></PrivateRoute>} />
            <Route path="/pantries/:pantryId/near" element={<PrivateRoute><PantryGrocersNearPage /></PrivateRoute>} />
            <Route path="/pantries/:pantryId/products" element={<PrivateRoute><PantryPage /></PrivateRoute>} />
            <Route path="/pantries/:pantryId/products/new" element={<PrivateRoute><ProductNewPage /></PrivateRoute>} />
            <Route path="/pantries/:pantryId/invitations/new" element={<PrivateRoute><PantryInvitationNewPage /></PrivateRoute>} />
            <Route exact path="/" element={<NoMatch/>}/>
          </Routes>
        </PageLayoutMain>
      </AuthStore>
    </>
  );
}

export default App;
