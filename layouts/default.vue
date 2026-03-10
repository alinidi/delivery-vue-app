<template>
    <div>
        <v-app-bar color="primary" dark>
            <v-app-bar-title>Delivery App</v-app-bar-title>
            <v-spacer></v-spacer>
            <v-btn to="/" variant="text">Новая заявка</v-btn>
            <v-btn to="/orders" variant="text">История</v-btn>
        </v-app-bar>

        <v-main>
            <v-container class="py-8">
                <slot />
            </v-container>
        </v-main>
    </div>
</template>
