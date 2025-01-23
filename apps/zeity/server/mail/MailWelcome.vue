<script setup lang="ts">
import { Section, Button, Text, Heading } from '@vue-email/components';

import MailLayout from './MailLayout.vue';

defineProps({
    name: {
        type: String,
        required: true
    },
    verificationLink: {
        type: String,
        default: ''
    },
})
</script>

<template>
    <MailLayout preview="Welcome to zeity">

        <Heading as="h1" class="text-xl">Welcome to zeity</Heading>

        <Text>Hi, {{ name }}!</Text>
        <Text>
            Thank you for signing up for Zeity. We're excited to have you on board!
        </Text>

        <Text v-if="verificationLink">
            To get started, please verify your email address by clicking the button below:
        </Text>
        <Section v-if="verificationLink" class="text-center">
            <Button v-if="verificationLink" :href="verificationLink" referrerpolicy="strict-origin"
                class="rounded-md font-medium inline-flex items-center focus:outline-hidden transition-colors px-2.5 py-1.5 m-auto text-sm gap-1.5 justify-center text-text bg-primary-400 hover:bg-primary/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                Verify Your Account
            </Button>
        </Section>

        <Text>
            If you did not sign up for Zeity, please ignore this email.
        </Text>

    </MailLayout>
</template>