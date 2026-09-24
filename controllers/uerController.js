import User from "../models/user.js";


export async function getProfile(req, res) {
    try {
       const userid = req.user.userId; 
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

       res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        user: user
    });


       
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error
        });
    }

}




export async function updateProfile(req, res) {
  try {
    const userid = req.user?.userId;
    if (!userid) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const { email, address } = req.body;
    const updateData = {};


    if (email) {
      updateData.email = email.toLowerCase().trim();
    }


    if (address) {
      if (address.fullName !== undefined) updateData['address.fullName'] = address.fullName;
      if (address.phone !== undefined) updateData['address.phone'] = address.phone;
      if (address.street !== undefined) updateData['address.street'] = address.street;
      if (address.city !== undefined) updateData['address.city'] = address.city;
      if (address.postalCode !== undefined) updateData['address.postalCode'] = address.postalCode;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userid,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email address is already in use',
      });
    }

    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

export function isAdmin(req) {
    try {
        if (req.user.role === 'admin') {
            return true;
        } else {
            return false;

        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
