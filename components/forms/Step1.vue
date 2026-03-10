<template>
    <VForm @submit.prevent="handleSubmit">
        <div class="input-wrapper">
            <VTextField
                v-model="localData.sender.name"
                label="Имя отправителя *"
                :error-messages="errors.name"
                @blur="validateField('name')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
            />
        </div>

        <div class="input-wrapper">
            <VTextField
                v-model="localData.sender.phone"
                label="Телефон *"
                :error-messages="errors.phone"
                @blur="validateField('phone')"
                variant="outlined"
                density="comfortable"
                placeholder="+7XXXXXXXXXX"
                hide-details="auto"
            />
        </div>

        <div class="input-wrapper">
            <VTextField
                v-model="localData.sender.city"
                label="Город отправления *"
                :error-messages="errors.city"
                @blur="validateField('city')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
            />
        </div>

        <div class="button-wrapper">
            <VBtn
                color="primary"
                type="submit"
                :disabled="!isValid"
                size="large"
                block
            >
                Далее
            </VBtn>
        </div>
    </VForm>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
    data: {
        sender: {
            name: string;
            phone: string;
            city: string;
        };
    };
}>();

const emit = defineEmits<{
    (
        e: 'update',
        value: {
            sender: Partial<{ name: string; phone: string; city: string }>;
        }
    ): void;
    (e: 'next'): void;
}>();

const localData = ref({
    sender: { ...props.data.sender },
});

const errors = ref({
    name: '',
    phone: '',
    city: '',
});

const touched = ref({
    name: false,
    phone: false,
    city: false,
});

const validateName = (name: string) => {
    if (!name) return 'Имя обязательно';
    if (name.length < 2) return 'Имя должно содержать минимум 2 символа';
    if (!/^[A-Za-zА-Яа-яЁё\s-]+$/.test(name))
        return 'Имя может содержать только буквы';
    return '';
};

const validatePhone = (phone: string) => {
    if (!phone) return 'Телефон обязателен';
    if (!/^\+7[0-9]{10}$/.test(phone)) return 'Формат: +7XXXXXXXXXX';
    return '';
};

const validateCity = (city: string) => {
    if (!city) return 'Город обязателен';
    return '';
};

const validateField = (field: keyof typeof errors.value) => {
    touched.value[field] = true;

    switch (field) {
        case 'name':
            errors.value.name = validateName(localData.value.sender.name);
            break;
        case 'phone':
            errors.value.phone = validatePhone(localData.value.sender.phone);
            break;
        case 'city':
            errors.value.city = validateCity(localData.value.sender.city);
            break;
    }
};

const validateAll = () => {
    errors.value.name = validateName(localData.value.sender.name);
    errors.value.phone = validatePhone(localData.value.sender.phone);
    errors.value.city = validateCity(localData.value.sender.city);

    touched.value = {
        name: true,
        phone: true,
        city: true,
    };

    return !errors.value.name && !errors.value.phone && !errors.value.city;
};

const isValid = computed(() => {
    return (
        !validateName(localData.value.sender.name) &&
        !validatePhone(localData.value.sender.phone) &&
        !validateCity(localData.value.sender.city)
    );
});

watch(
    localData,
    () => {
        emit('update', { sender: localData.value.sender });
    },
    { deep: true }
);

const handleSubmit = () => {
    if (validateAll()) {
        emit('next');
    }
};
</script>

<style scoped>
.input-wrapper {
    margin-bottom: 24px !important;
    width: 100%;
}

.input-wrapper:last-of-type {
    margin-bottom: 32px !important;
}

.button-wrapper {
    margin-top: 16px !important;
    width: 100%;
}

:deep(.v-input) {
    margin: 0 !important;
    padding: 0 !important;
}
</style>
