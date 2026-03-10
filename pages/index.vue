<template>
    <div class="form-page">
        <h1 class="text-h3 mb-8">Оформление заявки на доставку</h1>

        <v-card class="form-card" elevation="2" rounded="lg">
            <div class="form-card-content">
                <StepProgress
                    :current-step="currentStep"
                    :total-steps="3"
                    :step-names="['Отправитель', 'Получатель', 'Подтверждение']"
                />

                <div class="form-content">
                    <Step1
                        v-if="currentStep === 0"
                        :data="formData"
                        @update="handleStep1Update"
                        @next="nextStep"
                    />

                    <Step2
                        v-if="currentStep === 1"
                        :data="formData"
                        @update="handleStep2Update"
                        @next="nextStep"
                        @prev="prevStep"
                    />

                    <Step3
                        v-if="currentStep === 2"
                        :data="formData"
                        @update="handleStep3Update"
                        @prev="prevStep"
                        @submit="submitForm"
                    />
                </div>
            </div>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { useForm } from '../composables/useForm';
import { useFormStorage } from '../composables/useFormStorage';
import StepProgress from '../components/forms/StepProgress.vue';
import Step1 from '../components/forms/Step1.vue';
import Step2 from '../components/forms/Step2.vue';
import Step3 from '../components/forms/Step3.vue';
import type { CargoType } from '../types/index';

const { currentStep, nextStep, prevStep } = useForm(3);
const { formData, updateFormData } = useFormStorage();

const handleStep1Update = (data: {
    sender: Partial<{ name: string; phone: string; city: string }>;
}) => {
    updateFormData({
        sender: {
            name: data.sender.name ?? formData.value.sender.name,
            phone: data.sender.phone ?? formData.value.sender.phone,
            city: data.sender.city ?? formData.value.sender.city,
        },
    });
};

const handleStep2Update = (data: {
    recipient?: Partial<{ name: string; city: string }>;
    cargo?: Partial<{ type: CargoType; weight: number }>;
}) => {
    const updateData: any = {};

    if (data.recipient) {
        updateData.recipient = {
            name: data.recipient.name ?? formData.value.recipient.name,
            city: data.recipient.city ?? formData.value.recipient.city,
        };
    }

    if (data.cargo) {
        updateData.cargo = {
            type: data.cargo.type ?? formData.value.cargo.type,
            weight: data.cargo.weight ?? formData.value.cargo.weight,
        };
    }

    updateFormData(updateData);
};

const handleStep3Update = (agreed: boolean) => {
    updateFormData({ agreedToTerms: agreed });
};

const submitForm = () => {
    console.log('submit', formData.value);
};
</script>

<style scoped>
.form-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.form-card {
    background-color: white;
    width: 100%;
}

.form-card-content {
    padding: 32px;
}

.form-content {
    margin-top: 32px;
}

@media (min-width: 768px) {
    .form-page {
        padding: 40px 20px;
    }

    .form-card-content {
        padding: 40px;
    }

    .form-content {
        margin-top: 40px;
    }
}

:deep(.step-progress) {
    margin-bottom: 24px;
}

@media (min-width: 768px) {
    :deep(.step-progress) {
        margin-bottom: 32px;
    }
}
</style>
