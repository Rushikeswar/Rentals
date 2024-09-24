import express from 'express';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connecttomongodb } from './backend/models/connect.js';
import { User } from './backend/models/UserSchema.js';
import {Product} from './backend/models/ProductSchema.js';
import {Booking} from './backend/models/Bookings.js';
const url='mongodb://localhost:27017/Rentals';
const app = express();
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

connecttomongodb(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });


//Signup

app.post('/signup', async (req, res) => {
  const { username, email, dateofbirth,password } = req.body;
  if (!username || !email || !dateofbirth || !password) {
    return res.status(409).json({ errormessage: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({ errormessage: 'Email already exists' });
    }
    if (existingUser) {
      return res.status(409).json({ errormessage: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      dateofbirth,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ errormessage: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ errormessage: 'Error registering user' });
  }
});




//Login

app.post('/login', async (req, res) => {
  const { username,password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ errormessage: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(401).json({ errormessage: 'Username not Found !' });
    }
    else{
      const checkpassword=await bcrypt.compare(password,existingUser.password)
    if (!checkpassword) {
      return res.status(401).json({ errormessage: 'Password is incorrect !' });
    }
    }

    //storing in cookies

    // res.cookie('username',username, { httpOnly: false, secure: false, sameSite: 'lax',path:'/' });
    res.cookie('user_id',existingUser._id.toString(),{ httpOnly: false, secure: false, sameSite: 'lax',path:'/' });
    res.status(200).json({ errormessage: 'User Login successfully' });
  } catch (error) {
    console.error('Error occured while logging in :', error);
    res.status(500).json({ errormessage: 'Error while user logging in !' });
  }
});



//RentForm

app.post('/RentForm', async (req, res) => {
  const {      productType,
    productName,
    locationName,
    fromDate,
    toDate,
    price,
    image,} = req.body;
  if (!productType||!productName||!locationName||!fromDate||!toDate||!price||!image) {
    return res.status(409).json({ errormessage: 'All fields are required' });
  }

  try {
    // const cookieusername = req.cookies.username;
    const cookieuserid=req.cookies.user_id;
    if (!cookieuserid) {
      return res.status(401).json({ errormessage: 'Unauthorized: No userid cookie found' });
    }

    const exist_user = await User.findOne({ _id: cookieuserid });

    const newProduct = new Product({
      userid: cookieuserid, // Use 'username' to match schema
      productType,
      productName,
      locationName,
      fromDateTime: new Date(fromDate), // Convert to Date object
      toDateTime: new Date(toDate),     // Convert to Date object
      price,
      photo: image, // Use 'photo' to match schema
      uploadDate:new Date(),
      bookingdates:[],
      bookingids:[],
    });

    const savedProduct = await newProduct.save();
    exist_user.rentals.push(savedProduct._id);
    await exist_user.save();

    res.status(201).json({ errormessage: 'Uploaded successfully'});
  } catch (error) {
    console.error('Error occured :', error);
    res.status(500).json({ errormessage: 'Upload failed' });
  }
});


app.post('/products', async (req, res) => {
  try {
    const {productType, locationName, fromDateTime, toDateTime, price}=await req.body;
    const query={};
    if(productType) query.productType=productType;
    if(locationName) query.locationName=locationName;
    if(fromDateTime) query.fromDateTime={ $gte: new Date(fromDateTime) };
    if(toDateTime) query.toDateTime= { $lte: new Date(toDateTime) };
    if(price) query.price={$lte : price};
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ errormessage: 'Failed to fetch products'});
  }
});



app.post('/product/:product_id',async(req,res)=>{
    const {product_id}=req.params;
    try{
      const reqproduct=await Product.findById(product_id);
      if(!reqproduct)
      {
        return res.status(404).json({error :'product not found !'});
      }
      return res.status(200).json(reqproduct);
      
    }catch(error)
    {
      res.status(500).json({error:"server error !"});
    }
})

app.post('/booking',async (req,res)=>{
  try{
  const {product_id,fromDateTime,toDateTime,price}=await req.body;
  const bookingDate=new Date();

  const buyerid=req.cookies.user_id;
  if (!buyerid || !/^[0-9a-fA-F]{24}$/.test(buyerid)) {
    return res.status(400).json({ message: "Invalid buyer ID format!" });
}
  const newbooking = new Booking({
    product_id,
    buyerid,
    fromDateTime,
    toDateTime,
    price,
    bookingDate,
  });
  const y=await newbooking.save();
  const newbookingid=newbooking._id.toString();
  const x=await User.findOneAndUpdate({_id:buyerid},{$push:{bookings:newbookingid}},{new:true});
  if(!y)
  {console.log("booking ot successful")
    return res.status(401).json({message:"booking not successful !"})
  }
  else if(!x)
  { console.log("couldnt update booking")
    return res.status(401).json({ message: "Couldn't update the booking!" });
  }
  res.status(200).json({message:"Booking successful !"});
  console.log("booking successful !");
  }
  catch(error){
    console.log(error);
    res.status(500).json({message:"server error !"});
  }
})

app.get('/admindashboard/registeredusers',async(req,res)=>{
  try{
    const users=await User.find({});
    const usercount = await User.countDocuments({});
    if(!users)
    {
      return res.status(404).json({error :'Users not found !'});
    }
    return res.status(200).json({registercount:usercount,users:users,});
    
  }catch(error)
  {
    res.status(500).json({error:"server error !"});
  }
})

// app.post('/admindashboard/deleteusers',async(req,res)=>{
//   console.log(req);
//   try{
//     const deleteuserid=req.body.user_id;

//     const bookings=await Booking.findOne({buyerid:deleteuserid});
//     if(bookings)
//     {
//       return res.status(200).json({alert:true});
//     }

//     const x=await Product.updateMany({userid:deleteuserid},{$set:{expired:true}},{new:true});
//     const deleteduser=await User.findByIdAndDelete(deleteuserid);

//     if(!deleteduser)
//     {
//       return res.status(404).json({message :'User not found in database!'});
//     }
//     return res.status(200).json({message : "user and his bookings , products deleted successfully !"});
    
//   }catch(error)
//   {
//     res.status(500).json({message:"server error !"});
//   }
// })

app.post('/admindashboard/deleteusers', async (req, res) => {
  const { user_id, forceDelete } = req.body;

  try {
    // Check if user has bookings
    const bookings = await Booking.findOne({ buyerid: user_id });
    if (bookings && !forceDelete) {
      // If bookings exist and forceDelete is false, return an alert
      return res.status(200).json({ alert: true, });
    }

    // If forceDelete is true or there are no bookings, proceed with deletion
    await Product.updateMany({ userid: user_id }, { $set: { expired: true } }, { new: true });
    const deletedUser = await User.findByIdAndDelete(user_id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found in database!' });
    }

    return res.status(200).json({ message: 'User and their bookings/products deleted successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error!' });
  }
});




const PORT =3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





app.get("/grabBookings", async (req, res) => {
  try {
    if (req.cookies.user_id) {
      const userid = req.cookies.user_id;
      const exist_user = await User.findOne({_id: userid });
      if (exist_user) {
        const productIds = exist_user.bookings;
        const products = await Booking.find({ _id: { $in: productIds } });
        const selectedIDs = products.map((ele) => ele.product_id);
        const selected = await Product.find({ _id: { $in: selectedIDs } });
        console.log(products[0]);
        if (products.length > 0) {
          res.json({ BookingProducts: products, Selected: selected });
        } else {
          res.status(404).json({ message: "No Booking products found" });
        }
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(400).json({ message: "No username cookie found" });
    }
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
});



app.post("/settings", async (req, res) => {
  try {
    const { editUsername, password, email } = req.body;

    // Check if username exists in cookies
    const currentUserid = req.cookies.user_id;

    if (!currentUserid) {
      return res.status(401).json({ message: "Unauthorized: No user logged in" });
    }

    // Find the user by their current username
    const existingUser = await User.findOne({ _id: currentUserid });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the new email is already in use
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ message: "Email already in use" });
      }
      existingUser.email = email; // Update email if it's new
    }

    // Check if the new username is already in use
    if (editUsername && editUsername !== currentUserid) {
      const usernameExists = await User.findOne({ username: editUsername });
      if (usernameExists) {
        return res.status(409).json({ message: "Username already in use" });
      }
      existingUser.username = editUsername; // Update the username
    }

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
    }

    // Save the updated user details
    await existingUser.save();
    console.log(existingUser)

    // If username is changed, update the cookie
    if (editUsername && editUsername !== currentUserid) {
      res.clearCookie('username');
      res.cookie('username', editUsername, { httpOnly: false, secure: false, sameSite: 'lax' });
    }

    res.status(200).json({ message: "User details updated successfully" });
  } catch (err) {
    console.error("Error updating user details:", err);
    res.status(500).json({ message: "An error occurred while updating user details" });
  }
});



app.get("/grabDetails", async (req, res) => {
  try {
    if (req.cookies.user_id) {
      const userid = req.cookies.user_id;
      const exist_user = await User.findOne({ _id: userid });

      if (exist_user) {
        res.json(exist_user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(400).json({ message: "No username cookie found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/grabRentals", async (req, res) => {
  try {
    if (req.cookies.user_id) {
      const userid = req.cookies.user_id;
      const exist_user = await User.findOne({ _id: userid });

      if (exist_user) {
        const productIds = exist_user.rentals;
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length > 0) {
          const obj = { rentedProducts: products };
          res.json(obj);
        } else {
          res.status(404).json({ message: "No rented products found" });
        }
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(400).json({ message: "No username cookie found" });
    }
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
});


app.post('/signOut', async (req, res) => {
  try {
    const userid = req.cookies.user_id;
    if (!userid) {
      return res.status(400).json({ message: 'No user is signed in.' });
    }

    // Clear the cookie to sign the user out
    res.clearCookie('user_id', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    });

    res.status(200).json({ message: 'Successfully signed out' });
  } catch (err) {
    console.error('Error during sign out:', err);
    res.status(500).json({ message: 'Error signing out' });
  }
});