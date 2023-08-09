export const Mutation = {
    async createUser(parent, { data }, { db }, info) {
        const emailTaken = await db.user.findFirst({
            where: {
                email: data.email
            }
        });

        if (emailTaken) {
            throw new Error('Email taken.');
        }

        return db.user.create({
            data
        });
    }
}
