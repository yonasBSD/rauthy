<script lang="ts">
    import Button from "$lib5/button/Button.svelte";
    import Input from "$lib5/form/Input.svelte";
    import {PATTERN_ROLE_SCOPE} from "$utils/patterns";
    import Form from "$lib5/form/Form.svelte";
    import {fetchPost} from "$api/fetch";
    import {useI18n} from "$state/i18n.svelte";
    import {useI18nAdmin} from "$state/i18n_admin.svelte";
    import type {RoleRequest, RoleResponse} from "$api/types/roles.ts";

    let {
        roles,
        onSave,
    }: {
        roles: RoleResponse[],
        onSave: (id: string) => void,
    } = $props();

    let t = useI18n();
    let ta = useI18nAdmin();

    let ref: undefined | HTMLInputElement = $state();

    let err = $state('');
    let name = $state('');

    $effect(() => {
        requestAnimationFrame(() => {
            ref?.focus();
        });
    });

    async function onSubmit(form: HTMLFormElement, params: URLSearchParams) {
        if (roles.find(r => r.name === name)) {
            err = ta.common.nameExistsAlready;
            return;
        }
        err = '';

        let payload: RoleRequest = {
            role: name,
        };
        let res = await fetchPost<RoleResponse>(form.action, payload);
        if (res.body) {
            onSave(res.body.id);
        } else {
            err = res.error?.message || 'Error';
        }
    }
</script>

<div class="container">
    <Form action="/auth/v1/roles" {onSubmit}>
        <Input
                bind:ref
                bind:value={name}
                autocomplete="off"
                label={ta.roles.name}
                placeholder={ta.roles.name}
                required
                pattern={PATTERN_ROLE_SCOPE}
        />

        <Button type="submit">
            {t.common.save}
        </Button>

        {#if err}
            <div class="err">
                {err}
            </div>
        {/if}
    </Form>
</div>

<style>
    .container {
        min-height: 7rem;
        text-align: left;
    }
</style>
