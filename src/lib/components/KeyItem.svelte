<script lang="ts">
    export let key: CryptoKeyDB;
</script>

<a href="/key/?key={key.keyId}">
    <div>
        <h3>
            {key.name}
            {#if key.secretKey}
                Secret
            {/if}
            {#if key.publicKey}
                Clé publique
            {/if}
            {#if key.privateKey}
                Clé privée
            {/if}
        </h3>
    </div>
</a>
