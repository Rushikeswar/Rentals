import React from 'react'
import '../css/AdminPage.css';
import { Outlet, useNavigation } from 'react-router-dom';
const AdminPage = () => {
  return (
    <div className='dashboard-container'>
      <div className='dashboard-menu'>
            <h2>Menu</h2>
            <ul>
                <li className="options"><a href='/adminpage/managers'>Managers</a></li>
                <li className="options"><a href='/adminpage/bookings'>Bookings</a></li>
                <li className="options"><a href='/adminpage/users'>Users</a></li>
                <li className="options"><a href='/adminpage/revenue'>Revenue</a></li>
                <li className="options"><a href='/adminpage/notifications'>Notifications</a></li>
                <li className="logout"><a>Logout</a></li>
            </ul>
      </div>
      <div className='dashboard-content'>
        <Outlet/>
      </div>
    </div>
  )
}

export default AdminPage
