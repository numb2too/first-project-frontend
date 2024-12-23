<template>
    <v-app>
        <v-app-bar app density="compact" color="primary" dark>
            <v-toolbar-title>OA 表單管理系統</v-toolbar-title>
        </v-app-bar>

        <!-- 新增麵包屑導航 -->
        <v-app-bar flat color="transparent" style="backdrop-filter: blur(10px);">
            <v-breadcrumbs>
                <v-breadcrumbs-item href="#" @click="goToHome">首頁</v-breadcrumbs-item>
                <v-breadcrumbs-divider>/</v-breadcrumbs-divider>
                <template v-for="(item, index) in breadcrumbTrail" :key="index">
                    <v-breadcrumbs-item v-if="index < breadcrumbTrail.length - 1">
                        {{ item.name }}
                    </v-breadcrumbs-item>
                    <v-breadcrumbs-divider v-if="index < breadcrumbTrail.length - 1">/</v-breadcrumbs-divider>
                    <v-breadcrumbs-item v-else>
                        {{ item.name }}
                    </v-breadcrumbs-item>
                </template>
            </v-breadcrumbs>
        </v-app-bar>

        <v-navigation-drawer permanent>
            <v-list>
                <v-text-field
                    v-model="searchQuery"
                    label="快速查詢表單"
                    dense
                    outlined
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    @click:clear="searchQuery = ''"
                />

                <template v-for="item in filteredMenuItems" :key="item.id">
                    <v-list-group v-if="item.children">
                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props" :title="item.name" />
                        </template>

                        <template v-for="child in item.children" :key="child.id">
                            <v-list-group v-if="child.children">
                                <template v-slot:activator="{ props }">
                                    <v-list-item v-bind="props" :title="child.name" />
                                </template>

                                <v-list-item v-for="form in child.children" :key="form.id" :value="form.id"
                                    :title="form.name" @click="selectForm(form)" />
                            </v-list-group>
                        </template>
                    </v-list-group>
                </template>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container>
                <v-card>
                    <v-card-title>
                        {{ currentForm?.name || "請選擇一個表單" }}
                    </v-card-title>
                    <v-card-text>
                        <component :is="currentForm?.component" v-if="currentForm" />
                    </v-card-text>
                </v-card>
            </v-container>
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, markRaw } from "vue";
import axios from "axios";

interface MenuItem {
    id: string;
    name: string;
    parentId: string | null;
    component?: any;
    children?: MenuItem[];
}

const menuItems = ref<MenuItem[]>([]);
const searchQuery = ref<string>("");
const selectedForm = ref<string[]>([]);
const breadcrumbTrail = ref<MenuItem[]>([]);

// 建立巢狀結構
function buildMenuTree(items: MenuItem[]): MenuItem[] {
    const itemMap = new Map<string, MenuItem>();
    const rootItems: MenuItem[] = [];

    // 先建立所有項目的映射
    items.forEach(item => {
        itemMap.set(item.id, { ...item, children: [] });
    });

    // 建立階層關係
    items.forEach(item => {
        const menuItem = itemMap.get(item.id)!;
        if (item.parentId) {
            const parent = itemMap.get(item.parentId);
            if (parent) {
                if (!parent.children) parent.children = [];
                parent.children.push(menuItem);
            }
        } else {
            rootItems.push(menuItem);
        }
    });

    return rootItems;
}

// 取得表單資料
async function fetchForms() {
    try {
        const response = await axios.get('/form.json');
        const forms = await Promise.all(
            response.data.map(async (form: any) => ({
                ...form,
                component: form.sn ? await loadComponentBySN(form.sn) : undefined
            }))
        );
        menuItems.value = buildMenuTree(forms);
    } catch (error) {
        console.error('Failed to fetch forms:', error);
    }
}

// 動態載入組件，依據 SN 載入
async function loadComponentBySN(sn: string) {
    try {
        const module = await import(`@/components/${sn}.vue`);
        return markRaw(module.default);
    } catch (error) {
        console.error(`Failed to load component by SN: ${sn}`, error);
        return null;
    }
}

// 計算當前選中的表單
const currentForm = computed(() => {
    const findForm = (items: MenuItem[]): MenuItem | null => {
        for (const item of items) {
            if (item.id === selectedForm.value[0]) return item;
            if (item.children) {
                const found = findForm(item.children);
                if (found) return found;
            }
        }
        return null;
    };

    return findForm(menuItems.value);
});

// 更新麵包屑
function updateBreadcrumbTrail() {
    const findPath = (items: MenuItem[], targetId: string, path: MenuItem[] = []): MenuItem[] => {
        for (const item of items) {
            const newPath = [...path, item];
            if (item.id === targetId) return newPath;
            if (item.children) {
                const foundPath = findPath(item.children, targetId, newPath);
                if (foundPath.length) return foundPath;
            }
        }
        return [];
    };

    breadcrumbTrail.value = findPath(menuItems.value, selectedForm.value[0]);
}

// 選擇表單時更新麵包屑
function selectForm(form: MenuItem) {
    selectedForm.value = [form.id];
    updateBreadcrumbTrail();
}

// 返回首頁
function goToHome() {
    selectedForm.value = [];
    breadcrumbTrail.value = [];
}

// 篩選表單
const filteredMenuItems = computed(() => {
    if (!searchQuery.value.trim()) {
        return menuItems.value;
    }

    const filterItems = (items: MenuItem[]): MenuItem[] => {
        return items
            .map(item => ({
                ...item,
                children: item.children ? filterItems(item.children) : [],
            }))
            .filter(item => item.name.includes(searchQuery.value) || (item.children && item.children.length > 0));
    };

    return filterItems(menuItems.value);
});

onMounted(fetchForms);
</script>
