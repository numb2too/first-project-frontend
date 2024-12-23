<template>
    <v-container class="fill-height" justify="center" align="center">
      <v-card max-width="400">
        <v-card-title class="text-h5">Login</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="login">
            <v-text-field
              v-model="username"
              label="Username"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              required
            ></v-text-field>
            <v-btn type="submit" color="primary" block>Login</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const username = ref('');
  const password = ref('');
  const router = useRouter();
  
  function login() {
    if (username.value && password.value) {
      // Simulate login
      router.push('/home');
    } else {
      alert('Please enter username and password');
    }
  }
  </script>
  
  <style scoped>
  .fill-height {
    height: 100vh;
  }
  </style>