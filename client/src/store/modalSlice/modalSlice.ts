import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../interfaces/IUser";
import axios, { AxiosError } from "axios";

interface IInitialState {
    isOpenProfile: boolean,
    isOpenGroupChat: boolean,
    isOpenSettings: boolean,
    isOpenUsers: boolean,
    isOpenVideoChat: boolean,
    isOpenRoomData: boolean;
    isOpenTitle: boolean;
    isOpenPrivateChat: boolean;
    isOpenSideInfo: boolean;
    fullImage: string | null;
    isOpenFullImage: boolean;
    profile: IUser | null;
    userIdForModal: string | null;
}

const isOpenSideInfo = localStorage.getItem('isOpenSideInfo');

const initialState: IInitialState = {
    isOpenProfile: false,
    isOpenGroupChat: false,
    isOpenSettings: false,
    isOpenUsers: false,
    isOpenVideoChat: false,
    isOpenRoomData: false,
    isOpenSideInfo: isOpenSideInfo ? JSON.parse(isOpenSideInfo) : false,
    isOpenTitle: false,
    isOpenPrivateChat: false,
    isOpenFullImage: false,
    profile: null,
    fullImage: null,
    userIdForModal: null,
}

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openProfileModal: (state, action: PayloadAction<string>) => {
            state.isOpenProfile = true;
            state.userIdForModal = action.payload;
        },
        openFullImage: (state, action: PayloadAction<string>) => {
            state.fullImage = action.payload;
            state.isOpenFullImage = true;
        },
        closeFullImage: (state) => {
            state.fullImage = null;
            state.isOpenFullImage = false;
        },
        closeProfileModal: (state) => {
            state.isOpenProfile = false;
            state.profile = null;
            state.userIdForModal = null;
        },
        openGroupChatModal: (state) => {
            state.isOpenGroupChat = true;
        },
        closeGroupChatModal: (state) => {
            state.isOpenGroupChat = false;
        },
        openSideInfo: (state) => {
            localStorage.setItem('isOpenSideInfo', JSON.stringify(true));
            state.isOpenSideInfo = true;
        },
        closeSideInfo: (state) => {
            localStorage.removeItem('isOpenSideInfo');
            state.isOpenSideInfo = false;
        },
        openPrivateChatModal: (state) => {
            state.isOpenPrivateChat = true;
        },
        closePrivateChatModal: (state) => {
            state.isOpenPrivateChat = false;
        },
        openSettingsModal: (state) => {
            state.isOpenSettings = true;
        },
        closeSettingsModal: (state) => {
            state.isOpenSettings = false;
        },
        openUsersModal: (state) => {
            state.isOpenUsers = true;
        },
        closeUsersModal: (state) => {
            state.isOpenUsers = false;
        },
        openVideoChatModal: (state) => {
            state.isOpenVideoChat = true;
        },
        closeVideoChatModal: (state) => {
            state.isOpenVideoChat = false;
        },
        openRoomDataModal: (state) => {
            state.isOpenRoomData = true;
        },
        closeRoomDataModal: (state) => {
            state.isOpenRoomData = false;
        },
        openTitleModal: (state) => {
            state.isOpenTitle = true;
        },
        closeTitleModal: (state) => {
            state.isOpenTitle = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getProfile.fulfilled, (state, action) => {
            if (action.payload)
                state.profile = action.payload;
        })
    }
});


export const getProfile = createAsyncThunk(
    'modal/getProfile',
    async (userId: string) => {
        try {
            const response = await axios.get<IUser>(`/api/user/${userId}`)
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.message);
            } else {
                console.log(error);
            }
        }
    }
)

export const {
    openProfileModal,
    closeProfileModal,
    openGroupChatModal,
    closeGroupChatModal,
    openSettingsModal,
    closeSettingsModal,
    openUsersModal,
    closeUsersModal,
    openVideoChatModal,
    closeVideoChatModal,
    openRoomDataModal,
    closeRoomDataModal,
    openTitleModal,
    closeTitleModal,
    openPrivateChatModal,
    closePrivateChatModal,
    openSideInfo,
    closeSideInfo,
    openFullImage,
    closeFullImage
} = modalSlice.actions;
