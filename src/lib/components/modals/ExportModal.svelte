<script lang="ts">
    import { exportKey } from '$lib/crypto';
    import { autoResetStoreWithTimer } from '$lib/stores';
    import Modal from './Modal.svelte';
    import Notecard from '../Notecard.svelte';
    import CopyButton from '../CopyButton.svelte';
    ('@hmr:keep-all');

    export let cryptoKey: CryptoKey;
    export let exportModalOpened: boolean;
    let exportedText: string;
    let doExportKey = false;
    let [exportDisabled, exportDisabledTime] = autoResetStoreWithTimer(false, 3);

    let formatter = new Intl.RelativeTimeFormat(undefined, { style: 'short' });

    $: type = cryptoKey.type;
    $: if (exportModalOpened == false) {
        resetExportedText();
    } else {
        if (!doExportKey) doExportKey = type == 'public';

        if (!doExportKey) {
            $exportDisabled = true;
        }
    }
    $: if (doExportKey) {
        _exportKey();
    }

    function resetExportedText() {
        doExportKey = false;

        let beacon = ('*'.repeat(64) + '\n').repeat(3);
        let loadingText = ' CHARGEMENT ';
        const lengthToAdd = Math.floor((64 - loadingText.length) / 2);
        exportedText =
            beacon +
            '*'.repeat(lengthToAdd) +
            loadingText +
            '*'.repeat(64 - lengthToAdd - loadingText.length) +
            '\n' +
            beacon;
    }

    async function _exportKey() {
        exportedText = await exportKey(cryptoKey);
    }
</script>

<Modal bind:opened={exportModalOpened}>
    <span slot="title" class="text-ellipsis whitespace-nowrap">Exporter</span>
    <h3 class="h3 mb-2">
        {type == 'secret' ? 'Secret' : type == 'public' ? 'Clé publique' : 'Clé privée'} :
    </h3>
    {#if type == 'private' || type == 'secret'}
        <Notecard type="error">
            <p class="text-justify">
                <b>Attention :</b>
                {#if type == 'private'}
                    Une clé privée est strictement personnelle et doit rester secrète. Elle ne doit
                    être transféré <u>en aucun cas</u> à une personne tierce. En cas de fuite de la clé
                    privée, la paire de clé ne doit plus être utilisé (suppresion recommandé). Elle doit
                    donc être stocker de manière sécurisé (encryption fortement recomandé). En cliquant
                    sur le bouton ci dessous, vous allez exporter la clé dans un format lisible pour
                    tout le monde, ceci est fortement déconseillé.
                {/if}
            </p>
            <!-- TODO type == 'secret' -->
        </Notecard>
    {/if}

    {#if doExportKey}
        <pre
            class="m-auto w-max  max-w-full rounded-lg bg-gray-200 px-3 py-2 dark:bg-gray-700">{exportedText}</pre>
        <CopyButton text={exportedText} />
    {:else}
        <button
            class="button-coloured bg-red-500 ring-red-500 mx-auto block"
            disabled={$exportDisabled}
            on:click={() => (doExportKey = true)}
            >Exporter{$exportDisabled
                ? ' ' + formatter.format($exportDisabledTime, 'second') + '...'
                : ''}</button
        >
    {/if}
    <div class="flex flex-row-reverse">
        <button class="button-text" on:click={() => (exportModalOpened = false)}>Fermer</button>
    </div>
</Modal>
