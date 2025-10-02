import { create } from 'zustand';

const useStore = create((set) => ({
    user: null,
    room: null,
    socket: null,
    isSendingAction: false,

    setUser: (user) => set({ user }),
    setRoom: (room) => set({ room }),
    setSocket: (socket) => set({ socket }),
    setIsSendingAction: (status) => set({ isSendingAction: status }),
}));

export default useStore;