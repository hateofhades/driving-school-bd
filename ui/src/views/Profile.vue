<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <v-card>
                    <v-card-title>
                        <h3>Change Password</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="form" v-model="valid" class="pb-2">
                            <v-text-field v-model="oldPassword" label="Old Password" type="password"
                                aria-required="true"></v-text-field>
                            <v-text-field v-model="newPassword" label="New Password" type="password"
                                aria-required="true"></v-text-field>
                            <v-text-field v-model="confirmPassword" label="Confirm New Password" type="password"
                                aria-required="true"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="changePassword" :disabled="!valid">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="6">
                <v-card>
                    <v-card-title>
                        <h3>Profile</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item>
                                <v-list-item-title>Username: {{ username }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-title>Email: {{ email }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="showWarning = true">Delete Account</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="showWarning" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Warning</v-card-title>
                <v-card-text>You are about to delete your account. This action cannot be undone.</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="showWarning = false">Cancel</v-btn>
                    <v-btn color="error" text @click="deleteAccount">Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="showError" :timeout="3000">
            {{ errorMessage }}
        </v-snackbar>
    </v-container>
</template>

<script lang="ts">
import axios from "axios";

export default {
    name: "ProfilePage",
    data() {
        return {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            valid: false,
            showError: false,
            errorMessage: "",
            showWarning: false,
            username: "",
            name: "",
            email: "",
        };
    },
    methods: {
        async changePassword() {
            if (this.oldPassword === "" || this.newPassword === "" || this.confirmPassword === "") {
                this.showError = true;
                this.errorMessage = "Please fill in all fields";
                return;
            }

            try {
                const response = await axios.post("http://localhost:3000/changePassword", {
                    username: this.$store.getters.getUser.Username,
                    oldPassword: this.oldPassword,
                    newPassword: this.newPassword,
                });
                console.log(response);
                if (response.data.error === 0) {
                    this.$store.dispatch("clearUser");
                    window.location.reload();
                } else {
                    this.showError = true;
                    this.errorMessage = "Invalid password";
                }
            } catch (error) {
                console.error(error);
            }
        },
        async deleteAccount() {
            try {
                const response = await axios.post("http://localhost:3000/deleteAccount", {
                    username: this.$store.getters.getUser.Username,
                    password: this.$store.getters.getUser.Parola
                });
                if (response.data.error === 0) {
                    this.$store.dispatch("clearUser");
                    window.location.reload();
                } else {
                    this.showError = true;
                    this.errorMessage = "Invalid password";
                }
            } catch (error) {
                console.error(error);
            }
        }
    },
    created() {
        this.username = this.$store.getters.getUser.Username;
        this.email = this.$store.getters.getUser.Email;
    }
};
</script>
                
