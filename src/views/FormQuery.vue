
<template>
    <v-container>
      <v-card>
        <v-card-title>Query OA Form: {{ formName }}</v-card-title>
        <v-card-text>
          <p>This is where the query form for {{ formName }} will go.</p>
          <!-- Add your form query implementation here -->
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script lang="ts" setup>
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const formName = route.params.formName;
  </script>
  
  