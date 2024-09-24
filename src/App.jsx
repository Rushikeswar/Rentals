import { createBrowserRouter, RouterProvider,useParams } from 'react-router-dom';
import SignupForm from '../frontend/components/Signup';
import LoginForm from '../frontend/components/Login';
import RentForm from '../frontend/components/RentForm.jsx';
import FilterForm from '../frontend/components/FilterForm.jsx';
import Category from '../frontend/components/CategoryPage.jsx';
import MainLayout from '../frontend/components/MainLayout.jsx';
import ProductbookingPage from '../frontend/components/ProductbookingPage.jsx';
import NotFound from '../frontend/components/NotFoundPage.jsx';
import ProductPage from '../frontend/components/ProductPage.jsx';
import AdminPage from '../frontend/components/AdminPage.jsx';
import Adminusers from '../frontend/components/Admindashboard/Users';

import AccountProfile from '../frontend/components/Userdashboard/AccountProfile.jsx';
import AccountDetails from '../frontend/components/Userdashboard/AccountDetails.jsx';
import YourBookings from '../frontend/components/Userdashboard/YourBookings.jsx';
import YourRentals from "../frontend/components/Userdashboard/YourRentals.jsx";
import AccountSettings from '../frontend/components/Userdashboard/AccountSettings.jsx';


import '../frontend/css/App.css';
const allowedCategories = ['bikes', 'cars', 'cameras', 'drones','speakers','fishingrods'];

const CategoryWrapper = () => {
  const { category } = useParams();

  // Conditionally render the Category component if the category is allowed
  if (allowedCategories.includes(category)) {
    return <Category />;
  }
  else{
  return <NotFound/>;
  }
};
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element:<MainLayout/>,   
      // errorElement:<ErrorPage/>,
    children:[
    {
      path: '/FilterForm',
      element: (
          <FilterForm />
      ),
    },
    {
      path: '/category/:category',
      element: (
          <CategoryWrapper/>
      ),
    },
    {
      path:'/products/:product_id',
      element:(<ProductPage/>),
    },
    {
      path:'/productbooking/:product_id',
      element:(
         <ProductbookingPage/>
      ),
    },
  ]}
  ,
  {
    path: '/login',
    element: (
        <LoginForm />
    ),
  },
  {
    path: '/Signup',
    element: (
        <SignupForm/>
    ),
  },
  {
    path: '/RentForm',
    element: (
        <RentForm />
    ),
  },
  {
    path:'/adminpage',
    element:<AdminPage/>,
    children:[
      {
        path:'users',
        element:<Adminusers/>,
      },
    ],
  },

  {
    path:"/accountProfile",
    element:(
      <AccountProfile/>
    ),
    children:[
      {
        path:"/accountProfile",
        element:(
          <AccountDetails/>
        )
    },
      {
          path:"/accountProfile/details",
          element:(
            <AccountDetails/>
          )
      },
      {
        path:"/accountProfile/bookings",
        element:(
          <YourBookings/>
        )
      },
      {
        path:"/accountProfile/rentals",
        element:(
          <YourRentals/>
        )
      },
      {
        path:"/accountProfile/settings",
        element:(
          <AccountSettings/>
        )
      },

    ]
  },
  {
    path:'*',
    element:(
      <NotFound/>
    )
  },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

