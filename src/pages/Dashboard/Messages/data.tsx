export const userData = [
    {
        id: 1,
        avatar: '/User1.png',
        messages: [
            {
                id: 1,
                avatar: '/User1.png',
                name: 'Jane Doe',
                message: 'Hello!',
            },
            {
                id: 2,
                avatar: '/LoggedInUser.jpg',
                name: 'You',
                message: 'Hey!',
            },
            {
                id: 3,
                avatar: '/User1.png',
                name: 'Jane Doe',
                message: 'Is your dog Charlie ready for the walk?',
            },
            {
                id: 4,
                avatar: '/LoggedInUser.jpg',
                name: 'You',
                message: 'Yup! I will see you in a moment.',
            },
            {
                id: 5,
                avatar: '/User1.png',
                name: 'Jane Doe',
                message: 'Ok, see you soon!',
            },
            {
                id: 6,
                avatar: '/User1.png',
                name: 'Jane Doe',
                message: 'The walk is complete! Charlie was wonderful! test test test test test test test test test test test test',
            },
            {
                id: 7,
                avatar: '/LoggedInUser.jpg',
                name: 'You',
                message: 'That is good to hear!'
            },
            {
                id: 8,
                avatar: '/User1.png',
                name: 'Jane Doe',
                message: 'I will see you tomorrow!',
            },
            {
                id: 9,
                avatar: '/LoggedInUser.jpg',
                name: 'You',
                message: 'Ok, thank you!',
            }
        ],
        name: 'Jane Doe',
    },
    {
        id: 2,
        avatar: '/User2.png',
        name: 'John Doe',
        messages: [
            {
                id: 1,
                avatar: '/User2.png',
                name: 'John Doe',
                message: 'Person 2',
            }
        ]
    },
    {
        id: 3,
        avatar: '/User3.png',
        name: 'Elizabeth Smith',
        messages: [
            {
                id: 1,
                avatar: '/User3.png',
                name: 'Elizabeth Smith',
                message: 'Person 3',
            }
        ]
    },
    {
        id: 4,
        avatar: '/User4.png',
        name: 'John Smith',
        messages: [
            {
                id: 1,
                avatar: '/User4.png',
                name: 'John Smith',
                message: 'Person 4',
            }
        ]
    }
];

export type UserData = (typeof userData)[number];

export const loggedInUserData = {
    id: 5,
    avatar: '/LoggedInUser.jpg',
    name: 'You',
};

export type LoggedInUserData = (typeof loggedInUserData);

export interface Message {
    id: number;
    avatar: string;
    name: string;
    message: string;
}

export interface User {
    id: number;
    avatar: string;
    messages: Message[];
    name: string;
}