import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
    isOpenProfile: boolean,
    isOpenGroupChat: boolean,
    isOpenSettings: boolean,
    isOpenUsers: boolean,
    isOpenVideoChat: boolean,
    isOpenRoomData: boolean;
    isOpenTitle: boolean;
    isOpenPrivateChat: boolean;
    userIdFromModal: string | null;
}

const initialState: IInitialState = {
    isOpenProfile: false,
    isOpenGroupChat: false,
    isOpenSettings: false,
    isOpenUsers: false,
    isOpenVideoChat: false,
    isOpenRoomData: false,
    isOpenTitle: false,
    userIdFromModal: null,
    isOpenPrivateChat: false,
}

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openProfileModal: (state, action) => {
            state.isOpenProfile = true;
            state.userIdFromModal = action.payload;
        },
        closeProfileModal: (state) => {
            state.isOpenProfile = false;
            state.userIdFromModal = null;
        },
        openGroupChatModal: (state) => {
            state.isOpenGroupChat = true;
        },
        closeGroupChatModal: (state) => {
            state.isOpenGroupChat = false;
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
    }
});

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
    closePrivateChatModal
} = modalSlice.actions;
