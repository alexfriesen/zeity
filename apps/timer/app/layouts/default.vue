<template>
    <div class="layout">
        <Header class="header" />

        <main class="main">
            <slot />
        </main>

        <Navigation class="nav" />
    </div>
</template>

<style scoped>
.layout {
    height: 100%;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr auto;
    grid-template-areas:
        'header'
        'notifications'
        'main'
        'nav';
}

.header {
    grid-area: header;
}

.main {
    grid-area: main;
    overflow: auto;
}

.notifications {
    display: flex;
    flex-direction: column;

    grid-area: notifications;

    margin: auto;
    width: 100%;
}

.nav {
    grid-area: nav;
}

@media screen and (min-width: 768px) {
    .layout {
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto 1fr;
        grid-template-areas:
            'header header'
            'nav notifications'
            'nav main';
    }
}
</style>
