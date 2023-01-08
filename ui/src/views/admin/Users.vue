<template>
    <v-container>
        <v-row justify="center">
            <v-card width="800">
                <v-card-title>Panou Administrare Utilizatori</v-card-title>
                <v-card-text>
                    <v-row class="mt-4">
                        <v-virtual-scroll height="650" item-height="120" :items="users">
                            <template v-slot:default="{ item }">
                                <v-card elevation="2" class="ma-4">
                                    <v-card-text>
                                        <v-row class="ml-2 mb--2">
                                            <v-col cols="3">
                                                <v-text-field readonly label="Nume"
                                                    v-model="item.Username"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field readonly label="Email"
                                                    v-model="item.Email"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field readonly label="Data Creare"
                                                    v-model="item.DataCreare"></v-text-field>
                                            </v-col>
                                            <v-col cols="3" align="center" justify="center">
                                                <v-btn color="error" class="mt-2" @click="deleteUser(item)"><v-icon
                                                        class="mr-2">mdi-delete</v-icon>Sterge</v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </template>
                        </v-virtual-scroll>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="goBack">Inapoi</v-btn>
                </v-card-actions>
            </v-card>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

interface IUser {
    DataCreare: string;
    Email: string;
    IDCont: number;
    TipCont: string;
    Username: string;
}

export default Vue.extend({
    name: "UsersAdmin",
    data() {
        const users: IUser[] = [];

        return {
            name: "",
            users: users
        }
    },
    methods: {
        goBack() {
            this.$router.push("/");
        },
        async getUsers() {
            const response = await axios.get("http://localhost:3000/users");

            if (response.data.error === 0) {
                this.users = response.data.data;

                this.users.forEach((user: IUser) => {
                    user.DataCreare = new Date(user.DataCreare).toLocaleDateString();
                });
            }
        },
        async deleteUser(user: IUser) {
            const response = await axios.delete("http://localhost:3000/user/" + user.IDCont);
            console.log(response.data);

            if (response.data.error === 0) {
                this.getUsers();
            }
        }
    },
    mounted() {
        this.getUsers();
    }
});
</script>