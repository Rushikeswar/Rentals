// MainLayout.jsx
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { Outlet, useNavigation } from 'react-router-dom';

const MainLayout = () => {

  const navigation=useNavigation();
  if(navigation.state==="loading"){
    return <div>Loading...</div>;
  }
  return (
    <>
      <Header />
      <Outlet/> 
      <Footer />
    </>
  );
};

export default MainLayout;
