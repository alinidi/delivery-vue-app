import { defineStore } from 'pinia';
import type { Order, OrderFormData } from '../types/index';
import { STORAGE_KEYS } from '../utils/constants';

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        orders: [] as Order[],
    }),

    getters: {
        getOrderById: (state) => (id: string) => {
            return state.orders.find((order) => order.id === id);
        },
    },

    actions: {
        loadOrders() {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
                if (stored) {
                    try {
                        this.orders = JSON.parse(stored);
                    } catch (e) {
                        console.error('Failed to parse orders', e);
                    }
                }
            }
        },

        saveOrders() {
            if (typeof window !== 'undefined') {
                localStorage.setItem(
                    STORAGE_KEYS.ORDERS,
                    JSON.stringify(this.orders)
                );
            }
        },

        addOrder(orderData: OrderFormData) {
            const newOrder: Order = {
                ...orderData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                status: 'pending',
            };
            this.orders.push(newOrder);
            this.saveOrders();
        },

        deleteOrder(id: string) {
            this.orders = this.orders.filter((order) => order.id !== id);
            this.saveOrders();
        },
    },
});
