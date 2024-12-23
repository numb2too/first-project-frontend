<template>
    <div>
        <v-btn color="primary" @click="goToAddForm">新增</v-btn>
        <v-text-field label="姓名" />
        <v-text-field label="年齡" type="number" />
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToAddForm() {
    router.push({ name: 'FormOneAdd' }); // 假設新增頁面名稱為 FormOneAdd
}
</script>
