import type {Data} from '../../../core/types'
import {encryptData, decryptData} from '../../../core/encryption'
import {TemplateStorage} from '../../../core/storages'
import {StorageStatus} from '../../../core/types'
import {deletedAccountString} from "../../../core/constants";

export class DefaultStorage extends TemplateStorage {
    public async getData(PIN: string): Promise<[StorageStatus, Data | null]> {
        const data = localStorage.getItem('data')
        if (data === null) return [StorageStatus.NoData, null]
        return [StorageStatus.Success, await decryptData(PIN, data)]
    }

    public async setData(PIN: string, data: Data): Promise<StorageStatus> {
        const encryptedData = await encryptData(PIN, data)
        localStorage.setItem('data', encryptedData)
        return StorageStatus.Success
    }

    public async addAccount(PIN: string, name: string, secret: string): Promise<StorageStatus> {
    let [status, data] = await this.getData(PIN)
        if (!(status === StorageStatus.Success)) return status

        if (data!.some((account) => (account.key !== deletedAccountString) && (account.name === name))) {
            return StorageStatus.Duplicate
        }

        data = data!
            .filter((account) => !((account.key === deletedAccountString) && (account.name === name)))
        data!.push({name: name, key: secret})

        return await this.setData(PIN, data!)
    }

    public async removeAccount(PIN: string, name: string): Promise<StorageStatus> {
        const [status, data] = await this.getData(PIN)
        if (!(status === StorageStatus.Success)) return status
        const newData: Data = data!.filter((account) => account.name !== name)
        return await this.setData(PIN, newData)
    }

    public verifyLocalData(): boolean {
        return localStorage.getItem('data') !== null
    }

    public clearLocalData(): StorageStatus {
        localStorage.removeItem('data')
        return StorageStatus.Success
    }

    public initLocalData(PIN: string): StorageStatus {
        let _ = this.setData(PIN, []);
        return StorageStatus.Success
    }
}
