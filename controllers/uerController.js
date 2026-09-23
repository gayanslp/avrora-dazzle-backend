export function getProfile(req, res) {
    try {
        res.status(200).json({
            success: true,
            message: 'Profile fetched successfully',
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }

}


export function updateProfile(req, res) {

    try{
        const userid = req.user.userId;
        if(!userid){
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const { name, email, phone,  } = req.body;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
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
