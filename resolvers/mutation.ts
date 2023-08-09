import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from "@prisma/client";

export const Mutation = {
    async createUser(parent, { data }, { db }, info): Promise<User> {
        const emailTaken = await db.user.findFirst({
            where: {
                email: data.email
            }
        });

        if (emailTaken) {
            throw new Error('Email taken.');
        }
        
        const password = await bcrypt.hash(data.password, 10);

        return db.user.create({
            data: {
                ...data,
                password
            }
        });
    },
    async login(parent, { email, password }, { db }, info): Promise<{ user: User, token: string }> {
        const user = await db.user.findFirst({
            where: {
                email
            }
        });
        
        if (!user) {
            throw new Error('Invalid credentials.');
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            throw new Error('Invalid credentials.');
        }
        
        return {
            user,
            token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
        };
    }
}
