<template>
    <v-form @submit.prevent="handleSubmit" class="step3-form">
        <div class="info-section">
            <h3 class="text-subtitle-1 font-weight-bold mb-4">
                Данные отправителя
            </h3>
            <div class="info-grid">
                <div class="info-item">
                    <div class="text-caption text-grey-darken-1 mb-1">Имя</div>
                    <div class="font-weight-medium text-body-1">
                        {{ data.sender.name || '—' }}
                    </div>
                </div>
                <div class="info-item">
                    <div class="text-caption text-grey-darken-1 mb-1">
                        Телефон
                    </div>
                    <div class="font-weight-medium text-body-1">
                        {{ data.sender.phone || '—' }}
                    </div>
                </div>
                <div class="info-item">
                    <div class="text-caption text-grey-darken-1 mb-1">
                        Город отправления
                    </div>
                    <div class="font-weight-medium text-body-1">
                        {{ data.sender.city || '—' }}
                    </div>
                </div>
            </div>
        </div>

        <div class="info-section">
            <h3 class="text-subtitle-1 font-weight-bold mb-4">
                Данные получателя и посылки
            </h3>
            <div class="info-grid">
                <div class="info-item">
                    <div class="text-caption text-grey-darken-1 mb-1">
                        Имя получателя
                    </div>
                    <div class="font-weight-medium text-body-1">
                        {{ data.recipient.name || '—' }}
                    </div>
                </div>
                <div class="info-item">
                    <div class="text-caption text-grey-darken-1 mb-1">
                        Город назначения
                    </div>
                    <div class="font-weight-medium text-body-1">
                        {{ data.recipient.city || '—' }}
                    </div>
                </div>
                <div class="info-item">
                    <div class="text-caption text-grey-darken-1 mb-1">
                        Тип груза
                    </div>
                    <div class="font-weight-medium text-body-1">
                        {{ getCargoTypeLabel(data.cargo.type) }}
                    </div>
                </div>
                <div class="info-item">
                    <div class="text-caption text-grey-darken-1 mb-1">Вес</div>
                    <div class="font-weight-medium text-body-1">
                        {{ data.cargo.weight || '—' }} кг
                    </div>
                </div>
            </div>
        </div>

        <div class="checkbox-wrapper">
            <v-checkbox
                v-model="agreed"
                :error-messages="error"
                label="Я согласен с условиями обработки данных *"
                hide-details="auto"
                class="mb-2"
            ></v-checkbox>
        </div>

        <v-row class="mt-6">
            <v-col cols="6">
                <v-btn
                    @click="emit('prev')"
                    variant="outlined"
                    block
                    size="large"
                >
                    Назад
                </v-btn>
            </v-col>
            <v-col cols="6">
                <v-btn color="primary" type="submit" block size="large">
                    Отправить заявку
                </v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { OrderFormData } from '../../types/index';
import { CARGO_TYPES } from '../../utils/constants';

const props = defineProps<{
    data: OrderFormData;
}>();

const emit = defineEmits<{
    (e: 'update', agreed: boolean): void;
    (e: 'prev'): void;
    (e: 'submit'): void;
}>();

const agreed = ref(props.data.agreedToTerms);
const error = ref('');

watch(agreed, (value) => {
    emit('update', value);
    error.value = '';
});

const getCargoTypeLabel = (type: string) => {
    return CARGO_TYPES[type as keyof typeof CARGO_TYPES] || '—';
};

const handleSubmit = () => {
    if (!agreed.value) {
        error.value = 'Необходимо согласиться с условиями';
        return;
    }
    emit('submit');
};
</script>

<style scoped>
.step3-form {
    width: 100%;
}

.info-section {
    margin-bottom: 32px;
    padding: 0;
}

.info-section:last-of-type {
    margin-bottom: 24px;
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
}

.info-item {
    width: 100%;
}

.checkbox-wrapper {
    margin: 8px 0 24px 0;
    padding: 0;
}

@media (min-width: 768px) {
    .info-section {
        margin-bottom: 40px;
    }

    .info-section:last-of-type {
        margin-bottom: 32px;
    }

    .info-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        padding: 24px;
    }

    .checkbox-wrapper {
        margin: 16px 0 32px 0;
    }
}

@media (min-width: 1200px) {
    .info-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

.text-body-1 {
    font-size: 1rem;
    line-height: 1.5;
}

.text-caption {
    font-size: 0.875rem;
    color: rgba(0, 0, 0, 0.6);
}
</style>
