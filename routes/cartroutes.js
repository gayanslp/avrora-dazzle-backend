import express from 'express';


import { getCart } from "../controllers/cartcontroller.js";
//import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get('/', getCart);

export default router;