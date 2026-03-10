import { ref, readonly, computed } from 'vue';

export const useForm = (totalSteps: number) => {
    const currentStep = ref(0);

    const nextStep = () => {
        if (currentStep.value < totalSteps - 1) {
            currentStep.value++;
        }
    };

    const prevStep = () => {
        if (currentStep.value > 0) {
            currentStep.value--;
        }
    };

    const goToStep = (step: number) => {
        if (step >= 0 && step < totalSteps) {
            currentStep.value = step;
        }
    };

    return {
        currentStep: readonly(currentStep),
        nextStep,
        prevStep,
        goToStep,
        isFirstStep: computed(() => currentStep.value === 0),
        isLastStep: computed(() => currentStep.value === totalSteps - 1),
    };
};
