export interface SearchParams<T> {
    list: T[],
    filterList: (filteredList: T[]) => void
}