<script setup lang="ts">
const localePath = useLocalePath();

const features = [
	{
		title: 'Usability',
		description: 'Intuitive and user-friendly interface',
	},
	{
		title: 'Customization',
		description: 'Tailor zeity to fit your unique workflow',
	},
	{
		title: 'Team Management',
		description: 'Easily manage your team and their roles',
	},
	{
		title: 'Projects',
		description: 'Manage your projects efficiently with zeity',
	},
	{
		title: 'Reporting',
		description: 'Gain insights into your projects and team performance',
	},
	{
		title: 'Open Source',
		description: 'zeity is fully open source',
	},
];

definePageMeta({
	title: 'home.title',
	ogTitle: 'home.title',
	description: 'home.description',
	ogDescription: 'home.description',
})
</script>

<template>
	<UPage>
		<UPageHero :title="$t('home.title')" :description="$t('home.description')" :links="[
			{ label: $t('home.openDocs'), to: localePath('/docs') },
		]" />

		<UPageSection :title="$t('home.features.title')" :description="$t('home.features.description')">
			<UPageGrid>
				<UPageCard v-for="(item, index) in features" :key="index" v-bind="item" spotlight />
			</UPageGrid>
		</UPageSection>
	</UPage>
</template>
