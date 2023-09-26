import UserModel from "../Models/userModel.js";
import userModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';
export const getUser =async(req,res)=>{
    const id =req.params.id;


   try {
    const user=await userModel.findById(id);
   
    if(user){
        const {password,...otherDetails} =user._doc;
        res.status(200).json(otherDetails);
    }
    else{
        res.status(404).json("no such user exist");
    }
   } 
   catch (error) {
    res.status(500).json(error);
    
   }
}

 export const updateUser = async(req,res)=>{
    const id =req.params.id;
    const{currentUserId,currentUserAdminStatus,password}=req.body;
        if(id===currentUserId || currentUserAdminStatus){
            try {
                if(password){
                    const salt=await bcrypt.genSalt(10);
                    req.body.password= await bcrypt.hash(password,salt);
                }
           const user= await userModel.findByIdAndUpdate(id,req.body,{new:true})
           res.status(200).json(user);
            } catch (error) {
                res.status(500).json(error);
                
            }
        }
        else{
            res.status(403).json("Access Denies! you can only update your own profile Unless you are Admin ")
        }
    


}
export const deleteUser= async(req,res)=>{
    const id=req.params.id;
    const{currentUserId,currentUserAdminStatus,password}=req.body;
    if(id===currentUserId || currentUserAdminStatus){
        try {
            await userModel.findByIdAndDelete(id);
            res.status(200).json("User delete successfully")
        } catch (error) {
            res.status(500).json(error);
            
        }
    }
    else{
        res.status(403).json("Access Denied!!!")
    }

}
export const followUser = async(req,res)=>{
    const id = req.params.id;
    const {currentUserId}=req.body;
    if(currentUserId ===id){
        res.status(403).json("Action Forbidden") ;
    }
    else{
        try {
            const followUser=await UserModel.findById(id);
            const followingUser =await UserModel.findById(currentUserId);
            if(!followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$push :{followers:currentUserId}})
                await followingUser.updateOne({$push :{following:id}})
                res.status(200).json("user followed");
            }
            else{
                res.status(403).json("User is already followed by you");
            }

            
        } catch (error) {
            res.status(500).json(error);
            
        }
    }
}

export const UnFollowUser = async(req,res)=>{
    const id = req.params.id;
    const {currentUserId}=req.body;
    if(currentUserId ===id){
        res.status(403).json("Action Forbidden") ;
    }
    else{
        try {
            const followUser=await UserModel.findById(id);
            const followingUser =await UserModel.findById(currentUserId);
            if(followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$pull :{followers:currentUserId}})
                await followingUser.updateOne({$pull :{following:id}})
                res.status(200).json("user unfollowed");
            }
            else{
                res.status(403).json("User is not followed by you");
            }

            
        } catch (error) {
            res.status(500).json(error);
            
        }
    }
}