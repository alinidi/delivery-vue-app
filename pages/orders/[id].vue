<template>
    <div v-if="order">
        <div class="d-flex justify-space-between align-center mb-6">
            <h1 class="text-h4">Детали заявки</h1>
            <div>
                <v-btn to="/orders" variant="text" class="mr-2"> Назад </v-btn>
                <v-btn @click="confirmDelete" color="error" variant="text">
                    Удалить
                </v-btn>
            </div>
        </div>

        <v-card class="mb-4" variant="outlined">
            <v-card-text>
                <div class="d-flex align-center mb-4">
                    <v-chip
                        :color="getStatusColor(order.status)"
                        size="small"
                        class="mr-2"
                    >
                        {{ getStatusText(order.status) }}
                    </v-chip>
                    <span class="text-caption text-grey">
                        Создана: {{ formatDate(order.createdAt) }}
                    </span>
                </div>
            </v-card-text>
        </v-card>

        <v-row>
            <v-col cols="12" md="6">
                <v-card variant="outlined">
                    <v-card-title>Отправитель</v-card-title>
                    <v-card-text>
                        <v-list density="compact">
                            <v-list-item>
                                <v-list-item-subtitle>Имя</v-list-item-subtitle>
                                <v-list-item-title>{{
                                    order.sender.name
                                }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-subtitle
                                    >Телефон</v-list-item-subtitle
                                >
                                <v-list-item-title>{{
                                    order.sender.phone
                                }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-subtitle
                                    >Город отправления</v-list-item-subtitle
                                >
                                <v-list-item-title>{{
                                    order.sender.city
                                }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card variant="outlined">
                    <v-card-title>Получатель</v-card-title>
                    <v-card-text>
                        <v-list density="compact">
                            <v-list-item>
                                <v-list-item-subtitle>Имя</v-list-item-subtitle>
                                <v-list-item-title>{{
                                    order.recipient.name
                                }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-subtitle
                                    >Город назначения</v-list-item-subtitle
                                >
                                <v-list-item-title>{{
                                    order.recipient.city
                                }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12">
                <v-card variant="outlined">
                    <v-card-title>Информация о грузе</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <div class="text-caption text-grey-darken-1">
                                    Тип груза
                                </div>
                                <div class="font-weight-medium">
                                    {{ getCargoTypeLabel(order.cargo.type) }}
                                </div>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <div class="text-caption text-grey-darken-1">
                                    Вес
                                </div>
                                <div class="font-weight-medium">
                                    {{ order.cargo.weight }} кг
                                </div>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <div class="text-caption text-grey-darken-1">
                                    Согласие с условиями
                                </div>
                                <div class="font-weight-medium">
                                    {{ order.agreedToTerms ? 'Да' : 'Нет' }}
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="showDialog" max-width="500">
            <v-card>
                <v-card-title class="text-h5"
                    >Подтверждение удаления</v-card-title
                >
                <v-card-text>
                    Вы уверены, что хотите удалить эту заявку? Это действие
                    нельзя отменить.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="grey-darken-1"
                        variant="text"
                        @click="showDialog = false"
                    >
                        Отмена
                    </v-btn>
                    <v-btn color="error" variant="text" @click="deleteOrder">
                        Удалить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
    <div v-else class="text-center py-8">
        <p class="text-grey-darken-1 mb-4">Заявка не найдена</p>
        <v-btn color="primary" to="/orders">Вернуться к списку</v-btn>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { CARGO_TYPES } from '../../utils/constants';
import { useOrdersStore } from '../../stores/orders';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const ordersStore = useOrdersStore();

const showDialog = ref(false);

const order = computed(() => {
    const id = route.params.id as string;
    return ordersStore.getOrderById(id);
});

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

const getStatusText = (status: string) => {
    const statuses: Record<string, string> = {
        pending: 'В обработке',
        delivered: 'Доставлено',
        cancelled: 'Отменено',
    };
    return statuses[status] || status;
};

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        pending: 'warning',
        delivered: 'success',
        cancelled: 'error',
    };
    return colors[status] || 'grey';
};

const getCargoTypeLabel = (type: string) => {
    return CARGO_TYPES[type as keyof typeof CARGO_TYPES] || type;
};

const confirmDelete = () => {
    showDialog.value = true;
};

const deleteOrder = () => {
    if (order.value) {
        ordersStore.deleteOrder(order.value.id);
        router.push('/orders');
    }
};
</script>
