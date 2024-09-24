import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import '../css/ProductbookingPage.css';
const ProductbookingPage = () => {
    const [reqproduct, setreqproduct] = useState({});
    const [message,setmessage]=useState("");
    const { product_id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryparams = new URLSearchParams(location.search);
    const frombookingdate = queryparams.get('frombookingdate');
    const tobookingdate = queryparams.get('tobookingdate');
    const fromDate = new Date(frombookingdate);
    const toDate = new Date(tobookingdate);
    const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return {
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}`
        };
    };

    const { date: fromDateFormatted, time: fromTimeFormatted } = formatDateTime(fromDate);
    const { date: toDateFormatted, time: toTimeFormatted } = formatDateTime(toDate);

    // Calculate duration in hours
    const timeDiff = Math.abs(toDate - fromDate); // Time difference in milliseconds
    const hoursDiff = Math.ceil(timeDiff / (1000 * 60 * 60)); // Convert milliseconds to hours
    // Calculate base fare and taxes
    const baseFare = reqproduct.price * hoursDiff;
    const taxes = (baseFare * 0.10).toFixed(2); // 10% tax
    const total = (parseFloat(baseFare) + parseFloat(taxes)).toFixed(2);

    const getCookieValue = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };
      
      const handlepayment = async () => {
        // const username = getCookieValue('username');
        // if(!username)
        // {   sessionStorage.setItem('lastpage','bookingpage');
        //     navigate('/login');
        // }
        const userid = getCookieValue('user_id');
        if(!userid)
        {   sessionStorage.setItem('lastpage','bookingpage');
            navigate('/login');
        }
        else{
                try{
                    const response=await fetch(`http://localhost:3000/booking`,{
                        method:'POST',
                        headers:{'Content-Type':'application/json'},
                        body:JSON.stringify({
                            product_id:product_id,
                            fromDateTime:fromDate,
                            toDateTime:toDate,
                            price:total,
                        }),
                        credentials:'include'
                    });
                    if(!response.ok){
                        const errorresponse=await response.json();
                        console.log(errorresponse.message);
                    }
                    else{
                        setmessage('Booking Successful !');
                        setTimeout(() => {
                            navigate('/');
                          }, 1000); 
                        console.log("Payment done");
                    }
                }
                catch(error){
                    console.log(error);
                }
        }
      };

    useEffect(() => {
        const fetchreqproduct = async (product_id) => {
            try {
                const response = await fetch(`http://localhost:3000/product/${product_id}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) {
                    console.log(response);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const product = await response.json();
                setreqproduct(product);
            } catch (error) {
                console.log(error);
            }
        };
        fetchreqproduct(product_id);
    }, [product_id]);

    return (
        <div className="container">
            <div className="summary">
            {reqproduct.photo && reqproduct.photo.length > 0 ? (
        <img src={reqproduct.photo[0]} alt={reqproduct.productName} />
    ) : (
        <p>No image available</p>
    )}
                <div id="summarytext">
                    <h2>SUMMARY</h2>
                    <p>Product: {reqproduct.productName}</p>
                    <p>Pickup Date: {fromDateFormatted}</p>
                    <p>Pickup Time: {fromTimeFormatted}</p>
                    <p>Drop-off Date: {toDateFormatted}</p>
                    <p>Drop-off Time: {toTimeFormatted}</p>
                    <p>Duration: {hoursDiff} hours</p>
                    <p>Location: {reqproduct.locationName}</p>
                    <p>Price per hour: ₹{reqproduct.price}</p>
                </div>
            </div>
            <div>
            <div className="checkout">
                <h2>CHECKOUT</h2>
                <p>Fare:{reqproduct.price} * {hoursDiff} hr = ₹{baseFare}</p>
                <p>Service Charges (10%): ₹{taxes}</p>
                <p>Total: ₹{total}</p>
                <button className="payment-button" onClick={handlepayment}>Make Payment</button>
            </div>
            <div><p>{message}</p></div>
            </div>
        </div>
    );
};

export default ProductbookingPage;