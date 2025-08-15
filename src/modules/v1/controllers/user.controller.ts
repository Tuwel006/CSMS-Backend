import { Request, Response } from "express";
import { getAllUsers } from "../services/user.service";

export const getUsers = async (req: Request, res: Response)=> {
    const val = req.query;
    console.log("user controller", val.name);
    const service = await getAllUsers();
    res.send(service);
}
