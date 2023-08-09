import * as jwt from 'jsonwebtoken';

export default function getUserId({ req }): string {
    const Authorization = req.request.headers.get('Authorization');
    
    if (Authorization) {
        const token = Authorization.split(' ')[1];
        const { userId } = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
        
        return userId;
    }
    
    throw new Error('Not authenticated.');
}
