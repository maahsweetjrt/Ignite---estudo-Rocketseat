import fs from 'node:fs'

const dataBasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor(){
        fs.promises.readFile(dataBasePath, 'utf-8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist(){
        fs.writeFile(dataBasePath, JSON.stringify(this.#database), (e) => {console.log(e)})
    }
    
    select(table, search){
        let data = this.#database[table] ?? []

        if(search){
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].includes(value)
                })
            })
        }

        return data
    }

    insert(table, data){
        if (Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist();
        return data;
    }

    update(table, id, data){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if(rowIndex > -1){
            this.#database[table][rowIndex]= {id, ...data}
            this.#persist()
        }
    }

    delete(table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if(rowIndex > -1){
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }
}