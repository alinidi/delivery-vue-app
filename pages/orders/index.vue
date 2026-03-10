<template>
    <div>
        <h1 class="text-h4 mb-6">История заявок</h1>

        <v-row class="mb-6">
            <v-col cols="12" md="6">
                <v-text-field
                    v-model="search"
                    label="Поиск"
                    placeholder="Имя получателя или город"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    variant="outlined"
                    density="comfortable"
                    hide-details
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <v-select
                    v-model="filterType"
                    :items="filterItems"
                    label="Тип груза"
                    clearable
                    variant="outlined"
                    density="comfortable"
                    hide-details
                ></v-select>
            </v-col>
        </v-row>

        <div v-if="filteredOrders.length === 0" class="text-center py-8">
            <p class="text-grey-darken-1 mb-4">Заявок пока нет</p>
            <v-btn color="primary" to="/">Создать заявку</v-btn>
        </div>

        <v-card
            v-for="order in filteredOrders"
            :key="order.id"
            class="mb-4"
            variant="outlined"
        >
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="8">
                        <div class="d-flex align-center mb-2">
                            <v-chip
                                :color="getStatusColor(order.status)"
                                size="small"
                                class="mr-2"
                            >
                                {{ getStatusText(order.status) }}
                            </v-chip>
                            <span class="text-caption text-grey">
                                {{ formatDate(order.createdAt) }}
                            </span>
                        </div>

                        <v-row>
                            <v-col cols="12" sm="4">
                                <div class="text-caption text-grey-darken-1">
                                    Маршрут
                                </div>
                                <div class="font-weight-medium">
                                    {{ order.sender.city }} →
                                    {{ order.recipient.city }}
                                </div>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <div class="text-caption text-grey-darken-1">
                                    Отправитель
                                </div>
                                <div class="font-weight-medium">
                                    {{ order.sender.name }}
                                </div>
                                <div class="text-caption">
                                    {{ order.sender.phone }}
                                </div>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <div class="text-caption text-grey-darken-1">
                                    Груз
                                </div>
                                <div class="font-weight-medium">
                                    {{ getCargoTypeLabel(order.cargo.type) }},
                                    {{ order.cargo.weight }} кг
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col
                        cols="12"
                        md="4"
                        class="d-flex align-center justify-end"
                    >
                        <v-btn
                            :to="`/orders/${order.id}`"
                            color="primary"
                            variant="text"
                            size="small"
                            class="mr-2"
                        >
                            Подробнее
                        </v-btn>
                        <v-btn
                            @click="confirmDelete(order.id)"
                            color="error"
                            variant="text"
                            size="small"
                        >
                            Удалить
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

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
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOrdersStore } from '../../stores/orders';
import type { Order } from '../../types/index';
import { CARGO_TYPES } from '../../utils/constants';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const ordersStore = useOrdersStore();
const { orders } = storeToRefs(ordersStore);
const router = useRouter();

const search = ref('');
const filterType = ref<string | null>(null);
const showDialog = ref(false);
const deleteId = ref<string | null>(null);

onMounted(() => {
    ordersStore.loadOrders();
});

const filteredOrders = computed((): Order[] => {
    return orders.value
        .filter((order: Order) => {
            const matchesSearch =
                !search.value ||
                order.recipient.name
                    .toLowerCase()
                    .includes(search.value.toLowerCase()) ||
                order.recipient.city
                    .toLowerCase()
                    .includes(search.value.toLowerCase());

            const matchesType =
                !filterType.value || order.cargo.type === filterType.value;

            return matchesSearch && matchesType;
        })
        .sort(
            (a: Order, b: Order) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
});

const filterItems = computed(() => {
    return Object.entries(CARGO_TYPES).map(([value, label]) => ({
        value,
        title: label,
    }));
});

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
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

const confirmDelete = (id: string) => {
    deleteId.value = id;
    showDialog.value = true;
};

const deleteOrder = () => {
    if (deleteId.value) {
        ordersStore.deleteOrder(deleteId.value);
        showDialog.value = false;
        deleteId.value = null;
    }
};
</script>
