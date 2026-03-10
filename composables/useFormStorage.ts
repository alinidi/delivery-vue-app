import { ref, readonly, onMounted, watch } from 'vue';
import type { OrderFormData } from '../types/index';
import { STORAGE_KEYS } from '../utils/constants';

const initialFormData: OrderFormData = {
    sender: {
        name: '',
        phone: '',
        city: '',
    },
    recipient: {
        name: '',
        city: '',
    },
    cargo: {
        type: 'regular',
        weight: 1,
    },
    agreedToTerms: false,
};

export const useFormStorage = () => {
    const formData = ref<OrderFormData>(initialFormData);
    const isLoaded = ref(false);

    onMounted(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
            if (stored) {
                try {
                    formData.value = JSON.parse(stored);
                } catch (e) {
                    console.error('Failed to parse stored form data', e);
                }
            }
            isLoaded.value = true;
        }
    });

    watch(
        formData,
        (newData) => {
            if (typeof window !== 'undefined' && isLoaded.value) {
                localStorage.setItem(
                    STORAGE_KEYS.FORM_DATA,
                    JSON.stringify(newData)
                );
            }
        },
        { deep: true }
    );

    const updateFormData = (data: Partial<OrderFormData>) => {
        formData.value = {
            ...formData.value,
            ...data,
            sender: { ...formData.value.sender, ...data.sender },
            recipient: { ...formData.value.recipient, ...data.recipient },
            cargo: { ...formData.value.cargo, ...data.cargo },
        };
    };

    const resetForm = () => {
        formData.value = initialFormData;
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
        }
    };

    return {
        formData: readonly(formData),
        updateFormData,
        resetForm,
        isLoaded,
    };
};
