import { acceptHMRUpdate, defineStore } from 'pinia'

export const useFavoritesPiniaStore = defineStore('favorites', 
{
    state: () => {
        return {
          favs: new Map(),
          activeFav: '',
        }
      },
    actions:{
        setNewFav(user :any) {
            this.favs.set(user.login, user)
        },
        removeFav(user :any) {
          if(this.favs.has(user.login)) 
            this.favs.delete(user.login)
        },
        setActiveFavorite(user: string) {
            this.activeFav = user
        },
        getFavorite(userLogin: string) {
            if (this.favs.has(userLogin))
              return this.favs.get(userLogin)
        },
        createFromStorages(storagedFavs: string) {
            const data = JSON.parse(storagedFavs)
            data.map((favorito: any) => this.setNewFav(favorito))
        },
        getStorageData() {
            return JSON.stringify(Array.from(this.favs.values()))
        },
    },
    getters: {
        getSize: (state) => {
            return state.favs.size
        },
        areFavs: (state) => {
            return (state.favs.size > 0)
        },
        isFav: (state) =>{
            return (username : string)  =>  state.favs.has(username)
        },
    }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useFavoritesPiniaStore, import.meta.hot))
