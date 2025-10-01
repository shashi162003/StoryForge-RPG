import { create } from 'zustand';

const useStore = create((set) => ({
    user: null,
    room: null,
    socket: null,

    setUser: (user) => set({ user }),
    setRoom: (room) => set({ room }),
    setSocket: (socket) => set({ socket }),
}));

export default useStore;