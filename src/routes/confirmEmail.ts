import { redis } from './../redis';
import { User } from './../entity/User';
import { Request, Response } from "express";

// rest for email confirmation
  export const confirmEmail =  async (req: Request, res: Response) => {
    const { id }  = req.params;
    console.log(`req params: ${id}`);
    const userId = await redis.get(id);
    console.log(userId);
  
    if (userId) {
      await User.update({ id: userId }, { confirmed: true });
      await redis.del(id);
      res.send("ok");
    } else {
      res.send("invalid");
    }
  };

