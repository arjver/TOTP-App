<script lang="ts">
    import qrIcon from '../../assets/qr-code-outline.svg'
    import plusIcon from '../../assets/add-outline.svg'
    import trashIcon from '../../assets/trash-outline.svg'
    import editIcon from '../../assets/create-outline.svg'
    import helpIcon from '../../assets/help-circle-outline.svg'

    import {currentName, ModalShown, modalShown, storage} from '../../helpers/stores'
    import IconButton from "../../components/IconButton.svelte";
    import { StorageStatus } from '../../../../core/types'

    let { PIN }: { PIN: string } = $props()

    async function addAccount() {
        const name = prompt('Enter account name')
        if (!name) return
        const [status, data] = await $storage.getData(PIN)
        if (status === StorageStatus.Success) {
            const accounts = data!
            if (accounts.find(account => account.name === name)) {
                alert('Account with that name already exists')
                return
            }
        }

        const key = prompt('Enter account key')
        if (!key) return
        $storage.addAccount(PIN, name, key)
        window.location.reload()
    }

    async function removeAccount() {
        // cannot simply remove account from storage because it gets added back on sync
        if (confirm('Delete selected account?')) {
            await $storage.removeAccount(PIN, $currentName)
            await $storage.addAccount(PIN, $currentName, 'deleteddeleteddeleted')
            window.location.reload()
        }
    }

    async function editAccount() {
        if (confirm('Edit selected account?')) {
            const key = prompt('Enter new account key')
            if (!key) return
            await $storage.removeAccount(PIN, $currentName)
            await $storage.addAccount(PIN, $currentName, key!)
            window.location.reload()
        }
    }
</script>

<div>
    <IconButton action={() => $modalShown = ModalShown.Help} src={helpIcon} alt="help"/>
    <IconButton action={removeAccount} src={trashIcon} alt="delete"/>
    <IconButton action={editAccount} src={editIcon} alt="edit"/>
    <IconButton action={() => $modalShown = ModalShown.QRScan} src={qrIcon} alt="scan"/>
    <IconButton action={addAccount} src={plusIcon} alt="add"/>

    <!-- TODO verify data is as expected when syncing after editing/deleting -->
</div>

<style>
    div {
        display: block;
        padding-top: 15px;
        width: 100%;
        height: 38px;
        background-color: var(--accent-background-color);
    }
</style>
