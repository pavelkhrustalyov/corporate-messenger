import { IRoom } from "../../interfaces/IRoom";

export const rooms: IRoom[] = [
    { 
        _id: "1",
        createdAt: new Date('2024-04-07T10:00:00Z'),
        type: "individual",
        participants: [
            { 
                _id: "1",
                name: "Pavel",
                avatar: "https://pixelbox.ru/wp-content/uploads/2021/05/ava-vk-animal-91.jpg",
                surname: "Khrustalyov",
                login: "pavel_khrustalyov",
                status: "Offline",
            },
            {
                _id: "2",
                avatar: "https://pixelbox.ru/wp-content/uploads/2021/05/ava-vk-animal-91.jpg",
                name: "Viktorya",
                surname: "Ivanova",
                login: "viktorya_ivanova",
                status: "Offline"
            }
        ],
        lastMessage: "Lorem ipsum do?"
    },
    { 
        creator: {
            _id: "1",
            name: "Pavel", 
            avatar: "https://pixelbox.ru/wp-content/uploads/2021/05/ava-vk-animal-91.jpg",
            surname: "Khrustalyov", 
            login: "pavel_khrustalyov",
            status: "Online",
            notifications: [],
            isVerified: true,
        },
        _id: "2",
        createdAt: new Date('2024-04-07T10:00:00Z'),
        type: "group",
        imageGroup: "https://sun9-45.userapi.com/impg/9KwIu_rEt8WA5G03ZLRMvDJbcnzG4jE3j4MtmQ/Wyu-IcdrO3Q.jpg?size=1024x1024&quality=96&sign=8b0ea6afd425b89dcf28ab8540418d14&c_uniq_tag=ujYoMJ9rbCCrW0HpJPyMH9VXx8fqrr0jkXxsRidRywU&type=album",
        title: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque dignissimos tempore quia cupiditate? Sunt, saepe molestias harum a deserunt officiis eum reiciendis in perspiciatis, exercitationem dolorum, dicta quaerat vel vero.",
        participants: [
            { 
                _id: "1",
                avatar: "https://pixelbox.ru/wp-content/uploads/2021/05/ava-vk-animal-91.jpg",
                name: "Pavel",
                surname: "Khrustalyov",
                login: "pavel_khrustalyov",
                status: "Online",
            },
            {
                _id: "2",
                avatar: "https://sun9-39.userapi.com/impg/CmOVhKbBIPPp9XTvCLL5N36j007IRV4ZInTttg/bMRUqQlyduY.jpg?size=1920x1440&quality=95&sign=b1db6822cb4c9edef74e10a9ec048752&type=album",
                name: "Viktorya",
                surname: "Ivanova",
                login: "viktorya_ivanova",
                status: "Online"
            },
            {
                _id: "3",
                avatar: "https://pixelbox.ru/wp-content/uploads/2021/05/ava-vk-animal-91.jpg",
                name: "Valeryi",
                surname: "Nikiforov",
                login: "valeryi_nikiforov",
                status: "Offline",
            }
        ],
        lastMessage: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur, nisi?"
    },

    { 
        creator: {
            _id: "1",
            name: "Pavel", 
            avatar: "https://pixelbox.ru/wp-content/uploads/2021/05/ava-vk-animal-91.jpg",
            surname: "Khrustalyov", 
            login: "pavel_khrustalyov",
            status: "Online",
            notifications: [],
            isVerified: true,
        },
        _id: "3",
        createdAt: new Date('2024-04-07T10:00:00Z'),
        type: "individual",
        participants: [
            { 
                _id: "1",
                avatar: "https://pixelbox.ru/wp-content/uploads/2021/05/ava-vk-animal-91.jpg",
                name: "Pavel",
                surname: "Khrustalyov",
                login: "pavel_khrustalyov",
                status: "Online",
            },
            {
                _id: "3",
                avatar: "https://pixelbox.ru/wp-content/uploads/2021/05/ava-vk-animal-91.jpg",
                name: "Valeryi",
                surname: "Nikiforov",
                login: "valeryi_nikiforov",
                status: "Offline",
            }
        ],
        lastMessage: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur, nisi?"
    },
];
