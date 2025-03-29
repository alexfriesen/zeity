<script setup lang="ts">
import type { PropType } from 'vue';
import { Section, Button, Text, Heading } from '@vue-email/components';

import type { MailSection } from '~~/types/mail';
import MailLayout from './MailLayout.vue';

defineProps({
    subject: {
        type: String,
        required: true
    },
    sections: {
        type: Array as PropType<MailSection[]>,
        required: false,
        default: null
    },
    messages: {
        type: Array as PropType<string[]>,
        required: true
    },
    link: {
        type: Object as PropType<{ url: string, text: string }>,
        required: false,
        default: null
    },
})
</script>

<template>
    <MailLayout :preview="subject">

        <Heading as="h1" class="text-xl">{{ subject }}</Heading>

        <Text v-for="message in messages" :key="message">
            {{ message }}
        </Text>

        <Section v-for="(section, sectionIndex) in sections" :key="sectionIndex" :class="section.class">
            <Text v-for="(text, textIndex) in section.children" :key="textIndex" :class="text.class">
                {{ text.text }}
            </Text>
        </Section>

        <Section v-if="link" class="text-center">
            <Button v-if="link" :href="link.url" referrerpolicy="strict-origin"
                class="rounded-md font-medium inline-flex items-center focus:outline-hidden transition-colors px-2.5 py-1.5 m-auto text-sm gap-1.5 justify-center text-text bg-primary-400 hover:bg-primary/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                {{ link.text }}
            </Button>
        </Section>

    </MailLayout>
</template>