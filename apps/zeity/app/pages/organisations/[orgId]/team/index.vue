<script setup lang="ts">
const route = useRoute()
await navigateTo(`/organisations/${route.params.orgId}`);
</script>