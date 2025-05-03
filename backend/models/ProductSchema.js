import mongoose from "mongoose";
const ProductSchema= new mongoose.Schema({
    userid:{type:String,require:true},
    productType:{type:String,required:true,},
    productName: {type:String,required:true,},
    locationName:{type:String,required:true,},
    fromDateTime:  {
        type: Date,
        required:true,
      },
    toDateTime: {
        type: Date,
        required:true,
      },
    price: {type:Number,required:true,},
    photo:{type:[String],required:true},
    uploadDate:{type:Date,required:true},
    bookingdates:{type:[[Date,Date]]},
    bookingIds:{type:[String]},
    expired:{type:Boolean,require:true,}
});


ProductSchema.index({ uploadDate: -1 });
ProductSchema.index({ productType: 1 });
ProductSchema.index({ locationName: 1 });
ProductSchema.index({ productName: "text" });
// Also consider indexing these frequently queried fields
ProductSchema.index({ expired: 1 });
ProductSchema.index({ userid: 1 });

const Product = mongoose.model("Products",ProductSchema);
export {Product}
