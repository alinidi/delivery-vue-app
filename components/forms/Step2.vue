<template>
    <v-form ref="form" @submit.prevent="handleSubmit">
        <v-text-field
            v-model="localData.recipient.name"
            label="Имя получателя *"
            :error-messages="errors.recipientName"
            @blur="validateField('recipientName')"
            variant="outlined"
            class="mb-4"
        />

        <v-text-field
            v-model="localData.recipient.city"
            label="Город назначения *"
            :error-messages="errors.recipientCity"
            @blur="validateField('recipientCity')"
            variant="outlined"
            class="mb-4"
        />

        <v-select
            v-model="localData.cargo.type"
            :items="cargoTypes"
            label="Тип груза *"
            :error-messages="errors.cargoType"
            @blur="validateField('cargoType')"
            variant="outlined"
            class="mb-4"
        ></v-select>

        <v-text-field
            v-model.number="localData.cargo.weight"
            label="Вес (кг) *"
            type="number"
            :error-messages="errors.weight"
            @blur="validateField('weight')"
            variant="outlined"
            step="0.1"
            min="0.1"
            max="30"
            class="mb-4"
        ></v-text-field>

        <v-row>
            <v-col cols="6">
                <v-btn @click="emit('prev')" variant="outlined" block>
                    Назад
                </v-btn>
            </v-col>
            <v-col cols="6">
                <v-btn color="primary" type="submit" :disabled="!isValid" block>
                    Далее
                </v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { CargoType } from '../../types/index';
import {
    CARGO_TYPES_ARRAY,
    MIN_WEIGHT,
    MAX_WEIGHT,
} from '../../utils/constants';

const props = defineProps<{
    data: {
        recipient: {
            name: string;
            city: string;
        };
        cargo: {
            type: CargoType;
            weight: number;
        };
        sender: {
            city: string;
        };
    };
}>();

const emit = defineEmits<{
    (
        e: 'update',
        value: {
            recipient?: Partial<{ name: string; city: string }>;
            cargo?: Partial<{ type: CargoType; weight: number }>;
        }
    ): void;
    (e: 'next'): void;
    (e: 'prev'): void;
}>();

const localData = ref({
    recipient: { ...props.data.recipient },
    cargo: { ...props.data.cargo },
});

const errors = ref({
    recipientName: '',
    recipientCity: '',
    cargoType: '',
    weight: '',
});

const touched = ref({
    recipientName: false,
    recipientCity: false,
    cargoType: false,
    weight: false,
});

const cargoTypes = CARGO_TYPES_ARRAY.map((item) => ({
    value: item.value,
    title: item.label,
}));

const validateRecipientName = (name: string) => {
    if (!name) return 'Имя получателя обязательно';
    if (!/^[A-Za-zА-Яа-яЁё\s-]+$/.test(name))
        return 'Имя может содержать только буквы';
    return '';
};

const validateRecipientCity = (city: string) => {
    if (!city) return 'Город назначения обязателен';
    if (city === props.data.sender.city)
        return 'Город назначения не может совпадать с городом отправления';
    return '';
};

const validateCargoType = (type: CargoType) => {
    if (!type) return 'Тип груза обязателен';
    return '';
};

const validateWeight = (weight: number) => {
    if (!weight) return 'Вес обязателен';
    if (weight < MIN_WEIGHT || weight > MAX_WEIGHT) {
        return `Вес должен быть от ${MIN_WEIGHT} до ${MAX_WEIGHT} кг`;
    }
    return '';
};

const validateField = (field: keyof typeof errors.value) => {
    touched.value[field] = true;

    switch (field) {
        case 'recipientName':
            errors.value.recipientName = validateRecipientName(
                localData.value.recipient.name
            );
            break;
        case 'recipientCity':
            errors.value.recipientCity = validateRecipientCity(
                localData.value.recipient.city
            );
            break;
        case 'cargoType':
            errors.value.cargoType = validateCargoType(
                localData.value.cargo.type
            );
            break;
        case 'weight':
            errors.value.weight = validateWeight(localData.value.cargo.weight);
            break;
    }
};

const validateAll = () => {
    errors.value.recipientName = validateRecipientName(
        localData.value.recipient.name
    );
    errors.value.recipientCity = validateRecipientCity(
        localData.value.recipient.city
    );
    errors.value.cargoType = validateCargoType(localData.value.cargo.type);
    errors.value.weight = validateWeight(localData.value.cargo.weight);

    touched.value = {
        recipientName: true,
        recipientCity: true,
        cargoType: true,
        weight: true,
    };

    return !Object.values(errors.value).some((error) => error);
};

const isValid = computed(() => {
    return (
        !validateRecipientName(localData.value.recipient.name) &&
        !validateRecipientCity(localData.value.recipient.city) &&
        !validateCargoType(localData.value.cargo.type) &&
        !validateWeight(localData.value.cargo.weight)
    );
});

watch(
    localData,
    () => {
        emit('update', {
            recipient: localData.value.recipient,
            cargo: localData.value.cargo,
        });
    },
    { deep: true }
);

const handleSubmit = () => {
    if (validateAll()) {
        emit('next');
    }
};
</script>
