<template>
    <div class="step-progress">
        <div class="d-flex justify-space-between mb-4">
            <div
                v-for="(name, index) in stepNames"
                :key="index"
                :class="[
                    'text-body-1 font-weight-medium',
                    index <= currentStep ? 'text-primary' : 'text-disabled',
                ]"
            >
                {{ name }}
            </div>
        </div>

        <v-progress-linear
            :model-value="((currentStep + 1) / totalSteps) * 100"
            height="8"
            color="primary"
            rounded
        ></v-progress-linear>

        <div class="text-center mt-2 d-sm-none">
            <span class="text-primary font-weight-medium">
                Шаг {{ currentStep + 1 }} из {{ totalSteps }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    currentStep: number;
    totalSteps: number;
    stepNames: string[];
}>();
</script>

<style scoped>
.step-progress {
    width: 100%;
}
</style>
