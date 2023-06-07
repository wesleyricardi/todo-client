
export default function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, callback?: (e: HTMLElementTagNameMap[K]) => void, childrens?: HTMLElement[] | HTMLElement): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName)
    callback && callback(element)
    if (childrens) {
        if (Array.isArray(childrens)) childrens.map(children => element.appendChild(children))
        else element.appendChild(childrens)
    }
    return element
}