const users = [{
    id: '1',
    name: 'Mike',
    email: 'test',
    age: 28
}, {
    id: '2',
    name: 'Sarah',
    email: 'test',
    age: 28
}, {
    id: '3',
    name: 'Andrew',
    email: 'test',
    age: 28
}];

const posts = [{
    id: '1',
    title: 'title1',
    body: 'body1',
    published: true,
    author: '1'
}, {
    id: '2',
    title: 'title2',
    body: 'body2',
    published: false,
    author: '1'
}, {
    id: '3',
    title: 'title3',
    body: 'body3',
    published: true,
    author: '3'
}];

const comments = [{
    id: '1',
    text: 'comment1',
    post: '1',
    author: '1'
}, {
    id: '2',
    text: 'comment2',
    post: '1',
    author: '2'
}, {
    id: '3',
    text: 'comment3',
    post: '2',
    author: '1'
},
{
    id: '3',
    text: 'comment3',
    post: '3',
    author: '1'
}
];

const db = {
    users,
    posts,
    comments
};

export { db as default };
